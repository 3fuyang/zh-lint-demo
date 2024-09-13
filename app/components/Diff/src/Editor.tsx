import { markdown } from '@codemirror/lang-markdown'
import { EditorView, placeholder } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useTransition } from 'react'
import { $editorView } from '../../../store/cm'
import { $doc } from '../../../store/doc'

export function Editor() {
  const editorRootRef = useRef<HTMLDivElement>(null)
  const [, startTransition] = useTransition()
  const setEditorView = useSetAtom($editorView)
  const setDoc = useSetAtom($doc)

  useEffect(() => {
    if (!editorRootRef.current) {
      return
    }

    const editor = new EditorView({
      extensions: [
        basicSetup,
        placeholder('Type content which needs linting here.'),
        markdown(),
        EditorView.updateListener.of((update) => {
          const doc = update.state.doc.toString()

          if (update.docChanged) {
            startTransition(() => {
              setDoc(doc)
            })
          }
        }),
      ],
      parent: editorRootRef.current,
    })

    setEditorView(editor)

    return () => editor.destroy()
  }, [])

  return <div id="editor-root" ref={editorRootRef} />
}
