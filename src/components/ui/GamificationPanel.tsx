import React from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

export const GamificationPanel: React.FC = () => {
  const { gamification, completeQuest } = useIntegratedSystemStore();
  
  return (
    <div className="gamification-panel">
      <div className="level-info">
        <div className="level">Уровень {gamification.level}</div>
        <div className="xp">
          Опыт: {gamification.experience} / {gamification.level * 500}
        </div>
      </div>
      
      <div className="active-quests">
        <h4>Активные квесты</h4>
        {gamification.activeQuests.map(quest => (
          <div key={quest.id} className="quest">
            <div className="quest-info">
              <strong>{quest.name}</strong>
              <p>{quest.description}</p>
              <div className="quest-progress">
                Прогресс: {quest.objectives[0].current}/{quest.objectives[0].target}
              </div>
            </div>
            <button 
              className="complete-btn"
              onClick={() => completeQuest(quest.id)}
            >
              Завершить
            </button>
          </div>
        ))}
      </div>
      
      <div className="achievements">
        <h4>Достижения</h4>
        <div className="achievements-grid">
          {gamification.achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={"achievement " + (achievement.unlocked ? "unlocked" : "locked")}
              title={achievement.description}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-name">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
