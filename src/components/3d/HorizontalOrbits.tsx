import React from 'react';
import { Torus } from '@react-three/drei';

const ORBITS_CONFIG = [
  { radius: 1, color: '#ff6b6b', tube: 0.05 },
  { radius: 2, color: '#4ecdc4', tube: 0.05 },
  { radius: 3, color: '#45b7d1', tube: 0.05 },
  { radius: 4, color: '#96ceb4', tube: 0.05 },
];

export const HorizontalOrbits: React.FC = () => {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {ORBITS_CONFIG.map((orbit, index) => (
        <Torus 
          key={index}
          args={[orbit.radius, orbit.tube, 16, 100]} 
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color={orbit.color}
            transparent
            opacity={0.6}
          />
        </Torus>
      ))}
    </group>
  );
};
