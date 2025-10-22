import React from 'react';
import { Sphere } from '@react-three/drei';

const SPHERE_POSITIONS = [
  [1, 0.5, 1], [-1, 0.5, -1], [1, -0.5, -1], [-1, -0.5, 1],
  [0, 1, 0], [0, -1, 0], [0, 0, 1.5]
];

export const ReflectiveSpheres: React.FC = () => {
  return (
    <group>
      {SPHERE_POSITIONS.map((position, index) => (
        <Sphere
          key={index}
          position={position as [number, number, number]}
          args={[0.2, 16, 16]}
        >
          <meshStandardMaterial 
            color="#9d4edd"
            transparent
            opacity={0.5}
            emissive="#9d4edd"
            emissiveIntensity={0.2}
          />
        </Sphere>
      ))}
    </group>
  );
};
