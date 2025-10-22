import React, { useState } from 'react';
import { useRoomStore } from '../../stores/room-store';

export const UserInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intentions' | 'connections' | 'profile'>('intentions');
  const { connections } = useRoomStore();
  
  return (
    <div className="user-interface">
      <div className="ui-header">
        <h2>🧠 Комната Взаимодействий</h2>
        <p>Выражайте намерения и находите единомышленников</p>
      </div>
      
      <div className="tabs">
        <button 
          className={activeTab === 'intentions' ? 'active' : ''}
          onClick={() => setActiveTab('intentions')}
        >
          🎯 Намерения
        </button>
        <button 
          className={activeTab === 'connections' ? 'active' : ''}
          onClick={() => setActiveTab('connections')}
        >
          🔗 Связи ({connections.length})
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          👤 Профиль
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'intentions' && <IntentionsTab />}
        {activeTab === 'connections' && <ConnectionsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
};

const IntentionsTab: React.FC = () => {
  const { currentUser, intentionsCatalog, setUserIntention } = useRoomStore();
  
  return (
    <div className="intentions-tab">
      <div className="current-intention">
        <h4>Текущее намерение:</h4>
        {currentUser.primaryIntention ? (
          <div className="primary-intention">
            <span className="intention-emoji">{currentUser.primaryIntention.emoji}</span>
            <span className="intention-text">{currentUser.primaryIntention.description}</span>
          </div>
        ) : (
          <p className="no-intention">Намерение не выбрано</p>
        )}
      </div>
      
      <div className="intentions-grid">
        <h4>Выберите намерение:</h4>
        <div className="intentions-list">
          {intentionsCatalog.map(intention => (
            <button
              key={intention.id}
              className={`intention-btn ${
                currentUser.primaryIntention?.id === intention.id ? 'active' : ''
              }`}
              onClick={() => setUserIntention(intention)}
            >
              <span className="intention-emoji">{intention.emoji}</span>
              <span className="intention-desc">{intention.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ConnectionsTab: React.FC = () => {
  const { connections, users } = useRoomStore();
  
  return (
    <div className="connections-tab">
      <h4>Активные связи:</h4>
      
      {connections.length === 0 ? (
        <p className="no-connections">
          Пока нет связей. Установите намерение!
        </p>
      ) : (
        <div className="connections-list">
          {connections.map(connection => {
            const otherUser = users.find(u => 
              u.id === (connection.userId1 === 'user-1' ? connection.userId2 : connection.userId1)
            );
            
            if (!otherUser) return null;
            
            return (
              <div key={connection.id} className="connection-item">
                <div className="connection-header">
                  <span className="user-name">{otherUser.name}</span>
                  <span className="connection-strength">
                    {Math.round(connection.strength * 100)}%
                  </span>
                </div>
                <div className="shared-intention">
                  {otherUser.primaryIntention?.emoji} {otherUser.primaryIntention?.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ProfileTab: React.FC = () => {
  const { currentUser } = useRoomStore();
  
  return (
    <div className="profile-tab">
      <div className="profile-info">
        <h4>👤 Ваш профиль</h4>
        <div className="profile-field">
          <label>Имя:</label>
          <span>{currentUser.name}</span>
        </div>
        <div className="profile-field">
          <label>Уровень доверия:</label>
          <span>{currentUser.trustLevel}/4</span>
        </div>
        <div className="profile-field">
          <label>Энергия:</label>
          <span>{Math.round(currentUser.energy * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

// Добавим стили
const styles = `
  .user-interface {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(26, 26, 46, 0.95);
    color: white;
  }
  
  .ui-header {
    padding: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid #333;
    text-align: center;
  }
  
  .ui-header h2 {
    color: #4ecdc4;
    margin-bottom: 8px;
  }
  
  .ui-header p {
    color: #888;
    font-size: 0.9em;
  }
  
  .tabs {
    display: flex;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid #333;
  }
  
  .tabs button {
    flex: 1;
    padding: 12px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
  }
  
  .tabs button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .tabs button.active {
    border-bottom-color: #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
  }
  
  .tab-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }
  
  .intentions-tab,
  .connections-tab,
  .profile-tab {
    height: 100%;
  }
  
  .current-intention {
    margin-bottom: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  .primary-intention {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.1em;
    color: #4ecdc4;
  }
  
  .no-intention {
    color: #888;
    font-style: italic;
  }
  
  .intentions-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .intention-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid #444;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .intention-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #4ecdc4;
  }
  
  .intention-btn.active {
    background: rgba(78, 205, 196, 0.2);
    border-color: #4ecdc4;
  }
  
  .connection-item {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
    border-left: 3px solid #4ecdc4;
  }
  
  .connection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .user-name {
    font-weight: bold;
    color: #4ecdc4;
  }
  
  .connection-strength {
    color: #ffd93d;
  }
  
  .profile-field {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #333;
  }
`;

// Добавляем стили
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default UserInterface;
