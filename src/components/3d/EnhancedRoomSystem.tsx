import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import { useRoomStore } from '../../stores/room-store';
import { CustomText } from './CustomText';

export const EnhancedRoomSystem: React.FC = () => {
  const { users, connections, currentUser, activeInteractions } = useRoomStore();
  
  return (
    <group>
      {/* Ландшафт в плоскости орбит */}
      <EnergyLandscape />
      
      {/* Комната */}
      <mesh position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a3a4a" />
      </mesh>
      
      {/* Пользователи */}
      {users.map(user => (
        <UserWithAura 
          key={user.id}
          user={user}
          isCurrentUser={user.id === currentUser.id}
        />
      ))}
      
      {/* Аурора-эффекты при взаимодействиях */}
      {activeInteractions.map(interaction => (
        <AuroraEffect 
          key={interaction.id}
          interaction={interaction}
          users={users}
        />
      ))}
    </group>
  );
};

const EnergyLandscape: React.FC = () => {
  const meshRef = useRef<any>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <planeGeometry args={[45, 45, 32, 32]} />
      <meshBasicMaterial color="#2c3e50" transparent opacity={0.1} wireframe />
    </mesh>
  );
};

const UserWithAura: React.FC<{ user: any; isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
  const auraRef = useRef<any>();
  const { connections } = useRoomStore();
  
  useFrame((state) => {
    if (auraRef.current) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      auraRef.current.scale.setScalar(1 + intensity * 0.1);
    }
  });
  
  const userConnections = connections.filter(conn => 
    conn.userId1 === user.id || conn.userId2 === user.id
  );
  
  const hasActiveConnections = userConnections.length > 0;
  
  return (
    <group position={user.position}>
      {/* Аура пользователя */}
      {hasActiveConnections && (
        <Sphere ref={auraRef} args={[isCurrentUser ? 1.2 : 0.7, 32, 32]}>
          <meshBasicMaterial 
            color="#4ecdc4"
            transparent
            opacity={0.2}
            wireframe
          />
        </Sphere>
      )}
      
      {/* Основная сфера пользователя */}
      <Sphere args={[isCurrentUser ? 1 : 0.5, 32, 32]}>
        <meshStandardMaterial 
          color={getIntentionColor(user.primaryIntention)}
          transparent
          opacity={0.9}
          emissive={getIntentionColor(user.primaryIntention)}
          emissiveIntensity={hasActiveConnections ? 0.5 : 0.1}
        />
      </Sphere>
      
      {/* Орбиты доверия (появляются при взаимодействии) */}
      {userConnections.map((connection, index) => (
        <TrustOrbit 
          key={connection.id}
          level={index + 1}
          user={user}
          isActive={hasActiveConnections}
        />
      ))}
      
      {/* Информация о пользователе */}
      <UserInfo user={user} isCurrentUser={isCurrentUser} />
    </group>
  );
};

const TrustOrbit: React.FC<{ level: number; user: any; isActive: boolean }> = ({ 
  level, user, isActive 
}) => {
  const orbitRef = useRef<any>();
  
  useFrame((state) => {
    if (orbitRef.current && isActive) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * (0.2 / level);
    }
  });
  
  if (!isActive) return null;
  
  return (
    <mesh ref={orbitRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[level, level + 0.05, 64]} />
      <meshBasicMaterial 
        color={getAuroraColor(level)}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const AuroraEffect: React.FC<{ interaction: any; users: any[] }> = ({ interaction, users }) => {
  const user1 = users.find(u => u.id === interaction.userId1);
  const user2 = users.find(u => u.id === interaction.userId2);
  
  if (!user1 || !user2) return null;
  
  const points: [number, number, number][] = [
    [user1.position[0], user1.position[1], user1.position[2]],
    [user2.position[0], user2.position[1], user2.position[2]]
  ];
  
  return (
    <Line
      points={points}
      color={getAuroraColor(interaction.strength)}
      lineWidth={interaction.strength * 5}
      transparent
      opacity={0.8}
    />
  );
};

const UserInfo: React.FC<{ user: any; isCurrentUser: boolean }> = ({ user, isCurrentUser }) => {
  const height = isCurrentUser ? 1.2 : 0.7;
  
  return (
    <group>
      {/* Индикатор намерения */}
      <CustomText
        position={[0, height + 0.3, 0]}
        fontSize={0.2}
        color="white"
        content={user.primaryIntention?.emoji || '🎯'}
      />
      
      {/* Имя и уровень честности */}
      <CustomText
        position={[0, -height - 0.3, 0]}
        fontSize={0.15}
        color={user.honestyScore > 0.8 ? '#4ecdc4' : user.honestyScore > 0.6 ? '#ffd93d' : '#ff6b6b'}
        content={`${user.name} (${Math.round(user.honestyScore * 100)}%)`}
      />
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

const getAuroraColor = (level: number): string => {
  const colors = ['#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'];
  return colors[(level - 1) % colors.length];
};
