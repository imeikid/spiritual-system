import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';

interface CustomTextProps {
  position: [number, number, number];
  fontSize: number;
  color: string;
  content: string;
}

export const CustomText: React.FC<CustomTextProps> = ({ 
  position, 
  fontSize, 
  color, 
  content 
}) => {
  const { gl } = useThree();
  
  // Простая замена текста с использованием спрайтов или мешей
  return (
    <group position={position}>
      {/* Временное решение - отображаем эмодзи или первые буквы */}
      <mesh>
        <planeGeometry args={[fontSize * 2, fontSize]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};
