// utils/responsive.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTablet = width >= 768;

export const getResponsivePadding = () => {
  if (isTablet) {
    return 36; // Tablet ke liye thodi zyada classy padding
  }
  return 16;   // Mobile ke liye compact padding
};

export const getMaxContentWidth = () => {
  if (isTablet) {
    return 720; // Tablet par content limit rahega taಕಿ poori screen par stretch na ho
  }
  return '100%';
};