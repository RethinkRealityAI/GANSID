import 'server-only';
import { draftMode } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';

export const cms = () => getPayload({ config });

/** True when a signed-in editor has opened a draft preview. */
export const isPreview = async () => (await draftMode()).isEnabled;

export async function getNewsList(limit = 24) {
  const payload = await cms();
  const draft = await isPreview();
  const res = await payload.find({
    collection: 'news',
    draft,
    limit,
    depth: 1,
    sort: '-publishedAt',
    where: draft ? undefined : { _status: { equals: 'published' } },
    overrideAccess: draft,
  });
  return res.docs;
}

export async function getNewsBySlug(slug: string) {
  const payload = await cms();
  const draft = await isPreview();
  const res = await payload.find({
    collection: 'news',
    draft,
    limit: 1,
    depth: 1,
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
}

export async function getPageBySlug(slug: string) {
  const payload = await cms();
  const draft = await isPreview();
  const res = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    depth: 1,
    where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    overrideAccess: draft,
  });
  return res.docs[0] ?? null;
}
