import { Box, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import type { Change } from 'diff'
import { diffChars } from 'diff'
import { memo } from 'react'

import { cn } from '../../../utils/cn'
import { LineNumber } from './LineNumber'

interface DVProps {
  changes: Change[]
}

export const DiffView = memo(function DiffView({ changes }: DVProps) {
  return (
    <Card>
      <Grid columns="2" align="stretch" overflow="auto">
        {changes.length ? (
          <>
            <Heading mb="2" as="h3" size="3">
              Before
            </Heading>
            <Heading mb="2" as="h3" size="3">
              After
            </Heading>
            {generateDiffView(changes)}
          </>
        ) : (
          <Heading
            color="gray"
            as="h2"
            size="3"
            weight="medium"
            className="col-span-2 mx-auto tracking-wide"
          >
            Diff View
          </Heading>
        )}
      </Grid>
    </Card>
  )
})

/**
 * An abstraction of text elements emitted by diffing.
 */
interface Token {
  type: 'added' | 'removed' | 'ignored' | 'normal'
  value: string
}

/**
 * Parse line diffs and generate diff views.
 * @param diffs Line diffs.
 * @returns `JSX.Element`s
 */
function generateDiffView(diffs: Change[]) {
  const diffsCpy = [...diffs]
  const result = []

  /** Line Number */
  let count = 1
  while (diffsCpy.length) {
    const firstChange = diffsCpy.shift() as Change
    if (firstChange.removed) {
      const secondChange = diffsCpy.shift() as Change
      const [leftPre, rightPre] = parseLineDiff(firstChange, secondChange)

      result.push(
        parsePres(leftPre, 'left', count),
        parsePres(rightPre, 'right', count),
      )
      count++
    } else if (!firstChange.added) {
      const normalCellLeft = (
        <Flex
          align='stretch'
          className="rounded-l-sm bg-white dark:bg-black"
        >
          <LineNumber no={count} />
          <Box flexGrow="1">
            <Text size='2' wrap="wrap">{escapeHTMLTags(firstChange.value)}</Text>
          </Box>
        </Flex>
      )
      const normalCellRight = (
        <Flex
          align='stretch'
          className="rounded-r-sm bg-white dark:bg-black"
        >
          <LineNumber no={count} />
          <Box flexGrow="1">
            <Text size='2' wrap="wrap">{escapeHTMLTags(firstChange.value)}</Text>
          </Box>
        </Flex>
      )
      count++
      result.push(normalCellLeft, normalCellRight)
    }
  }

  return result
}

/**
 * Diff in chars.
 * @param removed The removed change returned by `diffLines()`.
 * @param added The added change returned by `diffLines()`.
 * @returns Token lists.
 */
function parseLineDiff(removed: Change, added: Change) {
  const diffs = diffChars(removed.value, added.value)

  const leftPre: Token[] = diffs
    .filter(({ added }) => !added)
    .map(({ removed, value }) => {
      return {
        type: removed ? 'removed' : 'normal',
        value,
      }
    })

  const rightPre: Token[] = diffs
    .filter(({ removed }) => !removed)
    .map(({ added, value }) => {
      return {
        type: added ? 'added' : 'normal',
        value,
      }
    })

  return [leftPre, rightPre] as const
}

/**
 * Parse a list of `Token`s to `JSX.Element`s.
 * @param pres A list of `Token`s.
 * @param side Left or right.
 * @param lineNumber The line number of the code.
 */
function parsePres(pres: Token[], side: 'left' | 'right', lineNumber: number) {
  return (
    <Flex
      align='stretch'
      className={cn(
        side === 'left'
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-green-100 dark:bg-green-900',
        side === 'left' ? 'rounded-l-sm' : 'rounded-r-md',
      )}
    >
      <LineNumber no={lineNumber} />
      <Box flexGrow="1" overflow='auto'>
        {pres.map(({ type, value }, i) => {
          return (
            <Text
              key={`${i + 1}-token-${type}`}
              size='2'
              color={
                type === 'added' ? 'green' : type === 'removed' ? 'red' : 'gray'
              }
              className={cn(
                type === 'added' ? 'bg-green-300 dark:bg-green-700' : '',
                type === 'removed' ? 'bg-red-300 dark:bg-red-700' : '',
                'whitespace-pre rounded-sm',
              )}
            >
              {escapeHTMLTags(value)}
            </Text>
          )
        })}
      </Box>
    </Flex>
  )
}

/**
 * Escape html specific tags
 * @param str The value of an instance of `Token`.
 */
function escapeHTMLTags(str: string) {
  const result: (JSX.Element | string)[] = []
  const segs = str.split('\n')
  result.unshift(
    ...segs
      .reduce<typeof result>((prev, curr, index) => {
        if (curr) {
          prev.push(curr, <br key={`${index + 1}-br`} />)
        } else {
          prev.push(<br key={`${index + 1}-br`} />)
        }

        return prev
      }, [])
      // Remove the trailing line break.
      .slice(0, -1),
  )
  return result
}
