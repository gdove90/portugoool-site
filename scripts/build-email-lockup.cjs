// Uses the exact published V1.3 component paths; never the proof V1.2 export.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),sharp=require('sharp');
function component(name){const file=path.resolve('src/components/'+name+'.tsx'),m=new Module(file,module);m.filename=file;m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,file);return m.exports.default;}
(async()=>{
 const svg=renderToStaticMarkup(React.createElement('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 1127 272',width:2254,height:544,style:{color:'#ffffff'}},
 React.createElement(component('GAMonogram'),{x:0,y:22,width:230,height:228}),React.createElement(component('BrandWordmark'),{x:260,y:0,width:867,height:272})));
 await sharp(Buffer.from(svg)).png().toFile('public/brand/goal-athletics-email-lockup-white.png');
 await sharp(Buffer.from(svg)).flatten({background:'#090909'}).png().toFile('public/brand/goal-athletics-gmail-lockup.png');
 fs.mkdirSync('work',{recursive:true});fs.writeFileSync('work/email-lockup-source.svg',svg);
 console.log('Exact V1.3 GA and 13 outlined letters exported to email/Gmail PNGs at 2254 x 544.');
})();
