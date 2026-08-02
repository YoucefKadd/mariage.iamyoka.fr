"use client";

import { useEffect, useRef, useState } from "react";

export default function RichTextEditor({ 
  value, 
  onChange,
  placeholder = "Entrez votre texte ici...",
  minHeight = "150px"
}: { 
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialiser la valeur une seule fois au montage
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, []); // On ne l'écoute pas sur 'value' pour éviter les pertes de focus/curseur pendant la frappe

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`border transition-colors ${isFocused ? 'border-brand-taupe' : 'border-brand-taupe/20'} bg-white`}>
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-taupe/10 p-2 bg-brand-paper/50">
        <button type="button" onClick={() => execCmd('bold')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded font-bold text-sm" title="Gras">B</button>
        <button type="button" onClick={() => execCmd('italic')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded italic font-serif text-sm" title="Italique">I</button>
        <button type="button" onClick={() => execCmd('underline')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded underline text-sm" title="Souligné">U</button>
        <div className="w-px h-4 bg-brand-taupe/20 mx-1"></div>
        <button type="button" onClick={() => execCmd('formatBlock', 'H2')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded text-xs font-bold" title="Titre 2">H2</button>
        <button type="button" onClick={() => execCmd('formatBlock', 'H3')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded text-xs font-bold" title="Titre 3">H3</button>
        <button type="button" onClick={() => execCmd('formatBlock', 'P')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink rounded text-xs" title="Paragraphe">P</button>
        <div className="w-px h-4 bg-brand-taupe/20 mx-1"></div>
        <button type="button" onClick={() => execCmd('removeFormat')} className="px-2 py-1 hover:bg-brand-sand/50 text-brand-ink/60 rounded text-xs" title="Effacer le formatage">Tx</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="p-3 text-sm focus:outline-none overflow-y-auto min-h-[150px] [&>p]:mb-2 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-md [&>h3]:font-bold [&>h3]:mb-2"
        style={{ minHeight }}
        data-placeholder={placeholder}
      ></div>
      <style jsx>{`
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #a3a3a3;
          pointer-events: none;
          display: block; /* For Firefox */
        }
      `}</style>
    </div>
  );
}
