import test from 'node:test';
import assert from 'node:assert/strict';
import {getAssessmentSessions,getActiveUpcomingSessions,getAssessmentStatus,formatSessionDate} from '../src/data.js';

test('accordion excludes completed/unscheduled/overdue sessions and prioritizes active before nearest upcoming',()=>{
 const entries=[
  {id:'later',status:'scheduled',startDate:'2026-10-15'},
  {id:'completed',status:'completed',startDate:'2026-10-12'},
  {id:'unplanned',status:'unscheduled',startDate:null},
  {id:'active',status:'ongoing',startDate:'2026-10-05',endDate:'2026-10-07'},
  {id:'nearest',status:'scheduled',startDate:'2026-10-12'},
  {id:'overdue',status:'ongoing',startDate:'2026-10-01',endDate:'2026-10-04'},
  {id:'unknown',status:'cancelled',startDate:'2026-10-10'},
 ];
 const result=getActiveUpcomingSessions(entries,'2026-10-07');
 assert.deepEqual(result.map(s=>s.id),['active','nearest','later']);
 assert.deepEqual(result.map(s=>s.displayStatus),['ongoing','upcoming','upcoming']);
 assert.equal(entries[0].displayStatus,undefined);
});
test('single-day sessions are active on their date, date-range end is inclusive',()=>{
 const entries=[{id:'today',status:'scheduled',startDate:'2026-10-07'},{id:'range',status:'ongoing',startDate:'2026-10-05',endDate:'2026-10-07'}];
 assert.ok(getActiveUpcomingSessions(entries,'2026-10-07').every(s=>s.displayStatus==='ongoing'));
 assert.deepEqual(getActiveUpcomingSessions(entries,'2026-10-08'),[]);
});
test('demo filters yield three all-package sessions, two A sessions, one B session, and past-year empty state',()=>{
 assert.equal(getActiveUpcomingSessions(getAssessmentSessions({period:'2026',packageId:'all'})).length,3);
 assert.equal(getActiveUpcomingSessions(getAssessmentSessions({period:'2026',packageId:'a'})).length,2);
 const b=getActiveUpcomingSessions(getAssessmentSessions({period:'2026',packageId:'b'}));
 assert.equal(b.length,1);assert.equal(b[0].displayStatus,'upcoming');
 assert.deepEqual(getActiveUpcomingSessions(getAssessmentSessions({period:'2025',packageId:'all'})),[]);
});
test('history totals agree with retained summary cards across packages and periods',()=>{
 for(const period of ['2026','2025'])for(const packageId of ['all','a','b']){
  const entries=getAssessmentSessions({period,packageId}),counts=getAssessmentStatus({period,packageId});
  assert.equal(entries.filter(s=>s.type==='Pretest'&&s.status==='completed').length,counts.pre.completed);
  assert.equal(entries.filter(s=>s.type==='Post-test'&&s.status==='completed').length,counts.post.completed);
  assert.equal(entries.filter(s=>s.status==='unscheduled').length,counts.post.unscheduled);
  assert.equal(getActiveUpcomingSessions(entries).filter(s=>s.type==='Pretest'&&s.displayStatus==='ongoing').length,counts.pre.ongoing);
 }
});
test('session dates use Indonesian display text and distinguish missing schedules',()=>{
 assert.equal(formatSessionDate({startDate:'2026-10-05',endDate:'2026-10-07'}),'5–7 Oktober 2026');
 assert.equal(formatSessionDate({startDate:'2026-10-12'}),'12 Oktober 2026');
 assert.equal(formatSessionDate({startDate:null}),'Belum dijadwalkan');
 assert.equal(formatSessionDate({startDate:'2026-09-30',endDate:'2026-10-02'}),'30 September 2026 – 2 Oktober 2026');
});
