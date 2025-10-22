export const calculateVerticalPressure = (level: number, etalonForce: number): number => {
  const pressureFactors = [0.9, 0.7, 0.5, 0.3, 0.1];
  return etalonForce * (pressureFactors[level] || 0.1);
};

export const generateInsights = (state: any): string[] => {
  const insights: string[] = [];
  const overallConformity = Object.values(state.vertical).reduce((acc: number, level: any) => acc + level.conformity, 0) / 5;
  
  if (overallConformity < 0.3) {
    insights.push('Критическое рассогласование с духовным эталоном');
  }
  
  if (state.velocities.cyclic > 0.8) {
    insights.push('Высокая циклическая скорость - неосвоенные уроки повторяются');
  }
  
  if (state.velocities.diagonal > 0.6) {
    insights.push('Значительный диагональный снос - требуется коррекция курса');
  }
  
  if (state.etalonForce < 0.4) {
    insights.push('Низкая эталонная сила - необходимо углубление практики');
  }
  
  return insights;
};
