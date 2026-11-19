import { s3Storage } from '@payloadcms/storage-s3';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';

/**
 * Media storage: Supabase Storage through its S3-compatible endpoint when configured,
 * otherwise local disk (development only: Netlify's filesystem does not persist).
 *
 * Supabase → Project settings → Storage → S3 connection gives the endpoint, region and keys.
 */
export const mediaStorage = () => {
  const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
  const enabled = Boolean(S3_ENDPOINT && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY && S3_BUCKET);
  return s3Storage({
    enabled,
    collections: {
      media: {
        prefix: 'cms',
        // Media is public, so serve it straight from Supabase's CDN instead of through the app.
        disablePayloadAccessControl: true,
        generateFileURL: ({ filename, prefix }) =>
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${S3_BUCKET}/${prefix ? `${prefix}/` : ''}${filename}`,
      },
    },
    bucket: S3_BUCKET ?? '',
    config: {
      endpoint: S3_ENDPOINT,
      region: S3_REGION ?? 'us-east-1',
      forcePathStyle: true,
      credentials: { accessKeyId: S3_ACCESS_KEY_ID ?? '', secretAccessKey: S3_SECRET_ACCESS_KEY ?? '' },
    },
  });
};

/**
 * Email (staff notices now, form notifications later). Any SMTP provider works.
 * Without SMTP settings, Payload logs emails to the console instead of sending.
 */
export const emailAdapter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return undefined;
  const port = Number(SMTP_PORT ?? 587);
  return nodemailerAdapter({
    defaultFromAddress: EMAIL_FROM_ADDRESS ?? SMTP_USER,
    defaultFromName: EMAIL_FROM_NAME ?? 'GANSID',
    transportOptions: { host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } },
  });
};
