/**
 * Admin Page
 * Full admin panel: dashboard stats, question management, AI generator, user management
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '../context/AuthContext';
import PageLayout from '../components/common/PageLayout';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';

// ============================================
// CONSTANTS
// ============================================

const CATEGORIES = [
  { value: 'general-knowledge',  label: 'General Knowledge', icon: '🌍' },
  { value: 'english-vocabulary', label: 'English Vocabulary', icon: '📚' },
  { value: 'grammar',            label: 'Grammar',            icon: '✏️' },
  { value: 'reading',            label: 'Reading',            icon: '📖' },
  { value: 'listening',          label: 'Listening',          icon: '🎧' },
  { value: 'ielts-mock',         label: 'IELTS Mock',         icon: '🏆' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const EMPTY_QUESTION = {
  text: '',
  options: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' },
  ],
  correctAnswer: 'A',
  explanation: '',
  category: 'general-knowledge',
  difficulty: 'medium',
};

// ============================================
// NAV TABS — moved inside AdminPage (needs t() from hook)
// ============================================
// TABS is now defined inside AdminPage component

// ============================================
// STAT CARD
// ============================================
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      padding: '22px', borderRadius: '14px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}20`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '8px' }}>
            {label}
          </p>
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '30px', color }}>
            {value}
          </p>
        </div>
        <span style={{ fontSize: '26px' }}>{icon}</span>
      </div>
    </div>
  );
}

// ============================================
// QUESTION FORM MODAL
// ============================================
function QuestionModal({ question, onSave, onClose, loading }) {
  const [form, setForm] = useState(question || EMPTY_QUESTION);

  const setOption = (id, text) => {
    setForm(p => ({
      ...p,
      options: p.options.map(o => o.id === id ? { ...o, text } : o),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate
    if (!form.text.trim()) return toast.error('Question text is required');
    if (form.options.some(o => !o.text.trim())) return toast.error('All 4 options are required');
    onSave(form);
  };

  const inputCls = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '14px', outline: 'none',
    fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelCls = {
    display: 'block', marginBottom: '6px', fontSize: '12px',
    fontFamily: 'Syne, sans-serif', fontWeight: 600,
    color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', overflowY: 'auto',
    }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '100%', maxWidth: '640px',
          background: '#0c0c22',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px', padding: '32px',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px' }}>
            {question?._id ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '22px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category & Difficulty */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelCls}>CATEGORY</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                style={{ ...inputCls, cursor: 'pointer' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value} style={{ background: '#0c0c22' }}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelCls}>DIFFICULTY</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                style={{ ...inputCls, cursor: 'pointer' }}
              >
                {DIFFICULTIES.map(d => (
                  <option key={d} value={d} style={{ background: '#0c0c22', textTransform: 'capitalize' }}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Text */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelCls}>QUESTION TEXT</label>
            <textarea
              value={form.text}
              onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
              required
              rows={3}
              placeholder="Enter the question..."
              style={{ ...inputCls, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Options */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelCls}>OPTIONS (select correct answer)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {form.options.map(opt => (
                <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Correct answer radio */}
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, correctAnswer: opt.id }))}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: form.correctAnswer === opt.id ? '#00ff88' : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${form.correctAnswer === opt.id ? '#00ff88' : 'rgba(255,255,255,0.12)'}`,
                      color: form.correctAnswer === opt.id ? '#020209' : 'rgba(255,255,255,0.4)',
                      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    {opt.id}
                  </button>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={e => setOption(opt.id, e.target.value)}
                    placeholder={`Option ${opt.id}`}
                    required
                    style={inputCls}
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px', fontFamily: 'DM Sans, sans-serif' }}>
              Click the letter button to mark it as the correct answer
            </p>
          </div>

          {/* Explanation */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelCls}>EXPLANATION (optional)</label>
            <textarea
              value={form.explanation}
              onChange={e => setForm(p => ({ ...p, explanation: e.target.value }))}
              rows={2}
              placeholder="Why is this the correct answer?"
              style={{ ...inputCls, resize: 'vertical', lineHeight: 1.5 }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1, padding: '12px',
                borderRadius: '10px', border: 'none',
                background: loading ? 'rgba(0,245,255,0.3)' : 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                color: '#020209', fontFamily: 'Syne, sans-serif',
                fontWeight: 700, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? t('adm_saving') : (question?._id ? 'Update Question' : 'Add Question')}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent', color: 'rgba(255,255,255,0.5)',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ============================================
// OVERVIEW TAB
// ============================================
function OverviewTab({ stats }) {
  if (!stats) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="TOTAL USERS"     value={stats.totalUsers}     icon="👥" color="#00f5ff" />
        <StatCard label="TOTAL QUESTIONS" value={stats.totalQuestions} icon="❓" color="#bf00ff" />
        <StatCard label="TESTS TAKEN"     value={stats.totalTests}     icon="📊" color="#00ff88" />
        <StatCard label="AVG SCORE"       value={`${stats.avgScore}%`} icon="⭐" color="#ffd700" />
      </div>

      <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>
          📋 Recent Tests
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['User', 'Category', 'Score', 'Grade', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats.recentTests || []).map(test => (
                <tr key={test._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'DM Sans, sans-serif' }}>{test.user?.name || 'Unknown'}</td>
                  <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{test.category}</td>
                  <td style={{ padding: '12px 14px', color: '#00f5ff', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{test.percentage}%</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '5px', fontSize: '11px',
                      fontFamily: 'Syne, sans-serif', fontWeight: 700,
                      background: 'rgba(0,245,255,0.1)', color: '#00f5ff',
                    }}>
                      {test.grade}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats.recentTests || stats.recentTests.length === 0) && (
            <p style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
              No tests yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QUESTIONS TAB
// ============================================
function QuestionsTab() {
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ category: '', difficulty: '', search: '', page: 1 });
  const [modal, setModal] = useState(null); // null | 'add' | question object
  const [deleteId, setDeleteId] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category)   params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search)     params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', 15);

      const { data } = await API.get(`/questions?${params}`);
      setQuestions(data.questions || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (formData._id) {
        await API.put(`/questions/${formData._id}`, formData);
        toast.success('Question updated');
      } else {
        await API.post('/questions', formData);
        toast.success('Question added');
      }
      setModal(null);
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/questions/${id}`);
      toast.success('Question deleted');
      setDeleteId(null);
      fetchQuestions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const diffColor = { easy: '#00ff88', medium: '#ffd700', hard: '#ff006e' };

  return (
    <div>
      {/* Filters + Add Button */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={filters.search}
          onChange={e => setFilters(p => ({ ...p, search: e.target.value, page: 1 }))}
          style={{
            padding: '9px 14px', borderRadius: '8px', flex: '1', minWidth: '200px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: '13px', outline: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
        <select
          value={filters.category}
          onChange={e => setFilters(p => ({ ...p, category: e.target.value, page: 1 }))}
          style={{ padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="" style={{ background: '#0c0c22' }}>All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value} style={{ background: '#0c0c22' }}>{c.label}</option>)}
        </select>
        <select
          value={filters.difficulty}
          onChange={e => setFilters(p => ({ ...p, difficulty: e.target.value, page: 1 }))}
          style={{ padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="" style={{ background: '#0c0c22' }}>All Difficulties</option>
          {DIFFICULTIES.map(d => <option key={d} value={d} style={{ background: '#0c0c22', textTransform: 'capitalize' }}>{d}</option>)}
        </select>
        <button
          onClick={() => setModal('add')}
          style={{
            padding: '9px 20px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
            color: '#020209', fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          + Add Question
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['#', 'Question', 'Category', 'Difficulty', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
                    No questions found
                  </td>
                </tr>
              ) : questions.map((q, i) => (
                <tr key={q._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '12px' }}>
                    {(pagination.page - 1) * 15 + i + 1}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '380px' }}>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {q.text}
                    </p>
                    {q.isAIGenerated && (
                      <span style={{ fontSize: '10px', color: '#bf00ff', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginTop: '3px', display: 'inline-block' }}>
                        🤖 AI Generated
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                      {CATEGORIES.find(c => c.value === q.category)?.icon} {CATEGORIES.find(c => c.value === q.category)?.label || q.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '11px',
                      fontFamily: 'Syne, sans-serif', fontWeight: 600, textTransform: 'capitalize',
                      color: diffColor[q.difficulty] || '#fff',
                      background: `${diffColor[q.difficulty] || '#fff'}15`,
                    }}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => setModal(q)}
                      style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.08)', color: '#00f5ff', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer', marginRight: '6px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(q._id)}
                      style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid rgba(255,0,110,0.3)', background: 'rgba(255,0,110,0.08)', color: '#ff006e', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: pagination.page === 1 ? 'rgba(255,255,255,0.2)' : 'white', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
            >
              ← Prev
            </button>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              {pagination.page} / {pagination.pages} ({pagination.total} total)
            </span>
            <button
              onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: pagination.page === pagination.pages ? 'rgba(255,255,255,0.2)' : 'white', cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Question Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <QuestionModal
            question={modal === 'add' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            loading={saving}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#0c0c22', border: '1px solid rgba(255,0,110,0.3)', borderRadius: '16px', padding: '32px', maxWidth: '380px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', marginBottom: '10px' }}>Delete Question?</h3>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', marginBottom: '24px' }}>
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={() => handleDelete(deleteId)} style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ff006e, #ff4500)', color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer' }}>
                  Delete
                </button>
                <button onClick={() => setDeleteId(null)} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// AI GENERATOR TAB
// ============================================
function AIGeneratorTab() {
  const [prompt, setPrompt]           = useState('');
  const [category, setCategory]       = useState('english-vocabulary');
  const [count, setCount]             = useState(10);
  const [loading, setLoading]         = useState(false);
  const [generated, setGenerated]     = useState([]);
  const [saving, setSaving]           = useState(false);
  const [selected, setSelected]       = useState(new Set());

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    setLoading(true);
    setGenerated([]);
    setSelected(new Set());
    try {
      const { data } = await API.post('/ai/generate', { prompt, category, count });
      setGenerated(data.questions || []);
      toast.success(`Generated ${data.generated} questions!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (i) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(generated.map((_, i) => i)));
  const deselectAll = () => setSelected(new Set());

  const handleSaveSelected = async () => {
    if (selected.size === 0) return toast.error('Select at least one question');
    setSaving(true);
    try {
      const toSave = [...selected].map(i => ({ ...generated[i], category }));
      const { data } = await API.post('/questions/bulk', { questions: toSave });
      toast.success(data.message);
      setGenerated([]);
      setSelected(new Set());
    } catch (err) {
      toast.error('Failed to save questions');
    } finally {
      setSaving(false);
    }
  };

  const diffColor = { easy: '#00ff88', medium: '#ffd700', hard: '#ff006e' };

  const promptTemplates = [
    `Generate ${count} IELTS vocabulary questions with academic words`,
    `Generate ${count} English grammar questions about conditionals`,
    `Generate ${count} general knowledge questions about science`,
    `Generate ${count} reading comprehension inference questions`,
    `Generate ${count} IELTS listening strategy questions`,
  ];

  return (
    <div>
      {/* Config Panel */}
      <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(191,0,255,0.2)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '26px' }}>🤖</span>
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '17px', marginBottom: '2px' }}>
              AI Question Generator
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontFamily: 'DM Sans, sans-serif' }}>
              Powered by OpenAI GPT-4o-mini
            </p>
          </div>
        </div>

        {/* Prompt Templates */}
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: '8px' }}>
            QUICK TEMPLATES
          </p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {promptTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => setPrompt(t)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '11px',
                  border: '1px solid rgba(191,0,255,0.25)',
                  background: 'rgba(191,0,255,0.08)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.target.style.color = '#bf00ff'; e.target.style.borderColor = 'rgba(191,0,255,0.5)'; }}
                onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.borderColor = 'rgba(191,0,255,0.25)'; }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px', gap: '12px', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: '6px' }}>PROMPT</p>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={2}
              placeholder="e.g. Generate 10 IELTS vocabulary questions about environment..."
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', fontSize: '13px', outline: 'none',
                fontFamily: 'DM Sans, sans-serif', resize: 'none',
                lineHeight: 1.5, boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: '6px' }}>CATEGORY</p>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value} style={{ background: '#0c0c22' }}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: '6px' }}>COUNT</p>
            <input
              type="number"
              min={1} max={20}
              value={count}
              onChange={e => setCount(parseInt(e.target.value) || 5)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: '100%', padding: '13px',
            borderRadius: '10px', border: 'none',
            background: loading ? 'rgba(191,0,255,0.3)' : 'linear-gradient(135deg, #bf00ff, #00f5ff)',
            color: loading ? 'rgba(255,255,255,0.4)' : '#020209',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.05em', transition: 'all 0.3s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Generating with AI...
            </span>
          ) : '🤖 Generate Questions'}
        </button>
      </div>

      {/* Generated Questions */}
      <AnimatePresence>
        {generated.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                Generated {generated.length} questions — select to save
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={selectAll} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.08)', color: '#00f5ff', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  Select All
                </button>
                <button onClick={deselectAll} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer' }}>
                  Deselect
                </button>
                <button
                  onClick={handleSaveSelected}
                  disabled={saving || selected.size === 0}
                  style={{
                    padding: '6px 16px', borderRadius: '7px', border: 'none',
                    background: selected.size === 0 ? 'rgba(0,255,136,0.2)' : 'linear-gradient(135deg, #00ff88, #00f5ff)',
                    color: selected.size === 0 ? 'rgba(0,0,0,0.4)' : '#020209',
                    fontSize: '12px', fontFamily: 'Syne, sans-serif', fontWeight: 700,
                    cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? t('adm_saving') : `Save Selected (${selected.size})`}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {generated.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => toggleSelect(i)}
                  style={{
                    padding: '18px 20px', borderRadius: '12px', cursor: 'pointer',
                    background: selected.has(i) ? 'rgba(0,255,136,0.07)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selected.has(i) ? 'rgba(0,255,136,0.35)' : 'rgba(255,255,255,0.07)'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', marginBottom: '10px', lineHeight: 1.5 }}>
                        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#00f5ff', marginRight: '8px' }}>Q{i + 1}.</span>
                        {q.text}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {q.options?.map(opt => (
                          <span
                            key={opt.id}
                            style={{
                              padding: '3px 10px', borderRadius: '5px', fontSize: '12px',
                              background: opt.id === q.correctAnswer ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${opt.id === q.correctAnswer ? 'rgba(0,255,136,0.35)' : 'rgba(255,255,255,0.08)'}`,
                              color: opt.id === q.correctAnswer ? '#00ff88' : 'rgba(255,255,255,0.6)',
                              fontFamily: 'DM Sans, sans-serif',
                            }}
                          >
                            <strong>{opt.id}.</strong> {opt.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: selected.has(i) ? '#00ff88' : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${selected.has(i) ? '#00ff88' : 'rgba(255,255,255,0.15)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', color: selected.has(i) ? '#020209' : 'transparent',
                        transition: 'all 0.2s',
                      }}>
                        ✓
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', fontWeight: 600, color: diffColor[q.difficulty] || '#fff', textTransform: 'capitalize' }}>
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// USERS TAB
// ============================================
function UsersTab() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [page, setPage]           = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/users?page=${page}&limit=15${search ? `&search=${search}` : ''}`);
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleUserStatus = async (userId) => {
    try {
      const { data } = await API.patch(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.user.isActive } : u));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Search users by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            flex: 1, padding: '9px 14px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white', fontSize: '13px', outline: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />
      </div>

      {/* Users Table */}
      <div style={{ borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['User', 'Email', 'Tests', 'Avg Score', 'Best', 'Status', 'Joined', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.06em', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>No users found</td></tr>
              ) : users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f5ff, #bf00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: '#020209', flexShrink: 0 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{user.email}</td>
                  <td style={{ padding: '12px 14px', color: '#00f5ff', fontFamily: 'Syne, sans-serif', fontWeight: 600, textAlign: 'center' }}>{user.stats?.totalTests || 0}</td>
                  <td style={{ padding: '12px 14px', color: '#bf00ff', fontFamily: 'Syne, sans-serif', fontWeight: 600, textAlign: 'center' }}>{user.stats?.averageScore || 0}%</td>
                  <td style={{ padding: '12px 14px', color: '#00ff88', fontFamily: 'Syne, sans-serif', fontWeight: 600, textAlign: 'center' }}>{user.stats?.bestScore || 0}%</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      padding: '3px 9px', borderRadius: '5px', fontSize: '11px',
                      fontFamily: 'Syne, sans-serif', fontWeight: 600,
                      background: user.isActive ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,110,0.1)',
                      color: user.isActive ? '#00ff88' : '#ff006e',
                    }}>
                      {user.isActive ? t('adm_active') : t('adm_banned')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      style={{
                        padding: '5px 12px', borderRadius: '6px', fontSize: '11px',
                        fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer',
                        border: `1px solid ${user.isActive ? 'rgba(255,0,110,0.3)' : 'rgba(0,255,136,0.3)'}`,
                        background: user.isActive ? 'rgba(255,0,110,0.08)' : 'rgba(0,255,136,0.08)',
                        color: user.isActive ? '#ff006e' : '#00ff88',
                      }}
                    >
                      {user.isActive ? t('adm_ban') : t('adm_activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: page === 1 ? 'rgba(255,255,255,0.2)' : 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>← Prev</button>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{page} / {pagination.pages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.pages} style={{ padding: '6px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: page === pagination.pages ? 'rgba(255,255,255,0.2)' : 'white', cursor: page === pagination.pages ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN ADMIN PAGE
// ============================================
function AdminPage() {
  const { t, lang } = useLang();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats]         = useState(null);

  // Tabs ichkarida — t() hook dan keyin
  const TABS = [
    { id: 'overview',   label: t('adm_overview'),   icon: '📊' },
    { id: 'questions',  label: t('adm_questions'),  icon: '❓' },
    { id: 'ai',         label: t('adm_ai'),          icon: '🤖' },
    { id: 'users',      label: t('adm_users'),       icon: '👥' },
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      API.get('/admin/stats').then(r => setStats(r.data.stats)).catch(console.error);
    }
  }, [activeTab]);

  return (
    <PageLayout>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 24px 60px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(26px, 4vw, 38px)', marginBottom: '4px' }}>
            {t('adm_title')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            {t('adm_sub')}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '28px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '5px',
          width: 'fit-content',
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 20px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '13px',
                transition: 'all 0.2s ease',
                background: activeTab === tab.id ? 'rgba(0,245,255,0.12)' : 'transparent',
                color: activeTab === tab.id ? '#00f5ff' : 'rgba(255,255,255,0.5)',
                boxShadow: activeTab === tab.id ? '0 0 0 1px rgba(0,245,255,0.25)' : 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span>{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview'  && <OverviewTab stats={stats} />}
            {activeTab === 'questions' && <QuestionsTab />}
            {activeTab === 'ai'        && <AIGeneratorTab />}
            {activeTab === 'users'     && <UsersTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .tab-label { display: none; }
        }
        option { background: #0c0c22 !important; }
      `}</style>
    </PageLayout>
  );
}

export default AdminPage;
