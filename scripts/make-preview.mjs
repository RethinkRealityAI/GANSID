// Builds a self-contained preview bundle (relative asset paths) from `out/`
// so the static export can be published as a claude.ai Artifact for review.
import fs from 'node:fs';
import path from 'node:path';

const src = 'out';
const dst = process.argv[2] ?? 'preview';
const pageFile = process.argv[3] ?? 'index.html';
const title = process.argv[4] ?? 'GANSID Website Draft';
// Asset folders served from public/ that must become relative on the artifact host.
const ASSET_DIRS = ['brand', 'photos', 'courses'];
const relAssets = (s) => ASSET_DIRS.reduce((acc, d) => acc.replace(new RegExp(`(["'`+'`'+`(])/${d}/`, 'g'), `$1./${d}/`), s);
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(dst)) {
  if (f.endsWith('.js')) {
    const s = fs.readFileSync(f, 'utf8');
    fs.writeFileSync(f, relAssets(s.replaceAll('"/_next/', '"./next/').replaceAll('/_next/', '/next/').replaceAll('\uFFFD', '\\uFFFD')));
  }
}
let html = fs.readFileSync(path.join(dst, pageFile), 'utf8');
html = html.replaceAll('/_next/', './_next/').replaceAll('"/brand/', '"./brand/').replaceAll('\\"/brand/', '\\"./brand/');
html = relAssets(html.replaceAll('./_next/', './next/'));
// The artifact host reserves top-level names starting with "_".
fs.renameSync(path.join(dst, '_next'), path.join(dst, 'next'));
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta charSet="utf-8"\/>/, '').replace(/<meta name="viewport"[^>]*\/>/, '');
const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
const page = `<title>${title}</title>\n${head}\n${body}`;
fs.writeFileSync(path.join(dst, 'index.html'), page);
// drop other pages and files the preview never needs
for (const f of walk(dst)) if (f.endsWith('.html') && path.relative(dst, f) !== 'index.html') fs.rmSync(f);
for (const f of walk(path.join(dst, 'next'))) if (f.endsWith('.woff') || (f.endsWith('.woff2') && !/-latin-[0-9]|manrope-latin-/.test(f))) fs.rmSync(f);
for (const f of ['404.html', '_not-found', '404', ...fs.readdirSync(dst).filter((n) => n.startsWith('__next') || n.endsWith('.txt'))]) fs.rmSync(path.join(dst, f), { recursive: true, force: true });
console.log('preview written to', dst);
