import { Flex, Section } from '@radix-ui/themes'
import { Suspense, type PropsWithChildren } from 'react'
import { Config } from './Config'
import { DiffView } from './DiffView'

export function Diff({ children }: PropsWithChildren) {
  return (
    <Section py="0">
      {/* Config Form */}
      <Config />
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
