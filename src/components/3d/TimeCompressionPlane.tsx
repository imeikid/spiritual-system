import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRoomStore } from '../../stores/room-store';
import * as THREE from 'three';
import { StableText } from './StableText';

export const TimeCompressionPlane: React.FC = () => {
  const { users, connections, currentUser } = useRoomStore();
  const planeGroupRef = useRef<any>();
  const timeUniform = useRef({ value: 0 });

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    timeUniform.current.value = time;
    
    if (planeGroupRef.current) {
      planeGroupRef.current.rotation.y = -time * 0.2;
    }
  });

  return (
    <group ref={planeGroupRef}>
      {/* Основная плоскость времени */}
      <CompressionPlane timeUniform={timeUniform} />
      
      {/* Пользователи на плоскости */}
      <PlaneUsers 
        users={users}
        currentUser={currentUser}
        connections={connections}
        timeUniform={timeUniform}
      />
      
      {/* Эффекты сжатия */}
      <CompressionEffects timeUniform={timeUniform} />
    </group>
  );
};

const CompressionPlane: React.FC<{ timeUniform: any }> = ({ timeUniform }) => {
  const planeMaterialRef = useRef<any>();

  useFrame((state) => {
    if (planeMaterialRef.current) {
      planeMaterialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const planeShader = useMemo(() => {
    return {
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          float distanceToCenter = length(position.xz);
          float compression = 1.0 - smoothstep(0.0, 25.0, distanceToCenter) * 0.3;
          float verticalWave = sin(distanceToCenter * 2.0 - time * 3.0) * 0.5;
          
          vec3 newPosition = position;
          newPosition.y = (position.y + verticalWave) * compression;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vec3 baseColor = vec3(0.05, 0.08, 0.15);
          
          float angle = atan(vPosition.z, vPosition.x);
          float radius = length(vPosition.xz);
          
          float spiral = sin(angle * 8.0 + time * 4.0 - radius * 2.0);
          vec3 spiralColor = vec3(0.3, 0.6, 1.0) * spiral * 0.3;
          
          float circles = sin(radius * 10.0 - time * 5.0) * 0.5 + 0.5;
          vec3 circlesColor = vec3(0.4, 0.8, 0.9) * circles * 0.2;
          
          float flowToCenter = smoothstep(25.0, 0.0, radius);
          vec3 flowColor = vec3(0.2, 0.5, 0.8) * flowToCenter * 0.4;
          
          vec3 finalColor = baseColor + spiralColor + circlesColor + flowColor;
          float vignette = 1.0 - smoothstep(20.0, 25.0, radius);
          finalColor *= vignette;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    };
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[50, 50, 100, 100]} />
      <shaderMaterial
        ref={planeMaterialRef}
        attach="material"
        args={[planeShader]}
      />
    </mesh>
  );
};

const PlaneUsers: React.FC<{ users: any[]; currentUser: any; connections: any[]; timeUniform: any }> = ({
  users,
  currentUser,
  connections,
  timeUniform
}) => {
  const gridSize = Math.ceil(Math.sqrt(users.length));
  const spacing = 6;

  return (
    <group>
      {users.map((user, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        const basePosition: [number, number, number] = [
          (col - gridSize / 2) * spacing,
          0,
          (row - gridSize / 2) * spacing
        ];

        const distance = Math.sqrt(basePosition[0] ** 2 + basePosition[2] ** 2);
        if (distance > 20) return null;

        return (
          <PlaneCitizen
            key={`${user.id}-${index}`}
            user={user}
            basePosition={basePosition}
            isCurrentUser={user.id === currentUser.id}
            timeUniform={timeUniform}
          />
        );
      })}
    </group>
  );
};

const PlaneCitizen: React.FC<{ user: any; basePosition: [number, number, number]; isCurrentUser: boolean; timeUniform: any }> = ({
  user,
  basePosition,
  isCurrentUser,
  timeUniform
}) => {
  const citizenRef = useRef<any>();

  useFrame((state) => {
    if (citizenRef.current) {
      const time = state.clock.elapsedTime;
      const distance = Math.sqrt(basePosition[0] ** 2 + basePosition[2] ** 2);
      const compression = 1.0 - Math.min(distance / 20, 1) * 0.5;
      const verticalWave = Math.sin(distance * 2.0 - time * 3.0) * 0.3;
      
      const angle = Math.atan2(basePosition[2], basePosition[0]) - time * 0.2;
      const radius = distance * compression;
      
      const newX = Math.cos(angle) * radius;
      const newZ = Math.sin(angle) * radius;
      
      citizenRef.current.position.set(
        newX,
        verticalWave + 0.5,
        newZ
      );
      
      const pulse = 1 + Math.sin(time * 2 + user.id.length) * 0.1;
      citizenRef.current.scale.setScalar(pulse * compression);
    }
  });

  return (
    <group ref={citizenRef}>
      {/* Аватар пользователя */}
      <group position={[0, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
          <meshStandardMaterial 
            color={getIntentionColor(user.primaryIntention)}
            emissive={getIntentionColor(user.primaryIntention)}
            emissiveIntensity={0.3}
          />
        </mesh>
        
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#f8c291" />
        </mesh>
      </group>

      {/* Информация с StableText */}
      <StableText
        position={[0, 1.8, 0]}
        fontSize={0.15}
        color="white"
        content={user.primaryIntention?.emoji || '🎯'}
      />

      <StableText
        position={[0, -0.5, 0]}
        fontSize={0.1}
        color={user.honestyScore > 0.8 ? '#4ecdc4' : user.honestyScore > 0.6 ? '#ffd93d' : '#ff6b6b'}
        content={user.name}
      />

      {isCurrentUser && (
        <pointLight
          color={getIntentionColor(user.primaryIntention)}
          intensity={0.5}
          distance={2}
        />
      )}
    </group>
  );
};

const CompressionEffects: React.FC<{ timeUniform: any }> = ({ timeUniform }) => {
  const effectsRef = useRef<any>();

  useFrame((state) => {
    if (effectsRef.current) {
      effectsRef.current.rotation.y = -state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={effectsRef}>
      {[5, 10, 15, 20].map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[radius - 0.2, radius + 0.2, 64]} />
          <meshBasicMaterial 
            color="#4ecdc4"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Вспомогательные функции
const getIntentionColor = (intention: any): string => {
  const colors: { [key: string]: string } = {
    'learning': '#4ecdc4',
    'collaboration': '#45b7d1', 
    'support': '#96ceb4',
    'creative': '#ff6b6b',
    'social': '#ffd93d',
    'default': '#9d4edd'
  };
  return colors[intention?.type || 'default'];
};
