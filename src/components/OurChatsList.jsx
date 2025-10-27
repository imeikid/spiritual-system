import { useOurChatsStore } from '../store/ourChatsStore'

function OurChatsList({ onSelectChat }) {
  const { 
    getAllOurChats, 
    activeOurChatId, 
    deleteOurChat,
    createOurChat 
  } = useOurChatsStore()
  
  const ourChats = getAllOurChats()
  
  const handleCreateNewChat = () => {
    const newChatId = `our-chat-${Date.now()}`
    createOurChat(newChatId, `Новый диалог ${new Date().toLocaleDateString()}`)
    onSelectChat?.(newChatId)
  }
  
  return (
    <div className="our-chats-list">
      <div className="chats-header">
        <h3>Наши диалоги</h3>
        <button onClick={handleCreateNewChat}>+ Новый</button>
      </div>
      
      <div className="chats-container">
        {ourChats.map(chat => (
          <div 
            key={chat.id} 
            className={`chat-item ${activeOurChatId === chat.id ? 'active' : ''}`}
            onClick={() => onSelectChat?.(chat.id)}
          >
            <div className="chat-info">
              <strong>{chat.title}</strong>
              <small>
                {chat.messages.length} сообщений  
                {new Date(chat.updatedAt).toLocaleDateString()}
              </small>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Удалить этот диалог?')) {
                  deleteOurChat(chat.id)
                }
              }}
              className="delete-btn"
            >
              
            </button>
          </div>
        ))}
        
        {ourChats.length === 0 && (
          <div className="empty-state">
            <p>У вас пока нет сохраненных диалогов</p>
            <button onClick={handleCreateNewChat}>Создать первый диалог</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OurChatsList
