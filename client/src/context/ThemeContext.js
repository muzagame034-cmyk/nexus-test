/**
 * Theme Context
 * Manages 3D Mode vs Lite Mode toggle
 * Detects low-end devices and recommends Lite Mode
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

// Detect if device is likely low-end
const detectLowEndDevice = () => {
  // Check for device memory (if available)
  if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;

  // Check hardware concurrency (CPU cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;

  // Check for mobile/tablet user agents
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return true;

  return false;
};

export function ThemeProvider({ children }) {
  const [is3DMode, setIs3DMode] = useState(true);
  const [showLiteModeRecommendation, setShowLiteModeRecommendation] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('nexus_display_mode');

    if (savedMode) {
      setIs3DMode(savedMode === '3d');
    } else {
      // Auto-detect low-end device
      const isLowEnd = detectLowEndDevice();
      if (isLowEnd) {
        setIs3DMode(false);
        setShowLiteModeRecommendation(true);
        localStorage.setItem('nexus_display_mode', 'lite');
      }
    }
  }, []);

  // FPS Monitor — switches to lite mode if FPS drops below 20
  useEffect(() => {
    if (!is3DMode) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;
    let monitored = false;

    const measureFPS = (currentTime) => {
      frameCount++;
      if (currentTime - lastTime >= 3000) { // Measure every 3 seconds
        const measuredFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(measuredFPS);

        if (measuredFPS < 20 && !monitored) {
          monitored = true;
          setShowLiteModeRecommendation(true);
        }

        frameCount = 0;
        lastTime = currentTime;
      }
      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [is3DMode]);

  const toggle3DMode = useCallback(() => {
    setIs3DMode(prev => {
      const newMode = !prev;
      localStorage.setItem('nexus_display_mode', newMode ? '3d' : 'lite');
      setShowLiteModeRecommendation(false);
      return newMode;
    });
  }, []);

  const dismissRecommendation = useCallback(() => {
    setShowLiteModeRecommendation(false);
  }, []);

  return (
    <ThemeContext.Provider value={{
      is3DMode,
      toggle3DMode,
      fps,
      showLiteModeRecommendation,
      dismissRecommendation
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
