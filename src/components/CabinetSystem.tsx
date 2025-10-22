import React, { useState } from 'react';
import { useSystemStore } from '../stores/system-store';
import { useRoomStore } from '../stores/room-store';

export const CabinetSystem: React.FC = () => {
  const { currentUser, hasPermission } = useSystemStore();
  const { users, connections } = useRoomStore();
  const [activeTool, setActiveTool] = useState<'analytics' | 'matching' | 'development'>('development');
  
  return (
    <div className="cabinet-system">
      <div className="cabinet-header">
        <h1>🛸 Кабинет Осознанного Развития</h1>
        <p>Инструменты для глубокого самоанализа и управления системой</p>
      </div>
      
      <div className="cabinet-tools">
        <button 
          className={activeTool === 'development' ? 'active' : ''}
          onClick={() => setActiveTool('development')}
        >
          🧘 Персональное Развитие
        </button>
        
        {hasPermission('analytics', 'read') && (
          <button 
            className={activeTool === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTool('analytics')}
          >
            📊 Аналитика Системы
          </button>
        )}
        
        {hasPermission('matching', 'read') && (
          <button 
            className={activeTool === 'matching' ? 'active' : ''}
            onClick={() => setActiveTool('matching')}
          >
            🤝 Система Матчинга
          </button>
        )}
      </div>
      
      <div className="tool-content">
        {activeTool === 'development' && <PersonalDevelopmentTool />}
        {activeTool === 'analytics' && <AnalyticsTool />}
        {activeTool === 'matching' && <MatchingTool />}
      </div>
    </div>
  );
};

const PersonalDevelopmentTool: React.FC = () => {
  const { currentUser } = useSystemStore();
  
  return (
    <div className="development-tool">
      <h3>🧠 Ваш Путь Развития</h3>
      
      <div className="development-metrics">
        <div className="metric">
          <label>Уровень честности:</label>
          <div className="metric-value">
            <div 
              className="metric-bar" 
              style={{ width: `${currentUser.honestyScore * 100}%` }}
            ></div>
            <span>{Math.round(currentUser.honestyScore * 100)}%</span>
          </div>
        </div>
        
        <div className="metric">
          <label>Уровень доверия:</label>
          <div className="metric-value">
            <div 
              className="metric-bar" 
              style={{ width: `${(currentUser.trustLevel / 4) * 100}%` }}
            ></div>
            <span>{currentUser.trustLevel}/4</span>
          </div>
        </div>
      </div>
      
      <div className="reflection-zone">
        <h4>📝 Зона Рефлексии</h4>
        <textarea 
          placeholder="Опишите ваши сегодняшние инсайты и наблюдения..."
          rows={6}
        />
        <button className="save-btn">💾 Сохранить рефлексию</button>
      </div>
      
      <div className="practice-exercises">
        <h4>🎯 Упражнения для Развития</h4>
        <div className="exercises-grid">
          <div className="exercise">
            <h5>Медитация Осознанности</h5>
            <p>10 минут наблюдения за дыханием</p>
            <button>▶️ Начать</button>
          </div>
          <div className="exercise">
            <h5>Анализ Намерений</h5>
            <p>Проанализируйте свои последние решения</p>
            <button>▶️ Начать</button>
          </div>
          <div className="exercise">
            <h5>Развитие Эмпатии</h5>
            <p>Упражнение на понимание других</p>
            <button>▶️ Начать</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsTool: React.FC = () => {
  const { users, connections } = useRoomStore();
  const { hasPermission } = useSystemStore();
  
  if (!hasPermission('analytics', 'read')) {
    return <div>Недостаточно прав для доступа к аналитике</div>;
  }
  
  return (
    <div className="analytics-tool">
      <h3>📊 Аналитика Системы</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Пользователей онлайн</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{connections.length}</div>
          <div className="stat-label">Активных связей</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.honestyScore, 0) / users.length * 100) : 0}%
          </div>
          <div className="stat-label">Средняя честность</div>
        </div>
      </div>
      
      <div className="users-list">
        <h4>👥 Активные пользователи:</h4>
        {users.map(user => (
          <div key={user.id} className="user-analytics">
            <span className="user-name">{user.name}</span>
            <span className="user-stats">
              Честность: {Math.round(user.honestyScore * 100)}% | 
              Доверие: {user.trustLevel}/4 |
              Намерение: {user.primaryIntention?.emoji || '❓'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MatchingTool: React.FC = () => {
  const { users, connections } = useRoomStore();
  const { hasPermission } = useSystemStore();
  
  if (!hasPermission('matching', 'read')) {
    return <div>Недостаточно прав для доступа к системе матчинга</div>;
  }
  
  const findOptimalMatches = () => {
    // Алгоритм матчинга для Яры
    return users
      .filter(user => user.id !== 'yara-001')
      .map(user => ({
        user,
        matchScore: calculateMatchScore(user),
        reasons: ['Совпадение намерений', 'Дополнительные навыки']
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  };
  
  const optimalMatches = findOptimalMatches();
  
  return (
    <div className="matching-tool">
      <h3>🤝 Система Матчинга (ROOT)</h3>
      <p>Оптимальные соединения для коллективного роста</p>
      
      <div className="matches-list">
        {optimalMatches.map((match, index) => (
          <div key={match.user.id} className="match-card">
            <div className="match-header">
              <span className="match-rank">#{index + 1}</span>
              <span className="user-name">{match.user.name}</span>
              <span className="match-score">{Math.round(match.matchScore * 100)}%</span>
            </div>
            <div className="match-reasons">
              {match.reasons.map((reason, i) => (
                <span key={i} className="reason-tag">✓ {reason}</span>
              ))}
            </div>
            <div className="match-actions">
              <button className="action-btn">💬 Предложить сотрудничество</button>
              <button className="action-btn">📊 Детальный анализ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Вспомогательная функция для расчета совместимости
const calculateMatchScore = (user: any): number => {
  const baseScore = 0.5;
  const honestyBonus = user.honestyScore * 0.3;
  const trustBonus = (user.trustLevel / 4) * 0.2;
  
  return baseScore + honestyBonus + trustBonus;
};

// Стили для кабинета
const cabinetStyles = `
  .cabinet-system {
    height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: 20px;
    overflow-y: auto;
  }
  
  .cabinet-header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .cabinet-header h1 {
    color: #4ecdc4;
    margin-bottom: 10px;
  }
  
  .cabinet-tools {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: center;
  }
  
  .cabinet-tools button {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #444;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cabinet-tools button.active {
    background: rgba(78, 205, 196, 0.2);
    border-color: #4ecdc4;
  }
  
  .cabinet-tools button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .tool-content {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
    min-height: 500px;
  }
  
  .development-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .metric {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
  }
  
  .metric-value {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
  }
  
  .metric-bar {
    height: 8px;
    background: linear-gradient(45deg, #4ecdc4, #45b7d1);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .reflection-zone textarea {
    width: 100%;
    padding: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #444;
    border-radius: 8px;
    color: white;
    margin-bottom: 10px;
    resize: vertical;
  }
  
  .save-btn {
    padding: 10px 20px;
    background: #4ecdc4;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }
  
  .exercises-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    margin-top: 15px;
  }
  
  .exercise {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    text-align: center;
  }
  
  .exercise button {
    margin-top: 10px;
    padding: 8px 16px;
    background: #ff6b6b;
    border: none;
    border-radius: 20px;
    color: white;
    cursor: pointer;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }
  
  .stat-value {
    font-size: 2em;
    color: #4ecdc4;
    font-weight: bold;
  }
  
  .user-analytics {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    margin-bottom: 8px;
  }
  
  .match-card {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 15px;
    border-left: 4px solid #4ecdc4;
  }
  
  .match-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .match-score {
    color: #ffd93d;
    font-weight: bold;
  }
  
  .match-reasons {
    margin-bottom: 10px;
  }
  
  .reason-tag {
    background: rgba(78, 205, 196, 0.2);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    margin-right: 8px;
  }
  
  .match-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-btn {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #444;
    border-radius: 15px;
    color: white;
    cursor: pointer;
    font-size: 0.8em;
  }
`;

// Добавляем стили в документ
const styleSheet = document.createElement("style");
styleSheet.innerText = cabinetStyles;
document.head.appendChild(styleSheet);

export default CabinetSystem;
