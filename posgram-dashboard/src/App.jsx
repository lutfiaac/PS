import React,{useMemo,useState,useEffect,useId,useRef} from 'react';
import {House,BookOpen,Users,CalendarBlank,Megaphone,Buildings,CaretDown,CaretRight,ChartBar,Info,Target,Check,Warning,ArrowRight,ArrowLeft,X,List,Notebook,Clock,Play,CheckCircle,FileText,MagnifyingGlass,Funnel} from '@phosphor-icons/react';
import {students,classes,getDashboard,dataStateLabel,getAssessmentSessions,getActiveUpcomingSessions,sessionStatus,formatSessionDate,measuredReadinessCategories,getMeasuredReadinessCategory,getFilterOptions,normalizeFilterChildren,assessmentPackages,formatPeriodRange,getClassReadiness,getClassPupilStatus,selectClassPupils,classPupilCategories} from './data';
const scoreText=n=>n==null?'—':`${Math.round(n)}%`;
function Badge({children,tone='purple'}){return <span className={`badge ${tone}`}>{children}</span>}
function DataBadge({item}){return <Badge tone={item.dataState==='available'?'purple':item.dataState==='limited'?'amber':'neutral'}>{dataStateLabel(item.dataState)}</Badge>}
function Progress({value,tone='purple'}){return <div className={`progress ${tone}`}><span style={{width:`${value||0}%`}}/></div>}
function SectionTitle({icon:Icon,children,action}){return <div className="section-heading"><div><span className="icon-tile"><Icon size={22}/></span><h2>{children}</h2></div>{action}</div>}
function Modal({title,close,children}){
 useEffect(()=>{const old=document.activeElement;const onKey=e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const items=[...document.querySelectorAll('.modal button,.modal select,.modal input')].filter(el=>!el.disabled);if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1)?.focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0]?.focus()}}};document.addEventListener('keydown',onKey);document.querySelector('.modal .close').focus();document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow='';old?.focus()}},[]);
 return <div className="modal-backdrop" onClick={close}><section role="dialog" aria-modal="true" aria-label={title} className="modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button className="icon-button close" aria-label="Tutup dialog" onClick={close}><X size={22}/></button></div>{children}</section></div>
}

function ReadinessCategoryGuide(){
 return <div className="readiness-category-guide">{measuredReadinessCategories.map(category=><div className="readiness-category-item" key={category.label}><div><strong>{category.label}</strong><span>{category.range}</span></div><p>{category.description}</p></div>)}</div>;
}
function pupilScoreText(score){
 if(score==null)return '—';
 // Avoid showing 64/85 for a fractional value still below that status boundary.
 if(getClassPupilStatus(score).label!==getClassPupilStatus(Math.round(score)).label)return `${new Intl.NumberFormat('id-ID',{maximumFractionDigits:2}).format(Math.floor(score*100)/100)}%`;
 return scoreText(score);
}
export function ClassReadinessDetail({className,rows,roster,scopeLabel}){
 const detail=useMemo(()=>getClassReadiness(rows,roster,className),[rows,roster,className]);
 const [statusFilter,setStatusFilter]=useState('all'),[pupilSort,setPupilSort]=useState('name'),[selectedPupil,setSelectedPupil]=useState(null),[showStatusInfo,setShowStatusInfo]=useState(false);
 const infoId=useId();
 const visible=selectClassPupils(detail.pupils,{status:statusFilter,sort:pupilSort});
 const aggregateCategory=getMeasuredReadinessCategory(detail.aggregate.score);
 if(selectedPupil){
  const pupil=detail.pupils.find(p=>p.id===selectedPupil);
  const observations=rows.filter(r=>r.studentId===pupil.id&&Number.isFinite(r.score)&&r.score>=0&&r.score<=100);
  const assessments=[...new Set(observations.map(r=>r.assessmentId))].map(id=>{const results=observations.filter(r=>r.assessmentId===id);return {id,name:results[0].packageName,date:results[0].assessmentDate}});
  return <div className="class-detail-body class-readiness-detail pupil-drilldown"><button className="history-back" onClick={()=>setSelectedPupil(null)}><ArrowLeft size={16}/>Kembali ke Kesiapan Kelas</button><h3>{pupil.name}</h3><p className="class-scope">{scopeLabel}</p><div className="detail-summary"><strong>{pupilScoreText(pupil.score)}</strong><Badge tone={pupil.status.tone}>{pupil.status.label}</Badge><span>{pupil.assessmentCount?`${pupil.assessmentCount} asesmen terukur`:'Belum memiliki nilai asesmen'}</span></div>{assessments.length?<div>{assessments.map(a=><div className="detail-row" key={a.id}><div><strong>{a.name}</strong><small>{formatSessionDate({startDate:a.date})}</small></div><Badge tone="neutral">Terukur</Badge></div>)}</div>:<div className="empty-state"><Users size={25}/><span>Nilai kesiapan akan tampil setelah murid memiliki hasil asesmen.</span></div>}</div>;
 }
 return <div className="class-detail-body class-readiness-detail">
  <p className="class-scope">{scopeLabel}</p>
  <div className="detail-summary"><strong>{scoreText(detail.aggregate.score)}</strong><span>Kesiapan · {detail.aggregate.measured} murid terukur</span>{aggregateCategory&&<Badge tone={aggregateCategory.tone}>{aggregateCategory.label}</Badge>}{detail.aggregate.dataState==='limited'&&<DataBadge item={detail.aggregate}/>}</div>
  <section className="class-detail-section class-status-section">
   <div className="card-title"><Users size={23}/><h2>Kondisi Kesiapan Murid</h2><div className="class-status-info" onMouseEnter={()=>setShowStatusInfo(true)} onMouseLeave={()=>setShowStatusInfo(false)}><button className="info-button" aria-label="Tentang status murid kelas" aria-describedby={showStatusInfo?infoId:undefined} onFocus={()=>setShowStatusInfo(true)} onBlur={()=>setShowStatusInfo(false)} onClick={()=>setShowStatusInfo(true)} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();setShowStatusInfo(false)}}}><Info size={16}/></button>{showStatusInfo&&<div className="class-status-tooltip" id={infoId} role="tooltip"><p>Status murid ditentukan berdasarkan nilai asesmen:</p>{classPupilCategories.map(c=><div key={c.label}><strong>{c.label}:</strong><span>{c.range.toLowerCase()}</span></div>)}</div>}</div></div>
   <p className="distribution-basis">Berdasarkan murid yang telah memiliki nilai asesmen.</p>
   {detail.aggregate.measured?<div className="distribution-rows">{detail.distribution.map((d,i)=>{const Icon=[Users,Target,CheckCircle][i];return <div className="distribution-row status-distribution-row" key={d.label}><span className={`icon-tile ${d.tone}`}><Icon size={21}/></span><div><div className="status-heading"><strong>{d.label}</strong><span className="status-range">{d.range}</span></div><div className="status-totals"><strong>{d.count}<small> murid</small></strong><span>{d.percentage}%</span></div><Progress value={d.proportion} tone={d.tone}/></div></div>})}</div>:<div className="empty-state class-status-empty"><Users size={25}/><strong>Belum ada data kesiapan murid.</strong><span>Status kesiapan akan tampil setelah murid memiliki nilai asesmen.</span></div>}
  </section>
  <section className="class-detail-section pupil-section"><SectionTitle icon={Users}>Kondisi per Murid</SectionTitle><div className="pupil-table-controls"><label className="select-wrap"><Funnel size={17}/><select aria-label="Filter status murid" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Semua Status</option>{[...classPupilCategories.map(c=>c.label),'Belum Terukur'].map(label=><option key={label}>{label}</option>)}</select><CaretDown size={14}/></label><label className="sort-control"><select aria-label="Urutkan murid" value={pupilSort} onChange={e=>setPupilSort(e.target.value)}><option value="name">Nama murid</option><option value="lowest">Kesiapan terendah</option><option value="highest">Kesiapan tertinggi</option></select></label></div>
   <div className="table-scroll"><table className="pupil-readiness-table"><thead><tr><th>Nama Murid</th><th>Asesmen Terukur</th><th>Kesiapan</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{visible.map((p,i)=><tr key={p.id} className={p.score===null&&i>0&&visible[i-1].score!==null?'unmeasured-start':''}><td>{p.name}</td><td>{p.score===null?'—':`${p.assessmentCount} asesmen`}</td><td><strong>{pupilScoreText(p.score)}</strong></td><td><Badge tone={p.status.tone}>{p.status.label}</Badge></td><td><button className="pupil-action" aria-label={`Lihat detail ${p.name}`} onClick={()=>setSelectedPupil(p.id)}><CaretRight size={18}/></button></td></tr>)}</tbody></table></div>{!visible.length&&<div className="empty-state pupil-filter-empty"><span>Belum ada murid dengan status yang dipilih.</span></div>}
  </section>
 </div>;
}
function DashboardFilters({category,subject,packageId,period,dateRange,onParentChange,onPackageChange,onPeriodChange}){
 const options=getFilterOptions({category,subject});
 const [rangeOpen,setRangeOpen]=useState(false),[draft,setDraft]=useState(dateRange),[attempted,setAttempted]=useState(false);
 const rangeRef=useRef(null);
 const popoverId=useId();
 useEffect(()=>{if(!rangeOpen)return;const close=e=>{if(!rangeRef.current?.contains(e.target))setRangeOpen(false)},escape=e=>{if(e.key==='Escape')setRangeOpen(false)};document.addEventListener('mousedown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('mousedown',close);document.removeEventListener('keydown',escape)}},[rangeOpen]);
 const openRange=()=>{setDraft(dateRange);setAttempted(false);setRangeOpen(true)};
 const valid=Boolean(draft.start&&draft.end&&draft.start<=draft.end);
 const field=(label,value,items,Icon,onChange,defaultLabel)=><label className={`select-wrap ${value!=='all'?'filter-active':''}`}><Icon size={19}/><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)} style={{width:`${Math.max(11,(items.find(i=>i.value===value)?.label||defaultLabel).length)}ch`}}><option value="all">{defaultLabel}</option>{items.map(i=><option key={i.value} value={i.value}>{i.label}</option>)}</select><CaretDown size={14}/></label>;
 return <div className="filters hierarchical-filters">
  {field('Kategori asesmen',category,options.categories.map(value=>({value,label:value})),Funnel,value=>onParentChange({category:value}),'Semua Kategori')}
  {field('Mata pelajaran',subject,options.subjects.map(value=>({value,label:value})),BookOpen,value=>onParentChange({subject:value}),'Semua Mapel')}
  {field('Paket soal',packageId,options.packages.map(p=>({value:p.id,label:p.name})),Notebook,onPackageChange,'Semua Paket')}
  <div className="period-filter" ref={rangeRef}><label className={`select-wrap ${period!=='2026'?'filter-active':''}`}>
   {period==='custom'?<button type="button" className="period-calendar" aria-label="Edit custom periode" aria-expanded={rangeOpen} aria-controls={popoverId} onClick={openRange}><CalendarBlank size={19}/></button>:<CalendarBlank size={19}/>}
   <select aria-label="Periode" value={period} style={{width:period==='custom'?`${formatPeriodRange(dateRange).length}ch`:'14ch'}} onChange={e=>{if(e.target.value==='custom')openRange();else{setRangeOpen(false);onPeriodChange(e.target.value,dateRange)}}}><option value="2026">TA 2026/2027</option><option value="2025">TA 2025/2026</option><option value="custom">{period==='custom'?formatPeriodRange(dateRange):'Custom periode…'}</option></select><CaretDown size={14}/>
  </label>
  {rangeOpen&&<div className="period-popover" role="dialog" aria-label="Custom periode" id={popoverId}><div className="period-popover-heading"><strong>Custom periode</strong><button className="icon-button" aria-label="Tutup periode" onClick={()=>setRangeOpen(false)}><X size={17}/></button></div><div className="date-range-fields"><label>Tanggal mulai<input type="date" aria-label="Tanggal mulai" value={draft.start} onChange={e=>setDraft({...draft,start:e.target.value})}/></label><span>—</span><label>Tanggal akhir<input type="date" aria-label="Tanggal akhir" min={draft.start} value={draft.end} onChange={e=>setDraft({...draft,end:e.target.value})}/></label></div>{(attempted||draft.start>draft.end)&&!valid&&<p className="range-error" role="alert">Pilih tanggal mulai dan akhir yang valid. Tanggal akhir tidak boleh sebelum tanggal mulai.</p>}<div className="period-actions"><button className="outline-button" onClick={()=>setRangeOpen(false)}>Batal</button><button className="primary-button" onClick={()=>{setAttempted(true);if(valid){onPeriodChange('custom',draft);setRangeOpen(false)}}}>Terapkan</button></div></div>}
  </div>
 </div>;
}
export function MeasuredReadiness({school,onExplain}){
 const [showTooltip,setShowTooltip]=useState(false);
 const tooltipId=useId();
 const hasData=school.measured>0&&Number.isFinite(school.score);
 const category=hasData?getMeasuredReadinessCategory(school.score):null;
 return <section className="card readiness">
  <div className="card-title"><Notebook size={23}/><h2>Kesiapan Murid Terukur</h2><div className="readiness-info" onMouseEnter={()=>setShowTooltip(true)} onMouseLeave={()=>setShowTooltip(false)}>
   <button className="info-button" aria-label="Kategori kesiapan terukur" aria-describedby={showTooltip?tooltipId:undefined} onFocus={()=>setShowTooltip(true)} onBlur={()=>setShowTooltip(false)} onKeyDown={e=>{if(e.key==='Escape')setShowTooltip(false)}} onClick={()=>{setShowTooltip(false);onExplain?.()}}><Info size={16}/></button>
   {showTooltip&&<div className="readiness-tooltip" id={tooltipId} role="tooltip"><strong className="readiness-tooltip-title">Kategori Kesiapan</strong><ReadinessCategoryGuide/></div>}
  </div></div>
  <div className="readiness-inner"><div className="gauge" style={{'--angle':`${hasData?school.score*2.7:0}deg`}}><div className="gauge-center"><Target size={23}/><strong>{hasData?scoreText(school.score):'—'}</strong></div></div>
   <div className={`readiness-context ${!hasData?'readiness-no-data':''}`}>
    {hasData?<>{category&&<Badge tone={category.tone}>{category.label}</Badge>}<span className="readiness-basis">Berdasarkan <strong>{school.measured} murid</strong><br/>yang telah memiliki nilai asesmen</span>{!school.sufficient&&<DataBadge item={school}/>}</>:<><strong>Belum ada data kesiapan</strong><span className="readiness-empty-helper">Nilai kesiapan akan tampil setelah murid memiliki hasil asesmen.</span></>}
   </div>
  </div>
 </section>;
}
export function ReadinessDistribution({measuredCount,distribution,onExplain}){
 const explanation='Status kesiapan ditentukan berdasarkan nilai asesmen murid: Pendampingan < 65, Penguatan 65–84, Pengayaan ≥ 85.';
 return <section className="card distribution">
  <div className="card-title"><Users size={23}/><h2>Kondisi Kesiapan Murid</h2><button className="info-button" aria-label="Kategori kesiapan murid" title={explanation} onClick={onExplain}><Info size={16}/></button></div>
  {measuredCount>0?<>
   <p className="distribution-basis">Berdasarkan <strong>{measuredCount} murid</strong> yang telah memiliki nilai asesmen.</p>
   <div className="distribution-rows">{distribution.map((d,i)=>{const Icon=[Users,Target,CheckCircle][i];return <div className="distribution-row status-distribution-row" key={d.label}>
    <span className={`icon-tile ${d.tone}`}><Icon size={21}/></span>
    <div className="distribution-status-content"><div className="status-heading"><strong>{d.label}</strong><span className="status-range">{d.range}</span></div><div className="status-totals"><strong>{d.count}<small> murid</small></strong><span>{d.percentage}%</span></div><Progress value={d.proportion} tone={d.tone}/></div>
   </div>})}</div>
  </>:<div className="empty-state distribution-empty"><Users size={29}/><strong>Belum ada data kesiapan murid.</strong><span>Status kesiapan akan tampil setelah murid memiliki nilai asesmen.</span></div>}
 </section>;
}


export function SessionAccordion({entries}){
 const [expanded,setExpanded]=useState(false);
 const panelId=useId();
 const activeSessions=getActiveUpcomingSessions(entries);
 return <div className="session-accordion">
  <button className="session-accordion-trigger" aria-expanded={expanded} aria-controls={panelId} onClick={()=>setExpanded(!expanded)}>
   <span className="session-accordion-title"><CalendarBlank size={18}/><span>Sesi Asesmen Aktif & Mendatang <span className="session-accordion-count">— {activeSessions.length} sesi</span></span></span><CaretDown size={17} className={expanded?'rotated':''}/>
  </button>
  <div id={panelId} hidden={!expanded} className="session-accordion-panel">
   {activeSessions.length?<div className="active-session-list" role="list">{activeSessions.map(entry=><div className="active-session-row" key={entry.id} role="listitem"><div className="session-name"><strong>{entry.name}</strong><span>{entry.type} · {entry.packageName}</span></div><div className="session-date"><CalendarBlank size={15}/><span>{formatSessionDate(entry)}</span></div><Badge tone={sessionStatus(entry).tone}>{sessionStatus(entry).label}</Badge></div>)}</div>:<p className="session-accordion-empty">Belum ada sesi asesmen aktif atau terjadwal.</p>}
  </div>
 </div>;
}
function ClassDashboardPage({className,rows,roster,scopeLabel,stage,onBack}){
 const headingRef=useRef(null);
 useEffect(()=>{headingRef.current?.focus({preventScroll:true})},[className]);
 return <main className="class-dashboard-page">
  <div className="breadcrumb">Akademik & Asesmen<CaretRight size={13}/><span>Kesiapan TKA</span><CaretRight size={13}/><span>{className||'Kelas'}</span></div>
  <button className="history-back" onClick={onBack}><ArrowLeft size={17}/>Kembali ke dashboard</button>
  <div className="page-heading"><div className="title-line"><h1 ref={headingRef} tabIndex={-1}>{className?`Kesiapan Kelas ${className}`:'Kelas tidak ditemukan'}</h1>{className&&<Badge tone="purple">{stage==='pre'?'Pretest':'Post-test'}</Badge>}</div></div>
  {className?<section className="card class-dashboard-card"><ClassReadinessDetail key={className} className={className} rows={rows} roster={roster} scopeLabel={scopeLabel}/></section>:<div className="filter-empty-state"><Info size={22}/><p>Pilih kelas yang tersedia dari dashboard.</p></div>}
 </main>;
}
function AssessmentHistory({entries,yearLabel,packageLabel,onBack}){
 return <main className="assessment-history">
  <div className="breadcrumb">Akademik & Asesmen<CaretRight size={13}/><span>Riwayat Asesmen</span></div>
  <button className="history-back" onClick={onBack}><ArrowLeft size={17}/>Kembali ke Kesiapan TKA</button>
  <div className="page-heading"><h1>Riwayat & Status Asesmen</h1><p>{yearLabel} · {packageLabel}</p></div>
  <section className="card"><SectionTitle icon={CalendarBlank} action={<span className="history-count">{entries.length} sesi</span>}>Seluruh Sesi Asesmen</SectionTitle>
   <div className="table-scroll history-table-scroll"><table><thead><tr><th>Nama Sesi</th><th>Jenis / Paket Asesmen</th><th>Tanggal Pelaksanaan</th><th>Status</th></tr></thead><tbody>{entries.map(entry=><tr key={entry.id}><td><strong>{entry.name}</strong></td><td>{entry.type}<span className="history-package">{entry.packageName}</span></td><td>{formatSessionDate(entry)}</td><td><Badge tone={sessionStatus(entry).tone}>{sessionStatus(entry).label}</Badge></td></tr>)}</tbody></table></div>
  </section>
 </main>;
}

export function App(){
 const [stage,setStage]=useState('pre'),[period,setPeriod]=useState('2026'),[packageId,setPackage]=useState('all'),[roster,setRoster]=useState(students),[dialog,setDialog]=useState(null),[sort,setSort]=useState('name'),[sidebar,setSidebar]=useState(false),[academicOpen,setAcademicOpen]=useState(true),[notice,setNotice]=useState(''),[mapping,setMapping]=useState({}),[query,setQuery]=useState(''),[prioritySubject,setPrioritySubject]=useState('Matematika');
 const [category,setCategory]=useState('all'),[subject,setSubject]=useState('all'),[dateRange,setDateRange]=useState({start:'2026-10-01',end:'2026-12-31'});
 function updateParents(change){const next=normalizeFilterChildren({category,subject,packageId,...change});setCategory(next.category);setSubject(next.subject);setPackage(next.packageId);setDialog(null)}
 const [pageHash,setPageHash]=useState(()=>window.location.hash);
 const showAssessmentHistory=pageHash==='#/asesmen';
 const showClassPage=pageHash.startsWith('#/kelas/');
 const selectedClassName=classes.find(name=>pageHash===`#/kelas/${encodeURIComponent(name)}`);
 useEffect(()=>{const onHashChange=()=>{setPageHash(window.location.hash);setDialog(null);setSidebar(false);window.scrollTo(0,0)};window.addEventListener('hashchange',onHashChange);return()=>window.removeEventListener('hashchange',onHashChange)},[]);
 const assessmentEntries=useMemo(()=>getAssessmentSessions({period,packageId,category,subject,dateRange}),[period,packageId,category,subject,dateRange]);
 const openAssessmentHistory=()=>{window.location.hash='/asesmen';window.scrollTo(0,0)};
 const returnToDashboard=()=>{setDialog(null);setSidebar(false);window.location.hash='';window.scrollTo(0,0)};
 const prepareClassNavigation=()=>{setDialog(null);setSidebar(false);window.scrollTo(0,0)};
 const data=useMemo(()=>getDashboard({stage,period,packageId,roster,category,subject,dateRange}),[stage,period,packageId,roster,category,subject,dateRange]);
 const {school,distribution,assessmentStudentCount,priorities,subjects,classRows,unmapped,unmappedMeasured,unassigned,assessmentCount,operations}=data,pre=stage==='pre',yearLabel=period==='custom'?formatPeriodRange(dateRange):`TA ${period}/${Number(period)+1}`,periodLabel=period==='custom'?formatSessionDate({startDate:dateRange.start,endDate:dateRange.end}):`1 Jul ${period} – 30 Jun ${Number(period)+1}`;
 const packageLabel=assessmentPackages.find(p=>p.id===packageId)?.name||'Semua Paket';
 const filterContext=[category==='all'?'Semua Kategori':category,subject==='all'?'Semua Mapel':subject,packageLabel].join(' · ');
 const activePrioritySubject=subjects.some(s=>s.name===prioritySubject)?prioritySubject:subjects[0]?.name;
 const sessions=[{title:'Pretest selesai',count:operations.pre.completed,icon:CalendarBlank,tone:'purple'},{title:'Pretest berlangsung',count:operations.pre.ongoing,icon:Play,tone:'purple'},{title:'Post-test selesai',count:operations.post.completed,icon:CheckCircle,tone:'green'},{title:'Post-test belum dijadwalkan',count:operations.post.unscheduled,icon:Clock,tone:'amber'}];
 const filteredPriorities=priorities.filter(p=>p.subject===activePrioritySubject);
 const visiblePriorities=filteredPriorities.slice(0,5);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(timer)},[notice]);
 const sortedClasses=[...classRows].sort((a,b)=>sort==='measured'?b.measured-a.measured:sort==='score'?Number(b.sufficient)-Number(a.sufficient)||(a.score??101)-(b.score??101):a.name.localeCompare(b.name));
 function saveMapping(){const entries=Object.entries(mapping).filter(([,v])=>v);if(!entries.length)return;setRoster(prev=>prev.map(s=>({...s,className:mapping[s.id]||s.className})));setNotice(`${entries.length} murid berhasil dipetakan. Data kelas telah diperbarui.`);setMapping({});setDialog(null)}
 return <>
 <header className="topbar"><button className="mobile-menu icon-button" aria-label="Buka navigasi" onClick={()=>setSidebar(!sidebar)}><List size={25}/></button><img src="/assets/posgram-logo.png" alt="POSGRAM"/><button className="avatar" aria-label="Profil Annisa" onClick={()=>setDialog({type:'profile'})}>AN</button></header>
 {sidebar&&<div className="sidebar-scrim" onClick={()=>setSidebar(false)}/>}
 <aside className={`sidebar ${sidebar?'is-open':''}`}><div className="school-switch"><span className="icon-tile"><Buildings size={24}/></span><div><span className="muted small">Pilih Ruang Kerja</span><strong>SMP Negeri 1 Malang</strong><span className="muted small">Agrowulas · NPSN: 4829</span></div></div><nav aria-label="Navigasi utama"><button className="nav-item" onClick={()=>setDialog({type:'nav',title:'Beranda'})}><House size={21}/>Beranda</button><button className="nav-item nav-group" aria-expanded={academicOpen} onClick={()=>setAcademicOpen(!academicOpen)}><BookOpen size={21}/>Akademik & Asesmen<CaretDown className={academicOpen?'rotated':''} size={15}/></button>{academicOpen&&<div className="nav-sub"><button className="active" aria-current="page" onClick={()=>{setSidebar(false);returnToDashboard()}}>Kesiapan TKA</button><button onClick={()=>setDialog({type:'materials'})}>Materi Pembelajaran</button></div>}{[[Users,'Kelas & Pengguna'],[CalendarBlank,'Kehadiran & Aktivitas'],[Megaphone,'Pengumuman'],[Notebook,'SPMB']].map(([Icon,title])=><button key={title} className="nav-item" onClick={()=>setDialog({type:title==='Kelas & Pengguna'?'mapping':'nav',title})}><Icon size={21}/>{title}<CaretDown size={15}/></button>)}</nav><div className="sidebar-bottom"><span className="small">Ruang kerja sekolah</span><span className="small muted">{yearLabel}</span></div></aside>
 {showClassPage?<ClassDashboardPage className={selectedClassName} rows={data.selected} roster={roster} scopeLabel={`Hasil ${pre?'pretest':'post-test'} · ${yearLabel} · ${filterContext}`} stage={stage} onBack={returnToDashboard}/>:showAssessmentHistory?<AssessmentHistory entries={assessmentEntries} yearLabel={yearLabel} packageLabel={filterContext} onBack={returnToDashboard}/>:<main><div className="breadcrumb">Akademik & Asesmen<CaretRight size={13}/><span>Kesiapan TKA</span></div><div className="page-heading"><div className="title-line"><h1>{pre?'Ringkasan Kesiapan Awal TKA':'Ringkasan Kesiapan TKA Setelah Pembelajaran'}</h1><Badge tone="purple">{pre?'Pretest':'Post-test'}</Badge></div><p>{pre?'Ringkasan hasil pretest untuk memetakan kondisi awal murid dan area yang perlu diperkuat.':'Ringkasan hasil post-test untuk melihat kondisi murid setelah tindak lanjut pembelajaran.'}</p></div>
 <div className="filterbar"><div className="stage-filter"><div className="segmented" role="group" aria-label="Tahap Asesmen"><button aria-pressed={pre} className={pre?'selected':''} onClick={()=>setStage('pre')}><ChartBar size={18}/>Pretest</button><button aria-pressed={!pre} className={!pre?'selected':''} onClick={()=>setStage('post')}><FileText size={18}/>Post-test</button></div></div><DashboardFilters category={category} subject={subject} packageId={packageId} period={period} dateRange={dateRange} onParentChange={updateParents} onPackageChange={value=>{setPackage(value);setDialog(null)}} onPeriodChange={(value,range)=>{setPeriod(value);setDateRange(range);setDialog(null)}}/></div>
 {!school.measured&&<div className="filter-empty-state" role="status"><Info size={22}/><div><strong>Belum ada data untuk filter yang dipilih.</strong><p>Ubah kategori, mata pelajaran, paket, atau periode untuk melihat data lainnya.</p></div></div>}
 <div className="overview-grid"><MeasuredReadiness school={school} onExplain={()=>setDialog({type:'readinessCategories'})}/>
 <ReadinessDistribution measuredCount={assessmentStudentCount} distribution={distribution} onExplain={()=>setDialog({type:'distribution'})}/></div>
 <section className="coverage-section"><div className="coverage-heading"><h2>Data yang Tersedia</h2></div><div className="coverage-grid">{[{icon:Users,name:'Murid Terukur',value:school.measured,suffix:'murid',meta:'Memiliki hasil asesmen valid'},{icon:FileText,name:'Asesmen Dianalisis',value:assessmentCount,suffix:'asesmen',meta:`Pada tahap ${pre?'pretest':'post-test'}`},{icon:Buildings,name:'Kelas dengan Data',value:classRows.filter(c=>c.measured).length,suffix:'kelas',meta:'Memiliki murid dengan hasil asesmen'}].map(m=><div className="card metric-card" key={m.name}><span className="icon-tile"><m.icon size={23}/></span><div><h3>{m.name}</h3><div className="metric-value"><strong>{m.value}</strong><span className="metric-suffix">{m.suffix}</span></div><p>{m.meta}</p></div></div>)}</div></section>

 <section className="card class-section">
  <SectionTitle icon={Buildings} action={<label className="sort-control"><Funnel size={15}/><select aria-label="Urutkan kelas" value={sort} onChange={e=>setSort(e.target.value)}><option value="name">Urutan kelas</option><option value="measured">Murid terukur terbanyak</option><option value="score">Kesiapan (data memadai)</option></select></label>}>Kondisi per Kelas</SectionTitle>
  <p className="section-description">Kesiapan berdasarkan murid terukur. Kelompok dengan sedikit data perlu dibaca dengan hati-hati.</p>
  <div className="table-scroll"><table className="class-readiness-table">
   <thead><tr><th>Kelas / Kelompok</th><th>Total Murid</th><th>Murid Terukur</th><th><span className="table-readiness-heading">Kesiapan<button className="info-button" aria-label="Tentang kesiapan kelas" title="Nilai kesiapan dihitung dari murid yang telah memiliki nilai asesmen pada kelas atau kelompok tersebut." onClick={()=>setDialog({type:'classMethod'})}><Info size={14}/></button></span></th></tr></thead>
   <tbody>{sortedClasses.map(c=><tr key={c.name}><td><a className="class-link" title={`Lihat kesiapan kelas ${c.name}`} href={`#/kelas/${encodeURIComponent(c.name)}`} onClick={prepareClassNavigation}>{c.name}</a></td><td>{c.totalStudentCount}</td><td>{c.measured}</td><td className={c.dataState==='limited'?'limited-score':''}><div className="class-readiness-cell"><div><strong>{scoreText(c.score)}</strong>{c.dataState==='limited'&&<span className="limited-data-note">Data terbatas</span>}</div><a className="class-chevron" href={`#/kelas/${encodeURIComponent(c.name)}`} aria-label={`Buka kesiapan kelas ${c.name}`} onClick={prepareClassNavigation}><CaretRight size={18}/></a></div></td></tr>)}
    <tr className="unassigned-row"><td><div className="unassigned-table-label"><Warning size={18}/><div><strong>Belum memiliki kelas</strong><span>Belum dipetakan ke kelas</span><button className="mapping-table-button" onClick={()=>{setQuery('');setDialog({type:'mapping'})}}>Petakan murid<ArrowRight size={14}/></button></div></div></td><td>{unassigned.totalStudentCount}</td><td>{unassigned.measured}</td><td className={unassigned.dataState==='limited'?'limited-score':''}><strong>{scoreText(unassigned.score)}</strong>{unassigned.dataState==='limited'&&<span className="limited-data-note">Data terbatas</span>}</td></tr>
   </tbody>
  </table></div>
 </section>
 <section className="card subjects-section"><SectionTitle icon={BookOpen}>Kondisi per Mata Pelajaran</SectionTitle><p className="section-description">Kesiapan dan jumlah murid yang menjadi basis data pada setiap mata pelajaran.</p><div className="subjects-grid">{subjects.map(s=><button key={s.name} className={`subject-card ${s.dataState!=='available'?'limited-subject':''}`} onClick={()=>setDialog({type:'subject',item:s})}><div className="subject-title"><span className="icon-tile small-tile"><FileText size={19}/></span><h3>{s.name}</h3><CaretRight size={15}/></div><div className="subject-score"><span>Kesiapan murid terukur</span><strong>{scoreText(s.score)}</strong></div><Progress value={s.score} tone={s.sufficient?'purple':'neutral'}/><div className="subject-measured"><span>{s.measured?<><b>{s.measured} murid</b> terukur</>:'Belum ada murid terukur'}</span>{!s.sufficient&&<DataBadge item={s}/>}</div></button>)}</div></section>
 <section className="card priorities"><SectionTitle icon={BookOpen} action={<button className="text-button" onClick={()=>setDialog({type:'priorities'})}>Lihat Semua<ArrowRight size={16}/></button>}>Sub Materi Prioritas</SectionTitle><p className="section-description">Area yang paling membutuhkan penguatan berdasarkan hasil asesmen murid terukur.</p><div className="priority-filter"><span>Mata Pelajaran</span><div className="subject-segmented" role="group" aria-label="Mata pelajaran submateri">{subjects.map(subject=><button key={subject.name} aria-pressed={prioritySubject===subject.name} className={prioritySubject===subject.name?'selected':''} onClick={()=>setPrioritySubject(subject.name)}>{subject.name}</button>)}</div></div><div className="priority-list">{visiblePriorities.map((item,index)=><button key={item.id} className={`priority-item ${!item.sufficient?'limited-priority':''}`} onClick={()=>setDialog({type:'competence',item})}><span className={item.sufficient?'rank':'unranked-icon'}>{item.sufficient?index+1:<Info size={20}/>}</span><div className="priority-name"><strong>{item.name}</strong><span>{item.subject} · {item.topic}</span></div><div className="priority-coverage"><Users size={15}/><span><b>{item.measured} murid</b> terukur</span></div><div className="priority-score"><div><b>{scoreText(item.score)}</b><span>penguasaan</span></div>{item.sufficient?<Progress value={item.score}/>:<DataBadge item={item}/>}</div><CaretRight size={16}/></button>)}</div>{filteredPriorities.some(c=>!c.sufficient)&&<div className="subtle-note"><Info size={15}/>{filteredPriorities.some(c=>c.measured)?'Submateri dengan data terbatas belum diberi peringkat prioritas.':'Submateri yang belum memiliki data belum diberi peringkat prioritas.'}</div>}</section>
 <section className="card sessions-section"><SectionTitle icon={CalendarBlank} action={<button className="text-button" onClick={openAssessmentHistory}>Lihat Detail<ArrowRight size={16}/></button>}>Status Pelaksanaan Asesmen</SectionTitle><p className="section-description">Ringkasan operasional pretest dan post-test · {periodLabel}</p><div className="sessions-grid">{sessions.map((s,i)=><button className={`session-metric ${s.tone}`} key={s.title} onClick={()=>setDialog({type:'sessions',selected:i})}><s.icon size={21}/><div><strong>{s.count}</strong><span>{s.title}</span></div></button>)}</div><SessionAccordion entries={assessmentEntries}/></section>
 <footer className="page-footer"><button onClick={()=>setDialog({type:'method'})}>Tentang perhitungan</button></footer></main>}
 {notice&&<div className="toast" role="status"><CheckCircle size={22}/>{notice}</div>}
 {dialog&&<Modal title={{readinessCategories:'Kategori Kesiapan',method:'Tentang Perhitungan Kesiapan',distribution:'Status Kesiapan Murid',classMethod:'Tentang Kesiapan Kelas',priorities:'Semua Submateri',competence:dialog.item?.name,subject:dialog.item?.name,mapping:'Petakan Murid ke Kelas',sessions:'Status Pelaksanaan Asesmen',materials:'Materi Pembelajaran',profile:'Profil Pengguna',nav:dialog.title}[dialog.type]} close={()=>setDialog(null)}>
 {dialog.type==='readinessCategories'&&<div className="modal-body"><ReadinessCategoryGuide/></div>}
 {dialog.type==='method'&&<div className="modal-body"><p>Nilai kesiapan dihitung hanya dari murid dengan hasil valid pada tahap, paket, dan tahun ajaran yang dipilih.</p><ol><li>Hasil paket yang mengukur kompetensi sama digabungkan per murid.</li><li>Nilai kompetensi yang terukur dirata-ratakan untuk setiap murid.</li><li>Nilai murid kemudian dirata-ratakan untuk sekolah atau kelasnya.</li></ol><p>Setiap murid terukur memiliki bobot yang sama. Murid tanpa data tidak dianggap bernilai nol. Murid belum memiliki kelas tetap masuk ringkasan murid terukur.</p><div className="method-callout">Jumlah murid sasaran belum dapat dipastikan. Karena itu, nilai ini menggambarkan murid terukur dan tidak menyatakan kondisi seluruh sekolah.</div><p>Dalam simulasi ini, hasil dari 1–2 murid ditandai “Data terbatas” dan tidak diberi peringkat prioritas. Tanpa murid terukur, nilai ditampilkan sebagai “—”.</p><p className="small muted">Ambang data terbatas dan kategori kesiapan adalah asumsi simulasi, bukan batas statistik. Perlu disepakati sebelum penerapan.</p></div>}
 {dialog.type==='classMethod'&&<div className="modal-body"><p>Nilai kesiapan dihitung dari murid yang telah memiliki nilai asesmen pada kelas atau kelompok tersebut.</p><p>Total Murid adalah jumlah murid yang tercatat pada kelompok. Murid tanpa nilai tidak dihitung sebagai nilai nol.</p><p>Jika belum ada murid terukur, kesiapan ditampilkan sebagai “—”. Hasil dari 1–2 murid diberi keterangan “Data terbatas”.</p></div>}
 {dialog.type==='distribution'&&<div className="modal-body"><p>Status kesiapan ditentukan berdasarkan nilai asesmen murid pada tahap {pre?'pretest':'post-test'}.</p>{distribution.map((d,i)=><div className="detail-row" key={d.label}><span>{d.label}<small>{d.range}</small></span><Badge tone={d.tone}>{d.count} murid · {d.percentage}%</Badge></div>)}<p className="small muted">Murid tanpa hasil valid tidak masuk distribusi. Persentase dihitung dari murid terukur, bukan seluruh murid sekolah. Nilai asesmen untuk status merupakan data simulasi terpisah dari skor kesiapan berbasis kompetensi.</p></div>}
 {['priorities','competence','subject','materials'].includes(dialog.type)&&<div className="modal-body"><p>Hasil {pre?'pretest':'post-test'} · {yearLabel} · {filterContext}</p>{priorities.filter(p=>dialog.type==='competence'?p.id===dialog.item.id:dialog.type==='subject'?p.subject===dialog.item.name:dialog.type==='priorities'?p.subject===activePrioritySubject:true).map(p=><div className="detail-row" key={p.id}><div><strong>{p.name}</strong><small>{p.subject} · {p.topic}</small><small>{p.measured?p.measured+' murid terukur':'Belum ada murid terukur'}</small></div><div className="detail-value"><b>{scoreText(p.score)}</b>{p.dataState!=='available'&&<DataBadge item={p}/>}</div></div>)}</div>}
 {dialog.type==='mapping'&&<div className="modal-body"><p>Pilih kelas untuk murid yang belum dipetakan. Ringkasan murid terukur tetap sama; jumlah murid terukur dan kesiapan kelas akan diperbarui.</p><label className="search-field"><MagnifyingGlass size={19}/><input aria-label="Cari nama murid" placeholder="Cari nama murid…" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="mapping-list">{unmapped.filter(s=>s.name.toLowerCase().includes(query.toLowerCase())).map(s=><div className="detail-row" key={s.id}><span>{s.name}<small>{school.pupils.some(p=>p.id===s.id)?'Memiliki hasil asesmen':'Belum ada data'}</small></span><select aria-label={`Kelas untuk ${s.name}`} value={mapping[s.id]||''} onChange={e=>setMapping({...mapping,[s.id]:e.target.value})}><option value="">Pilih kelas</option>{classes.map(c=><option key={c}>{c}</option>)}</select></div>)}{!unmapped.length&&<p>Semua murid sudah dipetakan ke kelas.</p>}</div><div className="modal-actions"><button className="outline-button" onClick={()=>setDialog(null)}>Batal</button><button className="primary-button" disabled={!Object.values(mapping).some(Boolean)} onClick={saveMapping}><Check size={18}/>Simpan Pemetaan</button></div></div>}
 {dialog.type==='sessions'&&<div className="modal-body"><p>{yearLabel} · {filterContext}</p>{sessions.filter((s,i)=>dialog.selected==null||dialog.selected===i).map(s=><div key={s.title} className="detail-row"><span>{s.title}</span><Badge tone={s.tone}>{s.count} sesi</Badge></div>)}<p className="small muted">Status sesi merupakan data operasional, bukan dasar pembobotan kesiapan murid.</p></div>}
 {dialog.type==='profile'&&<div className="modal-body"><strong>Annisa Nur</strong><p>Administrator sekolah · SMP Negeri 1 Malang</p><Badge tone="purple">Ruang kerja simulasi</Badge></div>}
 {dialog.type==='nav'&&<div className="modal-body"><p>{dialog.title} berada di luar cakupan pratinjau Kesiapan TKA ini.</p><button className="primary-button" onClick={()=>setDialog(null)}>Kembali ke Kesiapan TKA</button></div>}
 </Modal>}
 </>;
}
