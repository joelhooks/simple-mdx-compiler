import {compile} from '@mdx-js/mdx'

const code = String(await compile('# hi', {outputFormat: 'function-body' /* …otherOptions */ }))
// To do: send `code` to the client somehow.

console.log(code)