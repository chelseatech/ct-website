import {readFile, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const path='src/data/services.json'; const original=await readFile(path,'utf8');
try {
 const data=JSON.parse(original);data[0].description='A clear home for your work, business or project — designed around the people you want to reach.';
 await writeFile(path,JSON.stringify(data,null,2)+'\n');
 execFileSync('npm',['run','build'],{stdio:'inherit'});
 for(const page of ['dist/index.html','dist/services/index.html'])assert.ok((await readFile(page,'utf8')).includes(data[0].description),`Updated copy absent in ${page}`);
 console.log('PASS: service copy edit rebuilt into both Home and Services.');
} finally {
 await writeFile(path,original);execFileSync('npm',['run','build'],{stdio:'inherit'});
 console.log('Original source copy and build restored.');
}
