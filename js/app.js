// Startup wiring for the Sparta mockup.

document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>{
  if(b.style.display==='none')return;
  document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  document.getElementById('s-'+b.dataset.s).classList.add('on');
  document.getElementById('ttl').textContent=titles[b.dataset.s][0];
  document.getElementById('tsub').textContent=titles[b.dataset.s][1];
  window.scrollTo(0,0);
}));
otPreview();
renderMonth();
document.getElementById('loadrows').innerHTML=ld.map(([s,q,w,i,c,l,act])=>{
  const band=loadBand(l);
  const bw=Math.min(l,130)/1.3;
  return `<tr class="row r-${band.row}">
    <td style="font-weight:600">${s}<div class="note" style="font-weight:400">WIP <span class="mono">${w}</span></div></td>
    <td class="mono">${c} sqft/day</td>
    <td><div class="loadbar"><i style="width:${bw}%;background:${band.color}"></i><span class="cap" style="left:${100/1.3}%"></span></div></td>
    <td><span class="chip c-${band.row}">${band.label}</span></td>
    <td class="note">${act}</td></tr>`;}).join('');
toggleDetails('0374');
document.getElementById('ovl').addEventListener('click',e=>{if(e.target.id==='ovl')closeOverride();});
(function(){
 const g=document.getElementById('gantt');if(!g)return;let html='<div></div>'+gdays.map(d=>`<div class="gh${d[1]?' today':''}">${d[0]}${d[2]?'<br>HOLIDAY':''}${d[1]?'<br>TODAY':''}</div>`).join('');
 glines.forEach(L=>{
   html+=`<div class="grl"><b>${L.name}</b><span class="note">${L.qty}</span></div>`;
   const cells=new Array(8).fill(null);
   L.segs.forEach(([s,len,st,m])=>{let placed=0,d=s;while(placed<len&&d<8){if(!gdays[d][2]){cells[d]={st,m};placed++;}d++;}});
   for(let d=0;d<8;d++){
     if(gdays[d][2]){html+=`<div class="cell hol">—</div>`;}
     else if(cells[d]){html+=`<div class="cell${gdays[d][1]?' tdy':''}" style="background:${stcol[cells[d].st]}">${cells[d].st}<br>${cells[d].m}</div>`;}
     else{html+=`<div class="cell${gdays[d][1]?' tdy':''}"></div>`;}
   }
 });
 g.innerHTML=html;
 document.getElementById('glegend').innerHTML=Object.entries(stcol).map(([k,v])=>`<span><i style="background:${v}"></i>${k}</span>`).join('')+'<span><i style="background:repeating-linear-gradient(45deg,#e9ebe5,#e9ebe5 3px,#f2f3ef 3px,#f2f3ef 6px)"></i>Holiday (calendar)</span>';
})();
toggleBottleneckProtection();
renderBottleneckForecast();
// ---- SQFT predicted vs actual ----
(function(){const el=document.getElementById('sqftchart');if(!el)return;
 const wk=[['W1 (1–7)',11000,10700],['W2 (8–15)',11800,10750],['W3 (16–24)',12200,null],['W4 (25–31)',11000,null]];
 const mx=12200;
 el.innerHTML=wk.map(([l,p,a])=>`<div class="sqg"><div class="bars"><span class="b" style="height:${p/mx*100}px;background:#c8cdd5" title="Predicted ${p}"></span><span class="b" style="height:${a?a/mx*100:2}px;background:${a?'var(--orange)':'#eee'}" title="Actual ${a??'—'}"></span></div><span class="lb">${l}</span><span class="mono" style="font-size:9px;color:var(--grey)">${(p/1000).toFixed(1)}k / ${a?(a/1000).toFixed(1)+'k':'—'}</span></div>`).join('');})();
// ---- XLS export buttons on all dashboard cards ----
document.querySelectorAll('#s-dash .card h3').forEach(h=>{const b=document.createElement('button');b.className='btn xls';b.textContent='⬇ XLS';b.onclick=e=>{e.stopPropagation();alert('Mock: exports "'+h.childNodes[0].textContent.trim()+'" data as .xlsx (API: GET /api/export/{widget}.xlsx)');};h.appendChild(b);});
document.querySelectorAll('#s-dash .revdate').forEach(input=>updateGapRow(input.closest('tr')));
rmPopulateDatalists();
rmFilter();
document.querySelectorAll('#s-rm .card h3').forEach(h=>{const b=document.createElement('button');b.className='btn xls';b.textContent='⬇ XLS';b.onclick=e=>{e.stopPropagation();alert('Mock: exports "'+h.childNodes[0].textContent.trim()+'" data as .xlsx (API: GET /api/export/rm.xlsx)');};h.appendChild(b);});
renderPOValChart();
poPopulateDatalists();
document.querySelectorAll('#s-po .card h3').forEach(h=>{const b=document.createElement('button');b.className='btn xls';b.textContent='⬇ XLS';b.onclick=e=>{e.stopPropagation();alert('Mock: exports "'+h.childNodes[0].textContent.trim()+'" data as .xlsx (API: GET /api/export/po.xlsx)');};h.appendChild(b);});
rejUpdate3moAvgKPI();
renderRejTrendChart();
renderRejStationChart();
rejSetPeriod('mtd');
document.querySelectorAll('#s-rej .card h3').forEach(h=>{if(h.closest('#rej-order-card'))return;const b=document.createElement('button');b.className='btn xls';b.textContent='⬇ XLS';b.onclick=e=>{e.stopPropagation();alert('Mock: exports "'+h.childNodes[0].textContent.trim()+'" data as .xlsx (API: GET /api/export/rejection.xlsx)');};h.appendChild(b);});
orPopulateFilters();
odPopulateFilters();
applyRole(currentRole);
renderDayLoad();
function unlockSparta(event){
  event.preventDefault();
  const input=document.getElementById('gate-password');
  const error=document.getElementById('gate-error');
  if(input.value==='saviesa-sparta'){
    sessionStorage.setItem('spartaAccess','ok');
    document.body.classList.remove('locked');
    error.style.display='none';
    return false;
  }
  error.style.display='block';
  input.select();
  return false;
}
if(sessionStorage.getItem('spartaAccess')==='ok'){
  document.body.classList.remove('locked');
}

