import { stations, valves, quizzes, sequences, oral } from './kreislauf-data.js';
import { createScene } from './kreislauf-scene.js';

const $ = selector => document.querySelector(selector);
const icons = () => window.lucide?.createIcons();
const knownIds = new Set([...quizzes.map((_,i)=>`find-${i}`),'order-body','order-lung','speak-body','speak-lung']);
function readProgress(){try{const data=JSON.parse(localStorage.getItem('anatomie-circulation-progress')||'[]');return new Set(Array.isArray(data)?data.filter(id=>knownIds.has(id)):[])}catch{return new Set()}}
const progress=readProgress();
let mode='explore',selection=0,guideStep=0,exercise='find',quizIndex=0,answered=false,orderCircuit='body',orderPicked=[],orderResult=null,oralCircuit='body',oralShown=false,oralChecked=new Set(),model;
function mobileContext(data){
  const context=$('#mobile-context');
  if(mode==='explore'){const current=data||stations[selection];context.innerHTML=`<strong>${current.name}</strong><p>${current.text}</p>`;}
  if(mode==='guide'){context.innerHTML=`<div class="mobile-row"><div><p>SCHRITT ${guideStep+1} / 10</p><strong>${stations[guideStep].name}</strong></div><div class="mobile-actions"><button class="icon-button" id="mobile-back" aria-label="Vorheriger Schritt" ${guideStep===0?'disabled':''}><i data-lucide="arrow-left"></i></button><button class="icon-button" id="mobile-next" aria-label="Nächster Schritt"><i data-lucide="arrow-right"></i></button></div></div><p>${stations[guideStep].text}</p>`;$('#mobile-back').onclick=()=>{guideStep=Math.max(0,guideStep-1);renderGuide()};$('#mobile-next').onclick=()=>{guideStep=(guideStep+1)%10;renderGuide()};}
  if(mode==='practice'){
    if(exercise==='find'&&quizIndex<quizzes.length){context.innerHTML=`<div class="mobile-row"><div><p>ZUORDNEN ${quizIndex+1} / 10</p><strong>${quizzes[quizIndex].prompt}</strong></div>${answered?'<button class="icon-button" id="mobile-quiz-next" aria-label="Nächste Frage"><i data-lucide="arrow-right"></i></button>':''}</div><p id="mobile-answer-status" class="mobile-status">${answered?'Richtig. '+quizzes[quizIndex].why:''}</p>`;if(answered)$('#mobile-quiz-next').onclick=()=>{quizIndex++;answered=false;renderExercise()};}
    else{context.innerHTML=`<strong>${exercise==='order'?'Der Blutweg':exercise==='speak'?'Mündlich erklären':'Runde abgeschlossen'}</strong><p>${exercise==='order'?sequences[orderCircuit].name:exercise==='speak'?oral[oralCircuit].name:'Alle zehn Stationen geübt.'}</p>`;}
  }
  icons();
}
function score(){ $('#practice-score').textContent=`${progress.size} / ${knownIds.size} geübt`; }
function record(id){progress.add(id);try{localStorage.setItem('anatomie-circulation-progress',JSON.stringify([...progress]))}catch{$('#practice-score').textContent='Speichern im Browser nicht verfügbar';return}score()}
function oxygen(data){const kind=data.oxygen;if(kind==='wechsel-body')return '<span class="oxygen-tag"><b class="swatch red"></b>Reich → arm<b class="swatch blue"></b></span>';if(kind==='wechsel-lung')return '<span class="oxygen-tag"><b class="swatch blue"></b>Arm → reich<b class="swatch red"></b></span>';return `<span class="oxygen-tag"><b class="swatch ${kind==='reich'?'red':'blue'}"></b>Sauerstoff${kind}</span>`;}
function detailHTML(data,index){return `${index!==undefined?`<p class="detail-number">${String(index+1).padStart(2,'0')} / ${stations.length}</p>`:''}<h2>${data.name}</h2>${oxygen(data)}<p class="detail-description">${data.text}</p><dl class="fact-box"><dt>EINFACH ERKLÄRT</dt><dd><strong>${data.term}:</strong> ${data.definition}</dd></dl>${data.next?`<dl class="fact-box"><dt>DANACH</dt><dd>${data.next}</dd></dl>`:''}`;}
function selectStation(id){
  if(mode==='practice'){if(exercise==='find')answerFind(id===quizzes[quizIndex]?.target);return;}
  const index=stations.findIndex(s=>s.id===id);
  if(mode==='guide'&&index>=0){guideStep=index;renderGuide();return;}
  if(index>=0){selection=index;$('#detail').innerHTML=detailHTML(stations[index],index);$('#station-count').textContent=`${index+1} von ${stations.length}`;}
  else{const valve=valves.find(v=>v.id===id);if(!valve)return;if(mode!=='explore'){setMode('explore');$('#valve-toggle').checked=true;model?.setValves(true)}$('#detail').innerHTML=detailHTML(valve);$('#station-count').textContent='Herzklappe';}
  model?.setSelection(id);
  mobileContext(index>=0?stations[index]:valves.find(v=>v.id===id));
}
function setMode(next){
  mode=next;
  for(const button of document.querySelectorAll('[data-mode]')){const selected=button.dataset.mode===mode;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;}
  for(const name of ['explore','guide','practice'])$(`#${name}-panel`).hidden=name!==mode;
  model?.setPractice(mode==='practice');$('#valve-toggle').checked=false;model?.setValves(false);$('#valve-toggle').disabled=mode==='practice';$('#label-toggle').disabled=mode==='practice';model?.setCircuit('all');
  document.querySelectorAll('[data-circuit]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.circuit==='all')));
  if(mode==='explore')selectStation(stations[selection].id);
  if(mode==='guide')renderGuide();
  if(mode==='practice'){model?.setSelection('');renderExercise()}
  const hash={explore:'anschauen',guide:'schritte',practice:'ueben'}[mode];history.replaceState(null,'',`#${hash}`);icons();
}
function renderGuide(){
  const data=stations[guideStep];$('#guide-detail').innerHTML=detailHTML(data,guideStep);$('#step-progress').style.width=`${(guideStep+1)/stations.length*100}%`;$('#guide-prev').disabled=guideStep===0;$('#guide-next').innerHTML=guideStep===stations.length-1?'Noch einmal<i data-lucide="rotate-ccw"></i>':'Weiter<i data-lucide="arrow-right"></i>';
  $('#step-list').innerHTML=stations.map((s,i)=>`<li><button data-step="${i}" class="${i===guideStep?'active':''}" ${i===guideStep?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span>${s.name}</button></li>`).join('');
  $('#step-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{guideStep=Number(b.dataset.step);renderGuide()}));model?.setSelection(data.id);icons();
  mobileContext();
}
function renderExercise(){
  score();document.querySelectorAll('[data-exercise]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.exercise===exercise)));
  model?.setCircuit('all');model?.setSelection('');
  if(exercise==='find')renderFind();if(exercise==='order')renderOrder();if(exercise==='speak')renderOral();icons();
  mobileContext();
}
function renderFind(){
  answered=false;
  if(quizIndex>=quizzes.length){$('#exercise').innerHTML=`<p class="section-label">RUNDE ABGESCHLOSSEN</p><h3 class="exercise-heading">Ein Kreislauf. Zehn Stationen.</h3><p class="subtle">${quizzes.filter((_,i)=>progress.has(`find-${i}`)).length} von 10 Zuordnungen geübt.</p><button id="restart-quiz" class="primary full-width"><i data-lucide="rotate-ccw"></i>Noch eine Runde</button>`;$('#restart-quiz').onclick=()=>{quizIndex=0;answered=false;renderExercise()};return;}
  const q=quizzes[quizIndex];$('#exercise').innerHTML=`<p class="section-label">ZUORDNEN · ${quizIndex+1} / ${quizzes.length}</p><h3 class="exercise-heading">${q.prompt}</h3><div class="answer-options">${q.choices.map((c,i)=>`<button data-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${c}</button>`).join('')}</div><div id="find-feedback" role="status" aria-live="polite"></div><button id="next-question" class="primary full-width" hidden>Weiter<i data-lucide="arrow-right"></i></button>`;
  $('#exercise').querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>answerFind(Number(b.dataset.answer)===q.correct,Number(b.dataset.answer))));
  $('#next-question').onclick=()=>{quizIndex++;answered=false;renderExercise()};
}
function answerFind(correct,choice){
  if(answered||quizIndex>=quizzes.length)return;const q=quizzes[quizIndex];
  const feedback=$('#find-feedback');feedback.className=`feedback ${correct?'':'error'}`;
  if(!correct){feedback.textContent='Noch nicht ganz. Überlege, woher das Blut kommt und wohin es fließt.';if($('#mobile-answer-status'))$('#mobile-answer-status').textContent='Noch nicht ganz. Versuche es erneut.';if(choice!==undefined){const wrong=$(`[data-answer="${choice}"]`);wrong.classList.add('wrong');wrong.disabled=true;}return;}
  answered=true;record(`find-${quizIndex}`);feedback.textContent=`Richtig. ${q.why}`;model?.setSelection(q.target);
  $('#exercise').querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;b.classList.toggle('correct',Number(b.dataset.answer)===q.correct)});$('#next-question').hidden=false;icons();
  mobileContext();
}
function circuitSelect(value){return `<label class="exercise-note">Kreislauf <select id="exercise-circuit" style="margin-left:8px;padding:8px;border:1px solid var(--line);border-radius:5px;background:white;color:var(--ink)"><option value="body" ${value==='body'?'selected':''}>Körper</option><option value="lung" ${value==='lung'?'selected':''}>Lunge</option></select></label>`;}
function renderOrder(){
  const seq=sequences[orderCircuit];model?.setCircuit(orderCircuit);const mixed=[2,4,1,0,3];
  $('#exercise').innerHTML=`${circuitSelect(orderCircuit)}<h3 class="exercise-heading">Bring den Blutweg in die richtige Reihenfolge.</h3><div class="order-slots" aria-label="Deine Reihenfolge">${seq.items.map((_,i)=>`<span>${orderPicked[i]!==undefined?`${i+1}. ${seq.items[orderPicked[i]]}`:''}</span>`).join('')}</div><div class="answer-options">${mixed.map(i=>`<button data-order="${i}" ${orderPicked.includes(i)?'disabled':''}>${seq.items[i]}</button>`).join('')}</div><div class="guide-controls"><button class="secondary" id="undo-order" ${!orderPicked.length?'disabled':''}><i data-lucide="undo-2"></i>Zurück</button><button class="primary" id="check-order" ${orderPicked.length<5?'disabled':''}>Prüfen<i data-lucide="check"></i></button></div><div id="order-feedback" role="status" aria-live="polite">${orderResult||''}</div><button id="reset-order" class="secondary full-width"><i data-lucide="rotate-ccw"></i>Neu beginnen</button>`;
  $('#exercise-circuit').onchange=e=>{orderCircuit=e.target.value;orderPicked=[];orderResult=null;renderExercise()};
  $('#exercise').querySelectorAll('[data-order]').forEach(b=>b.onclick=()=>{orderPicked.push(Number(b.dataset.order));orderResult=null;renderOrder();model?.setSelection(seq.ids[Number(b.dataset.order)]);});
  $('#undo-order').onclick=()=>{orderPicked.pop();orderResult=null;renderOrder()};$('#reset-order').onclick=()=>{orderPicked=[];orderResult=null;renderOrder()};
  $('#check-order').onclick=()=>{const right=orderPicked.every((item,i)=>item===i);if(right)record(`order-${orderCircuit}`);orderResult=`<p class="feedback ${right?'':'error'}">${right?'Richtig. Der Blutweg ist vollständig.':`Noch nicht ganz. Prüfe Station ${orderPicked.findIndex((item,i)=>item!==i)+1} deiner Reihenfolge.`}</p>`;renderOrder()};icons();
}
function renderOral(){
  const data=oral[oralCircuit];model?.setCircuit(oralCircuit);
  $('#exercise').innerHTML=`${circuitSelect(oralCircuit)}<p class="section-label" style="margin-top:24px">MÜNDLICH ÜBEN</p><h3 class="exercise-heading">Erkläre den ${data.name} mit eigenen Worten.</h3><p class="exercise-note">Startpunkt · Stoffaustausch · Rückweg</p><button id="show-oral" class="primary full-width">${oralShown?'Musterantwort ausblenden':'Musterantwort zeigen'}<i data-lucide="${oralShown?'eye-off':'eye'}"></i></button>${oralShown?`<div class="oral-answer">${data.text}</div><ul class="oral-checks">${data.checks.map((c,i)=>`<li><label><input type="checkbox" data-check="${i}" ${oralChecked.has(i)?'checked':''}>${c}</label></li>`).join('')}</ul><button class="secondary full-width" id="save-oral" ${oralChecked.size<3?'disabled':''}><i data-lucide="check"></i>Als geübt speichern</button><p id="oral-feedback" role="status"></p>`:''}`;
  $('#exercise-circuit').onchange=e=>{oralCircuit=e.target.value;oralShown=false;oralChecked=new Set();renderExercise()};$('#show-oral').onclick=()=>{oralShown=!oralShown;renderOral()};
  $('#exercise').querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>{const index=Number(c.dataset.check);c.checked?oralChecked.add(index):oralChecked.delete(index);$('#save-oral').disabled=oralChecked.size<3});
  if(oralShown)$('#save-oral').onclick=()=>{record(`speak-${oralCircuit}`);$('#oral-feedback').textContent='Gespeichert. Gut geübt.'};icons();
}

try{model=createScene(selectStation)}catch(error){console.error('Kreislaufmodell konnte nicht geladen werden:',error);$('#scene-loading').hidden=true;$('#fallback').hidden=false;$('#model').hidden=true;$('#labels').hidden=true;$('.scene-controls').hidden=true;}
document.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>setMode(button.dataset.mode));
$('.mode-bar').addEventListener('keydown',event=>{const modes=['explore','guide','practice'];if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let index=modes.indexOf(mode);index=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;setMode(modes[index]);$(`[data-mode="${modes[index]}"]`).focus()});
$('#station-prev').onclick=()=>selectStation(stations[(selection+9)%10].id);$('#station-next').onclick=()=>selectStation(stations[(selection+1)%10].id);
document.querySelectorAll('[data-circuit]').forEach(button=>button.onclick=()=>{const circuit=button.dataset.circuit;document.querySelectorAll('[data-circuit]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));model?.setCircuit(circuit);selectStation(circuit==='lung'?'rv':'lv')});
$('#guide-prev').onclick=()=>{guideStep=Math.max(0,guideStep-1);renderGuide()};$('#guide-next').onclick=()=>{guideStep=(guideStep+1)%10;renderGuide()};
document.querySelectorAll('[data-exercise]').forEach(button=>button.onclick=()=>{exercise=button.dataset.exercise;answered=false;renderExercise()});
function playIcon(){const running=model?.running;$('#play').innerHTML=`<i data-lucide="${running?'pause':'play'}"></i>`;$('#play').title=running?'Animation pausieren':'Animation starten';$('#play').setAttribute('aria-label',$('#play').title);icons()}
$('#play').onclick=()=>{model?.setRunning(!model.running);playIcon()};$('#speed').oninput=e=>model?.setSpeed(Number(e.target.value));$('#label-toggle').onchange=e=>model?.setLabels(e.target.checked);$('#valve-toggle').onchange=e=>model?.setValves(e.target.checked);
$('#reset-view').onclick=()=>{selection=0;guideStep=0;$('#label-toggle').checked=true;model?.setLabels(true);model?.reset();setMode('explore')};
const hashes={anschauen:'explore',schritte:'guide',ueben:'practice'};setMode(hashes[location.hash.slice(1)]||'explore');playIcon();score();
window.addEventListener('pagehide',()=>model?.dispose(),{once:true});
window.addEventListener('pageshow',e=>{if(e.persisted)location.reload()});
