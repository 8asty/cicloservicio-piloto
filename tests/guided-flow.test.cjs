/* Dependency-free transition tests. A small DOM double isolates clipboard/storage failures.
   Browser layout, native dialog focus and actual clipboard are tested separately. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../demo.html'),'utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)[1];

const landing=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const approvedLanding=landing
 .replace('<p class="preview-guide-note">Vista previa del producto · Exploración libre. El recorrido guiado se abre fuera de esta vista.</p>','')
 .replace('title="Vista previa del producto, sin recorrido guiado"','title="Demo interactiva de CicloServicio con datos ficticios"')
 .replace('.preview-guide-note{padding:10px 20px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--line);background:#fff}@media(max-width:500px){.preview-guide-note{padding:10px 13px;font-size:11px}}','');
const blobHash=require('node:crypto').createHash('sha1').update('blob '+Buffer.byteLength(approvedLanding)).update(Buffer.from([0])).update(approvedLanding).digest('hex');
assert.equal(blobHash,'0d5145d469d1ac22c6ab08cf99a8b8ef94a29c09','Approved landing must remain byte-for-byte unchanged outside preview annotation');

function setup({query='',stored={},clipboardFailure=false,storageFailure=false,framed=false,deferredCopy=false}={}){
  const nodes=new Map();let writes=0,copied='',resolveCopy;
  class Element{
    constructor(id){this.id=id;this.hidden=false;this.open=false;this.value='';this.textContent='';this.innerHTML='';this.isConnected=true;this.listeners={};this.dataset={};this.classList={toggle(){},add(){},remove(){},contains(){return false;}};}
    addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
    async fire(type){for(const fn of this.listeners[type]||[])await fn({preventDefault(){},target:this});}
    setAttribute(k,v){this[k]=v;}getAttribute(k){return this[k];}
    focus(){document.activeElement=this;}closest(){return this;}
    showModal(){this.open=true;}close(){this.open=false;}select(){this.selected=true;}
    scrollIntoView(){}getBoundingClientRect(){return {left:0,top:0,right:390,bottom:844};}
    querySelectorAll(){return [];}querySelector(){return node('row');}
  }
  const node=id=>{if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);};
  for(const match of html.slice(0,html.indexOf('<script>')).matchAll(/(?<![\w-])id="([^"]+)"/g))node(match[1]);
  node('status-filter').value='all';
  const dialogs=['client-dialog','draft-dialog','guide-complete'].map(node);
  const document={activeElement:node('guide-launch'),body:node('body'),getElementById:node,
    querySelectorAll:selector=>selector==='dialog'?dialogs:selector==='dialog[open]'?dialogs.filter(d=>d.open):[],addEventListener(){}};
  const location={href:'http://localhost/demo.html'+query,search:query};
  const window={location};window.self=window;window.top=framed?{}:window;
  let saved=JSON.stringify(stored);
  const context={document,window,location,URL,URLSearchParams,Intl,Date,console,matchMedia:()=>({matches:true}),requestAnimationFrame:f=>f(),setTimeout:()=>0,clearTimeout(){},
    history:{replaceState(_,__,url){location.href=String(url);location.search=new URL(url).search;}},
    localStorage:{getItem:()=>saved,setItem:(_,v)=>{if(storageFailure)throw Error('denied');saved=v;writes++;},removeItem:()=>{saved=null;writes++;}},
    navigator:{clipboard:{writeText:async text=>{if(clipboardFailure)throw Error('denied');if(deferredCopy)await new Promise(r=>resolveCopy=r);copied=text;}}}};
  // Expose the real closure only inside this VM, never in the shipped page.
  const instrumented=source.replace(/\}\)\(\);\s*$/, 'globalThis.test={guideState,startGuide,exitGuide,saveStatus,openClient,statusOf,data};})();');
  vm.runInNewContext(instrumented,context);
  return {node,test:context.test,document,get saved(){return saved;},get writes(){return writes;},get copied(){return copied;},resolve:()=>resolveCopy()};
}
(async()=>{
  const a=setup({query:'?guia=1'});
  assert(a.node('client-dialog').open,'guided URL opens selected case');
  assert.equal(a.test.guideState.prepared,false,'automatic opening completes no action');
  assert.equal(a.test.guideState.copied,false);
  assert.equal(a.document.activeElement.id,'detail-title');
  a.test.saveStatus('contacted');assert.equal(a.writes,0,'cannot skip copying');
  await a.node('draft-button').fire('click');
  assert(a.test.guideState.prepared);assert(!a.test.guideState.copied,'opening editor is not copying');
  a.node('draft-text').value='';await a.node('copy-draft').fire('click');
  assert.equal(a.test.guideState.phase,'compose','empty message cannot advance');
  a.node('draft-text').value='Mensaje editado';await a.node('draft-text').fire('input');
  await a.node('copy-draft').fire('click');
  assert.equal(a.copied,'Mensaje editado');assert.equal(a.test.guideState.phase,'contact');assert.equal(a.writes,0);
  await a.node('guide-edit').fire('click');
  assert.equal(a.test.guideState.copied,false,'return to editor requires another copy');
  assert.equal(a.node('draft-text').value,'Mensaje editado');
  await a.node('copy-draft').fire('click');await a.node('guide-contact').fire('click');
  assert.equal(a.writes,1);assert.equal(JSON.parse(a.saved)['1'].status,'contacted');
  const registeredAt=JSON.parse(a.saved)['1'].at;
  assert(Number.isFinite(Date.parse(registeredAt)),'registration keeps an actual timestamp');
  assert(a.node('guide-complete').open);assert(a.test.guideState.registered);
  const persisted=setup({stored:JSON.parse(a.saved)});
  assert.equal(persisted.test.statusOf(persisted.test.data[0]),'contacted');
  persisted.test.openClient(1);
  assert(persisted.node('detail-management').innerHTML.includes('Simulación'));
  assert(persisted.node('detail-management').innerHTML.includes('No registrada en esta demo'));
  assert.equal(JSON.parse(persisted.saved)['1'].at,registeredAt,'reload does not replace registration date');
  persisted.node('client-dialog').close();
  assert(!persisted.node('client-dialog').open,'plain URL stays free');
  const failed=setup({query:'?guia=1',clipboardFailure:true});
  await failed.node('draft-button').fire('click');await failed.node('copy-draft').fire('click');
  assert(!failed.test.guideState.copied);assert.equal(failed.test.guideState.phase,'compose');assert.equal(failed.writes,0);
  assert(failed.node('copy-status').textContent.includes('No se avanzó'));
  const blocked=setup({query:'?guia=1',storageFailure:true});
  await blocked.node('draft-button').fire('click');await blocked.node('copy-draft').fire('click');await blocked.node('guide-contact').fire('click');
  assert.equal(blocked.writes,0);assert(blocked.node('guide-persistence').textContent.includes('solo en esta sesión'));
  const cancelled=setup({query:'?guia=1',stored:{1:'scheduled'}});
  assert.equal(cancelled.test.guideState.active,true);
  cancelled.test.exitGuide();assert.equal(cancelled.writes,0);assert.equal(JSON.parse(cancelled.saved)['1'],'scheduled');
  cancelled.test.startGuide();assert(!cancelled.test.guideState.prepared);
  assert.equal(cancelled.test.data.find(d=>cancelled.test.statusOf(d)==='pending').id,2);
  const allDone=setup({query:'?guia=1',stored:Object.fromEntries([1,2,3,4,5,6,7,8].map(id=>[id,'contacted']))});
  assert(allDone.node('client-dialog').open);assert.equal(allDone.node('guide-existing').hidden,false);assert.equal(allDone.writes,0);
  for(const opts of [{query:'?vista=landing&guia=1'},{query:'?guia=1',framed:true}]){
    const preview=setup(opts);assert(!preview.test.guideState.active);assert(!preview.node('client-dialog').open);
  }
  const delayed=setup({query:'?guia=1',deferredCopy:true});
  await delayed.node('draft-button').fire('click');
  const pending=delayed.node('copy-draft').fire('click');
  delayed.test.exitGuide();delayed.resolve();await pending;
  assert(!delayed.test.guideState.active);assert(!delayed.test.guideState.copied);assert.equal(delayed.writes,0);
  const free=setup();free.test.openClient(1);await free.node('draft-button').fire('click');
  free.node('draft-text').value='Conservar edición';await free.node('draft-text').fire('input');
  await free.node('return-client').fire('click');await free.node('draft-button').fire('click');
  assert.equal(free.node('draft-text').value,'Conservar edición');
  await free.node('copy-draft').fire('click');assert(free.node('copy-status').textContent.includes('No se envió ni se registró'));
  assert.equal(free.writes,0,'copy alone never records commercial contact');
  assert(!free.test.guideState.prepared);
  await free.node('return-client').fire('click');await free.node('schedule-button').fire('click');
  assert.equal(JSON.parse(free.saved)['1'].status,'scheduled');
  await free.node('reset-demo').fire('click');assert.equal(free.saved,null);
  const caseStudy=setup({query:'?guia=1'});
  assert.equal(caseStudy.node('detail-title').textContent,'Oficinas Parque Norte');
  assert(caseStudy.node('detail-note').textContent.includes('mantención terminó'));
  assert(caseStudy.node('detail-management').innerHTML.includes('Sin asignar'));
  await caseStudy.node('draft-button').fire('click');
  assert(caseStudy.node('draft-text').value.includes('¿Cómo han funcionado los equipos'));
  assert(!caseStudy.node('draft-text').value.includes('próxima visita'));
  const legacy=setup({stored:{1:'contacted'}});legacy.test.openClient(1);
  assert(legacy.node('detail-management').innerHTML.includes('Sin fecha registrada'),'legacy status does not invent registration date');
  const invalid=setup({stored:{1:{status:'contacted',at:'bad date'},99:'contacted'}});
  assert.equal(invalid.test.statusOf(invalid.test.data[0]),'pending');
  for(const d of caseStudy.test.data){assert(d.lastService<0);assert(['Bimestral','Semestral'].includes(d.cycle));}
  console.log('PASS: guided actions, guards, actual copy result, failures, cancellation race, repeat, iframe isolation, edit preservation, free mode, persistence/reset');
})().catch(error=>{console.error(error);process.exitCode=1;});

