'use client';

import { useEffect, useRef, useState } from 'react';
import { SECTIONS, useVariants, type SectionKey } from '@/lib/variants';
import { scrollToId } from '../motion/smooth-scroll';

type Verdict = 'love' | 'keep' | 'like' | 'no';
type Entry = { verdict?: Verdict; note?: string };
type Store = Record<string, Entry>; // key: `${section}__${variant}`

type DocRef = { set: (d: Record<string, unknown>) => Promise<void> };
type Db = {
  collection: (p: string) => {
    onSnapshot: (
      next: (s: { docs: { id: string; data: () => Record<string, unknown> | undefined }[] }) => void,
      err?: (e: unknown) => void,
    ) => () => void;
    doc: (id: string) => DocRef;
  };
};

const LOCAL = 'gansid-review-notes';
const VERDICTS: { id: Verdict; label: string; icon: string }[] = [
  { id: 'love', label: 'Use this one', icon: '♥' },
  { id: 'keep', label: 'Save for later', icon: '☆' },
  { id: 'like', label: 'Close, needs tweaks', icon: '~' },
  { id: 'no', label: 'Not for us', icon: '✕' },
];

/**
 * Floating review panel: switch each section's variant, mark a verdict and
 * leave a note. Notes go to the artifact's shared store when available (so
 * Claude can read them), otherwise they stay in this browser.
 */
export function ReviewDock() {
  const { choice, set } = useVariants();
  const [open, setOpen] = useState(false);
  const [store, setStore] = useState<Store>({});
  const [mode, setMode] = useState<'shared' | 'local' | 'pending'>('pending');
  const [saved, setSaved] = useState<string | null>(null);
  const dbRef = useRef<Db | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL);
      if (raw) setStore(JSON.parse(raw));
    } catch {}
    const claude = (window as unknown as { claude?: { use: (n: string) => Promise<unknown> } }).claude;
    if (!claude?.use) {
      setMode('local');
      return;
    }
    let unsub: (() => void) | undefined;
    const timeout = setTimeout(() => setMode((m) => (m === 'pending' ? 'local' : m)), 10000);
    claude
      .use('db')
      .then((db) => {
        if (!db) {
          setMode('local');
          return;
        }
        dbRef.current = db as Db;
        unsub = (db as Db).collection('feedback').onSnapshot(
          (snap) => {
            clearTimeout(timeout);
            setMode('shared');
            setStore((prev) => {
              const next = { ...prev };
              snap.docs.forEach((d) => {
                const v = d.data();
                if (v) next[d.id] = { verdict: v.verdict as Verdict | undefined, note: (v.note as string) ?? '' };
              });
              return next;
            });
          },
          () => setMode('local'),
        );
      })
      .catch(() => setMode('local'));
    return () => {
      clearTimeout(timeout);
      unsub?.();
    };
  }, []);

  const write = (key: string, entry: Entry, section: SectionKey, variant: string) => {
    setStore((s) => {
      const next = { ...s, [key]: entry };
      try {
        localStorage.setItem(LOCAL, JSON.stringify(next));
      } catch {}
      return next;
    });
    clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      if (dbRef.current) {
        try {
          await dbRef.current.collection('feedback').doc(key).set({
            section,
            variant,
            verdict: entry.verdict ?? null,
            note: entry.note ?? '',
            updatedAt: new Date().toISOString(),
          });
        } catch {
          setMode('local');
        }
      }
      setSaved(key);
      setTimeout(() => setSaved((k) => (k === key ? null : k)), 1600);
    }, 600);
  };

  const marked = Object.values(store).filter((e) => e.verdict || e.note).length;

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] left-1/2 z-[60] w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2">
      {open && (
        <div
          id="review-panel"
          className="glass mb-3 max-h-[min(70vh,44rem)] overflow-y-auto overscroll-contain rounded-[1.75rem] p-4 text-ink sm:p-5"
          data-lenis-prevent
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
            <p className="text-sm font-bold">Compare design options</p>
            <p className="text-xs text-ink-soft">
              {mode === 'shared' ? 'Notes save to this page, so Claude can read them' : mode === 'local' ? 'Notes save in this browser only' : 'Connecting…'}
            </p>
          </div>
          <p className="mt-1 px-1 text-xs text-ink-soft">
            <b className="text-red">Use this one</b> picks the winner for a section (one per section). <b className="text-coral">Save for later</b> keeps an option on file without using it.
          </p>
          <ul className="mt-3 space-y-3">
            {(Object.keys(SECTIONS) as SectionKey[]).map((k) => {
              const sec = SECTIONS[k];
              const cur = choice[k];
              const opt = sec.options.find((o) => o.id === cur)!;
              const key = `${k}__${cur}`;
              const entry = store[key] ?? {};
              return (
                <li key={k} className="rounded-2xl bg-white/70 p-3 ring-1 ring-ink/5 sm:p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button type="button" onClick={() => scrollToId(sec.anchor)} className="text-left text-[0.9375rem] font-bold hover:text-crimson">
                      {sec.label} <span className="font-medium text-ink-soft">↓</span>
                    </button>
                    <div role="radiogroup" aria-label={`${sec.label} options`} className="flex flex-wrap gap-1 rounded-full bg-mist p-1">
                      {sec.options.map((o, i) => {
                        const on = o.id === cur;
                        const v = store[`${k}__${o.id}`]?.verdict;
                        return (
                          <button
                            key={o.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set(k, o.id)}
                            className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition ${on ? 'bg-ink text-white shadow' : 'text-ink/70 hover:text-ink'}`}
                          >
                            {String.fromCharCode(65 + i)} · {o.name}
                            {v && (
                              <span
                                aria-label={VERDICTS.find((x) => x.id === v)?.label}
                                className={`ml-1.5 inline-block size-2 rounded-full ${v === 'love' ? 'bg-red' : v === 'keep' ? 'bg-coral' : v === 'like' ? 'bg-teal' : 'bg-muted'}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">{opt.note}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {VERDICTS.map((v) => {
                      const on = entry.verdict === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => {
                            if (v.id === 'love' && !on) {
                              sec.options.forEach((o) => {
                                const ok = `${k}__${o.id}`;
                                if (o.id !== cur && store[ok]?.verdict === 'love') write(ok, { ...store[ok], verdict: 'keep' }, k, o.id);
                              });
                            }
                            write(key, { ...entry, verdict: on ? undefined : v.id }, k, cur);
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                            on
                              ? v.id === 'love'
                                ? 'bg-red text-white ring-red'
                                : v.id === 'keep'
                                ? 'bg-coral text-white ring-coral'
                                : v.id === 'like'
                                  ? 'bg-teal text-white ring-teal'
                                  : 'bg-ink text-white ring-ink'
                              : 'bg-white ring-ink/10 hover:ring-ink/30'
                          }`}
                        >
                          <span aria-hidden="true">{v.icon}</span>
                          {v.label}
                        </button>
                      );
                    })}
                    {saved === key && <span className="text-xs font-semibold text-teal" role="status">Saved</span>}
                  </div>
                  <label htmlFor={`note-${key}`} className="sr-only">
                    Notes on {sec.label}, {opt.name}
                  </label>
                  <textarea
                    id={`note-${key}`}
                    rows={2}
                    placeholder={`What to change in “${opt.name}”?`}
                    value={entry.note ?? ''}
                    onChange={(e) => write(key, { ...entry, note: e.target.value }, k, cur)}
                    className="mt-2 w-full resize-y rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-ink/10 outline-none focus:ring-2 focus:ring-teal"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="flex justify-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="review-panel"
          onClick={() => setOpen((v) => !v)}
          className="glass-dark sheen inline-flex h-12 items-center gap-3 rounded-full bg-ink/70 pr-2 pl-5 text-sm font-semibold text-white"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-coral opacity-75" />
            <span className="relative size-2.5 rounded-full bg-coral" />
          </span>
          Design options
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs tabular-nums">{marked} marked</span>
          <span className="grid size-8 place-items-center rounded-full bg-white text-ink">{open ? '✕' : '↑'}</span>
        </button>
      </div>
    </div>
  );
}
