// Rasterize the existing approved V1.3 outlined wordmark. No tracing or new lettering.
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const sharp = require('sharp');
(async () => {
  const file = require('node:path').resolve('src/components/BrandWordmark.tsx');
  const compiled = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const m = new Module(file,module); m.filename=file; m.paths=module.paths; m._compile(compiled,file);
  const svg=renderToStaticMarkup(React.createElement(m.exports.default,{xmlns:'http://www.w3.org/2000/svg',width:1734,height:544,style:{color:'#ffffff'}}));
  await sharp(Buffer.from(svg)).png().toFile('public/brand/goal-athletics-email-wordmark-white.png');
  console.log('Approved V1.3 wordmark rasterized at 1734 x 544 with transparency.');
})();
