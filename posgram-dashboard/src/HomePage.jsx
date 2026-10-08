import React,{useEffect,useId,useRef,useState} from 'react';
import {CaretRight,CaretLeft,Users,UsersThree,ImageSquare,ShareNetwork,ChartBar,ChartLineUp,Target,Copy,Check,CheckCircle,Info,Sparkle,ArrowRight,CircleNotch,Buildings} from '@phosphor-icons/react';
import Modal from './components/Modal';
import InvitationVisual from './components/InvitationVisual';
import ReadinessVisual from './components/ReadinessVisual';
import {homeWorkspace,homeImages,canShareInvitation,availableInvitationUrl,invitationShareMessage} from './home-context';
import './home.css';

const slideNames=['ASIQ','Dashboard Kesiapan TKA'];
const slides=[
 {badge:'Kenali Layanan ASIQ',title:'Persiapan TKA Lebih Terarah Bersama ASIQ',description:'Analisis hasil latihan TKA, petakan kesiapan murid, dan rencanakan tindak lanjut pembelajaran dengan lebih mudah melalui ASIQ yang terintegrasi dengan POSGRAM Sekolah untuk mendukung peningkatan mutu akademik.',cta:'Coba ASIQ Sekarang'},
 {badge:'Dashboard Kesiapan TKA',title:'Pantau Kesiapan Murid dari Hasil Latihan TKA',description:'Pantau hasil latihan TKA, kenali kondisi kesiapan murid, dan temukan area pembelajaran yang perlu diperkuat. Semua tersaji dalam satu dasbor untuk membantu sekolah merencanakan tindak lanjut yang lebih tepat.',cta:'Jelajahi Dasbor Kesiapan'},
];
function HeroVisual({src,name,compact=false,featured=false}){
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[src]);
 return <div className={`home-visual ${compact?'home-visual-compact':''} ${featured&&src&&!failed?'home-visual-featured':''}`}>{src&&!failed?<img src={src} alt={`Ilustrasi ${name}`} onError={()=>setFailed(true)}/>:<div className="home-image-placeholder" role="img" aria-label={`Placeholder gambar ${name}`}><ImageSquare size={compact?32:42} weight="light"/><span>Placeholder gambar</span><small>{name}</small></div>}</div>;
}

export default function HomePage({workspace=homeWorkspace,images=homeImages,onRetryInvitation}){
 const [slide,setSlide]=useState(0),[dialog,setDialog]=useState(null),[feedback,setFeedback]=useState(null),[busy,setBusy]=useState(false);
 const [carouselHovered,setCarouselHovered]=useState(false),[carouselFocused,setCarouselFocused]=useState(false),[pageVisible,setPageVisible]=useState(true);
 const headingRef=useRef(null),tabsRef=useRef([]),panelId=useId();
 const canShare=canShareInvitation(workspace),invitationUrl=availableInvitationUrl(workspace);
 const invitationStatus=workspace.invitationStatus==='loading'?'loading':workspace.invitationStatus==='error'?'error':invitationUrl?'ready':'unavailable';
 const carouselPaused=carouselHovered||carouselFocused||!pageVisible||Boolean(dialog);
 useEffect(()=>headingRef.current?.focus({preventScroll:true}),[]);
 useEffect(()=>{setDialog(null);setFeedback(null)},[workspace.name,canShare,workspace.asiqUrl]);
 useEffect(()=>{if(!feedback)return;const timer=setTimeout(()=>setFeedback(null),4500);return()=>clearTimeout(timer)},[feedback]);
 useEffect(()=>{
  const updateVisibility=()=>setPageVisible(!document.hidden);
  updateVisibility();document.addEventListener('visibilitychange',updateVisibility);
  return()=>document.removeEventListener('visibilitychange',updateVisibility);
 },[]);
 useEffect(()=>{
  if(carouselPaused)return;
  const timer=setTimeout(()=>setSlide(current=>(current+1)%slides.length),3000);
  return()=>clearTimeout(timer);
 },[slide,carouselPaused]);
 function changeSlide(next){setSlide((next+2)%2)}
 function moveTab(e){
  const next=e.key==='ArrowRight'||e.key==='ArrowLeft'?(slide+1)%2:e.key==='Home'?0:e.key==='End'?1:null;
  if(next===null)return;
  e.preventDefault();setSlide(next);tabsRef.current[next]?.focus();
 }
 async function copy(value,message){
  if(!value||busy)return;
  setBusy(true);
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(value);setFeedback({message,tone:'success'})}
  catch{setFeedback({message:'Belum dapat menyalin. Pilih teks dan salin secara manual.',tone:'error'})}
  finally{setBusy(false)}
 }
 async function shareInvitation(){
  const payload=invitationShareMessage(workspace);
  if(!payload||busy)return;
  if(navigator.share&&(!navigator.canShare||navigator.canShare(payload))){
   setBusy(true);
   try{await navigator.share(payload);setFeedback({message:'Link undangan berhasil dibagikan.',tone:'success'});return}
   catch(error){if(error.name==='AbortError')return}
   finally{setBusy(false)}
  }
  setDialog({type:'share'});
 }
 const visibleDialog=dialog?.type==='asiq'?dialog:canShare&&dialog;
 const payload=invitationShareMessage(workspace);
 const shareText=payload?[payload.text,payload.url].join('\n\n'):'';
 function closeDialog(){setDialog(null);setFeedback(null)}
 return <main className="home-page">
  <div className="home-heading"><div><h1 tabIndex={-1} ref={headingRef}>Beranda</h1><p>Akses layanan dan kelola kolaborasi instansi Anda.</p></div></div>
  <div className={`home-main-grid ${canShare?'':'without-invitation'}`}>
   <section className={`home-carousel ${slide===1?'dashboard-slide':''}`} aria-label="Fitur utama POSGRAM" aria-roledescription="carousel" onPointerEnter={e=>{if(e.pointerType==='mouse')setCarouselHovered(true)}} onPointerLeave={e=>{if(e.pointerType==='mouse')setCarouselHovered(false)}} onFocusCapture={()=>setCarouselFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setCarouselFocused(false)}}>
    <div className="home-slide-frame">{slides.map((item,index)=><div key={item.badge} id={`${panelId}-panel-${index}`} className={`home-slide ${index===1?'home-slide-dashboard':''}`} role="tabpanel" aria-labelledby={`${panelId}-tab-${index}`} aria-hidden={slide!==index} inert={slide!==index?true:undefined}>
     <div className="home-hero-copy"><span className="home-feature-badge">{index===0?<Sparkle size={14}/>:<ChartBar size={14}/>}<span>{item.badge}</span></span><h2>{item.title}</h2><p>{item.description}</p>
      {index===1&&<ul className="home-highlights">{[[ChartLineUp,'Analisis Hasil Asesmen'],[UsersThree,'Pemetaan Kesiapan Murid'],[Target,'Prioritas Penguatan Materi']].map(([Icon,name])=><li key={name}><Icon size={16} weight="duotone" aria-hidden="true"/>{name}</li>)}</ul>}
      <div className="home-hero-actions">{index===1?<a className="primary-button" href="#/">{item.cta}<ArrowRight size={19}/></a>:workspace.asiqUrl?<a className="primary-button" href={workspace.asiqUrl} target="_blank" rel="noopener noreferrer">{item.cta}<ArrowRight size={19}/></a>:<button className="primary-button" onClick={()=>setDialog({type:'asiq'})}>{item.cta}<ArrowRight size={19}/></button>}</div>
     </div>
     {index===0?<HeroVisual src={images.asiq} name={slideNames[index]} featured/>:<ReadinessVisual src={images.readiness}/>}
    </div>)}</div>
    <div className="home-carousel-footer"><button className="home-carousel-arrow" aria-label="Slide sebelumnya" onClick={()=>changeSlide(slide-1)}><CaretLeft size={19}/></button><div className="home-slide-tabs" role="tablist" aria-label="Pilih konten Beranda" onKeyDown={moveTab}>{slideNames.map((name,index)=><button key={name} id={`${panelId}-tab-${index}`} aria-label={name} ref={el=>tabsRef.current[index]=el} role="tab" aria-controls={`${panelId}-panel-${index}`} aria-selected={slide===index} tabIndex={slide===index?0:-1} className={slide===index?'selected':''} onClick={()=>setSlide(index)}><span className="home-slide-dot" aria-hidden="true"/></button>)}</div><button className="home-carousel-arrow" aria-label="Slide berikutnya" onClick={()=>changeSlide(slide+1)}><CaretRight size={19}/></button></div>
    <span className="home-sr-only" aria-live={carouselPaused?'polite':'off'}>{slideNames[slide]} — {slide+1} dari 2</span>
   </section>
   {canShare&&<section className="home-invitation"><div className="home-invitation-media"><InvitationVisual src={images.invitation}/></div><div className="home-invitation-body"><span className="home-invitation-eyebrow">KOLABORASI INSTANSI</span><h2>Undang Guru ke Instansi</h2><div className="home-invitation-workspace"><span className="home-invitation-workspace-icon"><Buildings size={21} weight="duotone" aria-hidden="true"/></span><strong>{workspace.name}</strong></div><p>Bagikan link undangan agar guru dapat bergabung ke instansi POSGRAM dan workspace sekolah di ASIQ.</p></div><div className="home-invitation-actions"><button className="home-invite-button" onClick={()=>setDialog({type:'invite'})}><ShareNetwork size={20}/>Bagikan Link Undangan</button><p className="home-invitation-helper"><Check size={14}/><span>Khusus untuk guru di instansi Anda</span></p></div></section>}
  </div>
  {visibleDialog&&<Modal key={visibleDialog.type} title={visibleDialog.type==='asiq'?'ASIQ':'Bagikan Link Undangan'} close={closeDialog}><div className="modal-body home-dialog-body">
   {visibleDialog.type==='asiq'?<><p>Analisis hasil latihan TKA dan rencanakan tindak lanjut pembelajaran melalui ASIQ.</p><div className="home-availability"><Info size={23}/><div><strong>Akses ASIQ belum tersedia.</strong><span>Anda tetap dapat melihat hasil asesmen melalui Dasbor Kesiapan TKA.</span></div></div><a className="primary-button home-dialog-dashboard-link" href="#/" onClick={closeDialog}>Jelajahi Dasbor Kesiapan<ArrowRight size={17}/></a></>:<><p>Undang guru untuk bergabung ke instansi POSGRAM dan melanjutkan ke workspace ASIQ.</p><div className="home-dialog-workspace"><span className="icon-tile"><Users size={24}/></span><strong>{workspace.name}</strong></div>
    {visibleDialog.type==='share'&&invitationUrl?<><p>Bagikan undangan ini melalui aplikasi pesan yang Anda gunakan.</p><textarea aria-label="Pesan untuk dibagikan" className="home-share-message" readOnly value={shareText} onFocus={e=>e.target.select()}/><div className="home-dialog-actions"><button className="primary-button" disabled={busy} onClick={()=>copy(shareText,'Pesan undangan berhasil disalin.')}><Copy size={18}/>Salin Pesan</button><button className="home-secondary-button" onClick={()=>setDialog({type:'invite'})}>Kembali ke Undangan</button></div></>:<><label className="home-invitation-field">Link undangan<input aria-label="Link undangan instansi" value={invitationUrl} placeholder={invitationStatus==='loading'?'Menyiapkan link undangan…':'Link undangan belum tersedia'} readOnly onFocus={e=>e.target.select()}/></label>
     {invitationStatus==='loading'?<div className="home-link-state" role="status"><CircleNotch size={18} className="home-loading-icon"/><span>Menyiapkan link undangan…</span></div>:invitationStatus==='error'?<div className="home-link-state error" role="alert"><Info size={18}/><span>{workspace.invitationError||'Link undangan belum dapat dimuat.'}</span>{onRetryInvitation&&<button className="home-retry" onClick={onRetryInvitation}>Coba Lagi</button>}</div>:invitationStatus==='unavailable'?<div className="home-link-state"><Info size={18}/><span>Link undangan belum tersedia.</span></div>:null}
     <div className="home-dialog-actions"><button className="primary-button" disabled={!invitationUrl||busy} onClick={()=>copy(invitationUrl,'Link undangan berhasil disalin.')}><Copy size={18}/>Salin Link</button><button className="home-secondary-button" disabled={!invitationUrl||busy} onClick={shareInvitation}><ShareNetwork size={18}/>Bagikan</button></div>
    </>}
   </>}
  </div></Modal>}
  {feedback&&<div className={`toast home-feedback ${feedback.tone==='error'?'home-feedback-error':''}`} role={feedback.tone==='error'?'alert':'status'}>{feedback.tone==='error'?<Info size={21}/>:<CheckCircle size={21}/>}<span>{feedback.message}</span></div>}
 </main>;
}
