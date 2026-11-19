import * as THREE from 'three';

export type GlobePin = { id: string; lat: number; lng: number };
export type PinScreen = { id: string; x: number; y: number; visible: boolean; depth: number };

const R = 1;
function toVec(lat: number, lng: number, r = R) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/**
 * Particle globe: land as glowing points, animated arcs between GANSID places,
 * drag to spin with inertia, auto-rotates, and can turn to face a place.
 */
export class GlobeStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  private globe = new THREE.Group();
  private pointsMat: THREE.ShaderMaterial;
  private arcMats: THREE.ShaderMaterial[] = [];
  private pinMeshes: THREE.Mesh[] = [];
  private raf = 0;
  private running = false;
  private errors = 0;
  private rotY = -1.9;
  private rotX = 0.32;
  private velY = 0;
  private targetY: number | null = null;
  private targetX: number | null = null;
  private dragging = false;
  private last = { x: 0, y: 0 };
  private idleUntil = 0;
  private clock = new THREE.Clock();
  private ro: ResizeObserver;
  onPins?: (p: PinScreen[]) => void;

  constructor(
    private canvas: HTMLCanvasElement,
    land: number[],
    private pins: GlobePin[],
    private hub: string,
    private reduced: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.camera.position.set(0, 0, 4.6);
    this.scene.add(this.globe);

    // --- land points
    const n = land.length / 2;
    const pos = new Float32Array(n * 3);
    const rnd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = toVec(land[i * 2], land[i * 2 + 1]);
      pos.set([v.x, v.y, v.z], i * 3);
      rnd[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('rnd', new THREE.BufferAttribute(rnd, 1));
    this.pointsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPx: { value: this.renderer.getPixelRatio() } },
      vertexShader: /* glsl */ `
        attribute float rnd; uniform float uTime; uniform float uPx;
        varying float vA; varying float vR;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vec3 n = normalize(normalMatrix * position);
          float facing = dot(n, normalize(-mv.xyz));
          vA = smoothstep(-0.15, 0.55, facing);
          vR = rnd;
          float tw = 0.75 + 0.25 * sin(uTime * (0.6 + rnd * 1.6) + rnd * 40.0);
          gl_PointSize = (3.4 + rnd * 1.8) * tw * uPx * (3.2 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA; varying float vR;
        void main(){
          vec2 c = gl_PointCoord - 0.5; float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          vec3 red = vec3(0.86, 0.17, 0.2); vec3 coral = vec3(1.0, 0.55, 0.45);
          vec3 col = mix(red, coral, vR * 0.6);
          gl_FragColor = vec4(col, a * (0.12 + 0.88 * vA));
        }`,
    });
    this.globe.add(new THREE.Points(g, this.pointsMat));

    // --- dark core so back points read as depth
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x140b0d, transparent: true, opacity: 0.88 }),
    );
    this.globe.add(core);

    // --- atmosphere rim
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.18, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(vN, vV)), 3.0); gl_FragColor = vec4(0.85,0.15,0.18, f*0.55); }`,
      }),
    );
    this.scene.add(atmo);

    // --- arcs from hub to each place, with a travelling glow
    const hubPin = pins.find((p) => p.id === hub)!;
    const a0 = toVec(hubPin.lat, hubPin.lng);
    pins.forEach((p, idx) => {
      if (p.id === hub) return;
      const b = toVec(p.lat, p.lng);
      const mid = a0.clone().add(b).multiplyScalar(0.5);
      const lift = 1 + a0.distanceTo(b) * 0.38;
      mid.normalize().multiplyScalar(R * lift);
      const curve = new THREE.QuadraticBezierCurve3(a0, mid, b);
      const geo = new THREE.TubeGeometry(curve, 80, 0.0045, 6, false);
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uOff: { value: idx * 0.37 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: `uniform float uTime; uniform float uOff; varying vec2 vUv;
          void main(){ float t = fract(uTime*0.22 + uOff); float d = abs(vUv.x - t);
            float head = smoothstep(0.14, 0.0, d); float base = 0.18;
            gl_FragColor = vec4(mix(vec3(0.9,0.3,0.3), vec3(1.0,0.85,0.8), head), base + head*0.9); }`,
      });
      this.arcMats.push(mat);
      this.globe.add(new THREE.Mesh(geo, mat));
    });

    // --- pin heads
    pins.forEach((p) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      m.position.copy(toVec(p.lat, p.lng, R * 1.005));
      m.userData.id = p.id;
      this.pinMeshes.push(m);
      this.globe.add(m);
    });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.bind();
  }

  private resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private bind() {
    const c = this.canvas;
    c.style.touchAction = 'pan-y';
    c.addEventListener('pointerdown', (e) => {
      this.dragging = true;
      this.targetY = this.targetX = null;
      this.last = { x: e.clientX, y: e.clientY };
      c.setPointerCapture(e.pointerId);
    });
    c.addEventListener('pointermove', (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.last.x;
      const dy = e.clientY - this.last.y;
      this.last = { x: e.clientX, y: e.clientY };
      this.velY = dx * 0.005;
      this.rotY += dx * 0.005;
      this.rotX = Math.max(-0.9, Math.min(0.9, this.rotX + dy * 0.003));
      this.idleUntil = performance.now() + 4000;
    });
    const up = () => (this.dragging = false);
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
  }

  /** Turn the globe so a place faces the viewer. */
  focus(id: string) {
    const p = this.pins.find((x) => x.id === id);
    if (!p) return;
    // rotation that brings (lat,lng) to the +z axis
    const want = -((p.lng + 180) * Math.PI) / 180 + Math.PI / 2;
    let d = want - this.rotY;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    this.targetY = this.rotY + d;
    this.targetX = (p.lat * Math.PI) / 180 * 0.85;
    this.idleUntil = performance.now() + 7000;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      try {
        this.frame();
        this.errors = 0;
      } catch (e) {
        if (++this.errors > 5) {
          this.stop();
          console.error('globe stopped', e);
        }
      }
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;
    const now = performance.now();
    if (this.targetY !== null) {
      this.rotY += (this.targetY - this.rotY) * Math.min(1, dt * 3.2);
      if (this.targetX !== null) this.rotX += (this.targetX - this.rotX) * Math.min(1, dt * 3.2);
      if (Math.abs(this.targetY - this.rotY) < 0.001) this.targetY = null;
    } else if (!this.dragging) {
      this.rotY += this.velY;
      this.velY *= 0.94;
      if (now > this.idleUntil && !this.reduced) this.rotY += dt * 0.08;
      if (now > this.idleUntil) this.rotX += (0.32 - this.rotX) * dt * 0.6;
    }
    this.globe.rotation.set(this.rotX, this.rotY, 0);
    this.pointsMat.uniforms.uTime.value = t;
    this.arcMats.forEach((m) => (m.uniforms.uTime.value = this.reduced ? 1.2 : t));
    this.renderer.render(this.scene, this.camera);

    if (this.onPins) {
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      const camDir = new THREE.Vector3();
      const out: PinScreen[] = this.pinMeshes.map((m) => {
        const wp = m.getWorldPosition(new THREE.Vector3());
        const facing = wp.clone().normalize().dot(camDir.copy(this.camera.position).normalize());
        const p = wp.clone().project(this.camera);
        return { id: m.userData.id, x: (p.x * 0.5 + 0.5) * w, y: (-p.y * 0.5 + 0.5) * h, visible: facing > 0.15, depth: facing };
      });
      this.onPins(out);
    }
  }

  dispose() {
    this.stop();
    this.ro.disconnect();
    this.renderer.dispose();
  }
}
