// Report modal data and handlers.

// ---- clickable report previews ----
const reportData={
  otif:{
    title:'OTIF trend - Overall / B2B / B2C stores',
    note:'Current month vs Apr-Jun average, including AI / AID / Pune store-wise OTIF.',
    body:'<div class="warnbox"><b>Report logic:</b> OTIF measures orders dispatched on or before the Committed date and fully completed at Packing. It is published as Overall, B2B, B2C and B2C store-wise AI / AID / Pune.</div>'
      +'<div class="note" style="margin:8px 0"><b>Formula:</b> <span class="mono">OTIF % = on-time-in-full dispatched orders / total dispatched orders x 100</span>. <b>Apr-Jun avg</b> is the average of Apr, May and Jun, excluding the current partial month. <b>Trend</b> compares Current month against Apr-Jun avg.</div>'
      +'<table><thead><tr><th>Level</th><th>Apr</th><th>May</th><th>Jun</th><th>Apr-Jun avg</th><th>Current month</th><th>Trend</th></tr></thead><tbody>'
      +'<tr class="row r-ok"><td><b>Overall</b></td><td class="mono">76%</td><td class="mono">80%</td><td class="mono">81%</td><td class="mono" style="font-weight:700">79%</td><td class="mono" style="font-weight:700;color:var(--ok)">82%</td><td><span class="trend up">Up +3%</span></td></tr>'
      +'<tr class="row r-watch"><td><b>B2C</b></td><td class="mono">73%</td><td class="mono">75%</td><td class="mono">77%</td><td class="mono" style="font-weight:700">75%</td><td class="mono" style="font-weight:700;color:var(--ok)">78%</td><td><span class="trend up">Up +3%</span></td></tr>'
      +'<tr class="row r-ok"><td><b>B2B</b></td><td class="mono">80%</td><td class="mono">84%</td><td class="mono">85%</td><td class="mono" style="font-weight:700">83%</td><td class="mono" style="font-weight:700;color:var(--ok)">86%</td><td><span class="trend up">Up +3%</span></td></tr>'
      +'<tr class="row r-ok"><td><b>B2C - AI</b></td><td class="mono">80%</td><td class="mono">83%</td><td class="mono">84%</td><td class="mono" style="font-weight:700">82%</td><td class="mono" style="font-weight:700;color:var(--ok)">84%</td><td><span class="trend up">Up +2%</span></td></tr>'
      +'<tr class="row r-watch"><td><b>B2C - AID</b></td><td class="mono">72%</td><td class="mono">76%</td><td class="mono">77%</td><td class="mono" style="font-weight:700">75%</td><td class="mono" style="font-weight:700;color:var(--watch)">78%</td><td><span class="trend up">Up +3%</span></td></tr>'
      +'<tr class="row r-ok"><td><b>B2C - Pune</b></td><td class="mono">84%</td><td class="mono">87%</td><td class="mono">88%</td><td class="mono" style="font-weight:700">86%</td><td class="mono" style="font-weight:700;color:var(--ok)">88%</td><td><span class="trend up">Up +2%</span></td></tr>'
      +'</tbody></table><div class="note" style="margin-top:8px"><b>Columns:</b> Level = reporting bucket; Apr/May/Jun = closed-month OTIF; Apr-Jun avg = stable 3-month baseline; Current month = July month-to-date; Trend = current month movement vs baseline.</div>'
  }
};
function openReport(key){
  const d=reportData[key];if(!d)return;
  document.getElementById('report-title').textContent=d.title;
  document.getElementById('report-note').textContent=d.note;
  document.getElementById('report-body').innerHTML=d.body;
  document.getElementById('reportmodal').classList.add('on');
}
function closeReport(){document.getElementById('reportmodal').classList.remove('on');}
document.getElementById('reportmodal').addEventListener('click',e=>{if(e.target.id==='reportmodal')closeReport();});

reportData.workerEff={
  title:'Worker efficiency report',
  note:'Worker efficiency = standard minutes earned from completed scans divided by attendance minutes. Rework scans earn 0.',
  body:'<div class="warnbox"><b>Report logic:</b> Worker efficiency compares useful standard production earned from completed scan-outs against the worker attendance time available in the shift. Rework scans are tracked, but they do not earn productive standard minutes.</div>'
    +'<div class="note" style="margin:8px 0"><b>Formula:</b> <span class="mono">Worker Eff % = earned standard minutes / attendance minutes x 100</span>. <b>Rework %</b> = rework quantity / total processed quantity x 100.</div>'
    +'<div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;margin:10px 0;padding:10px;background:#fafbf8;border:1px solid var(--line);border-radius:8px"><div><label class="note" style="display:block;font-weight:700">View day</label><input type="date" class="btn" value="2026-07-15" onchange="document.getElementById(&quot;worker-day-label&quot;).textContent=this.value"></div><div class="note">Selected day: <span class="mono" id="worker-day-label">2026-07-15</span></div></div>'
    +'<table><thead><tr><th>Worker</th><th>Station</th><th>Selected day eff</th><th>Apr-Jun avg</th><th>Current month</th><th>Trend</th><th>Rework %</th></tr></thead><tbody>'
    +'<tr class="row r-ok"><td class="mono">W-102</td><td>Beam Saw</td><td class="mono">94%</td><td class="mono">91%</td><td class="mono" style="font-weight:700;color:var(--ok)">93%</td><td><span class="trend up">Up +2%</span></td><td class="mono">0.8%</td></tr>'
    +'<tr class="row r-ok"><td class="mono">W-114</td><td>Edge Band</td><td class="mono">88%</td><td class="mono">84%</td><td class="mono" style="font-weight:700;color:var(--ok)">87%</td><td><span class="trend up">Up +3%</span></td><td class="mono">1.2%</td></tr>'
    +'<tr class="row r-watch"><td class="mono">W-131</td><td>Router</td><td class="mono">73%</td><td class="mono">76%</td><td class="mono" style="font-weight:700;color:#9a6b00">74%</td><td><span class="trend down">Down -2%</span></td><td class="mono">2.9%</td></tr>'
    +'<tr class="row r-late"><td class="mono">W-140</td><td>CNC</td><td class="mono">58%</td><td class="mono">69%</td><td class="mono" style="font-weight:700;color:var(--late)">62%</td><td><span class="trend down">Down -7%</span></td><td class="mono">4.1%</td></tr>'
    +'</tbody></table><div class="note" style="margin-top:8px"><b>Columns:</b> Worker = operator ID; Station = station worked; Selected day eff = efficiency for the date picked above; Apr-Jun avg = stable 3-month baseline; Current month = July month-to-date efficiency; Trend = current month vs Apr-Jun avg; Rework % = quality loss share.</div>'
};
reportData.supervisorEff={
  title:'Supervisor efficiency report (weighted)',
  note:'Weighted average across all stations supervised. Each station is weighted by machine hours available for that day.',
  body:'<div class="warnbox"><b>Report logic:</b> Supervisor efficiency is weighted by the actual machine hours available under that supervisor for the selected day. A station with more available machine hours affects the supervisor score more, but no station-day value exceeds one 8-hour shift in this mockup.</div>'
    +'<div class="note" style="margin-bottom:8px"><b>Formula:</b> <span class="mono">Supervisor Eff % = sum(earned standard hours) / sum(machine hours available) x 100</span>. This is the same as <span class="mono">sum(station efficiency x machine hours available) / sum(machine hours available)</span>.</div>'
    +'<div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;margin:10px 0;padding:10px;background:#fafbf8;border:1px solid var(--line);border-radius:8px"><div><label class="note" style="display:block;font-weight:700">View day</label><input type="date" class="btn" value="2026-07-15" onchange="document.getElementById(&quot;supervisor-day-label&quot;).textContent=this.value"></div><div class="note">Selected day: <span class="mono" id="supervisor-day-label">2026-07-15</span></div></div>'
    +'<table><thead><tr><th>Supervisor / station set</th><th>Machine hrs available (weight)</th><th>Earned std hrs</th><th>Selected day eff</th><th>Apr-Jun avg</th><th>Current month</th><th>Trend</th></tr></thead><tbody>'
    +'<tr><td>Supervisor S-07 - Beam Saw</td><td class="mono">8.0</td><td class="mono">7.5</td><td class="mono">94%</td><td class="mono">90%</td><td class="mono" style="font-weight:700;color:var(--ok)">92%</td><td><span class="trend up">Up +2%</span></td></tr>'
    +'<tr><td>Supervisor S-07 - Edge Band</td><td class="mono">8.0</td><td class="mono">7.0</td><td class="mono">88%</td><td class="mono">85%</td><td class="mono" style="font-weight:700;color:var(--ok)">87%</td><td><span class="trend up">Up +2%</span></td></tr>'
    +'<tr><td>Supervisor S-07 - Panel Saw</td><td class="mono">4.0</td><td class="mono">3.2</td><td class="mono">80%</td><td class="mono">84%</td><td class="mono" style="font-weight:700;color:#9a6b00">82%</td><td><span class="trend down">Down -2%</span></td></tr>'
    +'<tr style="border-top:2px solid var(--line)"><td><b>Weighted supervisor total</b></td><td class="mono"><b>20.0</b></td><td class="mono"><b>17.7</b></td><td class="mono"><b>88.5%</b></td><td class="mono"><b>85.8%</b></td><td class="mono" style="font-weight:700;color:var(--ok)"><b>87.0%</b></td><td><span class="trend up">Up +1.2%</span></td></tr>'
    +'</tbody></table><div class="note" style="margin-top:8px"><b>Columns:</b> Supervisor / station set = stations under the supervisor; Machine hrs available (weight) = available machine capacity for the selected day, max 8 per station in this mockup; Earned std hrs = completed work converted using cycle-time standards; Selected day eff = earned std hrs / machine hrs available; Apr-Jun avg = stable 3-month baseline; Current month = July month-to-date efficiency; Trend = current month vs Apr-Jun avg.</div>'
};
function wireReportRow(label,key){
  const title=[...document.querySelectorAll('#s-rep .repcard b')].find(b=>b.textContent.trim()===label);
  if(!title)return;
  const row=title.closest('.repcard');
  const btn=row.querySelector('button');
  row.classList.add('clickable');
  row.onclick=()=>openReport(key);
  if(btn){btn.textContent='View';btn.onclick=e=>{e.stopPropagation();openReport(key);};}
}
wireReportRow('Worker efficiency report','workerEff');
wireReportRow('Supervisor efficiency report (weighted)','supervisorEff');

