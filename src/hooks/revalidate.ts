import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidatePath } from 'next/cache';

/** Refresh the cached public page as soon as an editor publishes, unpublishes or deletes. */
export const revalidateDoc =
  (pathFor: (doc: { slug?: string | null }) => string, listPath?: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc, req }) => {
    if (req.context?.disableRevalidate) return doc;
    const changedStatus = doc._status !== previousDoc?._status;
    if (doc._status === 'published' || changedStatus) {
      try {
        revalidatePath(pathFor(doc));
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) revalidatePath(pathFor(previousDoc));
        if (listPath) revalidatePath(listPath);
      } catch {
        // Outside a Next.js request (e.g. seed scripts) there is nothing to revalidate.
      }
    }
    return doc;
  };

export const revalidateDelete =
  (pathFor: (doc: { slug?: string | null }) => string, listPath?: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    try {
      revalidatePath(pathFor(doc));
      if (listPath) revalidatePath(listPath);
    } catch {}
    return doc;
  };
