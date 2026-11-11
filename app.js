
const menu=document.querySelector('.menutoggle'),nav=document.querySelector('#mainnav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.textContent=open?'Fermer':'Menu';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const search=document.querySelector('#termsearch');
search?.addEventListener('input',()=>{let count=0;document.querySelectorAll('.term').forEach(el=>{const show=normal(el.textContent).includes(normal(search.value.trim()));el.hidden=!show;if(show)count++;});document.querySelector('#resultcount').textContent=count+' notion'+(count!==1?'s':'')+' trouvée'+(count!==1?'s':'');document.querySelector('#noresults').hidden=count!==0;});
const fields=[...document.querySelectorAll('[data-note]')],key='selance-candidature-notes-v1',status=document.querySelector('#notestatus');
let values={},storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))values=saved;}catch(e){storageOK=false;}
function printValues(){fields.forEach(el=>document.querySelector('[data-print="'+el.dataset.note+'"]').textContent=el.value||' ');}
function save(){values=Object.fromEntries(fields.map(el=>[el.dataset.note,el.value]));try{localStorage.setItem(key,JSON.stringify(values));storageOK=true;status.textContent='Notes enregistrées sur cet appareil.';}catch(e){storageOK=false;status.textContent='Stockage indisponible : exportez vos notes avant de quitter cette page.';}printValues();}
fields.forEach(el=>{el.value=typeof values[el.dataset.note]==='string'?values[el.dataset.note]:'';el.addEventListener('input',save);});
if(fields.length){printValues();if(!storageOK)status.textContent='Stockage indisponible : exportez vos notes avant de quitter cette page.';}
document.querySelector('#exportnotes')?.addEventListener('click',()=>{const text='MON CARNET — SÉLANCE ÉLECTRONIQUE\nEntreprise fictive · Jeu de rôle\n\n'+fields.map(el=>document.querySelector('label[for="'+el.id+'"]').textContent+'\n'+el.value).join('\n\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='mon-carnet-selance.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Export préparé. Vérifiez les téléchargements de votre navigateur.';});
document.querySelector('#printnotes')?.addEventListener('click',()=>{printValues();window.print();});
document.querySelector('#clearnotes')?.addEventListener('click',()=>{if(!confirm('Effacer toutes vos notes sur cet appareil ?'))return;fields.forEach(el=>el.value='');try{localStorage.removeItem(key);}catch(e){}values={};printValues();status.textContent='Notes effacées sur cet appareil.';});
