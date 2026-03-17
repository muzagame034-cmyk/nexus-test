/**
 * PageLayout Component
 * Wraps all pages with navbar, background, and consistent padding
 */

import React from 'react';
import Navbar from './Navbar';
import ThreeBackground from '../threejs/ThreeBackground';
import LiteBackground from '../threejs/LiteBackground';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

function LiteModeRecommendation({ onAccept, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        background: 'rgba(12,12,34,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,149,0,0.4)',
        borderRadius: '12px', padding: '16px 20px',
        maxWidth: '320px', zIndex: 2000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '6px', color: '#ff9500', fontSize: '14px' }}>
        ⚡ Performance Notice
      </p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '14px', lineHeight: '1.5' }}>
        Low FPS detected. Switch to Lite Mode for a smoother experience?
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onAccept} style={{
          flex: 1, padding: '8px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
          border: 'none', color: '#020209',
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '12px', cursor: 'pointer',
        }}>
          Use Lite Mode
        </button>
        <button onClick={onDismiss} style={{
          padding: '8px 14px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'transparent', color: 'rgba(255,255,255,0.5)',
          fontSize: '12px', cursor: 'pointer',
        }}>
          No thanks
        </button>
      </div>
    </motion.div>
  );
}

function PageLayout({ children, fullscreen = false }) {
  const { is3DMode, showLiteModeRecommendation, toggle3DMode, dismissRecommendation } = useTheme();

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background layer */}
      {is3DMode ? <ThreeBackground /> : <LiteBackground />}

      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        paddingTop: fullscreen ? '0' : '100px',
        minHeight: '100vh',
      }}>
        {children}
      </main>

      {/* Lite Mode Recommendation */}
      <AnimatePresence>
        {showLiteModeRecommendation && (
          <LiteModeRecommendation
            onAccept={() => { toggle3DMode(); dismissRecommendation(); }}
            onDismiss={dismissRecommendation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PageLayout;
