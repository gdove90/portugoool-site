// Test-only loader for the bounded, local TypeScript/JSON presentation graph.
// Never loads providers, credentials, a Next server, or arbitrary packages.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
function createSourceLoader({ overrides = {} } = {}) {
  const cache = new Map();
  function resolve(file) {
    const full = path.resolve(root, file);
    if (!full.startsWith(path.join(root, 'src') + path.sep)) throw new Error('Test loader refuses non-source path: ' + file);
    const found = [full, full + '.ts', full + '.js', full + '.json'].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
    if (!found) throw new Error('Missing test dependency: ' + file);
    return found;
  }
  function load(file) {
    const full = resolve(file);
    if (Object.hasOwn(overrides, path.relative(root, full).replaceAll(path.sep, '/'))) return overrides[path.relative(root, full).replaceAll(path.sep, '/')];
    if (cache.has(full)) return cache.get(full);
    if (full.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(full, 'utf8')); cache.set(full, data); return data;
    }
    const exports = {}; cache.set(full, exports);
    const compiled = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const context = { exports, URL, require(name) {
      if (!name.startsWith('.') && !name.startsWith('@/')) throw new Error('Test loader refuses package/provider: ' + name);
      return load(name.startsWith('@/') ? path.join('src', name.slice(2)) : path.relative(root, path.resolve(path.dirname(full), name)));
    } };
    vm.runInNewContext(compiled, context, { filename: full, timeout: 5000 });
    return exports;
  }
  return load;
}
module.exports = { createSourceLoader, root };
