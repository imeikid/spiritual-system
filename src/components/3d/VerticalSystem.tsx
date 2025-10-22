import React from 'react';
import { Sphere } from '@react-three/drei';

const VERTICAL_LEVELS = [
  { name: 'СНВ2ДУ', position: [0, 4, 0] as [number, number, number], color: '#8B0000' },
  { name: 'В2ДУ', position: [0, 3, 0] as [number, number, number], color: '#D2691E' },
  { name: 'НОРМА', position: [0, 2, 0] as [number, number, number], color: '#006400' },
  { name: 'КВУ', position: [0, 1, 0] as [number, number, number], color: '#00008B' },
  { name: 'НВЗ', position: [0, 0, 0] as [number, number, number], color: '#4B0082' },
];

export const VerticalSystem: React.FC = () => {
  return (
    <group>
      {VERTICAL_LEVELS.map((level, index) => (
        <group key={level.name} position={level.position}>
          <Sphere args={[0.3, 32, 32]}>
            <meshStandardMaterial 
              color={level.color}
              transparent 
              opacity={0.8}
              emissive={level.color}
              emissiveIntensity={0.3}
            />
          </Sphere>
          
          {/* Соединительные линии между уровнями */}
          {index < VERTICAL_LEVELS.length - 1 && (
            <mesh position={[0, -0.5, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
              <meshStandardMaterial 
                color={level.color}
                transparent 
                opacity={0.6}
              />
            </mesh>
          )}
        </group>
      ))}
      
      {/* Сфера эталонной силы (над системой) */}
      <Sphere position={[0, 5, 0]} args={[0.5, 32, 32]}>
        <meshStandardMaterial 
          color="#ffd700"
          transparent 
          opacity={0.8}
          emissive="#ffd700"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </group>
  );
};
