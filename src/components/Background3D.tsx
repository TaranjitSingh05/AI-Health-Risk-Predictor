import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSpheres() {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.x += 0.001;
      group.current.rotation.y += 0.002;
      group.current.position.x += (mouse.current.x * 0.5 - group.current.position.x) * 0.1;
      group.current.position.y += (mouse.current.y * 0.5 - group.current.position.y) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 50 }).map((_, i) => (
        <Sphere key={i} args={[0.1, 16, 16]} position={[
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        ]}>
          <meshPhongMaterial
            color={new THREE.Color().setHSL(Math.random(), 0.7, 0.7)}
            transparent
            opacity={0.6}
          />
        </Sphere>
      ))}
    </group>
  );
}

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedSpheres />
      </Canvas>
    </div>
  );
};

export default Background3D;