// import purgecss from '@fullhuman/postcss-purgecss'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    // process.env.NODE_ENV === 'production' && purgecss({
    //   content: [],
    //   variables: true,
    //   rejected: true,
    // }),
  ],
}
