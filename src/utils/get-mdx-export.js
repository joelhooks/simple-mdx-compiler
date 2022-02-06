import * as React from 'react'
import * as _jsx_runtime from 'react/jsx-runtime.js'
import * as ReactDOM from 'react-dom'

export function getMDXExport(code, globals) {
  const scope = {React, ReactDOM, _jsx_runtime, ...globals}
  // eslint-disable-next-line
  const fn = new Function(...Object.keys(scope), code)
  return fn(...Object.values(scope)).default
}