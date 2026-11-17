// constants/theme.ts
export const getTheme = (isDarkMode: boolean) => {
  return {
    isDarkMode,
    bg: isDarkMode ? '#000000' : '#F4F4F5',
    card: isDarkMode ? '#121214' : '#FFFFFF',
    subCard: isDarkMode ? '#1A1A1E' : '#E4E4E7',
    border: isDarkMode ? '#27272A' : '#D4D4D8', // Perfect depth separation border
    text: isDarkMode ? '#FFFFFF' : '#09090B',
    subText: isDarkMode ? '#A1A1AA' : '#71717A',
    muted: isDarkMode ? '#71717A' : '#A1A1AA',
    primaryBtn: isDarkMode ? '#FFFFFF' : '#09090B',
    primaryBtnText: isDarkMode ? '#000000' : '#FFFFFF',
    green: '#10B981',
    greenSoft: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
    red: '#EF4444',
    redSoft: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
  };
};