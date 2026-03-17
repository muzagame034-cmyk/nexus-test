/**
 * Navbar - with Language Switcher (UZ/RU/EN) + 3D/Lite toggle
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLang } from '../../context/LangContext';

const LANGS = [
  { code: 'uz', label: "O'Z", flag: '🇺🇿', name: "O'zbek" },
  { code: 'ru', label: 'РУ',  flag: '🇷🇺', name: 'Русский' },
  { code: 'en', label: 'EN',  flag: '🇬🇧', name: 'English' },
];

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00f5ff" strokeWidth="1.5" fill="rgba(0,245,255,0.1)" />
    <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#bf00ff" strokeWidth="1" fill="rgba(191,0,255,0.1)" />
    <circle cx="14" cy="14" r="3" fill="#00f5ff" />
  </svg>
);

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { is3DMode, toggle3DMode } = useTheme();
  const { lang, changeLang, t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { path: '/',            label: t('nav_home') },
    { path: '/dashboard',   label: t('nav_dashboard'),   auth: true },
    { path: '/leaderboard', label: t('nav_leaderboard') },
    { path: '/admin',       label: t('nav_admin'),       adminOnly: true },
  ].filter(l => {
    if (l.adminOnly) return isAdmin;
    if (l.auth) return isAuthenticated;
    return true;
  });

  const currentLang = LANGS.find(l => l.code === lang);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      <div style={{
        margin: '12px 16px',
        background: scrolled ? 'rgba(6,6,20,0.97)' : 'rgba(6,6,20,0.75)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '13px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <LogoIcon />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.05em' }}>
              NEXUS
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="nd" style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                padding: '8px 16px', borderRadius: '8px',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px',
                textDecoration: 'none',
                color: location.pathname === link.path ? '#00f5ff' : 'rgba(255,255,255,0.65)',
                background: location.pathname === link.path ? 'rgba(0,245,255,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>{link.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* === LANGUAGE SWITCHER === */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setLangOpen(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '6px 12px', borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'white', cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '16px' }}>{currentLang?.flag}</span>
                <span>{currentLang?.label}</span>
                <span style={{ fontSize: '9px', opacity: 0.5, marginLeft: '1px' }}>▾</span>
              </button>

              <AnimatePresence>
                {langOpen && (
                  <>
                    {/* backdrop */}
                    <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.14 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: '#0a0a1e',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px', padding: '6px',
                        minWidth: '140px', zIndex: 1001,
                        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                      }}
                    >
                      {LANGS.map(l => (
                        <button
                          key={l.code}
                          onClick={() => { changeLang(l.code); setLangOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            width: '100%', padding: '9px 12px', borderRadius: '8px',
                            border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: lang === l.code ? 'rgba(0,245,255,0.12)' : 'transparent',
                            color: lang === l.code ? '#00f5ff' : 'rgba(255,255,255,0.75)',
                            fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                          onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ fontSize: '19px' }}>{l.flag}</span>
                          <span>{l.name}</span>
                          {lang === l.code && <span style={{ marginLeft: 'auto', color: '#00f5ff', fontSize: '12px' }}>✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* 3D / Lite */}
            <button
              onClick={toggle3DMode}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 11px', borderRadius: '20px',
                border: `1px solid ${is3DMode ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
                background: is3DMode ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.04)',
                color: is3DMode ? '#00f5ff' : 'rgba(255,255,255,0.4)',
                fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <span>{is3DMode ? '◈' : '◇'}</span>
              <span className="nd">{is3DMode ? '3D' : 'LITE'}</span>
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '6px 12px', borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  textDecoration: 'none', color: 'white',
                  fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px',
                }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#020209' }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="nd">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="nd" style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,80,80,0.3)', background: 'rgba(255,80,80,0.07)', color: 'rgba(255,140,140,0.9)', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  {t('nav_logout')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '7px' }}>
                <Link to="/login" style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.06)', color: '#00f5ff', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 600, textDecoration: 'none' }}>
                  {t('nav_login')}
                </Link>
                <Link to="/register" className="nd" style={{ padding: '8px 16px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', color: '#020209', fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700, textDecoration: 'none' }}>
                  {t('nav_register')}
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <button onClick={() => setMobileOpen(p => !p)} className="nm" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>
              {mobileOpen ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '14px 22px 18px' }}>
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: location.pathname === link.path ? '#00f5ff' : 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                  {link.label}
                </Link>
              ))}
              {/* Mobile Language Switcher */}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '14px' }}>
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => changeLang(l.code)} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: `1px solid ${lang === l.code ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.1)'}`, background: lang === l.code ? 'rgba(0,245,255,0.1)' : 'transparent', color: lang === l.code ? '#00f5ff' : 'rgba(255,255,255,0.5)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                ))}
              </div>
              {isAuthenticated && (
                <button onClick={() => { logout(); navigate('/'); }} style={{ marginTop: '10px', width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,80,80,0.3)', background: 'rgba(255,80,80,0.07)', color: 'rgba(255,140,140,0.9)', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  {t('nav_logout')}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (min-width: 768px) { .nd { display: flex !important; } .nm { display: none !important; } }
        @media (max-width: 767px) { .nd { display: none !important; } .nm { display: block !important; } }
      `}</style>
    </motion.nav>
  );
}

export default Navbar;
