// Screen rendering and interaction handlers.

// ---- overtime / half-day preview ----
function otExclusive(which){
  const hourly=document.getElementById('ot-hourly-on'),half=document.getElementById('ot-half-on');
  const hsel=document.getElementById('ot-h');
  if(which==='hourly'&&hourly.checked){half.checked=false;}
  if(which==='half'&&half.checked){hourly.checked=false;}
  if(!hourly.checked&&!half.checked)hourly.checked=true; // one must always be active
  hsel.disabled=!hourly.checked;
  otPreview();
}
function otPreview(){const st=document.getElementById('ot-st').value;
 const halfOn=document.getElementById('ot-half-on').checked;
 const h=document.getElementById('ot-h').value;
 const base={'Edge Band':118,'Panel Saw':104,'CNC':92,'PRF Assembly':59}[st]||90;
 let nh,label,impact;
 if(halfOn){
   nh=4;label='Half Day (4h, capacity halved)';
   impact='reduced capacity — the day\'s remaining WIP that can\'t fit in 4h is pushed to the next working day; queue automatically re-sequenced by priority. That day\'s Worker/Supervisor efficiency baseline drops from 8h to 4h.';
 } else {
   nh=8+parseInt(h);label=h+'h hourly OT';
   impact='extra capacity — the next orders in the station queue are pulled forward automatically; queue re-sequenced by priority.';
 }
 const nl=Math.round(base*8/nh);
 document.getElementById('ot-impact').innerHTML='<b>Preview:</b> '+st+' '+label+' on 15 Jul → day capacity 8h→'+nh+'h · load '+base+'%→'+nl+'% · '+impact+' Triggers a full PPC recalculation — capacity changes ripple through every queue, ECD, buffer, risk status, and the day\'s worker/supervisor efficiency figures.';}
// ---- shared 5-band load % colour scheme (Bottleneck forecast is the reference; reused by all Station Load widgets) ----
function loadBand(v){
  if(v>=loadThresholds.late)return{hc:'b5',row:'late',color:'var(--late)',label:'Bottleneck'};
  if(v>=loadThresholds.risk)return{hc:'b4',row:'risk',color:'var(--risk)',label:'Near cap'};
  if(v>=loadThresholds.watch)return{hc:'b3',row:'watch',color:'var(--watch)',label:'Watch'};
  if(v>=loadThresholds.info)return{hc:'b2',row:'info',color:'var(--info)',label:'Moderate'};
  return{hc:'b1',row:'ok',color:'var(--ok)',label:'OK'};
}
// ---- station monthly plan ----
function renderMonth(){const st=document.getElementById('mo-st').value;const el=document.getElementById('mocal');if(!el)return;
 const base=moBase[st],cap=moCap[st];
 let h=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>'<div class="mh">'+d+'</div>').join('');
 const first=new Date(2026,6,1);let pad=(first.getDay()+6)%7;for(let i=0;i<pad;i++)h+='<div></div>';
 let sumV=0,sumSq=0,sumWos=0,n=0;
 for(let d=1;d<=31;d++){const dt=new Date(2026,6,d);const dow=dt.getDay();
  if(dow===0){h+='<div class="md hol'+(d===19?'':'')+'"><span class="dn">'+d+'</span><div class="sq">Holiday</div></div>';continue;}
  const v=Math.max(30,Math.round(base+14*Math.sin(d*0.9)+ (d>15? -1.6*(d-15):0)));
  const sq=Math.round(cap*v/100);const wos=Math.max(1,Math.round(v/22));
  sumV+=v;sumSq+=sq;sumWos+=wos;n++;
  const cls=loadBand(v).hc;
  h+='<div class="md '+cls+(d===15?' today':'')+(d<15?' past':'')+'"><span class="dn">'+d+'</span><div class="sq">'+sq+' sqft · <b>'+v+'%</b></div><div class="wo2">'+wos+' WOs</div></div>';}
 el.innerHTML=h;
 document.getElementById('mo-avg-load').textContent=Math.round(sumV/n)+'%';
 document.getElementById('mo-avg-sqft').textContent=Math.round(sumSq/n).toLocaleString();
 document.getElementById('mo-avg-wos').textContent=(sumWos/n).toFixed(1);
}
// ---- station load table ----
// ---- Auto Planning: CPM + suggested action inline inside the table ----
function cpmBlockHtml(wo){
 const d=planCPM[wo];if(!d)return'';
 let h='<div class="cpmtitle">CPM — remaining work (Logic L) · '+d.title+'</div><div class="cpm">';
 d.rows.forEach(r=>{
   h+='<div class="cpmrow'+(r.crit?' crit':'')+'">';
   h+='<div class="cpmhead"><span class="nm">'+r.name+(r.crit?' <span class="rds">CRITICAL · RDS</span>':'')+'</span><span class="cpmd">'+r.d+' · ends <b>'+r.end+'</b> · buffer '+r.buf+'</span></div>';
   h+='<div class="cpmbar"'+(r.w?' style="width:'+r.w+'"':'')+'>'+r.segs.map(s=>'<span class="cpmseg" style="flex:'+s[0]+';background:'+s[1]+'" title="'+s[2]+'"></span>').join('')+'</div>';
   h+='<div class="cpmlegend">'+r.segs.map(s=>'<span class="cpmleg"><i style="background:'+s[1]+'"></i>'+s[2]+'</span>').join('')+'</div>';
   h+='</div>';
 });
 h+='</div><div class="note" style="margin-top:6px">'+d.rds+'</div><div class="warnbox" style="margin-top:8px">'+d.buf+'</div>';
 return h;
}
function planDetailHtml(wo){
 let h='<div class="note" style="margin-bottom:10px"><b>Suggested action:</b> '+planActions[wo]+'</div>';
 if(wo==='0374'){
   h+='<table style="margin-bottom:12px"><thead><tr><th>Line</th><th>Current station</th><th>Line ECD</th><th>Blocker</th></tr></thead><tbody>'
    +'<tr><td>Door (2 pcs)</td><td>Joinery</td><td class="dt">22 Jul</td><td class="note">—</td></tr>'
    +'<tr><td>Mesh Patti (12 pcs)</td><td>Joinery</td><td class="dt">21 Jul</td><td class="note">—</td></tr>'
    +'<tr><td style="color:var(--late);font-weight:600">Glass Clear (4 pcs)</td><td>Waiting material</td><td class="dt" style="color:var(--late)">23 Jul</td><td class="note">Wrong glass received · revised exp 18 Jul (Logic I applied)</td></tr>'
    +'</tbody></table><div class="note" style="margin-bottom:12px">Order ECD = MAX(line ECDs) = 23 Jul (Logic B). Glass line drives the order — full CPM below.</div>';
 }
 h+=cpmBlockHtml(wo);
 return h;
}
function toggleDetails(wo){
 const row=document.getElementById('det-'+wo);if(!row)return;
 const btn=document.getElementById('dbtn-'+wo);
 if(row.style.display==='none'){
   if(!row.dataset.loaded){row.querySelector('td').innerHTML=planDetailHtml(wo);row.dataset.loaded='1';}
   row.style.display='table-row';
   if(btn)btn.textContent='▴ Details';
 }else{
   row.style.display='none';
   if(btn)btn.textContent='▾ Details';
 }
}
// ---- override modal ----
function openOverride(wo,field,old){document.getElementById('ov-wo').textContent=wo;document.getElementById('ov-old').textContent=old;document.getElementById('ovl').classList.add('on');}
function closeOverride(){document.getElementById('ovl').classList.remove('on');}
// ---- order route gantt (WO 0428B) ----

// ---- 7-day bottleneck heatmap (dashboard) ----
function renderBottleneckForecast(){const el=document.getElementById('hm7');if(!el)return;
 let h=hmDays.map((d,i)=>`<div class="hh">${d}${d==='Sun 19'?'<br>HOL':''}</div>`).join('')+'<div class="hh">Week<br>Total</div>';
 let peak=0,peakSt='',peakDay='';
 hmData.forEach(r=>{
   let sum=0;
   const cells=r.slice(1).map((v,i)=>{
     if(v===null)return '<div class="hc h">—</div>';
     if(v>peak){peak=v;peakSt=r[0];peakDay=hmDays[i+1];}
     sum+=v;
     return `<div class="hc ${loadBand(v).hc}">${v}%</div>`;
   }).join('');
   const tb=loadBand(sum/7).hc;
   h+=`<div class="hl">${r[0]}</div>`+cells+`<div class="hc ${tb}" title="7 working days × 100% = 700% basis">${sum}%</div>`;
 });
 el.innerHTML=h;
 const pk=document.getElementById('bn-peak'); if(pk){pk.textContent='Peak '+peak+'% · '+peakSt+' '+peakDay;pk.className='chip '+(peak>=100?'c-late':peak>=90?'c-risk':'c-watch');}
}
function updateBottleneckBands(){
  if(document.getElementById('bn-protected')&&document.getElementById('bn-protected').checked)return;
  loadThresholds.info=parseInt(document.getElementById('bn-t-info').value,10)||60;
  loadThresholds.watch=parseInt(document.getElementById('bn-t-watch').value,10)||80;
  loadThresholds.risk=parseInt(document.getElementById('bn-t-risk').value,10)||90;
  loadThresholds.late=parseInt(document.getElementById('bn-t-late').value,10)||100;
  document.getElementById('bn-legend-ok').lastChild.textContent='0-'+loadThresholds.info+'%';
  document.getElementById('bn-legend-info').lastChild.textContent=loadThresholds.info+'-'+loadThresholds.watch+'%';
  document.getElementById('bn-legend-watch').lastChild.textContent=loadThresholds.watch+'-'+loadThresholds.risk+'%';
  document.getElementById('bn-legend-risk').lastChild.textContent=loadThresholds.risk+'-'+loadThresholds.late+'%';
  document.getElementById('bn-legend-late').lastChild.textContent=loadThresholds.late+'%+';
  renderBottleneckForecast();
}
function toggleBottleneckProtection(){
  const locked=document.getElementById('bn-protected').checked;
  ['bn-t-info','bn-t-watch','bn-t-risk','bn-t-late'].forEach(id=>{const el=document.getElementById(id);if(el)el.disabled=locked;});
}
// ---- vendor lens filter ----
function vendorFilter(v){document.querySelectorAll('#s-dash [data-vendor]').forEach(r=>{r.style.display=(v==='all'||r.dataset.vendor===v)?'':'none';});
 document.getElementById('vnote').textContent=v==='all'?'Filters purchase orders & material rows to one vendor\u2019s concerns':'Showing only '+v+' — POs, shortages and date impacts';}

// ---- Revised committed date (manually entered by PPC Head) ----
function editRevised(wo,el){
  const cur=el.classList.contains('empty')?'':el.textContent.trim();
  const v=prompt('Revised commit date for WO '+wo+' (manually entered by PPC Head).\nContractual "Committed" stays unchanged; this is audit-logged.','' );
  if(v===null)return; const t=v.trim();
  if(!t){el.textContent='— set';el.classList.add('empty');}
  else{el.textContent=t;el.classList.remove('empty');}
  // demo only: real app writes to override audit log
}

// ---- Revised committed date (manually entered by PPC Head) ----
function parseDashDate(text){
  const m={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
  const p=(text||'').trim().split(/\s+/); if(p.length<2)return null;
  return new Date(2026,m[p[1]],parseInt(p[0],10));
}
function gapText(days){return days===0?'0d':(days>0?'+'+days+'d':'−'+Math.abs(days)+'d');}
function parseRevisedInputDate(input){return input&&input.value?new Date(input.value+'T00:00:00'):null;}
function formatDashFullDate(date){
  if(!date)return 'not set';
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return date.getDate()+' '+months[date.getMonth()]+' '+date.getFullYear();
}
function dashboardMailContext(row){
  const tds=row.querySelectorAll('td');
  const wo=tds[0].textContent.trim();
  const revisedInput=row.querySelector('.revdate');
  const revised=parseRevisedInputDate(revisedInput);
  const sparta=parseDashDate(tds[5].textContent);
  const committed=parseDashDate(tds[3].textContent);
  const contact=(typeof dashboardDesignerContacts!=='undefined'&&dashboardDesignerContacts[wo])||{name:'Assigned designer',email:'designer@saviesahome.com'};
  const delayDays=revised&&sparta?Math.max(0,Math.round((sparta-revised)/86400000)):0;
  return {wo,client:tds[1].textContent.trim(),ref:tds[2].textContent.trim(),committed,revised,sparta,contact,delayDays};
}
function openDesignerDelayMail(row){
  const ctx=dashboardMailContext(row);
  const condition='Trigger condition: Sparta ECD ('+formatDashFullDate(ctx.sparta)+') exceeds Revised date ('+formatDashFullDate(ctx.revised)+') for WO '+ctx.wo+'.';
  const subject='Sparta ECD breach - WO '+ctx.wo+' / '+ctx.client;
  const body='Hello '+ctx.contact.name+',\n\n'
    +'Sparta has recalculated the expected completion date for WO '+ctx.wo+' ('+ctx.client+', '+ctx.ref+').\n\n'
    +'Current trigger condition:\n'
    +'- Revised date committed by PPC Head: '+formatDashFullDate(ctx.revised)+'\n'
    +'- Current Sparta ECD: '+formatDashFullDate(ctx.sparta)+'\n'
    +'- Breach: '+ctx.delayDays+' day'+(ctx.delayDays===1?'':'s')+' beyond revised date\n\n'
    +'Please review the design/customer coordination blockers and confirm the recovery action or revised commitment by EOD.\n\n'
    +'This is an automated Sparta mock mail, generated only when Sparta ECD exceeds the PPC revised date.';
  document.getElementById('mail-title').textContent='Designer mail - WO '+ctx.wo;
  document.getElementById('mail-note').textContent=condition;
  document.getElementById('mail-body').innerHTML=
    '<div class="warnbox" style="margin:0 0 12px"><b>Condition shown on click:</b> '+condition+'</div>'
    +'<div class="mailmock">'
    +'<div class="mailrow"><div class="label">To</div><div class="value">'+ctx.contact.name+' &lt;'+ctx.contact.email+'&gt;</div></div>'
    +'<div class="mailrow"><div class="label">Cc</div><div class="value">ppc.head@saviesahome.com</div></div>'
    +'<div class="mailrow"><div class="label">Subject</div><div class="value">'+subject+'</div></div>'
    +'<div class="mailrow"><div class="label">Body</div><div class="value"><pre>'+body+'</pre></div></div>'
    +'</div>';
  document.getElementById('mailmodal').classList.add('on');
}
function closeDesignerDelayMail(){document.getElementById('mailmodal').classList.remove('on');}
document.getElementById('mailmodal').addEventListener('click',e=>{if(e.target.id==='mailmodal')closeDesignerDelayMail();});
function updateGapRow(row){
  const tds=row.querySelectorAll('td');
  const committed=parseDashDate(tds[3].textContent);
  const revisedInput=row.querySelector('.revdate');
  const sparta=parseDashDate(tds[5].textContent);
  const revised=parseRevisedInputDate(revisedInput);
  const baseline=revised||committed;
  if(!baseline||!sparta)return;
  const days=Math.round((baseline-sparta)/86400000);
  const gap=row.querySelector('.gap'); if(gap){gap.textContent=gapText(days);gap.className='gap '+(days>0?'pos':days<0?'neg':'zero');}
  const statusCell=tds[7]; if(statusCell)statusCell.classList.add('statuscell');
  const status=row.querySelector('td:last-child .chip');
  const mailTriggered=!!(revised&&days<0);
  if(status&&revised){
    if(mailTriggered){status.textContent='Mail trigger';status.className='chip c-late';}
    else if(days===0){status.textContent='Revised aligned';status.className='chip c-watch';}
    else{status.textContent='Revised buffer';status.className='chip c-ok';}
  }
  if(statusCell){
    let mailBtn=statusCell.querySelector('.mail-trigger');
    if(!mailBtn){
      mailBtn=document.createElement('button');
      mailBtn.type='button';
      mailBtn.className='mail-trigger';
      mailBtn.textContent='✉';
      mailBtn.setAttribute('aria-label','View designer delay mail');
      mailBtn.title='View designer delay mail condition and mock message';
      mailBtn.onclick=e=>{e.stopPropagation();openDesignerDelayMail(row);};
      statusCell.appendChild(mailBtn);
    }
    mailBtn.hidden=!mailTriggered;
  }
}
function editRevisedDate(input){updateGapRow(input.closest('tr'));}

// ---- Material shortage: per-widget vendor filter ----
function msFilter(v){let n=0;document.querySelectorAll('#ms-body tr').forEach(r=>{const show=(v==='all'||r.dataset.vendor===v);r.style.display=show?'':'none';if(show)n++;});
  document.getElementById('ms-count').textContent=n+(n===1?' order':' orders');
  document.getElementById('ms-note').textContent=v==='all'?'Filter shortages to a single vendor to prep a follow-up call or PO chase.':'Showing shortages tied to '+v+' only.';}

// ---- PO tracker (overdue/due today): per-widget vendor filter ----
function ptFilter(v){let n=0,overdue=0;
  document.querySelectorAll('#potable tr').forEach(r=>{const show=(v==='all'||r.dataset.vendor===v);r.style.display=show?'':'none';
    if(show){n++;if(r.querySelector('.pochip')&&r.querySelector('.pochip').textContent.indexOf('Overdue')===0)overdue++;}});
  document.getElementById('pt-count').textContent=overdue+' overdue';
  document.getElementById('pt-note').textContent=(v==='all'?'Late PO → engine shifts affected ECDs (Logic I) and this list feeds the 09:00 cron mail to Purchase.':'Showing '+n+' PO'+(n===1?'':'s')+' for '+v+' only — engine shifts affected ECDs (Logic I) and this list feeds the 09:00 cron mail to Purchase.');}

function ptFilter(v){let n=0,overdue=0;
  const vendor=v||document.getElementById('pt-vendor').value;
  const status=document.getElementById('pt-status').value;
  document.querySelectorAll('#potable tr').forEach(r=>{const show=(vendor==='all'||r.dataset.vendor===vendor)&&(status==='all'||r.dataset.status===status);r.style.display=show?'':'none';
    if(show){n++;if(r.dataset.status==='Overdue')overdue++;}});
  document.getElementById('pt-count').textContent=overdue+' overdue';
  const scope=(vendor==='all'?'all vendors':vendor)+' / '+(status==='all'?'all statuses':status);
  document.getElementById('pt-note').textContent='Showing '+n+' PO'+(n===1?'':'s')+' for '+scope+' - engine shifts affected ECDs (Logic I) and this list feeds the 09:00 cron mail to Purchase.';}

// ---- RM Dashboard filters ----
function rmPopulateDatalists(){
  const wos=new Set(),clients=new Set(),projects=new Set(),mats=new Set();
  document.querySelectorAll('#rm-body tr.row').forEach(r=>{
    if(['In stock','Received'].includes(r.dataset.status))return;
    const tds=r.querySelectorAll('td');
    wos.add(tds[0].textContent.trim());
    clients.add(tds[2].textContent.trim());
    projects.add(tds[3].textContent.trim());
    mats.add(tds[5].textContent.trim());
  });
  const fill=(id,vals)=>{document.getElementById(id).innerHTML=[...vals].sort().map(v=>`<option value="${v}">`).join('');};
  fill('rm-dl-wo',wos); fill('rm-dl-client',clients); fill('rm-dl-project',projects); fill('rm-dl-mat',mats);
}
function rmFilter(){
  const wo=(document.getElementById('rm-f-wo').value||'').trim().toLowerCase();
  const cl=(document.getElementById('rm-f-client').value||'').trim().toLowerCase();
  const pr=(document.getElementById('rm-f-project').value||'').trim().toLowerCase();
  const mat=(document.getElementById('rm-f-mat').value||'').trim().toLowerCase();
  const ve=document.getElementById('rm-vendor').value, st=document.getElementById('rm-status').value, ch=document.getElementById('rm-channel').value;
  const secCount={};
  document.querySelectorAll('#rm-body tr[data-channel]').forEach(r=>{
    const tds=r.querySelectorAll('td');
    const actionable=!['In stock','Received'].includes(r.dataset.status);
    const okWo=(wo===''||tds[0].textContent.toLowerCase().includes(wo));
    const okCl=(cl===''||tds[2].textContent.toLowerCase().includes(cl));
    const okPr=(pr===''||tds[3].textContent.toLowerCase().includes(pr));
    const okMat=(mat===''||tds[5].textContent.toLowerCase().includes(mat));
    const okV=(ve==='all'||r.dataset.vendor===ve);
    const okS=(st==='all'||r.dataset.status===st);
    const okC=(ch==='all')||(ch==='B2C'&&r.dataset.channel.indexOf('B2C')===0)||(r.dataset.channel===ch);
    const show=actionable&&okWo&&okCl&&okPr&&okMat&&okV&&okS&&okC; r.style.display=show?'':'none';
    if(show)secCount[r.dataset.channel]=(secCount[r.dataset.channel]||0)+1;
  });
  let total=0;
  document.querySelectorAll('#rm-body tr.rm-sec').forEach(h=>{
    const n=secCount[h.dataset.sec]||0; h.style.display=n?'':'none';
    const c=h.querySelector('.seccount'); if(c)c.textContent=n+(n===1?' line':' lines');
    total+=n;
  });
  document.getElementById('rm-count').textContent=total+(total===1?' line':' lines');
}
function rmClear(){
  ['rm-f-wo','rm-f-client','rm-f-project','rm-f-mat'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('rm-vendor').value='all';
  document.getElementById('rm-status').value='all';
  document.getElementById('rm-channel').value='all';
  rmFilter();
}

// ---- PO Dashboard: monthly value trend chart (vendor filterable, with total) ----
function renderPOValChart(){
 const el=document.getElementById('povalchart');if(!el)return;
 const v=document.getElementById('poval-vendor').value;
 const vals=povalData[v]||povalData.all;
 const labels=['May','June','July (MTD)'];
 const mx=Math.max(...Object.values(povalData).map(a=>Math.max(...a)));
 el.innerHTML=labels.map((l,i)=>`<div class="sqg"><div class="bars"><span class="b" style="height:${vals[i]/mx*100}px;background:var(--orange)" title="₹${vals[i]}L"></span></div><span class="lb">${l}</span><span class="mono" style="font-size:9px;color:var(--grey)">₹${vals[i]}L</span></div>`).join('');
 const total=vals.reduce((s,x)=>s+x,0);
 document.getElementById('poval-total').textContent='Total ₹'+total.toFixed(1)+'L';
 document.getElementById('poval-note').textContent=v==='all'
   ?'May 40.9L → June 45.4L → July 24.6L (MTD, partial month). Historical trend, all POs, all vendors.'
   :'May '+vals[0]+'L → June '+vals[1]+'L → July '+vals[2]+'L (MTD, partial month) for '+v+' only. Historical trend, all POs.';
}
function poPopulateDatalists(){
  const nos=new Set(),wos=new Set(),clients=new Set(),projects=new Set(),mats=new Set();
  document.querySelectorAll('#po-body tr').forEach(r=>{
    const tds=r.querySelectorAll('td');
    nos.add(tds[0].textContent.trim());
    wos.add(tds[1].textContent.trim());
    clients.add(tds[3].textContent.trim());
    projects.add(tds[4].textContent.trim());
    mats.add(tds[6].textContent.trim());
  });
  const fill=(id,vals)=>{document.getElementById(id).innerHTML=[...vals].sort().map(v=>`<option value="${v}">`).join('');};
  fill('po-dl-no',nos); fill('po-dl-wo',wos); fill('po-dl-client',clients); fill('po-dl-project',projects); fill('po-dl-mat',mats);
}
function poFilter(){
  const no=(document.getElementById('po-f-no').value||'').trim().toLowerCase();
  const wo=(document.getElementById('po-f-wo').value||'').trim().toLowerCase();
  const cl=(document.getElementById('po-f-client').value||'').trim().toLowerCase();
  const pr=(document.getElementById('po-f-project').value||'').trim().toLowerCase();
  const mat=(document.getElementById('po-f-mat').value||'').trim().toLowerCase();
  const v=document.getElementById('po-vendor').value;
  const ch=document.getElementById('po-channel').value;
  const st=document.getElementById('po-status').value;
  let shown=0;
  document.querySelectorAll('#po-body tr').forEach(r=>{
    const tds=r.querySelectorAll('td');
    const okNo=(no===''||tds[0].textContent.toLowerCase().includes(no));
    const okWo=(wo===''||tds[1].textContent.toLowerCase().includes(wo));
    const okCl=(cl===''||tds[3].textContent.toLowerCase().includes(cl));
    const okPr=(pr===''||tds[4].textContent.toLowerCase().includes(pr));
    const okMat=(mat===''||tds[6].textContent.toLowerCase().includes(mat));
    const okV=(v==='all'||r.dataset.vendor===v);
    const okC=(ch==='all')||(ch==='B2C'&&r.dataset.channel.indexOf('B2C')===0)||(r.dataset.channel===ch);
    const okSt=(st==='all'||r.dataset.status===st);
    const show=okNo&&okWo&&okCl&&okPr&&okMat&&okV&&okC&&okSt; r.style.display=show?'':'none'; if(show)shown++;
  });
  document.getElementById('po-count').textContent=shown+' open';
}
function poClear(){
  ['po-f-no','po-f-wo','po-f-client','po-f-project','po-f-mat'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('po-vendor').value='all';
  document.getElementById('po-channel').value='all';
  document.getElementById('po-status').value='all';
  poFilter();
}

// ---- Rejection Dashboard ----
function rejChannelTag(ch){
  if(!ch)return '—';
  if(ch==='B2B')return '<span class="tagB">B2B</span>';
  return '<span class="tagC">B2C</span> · '+ch.split('-')[1];
}
function rejReasonKey(txt){return txt.split(' —')[0].trim();}
function rejAgg(months){
  const map={};
  rejInstances.filter(r=>months.includes(r.month)).forEach(r=>{
    if(!map[r.station])map[r.station]={orders:new Set(),qty:0,reasons:{}};
    map[r.station].orders.add(r.wo);
    map[r.station].qty+=r.qty;
    const key=rejReasonKey(r.reason);
    map[r.station].reasons[key]=(map[r.station].reasons[key]||0)+r.qty;
  });
  return map;
}
function rejLookup(){
  const wo=(document.getElementById('rej-wo').value||'').trim().toUpperCase().replace(/^WO\s*/,'');
  const rows=rejInstances.filter(r=>r.wo===wo);
  const card=document.getElementById('rej-order-card');
  if(!rows.length){alert('No rejection records for WO '+(wo||'(blank)')+' in demo dataset. Try 0134B, 0374, 0503, 0428B, 0469B, 0407, 0320C or 0518A.');return;}
  const meta=rejOrderMeta[wo]||{};
  document.getElementById('rej-wo-title').textContent='WO '+wo;
  document.getElementById('rej-wo-meta').innerHTML=' — '+rejChannelTag(meta.channel)+' · '+rows[0].client+' — '+(meta.project||'—');
  document.getElementById('rej-order-body').innerHTML=rows.map(r=>`<tr class="row r-late"><td>${r.station}</td><td class="dt">${r.date}</td><td class="mono" style="color:var(--late);font-weight:700">${r.qty}</td><td>${r.reason}</td><td><button class="btn">Rework ticket</button></td></tr>`).join('');
  const total=rows.reduce((s,r)=>s+r.qty,0);
  document.getElementById('rej-order-note').textContent='This order was rejected at '+rows.length+' station'+(rows.length>1?'s':'')+' — '+total+' pcs total. Each line raises a station exception and, if on the critical path, shifts the order ECD (Logic I).';
  card.style.display='';
}
// Station-wise rejection register — clubs the old station summary + rejection register into one table, grouped by station (rowspan), ranked by qty within the selected period.
function rejRenderStationTable(){
  const months=rejCurrentMonths();
  const reasonFilter=document.getElementById('rej-reason').value;
  const agg=rejAgg(months);
  const stationOrder=Object.entries(agg).sort((a,b)=>b[1].qty-a[1].qty).map(([st])=>st);
  let rows=rejInstances.filter(r=>months.includes(r.month));
  if(reasonFilter!=='all') rows=rows.filter(r=>rejReasonKey(r.reason)===reasonFilter);
  const grouped=stationOrder.map(st=>({station:st,items:rows.filter(r=>r.station===st)})).filter(g=>g.items.length);
  document.getElementById('rej-station-body').innerHTML=grouped.map(g=>g.items.map((r,i)=>{
    const meta=rejOrderMeta[r.wo]||{};
    return `<tr class="row r-late">${i===0?`<td rowspan="${g.items.length}">${g.station}</td>`:''}<td class="wo">${r.wo}</td><td>${rejChannelTag(meta.channel)}</td><td>${r.client}</td><td>${meta.project||'—'}</td><td class="dt">${r.date}</td><td class="mono" style="color:var(--late);font-weight:700">${r.qty}</td><td>${r.reason}</td></tr>`;
  }).join('')).join('') || '<tr><td colspan="8" class="note" style="padding:14px">No rejections match this reason for the selected period.</td></tr>';
}
function rejFilter(){ rejRenderStationTable(); }
let rejPeriod='mtd';
function rejCurrentMonths(){return rejPeriod==='mtd'?['July']:REJ_3MO;}
function rejSetPeriod(p){
  rejPeriod=p;
  document.getElementById('rej-per-mtd').className='btn'+(p==='mtd'?' primary':'');
  document.getElementById('rej-per-3mo').className='btn'+(p==='3mo'?' primary':'');
  const months=rejCurrentMonths();
  const agg=rejAgg(months);
  const rowsAgg=Object.entries(agg).sort((a,b)=>b[1].qty-a[1].qty);
  let totalPcs=0; const totalOrders=new Set();
  rowsAgg.forEach(([,d])=>{totalPcs+=d.qty;d.orders.forEach(o=>totalOrders.add(o));});
  document.getElementById('rej-count').textContent=totalPcs+' pcs · '+totalOrders.size+' orders';
  const topSt=rowsAgg[0];
  document.getElementById('rej-k1-n').textContent=totalOrders.size;
  document.getElementById('rej-k1-l').textContent='Total rejections ('+(p==='mtd'?'MTD':'past 3 months')+')';
  document.getElementById('rej-k2-n').textContent=topSt?topSt[0]:'—';
  document.getElementById('rej-k3-n').textContent=totalPcs;
  document.getElementById('rej-k3-l').textContent='Pieces rejected ('+(p==='mtd'?'MTD':'past 3 months')+')';
  rejRenderStationTable();
}
// Fixed KPI: 3-month average is always Apr–Jun (the 3 most recently *completed* months) regardless of the This month/Past 3 months toggle above.
function rejUpdate3moAvgKPI(){
  const total=rejInstances.filter(r=>REJ_3MO.includes(r.month)).reduce((s,r)=>s+r.qty,0);
  document.getElementById('rej-k4-n').textContent=(total/REJ_3MO.length).toFixed(1);
}
function renderRejTrendChart(){
  const el=document.getElementById('rej-trend-chart');if(!el)return;
  const station=document.getElementById('rej-trend-station').value;
  const vals=REJ_3MO.map(m=>rejInstances.filter(r=>r.month===m&&(station==='all'||r.station===station)).reduce((s,r)=>s+r.qty,0));
  const mx=Math.max(1,...vals);
  el.innerHTML=REJ_3MO.map((l,i)=>`<div class="sqg"><div class="bars"><span class="b" style="height:${vals[i]/mx*100}px;background:var(--late)" title="${vals[i]} pcs"></span></div><span class="lb">${l}</span><span class="mono" style="font-size:9px;color:var(--grey)">${vals[i]} pcs</span></div>`).join('');
  const avg=(vals.reduce((s,v)=>s+v,0)/REJ_3MO.length);
  const dir=vals[2]>vals[0]?'worsening':(vals[2]<vals[0]?'improving':'flat');
  const scope=station==='all'?'All stations':station;
  document.getElementById('rej-trend-note').textContent=scope+' — April '+vals[0]+' → May '+vals[1]+' → June '+vals[2]+' — '+dir+' trend, 3-month average '+avg.toFixed(1)+' pcs/month (Apr–Jun, excludes current month).';
}
function renderRejStationChart(){
  const el=document.getElementById('rej-station-chart');if(!el)return;
  const agg=rejAgg(['July']);
  const rows=Object.entries(agg).sort((a,b)=>b[1].qty-a[1].qty);
  const mx=Math.max(...rows.map(([,d])=>d.qty));
  el.innerHTML=rows.map(([st,d])=>`<div class="sqg"><div class="bars"><span class="b" style="height:${d.qty/mx*100}px;background:var(--late)" title="${d.qty} pcs"></span></div><span class="lb">${st}</span><span class="mono" style="font-size:9px;color:var(--grey)">${d.qty} pcs</span></div>`).join('');
}

// ---- Order Route & Days: find-order filter bar ----
// Channel/sub-channel/designer mirror the same B2B / B2C·AI/AID/Pune model and client/designer names used on the RM Dashboard.
function orPopulateFilters(){
  const clients=new Set(),projects=new Set(),designers=new Set();
  const scopedOrders=orRouteOrders.filter(roleAllowsOrder);
  scopedOrders.forEach(o=>{clients.add(o.client);projects.add(o.project);designers.add(o.designer);});
  currentDesignerOptions(scopedOrders).forEach(d=>designers.add(d));
  const fillSel=(id,vals,label)=>{document.getElementById(id).innerHTML=`<option value="all">${label}</option>`+[...vals].sort().map(v=>`<option>${v}</option>`).join('');};
  fillSel('or-f-client',clients,currentScopeLabel()?'All visible clients':'All clients');
  fillSel('or-f-designer',designers,currentScopeLabel()?'All visible designers':'All designers');
  document.getElementById('or-dl-project').innerHTML=[...projects].sort().map(v=>`<option value="${v}">`).join('');
  document.getElementById('or-dl-wo').innerHTML=scopedOrders.map(o=>`<option value="${o.wo}">`).join('');
  orFilterUpdate();
}
function orChannelChange(){
  const ch=document.getElementById('or-f-channel').value;
  const sub=document.getElementById('or-f-sub');
  if(ch==='B2C'){sub.style.display='';}else{sub.style.display='none';sub.value='all';}
  orFilterUpdate();
}
function orFilterUpdate(){
  const wo=(document.getElementById('or-f-wo').value||'').trim().toUpperCase();
  const cl=document.getElementById('or-f-client').value;
  const pr=(document.getElementById('or-f-project').value||'').trim().toLowerCase();
  const ch=document.getElementById('or-f-channel').value;
  const sub=document.getElementById('or-f-sub').value;
  const ds=document.getElementById('or-f-designer').value;
  const matches=orRouteOrders.filter(o=>{
    const okRole=roleAllowsOrder(o);
    const okWo=(wo===''||o.wo.toUpperCase().includes(wo));
    const okCl=(cl==='all'||o.client===cl);
    const okPr=(pr===''||o.project.toLowerCase().includes(pr));
    const okCh=(ch==='all'||o.channel===ch);
    const okSub=(ch!=='B2C'||sub==='all'||o.sub===sub);
    const okDs=(ds==='all'||o.designer===ds);
    return okRole&&okWo&&okCl&&okPr&&okCh&&okSub&&okDs;
  });
  const sel=document.getElementById('or-f-order');
  sel.innerHTML=matches.length?matches.map(o=>`<option value="${o.wo}">WO ${o.wo} — ${o.client} (${o.project})</option>`).join(''):'<option value="">No matching orders</option>';
  document.getElementById('or-match-count').textContent=matches.length+' match'+(matches.length===1?'':'es');
}
function orClearFilters(){
  document.getElementById('or-f-wo').value='';
  document.getElementById('or-f-client').value='all';
  document.getElementById('or-f-project').value='';
  document.getElementById('or-f-channel').value=currentChannelScope()||'all';
  document.getElementById('or-f-sub').value=currentSubScope()||'all';
  document.getElementById('or-f-sub').style.display=currentChannelScope()==='B2C'?'':'none';
  document.getElementById('or-f-designer').value=currentDesigner()||'all';
  orFilterUpdate();
}
function orLoadOrder(wo){
  if(!wo)return;
  if(wo==='0428B'){alert('WO 0428B loaded (demo dataset). In production this filters/loads the matching order and redraws the process table, machine-day plan and CPM.');return;}
  const o=orRouteOrders.find(x=>x.wo===wo);
  alert('WO '+wo+(o?' — '+o.client+', "'+o.project+'"':'')+' — in production Sparta loads this order\u2019s route, CPM and day plan here. Demo dataset has full route detail built out for 0428B only.');
}

// ---- Order Detail: find-order filter bar (same orRouteOrders master as Order Route & Days) ----
function odPopulateFilters(){
  const clients=new Set(),projects=new Set(),designers=new Set();
  const scopedOrders=orRouteOrders.filter(roleAllowsOrder);
  scopedOrders.forEach(o=>{clients.add(o.client);projects.add(o.project);designers.add(o.designer);});
  currentDesignerOptions(scopedOrders).forEach(d=>designers.add(d));
  const fillSel=(id,vals,label)=>{document.getElementById(id).innerHTML=`<option value="all">${label}</option>`+[...vals].sort().map(v=>`<option>${v}</option>`).join('');};
  fillSel('od-f-client',clients,currentScopeLabel()?'All visible clients':'All clients');
  fillSel('od-f-designer',designers,currentScopeLabel()?'All visible designers':'All designers');
  document.getElementById('od-dl-project').innerHTML=[...projects].sort().map(v=>`<option value="${v}">`).join('');
  document.getElementById('od-dl-wo').innerHTML=scopedOrders.map(o=>`<option value="${o.wo}">`).join('');
  odFilterUpdate();
}
function odChannelChange(){
  const ch=document.getElementById('od-f-channel').value;
  const sub=document.getElementById('od-f-sub');
  if(ch==='B2C'){sub.style.display='';}else{sub.style.display='none';sub.value='all';}
  odFilterUpdate();
}
function odFilterUpdate(){
  const wo=(document.getElementById('od-f-wo').value||'').trim().toUpperCase();
  const cl=document.getElementById('od-f-client').value;
  const pr=(document.getElementById('od-f-project').value||'').trim().toLowerCase();
  const ch=document.getElementById('od-f-channel').value;
  const sub=document.getElementById('od-f-sub').value;
  const ds=document.getElementById('od-f-designer').value;
  const matches=orRouteOrders.filter(o=>{
    const okRole=roleAllowsOrder(o);
    const okWo=(wo===''||o.wo.toUpperCase().includes(wo));
    const okCl=(cl==='all'||o.client===cl);
    const okPr=(pr===''||o.project.toLowerCase().includes(pr));
    const okCh=(ch==='all'||o.channel===ch);
    const okSub=(ch!=='B2C'||sub==='all'||o.sub===sub);
    const okDs=(ds==='all'||o.designer===ds);
    return okRole&&okWo&&okCl&&okPr&&okCh&&okSub&&okDs;
  });
  const sel=document.getElementById('od-f-order');
  sel.innerHTML=matches.length?matches.map(o=>`<option value="${o.wo}">WO ${o.wo} — ${o.client} (${o.project})</option>`).join(''):'<option value="">No matching orders</option>';
  document.getElementById('od-match-count').textContent=matches.length+' match'+(matches.length===1?'':'es');
}
function odClearFilters(){
  document.getElementById('od-f-wo').value='';
  document.getElementById('od-f-client').value='all';
  document.getElementById('od-f-project').value='';
  document.getElementById('od-f-channel').value=currentChannelScope()||'all';
  document.getElementById('od-f-sub').value=currentSubScope()||'all';
  document.getElementById('od-f-sub').style.display=currentChannelScope()==='B2C'?'':'none';
  document.getElementById('od-f-designer').value=currentDesigner()||'all';
  odFilterUpdate();
}
function odLoadOrder(wo){
  if(!wo)return;
  if(wo==='0374'){alert('WO 0374 loaded (demo dataset). In production this filters/loads the matching order and redraws the material, packing, dispatch and route-stepper panels.');return;}
  const o=orRouteOrders.find(x=>x.wo===wo);
  alert('WO '+wo+(o?' — '+o.client+', "'+o.project+'"':'')+' — in production Sparta loads this order\u2019s detail view here. Demo dataset has full detail built out for 0374 only.');
}
// ---- station day-wise load (date range) ----
function renderDayLoad(){const f=new Date(document.getElementById('ld-from').value),t=new Date(document.getElementById('ld-to').value);
 const days=[];for(let d=new Date(f);d<=t&&days.length<14;d.setDate(d.getDate()+1))days.push(new Date(d));
 const wdays=days.filter(d=>d.getDay()!==0).length;
 const el=document.getElementById('dayload');el.style.gridTemplateColumns='92px repeat('+days.length+',1fr) 78px';
 let h='<div class="hh"></div>'+days.map(d=>`<div class="hh">${d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric'})}${d.getDay()===0?'<br>HOL':''}</div>`).join('')+`<div class="hh">${wdays}-day<br>Total</div>`;
 Object.entries(dlBase).forEach(([st,base],ri)=>{
   let sum=0;
   const cells=days.map((d,ci)=>{if(d.getDay()===0)return'<div class="hc h">—</div>';const v=Math.round(base+10*Math.sin((ci+ri)*1.3)-ci*1.8);sum+=v;const b=v>=100?'b5':v>=90?'b4':v>=80?'b3':v>=60?'b2':'b1';return`<div class="hc ${b}">${v}%</div>`;}).join('');
   const capBasis=wdays*100;
   const tb=sum>capBasis?'b5':sum>=capBasis*0.9?'b4':sum>=capBasis*0.75?'b3':'b1';
   const totCell=`<div class="hc ${tb}" title="${wdays} working days × 100% = ${capBasis}% basis">${sum}%</div>`;
   h+=`<div class="hl">${st}</div>`+cells+totCell;
 });
 el.innerHTML=h;}
// ---- process modal ----
function openProcModal(mode){document.getElementById('pm-title').textContent=mode==='add'?'Add process':'Edit process — 4SEB GJP Prelam';document.getElementById('procmodal').classList.add('on');}
document.getElementById('procmodal').addEventListener('click',e=>{if(e.target.id==='procmodal')e.target.classList.remove('on');});

// ---- clickable report previews ----

// ---- Masters & Config: expanded "Open" views ----
function openMaster(key){
  const d=masterData[key];if(!d)return;
  document.getElementById('mm-title').textContent=d.title;
  document.getElementById('mm-note').textContent=d.note;
  document.getElementById('mm-body').innerHTML=d.body;
  document.getElementById('mastmodal').classList.add('on');
}
document.getElementById('mastmodal').addEventListener('click',e=>{if(e.target.id==='mastmodal')e.target.classList.remove('on');});

// ---- Users & Roles: configurator data + rendering ----
function renderKPIs(){
  const counts={rwe:0,rw:0,view:0,scan:0};
  USERS.forEach(u=>counts[u.access]++);
  document.getElementById('u-kpis').innerHTML=
    '<div class="ukpi"><div class="n">'+USERS.length+'</div><div class="l">Total users</div></div>'
    +'<div class="ukpi"><div class="n" style="color:var(--ok)">'+counts.rwe+'</div><div class="l">Read+Write+Edit</div></div>'
    +'<div class="ukpi"><div class="n" style="color:var(--info)">'+counts.rw+'</div><div class="l">Read+Write</div></div>'
    +'<div class="ukpi"><div class="n" style="color:var(--grey)">'+counts.view+'</div><div class="l">View only</div></div>'
    +'<div class="ukpi"><div class="n" style="color:#9a6b00">'+counts.scan+'</div><div class="l">Scan (station)</div></div>';
}
function populateGroupFilter(){
  const sel=document.getElementById('u-group');
  Object.keys(GROUPS).forEach(k=>{
    const o=document.createElement('option');o.value=k;o.textContent=GROUPS[k][1];sel.appendChild(o);
  });
}
function renderDirectory(){
  const q=(document.getElementById('u-search').value||'').toLowerCase();
  const g=document.getElementById('u-group').value;
  const a=document.getElementById('u-access').value;
  const rows=USERS.filter(u=>{
    if(g&&u.group!==g)return false;
    if(a&&u.access!==a)return false;
    if(q&&!(u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)||u.role.toLowerCase().includes(q)))return false;
    return true;
  });
  document.getElementById('u-count').textContent='Showing '+rows.length+' of '+USERS.length;
  document.getElementById('u-tbody').innerHTML=rows.map(u=>{
    const acc=ACCESS[u.access];const grp=GROUPS[u.group];
    return '<tr><td><div class="unamewrap"><span class="avatar" style="background:'+avColor(u.name)+'">'+initials(u.name)+'</span>'+u.name+'</div></td>'
    +'<td class="uemail">'+u.email+'</td>'
    +'<td>'+u.role+'</td>'
    +'<td class="gtag">'+grp[1]+'</td>'
    +'<td><span class="chip '+acc[1]+'">'+acc[0]+'</span></td>'
    +'<td class="note">'+u.scope+'</td></tr>';
  }).join('');
}
function designerChips(group){
  return USERS.filter(u=>u.role==='Designer'&&u.group===group).map(d=>'<span class="dchip">'+d.name+'</span>').join('');
}
function renderMap(){
  document.getElementById('ut-map-cards').innerHTML=
   '<div class="scard"><h4>AI</h4><div class="note">Head: <b>Harsha</b> (harsha@saviesahome.com) — sees orders of all 10 AI designers.</div><div class="dchips">'+designerChips('ai')+'</div></div>'
   +'<div class="scard"><h4>AID</h4><div class="note">Head: <b>Bhati</b> (bhati@saviesahome.com) — sees orders of all 10 AID designers.</div><div class="dchips">'+designerChips('aid')+'</div></div>'
   +'<div class="scard"><h4>Pune</h4><div class="note">Heads: <b>Amaar</b> &amp; <b>Rachna</b> — each sees orders of all 10 Pune designers.</div><div class="dchips">'+designerChips('pune')+'</div></div>'
   +'<div class="scard"><h4>B2C</h4><div class="note"><b>RTA</b> — Read+Write+Edit, all B2C orders.<br><b>Monesh</b> — View, all B2C orders <u>plus all B2B orders</u>.</div></div>'
   +'<div class="scard"><h4>B2B</h4><div class="note"><b>Mary</b> — B2B Manager, view all B2B orders.<br>Also visible to <b>Monesh</b> (B2C Head, cross-channel view).</div></div>'
   +'<div class="scard"><h4>Full access (Ops / PPC)</h4><div class="note"><b>Jatin</b> (Ops Head, Read+Write) · <b>Anand, Namrata, Mangesh</b> (PPC Heads, Read+Write+Edit) · Order Processing POC &amp; Operations Team (View) — all see every order, every screen.</div></div>';
}
function renderFloor(){
  document.getElementById('u-floorgrid').innerHTML=STATIONS.map(([st])=>{
    const ops=USERS.filter(u=>u.station===st);
    const chips=ops.map(o=>'<span class="dchip">'+o.email+'</span>').join('');
    return '<div class="mtile"><b>'+st+'</b><div class="note">'+ops.length+' operator'+(ops.length>1?'s':'')+' · Station Scan only</div><div class="dchips">'+chips+'</div></div>';
  }).join('');
}
function showUTab(t){
  document.querySelectorAll('.utabs button').forEach(b=>b.classList.toggle('on',b.dataset.ut===t));
  document.querySelectorAll('.upanel').forEach(p=>p.classList.remove('on'));
  document.getElementById('ut-'+t).classList.add('on');
}
function renderB2CTree(){
  const chipNames=names=>names.map(n=>'<span class="dchip">'+n+'</span>').join('');
  const groupChips=g=>USERS.filter(u=>u.group===g&&u.role.indexOf('Designer')>-1).map(u=>'<span class="dchip">'+u.name+'</span>').join('');
  document.getElementById('u-b2c-tree').innerHTML=
    '<div class="treecard"><h4>Harsha - AI</h4>'
    +'<div class="note"><b>Head visibility:</b> all AI B2C orders.</div>'
    +'<div class="treelevel"><strong>AI direct designers</strong><div class="note">Own-order designer access.</div><div class="dchips">'+groupChips('b2c_ai')+'</div></div>'
    +'<div class="treelevel"><strong>Vrinda subgroup</strong><div class="note">Vrinda sees only Varun and Nivya orders.</div><div class="dchips">'+chipNames(['Vrinda','Varun','Nivya'])+'</div></div>'
    +'</div>'
    +'<div class="treecard"><h4>Bharti - AID</h4>'
    +'<div class="note"><b>Head visibility:</b> all AID, Retail and Digital Lead B2C orders.</div>'
    +'<div class="treelevel"><strong>AID direct designers</strong><div class="note">Own-order designer access.</div><div class="dchips">'+groupChips('b2c_aid')+'</div></div>'
    +'<div class="treelevel"><strong>Sakshi - AID-walkin</strong><div class="note">Sakshi sees only Usha, Aishwarya, Ashmi and Krish orders.</div><div class="dchips">'+chipNames(['Sakshi','Usha','Aishwarya','Ashmi','Krish'])+'</div></div>'
    +'<div class="treelevel"><strong>AID-DL Manager</strong><div class="note">DL Manager sees only Ravi, Jennifer, Shruti and Siddhesh orders.</div><div class="dchips">'+chipNames(['DL Manager','Ravi','Jennifer','Shruti','Siddhesh'])+'</div></div>'
    +'</div>'
    +'<div class="treecard"><h4>Amarkant / Rachana - Pune</h4>'
    +'<div class="note"><b>Head visibility:</b> Pune B2C team orders.</div>'
    +'<div class="treelevel"><strong>Pune designers</strong><div class="note">Designers see only their own Pune B2C orders.</div><div class="dchips">'+groupChips('b2c_pune')+'</div></div>'
    +'</div>';
}
function renderOrgRoleMap(){
  const chips=g=>USERS.filter(u=>u.group===g).map(u=>'<span class="dchip">'+u.name+'</span>').join('');
  document.getElementById('ut-map-cards').innerHTML=
    '<div class="scard"><h4>Full Admin / Management</h4><div class="note">All pages, all B2B and B2C orders, Masters &amp; Config.</div><div class="dchips">'+chips('admin')+'</div></div>'
    +'<div class="scard"><h4>PPC / Planning</h4><div class="note">Planning dashboards, route, load, priority and reports for all orders.</div><div class="dchips">'+chips('ppc')+'</div></div>'
    +'<div class="scard"><h4>B2C AI - Harsha</h4><div class="note">Harsha sees all AI. Vrinda sees AI-Vrinda subgroup only.</div><div class="dchips">'+chips('b2c_ai')+chips('b2c_ai_vrinda')+'</div></div>'
    +'<div class="scard"><h4>B2C AID - Bharti</h4><div class="note">Bharti sees all AID. Sakshi sees AID-walkin. DL Manager sees AID-DL.</div><div class="dchips">'+chips('b2c_aid')+chips('b2c_aid_walkin')+chips('b2c_aid_dl')+'</div></div>'
    +'<div class="scard"><h4>B2C Pune - Amarkant / Rachana</h4><div class="note">Amarkant and Rachana manage Pune. Designers see Pune B2C own orders only.</div><div class="dchips">'+chips('b2c_pune')+'</div></div>'
    +'<div class="scard"><h4>Purchase</h4><div class="note">RM Dashboard, PO Dashboard and purchase-linked reports.</div><div class="dchips">'+chips('purchase')+'</div></div>'
    +'<div class="scard"><h4>Production / Floor</h4><div class="note">Production gets load, scan, packing and route context. Operators are station-scoped.</div><div class="dchips">'+chips('production')+chips('supervisor')+chips('floor')+'</div></div>'
    +'<div class="scard"><h4>Dispatch / Logistics</h4><div class="note">Packing station, order detail and dispatch-linked reports.</div><div class="dchips">'+chips('dispatch')+'</div></div>'
    +'<div class="scard"><h4>Org Chart Only</h4><div class="note">Visible in the master org chart, no dashboard access in this phase.</div><div class="dchips">'+chips('chartonly')+'</div></div>';
  const warn=document.querySelector('#ut-map .warnbox');
  if(warn)warn.innerHTML='<b>Visibility rules enforced app-wide:</b><div style="margin-top:5px">Designers see only their own B2C orders and cannot switch to B2B.</div><div>Sakshi sees AID-walkin only: Usha, Aishwarya, Ashmi, Krish.</div><div>DL Manager sees AID-DL only: Ravi, Jennifer, Shruti, Siddhesh.</div><div>Vrinda sees AI subgroup only: Varun and Nivya.</div>';
}
function renderOrgFloor(){
  const rows=USERS.filter(u=>u.group==='floor'||u.group==='supervisor');
  document.getElementById('u-floorgrid').innerHTML=rows.map(u=>'<div class="mtile"><b>'+u.name+'</b><div class="note">'+u.role+' · '+u.scope+'</div><div class="dchips"><span class="dchip">'+u.email+'</span></div></div>').join('');
}
function renderAccessMatrix(){
  const cols=ALL_PAGES;
  const head='<thead><tr><th>Role</th>'+cols.map(k=>'<th>'+ACCESS_PAGE_LABELS[k]+'</th>').join('')+'</tr></thead>';
  const body='<tbody>'+PAGE_ACCESS_ROLES.map(r=>{
    const set=new Set(r.pages);
    return '<tr><td><span class="role">'+r.role+'</span><span class="scope">'+r.scope+'</span></td>'
      +cols.map(k=>set.has(k)?'<td class="yes">✓</td>':'<td class="no">-</td>').join('')+'</tr>';
  }).join('')+'</tbody>';
  document.getElementById('u-access-matrix').innerHTML='<table class="accessmatrix">'+head+body+'</table>';
}
let usersInit=false;
function openUsersConfig(){
  if(!usersInit){renderKPIs();populateGroupFilter();renderDirectory();renderOrgRoleMap();renderB2CTree();renderOrgFloor();renderAccessMatrix();usersInit=true;}
  document.getElementById('usersmodal').classList.add('on');
}
function closeUsersConfig(){document.getElementById('usersmodal').classList.remove('on');}
document.getElementById('usersmodal').addEventListener('click',e=>{if(e.target.id==='usersmodal')e.target.classList.remove('on');});

function addHoliday(){
  const dEl=document.getElementById('cal-hol-date'),lEl=document.getElementById('cal-hol-label');
  if(!dEl||!dEl.value){alert('Pick a date first.');return;}
  const dt=new Date(dEl.value+'T00:00:00');
  const dayName=dt.toLocaleDateString('en-GB',{weekday:'short'});
  const dateLabel=dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const label=(lEl.value||'').trim();
  const chipText='Planned holiday'+(label?' ('+label+')':'');
  const row=`<tr><td class="dt">${dateLabel}</td><td>${dayName}</td><td><span class="chip c-watch">${chipText}</span></td></tr>`;
  document.getElementById('cal-hol-body').insertAdjacentHTML('beforeend',row);
  dEl.value='';lEl.value='';
  alert('Holiday added: '+dateLabel+(label?' — '+label:'')+'. Every open order\u2019s machine-day plan, CPM and Sparta ECD are recalculated around it — audit-logged.');
}

// ---- packing scan simulation ----
let scanned=213;const miss=['PNL-0134B-207','SHT-0134B-131','SHT-0134B-114'];
function simScan(){
  if(scanned>=216){document.getElementById('lastscan').textContent='All 216 items scanned — packet may be closed';return;}
  const item=miss.pop();scanned++;
  document.getElementById('pk-scan').textContent=scanned;
  document.getElementById('pk-miss').textContent=216-scanned;
  document.getElementById('lastscan').textContent='✔ '+item+' scanned 14:'+(30+scanned%30)+' · found at Edge Band';
  const tb=document.getElementById('misslist');if(tb.rows.length)tb.deleteRow(tb.rows.length-1);
  if(scanned===216){
    document.getElementById('pk-chip').textContent='Packing complete';document.getElementById('pk-chip').className='chip c-ok';
    document.getElementById('pk-warn').innerHTML='<b>PPC impact:</b> packing complete · dispatch readiness recalculated to <b>16 Jul</b> (Logic C) · FG movement scan next.';
    document.getElementById('pk-warn').style.background='var(--ok-soft)';document.getElementById('pk-warn').style.borderColor='#bfe3c8';
  }
}


