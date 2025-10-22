import React from 'react';
import { Sphere } from '@react-three/drei';

export const NaturalLandscape: React.FC = () => {
  return (
    <group>
      {/* Фон - большая сфера, представляющая небо */}
      <Sphere args={[20, 32, 32]} rotation={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#0a0a2a"
          side={1}
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Небольшие декоративные элементы */}
      <Sphere position={[3, -2, 2]} args={[0.1, 8, 8]}>
        <meshBasicMaterial color="#4ecdc4" transparent opacity={0.6} />
      </Sphere>
      
      <Sphere position={[-2, -1, -3]} args={[0.15, 8, 8]}>
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.6} />
      </Sphere>
      
      <Sphere position={[4, 1, -1]} args={[0.12, 8, 8]}>
        <meshBasicMaterial color="#45b7d1" transparent opacity={0.6} />
      </Sphere>
    </group>
  );
};
