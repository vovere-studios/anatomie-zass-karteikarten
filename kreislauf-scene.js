import * as THREE from './vendor/three.module.js';
import { stations, valves } from './kreislauf-data.js';

export function createScene(onSelect) {
  const container = document.querySelector('#scene');
  const canvas = document.querySelector('#model');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xf6f7f9, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3,3,3.5,-3.5,.1,100);
  camera.position.set(0,0,12);
  const ambient = new THREE.HemisphereLight(0xffffff,0x748496,2.1);scene.add(ambient);
  const light = new THREE.DirectionalLight(0xffffff,2.5);light.position.set(-3,5,8);scene.add(light);
  const fill = new THREE.DirectionalLight(0xffd8c9,1.0);fill.position.set(4,-1,4);scene.add(fill);
  const red = new THREE.Color('#cc3c52'), blue = new THREE.Color('#347bc0');
  const parts=[], paths=[], beats=[], valveMeshes=[], clickable=[];
  const v = a => new THREE.Vector3(a[0],a[1],a[2]??0);
  const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.42,metalness:.06,...extra});
  const register=(mesh,id,circuit)=>{scene.add(mesh);parts.push({mesh,id,circuit});mesh.userData.id=id;if(id)clickable.push(mesh);return mesh;};
  function ellipsoid(pos,scale,color,id,circuit,extra={}){
    const m=new THREE.Mesh(new THREE.SphereGeometry(1,40,32),material(color,extra));m.position.copy(v(pos));m.scale.set(...scale);register(m,id,circuit);return m;
  }
  function tube(points,color,id,circuit,radius=.072,animated=true,endColor=null){
    const curve=new THREE.CatmullRomCurve3(points.map(v),false,'catmullrom',.38);
    const geometry=new THREE.TubeGeometry(curve,64,radius,8,false);
    if(endColor){const cols=[];const base=new THREE.Color(color),end=new THREE.Color(endColor);for(let i=0;i<=64;i++){const c=base.clone().lerp(end,i/64);for(let j=0;j<=8;j++)cols.push(c.r,c.g,c.b)}geometry.setAttribute('color',new THREE.Float32BufferAttribute(cols,3))}
    const m=new THREE.Mesh(geometry,material(endColor?0xffffff:color,{vertexColors:!!endColor}));register(m,id,circuit);
    if(radius>.06){const arrow=new THREE.Mesh(new THREE.ConeGeometry(radius*.7,radius*1.8,12),new THREE.MeshBasicMaterial({color:0xfff7e8}));arrow.position.copy(curve.getPointAt(.48));arrow.position.z+=radius*1.08;arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),curve.getTangentAt(.48));register(arrow,id,circuit);}
    if(animated){const particles=[];const count=Math.max(3,Math.round(curve.getLength()*1.8));for(let i=0;i<count;i++){const bead=new THREE.Mesh(new THREE.SphereGeometry(Math.max(.025,radius*.38),8,6),new THREE.MeshBasicMaterial({color:0xfff7e8}));scene.add(bead);particles.push(bead)}paths.push({curve,particles,id,circuit,radius,length:curve.getLength()})}
    return m;
  }
  // Schematic cutaway: anatomical right is on the viewer's left.
  const shape=new THREE.Shape();shape.moveTo(-1.05,.6);shape.bezierCurveTo(-1.1,1.1,-.25,1.05,0,.73);shape.bezierCurveTo(.7,1.2,1.25,.8,1.12,.03);shape.bezierCurveTo(1.06,-.95,.62,-1.46,.38,-1.58);shape.bezierCurveTo(-.04,-1.63,-1.3,-.85,-1.18,-.1);shape.bezierCurveTo(-1.16,.1,-1.12,.4,-1.05,.6);
  const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.22,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.09,bevelThickness:.09,curveSegments:32}),material('#a95b68'));shell.position.z=-.22;scene.add(shell);beats.push(shell);
  ellipsoid([-.55,.39,.24],[.47,.42,.22],'#9bc6e4','ra','body');
  ellipsoid([.53,.39,.24],[.43,.39,.22],'#ef9b9e','la','lung');
  const rv=ellipsoid([-.54,-.64,.18],[.45,.67,.23],'#8cbee0','rv','lung');rv.rotation.z=.18;
  const lv=ellipsoid([.52,-.65,.19],[.41,.7,.24],'#ed8c95','lv','body');lv.rotation.z=-.15;
  // Main vessel routes retain separation at crossings by using different depths.
  tube([[.55,-.7,.5],[.38,-.25,.58],[.24,.94,.63],[1.37,1.16,.6],[2.15,.62,.3],[2.32,-1.55,.1],[1.18,-2.58,.1]],red,'aorta','body',.105);
  tube([[-1.18,-2.58,.1],[-2.32,-1.55,.1],[-2.32,.3,.1],[-1.65,.83,.18],[-.6,.4,.5]],blue,'veins','body',.12);
  tube([[-.59,.34,.5],[-.59,-.18,.5],[-.57,-.74,.5]],blue,'rv','lung',.062);
  tube([[.56,.32,.5],[.57,-.18,.5],[.54,-.73,.5]],red,'lv','body',.062);
  tube([[-.58,-.65,.54],[-1.06,.06,.58],[-1.76,1.15,.25],[-.8,1.66,-.1]],blue,'pa','lung',.09);
  for(const side of [-1,1]){
    const x=side*1.05;
    const lung=ellipsoid([x,2.3,-.25],[.74,.74,.19],'#d1e1df','lungs','lung',{roughness:.8});lung.rotation.z=-side*.12;
    tube([[0,3.01,-.15],[0,2.62,-.15],[side*.45,2.3,-.15],[x,2.12,-.1]],'#a7baba',null,'lung',.054,false);
    tube([[-.8,1.66,-.1],[side*.56,1.77,-.1],[x-side*.37,1.99,.04]],blue,'pa','lung',.068);
    for(let j=0;j<6;j++){
      const offset=(j-2.5)*.115;
      tube([[x-side*.37,1.99,.06],[x-side*.48,2.38+offset,.04],[x,2.77+offset*.3,.03],[x+side*.48,2.4+offset,.04],[x+side*.34,2.01,.08]],blue,'lungs','lung',.025,true,red);
    }
    tube([[x+side*.34,2.01,.1],[side*1.63,1.68,.3],[.88,1.04,.43],[.56,.4,.5]],red,'pv','lung',.07);
  }
  // A parallel capillary bed, not a direct artery-to-vein shortcut.
  for(let j=0;j<8;j++){
    const y=-2.57+(j-3.5)*.115;
    tube([[1.18,-2.58,.1],[.72,y,.1],[.28,y+.035,.1],[-.28,y-.035,.1],[-.72,y,.1],[-1.18,-2.58,.1]],red,'body','body',.025,true,blue);
  }
  // Pale tissue behind the body capillary bed gives depth without hiding the vessels.
  ellipsoid([0,-2.58,-.22],[1.54,.63,.12],'#e2ddd9',null,'body',{roughness:1});
  for(const valve of valves){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.1,.027,8,28),material('#f4ddad'));ring.position.copy(v(valve.position));register(ring,valve.id,valve.circuit);ring.visible=false;valveMeshes.push(ring);
  }
  const labelLayer=document.querySelector('#labels');
  const labels=[...stations,...valves].map((data,i)=>{
    const button=document.createElement('button');button.type='button';button.className='model-label'+(i>=stations.length?' valve':'');button.textContent=data.short||data.name;button.dataset.id=data.id;button.setAttribute('aria-label',data.name);button.addEventListener('click',()=>onSelect(data.id));labelLayer.append(button);return {data,button,index:i};
  });
  const lungsTitle=document.createElement('span');lungsTitle.className='label-title';lungsTitle.textContent='LUNGE';labelLayer.append(lungsTitle);
  const focusRing=new THREE.Mesh(new THREE.TorusGeometry(.16,.019,8,48),new THREE.MeshBasicMaterial({color:0x0a6f68}));scene.add(focusRing);
  let active='lv',circuit='all',labelMode=true,showValves=false,practice=false,running=!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=.65,elapsed=0,last=0,needsRender=true,frame;
  function refresh(){
    const focus=[...stations,...valves].find(s=>s.id===active);focusRing.visible=!!focus&&!practice;if(focus){focusRing.position.copy(v(focus.position));focusRing.position.z=1;}
    for(const path of paths)for(const bead of path.particles){bead.material.color.set(path.id===active&&!practice?0xffda77:0xfff7e8);bead.scale.setScalar(path.id===active&&!practice?1.3:1);}
    for(const p of parts){const faded=circuit!=='all'&&p.circuit!==circuit; p.mesh.material.transparent=faded;p.mesh.material.opacity=faded?.18:1;if(p.mesh.material.emissive)p.mesh.material.emissive.set(p.id===active?'#164f4a':'#000000');p.mesh.material.emissiveIntensity=p.id===active?.18:0;}
    for(const m of valveMeshes)m.visible=showValves;
    for(const l of labels){const isValve=l.index>=stations.length;l.button.hidden=isValve?(!showValves||!labelMode):(!labelMode&&!practice)||(showValves&&!['lungs','body'].includes(l.data.id));l.button.classList.toggle('active',l.data.id===active&&!practice);l.button.classList.toggle('faded',circuit!=='all'&&l.data.circuit!==circuit);l.button.classList.toggle('numbered',practice);l.button.textContent=practice?String(l.index+1).padStart(2,'0'):(l.data.short||l.data.name);l.button.setAttribute('aria-label',practice?`Station ${l.index+1}`:l.data.name);}
    needsRender=true;
  }
  const projected=new THREE.Vector3();
  function resize(){const w=container.clientWidth,h=container.clientHeight,aspect=w/h;const halfH=Math.max(3.55,3.05/aspect);camera.left=-halfH*aspect;camera.right=halfH*aspect;camera.top=halfH;camera.bottom=-halfH;camera.updateProjectionMatrix();renderer.setSize(w,h,false);for(const l of labels){projected.set(l.data.label[0],l.data.label[1],1).project(camera);l.button.style.left=`${(projected.x*.5+.5)*w}px`;l.button.style.top=`${(-projected.y*.5+.5)*h}px`;}projected.set(0,2.36,1).project(camera);lungsTitle.style.left=`${(projected.x*.5+.5)*w}px`;lungsTitle.style.top=`${(-projected.y*.5+.5)*h}px`;needsRender=true;}
  const observer=new ResizeObserver(resize);observer.observe(container);resize();refresh();
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let pointerDown;
  canvas.addEventListener('pointerdown',e=>{pointerDown=[e.clientX,e.clientY]});
  canvas.addEventListener('pointerup',e=>{if(!pointerDown||Math.hypot(e.clientX-pointerDown[0],e.clientY-pointerDown[1])>8)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable.filter(m=>m.visible))[0];if(hit)onSelect(hit.object.userData.id);pointerDown=null;});
  function tick(ms){frame=requestAnimationFrame(tick);const dt=last?Math.min((ms-last)/1000,.05):0;last=ms;if(document.hidden)return;if(running){elapsed+=dt*speed;needsRender=true;}if(!needsRender)return;
    for(const path of paths){const faded=circuit!=='all'&&path.circuit!==circuit;for(let i=0;i<path.particles.length;i++){const bead=path.particles[i];bead.visible=!faded;const t=(elapsed*.6/path.length+i/path.particles.length)%1;bead.position.copy(path.curve.getPointAt(t));bead.position.z+=path.radius*1.08;}}
    const pulse=1+Math.pow(Math.max(0,Math.sin(elapsed*6)),8)*.017;for(const mesh of beats)mesh.scale.set(pulse,pulse,1);
    renderer.render(scene,camera);needsRender=false;
  }
  frame=requestAnimationFrame(tick);document.querySelector('#scene-loading').hidden=true;
  return {get running(){return running},setRunning(value){running=value;needsRender=true},setSpeed(value){speed=value},setSelection(id){active=id;refresh()},setCircuit(value){circuit=value;refresh()},setLabels(value){labelMode=value;refresh()},setValves(value){showValves=value;refresh()},setPractice(value){practice=value;showValves=false;refresh()},reset(){resize()},dispose(){cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();}};
}
