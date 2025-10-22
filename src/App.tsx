import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { RealitySwitcher } from './components/RealitySwitcher';
import { EnhancedRoomSystem } from './components/3d/EnhancedRoomSystem';
import { CabinetSystem } from './components/CabinetSystem';
import { UserInterface } from './components/ui/UserInterface';
import { useSystemStore } from './stores/system-store';
import './App.css';

function App() {
  const { currentMode, realityTransition } = useSystemStore();

  if (realityTransition) {
    return (
      <div className="transition-screen">
        <div className="portal-animation"></div>
        <h2>Переход между режимами...</h2>
      </div>
    );
  }

  return (
    <div className="app">
      {currentMode === 'cabinet' ? (
        <CabinetSystem />
      ) : (
        <>
          <div className="scene-container">
            <Canvas camera={{ position: [10, 8, 10], fov: 50 }}>
              <color attach="background" args={['#1a1a2e']} />
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <spotLight position={[-10, 10, -10]} angle={0.3} intensity={0.8} />
              
              <EnhancedRoomSystem />
              
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={25}
              />
              <Environment preset="city" />
            </Canvas>
          </div>
          
          <div className="interface-container">
            <UserInterface />
          </div>
        </>
      )}
      
      <RealitySwitcher />
    </div>
  );
}

export default App;
