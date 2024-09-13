import { atom } from 'jotai'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const $editorState = atom<EditorState>()

export const $editorView = atom<EditorView>()
