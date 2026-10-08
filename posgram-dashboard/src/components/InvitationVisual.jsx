import React,{useEffect,useState} from 'react';
import {ChalkboardTeacher,UsersThree,User,UserPlus,LinkSimple,Sparkle} from '@phosphor-icons/react';

export default function InvitationVisual({src}){
 const [failed,setFailed]=useState(false);
 useEffect(()=>setFailed(false),[src]);
 if(src&&!failed)return <div className="home-visual home-visual-compact"><img src={src} alt="Ilustrasi Kolaborasi instansi" onError={()=>setFailed(true)}/></div>;
 return <div className="home-invite-illustration" role="img" aria-label="Ilustrasi kolaborasi guru dalam instansi">
  <div className="home-collaboration-art" aria-hidden="true">
   <svg className="home-collaboration-connections" viewBox="0 0 280 134" preserveAspectRatio="none" focusable="false"><path d="M50 38 C79 8 109 29 140 63 M140 63 C176 34 206 81 235 55 M76 101 C105 117 115 89 140 63 M140 63 C163 72 184 106 217 109" vectorEffect="non-scaling-stroke"/></svg>
   <span className="home-collaboration-avatar teacher"><ChalkboardTeacher size={20} weight="duotone"/></span>
   <span className="home-collaboration-avatar invitee"><UserPlus size={19} weight="duotone"/></span>
   <span className="home-collaboration-avatar colleague"><User size={18} weight="duotone"/></span>
   <span className="home-collaboration-hub"><UsersThree size={32} weight="duotone"/></span>
   <span className="home-collaboration-link"><LinkSimple size={19} weight="bold"/></span>
   <Sparkle className="home-collaboration-sparkle" size={13} weight="duotone"/>
  </div>
 </div>;
}
