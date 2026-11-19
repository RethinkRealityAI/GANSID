import Link from 'next/link';
import type { Page } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { RichText } from './rich-text';
import { mediaSrc } from './media';

type Block = Page['layout'][number];

/** Maps each CMS block to its designed component. Unknown blocks render nothing. */
export function Blocks({ blocks }: { blocks: Page['layout'] }) {
  return <>{blocks.map((b, i) => <BlockView key={b.id ?? i} block={b} />)}</>;
}

function BlockView({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'hero': {
      const img = mediaSrc(block.image, 'wide');
      return (
        <section className="relative isolate overflow-hidden bg-mist pt-[calc(var(--header-h)+3rem)] pb-16">
          <div className="container-x grid items-center gap-10 lg:grid-cols-2">
            <div>
              {block.eyebrow && <p className="eyebrow text-teal">{block.eyebrow}</p>}
              <h1 className="display mt-4 text-5xl md:text-6xl">{block.title}</h1>
              {block.lede && <p className="mt-6 max-w-xl text-lg text-ink-soft">{block.lede}</p>}
              {block.actions?.length ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  {block.actions.map((a, i) => (
                    <Button key={a.id ?? i} href={a.href} variant={i === 0 ? undefined : 'ghost'}>
                      {a.label}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full rounded-[2rem] object-cover" />
            )}
          </div>
        </section>
      );
    }
    case 'text':
      return (
        <section className="container-x py-14">
          <div className="mx-auto max-w-3xl">
            {block.heading && <h2 className="display text-3xl md:text-4xl">{block.heading}</h2>}
            <RichText data={block.body} className="mt-6" />
          </div>
        </section>
      );
    case 'mediaText': {
      const img = mediaSrc(block.image, 'card');
      return (
        <section className="container-x py-14">
          <div className={`grid items-center gap-10 md:grid-cols-2 ${block.imageSide === 'right' ? 'md:[&>*:first-child]:order-2' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {img && <img src={img.src} alt={img.alt} className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />}
            <div>
              {block.heading && <h2 className="display text-3xl">{block.heading}</h2>}
              <RichText data={block.body} className="mt-4" />
            </div>
          </div>
        </section>
      );
    }
    case 'cta':
      return (
        <section className="container-x py-14">
          <div className="rounded-[2rem] bg-navy px-8 py-12 text-white md:px-14">
            <h2 className="display text-3xl md:text-4xl">{block.title}</h2>
            {block.text && <p className="mt-4 max-w-2xl text-white/80">{block.text}</p>}
            <Link href={block.href} className="mt-8 inline-flex rounded-full bg-red px-6 py-3 font-semibold text-white">
              {block.buttonLabel}
            </Link>
          </div>
        </section>
      );
    default:
      return null;
  }
}
