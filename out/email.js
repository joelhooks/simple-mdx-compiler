import path from 'path';
import esbuild from 'esbuild';
import mdx from '@mdx-js/esbuild';
import { globalExternals } from '@fal-works/esbuild-plugin-global-externals';
import { NodeResolvePlugin } from '@esbuild-plugins/node-resolve';
import { StringDecoder } from 'string_decoder';
import { inMemoryPlugin } from './in-memory-plugin.js';
import { getMDXExport } from './get-mdx-export.js';
import express from 'express';
import ReactDOMServer from 'react-dom/server.js';
import * as React from 'react';
import mjml2html from 'mjml';
const app = express();
const cwd = path.join(process.cwd(), `__mdx_bundler_fake_dir__`);
const globals = {};
let code;
const mdxComponents = {
    wrapper: (props) => (React.createElement("mjml", null,
        React.createElement("mj-head", null,
            React.createElement("mj-font", { name: "Inter", 
                // href="https://fonts.googleapis.com/css?family=Inter"
                href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" }),
            React.createElement("mj-font", { name: "JetBrains Mono", href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" }),
            React.createElement("mj-attributes", null,
                React.createElement("mj-column", null),
                React.createElement("mj-all", { "font-family": "Inter, sans-serif" }),
                React.createElement("mj-text", { "font-size": "16px", "line-height": "1.8", color: "#0A2649" })),
            React.createElement("mj-style", { inline: "inline" }, ``),
            React.createElement("mj-raw", null,
                React.createElement("meta", { name: "color-scheme", content: "light" }),
                React.createElement("meta", { name: "supported-color-schemes", content: "light" }))),
        React.createElement("mj-body", { "background-color": "#ffffff" },
            React.createElement("mj-section", { padding: "0" },
                React.createElement("mj-column", null,
                    React.createElement("mj-image", { padding: "0", src: "https://res.cloudinary.com/typescript-course/image/upload/v1643999427/TypeScript%20Email%20Course/email-header_2x.png" }))),
            React.createElement("mj-section", null,
                React.createElement("mj-column", null, props.children)))))
};
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
            resolveOptions: { basedir: cwd },
        }),
        mdx({ /* Options… */})
    ],
    bundle: true,
    format: 'iife',
    globalName: 'Component',
    minify: true,
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
});
if (bundled.outputFiles) {
    const decoder = new StringDecoder('utf8');
    code = decoder.write(Buffer.from(bundled.outputFiles[0].contents));
    code = `${code};return Component;`;
}
else {
    throw new Error('no files?');
}
// using the bundled output, make it a component
// direct rip from mdx-bundler and not sure I understand
const ComponentClass = getMDXExport(code);
const element = React.createElement(ComponentClass, { components: mdxComponents });
const markup = ReactDOMServer.renderToStaticMarkup(element);
console.log(markup);
const html2 = mjml2html(markup).html;
console.log(html2);
