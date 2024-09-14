import { fdir } from 'fdir'
import { readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { inspect } from 'node:util'
import oxcParser from 'oxc-parser'
import oxcTransform from 'oxc-transform'

/**
 * Scan the project and extract all used Radix UI components.
 * @return List of component names in kebab-case.
 * @example
 * ```tsx
 * const components = extractRadixThemesComponents()
 * // Output: ['heading', 'button', 'radio-group']
 * ```
 */
export async function extractRtComponents(): Promise<string[]> {
  const api = new fdir()
    .withBasePath()
    .filter((path) => path.endsWith('.tsx'))
    .crawl('./app')

  const files = api.sync()

  for (const file of files) {
    const src = readFileSync(resolve(process.cwd(), file), 'utf-8')

    const transformed = oxcTransform.transform(basename(file), src)
    const { imports } = oxcParser.moduleLexerSync(transformed.code, {
      sourceType: 'module',
    })

    const rtImports = imports.filter((i) => i.n === '@radix-ui/themes')

    console.log({
      rtImports,
    })
  }
}

extractRtComponents()
