import React, { useState } from 'react';
import { useIntegratedSystemStore } from '../../stores/integrated-system-store';

export const AIChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const { ai, sendAIMessage, processAIMessageWithKnowledge } = useIntegratedSystemStore();
  
  const handleSend = async () => {
    if (message.trim()) {
      // Используем расширенную обработку с базой знаний
      const aiResponse = await processAIMessageWithKnowledge(message);
      
      // Добавляем сообщение пользователя
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      };
      
      // Добавляем ответ ИИ
      const assistantMessage = {
        role: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      
      // Обновляем состояние
      sendAIMessage(message); // Это вызовет обычную функцию, нужно обновить логику
      
      setMessage('');
    }
  };

  const quickQuestions = [
    "Как найти смысл жизни?",
    "Что такое коллективное бессознательное?",
    "Как справляться с тревогой?",
    "Что говорит психология о сновидениях?",
    "Как развивать самосознание?"
  ];

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <h3>🧠 ИИ-Психолог (Фрейд, Юнг, Франкл)</h3>
        <div className="knowledge-indicator">
          База знаний: Психология 18-20 века
        </div>
      </div>
      
      <div className="quick-questions">
        <h4>Быстрые вопросы:</h4>
        <div className="questions-grid">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="quick-question-btn"
              onClick={() => setMessage(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chat-messages">
        {ai.conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Спросите о психологии, философии, смысле жизни..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>📨</button>
      </div>
      
      <style>{`
        .ai-chat {
          height: 400px;
          display: flex;
          flex-direction: column;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .chat-header h3 {
          margin: 0;
          color: #4ecdc4;
        }
        
        .knowledge-indicator {
          font-size: 0.8em;
          background: rgba(255, 215, 0, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
          border: 1px solid gold;
        }
        
        .quick-questions {
          margin-bottom: 10px;
        }
        
        .quick-questions h4 {
          margin: 0 0 8px 0;
          color: #ffd93d;
          font-size: 0.9em;
        }
        
        .questions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 5px;
        }
        
        .quick-question-btn {
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #444;
          border-radius: 15px;
          color: white;
          font-size: 0.8em;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
        }
        
        .quick-question-btn:hover {
          background: rgba(78, 205, 196, 0.2);
          border-color: #4ecdc4;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 10px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        
        .message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 15px;
          max-width: 80%;
        }
        
        .message.user {
          background: #4ecdc4;
          margin-left: auto;
          text-align: right;
        }
        
        .message.assistant {
          background: #6c757d;
          margin-right: auto;
          border-left: 3px solid #ffd93d;
        }
        
        .message-content {
          margin-bottom: 4px;
          white-space: pre-wrap;
        }
        
        .message-time {
          font-size: 0.7em;
          opacity: 0.7;
        }
        
        .chat-input {
          display: flex;
          gap: 8px;
        }
        
        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #444;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .chat-input button {
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          background: #4ecdc4;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
