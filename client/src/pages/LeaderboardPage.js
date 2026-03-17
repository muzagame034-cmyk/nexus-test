import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PageLayout from '../components/common/PageLayout';

// Barcha 15 kategoriya + "Hammasi"
const CAT_LABELS = {
  all:                  { uz:'🌐 Barcha fanlar',       ru:'🌐 Все предметы',          en:'🌐 All Subjects',         icon:'🌐' },
  'math':               { uz:'📐 Matematika',          ru:'📐 Математика',            en:'📐 Mathematics',          icon:'📐' },
  'physics':            { uz:'⚡ Fizika',              ru:'⚡ Физика',                en:'⚡ Physics',               icon:'⚡' },
  'chemistry':          { uz:'🧪 Kimyo',               ru:'🧪 Химия',                 en:'🧪 Chemistry',            icon:'🧪' },
  'biology':            { uz:'🧬 Biologiya',           ru:'🧬 Биология',              en:'🧬 Biology',              icon:'🧬' },
  'history':            { uz:'🏛️ Tarix',               ru:'🏛️ История',               en:'🏛️ History',              icon:'🏛️' },
  'geography':          { uz:'🌍 Geografiya',          ru:'🌍 География',             en:'🌍 Geography',            icon:'🌍' },
  'english-vocabulary': { uz:'🇬🇧 Ingliz tili',        ru:'🇬🇧 Английский',           en:'🇬🇧 English',             icon:'🇬🇧' },
  'it':                 { uz:'💻 Informatika',         ru:'💻 Информатика',           en:'💻 Computer Science',     icon:'💻' },
  'literature':         { uz:"📚 Adabiyot",            ru:'📚 Литература',            en:'📚 Literature',           icon:'📚' },
  'general-knowledge':  { uz:'🌐 Umumiy Bilim',        ru:'🌐 Общие знания',          en:'🌐 General Knowledge',    icon:'🌐' },
  'logic':              { uz:'🧩 Mantiq',              ru:'🧩 Логика',                en:'🧩 Logic',                icon:'🧩' },
  'grammar':            { uz:'✏️ Grammatika',          ru:'✏️ Грамматика',            en:'✏️ Grammar',              icon:'✏️' },
  'reading':            { uz:"📖 O'qish",              ru:'📖 Чтение',               en:'📖 Reading',              icon:'📖' },
  'listening':          { uz:'🎧 Tinglash',            ru:'🎧 Аудирование',           en:'🎧 Listening',            icon:'🎧' },
  'ielts-mock':         { uz:'🏆 IELTS Mock',          ru:'🏆 IELTS',                 en:'🏆 IELTS Mock',           icon:'🏆' },
};

const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
const rankIcons  = ['🥇', '🥈', '🥉'];

function LeaderboardPage() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [leaderboard, setLeaderboard] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const tx = (uz, ru, en) => lang==='uz' ? uz : lang==='ru' ? ru : en;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/leaderboard?category=${category}&limit=20`);
        setLeaderboard(data.leaderboard || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const getCatLabel = (key) => {
    const cat = CAT_LABELS[key];
    if (!cat) return key;
    return cat[lang] || cat.en || key;
  };

  return (
    <PageLayout>
      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'20px 24px 60px' }}>

        {/* HEADER */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'28px' }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'clamp(26px,4vw,40px)', marginBottom:'6px' }}>
            🏆 {tx('Reyting', 'Рейтинг', 'Leaderboard')}
          </h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontFamily:'DM Sans,sans-serif', fontSize:'14px' }}>
            {tx(
              'Barcha foydalanuvchilar orasida eng yaxshi natijalar',
              'Лучшие результаты среди всех пользователей',
              'Top performers across all subjects'
            )}
          </p>
        </motion.div>

        {/* FILTR — barcha fanlar */}
        <div style={{ marginBottom:'24px' }}>
          <p style={{
            fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'11px',
            color:'rgba(255,255,255,0.35)', letterSpacing:'0.08em',
            marginBottom:'10px', textTransform:'uppercase',
          }}>
            {tx('Fan tanlang', 'Выберите предмет', 'Select Subject')}
          </p>

          {/* "Hammasi" tugmasi alohida */}
          <div style={{ marginBottom:'8px' }}>
            <button
              onClick={() => setCategory('all')}
              style={{
                padding:'8px 18px', borderRadius:'8px',
                border:`1px solid ${category==='all' ? 'rgba(0,245,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                background: category==='all' ? 'rgba(0,245,255,0.12)' : 'rgba(255,255,255,0.03)',
                color: category==='all' ? '#00f5ff' : 'rgba(255,255,255,0.5)',
                fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              {getCatLabel('all')}
            </button>
          </div>

          {/* Fanlar grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',
            gap:'7px',
          }}>
            {Object.entries(CAT_LABELS)
              .filter(([key]) => key !== 'all')
              .map(([key, names]) => {
                const isActive = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    style={{
                      padding:'8px 12px', borderRadius:'8px',
                      border:`1px solid ${isActive ? 'rgba(0,245,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
                      background: isActive ? 'rgba(0,245,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#00f5ff' : 'rgba(255,255,255,0.5)',
                      fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'12px',
                      cursor:'pointer', transition:'all 0.2s',
                      textAlign:'left',
                      display:'flex', alignItems:'center', gap:'6px',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      }
                    }}
                  >
                    {names[lang] || names.en}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Hozir ko'rilayotgan fan */}
        <div style={{
          marginBottom:'16px',
          padding:'10px 16px', borderRadius:'8px',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.08)',
          display:'flex', alignItems:'center', gap:'8px',
        }}>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>
            {tx('Ko\'rilayotgan:', 'Просматривается:', 'Viewing:')}
          </span>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px', color:'#00f5ff' }}>
            {getCatLabel(category)}
          </span>
        </div>

        {/* REYTING JADVALI */}
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'60px' }}>
            <div className="spinner"/>
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'60px',
            background:'rgba(255,255,255,0.03)',
            borderRadius:'16px', border:'1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🏆</div>
            <p style={{ color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif' }}>
              {tx(
                "Bu fanda hali natija yo'q. Birinchi bo'ling!",
                'По этому предмету ещё нет результатов. Будьте первым!',
                'No results yet for this subject. Be the first!'
              )}
            </p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
            {leaderboard.map((entry, i) => {
              const isMe = user?._id === entry.userId?.toString();
              const isTop3 = i < 3;

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    display:'flex', alignItems:'center', gap:'14px',
                    padding:'16px 20px', borderRadius:'12px',
                    background: isMe
                      ? 'rgba(0,245,255,0.08)'
                      : isTop3 ? 'rgba(255,215,0,0.04)' : 'rgba(255,255,255,0.03)',
                    border:`1px solid ${isMe ? 'rgba(0,245,255,0.4)' : isTop3 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.07)'}`,
                    transition:'all 0.2s',
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    width:'40px', textAlign:'center',
                    fontFamily:'Syne,sans-serif', fontWeight:800,
                    fontSize: isTop3 ? '24px' : '15px',
                    color: rankColors[i] || 'rgba(255,255,255,0.35)',
                    flexShrink:0,
                  }}>
                    {isTop3 ? rankIcons[i] : `#${i+1}`}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'50%',
                    background: isMe
                      ? 'linear-gradient(135deg,#00f5ff,#bf00ff)'
                      : `linear-gradient(135deg,${rankColors[i] || '#444'},transparent)`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'16px',
                    color: isMe ? '#020209' : 'white',
                    border:'1px solid rgba(255,255,255,0.1)',
                    flexShrink:0,
                    boxShadow: isTop3 ? `0 0 15px ${rankColors[i]}50` : 'none',
                  }}>
                    {entry.name?.[0]?.toUpperCase()}
                  </div>

                  {/* Ism + statistika */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{
                      fontFamily:'Syne,sans-serif', fontWeight:700,
                      fontSize:'15px', marginBottom:'2px',
                      color: isMe ? '#00f5ff' : 'white',
                      display:'flex', alignItems:'center', gap:'6px',
                    }}>
                      {entry.name}
                      {isMe && (
                        <span style={{
                          fontSize:'11px', padding:'1px 7px', borderRadius:'4px',
                          background:'rgba(0,245,255,0.15)', color:'#00f5ff',
                          fontWeight:600,
                        }}>
                          {tx('Siz','Вы','You')}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize:'12px', color:'rgba(255,255,255,0.4)',
                      fontFamily:'DM Sans,sans-serif',
                    }}>
                      {entry.totalTests} {tx('test','тестов','test(s)')} •{' '}
                      {tx("O'rtacha:",'Среднее:','Avg:')} {entry.avgScore}%
                    </div>
                  </div>

                  {/* Ball */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{
                      fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'22px',
                      color: isTop3 ? rankColors[i] : '#00f5ff',
                      lineHeight:1,
                    }}>
                      {entry.bestScore}%
                    </div>
                    <div style={{
                      fontSize:'11px', color:'rgba(255,255,255,0.35)',
                      fontFamily:'DM Sans,sans-serif', marginTop:'2px',
                    }}>
                      {tx('eng yaxshi','лучший','best')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

export default LeaderboardPage;
