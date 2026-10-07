import test from 'node:test';
import assert from 'node:assert/strict';
import {getDashboard,getFilterOptions,normalizeFilterChildren,getAssessmentSessions,getAssessmentStatus,matchesAssessmentFilters,formatPeriodRange,students,records} from '../src/data.js';
const base={stage:'pre',period:'2026',packageId:'all',category:'all',subject:'all',roster:students};
test('hierarchy options derive from catalog and invalid descendants reset while valid choices survive',()=>{
 assert.deepEqual(getFilterOptions({category:'Tryout'}).subjects,['Matematika','Bahasa Indonesia']);
 assert.deepEqual(getFilterOptions({category:'Tryout',subject:'Matematika'}).packages.map(p=>p.id),['math-a']);
 assert.equal(normalizeFilterChildren({...base,category:'Tryout',subject:'Bahasa Indonesia',packageId:'math-a'}).packageId,'all');
 const reset=normalizeFilterChildren({...base,category:'Tryout',subject:'Literasi Gizi',packageId:'nutrition-a'});
 assert.equal(reset.subject,'all');assert.equal(reset.packageId,'all');
 assert.equal(normalizeFilterChildren({...base,category:'all',subject:'Matematika',packageId:'math-a'}).packageId,'math-a');
});
test('all dashboard aggregates and history use category, subject, package, and period jointly',()=>{
 const filters={...base,category:'Tryout',subject:'Bahasa Indonesia',packageId:'language-a'};
 const d=getDashboard(filters),expected=records.filter(r=>r.stage==='pre'&&matchesAssessmentFilters(r,filters));
 assert.ok(expected.length);assert.deepEqual(d.selected,expected);
 assert.deepEqual(d.subjects.map(s=>s.name),['Bahasa Indonesia']);
 assert.ok(d.priorities.every(p=>p.subject==='Bahasa Indonesia'));
 assert.equal(d.school.measured,new Set(expected.map(r=>r.studentId)).size);
 assert.equal(d.assessmentCount,new Set(expected.map(r=>r.assessmentId)).size);
 assert.equal(d.distribution.reduce((sum,r)=>sum+r.count,0),d.school.measured);
 for(const row of d.classRows){const ids=students.filter(s=>s.className===row.name).map(s=>s.id);assert.equal(row.measured,new Set(expected.filter(r=>ids.includes(r.studentId)).map(r=>r.studentId)).size)}
 const sessions=getAssessmentSessions(filters);assert.ok(sessions.length);assert.ok(sessions.every(s=>matchesAssessmentFilters(s,filters)));
 assert.deepEqual(d.operations,getAssessmentStatus(filters));
 assert.equal(d.operations.pre.completed,sessions.filter(s=>s.type==='Pretest'&&s.status==='completed').length);
});
test('package scope is stable whether selected before or after parent filters',()=>{
 const all=getAssessmentSessions(base).filter(s=>s.packageKey==='math-b');
 assert.deepEqual(getAssessmentSessions({...base,category:'Latihan',subject:'Matematika',packageId:'math-b'}),all);
});
test('custom periods include endpoints and overlapping sessions and omit undated sessions',()=>{
 const filters={...base,period:'custom',dateRange:{start:'2026-10-05',end:'2026-10-05'}};
 const d=getDashboard(filters);assert.equal(d.school.measured,11);
 assert.equal(getDashboard({...filters,stage:'post'}).school.measured,0);
 const endDay={...filters,dateRange:{start:'2026-10-07',end:'2026-10-07'}};
 assert.equal(getAssessmentSessions(endDay).length,1);
 assert.equal(getAssessmentSessions(endDay)[0].status,'ongoing');
 assert.ok(!getAssessmentSessions(filters).some(s=>s.status==='unscheduled'));
 assert.equal(formatPeriodRange({start:'2026-10-01',end:'2026-12-31'}),'1 Okt – 31 Des 2026');
});
test('empty combination gives empty analytics and operational results without artificial zeros',()=>{
 const filters={...base,period:'custom',dateRange:{start:'2027-02-01',end:'2027-02-28'}};
 const d=getDashboard(filters);assert.equal(d.school.score,null);assert.equal(d.school.measured,0);assert.equal(d.assessmentCount,0);
 assert.ok(d.classRows.every(c=>c.score===null&&c.measured===0));
 assert.ok(d.subjects.every(c=>c.score===null));assert.ok(d.priorities.every(c=>c.score===null));
 assert.deepEqual(getAssessmentSessions(filters),[]);
 assert.equal(d.operations.pre.completed+d.operations.pre.ongoing+d.operations.post.completed+d.operations.post.unscheduled,0);
});
