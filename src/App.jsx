import {MotionContext} from './motion';
import {Component,Suspense,useCallback,useRef,useState,useEffect} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {OrbitControls,ContactShadows,Html} from '@react-three/drei';
import {Vector3} from 'three';
import {Sun,Moon,Volume2,VolumeX,RotateCcw,MousePointer2,Monitor,GraduationCap,Code2,BookOpen,Mail,Move,Heart,FlaskConical,Accessibility,Play} from 'lucide-react';
import Room from './components/Room';
import PortfolioModal from './components/PortfolioModal';
import GuidedTour,{tourStops} from './components/GuidedTour';
import {profile} from './data';
const navigation=[['projects','Projects',Monitor],['playground','Playground',FlaskConical],['education','Achievements',GraduationCap],['skills','Skills',Code2],['about','About me',BookOpen],['contact','Contact',Mail]];
function CameraRig({section,reset,reduced}){
 const controls=useRef();const {camera,size}=useThree();const animating=useRef(true);const goal=useRef({zoom:70,target:new Vector3(0,1,0)});
 useEffect(()=>{const targets={projects:[-.7,1,-1],playground:[1.8,.7,1.3],education:[-1.2,1,.4],skills:[.7,1,-1],about:[-.7,1,-.8],contact:[0,.5,.7],guardian:[.15,.6,1.25],chip:[.8,1.1,-1.5],scrapbook:[-2,1.1,-1.8]};goal.current={zoom:Math.min(size.width/11.7,size.height/8.7)*(section?1.12:1),target:new Vector3(...(targets[section]||[0,1,0]))};animating.current=true},[section,reset,size,reduced]);
 useFrame((_,dt)=>{if(!controls.current||!animating.current)return;const a=reduced?1:1-Math.exp(-4*dt);camera.zoom+=(goal.current.zoom-camera.zoom)*a;camera.updateProjectionMatrix();controls.current.target.lerp(goal.current.target,a);controls.current.update();if(Math.abs(camera.zoom-goal.current.zoom)<.02&&controls.current.target.distanceTo(goal.current.target)<.002)animating.current=false});
 useEffect(()=>{camera.position.set(9,8.5,11)},[reset,camera]);return <OrbitControls ref={controls} makeDefault enablePan={false} enableDamping={!reduced} dampingFactor={.08} minPolarAngle={Math.PI/5} maxPolarAngle={Math.PI/2.7} minAzimuthAngle={.15} maxAzimuthAngle={1.3} minZoom={Math.min(size.width/14,size.height/11)} maxZoom={Math.min(size.width/7,size.height/5)} onStart={()=>animating.current=false}/>;
}
class SceneBoundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<div className="scene-fallback"><Monitor size={40}/><h2>Your portfolio is right here.</h2><p>3D isn’t available in this browser. Use the navigation below to explore every section.</p></div>:this.props.children}}
export default function App(){
 const [night,setNight]=useState(false),[sound,setSound]=useState(false),[section,setSection]=useState(null),[reset,setReset]=useState(0),[lab,setLab]=useState(false);
 const [systemReduced,setSystemReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches),[motionOverride,setMotionOverride]=useState(null);
 const reduced=motionOverride??systemReduced;
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setSystemReduced(query.matches);query.addEventListener('change',changed);return()=>query.removeEventListener('change',changed)},[]);
 const [selectedExperiment,setSelectedExperiment]=useState(null),[tour,setTour]=useState(null),[chooseTour,setChooseTour]=useState(false);
 const selectSection=useCallback((next,id=null)=>{setTour(null);setChooseTour(false);setSelectedExperiment(id);setSection(next)},[]);
 const close=useCallback(()=>setSection(null),[]);const endTour=useCallback(()=>setTour(null),[]);
 const startTour=route=>{close();setChooseTour(false);setTour({route,index:0,paused:reduced})};
 const cameraTarget=section||(tour?tourStops[tour.route][tour.index].target:null);
 return <MotionContext.Provider value={reduced}><main className={['app',night?'night':'',lab?'lab-mode':'',reduced?'reduced-motion':'',tour?'tour-active':''].join(' ')}>
  <header className="site-header"><a className="identity" href="#" onClick={e=>{e.preventDefault();close();endTour();setReset(x=>x+1)}}><span className="identity-mark">{profile.initials.toLowerCase()}<span>✦</span></span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></a><div className="header-controls"><span className="availability"><i/>Open to opportunities</span><div className="toggle-group">
   <button className="icon-button" aria-label={sound?'Mute cat sounds':'Enable cat sounds'} aria-pressed={sound} onClick={()=>setSound(!sound)}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
   <button className="icon-button" aria-label="Reduce motion" title="Reduce motion" aria-pressed={reduced} onClick={()=>setMotionOverride(!reduced)}><Accessibility size={18}/></button>
   <button className="theme-button lab-toggle" aria-label="Lab mode" aria-pressed={lab} onClick={()=>setLab(!lab)}><FlaskConical size={17}/><span>{lab?'Lab on':'Lab mode'}</span></button>
   <span className="control-divider"/><button className="theme-button" onClick={()=>setNight(!night)} aria-pressed={night}>{night?<Moon size={17}/>:<Sun size={18}/>}<span>{night?'Night':'Day'} mode</span></button>
  </div></div></header>
  <div className="intro"><p className="eyebrow"><span/> MICO’S LIVING ENGINEERING LAB</p><h1>A space to create.<br/>A world to <em>explore.</em></h1><p>I connect software, hardware,<br className="desktop-break"/> and a little imagination. Come on in.</p><span className="explore-note"><MousePointer2 size={15}/> Click around. Make yourself at home.</span><button className="tour-start" aria-expanded={chooseTour} onClick={()=>setChooseTour(!chooseTour)}><Play size={15}/> Take a 60-second tour</button>
  {chooseTour&&<div className="tour-picker"><p>What are you curious about?</p>{[['software','Software'],['hardware','Hardware'],['all','Explore everything']].map(([id,label])=><button key={id} onClick={()=>startTour(id)}>{label}</button>)}<button onClick={()=>setChooseTour(false)}>Keep exploring freely</button></div>}</div>
  <div className="scene-container" aria-label="Interactive engineering room. Drag to rotate, scroll to zoom. Navigation below provides keyboard access."><SceneBoundary><Canvas orthographic shadows camera={{position:[9,8.5,11],zoom:70,near:.1,far:60}} dpr={[1,1.7]} gl={{antialias:true,alpha:true}}><ambientLight intensity={night?.4:1.3} color={night?'#a6b1d6':'#fff0da'}/><directionalLight position={[-3,8,5]} intensity={night?.55:2.5} color={night?'#a4b7ee':'#ffe2b0'} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} shadow-normalBias={.035}/><pointLight position={[-1,2,-2]} intensity={night?3:.3} color='#f4b96c' distance={5}/><Suspense fallback={<Html center><div className="object-tooltip">Making room for you…</div></Html>}><Room night={night} onSelect={selectSection} sound={sound} lab={lab} reduced={reduced}/><ContactShadows position={[0,-.36,0]} opacity={.28} scale={14} blur={2.8} far={7} resolution={256} color='#644b33' frames={1}/></Suspense><CameraRig section={cameraTarget} reset={reset} reduced={reduced}/></Canvas></SceneBoundary></div>
  {tour&&<GuidedTour tour={tour} setTour={setTour} onOpen={selectSection} onEnd={endTour} reduced={reduced}/>}
  <div className="room-caption"><span className="caption-line"/><span>A few of my favorite things.<small>Every object has a story.</small></span></div><button className="reset-button" onClick={()=>{close();endTour();setReset(x=>x+1)}}><RotateCcw size={16}/><span>Reset view</span></button>
  <footer><div className="exhibit-shortcuts" aria-label="Engineering exhibits"><button onClick={()=>selectSection('guardian')}>Smart collar</button><button onClick={()=>selectSection('chip')}>Inside the chip</button><button onClick={()=>selectSection('scrapbook')}>Scrapbook</button></div><div className="interaction-hint"><Move size={15}/><span>Drag to rotate <b>·</b> Scroll to zoom</span></div><nav aria-label="Portfolio sections" className="bottom-nav">{navigation.map(([id,label,Icon])=><button key={id} onClick={()=>selectSection(id)} className={section===id?'active':''} aria-haspopup="dialog"><Icon size={19}/><span>{label}</span></button>)}</nav><p className="footer-note">Made with curiosity <Heart size={12}/></p></footer>
  {section&&<PortfolioModal key={section} section={section} onClose={close} initialProject={selectedExperiment} onSelect={selectSection}/>}
 </main></MotionContext.Provider>;
}

