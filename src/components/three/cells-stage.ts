import * as THREE from 'three';

/** Biconcave red-cell profile (Evans–Fung), revolved into a lathe. */
function rbcGeometry() {
  const pts: THREE.Vector2[] = [];
  const N = 28;
  const h = (r: number) => Math.sqrt(Math.max(0, 1 - r * r)) * (0.207 + 2.003 * r * r - 1.123 * r ** 4) * 0.5;
  for (let i = 0; i <= N; i++) {
    const r = Math.sin((i / N) * (Math.PI / 2));
    pts.push(new THREE.Vector2(r, h(r)));
  }
  for (let i = N; i >= 0; i--) {
    const r = Math.sin((i / N) * (Math.PI / 2));
    pts.push(new THREE.Vector2(r, -h(r)));
  }
  const g = new THREE.LatheGeometry(pts, 48);
  g.computeVertexNormals();
  return g;
}

/** Crescent "sickled" cell: a partial torus, flattened. */
function sickleGeometry() {
  const g = new THREE.TorusGeometry(0.8, 0.17, 18, 64, Math.PI * 1.15);
  g.scale(1, 1, 0.55);
  g.rotateZ(-Math.PI * 0.075);
  return g;
}

type Cell = { pos: THREE.Vector3; vel: THREE.Vector3; rot: THREE.Euler; spin: THREE.Vector3; scale: number };

export class CellsStage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
  private rbc: THREE.InstancedMesh;
  private sickle: THREE.InstancedMesh;
  private cells: Cell[] = [];
  private sickles: Cell[] = [];
  private dummy = new THREE.Object3D();
  private raf = 0;
  private running = false;
  private errors = 0;
  private mouse = new THREE.Vector2();
  private look = new THREE.Vector2();
  private clock = new THREE.Clock();
  private ro: ResizeObserver;
  private scrollY = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private reduced: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    const bg = new THREE.Color(0x1a0507);
    this.scene.background = bg;
    this.scene.fog = new THREE.FogExp2(bg, 0.075);
    this.camera.position.set(0, 0, 8);

    this.scene.add(new THREE.HemisphereLight(0xffb3a8, 0x2a0306, 1.3));
    const key = new THREE.DirectionalLight(0xfff0ea, 2.6);
    key.position.set(4, 6, 8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5a4a, 3.2);
    rim.position.set(-6, -2, -4);
    this.scene.add(rim);

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xb3131c,
      roughness: 0.38,
      clearcoat: 0.6,
      clearcoatRoughness: 0.35,
      sheen: 0.6,
      sheenColor: new THREE.Color(0xff8a7a),
      emissive: 0x2a0204,
    });
    const sMat = mat.clone();
    sMat.color = new THREE.Color(0x8e1016);
    sMat.emissive = new THREE.Color(0x1a0102);

    const N = innerWidth < 700 ? 90 : 170;
    const S = innerWidth < 700 ? 10 : 18;
    this.rbc = new THREE.InstancedMesh(rbcGeometry(), mat, N);
    this.sickle = new THREE.InstancedMesh(sickleGeometry(), sMat, S);
    this.scene.add(this.rbc, this.sickle);
    for (let i = 0; i < N; i++) this.cells.push(this.spawn(true));
    for (let i = 0; i < S; i++) this.sickles.push(this.spawn(true));

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    addEventListener('pointermove', this.onMove, { passive: true });
    addEventListener('scroll', this.onScroll, { passive: true });
  }

  private onMove = (e: PointerEvent) => {
    this.mouse.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  };
  private onScroll = () => {
    this.scrollY = scrollY;
  };

  private spawn(initial: boolean): Cell {
    const z = initial ? -28 + Math.random() * 34 : -30 - Math.random() * 6;
    return {
      pos: new THREE.Vector3((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 13, z),
      vel: new THREE.Vector3(0.25 + Math.random() * 0.35, (Math.random() - 0.5) * 0.15, 1.1 + Math.random() * 1.2),
      rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      spin: new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.3),
      scale: 0.42 + Math.random() * 0.3,
    };
  }

  private resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
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
          console.error('cells stopped', e);
        }
      }
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private step(list: Cell[], mesh: THREE.InstancedMesh, dt: number) {
    const speed = this.reduced ? 0.25 : 1;
    list.forEach((c, i) => {
      c.pos.addScaledVector(c.vel, dt * speed);
      c.rot.x += c.spin.x * dt * speed;
      c.rot.y += c.spin.y * dt * speed;
      c.rot.z += c.spin.z * dt * speed;
      if (c.pos.z > 9 || c.pos.x > 13) list[i] = this.spawn(false);
      this.dummy.position.copy(list[i].pos);
      this.dummy.rotation.copy(list[i].rot);
      this.dummy.scale.setScalar(list[i].scale);
      this.dummy.updateMatrix();
      mesh.setMatrixAt(i, this.dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.step(this.cells, this.rbc, dt);
    this.step(this.sickles, this.sickle, dt);
    this.look.lerp(this.mouse, Math.min(1, dt * 2));
    this.camera.position.x = this.look.x * 0.9;
    this.camera.position.y = -this.look.y * 0.6 - this.scrollY * 0.002;
    this.camera.lookAt(0, -this.scrollY * 0.002, -10);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.ro.disconnect();
    removeEventListener('pointermove', this.onMove);
    removeEventListener('scroll', this.onScroll);
    this.renderer.dispose();
  }
}
