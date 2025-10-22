import React from 'react';
import { useSystemStore } from '../stores/system-store';

export const RealitySwitcher: React.FC = () => {
  const { currentMode, switchMode, realityTransition } = useSystemStore();
  
  const handleSwitch = () => {
    switchMode(currentMode === 'cabinet' ? 'room' : 'cabinet');
  };

  const getButtonText = () => {
    if (realityTransition) return '🌀...';
    return currentMode === 'cabinet' ? '🏙️ Войти в Город' : '🛸 В Кабинет';
  };

  return (
    <div className="reality-switcher">
      <button 
        className={`reality-btn ${currentMode}`}
        onClick={handleSwitch}
        disabled={realityTransition}
        title="Alt+Tab для быстрого переключения"
      >
        {getButtonText()}
      </button>
      
      <style>{`
        .reality-switcher {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .reality-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 160px;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }
        
        .reality-btn.room {
          background: linear-gradient(45deg, #667eea, #764ba2);
        }
        
        .reality-btn.cabinet {
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
        }
        
        .reality-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .reality-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 0.4; }
          100% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
