// Frontend presentation context for the existing administrator preview.
// Supply the active workspace, verified permission result, and real integration URLs.
// No invitation URL or ASIQ URL is invented or requested from an API.
export const homeWorkspace={
 name:'SMP Negeri 1 Malang',
 permissions:['instansi.invite.view','instansi.invite.share'],
 invitationUrl:null,
 invitationStatus:'unavailable',
 invitationError:null,
 asiqUrl:null,
};

// Save replacement assets in public/assets and set the corresponding URLs here.
export const homeImages={asiq:'/assets/asiq-learning-dashboard.png',readiness:'/assets/readiness-dashboard-v2.png',invitation:null};

export function canShareInvitation(workspace){return workspace?.permissions?.includes('instansi.invite.share')===true}
export function availableInvitationUrl(workspace){
 if(!canShareInvitation(workspace)||workspace.invitationStatus==='loading'||workspace.invitationStatus==='error')return '';
 if(typeof workspace.invitationUrl!=='string')return '';
 const value=workspace.invitationUrl.trim();
 try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?value:''}catch{return ''}
}
export function invitationShareMessage(workspace){
 const url=availableInvitationUrl(workspace);
 if(!url)return null;
 return {title:'Undangan Guru ke '+workspace.name,text:'Undangan bergabung ke instansi '+workspace.name+' di POSGRAM dan workspace sekolah di ASIQ. Buka link undangan dan periksa identitas instansi tujuan sebelum melanjutkan.',url};
}
