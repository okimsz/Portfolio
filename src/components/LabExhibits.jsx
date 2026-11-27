import { Suspense } from 'react';
import { Html, Line, useTexture } from '@react-three/drei';
import { Box } from './Primitives';
import InteractiveObject from './InteractiveObject';

export function PhotoSurface({src,size,position,rotation=[0,0,0]}) {
  const texture=useTexture(src);
  return <mesh position={position} rotation={rotation}><planeGeometry args={size}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
function Annotation({position,children}){const [label,detail]=children.split(' / ');return <Html portal={{current:document.querySelector('.scene-container')}} position={position} center zIndexRange={[4,1]} style={{pointerEvents:'none'}}><span className="lab-annotation"><strong>{label}</strong><span> / {detail}</span></span></Html>}
export default function LabExhibits({lab,onSelect}) {
  return <group>
    <InteractiveObject position={[.8,1.17,-1.58]} label="Inside the chip · Xinyx" tooltip={[0,.5,0]} onClick={()=>onSelect('chip')}>
      <Box size={[.45,.07,.4]} color="#384f49"/>
      <Box position={[0,.05,0]} size={[.29,.025,.26]} color="#839686"/>
      {[-1,1].flatMap(s=>Array.from({length:5},(_,i)=><Box key={`${s}-${i}`} position={[s*.26,0,(i-2)*.07]} size={[.12,.025,.035]} color="#c9bc83"/>))}
    </InteractiveObject>
    <InteractiveObject position={[-2.18,1.15,-1.82]} label="My Xinyx scrapbook" tooltip={[0,.6,0]} onClick={()=>onSelect('scrapbook')}>
      <Box size={[.58,.07,.43]} color="#a97757" rotation={[0,.12,0]}/>
      <Suspense fallback={null}><PhotoSurface src="/photos/xinyx-completion.jpg" size={[.48,.36]} position={[0,.041,0]} rotation={[-Math.PI/2,0,0]}/></Suspense>
    </InteractiveObject>
    {lab&&<group>
      {[0,.15,.3].map((offset,i)=><Line key={i} points={[[-2.35,1.13,-1.5+offset],[-1.6,1.13,-1.5+offset],[-1.4,1.13,-1.65+offset],[.8,1.13,-1.65+offset]]} color="#55c8b4" lineWidth={1.5}/>)}
      {[[-.85,1.05,-1.9,3.25,.15,1.2],[2.55,.64,1.8,.65,.15,1.85]].map(([x,y,z,w,h,d],i)=><mesh key={i} position={[x,y,z]}><boxGeometry args={[w,h,d]}/><meshBasicMaterial wireframe color="#63c8b9" transparent opacity={.65}/></mesh>)}
      <Annotation position={[-.8,2.5,-1.8]}>SOFTWARE / Interfaces & connected data</Annotation>
      <Annotation position={[1,1.8,-1.2]}>SILICON / Layout & verification</Annotation>
      <Annotation position={[2.5,1.6,1.8]}>EXPERIMENT / Change a variable</Annotation>
      <pointLight position={[0,1.5,-1]} color="#72dcca" intensity={.7} distance={4}/>
    </group>}
  </group>;
}
