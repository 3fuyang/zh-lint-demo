import { Box, Flex, Heading, Link, Section, Skeleton } from '@radix-ui/themes'
import { DiffView } from '../components/Diff/DiffView'
import { ConfigPanel } from '../components/ConfigPanel'
import { Toolbar } from '../components/Toolbar'
import { lazy, Suspense } from 'react'
import type { MetaFunction } from '@remix-run/react'

const Editor = lazy(() => import('../components/Editor'))

export const meta: MetaFunction = () => {
  return [{ title: `Zhlint Playground` }];
}

export default function Index() {
  return (
    <>
      <Section pt="0" pb="8">
        <Flex justify="between" align="center">
          <Heading as="h1"> Zhlint Playground </Heading>
          <Link
            href="https://github.com/3fuyang/zh-lint-demo"
            target="_blank"
            rel="noreferrer noopener nofollow"
          >
            GitHub
          </Link>
        </Flex>
      </Section>
      <Section pt="0" pb="8">
        This is a playground for&nbsp;
        <Link
          href="https://github.com/Jinjiang/zhlint"
          target="_blank"
          rel="noreferrer nofollow noopener"
        >
          zhlint
        </Link>
        .
      </Section>
      <Section py="0">
        <ConfigPanel />
        <Toolbar />
        <Flex direction="column" gap="4">
          <Suspense
            fallback={
              <Skeleton>
                <Box height='30.4px' />
              </Skeleton>
            }
          >
            <Editor />
          </Suspense>
          <DiffView />
        </Flex>
      </Section>
    </>
  )
}
