import { Flex, Heading, Link, Section } from '@radix-ui/themes'
// import { Provider } from 'jotai'
import { DiffView, Editor } from '../components/Diff'
import { Config } from '../components/Diff/src/Config'
import { Toolbar } from '../components/Toolbar'
// import { $editorViewStore } from '../store/cm'
// import { $docStore } from '../store/doc'

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
        {/* <Provider store={$editorViewStore}> */}
          {/* <Provider store={$docStore}> */}
            <Config />
            <Toolbar />
            <Flex direction="column" gap="4">
              {/* Editor */}
              <Editor />
              {/* Diff View */}
              <DiffView />
            </Flex>
          {/* </Provider> */}
        {/* </Provider> */}
      </Section>
    </>
  )
}
