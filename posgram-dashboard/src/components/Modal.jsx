import React,{useEffect,useRef} from 'react';
import {X} from '@phosphor-icons/react';

export default function Modal({title,close,children}){
 const modalRef=useRef(null);
 useEffect(()=>{
  const previous=document.activeElement;
  const previousOverflow=document.body.style.overflow;
  const onKey=e=>{
   if(e.key==='Escape')close();
   if(e.key!=='Tab')return;
   const items=[...modalRef.current.querySelectorAll('button,a[href],select,input,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
   if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1)?.focus()}
   else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0]?.focus()}
  };
  document.addEventListener('keydown',onKey);
  modalRef.current.querySelector('.close').focus();
  document.body.style.overflow='hidden';
  return()=>{document.removeEventListener('keydown',onKey);document.body.style.overflow=previousOverflow;previous?.focus()};
 },[]);
 return <div className="modal-backdrop" onClick={close}><section ref={modalRef} role="dialog" aria-modal="true" aria-label={title} className="modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><h2>{title}</h2><button className="icon-button close" aria-label="Tutup dialog" onClick={close}><X size={22}/></button></div>{children}</section></div>;
}
