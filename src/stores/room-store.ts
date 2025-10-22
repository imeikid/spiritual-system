import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  position: [number, number, number];
  intentions: UserIntention[];
  primaryIntention: UserIntention | null;
  trustLevel: number;
  energy: number;
  honestyScore: number;
}

interface UserIntention {
  id: string;
  type: 'learning' | 'collaboration' | 'support' | 'creative' | 'social';
  description: string;
  emoji: string;
  priority: number;
  createdAt: Date;
}

interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  strength: number;
  sharedIntentions: string[];
  createdAt: Date;
}

interface Interaction {
  id: string;
  userId1: string;
  userId2: string;
  type: string;
  strength: number;
}

interface RoomState {
  users: User[];
  currentUser: User;
  connections: Connection[];
  activeInteractions: Interaction[];
  intentionsCatalog: UserIntention[];
  
  // Действия
  setUserIntention: (intention: UserIntention) => void;
  updateUserPosition: (position: [number, number, number]) => void;
  findMatchingUsers: () => Connection[];
  joinRoom: (user: Partial<User>) => void;
  leaveRoom: (userId: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'id'>) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  users: [],
  currentUser: {
    id: 'user-1',
    name: 'Вы',
    position: [0, 0, 0],
    intentions: [],
    primaryIntention: null,
    trustLevel: 1,
    energy: 0.8,
    honestyScore: 0.9
  },
  connections: [],
  activeInteractions: [],
  
  intentionsCatalog: [
    { id: 'learn-psychology', type: 'learning', description: 'Изучить психологию', emoji: '🧠', priority: 1, createdAt: new Date() },
    { id: 'collab-project', type: 'collaboration', description: 'Совместный проект', emoji: '🤝', priority: 1, createdAt: new Date() },
    { id: 'emotional-support', type: 'support', description: 'Эмоциональная поддержка', emoji: '💝', priority: 1, createdAt: new Date() },
    { id: 'creative-work', type: 'creative', description: 'Творческая работа', emoji: '🎨', priority: 1, createdAt: new Date() },
    { id: 'socialize', type: 'social', description: 'Пообщаться', emoji: '👥', priority: 1, createdAt: new Date() },
    { id: 'meditation', type: 'support', description: 'Совместная медитация', emoji: '🧘', priority: 1, createdAt: new Date() }
  ],
  
  setUserIntention: (intention: UserIntention) => {
    const state = get();
    const updatedIntentions = [...state.currentUser.intentions.filter(i => i.id !== intention.id), intention];
    const primaryIntention = updatedIntentions.sort((a, b) => b.priority - a.priority)[0] || null;
    
    set({
      currentUser: {
        ...state.currentUser,
        intentions: updatedIntentions,
        primaryIntention
      }
    });
    
    // Автоматически ищем совпадения после установки намерения
    get().findMatchingUsers();
  },
  
  updateUserPosition: (position: [number, number, number]) => {
    const state = get();
    set({
      currentUser: {
        ...state.currentUser,
        position
      }
    });
  },
  
  findMatchingUsers: () => {
    const state = get();
    const currentUser = state.currentUser;
    
    if (!currentUser.primaryIntention) return [];
    
    const newConnections: Connection[] = [];
    
    state.users.forEach(otherUser => {
      if (otherUser.id === currentUser.id) return;
      
      if (otherUser.primaryIntention && otherUser.primaryIntention.type === currentUser.primaryIntention.type) {
        const strength = calculateConnectionStrength(currentUser, otherUser);
        
        newConnections.push({
          id: `conn-${currentUser.id}-${otherUser.id}-${Date.now()}`,
          userId1: currentUser.id,
          userId2: otherUser.id,
          strength,
          sharedIntentions: [currentUser.primaryIntention.type],
          createdAt: new Date()
        });

        // Добавляем взаимодействие для визуализации
        get().addInteraction({
          userId1: currentUser.id,
          userId2: otherUser.id,
          type: 'connection',
          strength
        });
      }
    });
    
    set({ connections: newConnections });
    return newConnections;
  },
  
  joinRoom: (userData: Partial<User>) => {
    const state = get();
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name || 'Аноним',
      position: userData.position || [Math.random() * 20 - 10, 0, Math.random() * 20 - 10],
      intentions: userData.intentions || [],
      primaryIntention: userData.primaryIntention || null,
      trustLevel: userData.trustLevel || 1,
      energy: userData.energy || 0.5,
      honestyScore: userData.honestyScore || 0.7
    };
    
    set({
      users: [...state.users, newUser]
    });
  },
  
  leaveRoom: (userId: string) => {
    const state = get();
    set({
      users: state.users.filter(user => user.id !== userId),
      connections: state.connections.filter(conn => 
        conn.userId1 !== userId && conn.userId2 !== userId
      )
    });
  },

  addInteraction: (interaction: Omit<Interaction, 'id'>) => {
    const state = get();
    const newInteraction: Interaction = {
      ...interaction,
      id: `interaction-${Date.now()}`
    };

    set({
      activeInteractions: [...state.activeInteractions, newInteraction]
    });

    // Автоматически удаляем взаимодействие через 5 секунд
    setTimeout(() => {
      const currentState = get();
      set({
        activeInteractions: currentState.activeInteractions.filter(i => i.id !== newInteraction.id)
      });
    }, 5000);
  }
}));

// Вспомогательная функция для расчета силы связи
const calculateConnectionStrength = (user1: User, user2: User): number => {
  let strength = 0;
  
  // Совпадение по основному намерению
  if (user1.primaryIntention?.type === user2.primaryIntention?.type) {
    strength += 0.6;
  }
  
  // Близость в пространстве
  const distance = Math.sqrt(
    Math.pow(user1.position[0] - user2.position[0], 2) +
    Math.pow(user1.position[1] - user2.position[1], 2) +
    Math.pow(user1.position[2] - user2.position[2], 2)
  );
  
  if (distance < 5) strength += 0.3;
  else if (distance < 10) strength += 0.1;
  
  // Уровень доверия
  strength += (user1.trustLevel + user2.trustLevel) * 0.05;
  
  return Math.min(strength, 1);
};

// Инициализация демо-пользователей
setTimeout(() => {
  const store = useRoomStore.getState();
  
  store.joinRoom({
    name: 'Анна',
    position: [5, 0, 3],
    primaryIntention: store.intentionsCatalog[0],
    trustLevel: 2,
    energy: 0.7,
    honestyScore: 0.8
  });
  
  store.joinRoom({
    name: 'Максим', 
    position: [-3, 0, 6],
    primaryIntention: store.intentionsCatalog[1],
    trustLevel: 3,
    energy: 0.9,
    honestyScore: 0.95
  });
  
  store.joinRoom({
    name: 'София',
    position: [2, 0, -4],
    primaryIntention: store.intentionsCatalog[0],
    trustLevel: 1,
    energy: 0.6,
    honestyScore: 0.7
  });
}, 1000);
