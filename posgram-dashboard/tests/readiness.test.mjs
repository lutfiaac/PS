import test from 'node:test';
import assert from 'node:assert/strict';
import {getDashboard,summarize,students,getReadinessDistribution,getAssessmentPupils,getMeasuredReadinessCategory} from '../src/data.js';
const params={stage:'pre',period:'2026',packageId:'all',roster:students};
test('measured readiness categories have distinct 65 and 85 boundaries without fractional gaps',()=>{
 for(const value of [0,44,64,64.999])assert.equal(getMeasuredReadinessCategory(value).label,'Kesiapan Rendah');
 for(const value of [65,84,84.999])assert.equal(getMeasuredReadinessCategory(value).label,'Siap dengan Penguatan');
 for(const value of [85,100])assert.equal(getMeasuredReadinessCategory(value).label,'Sangat Siap');
 for(const value of [null,undefined,NaN,-1,101])assert.equal(getMeasuredReadinessCategory(value),null);
});
test('school weights each measured pupil equally even with unequal assessment counts',()=>{
 const roster=[{id:1},{id:2},{id:3}];
 const rows=[...Array.from({length:10},()=>({studentId:1,competenceId:'algebra',score:100})),{studentId:2,competenceId:'algebra',score:0}];
 const result=summarize(rows,roster);
 assert.equal(result.score,50);assert.equal(result.measured,2);assert.equal(result.dataState,'limited');
});
test('competence means are computed before pupil means',()=>{
 const rows=[...Array.from({length:10},()=>({studentId:1,competenceId:'algebra',score:100})),{studentId:1,competenceId:'numbers',score:0}];
 assert.equal(summarize(rows,[{id:1}]).score,50);
});
test('invalid or missing data never becomes a zero-score pupil',()=>{
 const result=summarize([{studentId:1,competenceId:'algebra',score:80},{studentId:2,competenceId:'algebra',score:NaN},{studentId:3,competenceId:'algebra',score:-1}],[{id:1},{id:2},{id:3}]);
 assert.equal(result.score,80);assert.equal(result.measured,1);
 assert.equal(summarize([],students).score,null);
});
test('pretest and post-test use separate valid pupil populations',()=>{
 const pre=getDashboard(params),post=getDashboard({...params,stage:'post'});
 assert.equal(pre.school.measured,11);assert.equal(post.school.measured,21);
 assert.ok(post.school.score>pre.school.score);
 for(const data of [pre,post])assert.equal(data.distribution.reduce((n,d)=>n+d.count,0),data.school.measured);
});
test('unmapped pupils remain in school aggregates, mapping changes only classes',()=>{
 const before=getDashboard(params),roster=students.map(s=>({...s,className:s.id===16?'6A':s.className}));
 const after=getDashboard({...params,roster});
 assert.equal(before.unmapped.length,10);assert.equal(before.unmappedMeasured,6);
 assert.equal(before.school.score,after.school.score);assert.equal(before.school.measured,after.school.measured);
 assert.equal(after.classRows[0].measured,before.classRows[0].measured+1);
 assert.equal(after.unmapped.length,9);
 assert.equal(before.classRows[0].totalStudentCount,5);assert.equal(after.classRows[0].totalStudentCount,6);
 assert.equal(before.unassigned.totalStudentCount,10);assert.equal(after.unassigned.totalStudentCount,9);
});
test('assessment status bands use correct inclusive boundaries and pupil proportions',()=>{
 const pupils=[{score:0},{score:64.999},{score:65},{score:84.999},{score:85},{score:100},{score:NaN},{score:-1},{score:101}];
 const distribution=getReadinessDistribution(pupils);
 assert.deepEqual(distribution.map(d=>d.count),[2,2,2]);
 assert.deepEqual(distribution.map(d=>d.percentage),[33,33,33]);
 assert.ok(distribution.every(d=>Math.abs(d.proportion-100/3)<0.000001));
 assert.deepEqual(getReadinessDistribution([]).map(d=>d.count),[0,0,0]);
});
test('authorized assessment-score fixture yields 5/6/0 independently of readiness',()=>{
 const d=getDashboard(params);
 assert.deepEqual(d.distribution.map(s=>s.count),[5,6,0]);
 assert.deepEqual(d.distribution.map(s=>s.percentage),[45,55,0]);
 assert.equal(d.assessmentStudentCount,11);assert.equal(Math.round(d.school.score),44);
 assert.ok(d.assessmentPupils.some(s=>s.score>=65));
 const packages=[...Array.from({length:10},()=>({studentId:1,packageId:'a',assessmentScore:60})),{studentId:1,packageId:'b',assessmentScore:80}];
 assert.equal(getAssessmentPupils(packages,[{id:1}])[0].score,70);
});
test('package/period filters change data and limited data cannot become priority',()=>{
 const a=getDashboard(params),b=getDashboard({...params,packageId:'b'}),past=getDashboard({...params,period:'2025'});
 assert.ok(b.school.measured<a.school.measured);assert.ok(past.school.measured<a.school.measured);
 assert.equal(a.classRows[0].dataState,'available');assert.equal(a.classRows[1].dataState,'limited');assert.equal(a.classRows[2].score,null);assert.equal(a.classRows[2].dataState,'empty');
 const nutrition=a.priorities.find(p=>p.id==='nutrition');assert.equal(nutrition.measured,2);assert.equal(nutrition.sufficient,false);
 assert.equal(b.subjects.find(s=>s.name==='Literasi Gizi'),undefined);
});
test('unknown target population never influences data availability',()=>{
 const a=getDashboard(params),roster=[...students,...Array.from({length:500},(_,i)=>({id:1000+i,className:'6A'}))];
 const b=getDashboard({...params,roster});
 assert.equal(a.school.score,b.school.score);assert.equal(a.school.dataState,b.school.dataState);
 assert.equal(a.classRows[0].sufficient,b.classRows[0].sufficient);
 assert.equal('coverage' in b.school,false);assert.equal('total' in b.school,false);
 assert.equal(b.school.measuredStudentCount,11);assert.equal(b.school.readiness,b.school.score);
});
test('zero readiness is a valid measurement distinct from absent data',()=>{
 const result=summarize([{studentId:1,competenceId:'algebra',score:0}],[{id:1}]);
 assert.equal(result.score,0);assert.equal(result.measured,1);assert.equal(result.dataState,'limited');
 const empty=summarize([],students);assert.equal(empty.score,null);assert.equal(empty.dataState,'empty');
});
test('unassigned group has its own measured readiness and operational counts match filters',()=>{
 const d=getDashboard(params);assert.equal(d.unassigned.measured,6);
 const unassignedPupils=d.school.pupils.filter(p=>students.find(s=>s.id===p.id).className===null);
 assert.equal(d.unassigned.score,unassignedPupils.reduce((sum,p)=>sum+p.score,0)/unassignedPupils.length);
 assert.equal(d.assessmentCount,12);assert.equal(d.operations.pre.completed,13);
 const post=getDashboard({...params,stage:'post',packageId:'a'});assert.equal(post.assessmentCount,3);
 const b=getDashboard({...params,packageId:'b'});assert.equal(b.assessmentCount,4);assert.equal(b.operations.pre.ongoing,0);
});
