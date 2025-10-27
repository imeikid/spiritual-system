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
              messages: [],
              participants: ['user', 'ai'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          activeOurChatId: chatId
        }))
      },
      
      addOurMessage: (chatId, message) => {
        const messageWithId = {
          ...message,
          id: `our-${chatId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
      
      switchOurChat: (chatId) => {
        set({ activeOurChatId: chatId })
      },
      
      getActiveOurChat: () => {
        const state = get()
        return state.ourChats[state.activeOurChatId]
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
      }
    }),
    {
      name: 'our-chats-storage',
    }
  )
)
