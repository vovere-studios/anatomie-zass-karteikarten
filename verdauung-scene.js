import * as THREE from './vendor/three.module.js';

const points = {
  mouth: [0, 3.02, .52], pharynx: [.12, 2.68, .18], epiglottis: [-.19, 2.47, .43],
  esophagus: [.22, 1.66, .04], stomach: [.82, .35, .36], duodenum: [.46, -.45, .37],
  small: [0, -1.38, .35], large: [-1.03, -1.48, .26], rectum: [0, -2.68, .34],
  liver: [-.8, .3, .43], gallbladder: [-.4, -.08, .57], pancreas: [.47, -.36, .55]
};
const labelIds = Object.keys(points);
const names = {mouth:'Mund',pharynx:'Rachen',epiglottis:'Kehldeckel',esophagus:'Speiseröhre',stomach:'Magen',duodenum:'Zwölffingerdarm',small:'Dünndarm',large:'Dickdarm',rectum:'Mastdarm',liver:'Leber',gallbladder:'Gallenblase',pancreas:'Bauchspeicheldrüse'};
const helpers = new Set(['liver','gallbladder','pancreas']);
const V = p => new THREE.Vector3(p[0],p[1],p[2] ?? 0);

export function createDigestionScene(onSelect) {
  const canvas = document.querySelector('#model');
  const box = document.querySelector('#scene');
  const labelLayer = document.querySelector('#labels');
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.setClearColor(0xf7f8f6,0);
  const scene = new THREE.Scene();
  const root = new THREE.Group();scene.add(root);
  const camera = new THREE.OrthographicCamera(-3.5,3.5,3.8,-3.8,.1,100);
  camera.position.set(0,0,12);
  scene.add(new THREE.HemisphereLight(0xffffff,0xc1c7bc,2.4));
  const key = new THREE.DirectionalLight(0xffffff,3);key.position.set(-3,5,7);scene.add(key);
  const rim = new THREE.DirectionalLight(0xb1e1db,1.2);rim.position.set(5,-2,-5);scene.add(rim);
  const pieces = [], clickable = [], labels = new Map(), leaders = new Map();
  const svgNS = 'http://www.w3.org/2000/svg';
  const leadersLayer = document.createElementNS(svgNS,'svg');
  leadersLayer.classList.add('model-leaders');labelLayer.append(leadersLayer);
  const viewSwitch = document.createElement('div');viewSwitch.className='model-views segmented';
  viewSwitch.setAttribute('aria-label','Modellansicht');
  viewSwitch.innerHTML='<button type="button" aria-pressed="true" data-view="all">Gesamtansicht</button><button type="button" aria-pressed="false" data-view="throat">Mund & Rachen</button>';
  box.before(viewSwitch);
  let focusThroat=false;
  viewSwitch.addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;focusThroat=b.dataset.view==='throat';viewSwitch.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));resize();});
  const mat = (color,opts={}) => new THREE.MeshPhysicalMaterial({color,roughness:.52,metalness:0,clearcoat:.25,clearcoatRoughness:.4,...opts});
  function add(mesh,id=null){root.add(mesh);if(id){mesh.userData.station=id;pieces.push({mesh,id});clickable.push(mesh)}return mesh}
  function ellipsoid(position,scale,color,id=null,opts={}){
    const m = new THREE.Mesh(new THREE.SphereGeometry(1,40,28),mat(color,opts));
    m.position.copy(V(position));m.scale.set(...scale);return add(m,id);
  }
  function tube(path,radius,color,id=null,closed=false,opts={}){
    const curve = new THREE.CatmullRomCurve3(path.map(V),closed,'catmullrom',.35);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(32,path.length*7),radius,10,closed),mat(color,opts));
    add(m,id);return {mesh:m,curve};
  }
  function organ(shape,color,id,z=.2,depth=.2){
    const geometry = new THREE.ExtrudeGeometry(shape,{depth:depth*.35,bevelEnabled:true,bevelThickness:.14,bevelSize:.10,bevelSegments:10,curveSegments:32,steps:1});
    geometry.computeVertexNormals();
    const m = new THREE.Mesh(geometry,mat(color,{side:THREE.DoubleSide}));m.position.z=z;return add(m,id);
  }

  // A light contour gives the organs scale without hiding them behind an opaque body.
  ellipsoid([0,2.9,-.75],[.58,.66,.25],'#a8bcb4',null,{transparent:true,opacity:.11,depthWrite:false});
  const outline = [[-.62,2.34,-.8],[-1.52,1.8,-.8],[-1.56,.8,-.8],[-1.3,-.1,-.8],[-1.28,-1.5,-.8],[-.85,-2.62,-.8],[0,-3.05,-.8],[.85,-2.62,-.8],[1.28,-1.5,-.8],[1.3,-.1,-.8],[1.56,.8,-.8],[1.52,1.8,-.8],[.62,2.34,-.8]];
  tube(outline,.016,'#b9c9c1');
  ellipsoid([0,3.04,.54],[.26,.08,.14],'#bd6b67','mouth');
  ellipsoid([0,2.96,.61],[.22,.047,.12],'#dc9a84','mouth');
  ellipsoid([.035,2.91,.36],[.18,.14,.18],'#c6817a','mouth');
  tube([[0,2.94,.42],[.07,2.72,.2],[.16,2.49,.16],[.22,2.34,.08]],.105,'#c6817a','pharynx');
  ellipsoid([-.2,2.45,.47],[.16,.09,.06],'#d7a95b','epiglottis');
  const foodTube = [[.22,2.37,.06],[.22,2.1,.02],[.21,1.65,.02],[.22,1.15,.02],[.31,.75,.03]];
  tube(foodTube,.082,'#c8796b','esophagus');
  tube([[-.18,2.31,.38],[-.16,2.05,.39],[-.14,1.74,.4]],.095,'#91aab4',null,false,{transparent:true,opacity:.65});
  for(let i=0;i<6;i++){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.105,.014,6,22,Math.PI*1.55),mat('#7f9da5',{transparent:true,opacity:.7}));
    ring.position.set(-.15,2.18-i*.075,.43);root.add(ring);
  }

  const liver = new THREE.Shape();
  liver.moveTo(-1.36,.74);liver.bezierCurveTo(-1.45,.53,-1.38,.03,-1.14,-.06);
  liver.bezierCurveTo(-.75,-.22,-.46,.06,-.22,.12);liver.bezierCurveTo(.06,.2,.22,.34,.19,.55);
  liver.bezierCurveTo(-.19,.7,-.84,.84,-1.36,.74);organ(liver,'#8b4650','liver',.14,.25);
  ellipsoid([-.39,-.14,.58],[.15,.25,.10],'#799369','gallbladder');
  tube([[-.36,-.28,.59],[-.2,-.48,.52],[.34,-.61,.35]],.022,'#7d9564');
  const stomach = new THREE.Shape();
  stomach.moveTo(.32,.76);stomach.bezierCurveTo(.7,.87,1.15,.72,1.22,.34);
  stomach.bezierCurveTo(1.3,-.04,1.08,-.49,.69,-.59);
  stomach.bezierCurveTo(.42,-.64,.28,-.47,.28,-.28);
  stomach.bezierCurveTo(.57,-.04,.54,.36,.32,.76);organ(stomach,'#b76e5c','stomach',.23,.31);
  ellipsoid([.52,-.32,.62],[.56,.13,.15],'#d6ab76','pancreas');
  const duodenum = [[.65,-.5,.43],[.5,-.62,.42],[.34,-.59,.43],[.32,-.42,.45],[.46,-.37,.45]];
  tube(duodenum,.07,'#c79678','duodenum');

  // Uneven, continuous loops show a coiled intestine, not stacked straight rows.
  const bowel = [[.46,-.43,.44],[.57,-.77,.41], [.29,-.89,.39],[-.12,-.78,.4],[-.55,-.88,.36],[-.66,-1.13,.38],[-.4,-1.25,.46],[-.12,-1.08,.49],[.23,-1.06,.45],[.59,-1.15,.4],[.55,-1.38,.44],[.22,-1.43,.51],[-.12,-1.32,.5],[-.4,-1.49,.43],[-.66,-1.45,.37],[-.65,-1.73,.39],[-.37,-1.88,.44],[-.12,-1.72,.52],[.13,-1.6,.49],[.52,-1.67,.41],[.55,-1.91,.41],[.28,-2.06,.45],[-.05,-1.96,.49],[-.31,-2.13,.43]];
  bowel.push([-.72,-2.11,.31],[-.93,-2.21,.29]);
  tube(bowel,.085,'#d3987d','small');
  const colon=[[-.93,-2.21,.28],[-1.08,-1.86,.3],[-1.09,-1.25,.32],[-1.08,-.8,.32],[-.9,-.61,.32],[-.43,-.57,.32],[.15,-.58,.32],[.72,-.6,.32],[1.04,-.73,.3],[1.08,-1.25,.3],[1.04,-1.88,.29],[.78,-2.21,.31],[.34,-2.4,.31],[.08,-2.55,.31]];
  const colonTube=tube(colon,.125,'#ab7883','large');
  for(let i=0;i<37;i++){
    const p=colonTube.curve.getPointAt(i/37);
    const lobe=ellipsoid(p.toArray(),[.151,.145,.15],'#bc8a93','large');
    lobe.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),colonTube.curve.getTangentAt(i/37));
  }
  tube([[.08,-2.55,.32],[.02,-2.72,.33],[0,-2.93,.34]],.115,'#a26f75','rectum');
  ellipsoid([0,-2.98,.36],[.12,.05,.12],'#84575e','rectum');

  const foodPath = new THREE.CatmullRomCurve3([
    V([0,3.03,.62]),V([.08,2.73,.28]),V([.2,2.37,.12]),...foodTube.slice(1).map(V),
    V([.62,.51,.53]),V([.85,.2,.59]),V([.79,-.25,.58]),...bowel.map(V),...colon.slice(1).map(V),
    V([0,-2.75,.36]),V([0,-2.96,.36])
  ],false,'centripetal');
  const route = new THREE.Mesh(new THREE.TubeGeometry(foodPath,260,.018,6,false),mat('#ecb594',{transparent:true,opacity:.55,emissive:'#9f4f3f',emissiveIntensity:.17}));root.add(route);
  const bolus = new THREE.Mesh(new THREE.SphereGeometry(.052,18,12),mat('#fce0b8',{emissive:'#ee9b65',emissiveIntensity:.8}));root.add(bolus);

  labelIds.forEach(id=>{
    const button=document.createElement('button');button.type='button';button.className=`model-label${helpers.has(id)?' helper':''}`;
    button.textContent=names[id];button.title=names[id];button.setAttribute('aria-label',`${names[id]} auswählen`);
    button.onclick=()=>onSelect(id);labelLayer.append(button);labels.set(id,button);
    const line=document.createElementNS(svgNS,'path');leadersLayer.append(line);leaders.set(id,line);
  });
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  let down=null,yaw=0,targetYaw=0,active='mouth',showLabels=true,running=true,t=0,last=performance.now(),frame=0;
  function pick(clientX,clientY){
    const rect=canvas.getBoundingClientRect();pointer.set(((clientX-rect.left)/rect.width)*2-1,-((clientY-rect.top)/rect.height)*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(clickable,false)[0];if(hit?.object.userData.station)onSelect(hit.object.userData.station);
  }
  canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,angle:targetYaw};canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x;if(Math.abs(dx)>4)targetYaw=Math.max(-.62,Math.min(.62,down.angle+dx/260))});
  canvas.addEventListener('pointerup',e=>{if(down&&Math.abs(e.clientX-down.x)<7&&Math.abs(e.clientY-down.y)<7)pick(e.clientX,e.clientY);down=null});
  canvas.addEventListener('pointercancel',()=>down=null);
  function resize(){
    const w=box.clientWidth,h=box.clientHeight;
    renderer.setSize(w,h,false);
    const visibleHeight=focusThroat?2.4:7.6;
    camera.position.y=focusThroat?2.45:0;
    camera.left=-visibleHeight*w/h/2;camera.right=-camera.left;camera.top=visibleHeight/2;camera.bottom=-visibleHeight/2;camera.updateProjectionMatrix();
  }
  function projectLabels(){
    root.updateMatrixWorld();const w=box.clientWidth,h=box.clientHeight;
    const slots={mouth:[0,.10],pharynx:[1,.17],epiglottis:[0,.25],esophagus:[1,.34],liver:[0,.43],stomach:[1,.46],gallbladder:[0,.53],pancreas:[1,.57],duodenum:[0,.63],small:[1,.70],large:[0,.78],rectum:[1,.90]};
    const throatSlots={mouth:[0,.18],pharynx:[1,.38],epiglottis:[0,.55],esophagus:[1,.78]};
    leadersLayer.setAttribute('viewBox',`0 0 ${w} ${h}`);
    labels.forEach((button,id)=>{
      const pt=root.localToWorld(V(points[id])).project(camera);
      const x=(pt.x+1)*.5*w,y=(1-pt.y)*.5*h;
      const slot=(focusThroat?throatSlots:slots)[id];
      button.hidden=!showLabels||!slot;
      const line=leaders.get(id);line.style.display=button.hidden?'none':'';
      if(!slot)return;
      const [side,vertical]=slot,by=h*vertical;
      button.style.left=side?'auto':'4px';button.style.right=side?'4px':'auto';button.style.top=`${by}px`;
      const edge=side?w-4-button.offsetWidth:4+button.offsetWidth;
      line.setAttribute('d',`M ${edge} ${by} L ${side?edge-10:edge+10} ${by} L ${x} ${y}`);
      line.classList.toggle('active',id===active);
    });
  }
  function animate(now){
    frame=requestAnimationFrame(animate);
    const dt=Math.max(0,Math.min((now-last)/1000,.05));last=now;
    if(running)t=(t+dt*.048)%1;
    bolus.position.copy(foodPath.getPointAt(t));
    yaw+=(targetYaw-yaw)*.1;root.rotation.y=yaw;
    pieces.forEach(({mesh,id})=>{
      mesh.material.emissive?.set(id===active?'#55451e':'#000000');
      mesh.material.emissiveIntensity = id === active ? 0.18 : 0;
    });
    projectLabels();renderer.render(scene,camera);
  }
  resize();frame=requestAnimationFrame(animate);document.querySelector('#scene-loading').hidden=true;
  window.addEventListener('resize',resize);
  return {
    select(id){active=id;if(focusThroat&&!['mouth','pharynx','epiglottis','esophagus'].includes(id)){focusThroat=false;viewSwitch.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='all')));resize();}labels.forEach((b,key)=>b.classList.toggle('active',key===id));},
    setLabels(value){showLabels=value;},
    setPlaying(value){running=value;},get playing(){return running;},
    reset(){targetYaw=0;t=0;active='mouth';focusThroat=false;viewSwitch.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='all')));resize();},
    dispose(){cancelAnimationFrame(frame);window.removeEventListener('resize',resize);renderer.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose())}})}
  };
}
