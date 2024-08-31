import type { Dispatch } from 'react'
import { memo, useRef, useState } from 'react'

import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronRightIcon, Cross2Icon, ResetIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import {
  Badge,
  Box,
  Button,
  ChevronDownIcon,
  Code,
  Flex,
  Grid,
  Heading,
  IconButton,
  Popover,
  RadioGroup,
  Section,
  Switch,
  Text,
  TextField,
} from '@radix-ui/themes'
import { cn } from '../../../utils/cn'
import type { Rules } from './util'

export type RULES_ACTION_TYPE =
  | {
      [P in keyof Rules]: {
        type: P
        payload: Rules[P]
      }
    }[keyof Rules]
  | {
      type: 'reset'
      payload: null
    }

interface CProps {
  rules: Rules
  dispatchRules: Dispatch<RULES_ACTION_TYPE>
}

export const Config = memo(function Config({ rules, dispatchRules }: CProps) {
  const rulesEntries = Object.entries(rules)

  const [open, setOpen] = useState(false)

  const abbrInputRef = useRef<HTMLInputElement>(null)

  return (
    <Section pt="0" pb="4">
      <Collapsible.Root {...{ open }} onOpenChange={setOpen}>
        <Collapsible.Trigger>
          <Flex gap="2" align="center">
            <IconButton asChild variant="ghost" size="1">
              <Box>
                <ChevronRightIcon
                  className={cn(
                    'transform transition-transform',
                    open && 'rotate-90',
                  )}
                />
              </Box>
            </IconButton>
            <Heading as="h2">Configuration</Heading>
          </Flex>
        </Collapsible.Trigger>

        <Collapsible.Content>
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
                            dispatchRules({
                              type: 'unifiedPunctuation',
                              payload: newVal as 'simplified' | 'traditional',
                            })
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
                          dispatchRules({
                            type: key as 'noSinglePair',
                            payload: newVal,
                          })
                        }
                      />
                    ) : typeof val === 'string' ? (
                      <TextField.Root
                        name={key}
                        id={key}
                        value={val}
                        onChange={(e) =>
                          dispatchRules({
                            type: key as 'halfwidthPunctuation',
                            payload: e.target.value,
                          })
                        }
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
                                        dispatchRules({
                                          type: 'skipAbbrs',
                                          payload: abbrsCpy,
                                        })
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
                                id="new-abbr-input"
                                placeholder="New abbreviation"
                                name="New Abbr Input"
                              />
                              <Button
                                size="1"
                                id="add-abbreviation"
                                radius="full"
                                onClick={() => {
                                  const value = abbrInputRef.current?.value

                                  if (!value) return

                                  dispatchRules({
                                    type: 'skipAbbrs',
                                    payload: [...(val as string[]), value],
                                  })

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
              onClick={() => dispatchRules({ type: 'reset', payload: null })}
            >
              <Flex gap="1" align="center">
                <ResetIcon />
                Reset
              </Flex>
            </Button>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Section>
  )
})
