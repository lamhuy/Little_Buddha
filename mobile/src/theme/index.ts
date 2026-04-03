export const theme = {
  colors: {
    background: '#F7F6F0', // Calming off-white
    primary: '#D4AF37',    // Muted gold/saffron variant
    secondary: '#2C3E50',  // Deep slate
    text: '#34495E',       // Soft dark grey
    textLight: '#7F8C8D',  // Subtle grey
    error: '#E74C3C',
    surface: '#FFFFFF',
    border: '#E0E0E0'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40
  },
  typography: {
    header: {
      fontSize: 28,
      fontWeight: '600' as const,
      color: '#2C3E50'
    },
    subHeader: {
      fontSize: 20,
      fontWeight: '600' as const,
      color: '#D4AF37'
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: '#34495E'
    },
    caption: {
      fontSize: 14,
      color: '#7F8C8D'
    }
  },
  layout: {
    borderRadius: 8,
    cardRadius: 12,
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    }
  }
};
