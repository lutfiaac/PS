import test from 'node:test';
import assert from 'node:assert/strict';
import {getClassPupilStatus,getClassReadiness,selectClassPupils,getDashboard,students} from '../src/data.js';
const roster=[{id:1,name:'Alya',className:'6A'},{id:2,name:'Bima',className:'6A'},{id:3,name:'Citra',className:'6A'},{id:4,name:'Dimas',className:'6A'},{id:5,name:'Elena',className:'6B'}];
const rows=[{studentId:1,competenceId:'algebra',assessmentId:'a',score:38},{studentId:1,competenceId:'numbers',assessmentId:'b',score:38},{studentId:2,competenceId:'algebra',assessmentId:'a',score:67},{studentId:3,competenceId:'algebra',assessmentId:'a',score:86},{studentId:4,competenceId:'algebra',assessmentId:'a',score:NaN},{studentId:5,competenceId:'algebra',assessmentId:'a',score:100}];
test('individual statuses use distinct 64/85 boundaries including fractional marks and valid zero',()=>{
 for(const score of [0,38,63,63.999])assert.equal(getClassPupilStatus(score).label,'Pendampingan');
 for(const score of [64,67,84,84.999])assert.equal(getClassPupilStatus(score).label,'Penguatan');
 for(const score of [85,86,100])assert.equal(getClassPupilStatus(score).label,'Pengayaan');
 for(const score of [null,undefined,NaN,-1,101])assert.equal(getClassPupilStatus(score).label,'Belum Terukur');
});
test('class mean/distribution exclude unmeasured and other-class pupils; assessment count is distinct',()=>{
 const d=getClassReadiness(rows,roster,'6A');
 assert.equal(d.aggregate.measured,3);assert.equal(d.aggregate.score,(38+67+86)/3);
 assert.equal(d.pupils.length,4);assert.equal(d.pupils[0].assessmentCount,2);
 assert.equal(d.pupils[3].score,null);assert.equal(d.pupils[3].assessmentCount,0);assert.equal(d.pupils[3].status.label,'Belum Terukur');
 assert.deepEqual(d.distribution.map(s=>s.count),[1,1,1]);assert.deepEqual(d.distribution.map(s=>s.percentage),[33,33,33]);
 assert.ok(d.distribution.every(s=>Math.abs(s.proportion-100/3)<0.00001));
});
test('status filtering/sorting keep unmeasured last and do not mutate aggregate or source roster',()=>{
 const d=getClassReadiness(rows,[...roster].reverse(),'6A'),order=d.pupils.map(p=>p.id);
 assert.deepEqual(selectClassPupils(d.pupils,{sort:'lowest'}).map(p=>p.name),['Alya','Bima','Citra','Dimas']);
 assert.deepEqual(selectClassPupils(d.pupils,{sort:'highest'}).map(p=>p.name),['Citra','Bima','Alya','Dimas']);
 assert.deepEqual(selectClassPupils(d.pupils,{status:'Penguatan'}).map(p=>p.name),['Bima']);
 assert.deepEqual(selectClassPupils(d.pupils,{status:'Belum Terukur'}).map(p=>p.name),['Dimas']);
 assert.deepEqual(d.pupils.map(p=>p.id),order);assert.equal(d.aggregate.measured,3);
});
test('class drill-down uses the same filtered readiness as its dashboard class row',()=>{
 for(const stage of ['pre','post'])for(const packageId of ['all','math-a','nutrition-a']){
  const dashboard=getDashboard({stage,period:'2026',packageId,roster:students});
  for(const row of dashboard.classRows){const detail=getClassReadiness(dashboard.selected,students,row.name);assert.equal(detail.aggregate.score,row.score);assert.equal(detail.aggregate.measured,row.measured);assert.equal(detail.distribution.reduce((sum,s)=>sum+s.count,0),row.measured)}
 }
});
test('fully unmeasured class has no mean and empty distribution, while valid zero stays measured',()=>{
 const empty=getClassReadiness([],roster,'6A');assert.equal(empty.aggregate.score,null);assert.equal(empty.aggregate.measured,0);assert.ok(empty.pupils.every(p=>p.status.label==='Belum Terukur'));assert.ok(empty.distribution.every(s=>s.count===0));
 const zero=getClassReadiness([{studentId:1,competenceId:'algebra',assessmentId:'z',score:0}],roster,'6A');assert.equal(zero.aggregate.measured,1);assert.equal(zero.aggregate.score,0);assert.equal(zero.distribution[0].count,1);
});
test('class overview, subjects, and subtopics share class scope and count unique valid assessments',()=>{
 const d=getClassReadiness(rows,roster,'6A',['Matematika','Bahasa Indonesia']);
 assert.equal(d.totalStudentCount,4);assert.equal(d.assessmentCount,2);
 assert.deepEqual(d.subjects.map(s=>s.name),['Matematika','Bahasa Indonesia']);
 assert.equal(d.subjects[0].measured,3);assert.equal(d.subjects[0].score,(38+67+86)/3);
 assert.equal(d.subjects[1].measured,0);assert.equal(d.subjects[1].score,null);
 const algebra=d.priorities.find(c=>c.id==='algebra');assert.equal(algebra.measured,3);assert.equal(algebra.score,(38+67+86)/3);
 assert.equal(d.priorities.find(c=>c.id==='numbers').measured,1);
 assert.equal(d.priorities.find(c=>c.id==='numbers').sufficient,false);
 assert.ok(d.priorities.every(c=>c.subject!=='Literasi Gizi'));
});
test('filtered class subjects and priorities match parent subject scope, including empty classes',()=>{
 const dashboard=getDashboard({stage:'pre',period:'2026',category:'Tryout',subject:'Bahasa Indonesia',packageId:'language-a',roster:students});
 const scope=dashboard.subjects.map(s=>s.name);
 for(const className of ['6A','6C']){
  const d=getClassReadiness(dashboard.selected,students,className,scope);
  assert.deepEqual(d.subjects.map(s=>s.name),['Bahasa Indonesia']);
  assert.ok(d.priorities.every(c=>c.subject==='Bahasa Indonesia'));
  assert.equal(d.assessmentCount,new Set(dashboard.selected.filter(r=>students.some(p=>p.id===r.studentId&&p.className===className)).map(r=>r.assessmentId)).size);
 }
});
