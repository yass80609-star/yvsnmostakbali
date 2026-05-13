import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

const Bar = ({ position, height, color, delay }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        height + Math.sin(time * 2 + delay) * 0.2,
        0.1
      );
      mesh.current.position.y = mesh.current.scale.y / 2;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.5}
        transparent 
        opacity={0.8} 
      />
    </mesh>
  );
};

const GraphLines = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 20; i++) {
      p.push(new THREE.Vector3(i * 0.8 - 8, Math.random() * 3, Math.random() * 2 - 1));
    }
    return p;
  }, []);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#00C853" linewidth={2} />
    </line>
  );
};

const FloatingParticles = () => {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00C853" transparent opacity={0.4} />
    </points>
  );
};

const Scene = () => {
  const bars = useMemo(() => {
    const b = [];
    for (let i = 0; i < 12; i++) {
      b.push({
        position: [i * 1.2 - 6, 0, 0],
        height: 2 + Math.random() * 4,
        color: i % 2 === 0 ? '#00C853' : '#00B359',
        delay: i * 0.5
      });
    }
    return b;
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 12]} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 3.5}
      />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00C853" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

      <group position={[0, -2, 0]}>
        {/* Grid helper for that techy look */}
        <gridHelper args={[20, 20, '#00B359', '#051a05']} position={[0, -0.01, 0]} />
        
        {bars.map((bar, i) => (
          <Bar key={i} {...bar} />
        ))}
        
        <GraphLines />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[0, 6, -2]}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial
              color="#00C853"
              speed={2}
              distort={0.4}
              radius={1}
            />
          </mesh>
        </Float>

        <Text
          position={[0, 8, -5]}
          fontSize={1.5}
          color="#00C853"
          font="https://fonts.gstatic.com/s/syne/v18/8vIX7w8mE_H-FpX67Vf2.woff"
          anchorX="center"
          anchorY="middle"
        >
          DONNÉES DU MARCHÉ
        </Text>
      </group>

      <FloatingParticles />
    </>
  );
};

const Finance3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  );
};

export default Finance3D;
