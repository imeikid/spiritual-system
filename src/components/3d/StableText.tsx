import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StableTextProps {
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  content: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
}

export const StableText: React.FC<StableTextProps> = ({
  position,
  fontSize = 0.2,
  color = 'white',
  content,
  anchorX = 'center',
  anchorY = 'middle'
}) => {
  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    // Размеры канваса
    canvas.width = 256;
    canvas.height = 64;
    
    // Очистка и настройка
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = `${fontSize * 100}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Рисуем текст
    context.fillText(content, canvas.width / 2, canvas.height / 2);
    
    // Создаем текстуру
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, [content, fontSize, color]);

  return (
    <mesh position={position}>
      <planeGeometry args={[content.length * fontSize * 0.3, fontSize]} />
      <meshBasicMaterial 
        map={textTexture}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
};
