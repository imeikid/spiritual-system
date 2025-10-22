import { create } from 'zustand';

// ... (предыдущие интерфейсы остаются)

interface RealityState {
  currentReality: 'cabinet' | 'world';
  realityTransition: boolean;
}

interface ExtendedSystemState extends IntegratedSystemState {
  reality: RealityState;
  toggleReality: () => void;
  setUserGoals: (goals: UserGoals) => void;
  processAIMessageWithKnowledge: (message: string) => Promise<string>;
}

export const useIntegratedSystemStore = create<ExtendedSystemState>((set, get) => ({
  // ... (предыдущее состояние)
  
  reality: {
    currentReality: 'cabinet',
    realityTransition: false
  },
  
  toggleReality: () => {
    set({ reality: { ...get().reality, realityTransition: true } });
    
    setTimeout(() => {
      const newReality = get().reality.currentReality === 'cabinet' ? 'world' : 'cabinet';
      set({ 
        reality: { 
          currentReality: newReality,
          realityTransition: false 
        } 
      });
    }, 1500);
  },
  
  setUserGoals: (goals: UserGoals) => {
    // Сохранение целей пользователя
    localStorage.setItem('userGoals', JSON.stringify(goals));
    set({ user: { ...get().user, goals } });
  },
  
  processAIMessageWithKnowledge: async (message: string): Promise<string> => {
    // База знаний психологов и философов
    const knowledgeBase = {
      freud: {
        concepts: ['бессознательное', 'либидо', 'эдипов комплекс', 'сновидения', 'вытеснение'],
        quotes: [
          '«Сновидение — королевская дорога в бессознательное»',
          '«Там, где было Оно, должно стать Я»',
          '«Первый человек, который бросил ругательство вместо камня, был основателем цивилизации»'
        ]
      },
      jung: {
        concepts: ['коллективное бессознательное', 'архетипы', 'анима/анимус', 'тень', 'самость'],
        quotes: [
          '«Встреча двух личностей подобна контакту двух химических веществ: если есть хоть малейшая реакция, изменяются оба»',
          '«Я не то, что со мной случилось, я то, чем я решил стать»',
          '«Ваше видение станет ясным, только если вы сможете заглянуть в собственное сердце»'
        ]
      },
      frankl: {
        concepts: ['логотерапия', 'смысл жизни', 'экзистенциальный вакуум', 'трагический оптимизм'],
        quotes: [
          '«У человека можно отнять все, кроме одного: последней свободы человека — выбирать собственное отношение к любым обстоятельствам»',
          '«Страдание перестает быть страданием в тот момент, когда оно обретает смысл»'
        ]
      },
      // Добавьте больше психологов и философов...
    };
    
    // Простой анализ сообщения и подбор ответа
    const lowerMessage = message.toLowerCase();
    let response = "Я анализирую ваш запрос с точки зрения глубинной психологии и философии...\n\n";
    
    // Поиск ключевых слов и подбор цитат
    if (lowerMessage.includes('смысл') || lowerMessage.includes('цель')) {
      response += knowledgeBase.frankl.quotes[0] + " - Виктор Франкл\n\n";
    }
    
    if (lowerMessage.includes('бессознательное') || lowerMessage.includes('сны')) {
      response += knowledgeBase.freud.quotes[0] + " - Зигмунд Фрейд\n\n";
    }
    
    if (lowerMessage.includes('личность') || lowerMessage.includes('изменение')) {
      response += knowledgeBase.jung.quotes[0] + " - Карл Густав Юнг\n\n";
    }
    
    response += "На основе работ: Фрейд, Юнг, Франкл, Адлер, Фромм, Маслоу, Роджерс";
    
    return response;
  }
}));
