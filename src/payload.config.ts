import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { News } from './collections/News';
import { People } from './collections/People';
import { Events } from './collections/Events';
import { CongressEditions } from './collections/CongressEditions';
import { Galleries } from './collections/Galleries';
import { Resources } from './collections/Resources';
import { MemberOrganizations } from './collections/MemberOrganizations';
import { Regions } from './collections/Regions';
import { Partners } from './collections/Partners';
import { Announcement } from './globals/Announcement';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002';

export default buildConfig({
  serverURL: SITE_URL,
  admin: {
    user: Users.slug,
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · GANSID admin', icons: [{ url: '/brand/gansid-logo-stacked.png' }] },
    components: {
      graphics: {
        Logo: '/components/admin/brand#AdminLogo',
        Icon: '/components/admin/brand#AdminIcon',
      },
      logout: { Button: '/components/admin/sign-out-button#SignOutButton' },
      beforeLogin: ['/components/admin/staff-sign-in#StaffSignIn'],
    },
    livePreview: {
      breakpoints: [
        { label: 'Phone', name: 'phone', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    // Website
    Pages,
    News,
    Events,
    Galleries,
    Resources,
    Media,
    // Congress
    CongressEditions,
    // Network
    People,
    MemberOrganizations,
    Partners,
    Regions,
    // Settings
    Users,
  ],
  globals: [Announcement],
  editor: lexicalEditor(),
  // Default languages: English, with French ready. Add or remove locales here; untranslated
  // fields fall back to English so nothing ever shows blank.
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Français', code: 'fr' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    // Website content lives in its own schema so it never mixes with the Congress tables
    // that share this Supabase database.
    schemaName: 'payload',
    // Schema changes in production go through `npm run payload migrate`, never auto-push.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
});
