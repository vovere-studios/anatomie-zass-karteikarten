import { createDigestionScene } from './verdauung-scene.js?v=2';

const $ = selector => document.querySelector(selector);
const icons = () => window.lucide?.createIcons();
const stations = [
  {id:'mouth',name:'Mund',page:249,text:'Zähne zerkleinern die Nahrung. Speichel macht sie feucht, und die Zunge formt einen Bissen.',fact:'Die Verdauung beginnt schon im Mund.'},
  {id:'pharynx',name:'Rachen',page:253,text:'Die Zunge schiebt den Bissen in den Rachen. Hier treffen sich Luftweg und Speiseweg.',fact:'Rachen heißt auch Pharynx.'},
  {id:'epiglottis',name:'Kehldeckel',page:253,text:'Beim Schlucken deckt der Kehldeckel den Eingang zum Kehlkopf ab. Der Bissen gelangt in die Speiseröhre.',fact:'Der weiche Gaumen verschließt dabei den Weg zur Nase.'},
  {id:'esophagus',name:'Speiseröhre',page:247,text:'Die Speiseröhre bringt den Bissen in den Magen. Muskelbewegungen schieben ihn weiter.',fact:'Diese wellenförmige Bewegung heißt Peristaltik.'},
  {id:'stomach',name:'Magen',page:247,text:'Der Magen sammelt und mischt die Nahrung mit Magensaft. So wird sie weiter zerlegt.',fact:'Der Magen liegt im Körper links, in der Vorderansicht rechts.'},
  {id:'duodenum',name:'Zwölffingerdarm',page:247,text:'Vom Magen geht der Nahrungsbrei zuerst in den Zwölffingerdarm. Er ist der erste Teil des Dünndarms.',fact:'Hier kommen auch Galle und Verdauungssaft der Bauchspeicheldrüse hinzu.'},
  {id:'small',name:'Dünndarm',page:247,text:'Die Nahrung wird weiter verdaut. Die meisten Nährstoffe gehen durch die Darmwand ins Blut.',fact:'Der Dünndarm liegt im Modell in der Mitte.'},
  {id:'large',name:'Dickdarm',page:247,text:'Der Dickdarm entzieht dem Rest Wasser. Daraus wird Stuhl.',fact:'Im Modell verläuft der Dickdarm außen um den Dünndarm.'},
  {id:'rectum',name:'Mastdarm & After',page:247,text:'Der Mastdarm sammelt den Stuhl. Über den After verlässt er den Körper.',fact:'Mastdarm heißt auch Rektum; After heißt auch Anus.'},
  {id:'liver',name:'Leber',page:247,text:'Die Leber bildet Galle. Sie hilft bei der Verdauung von Fett.',fact:'Die Nahrung läuft nicht durch die Leber.',helper:true},
  {id:'gallbladder',name:'Gallenblase',page:247,text:'Die Gallenblase speichert Galle und gibt sie bei Bedarf in den Dünndarm ab.',fact:'Die Galle wird in der Leber gebildet.',helper:true},
  {id:'pancreas',name:'Bauchspeicheldrüse',page:247,text:'Sie bildet Verdauungssaft mit Enzymen und gibt ihn in den Dünndarm ab.',fact:'Pankreas ist der andere Name für Bauchspeicheldrüse.',helper:true}
];
const route = stations.filter(s=>!s.helper);
const oralText = [
  'Im Mund wird die Nahrung gekaut und mit Speichel vermischt. Die Zunge schiebt den Bissen in den Rachen.',
  'Beim Schlucken schützt der Kehldeckel den Luftweg. Der Bissen geht durch die Speiseröhre in den Magen.',
  'Dann folgt der Dünndarm. Dort nimmt der Körper die meisten Nährstoffe auf. Der Dickdarm entzieht Wasser. Der Rest verlässt den Körper über Mastdarm und After.'
];
const questions = [
  {q:'Wohin schiebt die Zunge den Bissen?',options:['In den Rachen','In die Luftröhre','Direkt in den Magen'],answer:0},
  {q:'Was schützt beim Schlucken den Eingang zur Luftröhre?',options:['Die Gallenblase','Der Kehldeckel','Der Dickdarm'],answer:1},
  {q:'Was kommt nach dem Rachen?',options:['Der Dünndarm','Die Speiseröhre','Die Leber'],answer:1},
  {q:'Was kommt nach der Speiseröhre?',options:['Der Magen','Der Dickdarm','Die Nase'],answer:0},
  {q:'Was ist der erste Teil des Dünndarms?',options:['Der Mastdarm','Der Zwölffingerdarm','Die Gallenblase'],answer:1},
  {q:'Wo nimmt der Körper die meisten Nährstoffe auf?',options:['Im Dickdarm','In der Luftröhre','Im Dünndarm'],answer:2},
  {q:'Was entzieht der Dickdarm dem Nahrungsrest?',options:['Wasser','Sauerstoff','Galle'],answer:0},
  {q:'Wie verlässt der Nahrungsrest den Körper?',options:['Über Leber und Magen','Über Mastdarm und After','Über die Bauchspeicheldrüse'],answer:1}
];

let selected=0,guideIndex=0,mode='explore',exercise='order',questionIndex=0,answered=false,oralShown=false;
let model=null;
let saved=0;
try{saved=Number(localStorage.getItem('anatomie-zass-digestion-practice')||0)||0}catch{}
function score(){ $('#practice-score').textContent=`${Math.min(saved,questions.length)} / ${questions.length} richtig beantwortet`; }
function select(id){
  const index=stations.findIndex(s=>s.id===id);if(index<0)return;
  selected=index;model?.select(id);
  $('#station-picks').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.station===id)));
  const s=stations[index];
  $('#detail').innerHTML=`<p class="detail-num">Skriptseite ${s.page}</p><h2>${s.name}</h2><p class="detail-text">${s.text}</p><div class="detail-fact"><strong>Gut zu merken</strong>${s.fact}</div>${s.helper?'<p class="helper-note">Hilfsorgan: Der Nahrungsbrei fließt hier nicht hindurch.</p>':''}`;
  $('#station-count').textContent=`${index+1} / ${stations.length}`;
}
function renderGuide(){
  const s=route[guideIndex];model?.select(s.id);
  $('#step-progress').style.width=`${(guideIndex+1)/route.length*100}%`;
  $('#guide-detail').innerHTML=`<p class="detail-num">SCHRITT ${guideIndex+1} / ${route.length} · Skriptseite ${s.page}</p><h2>${s.name}</h2><p class="detail-text">${s.text}</p><div class="detail-fact"><strong>Gut zu merken</strong>${s.fact}</div>`;
  $('#guide-prev').disabled=guideIndex===0;
  $('#guide-next').innerHTML=guideIndex===route.length-1?'Von vorn beginnen<i data-lucide="rotate-ccw"></i>':'Weiter<i data-lucide="arrow-right"></i>';
  $('#step-list').innerHTML=route.map((item,index)=>`<li><button type="button" data-step="${index}" class="${index===guideIndex?'active':''}"><span>${index+1}</span>${item.name}</button></li>`).join('');
  $('#step-list').querySelectorAll('button').forEach(b=>b.onclick=()=>{guideIndex=Number(b.dataset.step);renderGuide()});icons();
}
function setMode(value){
  mode=value;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.mode===value)));
  ['explore','guide','practice'].forEach(id=>{$(`#${id}-panel`).hidden=id!==value});
  if(value==='guide')renderGuide();else if(value==='explore')select(stations[selected].id);else renderExercise();
  if(model){model.setLabels($('#label-toggle').checked);}
}
function renderExercise(){
  document.querySelectorAll('[data-exercise]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.exercise===exercise)));
  score();
  if(exercise==='speak'){
    $('#exercise').innerHTML=`<p class="section-label">MÜNDLICHE ANTWORT</p><h3 class="question">Erkläre den Weg der Nahrung vom Mund bis zum After.</h3><button id="show-oral" type="button" class="primary full">${oralShown?'Musterantwort ausblenden':'Musterantwort zeigen'}<i data-lucide="${oralShown?'eye-off':'eye'}"></i></button>${oralShown?`<div class="oral-answer">${oralText.map(p=>`<p>${p}</p>`).join('')}</div><div class="check-list"><label><input type="checkbox">Mund, Zunge, Rachen</label><label><input type="checkbox">Kehldeckel, Speiseröhre, Magen</label><label><input type="checkbox">Dünndarm, Dickdarm, Mastdarm, After</label></div><p class="detail-fact">Leber, Gallenblase und Bauchspeicheldrüse helfen bei der Verdauung. Die Nahrung geht nicht durch sie hindurch.</p>`:''}`;
    $('#show-oral').onclick=()=>{oralShown=!oralShown;renderExercise()};icons();return;
  }
  if(questionIndex>=questions.length){
    $('#exercise').innerHTML=`<h3 class="question">Runde abgeschlossen</h3><p class="detail-text">${saved} von ${questions.length} Fragen richtig beantwortet.</p><button type="button" id="restart" class="secondary full"><i data-lucide="rotate-ccw"></i>Noch eine Runde</button>`;
    $('#restart').onclick=()=>{questionIndex=0;answered=false;saved=0;try{localStorage.setItem('anatomie-zass-digestion-practice','0')}catch{}renderExercise()};icons();return;
  }
  const q=questions[questionIndex];
  $('#exercise').innerHTML=`<p class="section-label">FRAGE ${questionIndex+1} / ${questions.length}</p><h3 class="question">${q.q}</h3><div class="answer-options">${q.options.map((o,i)=>`<button type="button" data-answer="${i}">${o}</button>`).join('')}</div><p id="feedback" role="status" aria-live="polite"></p><button id="next-question" type="button" class="primary full" hidden>Weiter<i data-lucide="arrow-right"></i></button>`;
  $('#exercise').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
    if(answered)return;
    const choice=Number(b.dataset.answer);
    if(choice!==q.answer){b.classList.add('wrong');$('#feedback').className='feedback error';$('#feedback').textContent='Noch nicht. Versuch es noch einmal.';return;}
    answered=true;b.classList.add('correct');$('#feedback').className='feedback';$('#feedback').textContent='Richtig.';
    saved=Math.max(saved,questionIndex+1);try{localStorage.setItem('anatomie-zass-digestion-practice',String(saved))}catch{}score();
    $('#exercise').querySelectorAll('[data-answer]').forEach(item=>item.disabled=true);
    $('#next-question').hidden=false;
  });
  $('#next-question').onclick=()=>{questionIndex++;answered=false;renderExercise()};icons();
}
$('#station-picks').innerHTML=stations.map(s=>`<button type="button" data-station="${s.id}" class="${s.helper?'helper':''}" aria-pressed="false">${s.name}</button>`).join('');
$('#station-picks').querySelectorAll('button').forEach(b=>b.onclick=()=>select(b.dataset.station));
try{model=createDigestionScene(select)}catch(error){console.error('Verdauungsmodell konnte nicht geladen werden:',error);$('#scene-loading').hidden=true;$('#fallback').hidden=false;$('#model').hidden=true;$('#labels').hidden=true;$('.visual-controls').hidden=true;}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('.mode-bar').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const modes=['explore','guide','practice'];const current=modes.indexOf(mode);const next=event.key==='Home'?0:event.key==='End'?2:(current+(event.key==='ArrowRight'?1:2))%3;setMode(modes[next]);$(`[data-mode="${modes[next]}"]`).focus()});
$('#station-prev').onclick=()=>select(stations[(selected+stations.length-1)%stations.length].id);
$('#station-next').onclick=()=>select(stations[(selected+1)%stations.length].id);
$('#guide-prev').onclick=()=>{guideIndex=Math.max(0,guideIndex-1);renderGuide()};
$('#guide-next').onclick=()=>{guideIndex=(guideIndex+1)%route.length;renderGuide()};
document.querySelectorAll('[data-exercise]').forEach(b=>b.onclick=()=>{exercise=b.dataset.exercise;answered=false;renderExercise()});
function playIcon(){const playing=model?.playing;$('#play').innerHTML=`<i data-lucide="${playing?'pause':'play'}"></i>`;$('#play').title=playing?'Bewegung pausieren':'Bewegung starten';$('#play').setAttribute('aria-label',$('#play').title);icons()}
$('#play').onclick=()=>{model?.setPlaying(!model.playing);playIcon()};
$('#label-toggle').onchange=e=>model?.setLabels(e.target.checked);
$('#reset-view').onclick=()=>{model?.reset();selected=0;guideIndex=0;$('#label-toggle').checked=true;model?.setLabels(true);setMode('explore')};
const hashes={anschauen:'explore',schritte:'guide',ueben:'practice'};setMode(hashes[location.hash.slice(1)]||'explore');playIcon();score();
window.addEventListener('pagehide',()=>model?.dispose(),{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()});
