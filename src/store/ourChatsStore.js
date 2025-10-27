import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useOurChatsStore = create(
  persist(
    (set, get) => ({
      ourChats: {},
      activeOurChatId: null,
      
      createOurChat: (chatId, title = 'Наш диалог') => {
        set(state => ({
          ourChats: {
            ...state.ourChats,
            [chatId]: {
              id: chatId,
              title,
              messages: [], // Здесь хранятся только пользовательские сообщения
              participants: ['user', 'ai'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              // Временные сообщения AI (не сохраняются)
              tempAiMessages: {}
            }
          },
          activeOurChatId: chatId
        }))
      },
      
      // Сохраняем только пользовательские сообщения
      addUserMessage: (chatId, message) => {
        const messageWithId = {
          ...message,
          id: `user-${chatId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        }
        
        set(state => ({
          ourChats: {
            ...state.ourChats,
            [chatId]: {
              ...state.ourChats[chatId],
              messages: [...(state.ourChats[chatId]?.messages || []), messageWithId],
              updatedAt: new Date().toISOString()
            }
          }
        }))
        
        return messageWithId.id
      },
      
      // Добавляем временные сообщения AI (не сохраняются)
      addTempAiMessage: (chatId, message, userMessageId) => {
        const messageWithId = {
          ...message,
          id: `ai-${chatId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          // Связываем с пользовательским сообщением
          respondsTo: userMessageId
        }
        
        set(state => ({
          ourChats: {
            ...state.ourChats,
            [chatId]: {
              ...state.ourChats[chatId],
              tempAiMessages: {
                ...state.ourChats[chatId]?.tempAiMessages,
                [userMessageId]: messageWithId
              }
            }
          }
        }))
        
        return messageWithId.id
      },
      
      // Получить все сообщения для отображения (пользовательские + временные AI)
      getChatWithAiMessages: (chatId) => {
        const state = get()
        const chat = state.ourChats[chatId]
        if (!chat) return null
        
        // Собираем все сообщения: пользовательские + AI ответы
        const allMessages = []
        chat.messages.forEach(userMsg => {
          // Добавляем пользовательское сообщение
          allMessages.push(userMsg)
          
          // Добавляем ответ AI если есть
          const aiResponse = chat.tempAiMessages?.[userMsg.id]
          if (aiResponse) {
            allMessages.push(aiResponse)
          }
        })
        
        return {
          ...chat,
          allMessages: allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        }
      },
      
      switchOurChat: (chatId) => {
        set({ activeOurChatId: chatId })
      },
      
      getActiveOurChat: () => {
        const state = get()
        return state.ourChats[state.activeOurChatId]
      },
      
      getActiveChatWithAi: () => {
        const state = get()
        return state.getChatWithAiMessages(state.activeOurChatId)
      },
      
      getAllOurChats: () => {
        const state = get()
        return Object.values(state.ourChats).sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      },
      
      deleteOurChat: (chatId) => {
        set(state => {
          const newChats = { ...state.ourChats }
          delete newChats[chatId]
          
          return {
            ourChats: newChats,
            activeOurChatId: state.activeOurChatId === chatId ? null : state.activeOurChatId
          }
        })
      },
      
      // Очистить временные сообщения AI (например, при перезагрузке)
      clearTempAiMessages: (chatId) => {
        set(state => ({
          ourChats: {
            ...state.ourChats,
            [chatId]: {
              ...state.ourChats[chatId],
              tempAiMessages: {}
            }
          }
        }))
      }
    }),
    {
      name: 'our-chats-storage',
      // Сохраняем только то, что нужно
      partialize: (state) => ({
        ourChats: Object.fromEntries(
          Object.entries(state.ourChats).map(([chatId, chat]) => [
            chatId,
            {
              ...chat,
              // Не сохраняем временные сообщения AI
              tempAiMessages: {}
            }
          ])
        ),
        activeOurChatId: state.activeOurChatId
      })
    }
  )
)
