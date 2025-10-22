import React, { useState } from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

interface GoalCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const GoalsInterface: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('spiritual');
  const [goalText, setGoalText] = useState('');
  const { setUserGoals } = useIntegratedSystemStore();
  
  const categories: GoalCategory[] = [
    { id: 'spiritual', name: 'Духовное развитие', icon: '🧘', color: '#4ecdc4' },
    { id: 'personal', name: 'Личностный рост', icon: '🌟', color: '#ffd93d' },
    { id: 'professional', name: 'Профессиональные цели', icon: '💼', color: '#6c5ce7' },
    { id: 'health', name: 'Здоровье и благополучие', icon: '❤️', color: '#ff6b6b' },
    { id: 'relationships', name: 'Отношения', icon: '👥', color: '#a29bfe' },
    { id: 'creative', name: 'Творчество', icon: '🎨', color: '#fd79a8' }
  ];
  
  const handleAddGoal = () => {
    if (goalText.trim()) {
      // Здесь будет логика сохранения цели
      const newGoal = {
        id: Date.now().toString(),
        text: goalText,
        category: activeCategory,
        createdAt: new Date(),
        completed: false
      };
      
      // Временное сохранение в localStorage
      const existingGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      const updatedGoals = [...existingGoals, newGoal];
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
      
      setGoalText('');
      alert('Цель добавлена! Система будет помогать вам в её достижении.');
    }
  };
  
  return (
    <div className="goals-interface">
      <div className="goals-header">
        <h2>🎯 Карта Моих Стремлений</h2>
        <p>Опишите ваши цели - система поможет их достичь</p>
      </div>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id}
            className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
            style={{ borderColor: category.color }}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
      
      <div className="goal-input-section">
        <div className="selected-category">
          Выбрана категория: {categories.find(c => c.id === activeCategory)?.name}
        </div>
        
        <textarea
          className="goal-textarea"
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder="Опишите вашу цель подробно... Например: 'Хочу научиться медитировать по 20 минут каждый день'"
          rows={4}
        />
        
        <button 
          className="add-goal-btn"
          onClick={handleAddGoal}
          disabled={!goalText.trim()}
        >
          🎯 Добавить цель в систему
        </button>
      </div>
      
      <div className="goals-preview">
        <h4>Ваши текущие цели:</h4>
        <div className="goals-list">
          {/* Здесь будет список целей из localStorage */}
          <div className="empty-state">
            Добавьте первую цель, чтобы начать работу с системой
          </div>
        </div>
      </div>
      
      <style>{`
        .goals-interface {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          margin: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .goals-header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .goals-header h2 {
          color: #4ecdc4;
          margin-bottom: 8px;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .category-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .category-card.active {
          background: rgba(255, 255, 255, 0.15);
          border-color: inherit;
        }
        
        .category-icon {
          font-size: 2em;
          margin-bottom: 8px;
        }
        
        .category-name {
          font-size: 0.8em;
          text-align: center;
        }
        
        .goal-input-section {
          margin-bottom: 20px;
        }
        
        .selected-category {
          margin-bottom: 10px;
          color: #4ecdc4;
          font-weight: bold;
        }
        
        .goal-textarea {
          width: 100%;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid #444;
          border-radius: 8px;
          color: white;
          font-family: inherit;
          resize: vertical;
        }
        
        .goal-textarea:focus {
          outline: none;
          border-color: #4ecdc4;
        }
        
        .add-goal-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(45deg, #4ecdc4, #44a08d);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
          transition: transform 0.3s ease;
        }
        
        .add-goal-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .add-goal-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .goals-preview h4 {
          color: #ffd93d;
          margin-bottom: 10px;
        }
        
        .empty-state {
          text-align: center;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: #888;
        }
      `}</style>
    </div>
  );
};
