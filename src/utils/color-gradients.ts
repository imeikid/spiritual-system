export const getSpiritualColor = (conformity: number, level: number): string => {
  const colors = {
    0: ['#8B0000', '#DC143C', '#FF6347', '#FF7F50', '#FFA07A', '#FFB6C1', '#FFDAB9', '#FFE4E1'],
    1: ['#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887', '#D2B48C', '#BC8F8F', '#F5DEB3'],
    2: ['#006400', '#228B22', '#32CD32', '#90EE90', '#98FB98', '#8FBC8F', '#9ACD32', '#ADFF2F'],
    3: ['#00008B', '#0000CD', '#1E90FF', '#87CEEB', '#87CEFA', '#B0C4DE', '#B0E0E6', '#ADD8E6'],
  };
  
  const spectrum = colors[level as keyof typeof colors] || colors[0];
  const index = Math.floor(conformity * (spectrum.length - 1));
  return spectrum[Math.max(0, Math.min(spectrum.length - 1, index))];
};

export const calculateOrbitRadius = (baseRadius: number, activity: number): number => {
  return 0.1 + activity * 19.9;
};
