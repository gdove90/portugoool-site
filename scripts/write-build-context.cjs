const fs = require('node:fs');
// Fail closed for every worker bundle except an explicit production build.
const operational = process.env.CONTEXT === 'production' && process.env.NEXT_PUBLIC_MIGRATION_PREVIEW !== 'true';
fs.mkdirSync('netlify/generated', { recursive: true });
fs.writeFileSync('netlify/generated/build-context.json', JSON.stringify({ operational }));
console.log('Scheduled worker operations: ' + (operational ? 'production' : 'disabled'));
