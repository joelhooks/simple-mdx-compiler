import path from 'path'
import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import {globalExternals} from '@fal-works/esbuild-plugin-global-externals'
import {NodeResolvePlugin} from '@esbuild-plugins/node-resolve'
import {StringDecoder} from 'string_decoder'
import { inMemoryPlugin } from './src/in-memory-plugin.js'
import { getMDXExport } from './get-mdx-export.js'
import express from 'express'
import ReactDOMServer from 'react-dom/server.js'
import * as React from 'react'
import mjml2html from 'mjml'

const app = express()

const cwd = path.join(process.cwd(), `__mdx_bundler_fake_dir__`)
const globals = {}

let code

const wrapper = `<mjml>
    <mj-head>
      <mj-font
        name="Inter"
        // href="https://fonts.googleapis.com/css?family=Inter"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
      />
      <mj-font
        name="JetBrains Mono"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
      />
      <mj-attributes>
        <mj-column />
        <mj-all font-family="Inter, sans-serif" />
        <mj-text font-size="16px" line-height="1.8" color="#0A2649" />
      </mj-attributes>
      <mj-style inline="inline">{styles}</mj-style>
      <mj-raw>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </mj-raw>
    </mj-head>
    <mj-body background-color="#ffffff">
      {/* header */}
      <mj-section padding="0">
        <mj-column>
          <mj-image
            padding="0"
            src="https://res.cloudinary.com/typescript-course/image/upload/v1643999427/TypeScript%20Email%20Course/email-header_2x.png"
          />
        </mj-column>
      </mj-section>
      {/* content */}
      <mj-section>
        <mj-column>{props.children}</mj-column>
      </mj-section>
    </mj-body>
  </mjml>`

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

  const markup = ReactDOMServer.renderToStaticMarkup(
   React.createElement('div', {}, element)
  )

  console.log(markup)

  const html2 = mjml2html(markup).html

  console.log(html2)
  const component = ReactDOMServer.renderToString(element)
  const html = `<body><div id="root">${component}</body>`
  res.send(html)
})