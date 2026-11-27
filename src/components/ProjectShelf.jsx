import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from './Primitives';
import InteractiveObject from './InteractiveObject';

function MiniFridge() {
  const door = useRef();
  const [hover, setHover] = useState(false);
  useFrame((_, dt) => { door.current.rotation.y += ((hover ? -.65 : 0) - door.current.rotation.y) * (1 - Math.exp(-7 * dt)); });
  return <group onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
    <Box position={[0,.27,0]} size={[.35,.54,.3]} color="#83a69c" />
    <Box position={[0,.28,.157]} size={[.3,.47,.015]} color="#e8e7d8" />
    <group ref={door} position={[-.175,0,.17]}>
      <Box position={[.175,.27,0]} size={[.35,.54,.035]} color="#a8c3b6" />
      <Box position={[.175,.37,.02]} size={[.35,.012,.006]} color="#728c7c" />
      <Box position={[.29,.26,.04]} size={[.025,.15,.025]} color="#e9dfc5" />
    </group>
  </group>;
}

function MiniHouse() {
  return <group>
    <Box position={[0,.15,0]} size={[.4,.3,.34]} color="#e2cfaa" />
    {[-1,1].map(s => <Box key={s} position={[s*.11,.37,0]} rotation={[0,0,s*-.6]} size={[.29,.055,.43]} color="#ac7754" />)}
    <Box position={[-.09,.17,.178]} size={[.1,.1,.02]} color="#8aa9a1" />
    <Box position={[.09,.1,.178]} size={[.09,.2,.02]} color="#8a7257" />
    <Box position={[.11,.4,.08]} size={[.29,.018,.15]} rotation={[0,0,-.6]} color="#e5c886" />
  </group>;
}

function MiniSolar() {
  return <group>
    <Box position={[0,.12,.03]} size={[.4,.04,.38]} rotation={[-.5,0,0]} color="#526f7c" />
    {[-.13,0,.13].map(x => <Box key={x} position={[x,.15,.03]} size={[.015,.015,.34]} rotation={[-.5,0,0]} color="#b2c4bc" />)}
    <Cylinder position={[0,.32,-.14]} args={[.085,.085,.44,16]} rotation={[0,0,Math.PI/2]} color="#d8d9c8" />
    <Cylinder position={[.2,.19,-.14]} args={[.014,.014,.23,8]} color="#be8b5f" />
  </group>;
}

export default function ProjectShelf({ onSelect }) {
  return <group position={[2.55,0,1.8]} rotation={[0,Math.PI/2,0]}>
    <Box position={[0,.64,0]} size={[1.8,.1,.62]} color="#b78961" />
    {[-.76,.76].map(x => <Box key={x} position={[x,.32,0]} size={[.08,.6,.48]} color="#68765b" />)}
    <Box position={[0,.22,0]} size={[1.65,.06,.5]} color="#b78961" />
    {[['refrigerator','Hearth · Refrigerator',MiniFridge],['roof-panels','Shelter · Roof explorer',MiniHouse],['solar-water-heater','Solaris · Water heater',MiniSolar]].map(([id,label,Model], i) =>
      <InteractiveObject key={id} label={label} position={[(i-1)*.57,.7,0]} tooltip={[0,.85,0]} onClick={() => onSelect('playground',id)}>
        <Box position={[0,.015,0]} size={[.51,.035,.48]} color="#e8dec6" /><Model />
      </InteractiveObject>
    )}
  </group>;
}
