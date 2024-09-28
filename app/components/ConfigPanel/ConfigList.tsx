import { Cross2Icon, ResetIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import {
  Badge,
  Box,
  Button,
  ChevronDownIcon,
  Code,
  Flex,
  Grid,
  IconButton,
  Popover,
  RadioGroup,
  Switch,
  Text,
  TextField,
} from '@radix-ui/themes'
import { $rules } from '../../store/lint'
import { useResetAtom } from 'jotai/utils'
import { useCallback, useRef, useTransition } from 'react'
import { useAtom } from 'jotai'
import type { Rules } from '../Diff/util'

export default function ConfigList() {
  const [rules, _setRules] = useAtom($rules)
  const resetRules = useResetAtom($rules)

  const [, startTransition] = useTransition()
  const setRules = useCallback<typeof _setRules>(
    (nextRules) => {
      startTransition(() => {
        _setRules(nextRules)
      })
    },
    [_setRules],
  )

  const rulesEntries = Object.entries(rules)

  const abbrInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Grid
        asChild
        mt="4"
        columns={{
          initial: '1',
          md: '2',
          xl: '3',
        }}
        gap="4"
      >
        <ul>
          {rulesEntries.map(([key, val]) => (
            <Flex
              key={key}
              align={{
                initial: 'start',
                md: 'center',
              }}
              gap={{
                initial: '2',
                md: '4',
              }}
              asChild
              direction={{
                initial: 'column',
                md: 'row',
              }}
            >
              <li>
                <Label htmlFor={key}>
                  <Code>{key}</Code>
                </Label>
                {(key as keyof Rules) === 'unifiedPunctuation' ? (
                  <Flex direction="row" align="center" gap="3" asChild>
                    <RadioGroup.Root
                      id={key}
                      value={val as string}
                      onValueChange={(newVal) => {
                        setRules((r) => ({
                          ...r,
                          unifiedPunctuation: newVal as
                            | 'simplified'
                            | 'traditional',
                        }))
                      }}
                    >
                      {/* Simplified Radio */}
                      <RadioGroup.Item
                        id={`${key}-simplified`}
                        value="simplified"
                      >
                        Simplified
                      </RadioGroup.Item>

                      {/* Traditional Radio */}
                      <RadioGroup.Item
                        id={`${key}-traditional`}
                        value="traditional"
                      >
                        Traditional
                      </RadioGroup.Item>
                    </RadioGroup.Root>
                  </Flex>
                ) : typeof val === 'boolean' ? (
                  <Switch
                    id={key}
                    checked={val as boolean}
                    onCheckedChange={(newVal) =>
                      setRules((r) => ({
                        ...r,
                        [key]: newVal,
                      }))
                    }
                  />
                ) : typeof val === 'string' ? (
                  <TextField.Root
                    name={key}
                    id={key}
                    value={val}
                    onChange={(e) => {
                      setRules((r) => ({
                        ...r,
                        [key]: e.target.value,
                      }))
                    }}
                  />
                ) : (
                  // Abbrs
                  <Popover.Root>
                    <Popover.Trigger>
                      <TextField.Root
                        readOnly
                        value={(val as string[]).join(', ')}
                      >
                        <TextField.Slot side="right">
                          <ChevronDownIcon />
                        </TextField.Slot>
                      </TextField.Root>
                    </Popover.Trigger>

                    <Popover.Content maxWidth="320px" minHeight="auto">
                      <Flex direction="column" gap="3">
                        <Flex wrap="wrap" gap="2">
                          {(val as string[]).map((abbr, index) => (
                            <Badge key={abbr} size="2" radius="full">
                              <Flex gap="1" align="center">
                                <Text size="1">{abbr}</Text>
                                <IconButton
                                  size="1"
                                  variant="ghost"
                                  onClick={() => {
                                    const abbrsCpy = [...(val as string[])]
                                    abbrsCpy.splice(index, 1)

                                    setRules((r) => ({
                                      ...r,
                                      skipAbbrs: abbrsCpy,
                                    }))
                                  }}
                                >
                                  <Cross2Icon />
                                </IconButton>
                              </Flex>
                            </Badge>
                          ))}
                        </Flex>

                        <Flex gap="2" align="center">
                          <TextField.Root
                            ref={abbrInputRef}
                            radius="full"
                            size="1"
                            placeholder="New abbreviation"
                            name="New Abbr Input"
                          />
                          <Button
                            size="1"
                            radius="full"
                            onClick={() => {
                              const value = abbrInputRef.current?.value

                              if (!value) return

                              setRules((r) => ({
                                ...r,
                                skipAbbrs: [...(val as string[]), value],
                              }))

                              abbrInputRef.current!.value = ''
                            }}
                          >
                            Add
                          </Button>
                        </Flex>
                      </Flex>
                    </Popover.Content>
                  </Popover.Root>
                )}
              </li>
            </Flex>
          ))}
        </ul>
      </Grid>
      <Box my="4">
        <Button
          radius="full"
          onClick={() => {
            startTransition(resetRules)
          }}
        >
          <Flex gap="1" align="center">
            <ResetIcon />
            Reset
          </Flex>
        </Button>
      </Box>
    </>
  )
}
