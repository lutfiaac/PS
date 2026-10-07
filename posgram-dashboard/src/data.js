export const competencies = [
 {id:'algebra',name:'Persamaan dan Pertidaksamaan Linier',subject:'Matematika',topic:'Aljabar'},
 {id:'numbers',name:'Operasi Bilangan dan Pecahan',subject:'Matematika',topic:'Bilangan'},
 {id:'inference',name:'Menjelaskan makna ungkapan dalam teks',subject:'Bahasa Indonesia',topic:'Pemahaman inferensial'},
 {id:'reading',name:'Menemukan informasi dalam teks',subject:'Bahasa Indonesia',topic:'Pemahaman tekstual'},
 {id:'nutrition',name:'Memahami gizi seimbang',subject:'Literasi Gizi',topic:'Gizi seimbang'}
];
export const classes=['6A','6B','6C'];
export const assessmentPackages=[
 {id:'math-a',packet:'a',category:'Tryout',subject:'Matematika',name:'Paket TKA Matematika A'},
 {id:'language-a',packet:'a',category:'Tryout',subject:'Bahasa Indonesia',name:'Paket TKA Bahasa Indonesia A'},
 {id:'nutrition-a',packet:'a',category:'Latihan',subject:'Literasi Gizi',name:'Paket Literasi Gizi A'},
 {id:'math-b',packet:'b',category:'Latihan',subject:'Matematika',name:'Paket TKA Matematika B'},
 {id:'language-b',packet:'b',category:'Latihan',subject:'Bahasa Indonesia',name:'Paket TKA Bahasa Indonesia B'},
];
export function getFilterOptions({category='all',subject='all'}={}){
 const relevant=assessmentPackages.filter(p=>category==='all'||p.category===category);
 return {categories:[...new Set(assessmentPackages.map(p=>p.category))].sort(),subjects:[...new Set(relevant.map(p=>p.subject))],packages:relevant.filter(p=>subject==='all'||p.subject===subject)};
}
export function normalizeFilterChildren(filters){
 const subject=getFilterOptions(filters).subjects.includes(filters.subject)?filters.subject:'all';
 const packageId=getFilterOptions({...filters,subject}).packages.some(p=>p.id===filters.packageId)?filters.packageId:'all';
 return {...filters,subject,packageId};
}
export function matchesAssessmentFilters(item,{period,packageId='all',category='all',subject='all',dateRange}={}){
 if(category!=='all'&&item.category!==category)return false;
 if(subject!=='all'&&item.subject!==subject)return false;
 if(packageId!=='all'&&item.packageKey!==packageId&&item.packageId!==packageId)return false;
 if(period==='custom')return Boolean(item.assessmentDate&&dateRange?.start&&dateRange?.end&&item.assessmentDate<=dateRange.end&&(item.endDate||item.assessmentDate)>=dateRange.start);
 return !period||item.academicYear===`${period}/${Number(period)+1}`;
}
export function formatPeriodRange({start,end}){
 const date=iso=>new Date(`${iso}T00:00:00Z`);
 const full=new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
 if(start===end)return full.format(date(start));
 const short=new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',timeZone:'UTC'});
 return `${start.slice(0,4)===end.slice(0,4)?short.format(date(start)):full.format(date(start))} – ${full.format(date(end))}`;
}
export const students=Array.from({length:25},(_,i)=>({id:i+1,name:['Aditya','Aisyah','Bagas','Citra','Dimas','Elena','Farhan','Gita','Hana','Irfan','Jihan','Kevin','Laras','Maya','Naufal','Nadia','Omar','Putri','Rafi','Salsa','Tania','Umar','Vina','Wahyu','Zahra'][i],className:i<15?classes[Math.floor(i/5)]:null}));
const measured={pre:[1,2,3,4,6,16,17,18,19,20,21],post:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]};
export const records=[];
for(const period of ['2026','2025']) for(const stage of ['pre','post']) for(const id of measured[stage].filter(id=>period==='2026'||id%3!==0)) for(const [index,c] of competencies.entries()){
 if(c.id==='nutrition'&&(stage==='pre'?![1,16].includes(id):id>15))continue;
 const score=Math.min(98,(stage==='pre'?14:47)+((id*13)%42)+index*3+(period==='2025'?-8:0));
 // Assessment marks are a separate demo source for the requested status bands.
 // They do not replace the competency-based readiness used by other cards.
 const preAssessmentScore=[1,3,17,19,21].includes(id)?50+(id%12):65+(id%20);
 const assessmentScore=Math.min(98,preAssessmentScore+(stage==='post'?12:0)+(period==='2025'?-4:0));
 records.push({studentId:id,competenceId:c.id,score,assessmentScore,stage,period,packageId:'a'});
 if(c.subject!=='Literasi Gizi'&&id%2===0)records.push({studentId:id,competenceId:c.id,score:Math.min(100,score+6),assessmentScore:Math.min(100,assessmentScore+2),stage,period,packageId:'b'});
}
for(const row of records){
 const subject=competencies.find(c=>c.id===row.competenceId).subject;
 const packet=assessmentPackages.find(p=>p.packet===row.packageId&&p.subject===subject);
 Object.assign(row,{category:packet.category,subject,packageKey:packet.id,packageName:packet.name,academicYear:`${row.period}/${Number(row.period)+1}`,assessmentDate:`${row.period}-${row.period==='2026'?'10':'09'}-${row.stage==='pre'?'05':'06'}`,assessmentId:`${row.period}-${packet.id}-${row.stage}-${row.stage==='pre'?(subject==='Literasi Gizi'?Number(row.studentId>=10):packet.packet==='b'?Math.floor(row.studentId/2)%2:row.studentId%3):0}`});
}
const mean=values=>values.length?values.reduce((a,b)=>a+b,0)/values.length:null;
export const percent=(n,total)=>total?Math.round(n/total*100):0;
export const minimumMeasuredStudents = 3;
export const dataState = count => count === 0 ? 'empty' : count < minimumMeasuredStudents ? 'limited' : 'available';
export const dataStateLabel = state => ({ empty: 'Belum ada data', limited: 'Data terbatas', available: 'Ada data' })[state];
export const measuredReadinessCategories = [
 {label:'Kesiapan Rendah',range:'Nilai < 65',tone:'amber',description:'Murid masih mengalami kendala pada penguasaan materi inti dan memerlukan pendampingan serta penguatan sebelum menghadapi TKA.'},
 {label:'Siap dengan Penguatan',range:'Nilai 65–84',tone:'amber',description:'Murid telah memahami konsep dasar, tetapi masih membutuhkan penguatan dan latihan terarah.'},
 {label:'Sangat Siap',range:'Nilai ≥ 85',tone:'green',description:'Murid telah menguasai kompetensi dasar dengan baik dan siap mengerjakan soal tingkat lanjut secara lebih mandiri.'},
];
export function getMeasuredReadinessCategory(readiness){
 if(!Number.isFinite(readiness)||readiness<0||readiness>100)return null;
 // Continuous intervals avoid a gap for fractional averages between 84 and 85.
 return measuredReadinessCategories[readiness<65?0:readiness<85?1:2];
}
export const readinessCategories = [
 {label:'Pendampingan',range:'Nilai < 65',tone:'red',min:0,max:65},
 {label:'Penguatan',range:'Nilai 65–84',tone:'amber',min:65,max:85},
 {label:'Pengayaan',range:'Nilai ≥ 85',tone:'green',min:85,max:101},
];
// Class drill-down pupil statuses use their own 64/85 thresholds.
// Aggregate interpretations and the existing dashboard distribution stay separate.
export const classPupilCategories=[
 {label:'Pendampingan',range:'Nilai < 64',tone:'amber',min:0,max:64},
 {label:'Penguatan',range:'Nilai 64–84',tone:'amber',min:64,max:85},
 {label:'Pengayaan',range:'Nilai ≥ 85',tone:'green',min:85,max:101},
];
export function getClassPupilStatus(score){
 if(!Number.isFinite(score)||score<0||score>100)return {label:'Belum Terukur',tone:'neutral'};
 return classPupilCategories.find(category=>score>=category.min&&score<category.max);
}
export function getClassReadiness(rows,roster,className,subjectNames){
 const members=roster.filter(p=>p.className===className);
 const valid=rows.filter(r=>members.some(p=>p.id===r.studentId)&&competencies.some(c=>c.id===r.competenceId)&&Number.isFinite(r.score)&&r.score>=0&&r.score<=100);
 const aggregate=summarize(valid,members);
 const pupils=members.map(p=>{
  const score=aggregate.pupils.find(measured=>measured.id===p.id)?.score??null;
  return {...p,score,status:getClassPupilStatus(score),assessmentCount:new Set(valid.filter(r=>r.studentId===p.id).map(r=>r.assessmentId).filter(Boolean)).size};
 });
 const distribution=classPupilCategories.map(category=>{
  const count=pupils.filter(p=>p.status.label===category.label).length;
  return {...category,count,percentage:percent(count,aggregate.measured),proportion:aggregate.measured?count/aggregate.measured*100:0};
 });
 const observedSubjects=[...new Set(rows.map(r=>competencies.find(c=>c.id===r.competenceId)?.subject).filter(Boolean))];
 const relevantSubjects=subjectNames??(observedSubjects.length?observedSubjects:competencies.map(c=>c.subject));
 const relevantCompetencies=competencies.filter(c=>relevantSubjects.includes(c.subject));
 const subjects=[...new Set(relevantCompetencies.map(c=>c.subject))].map(name=>({name,...summarize(valid,members,relevantCompetencies.filter(c=>c.subject===name).map(c=>c.id))}));
 const priorities=relevantCompetencies.map(c=>({...c,...summarize(valid,members,[c.id])})).sort((a,b)=>Number(b.sufficient)-Number(a.sufficient)||(a.score??101)-(b.score??101));
 return {aggregate,pupils,distribution,subjects,priorities,totalStudentCount:members.length,assessmentCount:new Set(valid.map(r=>r.assessmentId).filter(Boolean)).size};
}
export function selectClassPupils(pupils,{status='all',sort='name'}={}){
 return pupils.filter(p=>status==='all'||p.status.label===status).sort((a,b)=>{
  const missing=Number(a.score===null)-Number(b.score===null);
  if(missing)return missing;
  const scoreOrder=sort==='lowest'?(a.score??0)-(b.score??0):sort==='highest'?(b.score??0)-(a.score??0):0;
  return scoreOrder||a.name.localeCompare(b.name,'id');
 });
}
export function getAssessmentPupils(rows,roster){
 const measured=new Map();
 for(const row of rows){
  if(!roster.some(s=>s.id===row.studentId)||!Number.isFinite(row.assessmentScore)||row.assessmentScore<0||row.assessmentScore>100)continue;
  if(!measured.has(row.studentId))measured.set(row.studentId,new Map());
  // Each package contributes once, regardless of competency observation count.
  measured.get(row.studentId).set(row.packageKey||row.packageId,row.assessmentScore);
 }
 return [...measured].map(([id,packages])=>({id,score:mean([...packages.values()])}));
}
export function getReadinessDistribution(pupils){
 const valid=pupils.filter(p=>Number.isFinite(p.score)&&p.score>=0&&p.score<=100);
 return readinessCategories.map(category=>{
  const count=valid.filter(p=>p.score>=category.min&&p.score<category.max).length;
  return {...category,count,percentage:percent(count,valid.length),proportion:valid.length?count/valid.length*100:0};
 });
}
export function summarize(rows,roster,ids=competencies.map(c=>c.id)){
 const valid=rows.filter(r=>Number.isFinite(r.score)&&r.score>=0&&r.score<=100&&ids.includes(r.competenceId)&&roster.some(s=>s.id===r.studentId));
 const byStudent=new Map();
 for(const r of valid){if(!byStudent.has(r.studentId))byStudent.set(r.studentId,new Map());const skills=byStudent.get(r.studentId);if(!skills.has(r.competenceId))skills.set(r.competenceId,[]);skills.get(r.competenceId).push(r.score);}
 // Equal weighting: observations -> competence -> pupil -> school, never class averages.
 const pupils=[...byStudent].map(([id,skills])=>({id,score:mean([...skills.values()].map(mean))}));
 const measuredStudentCount = pupils.length;
 const readiness = mean(pupils.map(s=>s.score));
 // The roster is available accounts, not a validated target population.
 // Never use it as a coverage denominator or sufficiency threshold.
 return {pupils,measured:measuredStudentCount,measuredStudentCount,score:readiness,readiness,dataState:dataState(measuredStudentCount),sufficient:measuredStudentCount>=minimumMeasuredStudents};
}
export function getDashboard({stage,period,packageId='all',roster=students,category='all',subject='all',dateRange}){
 const filters={period,packageId,category,subject,dateRange};
 const selected=records.filter(r=>r.stage===stage&&matchesAssessmentFilters(r,filters));
 const relevantSubjects=getFilterOptions({category,subject}).packages.filter(p=>packageId==='all'||p.id===packageId||p.packet===packageId).map(p=>p.subject);
 const relevantCompetencies=competencies.filter(c=>relevantSubjects.includes(c.subject));
 const school=summarize(selected,roster);
 const subjects=[...new Set(relevantCompetencies.map(c=>c.subject))].map(name=>({name,...summarize(selected,roster,competencies.filter(c=>c.subject===name).map(c=>c.id))}));
 const classRows=classes.map(name=>{
  const members = roster.filter(s=>s.className===name);
  return {name,totalStudentCount:members.length,...summarize(selected,members)};
 });
 const priorities=relevantCompetencies.map(c=>({...c,...summarize(selected,roster,[c.id])})).sort((a,b)=>Number(b.sufficient)-Number(a.sufficient)||(a.score??101)-(b.score??101));
 const assessmentPupils=getAssessmentPupils(selected,roster);
 const distribution=getReadinessDistribution(assessmentPupils);
 const unmapped=roster.filter(s=>!s.className);
 const unassigned = {totalStudentCount:unmapped.length,...summarize(selected, unmapped)};
 const operations = getAssessmentStatus(filters);
 return {school,subjects,classRows,priorities,distribution,assessmentPupils,assessmentStudentCount:assessmentPupils.length,unmapped,unassigned,unmappedMeasured:unassigned.measured,assessmentCount:new Set(selected.map(r=>r.assessmentId)).size,operations,selected};
}
function getSeedAssessmentStatus({period,packageId}) {
 const current = period === '2026';
 if (!current) return packageId === 'b'
  ? {pre:{completed:3,analyzed:3,ongoing:0},post:{completed:1,analyzed:1,unscheduled:0}}
  : packageId === 'a' ? {pre:{completed:6,analyzed:6,ongoing:0},post:{completed:2,analyzed:2,unscheduled:0}}
  : {pre:{completed:9,analyzed:9,ongoing:0},post:{completed:3,analyzed:3,unscheduled:0}};
 if (packageId === 'b') return {pre:{completed:5,analyzed:4,ongoing:0},post:{completed:1,analyzed:1,unscheduled:4}};
 if (packageId === 'a') return {pre:{completed:8,analyzed:8,ongoing:1},post:{completed:3,analyzed:3,unscheduled:6}};
 return {pre:{completed:13,analyzed:12,ongoing:1},post:{completed:4,analyzed:4,unscheduled:10}};
}

// Dates intentionally follow the dashboard's 7 October 2026 simulation snapshot.
export const assessmentReferenceDate='2026-10-07';
export function getAssessmentSessions(filters={}){
 const {period,packageId='all'}=filters;
 const entries=[];
 for(const year of period&&period!=='custom'?[period]:['2026','2025'])for(const packet of ['a','b']){
  if(['a','b'].includes(packageId)&&packet!==packageId)continue;
  const period=year;
  const counts=getSeedAssessmentStatus({period,packageId:packet});
  const packageName=`Paket TKA ${packet.toUpperCase()}`;
  for(const stage of ['pre','post']){
   const type=stage==='pre'?'Pretest':'Post-test';
   for(let i=0;i<counts[stage].completed;i++){
    const date=`${period}-${stage==='pre'?'08':'09'}-${String(i+1).padStart(2,'0')}`;
    entries.push({id:`${period}-${packet}-${stage}-completed-${i}`,name:`${type} – ${packageName} · ${classes[i%classes.length]}`,type,packageId:packet,packageName,status:'completed',startDate:date,endDate:date});
   }
   if(stage==='post')for(let i=0;i<counts.post.unscheduled;i++)entries.push({id:`${period}-${packet}-post-unscheduled-${i}`,name:`Post-test – ${packageName} · Sesi ${i+1}`,type,packageId:packet,packageName,status:'unscheduled',startDate:null,endDate:null});
  }
  if(period==='2026'){
   if(packet==='a')entries.push({id:'2026-a-pre-active',name:'Pretest – Paket TKA A',type:'Pretest',packageId:packet,packageName,status:'ongoing',startDate:'2026-10-05',endDate:'2026-10-07'});
   const date=packet==='a'?'2026-10-12':'2026-10-15';
   entries.push({id:`2026-${packet}-post-upcoming`,name:`Post-test – ${packageName}`,type:'Post-test',packageId:packet,packageName,status:'scheduled',startDate:date,endDate:date});
  }
 }
 return entries.map(entry=>{
  const packets=assessmentPackages.filter(p=>p.packet===entry.packageId);
  const index=Number(entry.id.match(/-(\d+)$/)?.[1]||0);
  const packet=packets[index%packets.length];
  return {...entry,name:entry.name.replace(entry.packageName,packet.name),packageName:packet.name,category:packet.category,subject:packet.subject,packageKey:packet.id,assessmentDate:entry.startDate,academicYear:`${entry.id.slice(0,4)}/${Number(entry.id.slice(0,4))+1}`};
 }).filter(entry=>matchesAssessmentFilters(entry,filters));
}
export function getAssessmentStatus(filters){
 const entries=getAssessmentSessions(filters);
 const result={};
 for(const stage of ['pre','post']){
  const type=stage==='pre'?'Pretest':'Post-test';
  const selected=entries.filter(s=>s.type===type);
  result[stage]={completed:selected.filter(s=>s.status==='completed').length,ongoing:getActiveUpcomingSessions(selected).filter(s=>s.displayStatus==='ongoing').length,unscheduled:selected.filter(s=>s.status==='unscheduled').length,analyzed:new Set(records.filter(r=>r.stage===stage&&matchesAssessmentFilters(r,filters)).map(r=>r.assessmentId)).size};
 }
 return result;
}
export function getActiveUpcomingSessions(entries,asOf=assessmentReferenceDate){
 return entries.filter(s=>['ongoing','scheduled'].includes(s.status)&&s.startDate&&(s.endDate||s.startDate)>=asOf)
  .map(s=>({...s,displayStatus:s.startDate<=asOf?'ongoing':'upcoming'}))
  .sort((a,b)=>Number(b.displayStatus==='ongoing')-Number(a.displayStatus==='ongoing')||a.startDate.localeCompare(b.startDate)||a.id.localeCompare(b.id));
}
export function sessionStatus(session,asOf=assessmentReferenceDate){
 if(session.status==='completed')return {label:'Selesai',tone:'neutral'};
 if(session.status==='unscheduled'||!session.startDate)return {label:'Belum dijadwalkan',tone:'amber'};
 if(session.startDate<=asOf&&(session.endDate||session.startDate)>=asOf)return {label:'Berlangsung',tone:'green'};
 if(session.startDate>asOf)return {label:'Akan datang',tone:'purple'};
 return {label:'Perlu ditinjau',tone:'amber'};
}
export function formatSessionDate(session){
 if(!session.startDate)return 'Belum dijadwalkan';
 const start=session.startDate,end=session.endDate||start;
 const full=new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
 const date=iso=>new Date(`${iso}T00:00:00Z`);
 if(start===end)return full.format(date(start));
 if(start.slice(0,7)===end.slice(0,7)){
  const monthYear=new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric',timeZone:'UTC'}).format(date(end));
  return `${Number(start.slice(8))}–${Number(end.slice(8))} ${monthYear}`;
 }
 return `${full.format(date(start))} – ${full.format(date(end))}`;
}
