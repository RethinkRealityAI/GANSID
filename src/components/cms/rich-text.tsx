import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react';
import './prose.css';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

/** Renders CMS rich text with the site's prose styles. */
export function RichText({ data, className = '' }: { data?: SerializedEditorState | null; className?: string }) {
  if (!data) return null;
  return (
    <div className={`cms-prose ${className}`}>
      <LexicalRichText data={data} />
    </div>
  );
}
