import type { Options } from 'zhlint'
import type { DeprecatedOptions } from 'zhlint/lib/rules/util'

type RuleOptions = NonNullable<Options['rules']>

export type Rules = Required<
  Omit<RuleOptions, keyof DeprecatedOptions | 'preset'>
>

export function initDefaultRules(): Rules {
  return {
    // parsing
    noSinglePair: true,

    // punctuation
    halfwidthPunctuation: `()`,
    fullwidthPunctuation: `，。：；？！“”‘’`,
    adjustedFullwidthPunctuation: `“”‘’`,
    unifiedPunctuation: `simplified`,

    // case: abbrs
    skipAbbrs: [
      'Mr.',
      'Mrs.',
      'Dr.',
      'Jr.',
      'Sr.',
      'vs.',
      'etc.',
      'i.e.',
      'e.g.',
      'a.k.a',
    ],

    // space around content
    spaceBetweenHalfwidthContent: true,
    noSpaceBetweenFullwidthContent: true,
    spaceBetweenMixedwidthContent: true,

    // space around punctuation
    noSpaceBeforePauseOrStop: true,
    spaceAfterHalfwidthPauseOrStop: true,
    noSpaceAfterFullwidthPauseOrStop: true,

    // space around quote
    spaceOutsideHalfwidthQuotation: true,
    noSpaceOutsideFullwidthQuotation: true,
    noSpaceInsideQuotation: true,

    // space around bracket
    spaceOutsideHalfwidthBracket: true,
    noSpaceOutsideFullwidthBracket: true,
    noSpaceInsideBracket: true,

    // space around code
    spaceOutsideCode: true,

    // space around mark
    noSpaceInsideHyperMark: true,

    // trim space
    trimSpace: true,

    // case: number x Chinese unit
    skipZhUnits: `年月日天号时分秒`,

    /* SKIP PURE WESTERN SENTENCES */
    skipPureWestern: true,
  }
}

export const PRESETS = [
  `# Overview

半角逗号加空格结尾, "半角括号包裹"，半角冒号结尾:

+ 全角句号结尾。
+ 全半角内容之间no空格`,
  `- 当注释用来描述代码时，应该保证使用 **描述性语句** 而非 **祈使句**

    - Opens the file   (正确)
    - Open the file    (错误)

- 使用 "this" 而非"the"来指代当前事物

    - Gets the toolkit for this component   (推荐)
    - Gets the toolkit for the component    (不推荐)`,
]
