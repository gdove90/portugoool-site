const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = 'C:/Users/gdove/OneDrive/Desktop/GOOOL';
const ts = require(path.join(root, 'node_modules/typescript/lib/typescript.js'));
function readModule(name) {
  const source = fs.readFileSync(path.join(root, 'src/lib', name + '.ts'), 'utf8');
  const context = { exports: {}, require: x => { if (x !== './types') throw Error(x); return readModule('types'); } };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
  return context.exports;
}
const products = readModule('products').getProducts();
fs.writeFileSync(path.join(__dirname, 'catalog.json'), JSON.stringify(products, null, 2));
console.log(JSON.stringify(products.map(p => ({ slug: p.slug, colors: p.colorVariants?.map(c => ({name:c.name,supplierColor:c.supplierColor})) || [p.color], sizes:p.sizes })), null, 2));
