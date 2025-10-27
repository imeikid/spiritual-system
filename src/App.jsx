import { useState, useEffect } from 'react'
import { useOurChatsStore } from './store/ourChatsStore'
import OurChatsList from './components/OurChatsList'
import OurChatComponent from './components/OurChatComponent'
import './App.css'

function App() {
  const [currentChatId, setCurrentChatId] = useState(null)
  const { 
    createOurChat, 
    getAllOurChats 
  } = useOurChatsStore()

  // Автоматически создаем чат при первом запуске, если нет других чатов
  useEffect(() => {
    const allChats = getAllOurChats()
    if (allChats.length === 0) {
      const initialChatId = `our-chat-${Date.now()}`
      createOurChat(initialChatId, 'Мой первый диалог')
      setCurrentChatId(initialChatId)
    }
  }, [])

  // Функция для начала нового чата
  const startBrandNewChat = () => {
    const newChatId = `our-chat-${Date.now()}`
    createOurChat(newChatId, `Новый диалог ${new Date().toLocaleDateString()}`)
    setCurrentChatId(newChatId)
    return newChatId
  }

  // Функция для обработки ответов AI (ты можешь заменить эту логику)
  const handleAiResponse = async (userMessage, messageHistory) => {
    // Здесь будет твоя логика для генерации ответа AI
    // Например, вызов API или локальная обработка
    
    // Пока используем простую заглушку
    return new Promise((resolve) => {
      setTimeout(() => {
        // Используем историю сообщений для контекста
        const context = messageHistory
          .slice(-3) // Берем последние 3 сообщения для контекста
          .map(msg => msg.text)
          .join(' | ')
        
        resolve(`Ответ на: "${userMessage}" 
        
Контекст: ${context || 'нет истории'}`)
      }, 1500)
    })
  }

  return (
    <div className="app">
      <div className="sidebar">
        <OurChatsList onSelectChat={setCurrentChatId} />
        <button 
          onClick={startBrandNewChat}
          className="new-chat-btn"
        >
          + Новый чат
        </button>
      </div>
      
      <div className="main-content">
        {currentChatId ? (
          <OurChatComponent 
            chatId={currentChatId}
            onAiResponse={handleAiResponse}
          />
        ) : (
          <div className="welcome-message">
            <h2>💬 Сохранение контекста чата</h2>
            <p>Ваши сообщения сохраняются постоянно, ответы AI - только в течение сессии</p>
            <button onClick={startBrandNewChat}>Начать новый чат</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
