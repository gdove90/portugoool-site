'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),ts=require('typescript'),cp=require('node:child_process');
const text=file=>fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const original=file=>cp.execFileSync('git',['show','7b98ba4:'+file],{encoding:'utf8'});
function moduleFrom(source,mocks={}){
 const exports={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,AbortController,URL,process:{env:{}},require(name){assert(Object.hasOwn(mocks,name),'Unexpected dependency '+name);return mocks[name];}});return exports;
}
const story=moduleFrom(text('src/v84/story-content.js'));
const mocks={'./story-content':story,'./upload-client':{sendIntake(){throw Error('No intake in presentation tests')}},'./number-art':{originalNumberMarkup(){},drawOriginalNumbers(){}}};
const before=moduleFrom(original('src/v84/reference-experience.js'),mocks).referenceExperience();
const after=moduleFrom(text('src/v84/reference-experience.js'),mocks).referenceExperience();
const about=after.markup('about');
const photographs=markup=>[...markup.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]).filter(src=>src.startsWith('/v84/'));
assert.deepEqual(photographs(about),photographs(before.markup('about')),'Original huddle and woman photographs remain in order');
for(const approved of[
 '<h1>Our roots.<br>Our future.</h1>',
 'A goal is just the beginning.<br>Then comes the work.',
 '<h2>The GOAL<br>mindset.</h2>',
 'Soccer is our heritage.', 'Athleticwear is our identity.', 'Evolution is our purpose.',
 'GOAL Athletics is rooted in Rhode Island and inspired by soccer. The game shaped our identity: the discipline, the shared ambition, and the commitment to keep getting better. We carry that spirit beyond the pitch into athleticwear for training, play, and recovery, whatever your sport. Evolution is our purpose. It guides the brand we’re building and reflects the people we’re building it for: people with something to work toward, and the drive to keep going.',
 '<h2><span>Train. Play. Recover.</span><span>Then go again.</span></h2>',
 'src="/brand/goal-athletics-horizontal-black-v13.png" alt="GOAL Athletics" width="3000" height="821"',
 'href="/shop">Shop GOAL Athletics', 'href="/men">Shop men', 'href="/women">Shop women',
])assert(about.includes(approved),'Approved story content: '+approved);
assert(!/MOVE WITH PURPOSE|Movement is our purpose\./.test(about),'Retired purpose wording remains absent');
assert.equal(after.markup('home'),before.markup('home').replace('>Our world <','>Our Story <'));
console.log('PASS Approved story wording, supplied logo, original photographs and unchanged homepage');

// Execute the real importer extraction/template in memory, without its file/asset writes.
const importer=text('scripts/import-v84.cjs'),tree=ts.createSourceFile('import.cjs',importer,ts.ScriptTarget.Latest,true);
const helperNames=new Set(['statements','names']);
const helpers=tree.statements.filter(n=>ts.isFunctionDeclaration(n)&&helperNames.has(n.name.text)).map(n=>n.getText(tree)).join('\n');
function initializer(name){for(const n of tree.statements)if(ts.isVariableStatement(n))for(const d of n.declarationList.declarations)if(d.name.getText(tree)===name)return d.initializer.getText(tree);throw Error('Missing importer variable '+name);}
let joined="function about(){return 'OLD STORY'}\nfunction home(){return '<a>Our world <span>arrow</span></a>'}\nfunction hero(){return 'HERO'}\nfunction brandLockup(){return 'BRAND'}\nfunction references(){}\nfunction goalCampaign(){}\nfunction kitWearPage(){}\nfunction shareGoalsPage(){}";
const labelRule=tree.statements.find(n=>ts.isExpressionStatement(n)&&n.getText(tree).startsWith("joined = joined.replaceAll('>Our world <'"));
assert(labelRule,'Importer retains the approved homepage story label');
joined=new Function('joined',labelRule.getText(tree)+';return joined;')(joined);
const declarations=new Function('ts','joined',helpers+';return '+initializer('declarations'))(ts,joined);
assert(!declarations.includes('OLD STORY'),'Historical source cannot restore the old story');
const bridge=vm.runInNewContext('('+initializer('bridge')+')',{declarations,bindings:''});
const generated=moduleFrom(bridge,mocks).referenceExperience();
assert.equal(generated.markup('about'),story.storyMarkup(()=> 'HERO',()=> 'BRAND'));
assert(generated.markup('home').includes('Our Story'));
console.log('PASS Actual importer template delegates to the canonical story and updates the homepage label');

const shell=text('src/v84/Shell.tsx'),oldShell=original('src/v84/Shell.tsx');
const bag=source=>source.split('<dialog id="bag-dialog"')[1].split('</dialog>')[0];
assert.equal(bag(shell),bag(oldShell),'Add-to-bag drawer presentation/copy unchanged');
assert(!/href=["']\/the-goal-collective|\["\/the-goal-collective"/.test(shell));
assert(!text('src/app/page.tsx').includes('collective-home'));
assert(!text('src/app/sitemap.ts').includes('"the-goal-collective"'));
assert(!shell.includes('Independent.'));assert(shell.includes('OUR STORY')&&shell.includes('"Our Story"'));
assert.equal(text('src/components/Footer.tsx'),original('src/components/Footer.tsx').replace('GOAL Athletics is an independent brand. Not affiliated with,','GOAL Athletics. Not affiliated with,'),'Legal entity and non-affiliation notice preserved');
assert.equal(text('src/app/the-goal-collective/page.tsx'),original('src/app/the-goal-collective/page.tsx'));
assert(text('src/app/about/page.tsx').includes('"Our Story"'));
console.log('PASS Public Collective promotion/links removed, footer non-affiliation and original Collective page retained');

const middleware=moduleFrom(text('src/middleware.ts'),{
 'next/server':{NextResponse:{redirect:(url,status)=>({url:url.href,status})}},
 '@/lib/collection-launch':{TEMPO_COLLECTION_COMING_SOON:false},
 '@/lib/migration-preview':{MIGRATION_PREVIEW:false},
 '@/lib/store-status':{storeClosed:()=>false,SERVICE_PATHS:new Set()},
 '@/lib/gate':{GATE_COOKIE:'fixture',LEGACY_COOKIE:'fixture',gateToken:async()=>{throw Error('Redirect must precede gate')}},
});
(async()=>{for(const path of ['/the-goal-collective','/the-goal-collective/']){
 const url=new URL('https://goalathletics.shop'+path+'?old=1');url.clone=()=>new URL(url);
 const result=await middleware.middleware({nextUrl:url,method:'GET',headers:{get:n=>n==='host'?'goalathletics.shop':null}});
 assert.equal(result.status,307);assert.equal(result.url,'https://goalathletics.shop/shop');
}console.log('PASS Old Collective route temporarily redirects to /shop before storefront handling; no provider calls');})().catch(e=>{console.error(e);process.exitCode=1});
