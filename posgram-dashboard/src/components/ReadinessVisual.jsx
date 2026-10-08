import React,{useEffect,useId,useState} from 'react';
import {ChartLineUp,ChartBar,CheckCircle,Lightbulb,GraduationCap,ImageSquare} from '@phosphor-icons/react';

export default function ReadinessVisual({src}){
 const [failed,setFailed]=useState(false);
 const gradientId=useId();
 useEffect(()=>setFailed(false),[src]);
 if(!src||failed)return <div className="home-visual"><div className="home-image-placeholder" role="img" aria-label="Placeholder gambar Dashboard Kesiapan TKA"><ImageSquare size={42} weight="light"/><span>Placeholder gambar</span><small>Dashboard Kesiapan TKA</small></div></div>;
 return <div className="home-visual home-readiness-scene">
  <img className="home-readiness-image" src={src} alt="Ilustrasi Dashboard Kesiapan TKA" onError={()=>setFailed(true)}/>
  <div className="home-readiness-ornaments" aria-hidden="true">
   <div className="home-readiness-ornament trend">
    <span className="home-readiness-ornament-title"><ChartLineUp size={12} weight="duotone"/>Tren latihan</span>
    <svg className="home-readiness-trend" viewBox="0 0 100 38" focusable="false">
     <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9666ee" stopOpacity=".26"/><stop offset="100%" stopColor="#9666ee" stopOpacity="0"/></linearGradient></defs>
     <path d="M4 29 L22 23 L40 25 L59 15 L77 17 L96 6 L96 38 L4 38 Z" fill={`url(#${gradientId})`}/>
     <path d="M4 29 L22 23 L40 25 L59 15 L77 17 L96 6" fill="none" stroke="#8852e0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
     {[ [4,29],[22,23],[40,25],[59,15],[77,17],[96,6] ].map(([cx,cy])=><circle key={cx} cx={cx} cy={cy} r="2.5" fill="#8852e0"/>)}
    </svg>
   </div>
   <div className="home-readiness-ornament recommendations">
    <span className="home-readiness-ornament-title"><Lightbulb size={12} weight="duotone"/>Rekomendasi</span>
    <div className="home-readiness-recommendations">{['green','purple','amber'].map(tone=><span className={tone} key={tone}><CheckCircle size={10} weight="fill"/><i/></span>)}</div>
   </div>
   <div className="home-readiness-ornament bars">
    <span className="home-readiness-ornament-title"><ChartBar size={12} weight="duotone"/>Hasil latihan</span>
    <div className="home-readiness-bars">{[28,46,63,83,100].map(height=><i key={height} style={{height:`${height}%`}}/>)}</div>
   </div>
   <div className="home-readiness-ornament education"><GraduationCap size={27} weight="duotone"/></div>
  </div>
 </div>;
}
