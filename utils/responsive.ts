// utils/responsive.ts
import { Dimensions, Platform } from 'react-native';

export const getWindowDimensions = () => Dimensions.get('window');

export const isTabletOrDesktop = () => {
  const { width } = getWindowDimensions();
  return width >= 768;
};

export const getResponsivePadding = () => {
  const { width } = getWindowDimensions();
  if (width >= 1024) return 32; // Desktop/Laptop wide padding
  if (width >= 768) return 24;  // Tablet
  return 14;                    // Mobile
};

export const getMaxContentWidth = () => {
  const { width } = getWindowDimensions();
  if (width >= 1024) return 900;  // Professional desktop container limit
  if (width >= 768) return 700;   // Tablet width limit
  return '100%';
};