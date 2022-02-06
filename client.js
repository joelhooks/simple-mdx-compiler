import {run} from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime.js'

const code = `var Component = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };
  var __toCommonJS = /* @__PURE__ */ ((cache) => {
    return (module, temp) => {
      return cache && cache.get(module) || (temp = __reExport(__markAsModule({}), module, 1), cache && cache.set(module, temp), temp);
    };
  })(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

  // global-externals:react/jsx-runtime
  var require_jsx_runtime = __commonJS({
    "global-externals:react/jsx-runtime"(exports, module) {
      module.exports = _jsx_runtime;
    }
  });

  // global-externals:react
  var require_react = __commonJS({
    "global-externals:react"(exports, module) {
      module.exports = React;
    }
  });

  // index.mdx
  var simple_mdx_compiler_exports = {};
  __export(simple_mdx_compiler_exports, {
    default: () => simple_mdx_compiler_default
  });
  var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);

  // cool.jsx
  var React2 = __toESM(require_react(), 1);
  var Cool = () => {
    return /* @__PURE__ */ React2.createElement("h1", null, "this is cool!");
  };
  var cool_default = Cool;

  // index.mdx
  function MDXContent(props = {}) {
    const { wrapper: MDXLayout } = props.components || {};
    return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, Object.assign({}, props, {
      children: (0, import_jsx_runtime.jsx)(_createMdxContent, {})
    })) : _createMdxContent();
    function _createMdxContent() {
      const _components = Object.assign({
        h1: "h1"
      }, props.components);
      return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
        children: [(0, import_jsx_runtime.jsx)(_components.h1, {
          children: "hi"
        }), "\n", (0, import_jsx_runtime.jsx)(cool_default, {})]
      });
    }
  }
  var simple_mdx_compiler_default = MDXContent;
  return __toCommonJS(simple_mdx_compiler_exports);
})();
;return Component;`

const {default: Content} = await run(code, runtime)

console.log(Content)