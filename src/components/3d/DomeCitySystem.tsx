import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { useRoomStore } from '../../stores/room-store';
import * as THREE from 'three';

export const DomeCitySystem: React.FC = () => {
  const { users, connections, currentUser } = useRoomStore();
  const domeGroupRef = useRef<any>();
  const timeUniform = useRef({ value: 0 });

  useFrame((state) => {
    timeUniform.current.value = state.clock.elapsedTime;
    
    if (domeGroupRef.current) {
      // Очень медленное вращение для естественности
      domeGroupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  // 8 уровней куполов (от внутреннего к внешнему)
  const domeLevels = [
    { id: 1, radius: 45, name: 'Физический', color: '#4ecdc4', opacity: 0.1 },
    { id: 2, radius: 50, name: 'Эмоциональный', color: '#ff6b6b', opacity: 0.08 },
    { id: 3, radius: 55, name: 'Ментальный', color: '#ffd93d', opacity: 0.06 },
    { id: 4, radius: 60, name: 'Духовный', color: '#9d4edd', opacity: 0.05 },
    { id: 5, radius: 65, name: 'Творческий', color: '#45b7d1', opacity: 0.04 },
    { id: 6, radius: 70, name: 'Социальный', color: '#96ceb4', opacity: 0.03 },
    { id: 7, radius: 75, name: 'Интуитивный', color: '#fd79a8', opacity: 0.02 },
    { id: 8, radius: 80, name: 'Трансцендентный', color: '#ffffff', opacity: 0.01 }
  ];

  return (
    <group ref={domeGroupRef}>
      {/* Основной купол (полусфера) */}
      <MainDome />
      
      {/* Уровни куполов */}
      {domeLevels.map(level => (
        <DomeLevel 
          key={level.id}
          level={level}
          users={users.filter((_, index) => index % 8 === level.id - 1)}
          currentUser={currentUser}
          connections={connections}
        />
      ))}
      
      {/* Бесконечное небо */}
      <InfinitySky />
      
      {/* Пользователи в "городе" на полу */}
      <CityUsers 
        users={users}
        currentUser={currentUser}
        connections={connections}
      />
    </group>
  );
};

const MainDome: React.FC = () => {
  const domeRef = useRef<any>();
  const timeUniform = useRef({ value: 0 });

  useFrame((state) => {
    timeUniform.current.value = state.clock.elapsedTime;
  });

  const domeShader = useMemo(() => {
    return {
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          // Основа купола - глубокий синий
          vec3 domeColor = vec3(0.05, 0.08, 0.15);
          
          // Энергетические узоры
          float energy1 = sin(vPosition.x * 10.0 + time * 2.0) * 0.5 + 0.5;
          float energy2 = cos(vPosition.z * 8.0 + time * 1.5) * 0.5 + 0.5;
          float energy3 = sin(vPosition.y * 12.0 + time * 3.0) * 0.5 + 0.5;
          
          vec3 energyColor = vec3(0.3, 0.6, 1.0) * (energy1 * energy2 * energy3) * 0.3;
          
          // Звезды
          float stars = step(0.999, sin(vPosition.x * 200.0) * sin(vPosition.y * 200.0) * sin(vPosition.z * 200.0));
          vec3 starsColor = vec3(1.0, 1.0, 0.9) * stars * 0.5;
          
          vec3 finalColor = domeColor + energyColor + starsColor;
          
          // Прозрачность увеличивается к вершине
          float alpha = smoothstep(-0.5, 1.0, vPosition.y) * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide
    };
  }, []);

  return (
    <Sphere ref={domeRef} args={[40, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]}>
      <shaderMaterial
        uniforms={Object.assign({}, domeShader.uniforms, { time: timeUniform.current })}
        vertexShader={domeShader.vertexShader}
        fragmentShader={domeShader.fragmentShader}
        transparent={true}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

const DomeLevel: React.FC<{ level: any; users: any[]; currentUser: any; connections: any[] }> = ({
  level,
  users,
  currentUser,
  connections
}) => {
  const levelRef = useRef<any>();

  useFrame((state) => {
    if (levelRef.current) {
      // Каждый уровень вращается со своей скоростью
      levelRef.current.rotation.y = state.clock.elapsedTime * (0.005 + level.id * 0.002);
    }
  });

  return (
    <group ref={levelRef}>
      {/* Визуальное представление уровня (только для отладки) */}
      <Sphere args={[level.radius, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]}>
        <meshBasicMaterial 
          color={level.color}
          transparent
          opacity={level.opacity}
          wireframe={true}
        />
      </Sphere>

      {/* Проекции пользователей на этом уровне */}
      {users.map((user, index) => {
        const angle = (index / users.length) * Math.PI * 2;
        const userPosition: [number, number, number] = [
          Math.cos(angle) * (level.radius - 5),
          0, // Все пользователи на "земле"
          Math.sin(angle) * (level.radius - 5)
        ];

        return (
          <UserProjection
            key={user.id}
            user={user}
            position={userPosition}
            isCurrentUser={user.id === currentUser.id}
            levelColor={level.color}
            levelName={level.name}
          />
        );
      })}
    </group>
  );
};

const InfinitySky: React.FC = () => {
  const skyRef = useRef<any>();
  const timeUniform = useRef({ value: 0 });

  useFrame((state) => {
    timeUniform.current.value = state.clock.elapsedTime;
  });

  const skyShader = useMemo(() => {
    return {
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        // Шум для облаков
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        
        void main() {
          // Градиент неба от темно-синего к светлому
          vec3 skyColor = mix(
            vec3(0.05, 0.1, 0.3),
            vec3(0.3, 0.5, 0.9),
            smoothstep(-1.0, 1.0, vPosition.y)
          );
          
          // Облака
          vec2 cloudUV = vUv * 3.0 + time * 0.1;
          float clouds = noise(cloudUV) * 0.5 + noise(cloudUV * 2.0) * 0.25;
          clouds = smoothstep(0.3, 0.8, clouds);
          
          vec3 cloudColor = vec3(1.0, 1.0, 1.0) * clouds * 0.3;
          
          // Далекие звезды
          float stars = step(0.998, hash(vUv * 100.0));
          vec3 starsColor = vec3(1.0, 1.0, 1.0) * stars * 0.5;
          
          // Эффект бесконечности - fade к горизонту
          float horizon = smoothstep(0.0, 0.3, vPosition.y);
          
          vec3 finalColor = (skyColor + cloudColor + starsColor) * horizon;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.BackSide
    };
  }, []);

  return (
    <Sphere ref={skyRef} args={[200, 32, 32]}>
      <shaderMaterial
        uniforms={Object.assign({}, skyShader.uniforms, { time: timeUniform.current })}
        vertexShader={skyShader.vertexShader}
        fragmentShader={skyShader.fragmentShader}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

const CityUsers: React.FC<{ users: any[]; currentUser: any; connections: any[] }> = ({
  users,
  currentUser,
  connections
}) => {
  // Создаем "город" из пользователей на плоскости внутри купола
  const gridSize = Math.ceil(Math.sqrt(users.length));
  const spacing = 8;

  return (
    <group>
      {/* Земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[35, 32]} />
        <meshStandardMaterial 
          color="#2c3e50"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Пользователи в городе */}
      {users.map((user, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        const position: [number, number, number] = [
          (col - gridSize / 2) * spacing,
          0,
          (row - gridSize / 2) * spacing
        ];

        // Проверяем, находится ли позиция внутри круга
        const distance = Math.sqrt(position[0] ** 2 + position[2] ** 2);
        if (distance > 30) return null;

        return (
          <CityCitizen
            key={user.id}
            user={user}
            position={position}
            isCurrentUser={user.id === currentUser.id}
          />
        );
      })}

      {/* Дороги между пользователями */}
      {connections.map(connection => {
        const user1 = users.find(u => u.id === connection.userId1);
        const user2 = users.find(u => u.id === connection.userId2);
        
        if (!user1 || !user2) return null;

        const index1 = users.findIndex(u => u.id === user1.id);
        const index2 = users.findIndex(u => u.id === user2.id);
        
        const row1 = Math.floor(index1 / gridSize);
        const col1 = index1 % gridSize;
        const row2 = Math.floor(index2 / gridSize);
        const col2 = index2 % gridSize;
        
        const pos1: [number, number, number] = [
          (col1 - gridSize / 2) * spacing,
          0,
          (row1 - gridSize / 2) * spacing
        ];
        
        const pos2: [number, number, number] = [
          (col2 - gridSize / 2) * spacing,
          0,
          (row2 - gridSize / 2) * spacing
        ];

        // Проверяем, находятся ли обе позиции внутри круга
        const dist1 = Math.sqrt(pos1[0] ** 2 + pos1[2] ** 2);
        const dist2 = Math.sqrt(pos2[0] ** 2 + pos2[2] ** 2);
        if (dist1 > 30 || dist2 > 30) return null;

        return (
          <CityRoad
            key={connection.id}
            start={pos1}
            end={pos2}
            strength={connection.strength}
          />
        );
      })}
    </group>
  );
};

const CityCitizen: React.FC<{ user: any; position: [number, number, number]; isCurrentUser: boolean }> = ({
  user,
  position,
  isCurrentUser
}) => {
  const citizenRef = useRef<any>();

  useFrame((state) => {
    if (citizenRef.current) {
      // Легкая пульсация для оживления
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + user.id.length) * 0.1;
      citizenRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position} ref={citizenRef}>
      {/* Тело пользователя */}
      <group position={[0, 0.5, 0]}>
        <Sphere args={[0.3, 8, 8]}>
          <meshStandardMaterial 
            color={getIntentionColor(user.primaryIntention)}
            emissive={getIntentionColor(user.primaryIntention)}
            emissiveIntensity={0.3}
          />
        </Sphere>
        
        {/* Голова */}
        <Sphere args={[0.2, 8, 8]} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="#f8c291" />
        </Sphere>
      </group>

      {/* Информация */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {user.primaryIntention?.emoji || '🎯'}
      </Text>

      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color={user.honestyScore > 0.8 ? '#4ecdc4' : user.honestyScore > 0.6 ? '#ffd93d' : '#ff6b6b'}
        anchorX="center"
        anchorY="middle"
      >
        {user.name}
      </Text>

      {/* Свечение для текущего пользователя */}
      {isCurrentUser && (
        <pointLight
          color={getIntentionColor(user.primaryIntention)}
          intensity={0.5}
          distance={3}
        />
      )}
    </group>
  );
};

const CityRoad: React.FC<{ start: [number, number, number]; end: [number, number, number]; strength: number }> = ({
  start,
  end,
  strength
}) => {
  const roadGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);

  return (
    <line geometry={roadGeometry}>
      <lineBasicMaterial 
        color="#34495e"
        transparent
        opacity={0.3 + strength * 0.3}
        linewidth={1}
      />
    </line>
  );
};

const UserProjection: React.FC<{ user: any; position: [number, number, number]; isCurrentUser: boolean; levelColor: string; levelName: string }> = ({
  user,
  position,
  isCurrentUser,
  levelColor,
  levelName
}) => {
  return (
    <group position={position}>
      {/* Проекция на уровне купола */}
      <Sphere args={[0.5, 8, 8]}>
        <meshBasicMaterial 
          color={levelColor}
          transparent
          opacity={0.5}
        />
      </Sphere>

      <Text
        position={[0, 1, 0]}
        fontSize={0.2}
        color={levelColor}
        anchorX="center"
        anchorY="middle"
      >
        {levelName}
      </Text>
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
