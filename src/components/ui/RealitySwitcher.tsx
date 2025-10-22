import React from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

export const RealitySwitcher: React.FC = () => {
  const { reality, toggleReality } = useIntegratedSystemStore();
  
  return (
    <div className="reality-switcher">
      <button 
        className={`reality-btn ${reality.currentReality === 'cabinet' ? 'active' : ''}`}
        onClick={toggleReality}
        disabled={reality.realityTransition}
      >
        {reality.realityTransition ? (
          <div className="transition-effect">
            <div className="portal-animation"></div>
            <span>Переход между реальностями...</span>
          </div>
        ) : (
          <>
            {reality.currentReality === 'cabinet' ? '🌌 Войти в Реальный Мир' : '🛸 Вернуться в Кабинет'}
          </>
        )}
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
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }
        
        .reality-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .reality-btn.active {
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
        }
        
        .transition-effect {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .portal-animation {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
