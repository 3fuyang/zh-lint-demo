import { diffLines, type Change } from 'diff'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import { initDefaultRules, type Rules } from '../components/Diff/util'
import { $doc } from './doc'

export const $rules = atomWithReset<Rules>(initDefaultRules())

interface LintResult {
  result: string
  lineDiffs: Change[]
  duration: number
  charCount: number
}

export const $lint = atom<Promise<LintResult>>(async (get) => {
  const doc = get($doc)

  if (!doc) {
    return {
      result: '',
      lineDiffs: [],
      duration: 0,
      charCount: 0,
    }
  }

  const start = performance.now()

  const { result } = (await import('zhlint')).run(doc, {
    rules: {
      ...get($rules),
      preset: '',
    },
  })

  const lineDiffs = diffLines(doc, result, {
    ignoreWhitespace: false,
  })

  const end = performance.now()

  return {
    result,
    lineDiffs,
    duration: end - start,
    charCount: doc.length,
  }
})

export const $lintResult = atom(async (get) => {
  const { result } = await get($lint)

  return result
})
