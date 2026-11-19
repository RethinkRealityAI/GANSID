/**
 * Imports the old WordPress site (the content-inventory scrape) into Payload as DRAFTS.
 *
 *   npx tsx scripts/import-wordpress.ts --dry-run
 *   npx tsx scripts/import-wordpress.ts --only=people,news
 *   npx tsx scripts/import-wordpress.ts --media-dir="C:/Users/…/GANSID-Website-Scrape"
 *
 * Options
 *   --dry-run            Parse, convert and match everything; write nothing.
 *   --only=a,b           Limit to some steps: regions, congress, partners, people, events,
 *                        galleries, news, redirects, menu. Later steps look up earlier ones
 *                        in the database, so run the full import once first.
 *   --media-dir=<path>   The scrape folder that holds raw/assets/ (assets.csv → local_file).
 *                        Images found there are uploaded to Media. Without it, images are
 *                        skipped and their old URL is recorded on the document instead.
 *   --inventory=<path>   The content-inventory folder (default: the project mount).
 *   --report=<file>      Also write the summary and problem list as Markdown.
 *
 * Rules: only facts that are in the scrape; nothing is published (editors review first);
 * safe to re-run (records are matched on their old URL, year, code or name and updated).
 * Schema changes are never pushed from here: run `npm run migrate` first.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { CollectionSlug, Payload } from 'payload';
import { normalizePath, sitePath, type SectionCollection } from '../src/lib/paths';
import { menuChildField } from '../src/globals/MainMenu';

// ---------------------------------------------------------------------------------------------
// Options and environment (env must be loaded before the Payload config is imported)
// ---------------------------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

const DRY = flag('dry-run');
const STEPS = ['regions', 'congress', 'partners', 'people', 'events', 'galleries', 'news', 'redirects', 'menu'] as const;
type Step = (typeof STEPS)[number];
const ONLY = opt('only')?.split(',').map((s) => s.trim()) as Step[] | undefined;
if (ONLY?.some((s) => !STEPS.includes(s))) {
  console.error(`--only accepts: ${STEPS.join(', ')}`);
  process.exit(1);
}
const runs = (step: Step) => !ONLY || ONLY.includes(step);
const INVENTORY = opt('inventory') ?? '/mnt/project-files/gansid-website/content-inventory/';
const MEDIA_DIR = opt('media-dir');
const REPORT = opt('report');

if (fs.existsSync('.env.local')) process.loadEnvFile('.env.local');
process.env.PAYLOAD_DB_PUSH = 'false';

const OLD_HOST = 'inheritedblooddisorders.world';
const OLD_ORIGIN = `https://${OLD_HOST}`;

// ---------------------------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------------------------

type Count = { created: number; updated: number; skipped: number };
const counts: Record<string, Count> = {};
const bump = (c: string, k: keyof Count) => {
  counts[c] ??= { created: 0, updated: 0, skipped: 0 };
  counts[c][k] += 1;
};
const problems: { area: string; item: string; note: string }[] = [];
const problem = (area: string, item: string, note: string) => problems.push({ area, item, note });

// ---------------------------------------------------------------------------------------------
// Scrape data
// ---------------------------------------------------------------------------------------------

type ScrapedPage = {
  url: string;
  path: string;
  kind: string;
  section: string;
  title: string;
  h1: string;
  meta_description: string | null;
  modified: string | null;
  categories: string[];
  images: { src: string; alt: string }[];
  documents: unknown[];
  embeds: unknown[];
  markdown: string;
};
type ScrapedPerson = { name: string; roles: string[]; photo: string | null; bio: string | null; source_urls: string[]; variants: unknown[] };
type NavItem = { label: string; href: string; children?: NavItem[] };

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(INVENTORY, file), 'utf8')) as T;
const pages = readJson<ScrapedPage[]>('content.json');
const pageByPath = new Map(pages.map((p) => [p.path, p]));
const page = (p: string) => {
  const found = pageByPath.get(p);
  if (!found) throw new Error(`Page ${p} is not in content.json`);
  return found;
};

/** assets.csv: old URL → file path relative to the scrape folder. */
const assetFiles = new Map<string, string>();
{
  const lines = fs.readFileSync(path.join(INVENTORY, 'assets.csv'), 'utf8').split(/\r?\n/).slice(1);
  for (const line of lines) {
    const cols = parseCsvLine(line);
    if (cols[4]) assetFiles.set(canonicalAssetUrl(cols[0]), cols[4]);
  }
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') (cur += '"'), i++;
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') out.push(cur), (cur = '');
    else cur += ch;
  }
  out.push(cur);
  return out;
}

function canonicalAssetUrl(u: string) {
  return u.trim().replace(/^http:\/\//, 'https://').split('?')[0];
}

/** WordPress thumbnails carry a -300x200 suffix; the original has none. */
const fullSize = (u: string) => canonicalAssetUrl(u).replace(/-\d{2,4}x\d{2,4}(?=\.[a-z0-9]+$)/i, '');

// ---------------------------------------------------------------------------------------------
// Markdown clean-up and conversion to Lexical
// ---------------------------------------------------------------------------------------------

const decodeEntities = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8216;|&lsquo;/g, '‘')
    .replace(/&#8220;|&ldquo;/g, '“')
    .replace(/&#8221;|&rdquo;/g, '”')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const normText = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[*_#`]/g, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();

type ImageRef = { src: string; alt: string };

/**
 * Removes scrape noise (Instagram feed widget, slider lists, WordPress admin notices,
 * Picflow credit, javascript: links, trailing rules), pulls images out into placeholders
 * and turns links to the old site into site-relative paths.
 */
function cleanMarkdown(md: string, opts: { dropLeadingHeading?: string } = {}) {
  let s = md.replace(/\r\n/g, '\n');
  const feed = s.indexOf('[![iblooddisorders]');
  if (feed >= 0) s = s.slice(0, feed);
  s = s.replace(/^\*\*Slider:\*\*\n(?:- .*\n?)*/m, '');
  s = s.replace(/^.*This error message is only visible to WordPress admins.*$/gm, '');
  s = s.replace(/^.*There has been a problem with your Instagram Feed.*$/gm, '');
  s = s.replace(/^Client gallery powered by \[Picflow\]\(https:\/\/picflow\.com\)\s*$/gm, '');
  s = s.replace(/\[([^\]]*)\]\(javascript:[^)]*\)/g, '');

  // YouTube feed plugin: each video is one big link (placeholder thumbnail + counters) followed by
  // its title. Keep what is real: title, the description the plugin used as alt text, and the link.
  let videos = 0;
  let privateVideos = 0;
  s = s.replace(
    /\[!\[([^\]]*)\]\([^)]*youtube-feed-pro[^)]*\)([\s\S]*?)\]\((https:\/\/www\.youtube\.com\/watch\?v=[\w-]+)\)(?:\s*\n\n(?!\[!\[)([^\n]+))?/g,
    (_m, alt: string, junk: string, url: string, title?: string) => {
      videos++;
      if (/This video is private/i.test(junk)) privateVideos++;
      return `\n\n${title ? `**${title.trim()}**\n\n` : ''}${alt.trim() ? `${alt.trim()}\n\n` : ''}[Watch on YouTube](${url})\n\n`;
    },
  );

  const images: ImageRef[] = [];
  const placeholder = (alt: string, src: string) => {
    images.push({ alt: decodeEntities(alt).trim(), src: src.trim() });
    return `\n\n@@IMG${images.length - 1}@@\n\n`;
  };
  // Linked image: [![alt](src)](href) → the image (the link usually just opened the file).
  s = s.replace(/\[!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, src) => placeholder(alt, src));
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, src) => placeholder(alt, src));
  // Bold markers left empty after an image was pulled out of them.
  s = s.replace(/\*{4,}/g, '').replace(/^\*\*\s*$/gm, '');

  // Links back to the old site become site paths (rewritten again later if a redirect exists).
  s = s.replace(/\]\(https?:\/\/(?:www\.)?inheritedblooddisorders\.world(\/[^)\s]*)?((?:\s+"[^"]*")?)\)/g, (_m, p = '/', title) =>
    /\/wp-content\//.test(p) ? `](${OLD_ORIGIN}${p}${title})` : `](${p}${title})`,
  );
  // WordPress put the link text in the title attribute as "http://Some Text"; drop those titles.
  s = s.replace(/\]\(([^)\s]+)\s+"http:\/\/[^"]*"\)/g, ']($1)');

  s = decodeEntities(s);

  if (opts.dropLeadingHeading) {
    const want = normText(opts.dropLeadingHeading);
    s = s.replace(/^\s*#{1,6}\s+(.+)\n/, (line, text) => (normText(text) === want ? '' : line));
  }
  s = s.replace(/(\n\s*---\s*)+\s*$/g, '').replace(/\n{3,}/g, '\n\n').trim();
  return { markdown: s, images, videos, privateVideos };
}

type LexicalNode = { type: string; children?: LexicalNode[]; text?: string; [k: string]: unknown };
type LexicalDoc = { root: { children: LexicalNode[]; [k: string]: unknown } };

let toLexical: (md: string) => LexicalDoc;

const nodeText = (n: LexicalNode): string => (n.text ?? '') + (n.children ?? []).map(nodeText).join('');

/**
 * Converts cleaned Markdown and swaps each image placeholder for an upload node (when the
 * file was uploaded) or a visible "image from the old site" link (when it was not), so
 * editors can see what still needs uploading.
 */
function markdownToRichText(md: string, images: ImageRef[], uploaded: Map<number, number>) {
  const doc = toLexical(md);
  const out: LexicalNode[] = [];
  for (const node of doc.root.children) {
    const m = node.type === 'paragraph' ? /^@@IMG(\d+)@@$/.exec(nodeText(node).trim()) : null;
    if (!m) {
      out.push(node);
      continue;
    }
    const i = Number(m[1]);
    const mediaId = uploaded.get(i);
    if (mediaId !== undefined) {
      out.push({ type: 'upload', version: 3, format: '', fields: null, id: objectId(), relationTo: 'media', value: mediaId });
    } else if (images[i]) {
      const url = fullSize(images[i].src);
      out.push(paragraphWithLink(`Image from the old site${images[i].alt ? `: ${images[i].alt}` : ''}`, url));
    }
  }
  doc.root.children = out.filter((n) => !(n.type === 'paragraph' && !nodeText(n).trim() && !(n.children ?? []).length));
  return doc;
}

const objectId = () => crypto.randomBytes(12).toString('hex');

function paragraphWithLink(text: string, url: string): LexicalNode {
  return {
    type: 'paragraph',
    version: 1,
    format: '',
    indent: 0,
    direction: null,
    textFormat: 0,
    textStyle: '',
    children: [
      {
        type: 'link',
        version: 3,
        format: '',
        indent: 0,
        direction: null,
        id: objectId(),
        fields: { linkType: 'custom', newTab: true, url },
        children: [{ type: 'text', version: 1, text, format: 2, detail: 0, mode: 'normal', style: '' }],
      },
    ],
  };
}

/** Rewrites internal links in rich text to their new home once the redirect table is known. */
function rewriteLinks(doc: LexicalDoc, redirectTo: Map<string, string>, area: string, item: string) {
  let unresolved = 0;
  const walk = (n: LexicalNode) => {
    if (n.type === 'link') {
      const fields = n.fields as { url?: string } | undefined;
      const url = fields?.url;
      if (url && url.startsWith('/')) {
        const target = redirectTo.get(normalizePath(url));
        if (target) fields!.url = target;
        else unresolved++;
      }
    }
    n.children?.forEach(walk);
  };
  doc.root.children.forEach(walk);
  if (unresolved) problem(area, item, `${unresolved} link(s) to old-site pages that have no new home yet (kept as /old-path; they will work once a redirect or page exists).`);
}

// ---------------------------------------------------------------------------------------------
// Payload helpers
// ---------------------------------------------------------------------------------------------

let payload: Payload;
const ctx = { disableRevalidate: true };
let dryId = 0;

/** Create or update a draft, matched on `where`. Returns the id (a fake one in a dry run). */
async function upsert(collection: CollectionSlug, label: string, where: Record<string, unknown>, data: Record<string, unknown>, drafts = true) {
  const found = await payload.find({ collection, where: where as never, limit: 2, depth: 0, overrideAccess: true, pagination: false });
  if (found.docs.length > 1) problem(collection, label, 'More than one existing record matched; updated the first.');
  const existing = found.docs[0] as { id: number } | undefined;
  if (DRY) {
    bump(collection, existing ? 'updated' : 'created');
    return existing?.id ?? --dryId;
  }
  const body = (drafts ? { ...data, _status: 'draft' } : data) as never;
  if (existing) {
    await payload.update({ collection, id: existing.id, data: body, draft: drafts, overrideAccess: true, context: ctx });
    bump(collection, 'updated');
    return existing.id;
  }
  const doc = await payload.create({ collection, data: body, draft: drafts, overrideAccess: true, context: ctx });
  bump(collection, 'created');
  return (doc as { id: number }).id;
}

async function findId(collection: CollectionSlug, where: Record<string, unknown>) {
  const res = await payload.find({ collection, where: where as never, limit: 1, depth: 0, overrideAccess: true });
  return (res.docs[0] as { id: number } | undefined)?.id;
}

/** Keeps slugs unique within this import and against existing records of other items. */
const usedSlugs = new Map<string, Set<string>>();
async function uniqueSlug(collection: CollectionSlug, base: string, ownWhere: Record<string, unknown>) {
  const ownId = await findId(collection, ownWhere);
  const used = usedSlugs.get(collection) ?? new Set<string>();
  usedSlugs.set(collection, used);
  const root = slugify(base) || 'item';
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    if (used.has(candidate)) continue;
    const holder = await findId(collection, { slug: { equals: candidate } });
    if (holder !== undefined && holder !== ownId) continue;
    used.add(candidate);
    return candidate;
  }
}

const slugify = (input: string) =>
  input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);

/** Uploads one image (looked up in assets.csv) if --media-dir was given. Re-uses earlier uploads. */
const uploadCache = new Map<string, number | null>();
async function uploadImage(src: string, alt: string, area: string, item: string): Promise<number | null> {
  if (!MEDIA_DIR) return null;
  const want = [fullSize(src), canonicalAssetUrl(src)];
  const key = want[0];
  if (uploadCache.has(key)) return uploadCache.get(key)!;
  let file: string | undefined;
  for (const u of want) {
    const rel = assetFiles.get(u);
    if (!rel) continue;
    const candidates = [path.join(MEDIA_DIR, rel), path.join(MEDIA_DIR, rel.replace(/^raw[\\/]assets[\\/]/, ''))];
    file = candidates.find((c) => fs.existsSync(c));
    if (file) break;
  }
  if (!file) {
    problem(area, item, `Image not found under --media-dir: ${key}`);
    uploadCache.set(key, null);
    return null;
  }
  const filename = path.basename(file);
  const existing = await findId('media', { filename: { equals: filename } });
  if (existing !== undefined) {
    uploadCache.set(key, existing);
    return existing;
  }
  if (DRY) {
    bump('media', 'created');
    uploadCache.set(key, --dryId);
    return dryId;
  }
  const doc = await payload.create({ collection: 'media', data: { alt } as never, filePath: file, overrideAccess: true, context: ctx });
  bump('media', 'created');
  uploadCache.set(key, (doc as { id: number }).id);
  return (doc as { id: number }).id;
}

/** An alt text is only kept when it describes something (not a file name or "26"). */
const meaningfulAlt = (alt: string) => {
  const a = alt.trim();
  if (!a || a.length < 4) return false;
  if (/^[\w-]+\.(png|jpe?g|webp|gif)$/i.test(a)) return false;
  if (/^(img|image|dsc|pxl|photo)[\s_-]*\d+/i.test(a)) return false;
  return /[a-z]{3}/i.test(a);
};

async function uploadInline(images: ImageRef[], context: string, area: string, item: string) {
  const uploaded = new Map<number, number>();
  for (const [i, img] of images.entries()) {
    const id = await uploadImage(img.src, meaningfulAlt(img.alt) ? img.alt : `Image from "${context}"`, area, item);
    if (id !== null) uploaded.set(i, id);
  }
  return uploaded;
}

const oldUrl = (p: string) => `${OLD_ORIGIN}${p}`;
const day = (iso: string) => `${iso}T12:00:00.000Z`;

// Every old path → new path collected while importing; becomes the Redirects table.
const redirectTo = new Map<string, string>();
function addRedirect(fromUrlOrPath: string, to: string, area: string) {
  const from = normalizePath(fromUrlOrPath);
  if (from === '/' || from === normalizePath(to)) return;
  const prev = redirectTo.get(from);
  if (prev && prev !== to) {
    problem(area, from, `Old address points to two new homes (${prev} and ${to}); kept ${prev}.`);
    return;
  }
  redirectTo.set(from, to);
}
const route = (c: SectionCollection, slug: string) => sitePath(c, slug);

// ---------------------------------------------------------------------------------------------
// Facts that are not in a structured field of the scrape. Each is quoted from a page.
// ---------------------------------------------------------------------------------------------

/** /regions-of-the-gansid lists eight regions; codes are given for the WHO-based ones only. */
const REGIONS = [
  { name: 'African Region', code: 'AFR', match: 'African Region (AFR)', legacy: ['/africa-region-afr'] },
  { name: 'Americas – North', code: null, match: 'Americas-North', legacy: [] },
  { name: 'Americas – Central and South', code: null, match: 'Americas- Central and South', legacy: [] },
  { name: 'Caribbean', code: null, match: 'Caribbean', legacy: [] },
  { name: 'South-East Asian Region', code: 'SEAR', match: 'South-East Asian Region (SEAR)', legacy: ['/southeast-asia-region-sear'] },
  { name: 'European Region', code: 'EUR', match: 'European Region (EUR)', legacy: [] },
  { name: 'Eastern Mediterranean Region', code: 'EMR', match: 'Eastern Mediterranean Region (EMR)', legacy: [] },
  { name: 'Western Pacific Region', code: 'WPR', match: 'Western Pacific Region (WPR)', legacy: [] },
];

/** How board members' name suffixes on /board-of-directors map to the regions above. */
const REGION_SUFFIXES: Record<string, string> = {
  'european region': 'European Region',
  'southeast asia region': 'South-East Asian Region',
  'south east asian region': 'South-East Asian Region',
  'eastern mediterranean region': 'Eastern Mediterranean Region',
  'americas north region': 'Americas – North',
  'african region': 'African Region',
  'americas latin america': 'Americas – Central and South',
};

const COUNTRY_SUFFIXES = new Set([
  'usa', 'canada', 'brazil', 'holland', 'uk', 'india', 'thailand', 'ghana', 'france', 'nigeria', 'tanzania',
  'south africa', 'venezuela', 'lebanon', 'jamaica', 'grenada', 'kuwait', 'italy', 'bahrain',
]);
const COUNTRY_LABEL: Record<string, string> = { usa: 'USA', uk: 'UK' };

type CongressFact = {
  year: number;
  number: number;
  format: 'virtual' | 'in-person';
  theme?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  city?: string;
  country?: string;
  aboutFrom: string;
  aboutUntil?: string;
  legacy: string[];
};
const CONGRESSES: CongressFact[] = [
  {
    // /gansid-congress-2023: "the inaugural GANSID Congress 2023", "delivered via a virtual format",
    // theme "There is Power in the Collective", "join us on October 20-21st, 2023".
    year: 2023, number: 1, format: 'virtual', theme: 'There is Power in the Collective',
    startDate: '2023-10-20', endDate: '2023-10-21', aboutFrom: '/about-the-congress',
    legacy: ['/gansid-congress-2023', '/inaugural-congress-2023', '/about-the-congress', '/about-the-gansids-global-gathering', '/speakers-panelists-and-moderators', '/gathering-agenda'],
  },
  {
    // /congress-2024: "the 2nd Congress", "The Congress will be virtual, over two days." No dates on the page.
    year: 2024, number: 2, format: 'virtual', aboutFrom: '/congress-2024',
    legacy: ['/congress-2024', '/why-attend-congress-2024', '/speakers-congress-2024'],
  },
  {
    // /congress-2025: "3rd International Congress … on November 14–15, 2025"; /about-the-congress-2025: "fully virtual".
    year: 2025, number: 3, format: 'virtual', startDate: '2025-11-14', endDate: '2025-11-15',
    aboutFrom: '/congress-2025', aboutUntil: '## Sponsors',
    legacy: ['/congress-2025', '/about-the-congress-2025', '/sponsors-of-congress-2025'],
  },
  {
    // /congress-2026: "4th Congress", "1st in-person Congress", "Theme: From Innovation to Implementation…";
    // /congress-2026/opportunities: "October 23–25, 2026, at the HICC in Hyderabad, India";
    // host-venue page: "Hyderabad International Convention Centre".
    year: 2026, number: 4, format: 'in-person',
    theme: 'From Innovation to Implementation: Bridging Science and Access in Inherited Blood Disorders',
    startDate: '2026-10-23', endDate: '2026-10-25', venue: 'Hyderabad International Convention Centre (HICC)',
    city: 'Hyderabad', country: 'India', aboutFrom: '/congress-2026/about-the-gansid-congress-2026',
    legacy: [
      '/congress-2026', '/congress-2026/about-the-gansid-congress-2026', '/congress-2026/speakers',
      '/congress-2026/scientific-program-committee', '/congress-2026/local-planning-team',
      '/congress-2026/about-the-gansid-congress-2026/sponsors', '/congress-2026-photos',
    ],
  },
];

/** Sponsors and partners as listed on the sponsor and partner pages. */
const PARTNERS = [
  { name: 'Pfizer', website: 'https://www.pfizer.ca/en', logo: '/wp-content/uploads/2025/09/pfizer.png', type: ['sponsor'] },
  { name: 'Agios', website: 'https://www.agios.com', logo: '/wp-content/uploads/2025/09/agios.png', type: ['sponsor'] },
  { name: 'Vertex', website: 'https://www.vrtx.com/', logo: '/wp-content/uploads/2025/09/vertex.png', type: ['sponsor'] },
  { name: 'Roche', website: 'https://www.roche.com/', logo: '/wp-content/uploads/2025/09/Roche.png', type: ['sponsor'] },
  { name: 'Novartis', website: null, logo: '/wp-content/uploads/2025/09/novartis.png', type: ['sponsor'] },
  { name: 'Active Citizenship Network', website: 'https://www.activecitizenship.net', logo: '/wp-content/uploads/2026/08/Active-Citizenship-logo.png', type: [] },
  { name: 'NCD Alliance', website: 'https://ncdalliance.org', logo: '/wp-content/uploads/2026/01/ncda-logo-800x800.jpg.webp', type: [] },
];
/** /congress-2026/…/sponsors: Gold Pfizer, Bronze Agios. /sponsors-of-congress-2025: Silver Vertex, Agios, Pfizer; Other Roche, Novartis. */
const SPONSORSHIPS: Record<number, { partner: string; tier: string }[]> = {
  2026: [{ partner: 'Pfizer', tier: 'gold' }, { partner: 'Agios', tier: 'bronze' }],
  2025: [
    { partner: 'Vertex', tier: 'silver' }, { partner: 'Agios', tier: 'silver' }, { partner: 'Pfizer', tier: 'silver' },
    { partner: 'Roche', tier: 'supporter' }, { partner: 'Novartis', tier: 'supporter' },
  ],
};

type EventFact = {
  path: string; title?: string; type: string; startDate: string; endDate?: string; location?: string; format?: string;
};
const EVENTS: EventFact[] = [
  // "Delaware, USA: In-Person Round Table Meeting … at the American Society of Hematology (ASH) Conference – Dec 9-12, 2023"
  { path: '/gansid-roundtable-at-ash', title: 'GANSID Roundtable at ASH 2023', type: 'roundtable', startDate: '2023-12-09', endDate: '2023-12-12', location: 'Delaware, USA (at the ASH Annual Meeting)', format: 'in-person' },
  // "took place at the National Sickle Cell Centre, Idi Araba, Lagos on February 20, 2023 … held in person and virtually"
  { path: '/pre-launch-meeting-nigeria', type: 'meeting', startDate: '2023-02-20', location: 'National Sickle Cell Centre, Idi Araba, Lagos, Nigeria', format: 'hybrid' },
  // /press-release: "April 6th, 2023: Dover, Delaware, USA and Toronto, Canada"
  { path: '/gansid-launching', type: 'launch', startDate: '2023-04-06', location: 'Dover, Delaware, USA and Toronto, Canada' },
  // "On June 19, 2026, the global sickle cell community will unite…"
  { path: '/world-sickle-cell-day', title: 'World Sickle Cell Day 2026', type: 'awareness-day', startDate: '2026-06-19' },
  // "World Inherited Blood Disorders Day 2026 — October 18"
  { path: '/world-inherited-blood-disorders-day', title: 'World Inherited Blood Disorders Day 2026', type: 'awareness-day', startDate: '2026-10-18' },
];
const NOT_EVENTS = ['/members-events', '/pictures', '/the-videos'];

type GalleryFact = { path: string; date?: string; congress?: number; event?: string };
const day2026 = (n: number) => `2026-10-2${2 + n}`; // Congress 2026 ran 23–25 October: Day 1 = 23rd.
const GALLERIES: GalleryFact[] = [
  ...[1, 2, 3].flatMap((d) =>
    ['hall-1', 'hall-2', 'hall-5', 'hall-6', 'exhibition-room']
      .map((room) => `/gansid-congress-2026-day-${d}-${room}`)
      .filter((p) => pageByPath.has(p))
      .map((p) => ({ path: p, date: day2026(d), congress: 2026 })),
  ),
  { path: '/registry-and-clinical-trial-seminars-maiduguri-nigeria-feb-06-2025', date: '2025-02-06' },
  { path: '/registry-and-clinical-trial-seminars-lagos-nigeria-jan-31-2025', date: '2025-01-31' },
  // Index page text: "Roundtable in Freetown, Sierra Leone - June 16 - Jun19, 2025"; "Roundtable in Abuja, Nigeria Jun 2, 2025".
  { path: '/roundtable-in-freetown-sierra-leone-june-2025', date: '2025-06-16' },
  { path: '/roundtable-in-abuja-nigeria', date: '2025-06-02' },
  { path: '/advocacy-day-on-the-hill-2024-canada' },
  { path: '/wibd-awareness-day-2024' },
  { path: '/wibd-awareness-day-2025' },
  { path: '/roundtable-2023-at-ash', event: '/gansid-roundtable-at-ash' },
  { path: '/pre-launch-consultation-with-inherited-blood-disorders-organizations-in-nigeria', event: '/pre-launch-meeting-nigeria' },
  // These two are WordPress posts but are photo pages.
  { path: '/roundtable-at-ash-2024' },
  { path: '/roundtable-at-ash-2025' },
];
/** Pages that list galleries; each linked thumbnail becomes that gallery's cover. */
const GALLERY_INDEXES = ['/congress-2026-photos', '/registry-and-clinical-trial-seminars-maiduguri-nigeria', '/wibd-awareness-day-pictures', '/roundtable-meetings', '/advocacy-events', '/pictures'];
const NOT_GALLERIES: Record<string, string> = {
  '/about-the-gansids-global-gathering': 'Text page about the 2023 Global Gathering (= Congress 2023); redirected to /congress/2023.',
  '/speakers-panelists-and-moderators': '"Stay tuned" placeholder for the 2023 Gathering; redirected to /congress/2023.',
  '/gathering-agenda': '"Stay tuned" placeholder for the 2023 Gathering; redirected to /congress/2023.',
  '/congress-2026-photos': 'Index of the Congress 2026 galleries (used for their covers); redirected to /congress/2026.',
  '/registry-and-clinical-trial-seminars-maiduguri-nigeria': 'Index of four galleries (used for their covers); no single new home.',
  '/wibd-awareness-day-pictures': 'Index of the WIBD Day galleries (used for their covers); no single new home.',
};

/** WordPress posts. Anything not listed is reported. */
const NEWS_CATEGORY: Record<string, string> = { blog: 'blog', 'featured-stories': 'story', 'world-sickle-cell-day': 'awareness', 'gansid-launching': 'press-release', uncategorized: 'news' };
const POSTS_AS_PEOPLE = [
  '/dr-leon-tshilolo', '/dr-edward-donnell-ivy', '/dr-yee-yee-yap', '/dr-marimilia-pita', '/ayoola-alaba-olajide', '/dr-j-s-arora',
  '/mary-akua-ampomah', '/dr-ahmad-qabil-khalib', '/holly-john', '/prof-leon-tshilolo-speakerss-2025', '/janie-young-davis-2',
  '/mrs-darshi-vyas', '/riyad-elbard-canada', '/adlette-inati-md-faap', '/ekawat-suwantaroj',
];
const POSTS_SKIPPED: Record<string, string> = {
  '/bill-s-288_senator-cordy-speech_oct-30-2024-english': 'No text in the scrape (probably an embedded PDF).',
  '/world-sickle-cell-day-wscd-guide': 'No text in the scrape (probably an embedded PDF).',
  '/abstracts-submission-guidelines': 'No text in the scrape (probably an embedded PDF).',
  '/gansid-annual-congress-host-bid-manual': 'No text in the scrape (probably an embedded PDF).',
  '/gansid-annual-congress-host-bid-form': 'A Gravity Form, not a story (see forms.md).',
  '/congres-2025-registration-form-speakers-moderators': 'No text in the scrape (a form).',
  '/social-media-toolkit': 'No text in the scrape (probably an embedded PDF).',
  '/message-from-the-minister-of-tribal-affairs-government-of-india': 'Only an image (the letter) in the scrape.',
  '/roundtable-meetings': 'Index of roundtable galleries (used for their covers).',
  '/advocacy-events': 'Index of advocacy galleries (used for their covers).',
};

// ---------------------------------------------------------------------------------------------
// People: name parsing
// ---------------------------------------------------------------------------------------------

const HONORIFIC_RE = /^(professor\s+dr|prof\s*\(\s*dr\.?\s*\)|professor|prof|dr|mrs|mr|ms)\s*\.?\s+/i;
const honorificValue = (raw: string) => {
  const r = raw.toLowerCase();
  if (r.startsWith('prof')) return 'prof';
  if (r.startsWith('dr')) return 'dr';
  if (r.startsWith('mrs')) return 'mrs';
  if (r.startsWith('mr')) return 'mr';
  if (r.startsWith('ms')) return 'ms';
  return undefined;
};
const CREDENTIAL_RE = /\b(MD|M\.D\.|PhD|Ph\.D\.?|MPH|DBA|MBBS|MRCP|FRCPath|C\.Psych|M\.S\.M|MSc|FRCPC)\b/;

type ParsedName = { name: string; honorific?: string; credentials?: string; region?: string; country?: string; organization?: string; suffix?: string };

function parseName(raw: string, bioHeading?: string): ParsedName {
  let s = raw.replace(/\s+/g, ' ').replace(/^Dr\s*\.\s*/i, 'Dr. ').trim();
  const out: Partial<ParsedName> = {};
  const suffix = /\s*(?:–|-)\s+(.+)$/.exec(s) ?? /\s+–\s*(.+)$/.exec(s);
  if (suffix) {
    s = s.slice(0, suffix.index).trim();
    const key = normText(suffix[1]);
    if (REGION_SUFFIXES[key]) out.region = REGION_SUFFIXES[key];
    else if (COUNTRY_SUFFIXES.has(key)) out.country = COUNTRY_LABEL[key] ?? suffix[1].trim();
    else if (key === 'who') out.organization = 'World Health Organization (WHO)';
    else out.suffix = suffix[1].trim();
  }
  const h = HONORIFIC_RE.exec(s);
  if (h) {
    out.honorific = honorificValue(h[1]);
    s = s.slice(h[0].length);
  }
  const comma = s.indexOf(',');
  if (comma > 0 && CREDENTIAL_RE.test(s.slice(comma + 1))) {
    out.credentials = s.slice(comma + 1).trim();
    s = s.slice(0, comma).trim();
  }
  // The bio heading sometimes has the fuller or properly-cased name ("Chandrakant" → "Chandrakant Agarwal").
  if (bioHeading) {
    const hp = parseName(bioHeading.replace(/[*#]/g, ''));
    if (!out.honorific && hp.honorific) out.honorific = hp.honorific;
    if (!out.credentials && hp.credentials) out.credentials = hp.credentials;
    const a = normText(s);
    const b = normText(hp.name);
    if (b && (b === a || (b.startsWith(`${a} `) && a.length > 3))) s = hp.name;
  }
  if (s === s.toUpperCase()) s = s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  return { ...out, name: s.trim() };
}

/** Last name + first initial: good enough to spot the same person across pages. */
const personKey = (name: string) => {
  const parts = normText(name).split(' ').filter((p) => p.length > 1 || /^[a-z]$/.test(p));
  if (!parts.length) return '';
  return `${parts[parts.length - 1]}|${parts[0][0]}`;
};

/** "## Name\n\n#### Position\n\nBio…" → position and the bio without the repeated header. */
function splitBio(bio: string) {
  let s = bio.replace(/\r\n/g, '\n').trim();
  let heading: string | undefined;
  let position: string | undefined;
  const hm = /^#{1,3}\s+(.+)\n+/.exec(s);
  if (hm) {
    heading = hm[1].replace(/\*/g, '').trim();
    s = s.slice(hm[0].length);
    const pm = /^#{4,6}\s+(.+)\n+/.exec(s);
    if (pm && !/^pronouns/i.test(pm[1])) {
      position = decodeEntities(pm[1].replace(/\*/g, '').replace(/,\s*$/, '').trim());
      s = s.slice(pm[0].length);
    }
  }
  return { heading, position, body: s };
}

// ---------------------------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------------------------

const regionIds = new Map<string, number>();
const congressIds = new Map<number, number>();
const eventIds = new Map<string, number>();

async function importRegions() {
  const md = page('/regions-of-the-gansid').markdown;
  for (const [i, r] of REGIONS.entries()) {
    if (!md.includes(r.match)) problem('regions', r.name, `Not found on /regions-of-the-gansid as "${r.match}".`);
    const where = r.code ? { code: { equals: r.code } } : { name: { equals: r.name } };
    const id = await upsert('regions', r.name, where, {
      name: r.name,
      code: r.code ?? undefined,
      order: i + 1,
      legacyUrls: r.legacy.map((p) => ({ url: oldUrl(p) })),
    }, false);
    regionIds.set(r.name, id);
    if (!r.code) problem('regions', r.name, 'The old site gives no short code for this region; left empty.');
  }
  problem('regions', 'all', 'No descriptions imported: /africa-region-afr and /southeast-asia-region-sear are appointment announcements, not region descriptions. Their old URLs are recorded but not redirected (no region pages yet).');
}

async function loadRegionIds() {
  if (regionIds.size) return;
  for (const r of REGIONS) {
    const id = await findId('regions', r.code ? { code: { equals: r.code } } : { name: { equals: r.name } });
    if (id !== undefined) regionIds.set(r.name, id);
  }
}

async function importCongresses() {
  for (const c of CONGRESSES) {
    const src = page(c.aboutFrom);
    let md = src.markdown;
    if (c.aboutUntil && md.includes(c.aboutUntil)) md = md.slice(0, md.indexOf(c.aboutUntil));
    const { markdown, images } = cleanMarkdown(md, { dropLeadingHeading: src.title });
    const uploaded = await uploadInline(images, `GANSID Congress ${c.year}`, 'congress-editions', String(c.year));
    const about = markdownToRichText(markdown, images, uploaded);
    rewriteLinks(about, redirectTo, 'congress-editions', String(c.year));
    const id = await upsert('congress-editions', String(c.year), { year: { equals: c.year } }, {
      title: `GANSID Congress ${c.year}`,
      year: c.year,
      number: c.number,
      format: c.format,
      theme: c.theme,
      startDate: c.startDate ? day(c.startDate) : undefined,
      endDate: c.endDate ? day(c.endDate) : undefined,
      venue: c.venue,
      city: c.city,
      country: c.country,
      about,
      legacyUrls: c.legacy.map((p) => ({ url: oldUrl(p) })),
    });
    congressIds.set(c.year, id);
    for (const p of c.legacy) addRedirect(p, route('congress-editions', String(c.year)), 'congress-editions');
    if (!c.startDate) problem('congress-editions', String(c.year), 'Dates are not on the old site; left empty.');
  }
}

async function loadCongressIds() {
  if (congressIds.size) return;
  for (const c of CONGRESSES) {
    const id = await findId('congress-editions', { year: { equals: c.year } });
    if (id !== undefined) congressIds.set(c.year, id);
  }
}

async function importPartners() {
  await loadCongressIds();
  const ids = new Map<string, number>();
  for (const p of PARTNERS) {
    const logo = await uploadImage(`${OLD_ORIGIN}${p.logo}`, `${p.name} logo`, 'partners', p.name);
    const id = await upsert('partners', p.name, { name: { equals: p.name } }, {
      name: p.name,
      website: p.website ?? undefined,
      type: p.type,
      logo: logo ?? undefined,
      legacyImageUrl: logo ? undefined : `${OLD_ORIGIN}${p.logo}`,
    }, false);
    ids.set(p.name, id);
    if (!p.website) problem('partners', p.name, 'No website link on the old sponsor page; left empty.');
  }
  for (const [year, list] of Object.entries(SPONSORSHIPS)) {
    const congress = congressIds.get(Number(year));
    if (congress === undefined) {
      problem('partners', year, `Congress ${year} not in the database; sponsors not linked (run --only=congress first).`);
      continue;
    }
    if (DRY) continue;
    await payload.update({
      collection: 'congress-editions',
      id: congress,
      data: { sponsors: list.map((s) => ({ partner: ids.get(s.partner)!, tier: s.tier })) } as never,
      draft: true,
      overrideAccess: true,
      context: ctx,
    });
  }
  problem('partners', 'Roundtable at ASH 2023', 'Supporters listed on /gansid-roundtable-at-ash (Vertex, Agios, Pfizer, Roche) are not linked: events have no sponsor field.');
}

async function importPeople() {
  await loadRegionIds();
  await loadCongressIds();
  const people = readJson<ScrapedPerson[]>('people.json');
  const byKey = new Map<string, number>();
  const congressLists = new Map<number, Record<'speakers' | 'scientificCommittee' | 'planningTeam', number[]>>();
  const listFor = (year: number) => {
    if (!congressLists.has(year)) congressLists.set(year, { speakers: [], scientificCommittee: [], planningTeam: [] });
    return congressLists.get(year)!;
  };
  const keyGroups = new Map<string, string[]>();
  const personSlugs = new Map<number, string>();

  const savePerson = async (input: {
    rawName: string; bio: string | null; photo: string | null; roles: string[]; sourceUrls: string[];
  }) => {
    const { heading, position, body } = splitBio(input.bio ?? '');
    const parsed = parseName(input.rawName, heading);
    if (parsed.suffix) problem('people', input.rawName, `Unrecognised name suffix "${parsed.suffix}" dropped from the name; check it.`);
    const label = parsed.name;
    const roles = new Set<string>();
    const appearances: { year: number; list: 'speakers' | 'scientificCommittee' | 'planningTeam' }[] = [];
    for (const r of input.roles) {
      let m: RegExpExecArray | null;
      if (r === 'Board of Directors') roles.add('board');
      else if (r === 'E-course author') roles.add('ecourse-author');
      else if (r === 'Speaker (undated)') roles.add('speaker');
      else if ((m = /^Congress (\d{4}) speaker$/.exec(r))) roles.add('speaker'), appearances.push({ year: Number(m[1]), list: 'speakers' });
      else if ((m = /^Congress (\d{4}) Scientific Program Committee$/.exec(r))) roles.add('scientific-committee'), appearances.push({ year: Number(m[1]), list: 'scientificCommittee' });
      else if ((m = /^Congress (\d{4}) planning team$/.exec(r))) roles.add('planning-team'), appearances.push({ year: Number(m[1]), list: 'planningTeam' });
      else problem('people', label, `Unknown role "${r}" not imported.`);
    }
    const legacyPaths = input.sourceUrls.map((u) => normalizePath(u));
    const where = { 'legacyUrls.url': { equals: input.sourceUrls[0] } };
    const slug = await uniqueSlug('people', label, where);
    const cleaned = cleanMarkdown(body);
    const uploaded = await uploadInline(cleaned.images, label, 'people', label);
    const bio = cleaned.markdown ? markdownToRichText(cleaned.markdown, cleaned.images, uploaded) : undefined;
    const photo = input.photo ? await uploadImage(input.photo, `Photo of ${label}`, 'people', label) : null;
    const id = await upsert('people', label, where, {
      name: parsed.name,
      honorific: parsed.honorific,
      credentials: parsed.credentials,
      position,
      organization: parsed.organization,
      country: parsed.country,
      region: parsed.region ? regionIds.get(parsed.region) : undefined,
      bio,
      roles: [...roles],
      photo: photo ?? undefined,
      slug,
      nameOnOldSite: input.rawName,
      legacyUrls: input.sourceUrls.map((url) => ({ url })),
      legacyImageUrl: photo ? undefined : (input.photo ?? undefined),
    });
    if (parsed.region && !regionIds.get(parsed.region)) problem('people', label, `Region "${parsed.region}" not in the database (run --only=regions first).`);
    for (const a of appearances) {
      if (!congressIds.has(a.year)) problem('people', label, `Congress ${a.year} not in the database; appearance not linked.`);
      else listFor(a.year)[a.list].push(id);
    }
    personSlugs.set(id, slug);
    for (const p of legacyPaths) addRedirect(p, route('people', slug), 'people');
    if (!input.photo) problem('people', label, 'No photo on the old site.');
    if (bio) rewriteLinks(bio, redirectTo, 'people', label);
    const key = personKey(parsed.name);
    byKey.set(key, byKey.get(key) ?? id);
    keyGroups.set(key, [...(keyGroups.get(key) ?? []), `${input.rawName} (${legacyPaths.join(', ')})`]);
    return id;
  };

  for (const p of people) {
    await savePerson({ rawName: p.name, bio: p.bio, photo: p.photo, roles: p.roles, sourceUrls: p.source_urls });
    if (p.variants.length) problem('people', p.name, `${p.variants.length} other bio version(s) on the old site not imported (longest kept; see people.json "variants").`);
  }

  // WordPress posts that are really profiles: link to the matching person, or add them.
  for (const path_ of POSTS_AS_PEOPLE) {
    const post = page(path_);
    const parsed = parseName(post.title);
    const match = byKey.get(personKey(parsed.name));
    if (match !== undefined) {
      if (!DRY) {
        const doc = (await payload.findByID({ collection: 'people', id: match, depth: 0, draft: true, overrideAccess: true })) as {
          legacyUrls?: { url: string }[];
        };
        const urls = doc.legacyUrls ?? [];
        if (!urls.some((u) => u.url === post.url)) {
          await payload.update({
            collection: 'people', id: match, draft: true, overrideAccess: true, context: ctx,
            data: { legacyUrls: [...urls.map((u) => ({ url: u.url })), { url: post.url }] } as never,
          });
        }
      }
      addRedirect(path_, route('people', personSlugs.get(match) ?? ''), 'people');
      problem('people', post.title, `Old post ${path_} matched to an existing person by name; its text was not imported (the profile bio is used). Check the match.`);
    } else {
      const firstImg = post.images.find((i) => !/icon|logo/i.test(i.src));
      await savePerson({ rawName: post.title, bio: post.markdown.replace(/!\[[^\]]*\]\([^)]*\)/, ''), photo: firstImg ? fullSize(firstImg.src) : null, roles: [], sourceUrls: [post.url] });
      problem('people', post.title, `Added from the old post ${path_} (not in people.json). No role on the old site; set one.`);
    }
  }

  for (const [key, names] of keyGroups) {
    if (names.length > 1) problem('people', key.split('|')[0], `Possible duplicate people (not merged): ${names.join(' · ')}`);
  }

  // Congress appearances live on the Congress edition.
  for (const [year, lists] of congressLists) {
    if (DRY) continue;
    const sortByName = async (ids: number[]) => [...new Set(ids)];
    await payload.update({
      collection: 'congress-editions',
      id: congressIds.get(year)!,
      data: {
        speakers: await sortByName(lists.speakers),
        scientificCommittee: await sortByName(lists.scientificCommittee),
        planningTeam: await sortByName(lists.planningTeam),
      } as never,
      draft: true,
      overrideAccess: true,
      context: ctx,
    });
  }
  problem('people', 'The Team', '/the-team lists 8 staff (Lanre Tunji-Ajayi, Nafanta Fadiga, …) who are not in people.json; not imported. Add them with the "GANSID team" role.');
  problem('people', 'Local planning team 2026', '/congress-2026/local-planning-team lists names and photos only, mostly not in people.json; not imported.');
}

async function importEvents() {
  for (const e of EVENTS) {
    const src = page(e.path);
    const title = e.title ?? src.title;
    const { markdown, images } = cleanMarkdown(src.markdown, { dropLeadingHeading: src.title });
    // The first banner image becomes the cover.
    const [coverImg, ...rest] = images;
    const cover = coverImg ? await uploadImage(coverImg.src, meaningfulAlt(coverImg.alt) ? coverImg.alt : title, 'events', title) : null;
    const bodyMd = coverImg ? markdown.replace('@@IMG0@@', '') : markdown;
    const uploaded = await uploadInline(images, title, 'events', title);
    uploaded.delete(0);
    const body = markdownToRichText(bodyMd, images, uploaded);
    const slug = await uniqueSlug('events', title, { 'legacyUrls.url': { equals: src.url } });
    const id = await upsert('events', title, { 'legacyUrls.url': { equals: src.url } }, {
      title,
      type: e.type,
      startDate: day(e.startDate),
      endDate: e.endDate ? day(e.endDate) : undefined,
      location: e.location,
      format: e.format,
      body,
      cover: cover ?? undefined,
      slug,
      legacyUrls: [{ url: src.url }],
      legacyImageUrl: cover ? undefined : coverImg ? fullSize(coverImg.src) : undefined,
    });
    eventIds.set(e.path, id);
    addRedirect(e.path, route('events', slug), 'events');
    rewriteLinks(body, redirectTo, 'events', title);
    problem('events', title, 'No summary on the old site; write one for event cards.');
    void rest;
  }
  for (const p of NOT_EVENTS) problem('events', p, 'Not an event (a listing or info page); not imported.');
  problem('events', 'Roundtable at ASH 2023', 'The page says "Delaware, USA" for the ASH 2023 roundtable. Imported as written; please verify the location.');
}

async function loadEventIds() {
  for (const e of EVENTS) {
    if (eventIds.has(e.path)) continue;
    const id = await findId('events', { 'legacyUrls.url': { equals: oldUrl(e.path) } });
    if (id !== undefined) eventIds.set(e.path, id);
  }
}

async function importGalleries() {
  await loadCongressIds();
  await loadEventIds();
  // Covers: each linked thumbnail on an index page.
  const covers = new Map<string, { src: string; from: string }>();
  for (const idx of GALLERY_INDEXES) {
    const md = pageByPath.get(idx)?.markdown ?? '';
    for (const m of md.matchAll(/\[!\[[^\]]*\]\(([^)\s]+)\)\]\(https?:\/\/(?:www\.)?inheritedblooddisorders\.world(\/[^)\s]*)\)/g)) {
      const target = normalizePath(m[2]);
      if (!covers.has(target)) covers.set(target, { src: fullSize(m[1]), from: idx });
    }
  }
  for (const g of GALLERIES) {
    const src = page(g.path);
    const title = src.title;
    const { images } = cleanMarkdown(src.markdown);
    const photos = images.filter((i) => !/icon/i.test(i.src));
    const uploaded: { image: number; caption?: string }[] = [];
    const notUploaded: { url: string; alt?: string }[] = [];
    for (const img of photos) {
      const id = await uploadImage(img.src, meaningfulAlt(img.alt) ? img.alt : `Photo from ${title}`, 'galleries', title);
      if (id !== null) uploaded.push({ image: id });
      else notUploaded.push({ url: fullSize(img.src), alt: img.alt || undefined });
    }
    const coverRef = covers.get(normalizePath(g.path));
    const cover = coverRef ? await uploadImage(coverRef.src, `Cover photo for ${title}`, 'galleries', title) : null;
    if (coverRef) problem('galleries', title, `Cover taken from the thumbnail on ${coverRef.from}; check it matches.`);
    const slug = await uniqueSlug('galleries', title, { 'legacyUrls.url': { equals: src.url } });
    await upsert('galleries', title, { 'legacyUrls.url': { equals: src.url } }, {
      title,
      date: g.date ? day(g.date) : undefined,
      congress: g.congress ? congressIds.get(g.congress) : undefined,
      event: g.event ? eventIds.get(g.event) : undefined,
      images: uploaded,
      cover: cover ?? undefined,
      slug,
      legacyUrls: [{ url: src.url }],
      legacyCoverUrl: cover ? undefined : coverRef?.src,
      legacyImages: notUploaded,
    });
    addRedirect(g.path, route('galleries', slug), 'galleries');
    if (!photos.length) {
      const picflow = /picflow/i.test(src.markdown);
      problem('galleries', title, picflow
        ? 'Photos were a Picflow embed; the album link is not in the scrape. Paste it into "Link to the full album".'
        : 'No photos captured by the scrape (JavaScript gallery). Find them in raw/html on Dapo\'s computer.');
    }
    if (!g.date) problem('galleries', title, 'No date on the old site; left empty.');
  }
  for (const [p, why] of Object.entries(NOT_GALLERIES)) problem('galleries', p, `Not imported as a gallery: ${why}`);
  const listed = new Set([...GALLERIES.map((g) => g.path), ...Object.keys(NOT_GALLERIES)]);
  for (const p of pages.filter((x) => x.kind === 'photo-gallery' && !listed.has(x.path))) problem('galleries', p.path, 'Gallery page not handled by the import.');
}

async function importNews() {
  const posts = pages.filter((p) => p.kind === 'post');
  for (const post of posts) {
    if (POSTS_AS_PEOPLE.includes(post.path)) continue; // handled by the people step
    if (GALLERIES.some((g) => g.path === post.path)) continue; // handled by the galleries step
    if (POSTS_SKIPPED[post.path]) {
      problem('news', post.path, `Skipped: ${POSTS_SKIPPED[post.path]}`);
      bump('news', 'skipped');
      continue;
    }
    const title = decodeEntities(post.title);
    const category = NEWS_CATEGORY[post.categories[0] ?? 'uncategorized'] ?? 'news';
    const cleaned = cleanMarkdown(post.markdown, { dropLeadingHeading: title });
    const { markdown, images } = cleaned;
    // A leading image is the story's cover, not part of the text.
    const leading = /^@@IMG0@@/.test(markdown) ? images[0] : undefined;
    const cover = leading ? await uploadImage(leading.src, meaningfulAlt(leading.alt) ? leading.alt : `Image for "${title}"`, 'news', title) : null;
    const bodyMd = leading ? markdown.replace(/^@@IMG0@@\s*/, '') : markdown;
    const uploaded = await uploadInline(images, title, 'news', title);
    uploaded.delete(0);
    const body = markdownToRichText(bodyMd, images, uploaded);
    rewriteLinks(body, redirectTo, 'news', title);
    if (!body.root.children.length) {
      problem('news', post.path, 'Empty after clean-up; skipped.');
      bump('news', 'skipped');
      continue;
    }
    const wpSlug = post.path.replace(/^\//, '');
    const slug = await uniqueSlug('news', wpSlug, { legacyUrl: { equals: post.url } });
    await upsert('news', title, { legacyUrl: { equals: post.url } }, {
      title,
      excerpt: post.meta_description ?? undefined,
      body,
      category,
      publishedAt: post.modified ?? undefined,
      cover: cover ?? undefined,
      slug,
      legacyUrl: post.url,
      legacyImageUrl: cover ? undefined : leading ? fullSize(leading.src) : undefined,
    });
    addRedirect(post.path, route('news', slug), 'news');
    if (post.documents.length) problem('news', title, `${post.documents.length} linked document(s) still point at the old site (wp-content). Upload them to Media.`);
    if (cleaned.videos) {
      const priv = cleaned.privateVideos ? ` The old page showed ${cleaned.privateVideos} of them as "This video is private"; check they play.` : '';
      problem('news', title, `${cleaned.videos} YouTube video(s) became "Watch on YouTube" links; embed them properly once the site has a video block.${priv}`);
    } else if (post.embeds.length) problem('news', title, `${post.embeds.length} embed(s) (videos) were not captured as text; re-add them.`);
    if (category === 'awareness' && /toolkit|graphics|sample posts/i.test(title)) problem('news', title, 'This is a toolkit rather than a story; consider moving it to Resources.');
  }
  problem('news', 'all', 'The scrape has no publish dates: each story\'s Date is the old page\'s LAST-EDITED date. Check before publishing.');
}

async function importRedirects() {
  if (!redirectTo.size) {
    // Rebuild from the database when run on its own (--only=redirects).
    const add = async (collection: SectionCollection, field: 'legacyUrls' | 'legacyUrl') => {
      const res = await payload.find({ collection, pagination: false, depth: 0, draft: true, overrideAccess: true });
      for (const d of res.docs as unknown as Record<string, unknown>[]) {
        const urls = field === 'legacyUrl' ? [d.legacyUrl as string | undefined] : ((d.legacyUrls as { url: string }[] | undefined) ?? []).map((u) => u.url);
        for (const u of urls) if (u) addRedirect(u, route(collection, String(d.slug ?? '')), collection);
      }
    };
    await add('people', 'legacyUrls');
    await add('events', 'legacyUrls');
    await add('galleries', 'legacyUrls');
    await add('congress-editions', 'legacyUrls');
    await add('news', 'legacyUrl');
  }
  for (const [from, to] of [...redirectTo].sort()) {
    await upsert('redirects', from, { from: { equals: from } }, { from, to, type: '301' }, false);
  }
}

async function importMenu() {
  const nav = readJson<NavItem[]>('navigation.json');
  let missing = 0;
  const convert = (items: NavItem[], depth = 1): Record<string, unknown>[] =>
    items.map((it) => {
      let url: string | undefined;
      if (it.href && it.href !== '#') {
        const p = normalizePath(it.href);
        url = redirectTo.get(p) ?? p;
        if (!redirectTo.has(p) && p !== '/') missing++;
      }
      return {
        label: decodeEntities(it.label),
        url,
        ...(it.children?.length ? { [menuChildField(depth)]: convert(it.children, depth + 1) } : {}),
      };
    });
  const items = convert(nav);
  problem('menu', 'Main menu', `${missing} menu link(s) point at old addresses with no new page yet (kept as the old path).`);
  if (DRY) {
    bump('main-menu', 'updated');
    return;
  }
  await payload.updateGlobal({ slug: 'main-menu', data: { items, _status: 'draft' } as never, draft: true, overrideAccess: true, context: ctx });
  bump('main-menu', 'updated');
}

// ---------------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------------

async function main() {
  const { getPayload } = await import('payload');
  const { convertMarkdownToLexical, editorConfigFactory } = await import('@payloadcms/richtext-lexical');
  const config = (await import('../src/payload.config')).default;
  payload = await getPayload({ config });
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  toLexical = (markdown) => convertMarkdownToLexical({ editorConfig, markdown }) as unknown as LexicalDoc;

  console.log(`${DRY ? 'DRY RUN: nothing will be written.\n' : ''}Inventory: ${INVENTORY}\nMedia: ${MEDIA_DIR ?? 'none (images recorded as old URLs)'}\n`);

  // Redirect targets are needed to rewrite links, so the order matters.
  if (runs('regions')) await importRegions();
  if (runs('congress')) await importCongresses();
  if (runs('partners')) await importPartners();
  if (runs('people')) await importPeople();
  if (runs('events')) await importEvents();
  if (runs('galleries')) await importGalleries();
  if (runs('news')) await importNews();
  if (runs('redirects')) await importRedirects();
  if (runs('menu')) await importMenu();

  const lines: string[] = [];
  lines.push(`# WordPress import ${DRY ? '(dry run)' : ''}`, '', '| Collection | Created | Updated | Skipped |', '|---|---|---|---|');
  for (const [c, n] of Object.entries(counts)) lines.push(`| ${c} | ${n.created} | ${n.updated} | ${n.skipped} |`);
  lines.push('', `## Problems and notes (${problems.length})`, '');
  for (const p of problems) lines.push(`- **${p.area}** · ${p.item}: ${p.note}`);
  const report = lines.join('\n');
  console.log(report);
  if (REPORT) fs.writeFileSync(REPORT, report);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
