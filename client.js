import {run} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime.js'

const code = `/*@jsxRuntime automatic @jsxImportSource react*/
const {jsx: _jsx} = arguments[0];
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1"
    }, props.components);
    return _jsx(_components.h1, {
      children: "hi"
    });
  }
}
return {
  default: MDXContent
};`

const {default: Content} = await run(code, runtime)

console.log(Content)