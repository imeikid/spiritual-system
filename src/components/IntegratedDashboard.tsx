import React, { useEffect } from 'react';
import { useIntegratedSystemStore } from '../stores/integrated-system-store';
import { AIChatInterface } from './ui/AIChatInterface';
import { AnalyticsDashboard } from './ui/AnalyticsDashboard';
import { MultiplayerLobby } from './ui/MultiplayerLobby';
import { GamificationPanel } from './ui/GamificationPanel';
import { RealitySwitcher } from './ui/RealitySwitcher';
import { GoalsInterface } from './ui/GoalsInterface';
import './IntegratedDashboard.css';

export const IntegratedDashboard: React.FC = () => {
  const { 
    initializeSystem, 
    isInitialized,
    currentMode,
    switchMode,
    reality
  } = useIntegratedSystemStore();
  
  useEffect(() => {
    if (!isInitialized) {
      initializeSystem();
    }
  }, [isInitialized, initializeSystem]);
  
  if (!isInitialized) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spiritual-loader"></div>
          <h2>Инициализация Кабинета Управления Реальностью...</h2>
          <p>Загрузка модулей: Психологический ИИ 🤖 Система Целей 🎯 Переключение Реальностей 🌌</p>
        </div>
      </div>
    );
  }
  
  // Если выбран режим "реальный мир", показываем другой интерфейс
  if (reality.currentReality === 'world') {
    return (
      <div className="reality-world">
        <RealitySwitcher />
        <div className="world-interface">
          <h1>🌍 Реальный Мир</h1>
          <p>Вы находитесь в режиме реального мира. Здесь вы можете применять полученные знания на практике.</p>
          <GoalsInterface />
        </div>
      </div>
    );
  }
  
  // Режим "кабинет"
  return (
    <div className="integrated-dashboard">
      <RealitySwitcher />
      
      <header className="dashboard-header">
        <div className="mode-controls">
          <button 
            className={"mode-btn " + (currentMode === 'yara' ? 'active' : '')}
            onClick={() => switchMode('yara')}
          >
            🦅 Режим Яры
          </button>
          <button 
            className={"mode-btn " + (currentMode === 'terminal' ? 'active' : '')}
            onClick={() => switchMode('terminal')}
          >
            🔮 Режим Терминала
          </button>
        </div>
        
        <div className="system-status">
          <span className="status-indicator online"></span>
          <span>Кабинет Управления Реальностью активен</span>
        </div>
      </header>
      
      <div className="dashboard-grid">
        
        <div className="column spiritual-practice">
          <div className="module-card">
            <h3>🧘 Духовная практика</h3>
            <div className="practice-zone">
              <p>Текущий фокус: Осознанное присутствие</p>
              <button className="practice-btn">
                Начать медитацию
              </button>
            </div>
          </div>
          
          <div className="module-card">
            <h3>🤖 ИИ-Психолог</h3>
            <AIChatInterface />
          </div>
        </div>
        
        <div className="column analytics">
          <div className="module-card">
            <h3>📊 Аналитика развития</h3>
            <AnalyticsDashboard />
          </div>
          
          <div className="module-card">
            <h3>🎯 Мои Цели и Стремления</h3>
            <GoalsInterface />
          </div>
        </div>
        
        <div className="column social-gamification">
          <div className="module-card">
            <h3>🌐 Сообщество</h3>
            <MultiplayerLobby />
          </div>
          
          <div className="module-card">
            <h3>🎮 Прогресс</h3>
            <GamificationPanel />
          </div>
        </div>
        
      </div>
      
      <footer className="quick-actions">
        <button className="action-btn">🚀 Быстрая медитация</button>
        <button className="action-btn">📈 Проверить прогресс</button>
        <button className="action-btn">👥 Присоединиться к группе</button>
        <button className="action-btn">🎯 Активные квесты</button>
      </footer>
    </div>
  );
};
