// Precomputes land sample points for the particle globe (lat/lng pairs).
import fs from 'node:fs';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json', 'utf8'));
const land = feature(topo, topo.objects.land);
const N = 26000; // fibonacci samples over the sphere; ~29% land
const pts = [];
const golden = Math.PI * (3 - Math.sqrt(5));
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const t = golden * i;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((Math.atan2(Math.sin(t) * r, Math.cos(t) * r) * 180) / Math.PI);
  if (geoContains(land, [lng, lat])) pts.push(Math.round(lat * 10) / 10, Math.round(lng * 10) / 10);
}
fs.writeFileSync('src/content/globe-points.json', JSON.stringify(pts));
console.log('land points', pts.length / 2);
