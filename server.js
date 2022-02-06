import path from 'path'
import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import {globalExternals} from '@fal-works/esbuild-plugin-global-externals'
import {NodeResolvePlugin} from '@esbuild-plugins/node-resolve'
import {StringDecoder} from 'string_decoder'
import { inMemoryPlugin } from './in-memory-plugin.js'
import { getMDXExport } from './get-mdx-export.js'
import express from 'express'
import ReactDOMServer from 'react-dom/server.js'
import * as React from 'react'

const app = express()

const cwd = path.join(process.cwd(), `__mdx_bundler_fake_dir__`)
const globals = {}

let code

// use esbuild in node to bundle our mdx
// in this case its just a local file
const bundled = await esbuild.build({
    entryPoints: ['./index.mdx'],
    write: false,
    plugins: [globalExternals({
        ...globals,
        react: {
          varName: 'React',
          type: 'cjs',
        },
        'react-dom': {
          varName: 'ReactDOM',
          type: 'cjs',
        },
        'react/jsx-runtime': {
          varName: '_jsx_runtime',
          type: 'cjs',
        },
      }),
      // ask kent whats the inMemoryPlugin for?
      // I just made a stripped down version here
      inMemoryPlugin,
      NodeResolvePlugin({
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        resolveOptions: {basedir: cwd},
      }),
      mdx({/* Options… */})
    ],
    bundle: true,
    format: 'iife',
    globalName: 'Component',
    minify: true,
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
})

if (bundled.outputFiles) {
    const decoder = new StringDecoder('utf8')
    code = decoder.write(Buffer.from(bundled.outputFiles[0].contents))
    code = `${code};return Component;`
} else {
  throw new Error('no files?')
}

// using the bundled output, make it a component
// direct rip from mdx-bundler and not sure I understand
const ComponentClass = getMDXExport(code)


// gonna use express just to see if this thing works
app.listen(3000, () => {
  console.log('listening')
})

app.get('/', (req, res) => {
  const element = React.createElement(ComponentClass)
  const component = ReactDOMServer.renderToString(element)
  const html = `<body><div id="root">${component}</body>`
  res.send(html)
})