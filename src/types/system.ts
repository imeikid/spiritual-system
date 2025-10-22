export interface User {
  id: string;
  name: string;
  spiritualLevel: number;
  connectionStrength: number;
}

export interface AIConversation {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIGuidance {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface UserMetrics {
  practiceConsistency: number;
  growthVelocity: number;
  patternStability: number;
  milestoneFrequency: number;
}

export interface BehaviorPattern {
  id: string;
  name: string;
  description: string;
  strength: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  impact: number;
  category: string;
}

export interface GrowthPrediction {
  period: string;
  predictedGrowth: number;
  confidence: number;
  factors: string[];
}

export interface ConnectedUser {
  id: string;
  name: string;
  spiritualLevel: number;
  status: 'online' | 'offline' | 'busy';
  currentActivity: string;
}

export interface Session {
  id: string;
  name: string;
  host: User;
  participants: ConnectedUser[];
  activityType: string;
  startTime: Date;
  endTime: Date;
}

export interface GroupActivity {
  id: string;
  name: string;
  description: string;
  participants: number;
  maxParticipants: number;
  spiritualFocus: string;
}

export interface SessionInvitation {
  id: string;
  session: Session;
  invitedBy: User;
  expiresAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  reward: QuestReward;
  expiresAt: Date;
}

export interface QuestObjective {
  type: string;
  target: number;
  current: number;
}

export interface QuestReward {
  xp: number;
  items: string[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'xp' | 'item' | 'badge';
  value: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  level: number;
  xp: number;
  rank: number;
}

export interface SpiritualAction {
  type: string;
  data: any;
  timestamp: Date;
}

export interface ActionResponse {
  success: boolean;
  recommendations: AIGuidance[];
  rewards: Reward[];
}
