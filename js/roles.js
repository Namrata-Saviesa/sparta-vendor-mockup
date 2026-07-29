// Role, access, and user directory data.

const ALL_PAGES=['dash','rm','po','rej','plan','proc','oroute','order','load','prio','scan','pack','mast','cron','rep'];
const PPC_HEAD_PAGES=ALL_PAGES;
const PPC_PAGES=['rm','po','rej','plan','proc','oroute','order','load','prio','rep'];
const roleProfiles={
  'admin-namrata':{name:'Namrata',label:'PPC Head',designer:null,channel:null,pages:PPC_HEAD_PAGES,hint:'PPC Head access: PPC Head Dashboard, all screens and all B2B/B2C orders.'},
  'admin-mangesh':{name:'Mangesh',label:'PPC Head',designer:null,channel:null,pages:PPC_HEAD_PAGES,hint:'PPC Head access: PPC Head Dashboard, all screens and all B2B/B2C orders.'},
  'ppc-amir':{name:'Amir',label:'PPC / Planning',designer:null,channel:null,pages:PPC_PAGES,hint:'PPC / Planning access: planning, route, load and reports for all orders. PPC Head Dashboard is visible only to Namrata and Mangesh.'},
  'designer-rohan':{name:'Ar. Rohan Bhide',label:'Designer',designer:'Ar. Rohan Bhide',channel:'B2C',pages:['oroute','order'],hint:'Designer access: B2C only, own orders only, Order Route & Days and Order Detail.'},
  'b2c-ai-harsha':{name:'Harsha',label:'B2C AI Head',designer:null,channel:'B2C',sub:'AI',pages:['oroute','order','rej','rep'],hint:'B2C AI access: AI team B2C orders, order tracking, rejections and reports.'},
  'b2c-ai-vrinda':{name:'Vrinda',label:'B2C AI Manager',designer:null,channel:'B2C',sub:'AI',teamDesigners:['Varun','Nivya'],pages:['oroute','order','rej','rep'],hint:'B2C AI-Vrinda access: only orders for Varun and Nivya.'},
  'b2c-aid-bharti':{name:'Bharti',label:'B2C AID Head',designer:null,channel:'B2C',sub:'AID',pages:['oroute','order','rej','rep'],hint:'B2C AID access: AID/Retail/DL team B2C orders, order tracking, rejections and reports.'},
  'b2c-aid-sakshi':{name:'Sakshi',label:'AID-walkin Manager',designer:null,channel:'B2C',sub:'AID',teamDesigners:['Usha','Aishwarya','Ashmi','Krish'],pages:['oroute','order','rej','rep'],hint:'AID-walkin access: only orders for Usha, Aishwarya, Ashmi and Krish.'},
  'b2c-aid-dl':{name:'DL Manager',label:'AID-DL Manager',designer:null,channel:'B2C',sub:'AID',teamDesigners:['Ravi','Jennifer','Shruti','Siddhesh'],pages:['oroute','order','rej','rep'],hint:'AID-DL access: only orders for Ravi, Jennifer, Shruti and Siddhesh.'},
  'b2c-pune-rachana':{name:'Rachana',label:'B2C Pune Head',designer:null,channel:'B2C',sub:'Pune',pages:['oroute','order','rej','rep'],hint:'B2C Pune access: Pune team B2C orders, order tracking, rejections and reports.'},
  'purchase-santosh':{name:'Santosh',label:'Purchase',designer:null,channel:null,pages:['rm','po','rep'],hint:'Purchase access: RM Dashboard, PO Dashboard and purchase-linked reports.'},
  'production-avan':{name:'Avan',label:'Production',designer:null,channel:null,pages:['oroute','order','load','scan','pack','rep'],hint:'Production access: route/load/floor execution screens and production reports.'},
  'supervisor-generic':{name:'Generic Supervisor',label:'Supervisor',designer:null,channel:null,pages:['oroute','order','load','scan','pack'],hint:'Supervisor access: own station work, load, scan and order context.'},
  'operator-generic':{name:'Generic Operator',label:'Operator',designer:null,channel:null,pages:['scan','pack'],hint:'Operator access: station scan or packing station only.'},
  'dispatch-ganesh':{name:'Ganesh',label:'Dispatch / Logistics',designer:null,channel:null,pages:['pack','order','rep'],hint:'Dispatch access: packing station, order detail and dispatch-linked reports.'}
};
let currentRole='admin-namrata';
function currentDesigner(){return roleProfiles[currentRole].designer;}
function currentChannelScope(){return roleProfiles[currentRole].channel;}
function currentSubScope(){return roleProfiles[currentRole].sub;}
function currentTeamDesigners(){return roleProfiles[currentRole].teamDesigners||null;}
function currentDesignerOptions(scopedOrders){
  const p=roleProfiles[currentRole];
  if(p.designer)return [p.designer];
  if(p.teamDesigners)return p.teamDesigners;
  const roleGroups={
    'b2c-ai-harsha':['b2c_ai','b2c_ai_vrinda'],
    'b2c-aid-bharti':['b2c_aid','b2c_aid_walkin','b2c_aid_dl'],
    'b2c-pune-rachana':['b2c_pune']
  }[currentRole];
  if(roleGroups&&typeof USERS!=='undefined'){
    return USERS.filter(u=>roleGroups.includes(u.group)&&u.role.indexOf('Designer')>-1).map(u=>u.name);
  }
  return [...new Set(scopedOrders.map(o=>o.designer))];
}
function currentScopeLabel(){
  const p=roleProfiles[currentRole];
  if(p.designer)return 'B2C only - own orders: '+p.designer;
  if(p.teamDesigners)return (p.sub?p.sub+' ':'')+'B2C only - '+p.teamDesigners.join(', ');
  if(p.channel==='B2C'&&p.sub)return 'B2C only - '+p.sub+' team orders';
  if(p.channel==='B2C')return 'B2C only';
  return '';
}
function roleAllowsOrder(o){
  const ds=currentDesigner(),ch=currentChannelScope(),sub=currentSubScope(),team=currentTeamDesigners();
  if(ds&&o.designer!==ds)return false;
  if(ch&&o.channel!==ch)return false;
  if(sub&&o.sub!==sub)return false;
  if(team&&!team.includes(o.designer))return false;
  return true;
}
function applyRole(role){
  currentRole=role;
  const p=roleProfiles[role];
  document.getElementById('role-hint').textContent=p.hint;
  document.querySelector('.side .user').innerHTML='<b>'+p.name+'</b>'+p.label+' · Wed 15 Jul 2026';
  document.querySelectorAll('.nav button').forEach(btn=>{
    const allowed=p.pages.includes(btn.dataset.s);
    btn.style.display=allowed?'':'none';
    if(!allowed)btn.classList.remove('on');
  });
  document.querySelectorAll('.nav h5').forEach(h=>{h.style.display=p.pages.length<ALL_PAGES.length?'none':'';});
  if(typeof orPopulateFilters==='function')orPopulateFilters();
  if(typeof odPopulateFilters==='function')odPopulateFilters();
  applyScopedOrderFilters('or');
  applyScopedOrderFilters('od');
  const active=document.querySelector('.screen.on');
  const activeKey=active?active.id.replace('s-',''):'dash';
  if(!p.pages.includes(activeKey))navTo(p.pages[0]);
  if(p.pages.includes(activeKey)&&!document.querySelector('.nav button.on'))navTo(activeKey);
  if(typeof orFilterUpdate==='function')orFilterUpdate();
  if(typeof odFilterUpdate==='function')odFilterUpdate();
}

function applyScopedOrderFilters(prefix){
  const p=roleProfiles[currentRole];
  const ch=document.getElementById(prefix+'-f-channel');
  const sub=document.getElementById(prefix+'-f-sub');
  const ds=document.getElementById(prefix+'-f-designer');
  const note=document.getElementById(prefix+'-scope-note');
  const label=currentScopeLabel();
  if(ch){ch.value=p.channel||'all';ch.disabled=!!p.channel;}
  if(sub){sub.style.display=p.channel==='B2C'?'':'none';sub.value=p.sub||'all';sub.disabled=!!p.sub;if(p.channel!=='B2C')sub.value='all';}
  if(ds){ds.value=p.designer||'all';ds.disabled=!!p.designer;}
  if(note){note.textContent=label;note.style.display=label?'':'none';}
  if(ch)ch.classList.toggle('scope-hidden',!!p.channel);
  if(sub)sub.classList.toggle('scope-hidden',!!p.sub||!!p.designer);
  if(ds)ds.classList.toggle('scope-hidden',!!p.designer);
}

function navTo(k){document.querySelector('button[data-s='+k+']').click();}
const GROUPS={
  ops:['','Operations'], b2c:['','B2C'], b2b:['','B2B'], ai:['','AI'],
  aid:['','AID'], pune:['','Pune'], ppc:['','PPC'],
  logistics:['','Logistics'], production:['','Production'], purchase:['','Purchase'],
  finance:['','Finance'], floor:['','Floor operators']
};
const ACCESS={
  rwe:['Read + Write + Edit','c-ok'], rw:['Read + Write','c-info'],
  view:['View','c-grey'], scan:['Scan (station)','c-watch']
};
const AVCOLORS=['#e8590c','#1971c2','#2b8a3e','#7d1128','#9a6b00','#5a6068','#c92a2a','#0b7285'];
function initials(n){return n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function avColor(n){let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return AVCOLORS[Math.abs(h)%AVCOLORS.length];}
function mk(name,email,role,group,access,scope,station){return{name,email,role,group,access,scope,station:station||null};}

const USERS=[
  mk('Order Processing POC','orderprocessing.poc@saviesahome.com','Order Processing POC','ops','view','All screens · all orders'),
  mk('Ops Team 1','opsteam1@saviesahome.com','Operations Team','ops','view','All screens · all orders'),
  mk('Ops Team 2','opsteam2@saviesahome.com','Operations Team','ops','view','All screens · all orders'),
  mk('Ops Team 3','opsteam3@saviesahome.com','Operations Team','ops','view','All screens · all orders'),
  mk('Ops Team 4','opsteam4@saviesahome.com','Operations Team','ops','view','All screens · all orders'),
  mk('Jatin','jatin@saviesahome.com','Operations Head','ops','rw','All screens · all orders'),
  mk('RTA','rta@saviesahome.com','B2C Head','b2c','rwe','All B2C orders · all screens'),
  mk('Monesh','monesh@saviesahome.com','B2C Head','b2c','view','All B2C orders + all B2B orders'),
  mk('Harsha','harsha@saviesahome.com','AI Head','ai','view','Orders of Designers 1–10 (AI)'),
  mk('Bhati','bhati@saviesahome.com','AID Head','aid','view','Orders of Designers 11–20 (AID)'),
  mk('Amaar','amaar@saviesahome.com','Pune Head','pune','view','Orders of Designers 21–30 (Pune)'),
  mk('Rachna','rachna@saviesahome.com','Pune Head','pune','view','Orders of Designers 21–30 (Pune)'),
  mk('Mary','mary@saviesahome.com','B2B Manager','b2b','view','All B2B orders'),
  mk('Anand','anand@saviesahome.com','PPC Head','ppc','rwe','All screens · all orders'),
  mk('Namrata','namrata@saviesahome.com','PPC Head','ppc','rwe','All screens · all orders'),
  mk('Mangesh','mangesh@saviesahome.com','PPC Head','ppc','rwe','All screens · all orders'),
  mk('Amir','amir@saviesahome.com','Logistics','logistics','view','Dispatch &amp; logistics-linked orders'),
  mk('Prasant','prasant@saviesahome.com','Supervisor','production','view','Own floor / station group'),
  mk('Ganesh','ganesh@saviesahome.com','Supervisor','production','view','Own floor / station group'),
  mk('Sachin','sachin@saviesahome.com','Supervisor','production','view','Own floor / station group'),
  mk('Fender','fender@saviesahome.com','Supervisor','production','view','Own floor / station group'),
  mk('Sandeep','sandeep@saviesahome.com','Purchase Head','purchase','view','RM, PO &amp; Vendor screens'),
  mk('Santosh','santosh@saviesahome.com','Hardware Head','purchase','view','Hardware &amp; RM screens'),
  mk('Rakhee','rakhee@saviesahome.com','Finance Head','finance','view','Finance &amp; reports screens'),
];
for(let i=1;i<=10;i++)USERS.push(mk('Designer '+i,'designer'+i+'@saviesahome.com','Designer','ai','view','Own orders only'));
for(let i=11;i<=20;i++)USERS.push(mk('Designer '+i,'designer'+i+'@saviesahome.com','Designer','aid','view','Own orders only'));
for(let i=21;i<=30;i++)USERS.push(mk('Designer '+i,'designer'+i+'@saviesahome.com','Designer','pune','view','Own orders only'));
const STATIONS=[['Hot Press',1],['Beam Saw',1],['Edge Bend',2],['CNC',2],['Panel Saw',1],['Packing',2],['Quality Check',1],['Dispatch',1],['Handle',1],['Manual Edge Bend',1],['Profile',1]];
STATIONS.forEach(([st,n])=>{
  const slug=st.toLowerCase().replace(/ /g,'');
  for(let i=1;i<=n;i++){
    const label=n>1?st+' Operator '+i:st+' Operator';
    USERS.push(mk(label,slug+'.operator'+i+'@saviesahome.com',st+' Operator','floor','scan','Own station queue only',st));
  }
});

Object.assign(GROUPS,{
  admin:['','Full Admin / Management'], ppc:['','PPC / Planning'], b2c:['','B2C Heads & Managers'],
  b2c_ai:['','B2C AI - Harsha'], b2c_ai_vrinda:['','B2C AI - Vrinda subgroup'],
  b2c_aid:['','B2C AID - Bharti'], b2c_aid_walkin:['','AID-walkin - Sakshi'], b2c_aid_dl:['','AID-DL Manager'],
  b2c_pune:['','B2C Pune - Amarkant/Rachana'],
  design:['','B2C Designers'], purchase:['','Purchase'], production:['','Production / Factory'],
  supervisor:['','Supervisors'], dispatch:['','Dispatch / Logistics'], floor:['','Floor operators'],
  chartonly:['','Org chart only']
});
['ops','b2b','ai','aid','pune','logistics','finance','b2c','design'].forEach(k=>delete GROUPS[k]);
USERS.length=0;
[
  ['Anand Laghate','anand','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Mangesh','mangesh','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Namrata','namrata','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Rajesh','rajesh','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Monesh','monesh','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Mary','mary','Full Admin / Management','admin','rwe','All pages, all B2B and B2C orders'],
  ['Amir','amir','PPC / Planning','ppc','rw','All planning screens and all orders'],
  ['Harsha','harsha','B2C AI Head','b2c_ai','view','AI B2C team orders'],
  ['Vrinda','vrinda','B2C AI Manager','b2c_ai_vrinda','view','AI subgroup orders: Varun, Nivya'],
  ['Bharti','bharti','B2C AID Head','b2c_aid','view','AID/Retail/DL B2C team orders'],
  ['Sakshi','sakshi','AID-walkin Manager','b2c_aid_walkin','view','AID-walkin orders: Usha, Aishwarya, Ashmi, Krish'],
  ['DL Manager','dl.manager','AID-DL Manager','b2c_aid_dl','view','AID-DL orders: Ravi, Jennifer, Shruti, Siddhesh'],
  ['Amarkant','amarkant','B2C Pune Head','b2c_pune','view','Pune B2C team orders'],
  ['Rachana','rachana','B2C Pune Head','b2c_pune','view','Pune B2C team orders'],
  ['Santosh Yadav','santosh','Purchase','purchase','view','RM, PO and vendor-linked reports'],
  ['Zubair','zubair','Purchase','purchase','view','RM, PO and vendor-linked reports'],
  ['Sandeep','sandeep','Purchase','purchase','view','RM, PO and vendor-linked reports'],
  ['Pravin','pravin','Purchase','purchase','view','RM, PO and vendor-linked reports'],
  ['Avan','avan','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Prashant','prashant','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Amir Production','amir.production','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Pratish','pratish','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Sachin','sachin','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Suhas','suhas','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Thapa','thapa','Production / Factory','production','rw','Production, load, scan and packing screens'],
  ['Ganesh','ganesh','Dispatch / Logistics','dispatch','view','Packing, order detail and dispatch-linked reports'],
  ['Rakesh','rakesh','Dispatch / Logistics','dispatch','view','Packing, order detail and dispatch-linked reports']
].forEach(u=>USERS.push(mk(u[0],u[1]+'@saviesahome.com',u[2],u[3],u[4],u[5])));
[
  ['Prasad','B2C AI Designer','b2c_ai','AI B2C own orders only'],
  ['Riya','B2C AI Designer','b2c_ai','AI B2C own orders only'],
  ['Nivya','B2C AI Designer','b2c_ai_vrinda','AI-Vrinda own orders only'],
  ['Varun','B2C AI Designer','b2c_ai_vrinda','AI-Vrinda own orders only'],
  ['Rakesh Designer','B2C AI Designer','b2c_ai','AI B2C own orders only'],
  ['Generic AI Designer 1','B2C AI Designer','b2c_ai','AI B2C own orders only'],
  ['Generic AI Designer 2','B2C AI Designer','b2c_ai','AI B2C own orders only'],
  ['Usha','B2C AID-walkin Designer','b2c_aid_walkin','AID-walkin own orders only'],
  ['Krish','B2C AID-walkin Designer','b2c_aid_walkin','AID-walkin own orders only'],
  ['Aishwarya','B2C AID-walkin Designer','b2c_aid_walkin','AID-walkin own orders only'],
  ['Ashmi','B2C AID-walkin Designer','b2c_aid_walkin','AID-walkin own orders only'],
  ['Ravi','B2C AID-DL Designer','b2c_aid_dl','AID-DL own orders only'],
  ['Jennifer','B2C AID-DL Designer','b2c_aid_dl','AID-DL own orders only'],
  ['Shruti','B2C AID-DL Designer','b2c_aid_dl','AID-DL own orders only'],
  ['Siddhesh','B2C AID-DL Designer','b2c_aid_dl','AID-DL own orders only'],
  ['Roopali','B2C AID Designer','b2c_aid','AID/Retail/DL B2C own orders only'],
  ['Anil','B2C AID Designer','b2c_aid','AID/Retail/DL B2C own orders only'],
  ['Rohit','B2C AID Designer','b2c_aid','AID/Retail/DL B2C own orders only'],
  ['Generic AID Designer 1','B2C AID Designer','b2c_aid','AID/Retail/DL B2C own orders only'],
  ['Generic AID Designer 2','B2C AID Designer','b2c_aid','AID/Retail/DL B2C own orders only'],
  ['Mrinal','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Aditi','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Shruti Nale','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Shital','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Shubham','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Generic Pune Designer 1','B2C Pune Designer','b2c_pune','Pune B2C own orders only'],
  ['Generic Pune Designer 2','B2C Pune Designer','b2c_pune','Pune B2C own orders only']
].forEach(([name,role,group,scope])=>{
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/\.$/,'');
  USERS.push(mk(name,slug+'@saviesahome.com',role,group,'view',scope));
});
['Beam Saw Supervisor','Edge Band Supervisor','CNC Supervisor','Packing Supervisor','Generic Supervisor 1','Generic Supervisor 2'].forEach(name=>{
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/\.$/,'');
  USERS.push(mk(name,slug+'@saviesahome.com','Supervisor','supervisor','view','Own station group'));
});
['Beam Saw Operator','Edge Band Operator 1','Edge Band Operator 2','CNC Operator 1','CNC Operator 2','Panel Saw Operator','Packing Operator 1','Packing Operator 2','QC Operator','Dispatch Operator','Generic Operator 1','Generic Operator 2'].forEach(name=>{
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/\.$/,'');
  USERS.push(mk(name,slug+'@saviesahome.com','Operator','floor','scan','Own station queue only'));
});
['Digital Marketing Team','Social Media Team','SEO Team','HR Team','Finance Team','Customer Care Team'].forEach(name=>{
  const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'.').replace(/\.$/,'');
  USERS.push(mk(name,slug+'@saviesahome.com','Org chart only','chartonly','view','No dashboard access in this phase'));
});

const ACCESS_PAGE_LABELS={
  dash:'PPC',rm:'RM',po:'PO',rej:'Reject',plan:'Planning',proc:'Routes',
  oroute:'Route & Days',order:'Order Detail',load:'Load',prio:'Priority',
  scan:'Scan',pack:'Packing',mast:'Masters',cron:'Scheduler',rep:'Reports'
};
const PAGE_ACCESS_ROLES=[
  {role:'PPC Head',scope:'Namrata and Mangesh only; includes PPC Head Dashboard',pages:PPC_HEAD_PAGES},
  {role:'Full Admin / Management',scope:'Rajesh, Monesh, Mary, Anand; all pages except PPC Head Dashboard',pages:PPC_PAGES.concat(['scan','pack','mast','cron'])},
  {role:'PPC / Planning',scope:'Amir; PPC Head Dashboard excluded',pages:PPC_PAGES},
  {role:'B2C AI Head',scope:'Harsha; all AI B2C team orders',pages:['oroute','order','rej','rep']},
  {role:'B2C AI Manager',scope:'Vrinda; Varun and Nivya only',pages:['oroute','order','rej','rep']},
  {role:'B2C AID Head',scope:'Bharti; all AID/Retail/DL B2C team orders',pages:['oroute','order','rej','rep']},
  {role:'AID-walkin Manager',scope:'Sakshi; Usha, Aishwarya, Ashmi, Krish only',pages:['oroute','order','rej','rep']},
  {role:'AID-DL Manager',scope:'Ravi, Jennifer, Shruti, Siddhesh only',pages:['oroute','order','rej','rep']},
  {role:'B2C Pune Head',scope:'Amarkant / Rachana; Pune B2C team orders',pages:['oroute','order','rej','rep']},
  {role:'B2C Designer',scope:'Own B2C orders only',pages:['oroute','order']},
  {role:'Purchase',scope:'RM, PO and vendor-linked reports',pages:['rm','po','rep']},
  {role:'Production / Factory',scope:'Production work and route context',pages:['oroute','order','load','scan','pack','rep']},
  {role:'Supervisor',scope:'Own station group',pages:['oroute','order','load','scan','pack']},
  {role:'Operator',scope:'Own station queue only',pages:['scan','pack']},
  {role:'Dispatch / Logistics',scope:'Packing and dispatch follow-up',pages:['pack','order','rep']},
  {role:'Org chart only',scope:'Marketing, HR, finance, SEO, social media, customer care',pages:[]}
];

