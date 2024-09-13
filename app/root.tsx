import { Box, Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { Links, Meta, Outlet, Scripts } from '@remix-run/react'
import { ThemeProvider } from 'next-themes'
import './base.css'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider attribute="class">
          <Theme>
            <Box px="4" py="2">
              <Outlet />
            </Box>
          </Theme>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
