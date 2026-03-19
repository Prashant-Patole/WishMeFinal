import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';

interface DrawerContextType {
  animValue: Animated.Value;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const isOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    isOpenRef.current = true;
    setIsOpen(true);
    Animated.spring(animValue, {
      toValue: 1,
      useNativeDriver: false,
      damping: 22,
      mass: 0.9,
      stiffness: 110,
    }).start();
  }, [animValue]);

  const close = useCallback(() => {
    isOpenRef.current = false;
    Animated.spring(animValue, {
      toValue: 0,
      useNativeDriver: false,
      damping: 22,
      mass: 0.9,
      stiffness: 130,
    }).start(() => {
      setIsOpen(false);
    });
  }, [animValue]);

  const toggle = useCallback(() => {
    if (isOpenRef.current) {
      close();
    } else {
      open();
    }
  }, [open, close]);

  return (
    <DrawerContext.Provider value={{ animValue, isOpen, open, close, toggle }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used inside DrawerProvider');
  return ctx;
}
