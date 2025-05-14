import React, { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor, { EditorOptions } from '@toast-ui/editor';

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
      editorRef.current = new Editor({
        el: containerRef.current as HTMLElement,
        height: 'auto',
        width: 'auto',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical',
        initialValue: '',
        customHTMLSanitizer: (html: string): string => html,
      } as EditorOptions);

      if (initialValue) {
        editorRef.current.setHTML(initialValue);
      }

      editorRef.current.on('change', () => {
        if (onChange && editorRef.current) {
          const htmlContent = editorRef.current.getHTML();
          onChange(htmlContent);
        }
      });
    }

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
    <div className="flex flex-col w-full">
      <div className="w-full overflow-x-scroll">
        <div
          ref={containerRef}
          className="flex items-center rounded-md bg-white p-3 shadow-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-200 focus-within:ring-offset-2 transition-all duration-300 w-full"
        ></div>
      </div>
    </div>
  );
}