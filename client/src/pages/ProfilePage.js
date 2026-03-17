/**
 * Profile Page
 * User profile, stats overview, and test history
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth, API } from '../context/AuthContext';
import PageLayout from '../components/common/PageLayout';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const categoryConfig = {
  'general-knowledge':  { label: 'General',  icon: '🌍', color: '#00f5ff' },
  'english-vocabulary': { label: 'Vocab',    icon: '📚', color: '#bf00ff' },
  'grammar':            { label: 'Grammar',  icon: '✏️', color: '#00ff88' },
  'reading':            { label: 'Reading',  icon: '📖', color: '#ff006e' },
  'listening':          { label: 'Listening',icon: '🎧', color: '#ffd700' },
  'ielts-mock':         { label: 'IELTS',    icon: '🏆', color: '#ff6b35' },
};

const gradeColors = { 'A+': '#00ff88', 'A': '#00f5ff', 'B': '#7b61ff', 'C': '#ffd700', 'D': '#ff9500', 'F': '#ff006e' };

function ProfilePage() {
  const { user, updateUser, API: authAPI } = useAuth();
  const { t, lang } = useLang();
  const [history, setHistory]   = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [nameForm, setNameForm] = useState({ name: user?.name || '' });
  const [pwdForm, setPwdForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving]     = useState(false);
  const [activeSection, setActiveSection] = useState('stats'); // stats | history | settings

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, progRes] = await Promise.all([
          API.get('/tests/history?limit=20'),
          API.get('/tests/progress'),
        ]);
        setHistory(histRes.data.results || []);
        setProgress(progRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', { name: nameForm.name });
      updateUser(data.user);
      toast.success('Name updated');
      setEditMode(false);
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) return toast.error('Passwords do not match');
    if (pwdForm.newPassword.length < 6) return toast.error('Password must be 6+ characters');
    setSaving(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password change failed');
    } finally {
      setSaving(false);
    }
  };

  // Prepare chart data — category averages
  const chartData = Object.entries(categoryConfig).map(([key, cfg]) => {
    const stat = progress?.categoryStats?.find(s => s._id === key);
    return {
      name: cfg.label,
      avg: Math.round(stat?.avgScore || 0),
      best: Math.round(stat?.bestScore || 0),
      color: cfg.color,
    };
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '14px', outline: 'none',
    fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', marginBottom: '6px', fontSize: '12px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600,
    color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em',
  };

  const sectionTabs = [
    { id: 'stats',    label: t('prof_stats') },
    { id: 'history',  label: t('prof_history') },
    { id: 'settings', label: t('prof_settings') },
  ];

  return (
    <PageLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px 60px' }}>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '32px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(191,0,255,0.08))',
            border: '1px solid rgba(0,245,255,0.2)',
            marginBottom: '28px',
            display: 'flex', alignItems: 'center', gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '32px',
            color: '#020209', flexShrink: 0,
            boxShadow: '0 0 30px rgba(0,245,255,0.3)',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', marginBottom: '4px' }}>
              {user?.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif', marginBottom: '12px', fontSize: '14px' }}>
              {user?.email}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: '6px', background: user?.role === 'admin' ? 'rgba(255,215,0,0.15)' : 'rgba(0,245,255,0.12)', color: user?.role === 'admin' ? '#ffd700' : '#00f5ff', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {user?.role}
              </span>
              <span style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                {user?.stats?.totalTests || 0} {t('prof_tests')}
              </span>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              { label: 'Best', value: `${user?.stats?.bestScore || 0}%`, color: '#00ff88' },
              { label: 'Avg', value: `${user?.stats?.averageScore || 0}%`, color: '#00f5ff' },
              { label: 'Correct', value: user?.stats?.correctAnswers || 0, color: '#bf00ff' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '24px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '4px',
          width: 'fit-content',
        }}>
          {sectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                padding: '8px 18px', borderRadius: '7px', border: 'none',
                cursor: 'pointer', fontFamily: 'Syne, sans-serif',
                fontWeight: 600, fontSize: '13px', transition: 'all 0.2s',
                background: activeSection === tab.id ? 'rgba(0,245,255,0.12)' : 'transparent',
                color: activeSection === tab.id ? '#00f5ff' : 'rgba(255,255,255,0.5)',
                boxShadow: activeSection === tab.id ? '0 0 0 1px rgba(0,245,255,0.2)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* STATS SECTION */}
        {activeSection === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
                📊 Category Performance
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#12122e', border: '1px solid rgba(0,245,255,0.3)', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#00f5ff', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
                  />
                  <Bar dataKey="avg" fill="#00f5ff" opacity={0.7} radius={[4, 4, 0, 0]} name="Avg Score" />
                  <Bar dataKey="best" fill="#00ff88" opacity={0.7} radius={[4, 4, 0, 0]} name="Best Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {Object.entries(categoryConfig).map(([key, cfg]) => {
                const stat = progress?.categoryStats?.find(s => s._id === key);
                return (
                  <div key={key} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${cfg.color}20`, textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{cfg.icon}</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>{cfg.label}</div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: cfg.color, marginBottom: '3px' }}>
                      {Math.round(stat?.avgScore || 0)}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                      {stat?.count || 0} tests
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* HISTORY SECTION */}
        {activeSection === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                  No tests taken yet. <Link to="/dashboard" style={{ color: '#00f5ff' }}>Start one!</Link>
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.map((test, i) => {
                  const cfg = categoryConfig[test.category] || {};
                  return (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link to={`/results/${test._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '16px',
                          padding: '16px 20px', borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          transition: 'all 0.2s ease', cursor: 'pointer',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${cfg.color || '#00f5ff'}30`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                        >
                          <span style={{ fontSize: '22px' }}>{cfg.icon || '📊'}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '14px', marginBottom: '3px', color: 'white' }}>
                              {cfg.label || test.category}
                            </p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                              {test.correctAnswers}/{test.totalQuestions} correct • {format(new Date(test.createdAt), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: gradeColors[test.grade] || '#00f5ff' }}>
                              {test.percentage}%
                            </div>
                            <div style={{ fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: gradeColors[test.grade] || '#00f5ff' }}>
                              {test.grade}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* SETTINGS SECTION */}
        {activeSection === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

            {/* Update Name */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '20px' }}>
                ✏️ Update Profile
              </h3>
              <form onSubmit={handleUpdateName}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>FULL NAME</label>
                  <input
                    type="text"
                    value={nameForm.name}
                    onChange={e => setNameForm({ name: e.target.value })}
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00f5ff'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>EMAIL (read-only)</label>
                  <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }} />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: saving ? 'rgba(0,245,255,0.3)' : 'linear-gradient(135deg, #00f5ff, #bf00ff)', color: '#020209', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer' }}
                >
                  {saving ? t('prof_saving') : t('prof_upd_btn')}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '20px' }}>
                🔒 Change Password
              </h3>
              <form onSubmit={handleChangePassword}>
                {[
                  { key: 'currentPassword', label: t('prof_cur_pass'), placeholder: '••••••••' },
                  { key: 'newPassword',     label: t('prof_new_pass'),     placeholder: '••••••••' },
                  { key: 'confirm',         label: t('prof_confirm'),      placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>{f.label}</label>
                    <input
                      type="password"
                      value={pwdForm[f.key]}
                      onChange={e => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                      required
                      placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#bf00ff'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={saving}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: 'none', background: saving ? 'rgba(191,0,255,0.3)' : 'linear-gradient(135deg, #bf00ff, #ff006e)', color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', marginTop: '4px' }}
                >
                  {saving ? t('prof_changing') : t('prof_chg_btn')}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}

export default ProfilePage;
