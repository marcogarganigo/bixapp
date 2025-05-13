import React, { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor, { EditorOptions } from '@toast-ui/editor';
import { defaultConfig } from 'next/dist/server/config-shared';

// INTERFACCIA PROPS
interface PropsInterface {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function InputEditor({ initialValue='', onChange }: PropsInterface) {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Inizializza l'editor
  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      // Inizializza l'editor solo se non è già stato creato
      editorRef.current = new Editor({
        el: containerRef.current as HTMLElement,
        height: 'auto',
        width: 'auto',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: '',
        customHTMLSanitizer: (html: string): string => html, // <<< Permette HTML senza modifiche
      } as EditorOptions);

      // Imposta l’HTML **dopo** l’inizializzazione
      if (initialValue) {
        editorRef.current.setHTML(initialValue);
      }

      // Aggiungi un listener per l'evento di modifica
      editorRef.current.on('change', () => {
        if (onChange && editorRef.current) {

          // Ottieni il contenuto HTML dall'editor
          const htmlContent = editorRef.current.getHTML();
          onChange(htmlContent); // Passa l'HTML alla funzione onChange
        }
      });
    }



    // Distruggi l'editor quando il componente viene smontato
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Solo all'inizializzazione

      /* 2. Aggiorna il contenuto quando la prop cambia */
      useEffect(() => {
        if (editorRef.current) {
          const current = editorRef.current.getHTML();
          if (current !== initialValue) {
            editorRef.current.setHTML(initialValue ?? '');
          }
        }
      }, [initialValue]);

  return (
    <div className="flex flex-col">
      <div className="w-full overflow-x-scroll">
        <div
          ref={containerRef}
          className="flex items-center rounded-md bg-white p-3 shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-200 focus-within:ring-offset-2 transition-all duration-300 w-full"
        ></div>
      </div>
    </div>
  );
}