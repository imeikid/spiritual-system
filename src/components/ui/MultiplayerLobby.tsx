import React from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

export const MultiplayerLobby: React.FC = () => {
  const { multiplayer, joinMultiplayerSession } = useIntegratedSystemStore();
  
  return (
    <div className="multiplayer-lobby">
      <div className="online-users">
        <h4>Онлайн пользователи ({multiplayer.connectedUsers.length})</h4>
        {multiplayer.connectedUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-level">Ур. {user.spiritualLevel}</span>
            </div>
            <span className="user-activity">{user.currentActivity}</span>
          </div>
        ))}
      </div>
      
      <div className="group-activities">
        <h4>Групповые активности</h4>
        {multiplayer.groupActivities.map(activity => (
          <div key={activity.id} className="activity">
            <div className="activity-info">
              <strong>{activity.name}</strong>
              <span>{activity.participants}/{activity.maxParticipants} участников</span>
            </div>
            <button 
              className="join-btn"
              onClick={() => joinMultiplayerSession(activity.id)}
            >
              Присоединиться
            </button>
          </div>
        ))}
      </div>
      
      <style>{`
        .multiplayer-lobby {
          height: 300px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .online-users h4,
        .group-activities h4 {
          margin: 0 0 10px 0;
          color: #4ecdc4;
          font-size: 0.9em;
        }
        
        .user-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 5px;
        }
        
        .user-info {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .user-name {
          font-size: 0.8em;
        }
        
        .user-level {
          font-size: 0.7em;
          color: #ff6b6b;
        }
        
        .user-activity {
          font-size: 0.7em;
          color: #96ceb4;
        }
        
        .activity {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          margin-bottom: 8px;
        }
        
        .activity-info {
          display: flex;
          flex-direction: column;
        }
        
        .activity-info strong {
          font-size: 0.8em;
        }
        
        .activity-info span {
          font-size: 0.7em;
          color: #ccc;
        }
        
        .join-btn {
          padding: 4px 8px;
          background: #4ecdc4;
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 0.7em;
          cursor: pointer;
        }
        
        .join-btn:hover {
          background: #45b7d1;
        }
      `}</style>
    </div>
  );
};
