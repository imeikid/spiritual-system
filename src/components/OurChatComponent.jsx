import { useEffect } from 'react'
import { useOurChatsStore } from '../store/ourChatsStore'

function OurChatComponent({ chatId, autoCreate = true }) {
  const { 
    activeOurChatId, 
    ourChats, 
    addOurMessage, 
    switchOurChat,
    createOurChat,
    getActiveOurChat
  } = useOurChatsStore()
  
  useEffect(() => {
    if (chatId) {
      if (!ourChats[chatId] && autoCreate) {
        createOurChat(chatId, `Наш диалог ${new Date().toLocaleDateString()}`)
      } else {
        switchOurChat(chatId)
      }
    }
  }, [chatId, autoCreate])
  
  const currentChat = getActiveOurChat()
  
  const handleSendMessage = (text, sender = 'user') => {
    if (!activeOurChatId) return
    
    const messageId = addOurMessage(activeOurChatId, {
      text,
      sender,
      type: 'text'
    })
    
    console.log(`Наше сообщение сохранено с ID: ${messageId}`)
    return messageId
  }
  
  const handleAiResponse = (text) => {
    return handleSendMessage(text, 'ai')
  }
  
  if (!currentChat) {
    return <div>Выберите или создайте диалог</div>
  }
  
  return (
    <div className="our-chat">
      <div className="chat-header">
        <h3>{currentChat.title}</h3>
        <small>Обновлен: {new Date(currentChat.updatedAt).toLocaleString()}</small>
      </div>
      
      <div className="messages-container">
        {currentChat.messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <span className="sender">
                {message.sender === 'user' ? ' Вы' : ' AI'}
              </span>
              <p>{message.text}</p>
            </div>
            <div className="message-meta">
              <small>{new Date(message.timestamp).toLocaleTimeString()}</small>
              <small className="message-id">ID: {message.id}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OurChatComponent
