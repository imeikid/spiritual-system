import { create } from 'zustand';

interface Permission {
  module: 'matching' | 'analytics' | 'moderation' | 'system';
  level: 'read' | 'write' | 'admin';
}

interface BehaviorPattern {
  type: 'consistent' | 'contradictory' | 'evolving';
  confidence: number;
  lastUpdated: Date;
}

interface UserIntention {
  id: string;
  type: 'learning' | 'collaboration' | 'support' | 'creative' | 'social';
  description: string;
  emoji: string;
  priority: number;
  createdAt: Date;
}

interface SystemState {
  currentMode: 'room' | 'cabinet';
  realityTransition: boolean;
  currentUser: any;
  
  permissions: {
    yara: any;
    terminal: any;
  };
  
  switchMode: (mode: 'room' | 'cabinet') => void;
  setUserIntention: (intention: UserIntention) => void;
  analyzeHonesty: (userId: string) => number;
  hasPermission: (module: string, level: string) => boolean;
}

export const useSystemStore = create<SystemState>((set, get) => ({
  currentMode: 'room',
  realityTransition: false,
  
  currentUser: {
    id: 'yara-001',
    name: 'Яра',
    role: 'yara',
    trustLevel: 4,
    honestyScore: 0.95,
    permissions: [
      { module: 'matching', level: 'admin' },
      { module: 'analytics', level: 'admin' },
      { module: 'moderation', level: 'admin' },
      { module: 'system', level: 'admin' }
    ],
    behaviorPatterns: [
      { type: 'consistent', confidence: 0.9, lastUpdated: new Date() }
    ]
  },
  
  permissions: {
    yara: {
      matching: 'admin',
      analytics: 'admin',
      moderation: 'admin',
      system: 'admin'
    },
    terminal: {
      matching: 'read',
      analytics: 'read',
      moderation: 'read',
      system: 'read'
    }
  },
  
  switchMode: (mode) => {
    set({ realityTransition: true });
    
    setTimeout(() => {
      set({ 
        currentMode: mode,
        realityTransition: false 
      });
    }, 800);
  },
  
  setUserIntention: (intention) => {
    const state = get();
    const honestyScore = get().analyzeHonesty(state.currentUser.id);
    
    set({
      currentUser: {
        ...state.currentUser,
        honestyScore
      }
    });
  },
  
  analyzeHonesty: (userId) => {
    const baseScore = 0.7;
    const behaviorBonus = 0.2;
    const consistencyBonus = 0.1;
    
    return Math.min(baseScore + behaviorBonus + consistencyBonus, 1);
  },
  
  hasPermission: (module, level) => {
    const state = get();
    const userRole = state.currentUser.role;
    const userPermissions = state.permissions[userRole];
    
    const permissionLevels: any = { 'read': 1, 'write': 2, 'admin': 3 };
    const requiredLevel = permissionLevels[level];
    const userLevel = permissionLevels[userPermissions[module]];
    
    return userLevel >= requiredLevel;
  }
}));
