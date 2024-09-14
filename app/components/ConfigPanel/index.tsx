import { lazy, memo, Suspense, useState } from 'react'

import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Reset,
  Section,
  Spinner,
} from '@radix-ui/themes'
import { cn } from '../../utils/cn'
import type { Rules } from '../Diff/util'

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

const ConfigList = lazy(() => import('./ConfigList'))

export const ConfigPanel = memo(function ConfigPanel() {
  const [open, setOpen] = useState(false)

  return (
    <Section pt="0" pb="4">
      <Collapsible.Root {...{ open }} onOpenChange={setOpen}>
        <Reset>
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
        </Reset>

        <Collapsible.Content>
          <Suspense
            fallback={
              <Spinner size='3' />
            }
          >
            <ConfigList />
          </Suspense>
        </Collapsible.Content>
      </Collapsible.Root>
    </Section>
  )
})
