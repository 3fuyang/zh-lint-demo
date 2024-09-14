import { Flex, Section } from '@radix-ui/themes'
import { Suspense, type PropsWithChildren } from 'react'
import { ConfigPanel } from '../ConfigPanel'
import { DiffView } from './DiffView'

export function Diff({ children }: PropsWithChildren) {
  return (
    <Section py="0">
      {/* Config Form */}
      <ConfigPanel />
      <Flex direction="column" gap="4">
        {/* Editor */}
        {children}
        {/* Diff View */}
        <Suspense>
          <DiffView />
        </Suspense>
      </Flex>
    </Section>
  )
}
