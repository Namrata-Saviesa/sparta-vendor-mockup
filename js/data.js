// Data/constants extracted from the original single-file mockup.

// ---- navigation ----
const titles={dash:['PPC Dashboard','Live plan · calculated by Sparta engine, not manual entry'],
rm:['RM Dashboard','Raw material status by order, vendor & channel — feeds shortage &amp; PO logic'],
po:['PO Dashboard','Pending purchase orders · vendor OTIF ranking · value trend'],
rej:['Rejection Dashboard','Station-wise rejections · reason codes · per-order rejection trail'],
plan:['Auto Planning','Engine-calculated routes, ECDs, risk & priority — table + CPM side by side'],
proc:['Process Routes','Complete catalog · 140 processes · 10 colour-coded route families'],
oroute:['Order Route & Days — WO 0428B','Processes triggered → machines assigned → day-wise plan on the working calendar'],
order:['Order Detail — WO 0374','Product & panel status · actual scans · delay reason chain'],
load:['Station Load','Andon view · Logic G/H · capacity from masters, WIP from live scans'],
prio:['Priority Control','Four-tier Job Flow Priority · CP override · manager approvals'],
pack:['Packing Station — Operator','Big-button scan UI · reconciliation drives dispatch date (Logic K)'],
rep:['Reports','All exportable: Excel · PDF · API · SAP'],
scan:['Station Scan — Operator','Start/stop scans, partial qty, rework, hold — feeds every PPC calculation'],
mast:['Masters & Config','Route, cycle time, capacity, calendars, approvals'],
cron:['Report Scheduler','Automatic delivery — which report, to which POC, on which schedule']};
titles.dash[0]='PPC Head Dashboard';
const loadThresholds={info:60,watch:80,risk:90,late:100};
const moBase={'Edge Band':112,'Panel Saw':98,'CNC':93,'Hot Press':82,'Beam Saw':72,'Assembly':70,'PRF Assembly':60,'Packing':46};
const moCap={'Edge Band':520,'Panel Saw':295,'CNC':283,'Hot Press':218,'Beam Saw':228,'Assembly':268,'PRF Assembly':181,'Packing':180};
const ld=[
['Edge Band',210,64,340,520,118,'+1 operator 2nd shift; route prelam lines to EB-2 after repair'],
['Panel Saw',96,31,180,295,104,'Overtime tonight (approved 13 Jul, expires 20 Jul)'],
['CNC',88,22,150,283,92,'Hold non-urgent nesting; monitor'],
['Hot Press',54,18,120,218,88,'Batch pressing for Saakshi kitchens'],
['Beam Saw',40,12,110,228,71,'—'],
['PRF Cutting',35,10,90,205,61,'—'],
['Assembly',52,20,105,268,66,'—'],
['PRF Assembly',28,9,70,181,59,'—'],
['Cleaning',22,8,60,188,48,'—'],
['Packing',18,6,55,180,44,'—']];
const planActions={
  '0374':'Expedite glass (Rupal); pre-stage Assembly slot 18 Jul',
  '0134B':'3 packing-missing panels at Edge Band — run tonight OT',
  '0469B':'Contingency (2d) breached · confirm Alfa profile arrival 16 Jul',
  '0428B':'1 panel balance at Beam Saw — schedule tomorrow AM',
  '0525':'No action'
};
const planCPM={
 '0374':{title:'Priyanshu Gurav — Family Room Sliding Door · 14 pcs',
   rows:[
     {name:'Glass path',crit:true,segs:[[3,'var(--late)','Material wait (3d) · 15–18 Jul'],[.5,'#0b7285','QC (0.5d) · 18 Jul'],[1,'#2b8a3e','Assembly (1d) · 20 Jul'],[.75,'#868e96','Clean (0.75d) · 21 Jul'],[.75,'#1b1e23','Pack (0.75d) · 22 Jul']],d:'6.0 d',end:'22 Jul',buf:0},
     {name:'Door path',w:'50%',segs:[[2,'#a05a2c','Joinery (2d) · 15–16 Jul'],[.5,'#2b8a3e','Assembly (0.5d) · 17 Jul'],[.25,'#868e96','Clean (0.25d) · 17 Jul'],[.25,'#1b1e23','Pack (0.25d) · 17 Jul']],d:'3.0 d',end:'17 Jul',buf:3},
     {name:'Mesh Patti path',w:'21%',segs:[[.5,'#2b8a3e','Sanding (0.5d) · 15 Jul'],[.75,'#2b8a3e','Joinery (0.75d) · 16 Jul']],d:'1.25 d',end:'16 Jul',buf:5}
   ],
   rds:'<b>Rate Determining Step (RDS):</b> the longest path — <b>glass material wait (3.0d of the 6.0-day critical path, 15→22 Jul)</b>. Crashing any other path gains nothing; expediting Rupal is the only action that moves the order ECD.',
   buf:'<b>Buffer logic:</b> buffer(path) = critical-path duration − path duration, in working days, rounded to the nearest whole day. Door can slip 3 working days at zero cost; Glass has buffer 0 — any slip moves the order day-for-day.'},
 '0134B':{title:'Saakshi Construction — Kitchens Flat 703–901 · clubbed ×5',
   rows:[
     {name:'Edge Band finish (packing-short)',crit:true,segs:[[1,'var(--late)','Rework, 3 panels (1d) · 15 Jul'],[.5,'#2b8a3e','Assembly (0.5d) · 16 Jul'],[.5,'#868e96','Clean (0.5d) · 17 Jul'],[.5,'#1b1e23','Pack (0.5d) · 18 Jul']],d:'2.5 d',end:'18 Jul',buf:0},
     {name:'CNC secondary line',w:'40%',segs:[[1,'#1971c2','CNC (1d) · 15 Jul'],[.5,'#868e96','Clean (0.5d) · 16 Jul'],[.5,'#1b1e23','Pack (0.5d) · 16 Jul']],d:'2.0 d',end:'16 Jul',buf:2}
   ],
   rds:'<b>RDS:</b> Edge Band — 3 packing-missing panels held the order back; tonight\'s OT block (Trigger T13) is the only lever that keeps 18 Jul.',
   buf:'<b>Buffer logic:</b> critical path has buffer 0 — this order is 8 days behind Committed already (10 Jul); any further slip pushes the ECD out day-for-day. CNC secondary line has 2 working days of slack.'},
 '0469B':{title:'Premier Adhesive — Deep Kabra Kitchen · 39 pcs',
   rows:[
     {name:'ALP profile path',crit:true,segs:[[1,'var(--watch)','Alfa profile wait (1d) · confirm 16 Jul'],[1.5,'#495867','Drill/Mill (1.5d) · 17–18 Jul'],[1,'#2b8a3e','PRF Assembly (1d) · 19 Jul'],[.5,'#868e96','Clean (0.5d) · 20 Jul'],[.5,'#1b1e23','Pack (0.5d) · 20 Jul']],d:'4.5 d',end:'20 Jul',buf:0}
   ],
   rds:'<b>RDS:</b> Alfa profile arrival — the whole remaining route hangs off confirmation of the 16 Jul delivery; this is a single-line order so there is no alternate path to crash.',
   buf:'<b>Buffer logic:</b> buffer 0 on the only path. Contingency (2d) already breached (Logic D) — Committed is 21 Jul, Sparta ECD 20 Jul, so there is only +1d of margin left before this order also breaches Committed.'},
 '0428B':{title:'GTM Networks — Gaurav Seth Kitchen · 15 pcs',
   rows:[
     {name:'ALP Anodized',crit:true,segs:[[1.5,'#495867','Drill/Mill (1.5d) · 15–16 Jul'],[1.5,'#2b8a3e','PRF Assembly (1.5d) · 17–18 Jul'],[.25,'#868e96','Clean (0.25d) · 20 Jul'],[.25,'#1b1e23','Pack (0.25d) · 20 Jul']],d:'3.5 d',end:'20 Jul',buf:0},
     {name:'4SEB balance',w:'43%',segs:[[.5,'#1971c2','Beam Saw (0.5d) · 15 Jul'],[.5,'#0ca678','Edge Band (0.5d) · 16 Jul'],[.25,'#868e96','Clean (0.25d) · 17 Jul'],[.25,'#1b1e23','Pack (0.25d) · 18 Jul']],d:'1.5 d',end:'18 Jul',buf:2},
     {name:'4SEB GJP Prelam',w:'29%',segs:[[.5,'#e8590c','Handle (0.5d) · 15 Jul'],[.25,'#868e96','Clean (0.25d) · 16 Jul'],[.25,'#1b1e23','Pack (0.25d) · 17 Jul']],d:'1.0 d',end:'17 Jul',buf:3}
   ],
   rds:'<b>RDS = PRF Assembly on the ALP path</b> (largest remaining activity on the critical path, 17–18 Jul). Adding a second PRF bench saves up to 1d; nothing else moves the order ECD.',
   buf:'<b>Buffer logic:</b> 4SEB balance can slip 2 working days and GJP 3 days before either would move the 20 Jul order ECD; Sun 19 excluded by the calendar.'},
 '0525':{title:'A. R. Hirlekar — Vidula Dressing &amp; COD · 130 pcs',
   rows:[
     {name:'Main assembly path',crit:true,segs:[[1,'#1971c2','Beam Saw/Hot Press (1d) · 15 Jul'],[1,'#0ca678','Edge Band/CNC (1d) · 16–17 Jul'],[1,'#2b8a3e','Assembly (1d) · 18–20 Jul'],[.5,'#868e96','Clean (0.5d) · 21 Jul'],[.5,'#1b1e23','Pack (0.5d) · 21 Jul']],d:'4.0 d',end:'21 Jul',buf:0}
   ],
   rds:'<b>RDS:</b> Assembly is the largest block on the only remaining path, but nothing here is urgent.',
   buf:'<b>Buffer logic:</b> buffer 0 inside the path-set (single line, nothing to compare against) but the order carries <b>+7d of slack to Committed</b> (28 Jul vs Sparta ECD 21 Jul) — comfortably on track, no expediting needed.'}
};
const gdays=[['Wed 15',true,false],['Thu 16',false,false],['Fri 17',false,false],['Sat 18',false,false],['Sun 19',false,true],['Mon 20',false,false],['Tue 21',false,false],['Wed 22',false,false]];
const stcol={'Beam Saw':'#1971c2','Edge Band':'#0ca678','CNC':'#7048e8','Handle':'#e8590c','Drill/Mill':'#495867','PRF Assy':'#2b8a3e','Cleaning':'#868e96','Packing':'#1b1e23','FG buffer':'#b08968'};
const glines=[
 {name:'4SEB GJP Prelam',qty:'15 pcs',segs:[[0,1,'Handle','H-1'],[1,1,'Cleaning','CL'],[2,1,'Packing','PK-1']]},
 {name:'ALP Anodized',qty:'15 pcs',segs:[[0,2,'Drill/Mill','DM-1'],[2,2,'PRF Assy','PRF-A2'],[5,1,'Cleaning','CL'],[5,1,'Packing','PK-1']]},
 {name:'4SEB balance',qty:'1 pc',segs:[[0,1,'Beam Saw','BS-2'],[1,1,'Edge Band','EB-1'],[2,1,'Cleaning','CL'],[3,1,'Packing','PK-1']]},
 {name:'Order dispatch',qty:'',segs:[[5,1,'Packing','close'],[6,1,'FG buffer','ready 21 Jul']]}];
const hmDays=['','Wed 15','Thu 16','Fri 17','Sat 18','Sun 19','Mon 20','Tue 21','Wed 22'];
const hmData=[['Edge Band',118,112,105,96,null,88,84,80],['Panel Saw',104,98,92,90,null,80,76,72],['CNC',92,95,101,97,null,85,78,74],['Hot Press',88,82,79,74,null,70,66,63],['Beam Saw',71,76,80,72,null,64,60,58],['Assembly',66,70,74,84,null,90,95,101]];
const povalData={
  all:[40.9,45.4,24.6],
  Alfa:[12.4,14.1,7.9], Rupal:[6.1,7.4,4.2], Metis:[4.8,5.6,3.1],
  VMS:[9.2,10.5,4.8], Icrotone:[3.0,3.8,2.0], Brother:[5.4,4.0,2.6]
};
const rejInstances=[
  {wo:'0299A',client:'Saviesa Retail',ref:'REF-1201',station:'CNC',date:'3 Apr',month:'April',qty:2,reason:'Dimension error — panel out of tolerance'},
  {wo:'0312B',client:'North East Trade',ref:'REF-1155',station:'Edge Band',date:'11 Apr',month:'April',qty:2,reason:'Scratch — surface marks post-lamination'},
  {wo:'0288C',client:'Saakshi Construction',ref:'REF-1130',station:'PU Finish',date:'18 Apr',month:'April',qty:1,reason:'Colour mismatch — batch shade variance vs approved sample'},
  {wo:'0340A',client:'A. R. Hirlekar',ref:'REF-1102',station:'PRF Assembly',date:'24 Apr',month:'April',qty:2,reason:'Chipping — corner chip, profile misalignment'},
  {wo:'0355B',client:'Premier Adhesive',ref:'REF-1190',station:'Packing',date:'27 Apr',month:'April',qty:1,reason:'Damage in transit — corner dent found at packing scan'},
  {wo:'0455',client:'Saviesa Projects',ref:'REF-1252',station:'Packing',date:'2 May',month:'May',qty:2,reason:'Damage in transit — corner dent found at packing scan'},
  {wo:'0430A',client:'Saviesa Retail',ref:'REF-1225',station:'Sanding',date:'8 May',month:'May',qty:3,reason:'Dimension error — under-size, batch re-sand required'},
  {wo:'0527A',client:'Saviesa Display',ref:'REF-1241',station:'PU Finish',date:'15 May',month:'May',qty:2,reason:'Colour mismatch — batch shade variance vs approved sample'},
  {wo:'0252A',client:'North East Trade',ref:'REF-1211',station:'Edge Band',date:'22 May',month:'May',qty:2,reason:'Scratch — surface marks post-lamination'},
  {wo:'0134B',client:'Saakshi Construction',ref:'REF-1187',station:'Sanding',date:'5 Jun',month:'June',qty:1,reason:'Dimension error — under-size after re-sand'},
  {wo:'0503',client:'A. R. Hirlekar',ref:'REF-1142',station:'CNC',date:'10 Jun',month:'June',qty:2,reason:'Dimension error — panel out of tolerance'},
  {wo:'0407',client:'Saviesa Retail',ref:'REF-1219',station:'Edge Band',date:'18 Jun',month:'June',qty:3,reason:'Scratch — surface marks post-lamination'},
  {wo:'0428B',client:'GTM Networks',ref:'REF-1176',station:'PRF Assembly',date:'25 Jun',month:'June',qty:3,reason:'Chipping — corner chip, profile misalignment'},
  {wo:'0374',client:'Priyanshu Gurav',ref:'REF-1098',station:'Packing',date:'27 Jun',month:'June',qty:2,reason:'Damage in transit — corner dent found at packing scan'},
  {wo:'0134B',client:'Saakshi Construction',ref:'REF-1187',station:'Edge Band',date:'14 Jul',month:'July',qty:3,reason:'Scratch — surface marks on 3 panels post-lamination'},
  {wo:'0320C',client:'North East Trade',ref:'REF-1160',station:'Edge Band',date:'13 Jul',month:'July',qty:1,reason:'Scratch — surface marks post-lamination'},
  {wo:'0518A',client:'A. R. Hirlekar',ref:'REF-1223',station:'Edge Band',date:'12 Jul',month:'July',qty:1,reason:'Scratch — surface marks post-lamination'},
  {wo:'0374',client:'Priyanshu Gurav',ref:'REF-1098',station:'PU Finish',date:'12 Jul',month:'July',qty:2,reason:'Colour mismatch — batch shade variance vs approved sample'},
  {wo:'0503',client:'A. R. Hirlekar',ref:'REF-1142',station:'PRF Assembly',date:'11 Jul',month:'July',qty:2,reason:'Chipping — edge chip during PRF assembly fixture'},
  {wo:'0428B',client:'GTM Networks',ref:'REF-1176',station:'CNC',date:'10 Jul',month:'July',qty:2,reason:'Dimension error — panel out of tolerance, re-cut ordered'},
  {wo:'0469B',client:'Premier Adhesive',ref:'REF-1204',station:'PRF Assembly',date:'14 Jul',month:'July',qty:2,reason:'Chipping — corner chip, profile misalignment'},
  {wo:'0407',client:'Saviesa Retail',ref:'REF-1219',station:'Packing',date:'15 Jul',month:'July',qty:1,reason:'Damage in transit — corner dent found at packing scan'}
];
const REJ_3MO=['April','May','June']; // rolling 3 most recently *completed* months — excludes current month (July)
// Channel + Project per WO — mirrors the RM/PO Dashboard master so the same WO shows the same channel/project everywhere.
const rejOrderMeta={
  '0299A':{channel:'B2C-Pune',project:'Pune Retail — TV Unit Panels'},
  '0312B':{channel:'B2B',project:'Showroom Vanity Display'},
  '0288C':{channel:'B2B',project:'Saakshi Construction — Office Furniture'},
  '0340A':{channel:'B2C-AID',project:'Hirlekar Residence — TV Unit'},
  '0355B':{channel:'B2B',project:'Premier Adhesive — Warehouse Racking'},
  '0455':{channel:'B2C-AID',project:'Internal Batch — Projects Division'},
  '0430A':{channel:'B2C-Pune',project:'Pune Retail — Kitchen Handles'},
  '0527A':{channel:'B2C-AI',project:'Showroom Acrylic Fixtures'},
  '0252A':{channel:'B2B',project:'Showroom Kitchen Display'},
  '0134B':{channel:'B2B',project:'Kitchens Flat 703–901'},
  '0503':{channel:'B2C-AID',project:'Hirlekar Residence — Interiors'},
  '0407':{channel:'B2C-Pune',project:'Pune Retail — Wardrobe Fittings'},
  '0428B':{channel:'B2B',project:'Gaurav Seth Kitchen'},
  '0374':{channel:'B2C-AI',project:'Family Room Sliding Door'},
  '0320C':{channel:'B2B',project:'Showroom Wardrobe Display'},
  '0518A':{channel:'B2C-AID',project:'Hirlekar Residence — Study Unit'},
  '0469B':{channel:'B2B',project:'Deep Kabra Kitchen'}
};
const orRouteOrders=[
  {wo:'0428B',client:'GTM Networks',project:'Gaurav Seth Kitchen',channel:'B2B',sub:'',designer:'Ar. Priya Menon'},
  {wo:'0374',client:'Priyanshu Gurav',project:'Family Room Sliding Door',channel:'B2C',sub:'AI',designer:'Ar. Rohan Bhide'},
  {wo:'0411AI',client:'Vrinda AI Lead',project:'Sliding Wardrobe',channel:'B2C',sub:'AI',designer:'Nivya'},
  {wo:'0412AI',client:'AI Architect Lead',project:'Display Kitchen',channel:'B2C',sub:'AI',designer:'Varun'},
  {wo:'0471W',client:'Andheri Walkin',project:'Retail Kitchen',channel:'B2C',sub:'AID',designer:'Usha'},
  {wo:'0472W',client:'Retail Store Walkin',project:'Bedroom Wardrobe',channel:'B2C',sub:'AID',designer:'Aishwarya'},
  {wo:'0473DL',client:'Digital Lead - Bandra',project:'Sliding Door Set',channel:'B2C',sub:'AID',designer:'Jennifer'},
  {wo:'0474DL',client:'Digital Lead - Thane',project:'Kitchen Refresh',channel:'B2C',sub:'AID',designer:'Siddhesh'},
  {wo:'0602P',client:'Koregaon Park Residence',project:'Wardrobe Display Unit',channel:'B2C',sub:'Pune',designer:'Aditi'},
  {wo:'0503',client:'A. R. Hirlekar',project:'Hirlekar Residence — Interiors',channel:'B2C',sub:'AID',designer:'Ar. Neha Kulkarni'},
  {wo:'0134B',client:'Saakshi Construction',project:'Kitchens Flat 703–901',channel:'B2B',sub:'',designer:'Ar. Deepak Shah'}
];
const dlBase={'Edge Band':112,'Panel Saw':98,'CNC':93,'Hot Press':82,'Beam Saw':72,'PRF Cutting':62,'Assembly':70,'Cleaning':50,'Packing':46};
const masterData={
  calendar:{title:'Working & Holiday Calendar', note:'Shift pattern and the holiday list every date-calculation in the app respects — Sparta ECDs, machine-day plans and CPM all skip these dates.',
    body:'<div class="grid g3" style="margin-bottom:12px">'
    +'<div class="mtile"><b>General Shift</b><div class="note">09:00–17:30</div></div>'
    +'<div class="mtile"><b>Shift 1</b><div class="note">07:00–15:00</div></div>'
    +'<div class="mtile"><b>Shift 2</b><div class="note">15:00–23:00</div></div>'
    +'</div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;padding:10px;background:#fafbf8;border:1px solid var(--line);border-radius:8px">'
    +'<label class="note" style="font-weight:700">Add a holiday:</label>'
    +'<input type="date" id="cal-hol-date" class="btn">'
    +'<input type="text" id="cal-hol-label" class="btn" placeholder="Label (optional) — e.g. Ganesh Chaturthi" style="width:220px">'
    +'<button class="btn primary" type="button" onclick="addHoliday()">+ Add holiday</button>'
    +'</div><table><thead><tr><th>Date</th><th>Day</th><th>Type</th></tr></thead><tbody id="cal-hol-body">'
    +'<tr><td class="dt">Every Sunday</td><td>Sun</td><td><span class="chip c-late">Weekly off</span></td></tr>'
    +'<tr><td class="dt">15 Aug 2026</td><td>Sat</td><td><span class="chip c-watch">Planned holiday</span></td></tr>'
    +'<tr><td class="dt">27 Aug 2026</td><td>Thu</td><td><span class="chip c-watch">Planned holiday (Ganesh Chaturthi)</span></td></tr>'
    +'</tbody></table><div class="note" style="margin-top:8px">No planned holidays remain in July 2026. Adding a holiday here immediately shifts every open order\u2019s machine-day plan and ECD around it — audit-logged.</div>'},
  vendor:{title:'Vendor Lead-Time Master', note:'Lead time per vendor, computed from PO-raised → PO-received. Feeds Auto Planning\u2019s material-wait assumptions and contingency-breach checks.',
    body:'<table><thead><tr><th>Vendor</th><th>Material category</th><th>Past 3-month avg lead time (d)</th><th>Current month lead time (d)</th><th>Last updated</th></tr></thead><tbody>'
    +'<tr><td>Alfa</td><td>ALP profiles, anodizing</td><td class="mono">12.4</td><td class="mono" style="color:var(--late);font-weight:700">13.1</td><td class="dt">15 Jul</td></tr>'
    +'<tr><td>Rupal</td><td>Glass, acrylic</td><td class="mono">8.2</td><td class="mono" style="color:var(--late);font-weight:700">9.4</td><td class="dt">15 Jul</td></tr>'
    +'<tr><td>Metis</td><td>Hardware, hooks &amp; clips</td><td class="mono">12.0</td><td class="mono" style="color:var(--ok)">11.2</td><td class="dt">15 Jul</td></tr>'
    +'<tr><td>VMS</td><td>PU spray (outsourced)</td><td class="mono">10.1</td><td class="mono" style="color:var(--late);font-weight:700">11.8</td><td class="dt">15 Jul</td></tr>'
    +'<tr><td>Icrotone</td><td>Veneer</td><td class="mono">6.5</td><td class="mono" style="color:var(--ok)">6.1</td><td class="dt">15 Jul</td></tr>'
    +'<tr><td>Brother</td><td>Painted/coated glass, SS hardware</td><td class="mono">7.8</td><td class="mono" style="color:var(--ok)">7.5</td><td class="dt">15 Jul</td></tr>'
    +'</tbody></table><div class="note" style="margin-top:8px">Current-month figures in red are running slower than the vendor\u2019s past 3-month average — Alfa, Rupal and VMS are exactly the vendors carrying overdue POs on the PO Dashboard right now. Vendor OTIF ranking (PO Dashboard) is the on-time % companion to this master\u2019s lead-time figures.</div>'},
  priority:{title:'Priority Rules', note:'Job-flow category ranking behind Auto Planning\u2019s queue order and Priority Control — replaces the old weighted 0–100 score.',
    body:'<table><thead><tr><th>Rank</th><th>Category</th><th>Description</th></tr></thead><tbody>'
    +'<tr><td class="mono" style="font-weight:700;font-size:14px">1</td><td><span class="chip c-crit">Misc</span></td><td class="note">Uncategorised / ad-hoc exceptions pending owner assignment — queued first until triaged</td></tr>'
    +'<tr><td class="mono" style="font-weight:700;font-size:14px">2</td><td><span class="chip c-late">Tatkal</span></td><td class="note">Flagged urgent / rush orders</td></tr>'
    +'<tr><td class="mono" style="font-weight:700;font-size:14px">3</td><td><span class="chip c-watch">High Priority</span></td><td class="note">Manually escalated or contractually high-priority orders</td></tr>'
    +'<tr><td class="mono" style="font-weight:700;font-size:14px">4</td><td><span class="chip c-ok">Normal</span></td><td class="note">Standard flow — every other order</td></tr>'
    +'</tbody></table><div class="warnbox" style="margin-top:10px"><b>Critical-path override:</b> within any one category above, an order currently sitting on its own CPM critical path (zero-buffer rate-determining path) is sequenced <b>ahead of every other order in that same category</b>. It does not jump to a higher category — a Normal order on the critical path still queues behind every Misc, Tatkal and High Priority order, just first among Normal.</div><div class="note" style="margin-top:8px">Priority Control shows each order\u2019s category and critical-path flag directly — there is no longer a 0–100 weighted score behind it.</div>'},
  reason:{title:'Reason Code Masters', note:'Controlled vocabularies used at scan-time and override-time across the app — keeps every dropdown (rejection comment, hold reason, override reason) consistent and reportable.',
    body:'<div class="grid g2">'
    +'<div><b style="font-size:12px">Hold reasons</b><div class="note" style="margin-top:4px">Material shortage · Machine breakdown · QC hold · Client instruction · Design change</div></div>'
    +'<div><b style="font-size:12px">Rejection reasons</b><div class="note" style="margin-top:4px">Scratch · Chipping · Delamination · Colour mismatch · Dimension error · Damage in transit · Other</div></div>'
    +'<div style="margin-top:12px"><b style="font-size:12px">Override reasons</b><div class="note" style="margin-top:4px">Overtime approved · Vendor expedite confirmed · Customer date renegotiated · Capacity added (extra shift) · Other (specify)</div></div>'
    +'<div style="margin-top:12px"><b style="font-size:12px">Damage / exception causes</b><div class="note" style="margin-top:4px">In-transit damage · Handling damage (floor) · Packing damage · Material defect (vendor) · Rework-induced</div></div>'
    +'</div><div class="note" style="margin-top:12px">Every code here is selectable, not free text, so reports (rejection reasons, override audit) stay analysable.</div>'},
  orgchart:{title:'Master Org Chart', note:'MRJ org chart from Jul 2026 mapped into dashboard-relevant access groups.',
    body:'<div class="scopewrap">'
    +'<div class="scard"><h4>Board / Full Admin</h4><div class="note">Rajesh, Monesh, Mary, Anand Laghate, Mangesh, Namrata</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> all pages, all B2B and B2C orders, Masters &amp; Config.</div></div>'
    +'<div class="scard"><h4>PPC / Planning</h4><div class="note">Amir</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> planning dashboards, route, load, priority and reports for all orders. Full admins can also see these screens through admin access.</div></div>'
    +'<div class="scard"><h4>B2C AI - Harsha</h4><div class="note">Harsha sees all AI B2C orders. Vrinda sees her AI subgroup only: Varun and Nivya.</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> AI B2C team orders for Harsha; subgroup orders for Vrinda; own AI B2C orders for designers.</div></div>'
    +'<div class="scard"><h4>B2C AID - Bharti</h4><div class="note">Bharti sees all AID B2C orders. Sakshi sees AID-walkin only: Usha, Aishwarya, Ashmi, Krish. DL Manager sees AID-DL only: Ravi, Jennifer, Shruti, Siddhesh.</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> AID team orders for Bharti; subgroup orders for Sakshi and DL manager; own AID B2C orders for designers.</div></div>'
    +'<div class="scard"><h4>B2C Pune - Amarkant / Rachana</h4><div class="note">Managers/team: Amarkant, Rachana. Designers: Mrinal, Aditi, Shruti Nale, Shital, Shubham, Generic Pune Designer 1, Generic Pune Designer 2.</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> Pune B2C team orders for heads/managers; own Pune B2C orders for designers.</div></div>'
    +'<div class="scard"><h4>Purchase</h4><div class="note">Santosh Yadav, Zubair, Sandeep, Pravin</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> RM Dashboard, PO Dashboard and purchase reports.</div></div>'
    +'<div class="scard"><h4>Production / Factory</h4><div class="note">Avan, Prashant, Amir, Pratish, Sachin, Suhas, Thapa plus generic workers/operators.</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> station load, scan, packing, route context and production reports.</div></div>'
    +'<div class="scard"><h4>Dispatch / Logistics</h4><div class="note">Ganesh, Rakesh</div><div class="note" style="margin-top:6px"><b>Dashboard scope:</b> packing station, order detail and dispatch reports.</div></div>'
    +'<div class="scard"><h4>In Org Chart, No Dashboard Access Yet</h4><div class="note">Digital marketing, social media, SEO, HR, finance, customer care and other non-operational roles remain visible in the org chart but are not active dashboard users for this phase.</div></div>'
    +'</div>'},
  users:{title:'Users & Roles', note:'Org-chart roles from full admin to operator, each with station- and screen-level permissions.',
    body:'<table><thead><tr><th>Role</th><th>Users</th><th>Key permissions</th></tr></thead><tbody>'
    +'<tr><td>Operator</td><td class="mono">64</td><td class="note">Station Scan only — own station, scan in/out, rework/damage/hold</td></tr>'
    +'<tr><td>Packing operator</td><td class="mono">8</td><td class="note">Packing Station only — scan reconciliation</td></tr>'
    +'<tr><td>Station supervisor</td><td class="mono">12</td><td class="note">Station Load, Exceptions for own station(s), OT request</td></tr>'
    +'<tr><td>Production Head</td><td class="mono">1</td><td class="note">All floor screens, OT approval, breakdown reassignment</td></tr>'
    +'<tr><td>Planner (PPC)</td><td class="mono">3</td><td class="note">Auto Planning, Priority Control, override request (≤ planner limit)</td></tr>'
    +'<tr><td>PPC Head</td><td class="mono">1</td><td class="note">All PPC screens, override approval, priority band approval</td></tr>'
    +'<tr><td>Purchase</td><td class="mono">4</td><td class="note">RM Dashboard, PO Dashboard, vendor mail</td></tr>'
    +'<tr><td>Dispatch / Sales</td><td class="mono">5</td><td class="note">Dispatch readiness, OTIF, store-wise reports</td></tr>'
    +'<tr><td>Plant Head / Mgmt</td><td class="mono">2</td><td class="note">Read-only across all screens, override audit</td></tr>'
    +'<tr><td>Admin</td><td class="mono">2</td><td class="note">All Masters &amp; Config, user management, API keys</td></tr>'
    +'</tbody></table>'}
};

