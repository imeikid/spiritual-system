import { useEffect, useState } from 'react'
import { useOurChatsStore } from '../store/ourChatsStore'

function OurChatComponent({ chatId, autoCreate = true, onAiResponse }) {
  const { 
    activeOurChatId, 
    ourChats, 
    addUserMessage, 
    addTempAiMessage,
    switchOurChat,
    createOurChat,
    getActiveChatWithAi,
    getChatWithAiMessages
  } = useOurChatsStore()
  
  const [newMessage, setNewMessage] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  
  useEffect(() => {
    if (chatId) {
      if (!ourChats[chatId] && autoCreate) {
        createOurChat(chatId, `Наш диалог ${new Date().toLocaleDateString()}`)
      } else {
        switchOurChat(chatId)
      }
    }
  }, [chatId, autoCreate])
  
  const currentChatWithAi = getActiveChatWithAi()
  const currentChat = ourChats[activeOurChatId]
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeOurChatId) return
    
    // Сохраняем сообщение пользователя (это сохранится)
    const userMessageId = addUserMessage(activeOurChatId, {
      text: newMessage,
      sender: 'user',
      type: 'text'
    })
    
    setNewMessage('')
    setIsAiThinking(true)
    
    // Вызываем колбэк для получения ответа AI
    if (onAiResponse) {
      try {
        const aiResponse = await onAiResponse(newMessage, currentChat?.messages || [])
        
        // Добавляем временный ответ AI (не сохранится)
        if (aiResponse) {
          addTempAiMessage(activeOurChatId, {
            text: aiResponse,
            sender: 'ai',
            type: 'text'
          }, userMessageId)
        }
      } catch (error) {
        console.error('Error getting AI response:', error)
        // Добавляем сообщение об ошибке
        addTempAiMessage(activeOurChatId, {
          text: 'Извините, произошла ошибка при обработке запроса.',
          sender: 'ai',
          type: 'text'
        }, userMessageId)
      } finally {
        setIsAiThinking(false)
      }
    } else {
      // Если колбэк не передан, добавляем заглушку
      setTimeout(() => {
        addTempAiMessage(activeOurChatId, {
          text: `Это ответ на: "${newMessage}"`,
          sender: 'ai',
          type: 'text'
        }, userMessageId)
        setIsAiThinking(false)
      }, 1000)
    }
    
    return userMessageId
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!currentChat) {
    return <div>Загрузка чата...</div>
  }
  
  return (
    <div className="our-chat">
      <div className="chat-header">
        <h3>{currentChat.title}</h3>
        <small>
          Сохраненных сообщений: {currentChat.messages.length} |
          Обновлен: {new Date(currentChat.updatedAt).toLocaleString()}
        </small>
      </div>
      
      <div className="messages-container">
        {currentChatWithAi?.allMessages?.length === 0 ? (
          <div className="welcome-message">
            <p>💬 Начните новый диалог! Ваши сообщения будут сохранены.</p>
            <small>Ответы AI хранятся только в течение сессии</small>
          </div>
        ) : (
          currentChatWithAi?.allMessages?.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <span className="sender">
                  {message.sender === 'user' ? '👤 Вы' : '🤖 AI'}
                  {message.sender === 'ai' && <span className="temp-badge">(временный)</span>}
                </span>
                <p>{message.text}</p>
              </div>
              <div className="message-meta">
                <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
                <small className="message-id">
                  {message.sender === 'user' ? '💾' : '⚡'} 
                  {message.id.slice(-6)}
                </small>
              </div>
            </div>
          ))
        )}
        
        {isAiThinking && (
          <div className="message ai thinking">
            <div className="message-content">
              <span className="sender">🤖 AI</span>
              <p className="thinking-text">Думаю...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваше сообщение (будет сохранено)..."
          rows="3"
        />
        <button onClick={handleSendMessage} disabled={!newMessage.trim() || isAiThinking}>
          {isAiThinking ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
      
      <div className="storage-info">
        <small>
          💾 Сохраняются только ваши сообщения | 
          ⚡ Ответы AI временные (только в этой сессии)
        </small>
      </div>
    </div>
  )
}

export default OurChatComponent
