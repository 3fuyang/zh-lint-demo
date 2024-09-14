import { CheckIcon, CopyIcon, EraserIcon } from '@radix-ui/react-icons'
import {
  Button,
  DropdownMenu,
  Flex,
  Strong,
  Text,
  Theme,
} from '@radix-ui/themes'
import { useAtomValue } from 'jotai'
import { Suspense, useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import { $editorView } from '../store/cm'
import { $doc } from '../store/doc'
import { $lint, $lintResult } from '../store/lint'
import { PRESETS } from './Diff/util'

export function Toolbar() {
  const doc = useAtomValue($doc)
  const editorView = useAtomValue($editorView)
  const lintResult = useAtomValue($lintResult)

  const [, copyToClipboard] = useCopyToClipboard()

  const [showCopied, setShowCopied] = useState(false)

  return (
    <Flex mb="4" gap="2" justify="between" wrap="wrap" align="center">
      <Flex gap="2" align="center" wrap="wrap">
        <Theme asChild>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft">
                Presets
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              {PRESETS.map((preset, i) => (
                <DropdownMenu.Item
                  key={i}
                  onSelect={() => {
                    console.log({ editorView })
                    editorView?.dispatch({
                      changes: { from: 0, to: doc.length, insert: preset },
                    })
                  }}
                >
                  Preset {i + 1}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Theme>
      </Flex>

      <Suspense>
        <DurationLine />
      </Suspense>

      <Flex gap="2" wrap="wrap">
        <Button
          color="grass"
          variant={showCopied ? 'soft' : 'solid'}
          onClick={async () => {
            try {
              if (!lintResult) {
                return
              }

              await copyToClipboard(lintResult)
              setShowCopied(true)
              window.setTimeout(() => setShowCopied(false), 2000)
            } catch (err) {
              console.error(err)
            }
          }}
        >
          <Flex align="center" gap="2">
            {showCopied ? <CheckIcon /> : <CopyIcon />}
            {showCopied ? 'Copied!' : 'Copy'}
          </Flex>
        </Button>
        <Button
          color="red"
          onClick={() => {
            editorView?.dispatch({
              changes: { from: 0, to: doc.length, insert: '' },
            })
          }}
        >
          <Flex align="center" gap="2">
            <EraserIcon />
            Clear
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}

function DurationLine() {
  const { charCount, duration } = useAtomValue($lint)

  return (
    <Text color="gray" wrap="pretty">
      <Strong>{charCount} chars</Strong>
      &nbsp;processed in&nbsp;
      <Strong>{duration.toFixed(2)}ms</Strong>
    </Text>
  )
}
