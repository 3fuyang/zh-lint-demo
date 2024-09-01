import {
  CheckIcon,
  CopyIcon,
  EraserIcon,
  MagicWandIcon,
} from '@radix-ui/react-icons'
import {
  Button,
  DropdownMenu,
  Flex,
  Section,
  Strong,
  Text,
  Theme,
} from '@radix-ui/themes'
import { diffLines, type Change } from 'diff'
import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

import { Config, type RULES_ACTION_TYPE } from './Config'
import { DiffView } from './DiffView'
import { Editor } from './Editor'
import { PRESETS, initDefaultRules, type Rules } from './util'

const initialChanges: Change[] = []

type CHANGES_ACTION_TYPE =
  | {
      type: 'reset'
    }
  | {
      type: 'lint'
      payload: Change[]
    }

function changesReducer(
  _prevState: typeof initialChanges,
  action: CHANGES_ACTION_TYPE,
) {
  switch (action.type) {
    case 'lint':
      return [...action.payload]
    case 'reset':
      return []
    default:
      throw new Error(`Unexpected action type detected!`)
  }
}

const initialRules: Rules = initDefaultRules()

function rulesReducer(prevState: Rules, action: RULES_ACTION_TYPE) {
  if (action.type === 'reset') {
    return initialRules
  }
  return {
    ...prevState,
    [action.type]: action.payload,
  }
}

export function Diff() {
  const [, copyToClipboard] = useCopyToClipboard()

  const [, startTransition] = useTransition()

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const inputRef = useRef('')

  const [changes, dispatchChanges] = useReducer(changesReducer, initialChanges)
  const [rules, dispatchRules] = useReducer(rulesReducer, initialRules)

  const [result, setResult] = useState('')

  const [showCopied, setShowCopied] = useState(false)

  const [charCount, setCharCount] = useState(0)
  const [duration, setDuration] = useState(0)

  const triggerLint = useCallback(async () => {
    if (!inputRef.current) {
      alert('Invalid input.')
      return
    }

    const start = performance.now()

    const result = (await import('zhlint')).run(inputRef.current, {
      rules: {
        ...rules,
        preset: '',
      },
    }).result
    const lineDiffs = diffLines(inputRef.current, result, {
      ignoreWhitespace: false,
    })

    const end = performance.now()

    setResult(result)
    setCharCount(inputRef.current.length)
    setDuration(end - start)

    // Trigger a state transition.
    startTransition(() => {
      dispatchChanges({ type: 'lint', payload: lineDiffs })
    })
  }, [rules])

  const ButtonBox = useMemo(() => {
    return (
      <Flex mb="4" gap="2" justify="between" wrap="wrap" align="center">
        <Flex gap="2" align="center" wrap="wrap">
          <Button id="lint-btn" onClick={triggerLint}>
            <Flex align="center" gap="2">
              <MagicWandIcon />
              Lint
            </Flex>
          </Button>

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
                      inputRef.current = preset
                      if (editorRef.current) {
                        editorRef.current.value = preset
                        triggerLint()
                      }
                    }}
                  >
                    Preset {i + 1}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Theme>
        </Flex>

        {duration ? (
          <Text color="gray" wrap="pretty">
            <Strong>{charCount} chars</Strong>
            &nbsp;processed in&nbsp;
            <Strong>{duration.toFixed(2)}ms</Strong>
          </Text>
        ) : (
          ''
        )}

        <Flex gap="2" wrap="wrap">
          <Button
            color="grass"
            variant={showCopied ? 'soft' : 'solid'}
            onClick={async () => {
              try {
                await copyToClipboard(result)
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
            id="clr-btn"
            color="red"
            onClick={() => {
              inputRef.current = ''
              if (editorRef.current) {
                editorRef.current.value = ''
                dispatchChanges({ type: 'reset' })
              }
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
  }, [triggerLint, showCopied, copyToClipboard, result])

  return (
    <Section py="0">
      {/* Config Form */}
      <Config {...{ rules, dispatchRules }} />
      {/* Btn Box */}
      {ButtonBox}
      <Flex direction="column" gap="4">
        {/* Editor */}
        <Editor
          ref={editorRef}
          onChange={(e) => (inputRef.current = e.target.value)}
        />
        {/* Diff View */}
        <DiffView {...{ changes }} />
      </Flex>
    </Section>
  )
}
