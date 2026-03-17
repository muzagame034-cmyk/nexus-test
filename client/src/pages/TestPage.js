/**
 * TestPage — barcha 15 kategoriya uchun
 * - Savollar yo'q bo'lsa: AI bilan yaratish imkoniyati
 * - Barcha matnlar 3 tilda (useLang)
 * - Scroll/gyroscope 3D fon
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/common/PageLayout';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';

// ─── Barcha kategoriyalar konfiguratsiyasi ───
const CAT_CFG = {
  'math':               { icon:'📐', color:'#00f5ff', time:25, count:20 },
  'physics':            { icon:'⚡', color:'#bf00ff', time:25, count:20 },
  'chemistry':          { icon:'🧪', color:'#00ff88', time:25, count:20 },
  'biology':            { icon:'🧬', color:'#ff006e', time:25, count:20 },
  'history':            { icon:'🏛️', color:'#ffd700', time:25, count:20 },
  'geography':          { icon:'🌍', color:'#ff6b35', time:25, count:20 },
  'english-vocabulary': { icon:'🇬🇧', color:'#00f5ff', time:20, count:20 },
  'it':                 { icon:'💻', color:'#7b61ff', time:25, count:20 },
  'literature':         { icon:'📖', color:'#ff9500', time:20, count:20 },
  'general-knowledge':  { icon:'🌐', color:'#00ff88', time:20, count:20 },
  'logic':              { icon:'🧩', color:'#bf00ff', time:20, count:20 },
  'grammar':            { icon:'✏️', color:'#00ff88', time:20, count:20 },
  'reading':            { icon:'📖', color:'#ff006e', time:25, count:20 },
  'listening':          { icon:'🎧', color:'#ffd700', time:25, count:20 },
  'ielts-mock':         { icon:'🏆', color:'#ff6b35', time:60, count:40 },
};

// Kategoriya nomlari 3 tilda
const CAT_NAMES = {
  'math':               { uz:'Matematika',      ru:'Математика',         en:'Mathematics' },
  'physics':            { uz:'Fizika',          ru:'Физика',             en:'Physics' },
  'chemistry':          { uz:'Kimyo',           ru:'Химия',              en:'Chemistry' },
  'biology':            { uz:'Biologiya',       ru:'Биология',           en:'Biology' },
  'history':            { uz:'Tarix',           ru:'История',            en:'History' },
  'geography':          { uz:'Geografiya',      ru:'География',          en:'Geography' },
  'english-vocabulary': { uz:'Ingliz tili',     ru:'Английский язык',    en:'English Language' },
  'it':                 { uz:'Informatika',     ru:'Информатика',        en:'Computer Science' },
  'literature':         { uz:"O'zbek adabiyoti",ru:'Литература',         en:'Literature' },
  'general-knowledge':  { uz:'Umumiy Bilim',    ru:'Общие знания',       en:'General Knowledge' },
  'logic':              { uz:'Mantiq',          ru:'Логика',             en:'Logic & Reasoning' },
  'grammar':            { uz:'Grammatika',      ru:'Грамматика',         en:'Grammar' },
  'reading':            { uz:"O'qish",          ru:'Чтение',             en:'Reading' },
  'listening':          { uz:'Tinglash',        ru:'Аудирование',        en:'Listening' },
  'ielts-mock':         { uz:'IELTS Mock Test', ru:'IELTS Пробный тест', en:'IELTS Mock Test' },
};

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2,'0');
  const s = (secs % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// ─── AI ORQALI SAVOLLAR YARATISH EKRANI ───
function AIGenerateScreen({ category, onGenerated, onBack, t, lang }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cfg = CAT_CFG[category] || CAT_CFG['general-knowledge'];
  const catName = CAT_NAMES[category]?.[lang] || category;

  const msgs = {
    uz: ['AI tayyorlanmoqda...', 'Savollar yaratilmoqda...', 'Variantlar qo\'shilmoqda...', 'Deyarli tayyor...'],
    ru: ['ИИ готовится...', 'Создаются вопросы...', 'Добавляются варианты...', 'Почти готово...'],
    en: ['AI is preparing...', 'Generating questions...', 'Adding options...', 'Almost done...'],
  };

  const handleGenerate = async () => {
    setLoading(true);
    setProgress(0);

    // Progress animatsiya
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 12;
      });
    }, 600);

    try {
      // Avval AI bilan yaratamiz (agar admin API key bo'lsa)
      let questions = [];

      try {
        const promptMap = {
          uz: `Generate 20 multiple choice test questions about ${catName} for Uzbek students. Mix easy, medium and hard levels.`,
          ru: `Generate 20 multiple choice test questions about ${catName} for students. Mix easy, medium and hard levels.`,
          en: `Generate 20 multiple choice test questions about ${catName}. Mix easy, medium and hard levels.`,
        };

        const aiRes = await API.post('/ai/generate', {
          prompt: promptMap[lang] || promptMap.en,
          category,
          count: 20,
        });

        if (aiRes.data.questions?.length >= 5) {
          // AI savollarini DB ga saqlash
          const saveRes = await API.post('/questions/bulk', {
            questions: aiRes.data.questions.map(q => ({ ...q, category }))
          });

          // Endi testni yuklash
          const testRes = await API.get(`/questions/test/${category}?count=20`);
          questions = testRes.data.questions;
        }
      } catch (aiErr) {
        // AI ishlamasa fallback savollar
        console.log('AI fallback:', aiErr.message);
      }

      // Agar hali ham bo'sh — namuna savollar yaratamiz
      if (questions.length === 0) {
        questions = generateFallbackQuestions(category, lang, 15);
      }

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        onGenerated(questions);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
      toast.error(lang === 'uz' ? 'Xato yuz berdi' : lang === 'ru' ? 'Произошла ошибка' : 'An error occurred');
    }
  };

  const msgList = msgs[lang] || msgs.en;
  const msgIdx = Math.floor((progress / 100) * (msgList.length - 1));

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <motion.div
        initial={{ opacity:0, scale:0.95 }}
        animate={{ opacity:1, scale:1 }}
        style={{
          maxWidth:'480px', width:'100%',
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(30px)',
          border:`1px solid ${cfg.color}30`,
          borderRadius:'20px', padding:'40px',
          textAlign:'center',
        }}
      >
        <div style={{ fontSize:'60px', marginBottom:'20px' }}>{cfg.icon}</div>

        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'22px', marginBottom:'10px' }}>
          {catName}
        </h2>

        <div style={{
          padding:'14px 20px', borderRadius:'10px',
          background:'rgba(255,149,0,0.1)',
          border:'1px solid rgba(255,149,0,0.3)',
          marginBottom:'28px',
        }}>
          <p style={{ color:'#ff9500', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px', marginBottom:'6px' }}>
            {lang==='uz'?'⚠️ Bu kategoriyada hali savollar yo\'q':lang==='ru'?'⚠️ В этой категории ещё нет вопросов':'⚠️ No questions yet in this category'}
          </p>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'12px', fontFamily:'DM Sans,sans-serif', lineHeight:1.5 }}>
            {lang==='uz'?'AI yordamida avtomatik savollar yaratib, testni boshlash mumkin':lang==='ru'?'Можно создать вопросы автоматически с помощью ИИ':'Questions can be automatically generated using AI'}
          </p>
        </div>

        {!loading ? (
          <>
            <button
              onClick={handleGenerate}
              style={{
                width:'100%', padding:'16px',
                borderRadius:'12px', border:'none',
                background:`linear-gradient(135deg, ${cfg.color}, #bf00ff)`,
                color:'#020209', fontFamily:'Syne,sans-serif',
                fontWeight:700, fontSize:'15px', cursor:'pointer',
                letterSpacing:'0.04em', marginBottom:'12px',
                boxShadow:`0 0 30px ${cfg.color}40`,
              }}
            >
              🤖 {lang==='uz'?'AI bilan Savollar Yaratish':lang==='ru'?'Создать вопросы с ИИ':'Generate with AI'}
            </button>
            <button
              onClick={onBack}
              style={{
                width:'100%', padding:'13px',
                borderRadius:'12px',
                border:'1px solid rgba(255,255,255,0.12)',
                background:'transparent', color:'rgba(255,255,255,0.5)',
                fontFamily:'Syne,sans-serif', fontWeight:600,
                fontSize:'14px', cursor:'pointer',
              }}
            >
              ← {lang==='uz'?'Orqaga':lang==='ru'?'Назад':'Back'}
            </button>
          </>
        ) : (
          <div>
            {/* Progress bar */}
            <div style={{ height:'6px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', marginBottom:'16px', overflow:'hidden' }}>
              <motion.div
                animate={{ width:`${progress}%` }}
                transition={{ duration:0.4 }}
                style={{
                  height:'100%',
                  background:`linear-gradient(90deg, ${cfg.color}, #bf00ff)`,
                  borderRadius:'3px',
                  boxShadow:`0 0 10px ${cfg.color}60`,
                }}
              />
            </div>
            <p style={{ color:cfg.color, fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'14px', marginBottom:'6px' }}>
              {Math.round(progress)}%
            </p>
            <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'13px' }}>
              {msgList[msgIdx]}
            </p>
            {/* Spinning icon */}
            <div style={{ marginTop:'20px', fontSize:'32px', animation:'spin 1.5s linear infinite', display:'inline-block' }}>
              🤖
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ─── FALLBACK SAVOLLAR (AI yo'q bo'lganda) ───
function generateFallbackQuestions(category, lang, count = 15) {
  const fallbacks = {
    math: [
      { text: '2 + 2 × 3 = ?', options:[{id:'A',text:'8'},{id:'B',text:'10'},{id:'C',text:'12'},{id:'D',text:'6'}], correctAnswer:'A' },
      { text: '√64 = ?', options:[{id:'A',text:'6'},{id:'B',text:'8'},{id:'C',text:'7'},{id:'D',text:'9'}], correctAnswer:'B' },
      { text: 'x + 5 = 12. x = ?', options:[{id:'A',text:'6'},{id:'B',text:'7'},{id:'C',text:'8'},{id:'D',text:'5'}], correctAnswer:'B' },
    ],
    physics: [
      { text: 'F = ma. Bu qaysi qonun?', options:[{id:'A',text:'1-qonun'},{id:'B',text:'2-qonun'},{id:'C',text:'3-qonun'},{id:'D',text:'Gravitatsiya'}], correctAnswer:'B' },
    ],
    default: [
      { text: 'Bu test uchun savollar tayyorlanmoqda. Iltimos, kuting...', options:[{id:'A',text:'OK'},{id:'B',text:'Tushunarli'},{id:'C',text:'Mayli'},{id:'D',text:'Yaxshi'}], correctAnswer:'A' },
    ]
  };

  const pool = fallbacks[category] || fallbacks.default;
  const result = [];
  for (let i = 0; i < count; i++) {
    const q = pool[i % pool.length];
    result.push({
      _id: `fallback_${i}_${Date.now()}`,
      ...q,
      difficulty: i < 5 ? 'easy' : i < 10 ? 'medium' : 'hard',
      category,
      explanation: '',
    });
  }
  return result;
}

// ─── ASOSIY TEST KOMPONENTI ───
function TestPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useLang();

  const cfg = CAT_CFG[category] || CAT_CFG['general-knowledge'];
  const catName = CAT_NAMES[category]?.[lang] || category;

  const [phase, setPhase] = useState('loading'); // loading | noQuestions | aiGenerate | ready | active | submitting
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(cfg.time * 60);
  const [questionTimes, setQuestionTimes] = useState({});
  const [questionStart, setQuestionStart] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ─── SAVOLLARNI YUKLASH ───
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get(`/questions/test/${category}?count=${cfg.count}`);
        if (data.questions?.length > 0) {
          setQuestions(data.questions);
          setPhase('ready');
        } else {
          setPhase('noQuestions');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setPhase('noQuestions');
        } else {
          const msg = lang==='uz'?'Xato yuz berdi':lang==='ru'?'Ошибка загрузки':'Failed to load';
          toast.error(msg);
          navigate('/dashboard');
        }
      }
    };
    load();
  }, [category, lang]);

  // AI yaratgandan keyin
  const handleAIGenerated = (qs) => {
    setQuestions(qs);
    setPhase('ready');
    const msg = lang==='uz'?`${qs.length} ta savol tayyor!`:lang==='ru'?`${qs.length} вопросов готово!`:`${qs.length} questions ready!`;
    toast.success(msg);
  };

  // ─── TIMER ───
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === 'active') setQuestionStart(Date.now());
  }, [current, phase]);

  const startTest = () => {
    startTimeRef.current = Date.now();
    setPhase('active');
  };

  const selectOption = (id) => {
    setSelectedOption(id);
    setAnswers(p => ({ ...p, [current]: id }));
  };

  const goTo = (idx) => {
    if (questionStart) setQuestionTimes(p => ({ ...p, [current]: Math.round((Date.now()-questionStart)/1000) }));
    setCurrent(idx);
    setSelectedOption(answers[idx] || null);
  };

  const handleSubmit = useCallback(async (timeout = false) => {
    clearInterval(timerRef.current);
    setPhase('submitting');

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const submitted = questions.map((q, i) => ({
      questionId: q._id?.toString().startsWith('fallback') ? null : q._id,
      selectedAnswer: answers[i] || null,
      timeTaken: questionTimes[i] || 0,
    })).filter(a => a.questionId);

    // Agar haqiqiy savollar bo'lmasa — fallback natija ko'rsatamiz
    if (submitted.length === 0) {
      const correct = Object.values(answers).filter((ans, i) => ans === questions[i]?.correctAnswer).length;
      navigate('/dashboard');
      const msg = lang==='uz'?`${correct}/${questions.length} to\'g\'ri`:lang==='ru'?`${correct}/${questions.length} правильно`:`${correct}/${questions.length} correct`;
      toast.success(msg);
      return;
    }

    try {
      const { data } = await API.post('/tests/submit', {
        category,
        answers: submitted,
        timeTaken,
        timeLimit: cfg.time * 60,
      });
      navigate(`/results/${data.result._id}`);
    } catch (err) {
      const msg = lang==='uz'?'Natijalarni saqlashda xato':lang==='ru'?'Ошибка сохранения':'Failed to save results';
      toast.error(msg);
      setPhase('active');
    }
  }, [questions, answers, questionTimes, category, cfg.time, navigate, lang]);

  const currentQ = questions[current];
  const progress = questions.length > 0 ? ((current+1)/questions.length)*100 : 0;
  const answeredCount = Object.keys(answers).length;
  const timerPct = (timeLeft / (cfg.time * 60)) * 100;
  const timerColor = timerPct > 50 ? '#00ff88' : timerPct > 20 ? '#ffd700' : '#ff006e';

  // ── LOADING ──
  if (phase === 'loading') return (
    <PageLayout>
      <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
        <div className="spinner" />
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Syne,sans-serif', fontSize:'14px' }}>
          {lang==='uz'?'Savollar yuklanmoqda...':lang==='ru'?'Загрузка вопросов...':'Loading questions...'}
        </p>
      </div>
    </PageLayout>
  );

  // ── SAVOLLAR YO'Q — AI TAKLIF ──
  if (phase === 'noQuestions') return (
    <PageLayout>
      <AIGenerateScreen
        category={category}
        lang={lang}
        t={t}
        onGenerated={handleAIGenerated}
        onBack={() => navigate('/dashboard')}
      />
    </PageLayout>
  );

  // ── SUBMITTING ──
  if (phase === 'submitting') return (
    <PageLayout>
      <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
        <div className="spinner" />
        <p style={{ color:'rgba(255,255,255,0.5)', fontFamily:'Syne,sans-serif', fontSize:'14px' }}>
          {lang==='uz'?'Natijalar hisoblanmoqda...':lang==='ru'?'Подсчёт результатов...':'Calculating results...'}
        </p>
      </div>
    </PageLayout>
  );

  // ── READY — BOSHLASH EKRANI ──
  if (phase === 'ready') return (
    <PageLayout>
      <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
        <motion.div
          initial={{ opacity:0, scale:0.95 }}
          animate={{ opacity:1, scale:1 }}
          style={{
            maxWidth:'500px', width:'100%',
            background:'rgba(255,255,255,0.04)',
            backdropFilter:'blur(30px)',
            border:`1px solid ${cfg.color}30`,
            borderRadius:'20px', padding:'40px',
          }}
        >
          <div style={{ fontSize:'52px', marginBottom:'18px', textAlign:'center' }}>{cfg.icon}</div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'26px', marginBottom:'10px', textAlign:'center' }}>
            {catName}
          </h1>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', margin:'24px 0' }}>
            {[
              { label: lang==='uz'?'Savollar':lang==='ru'?'Вопросов':'Questions', value: questions.length },
              { label: lang==='uz'?'Vaqt':lang==='ru'?'Время':'Time', value: `${cfg.time} ${lang==='uz'?'daq.':lang==='ru'?'мин.':'min'}` },
              { label: lang==='uz'?'Variantlar':lang==='ru'?'Вариантов':'Options', value: '4' },
              { label: lang==='uz'?'Aralashtirilgan':lang==='ru'?'Случайный':'Randomized', value: '✓' },
            ].map(info => (
              <div key={info.label} style={{ padding:'14px', borderRadius:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'11px', fontFamily:'Syne,sans-serif', marginBottom:'5px', letterSpacing:'0.05em' }}>{info.label}</p>
                <p style={{ color:cfg.color, fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'20px' }}>{info.value}</p>
              </div>
            ))}
          </div>

          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', marginBottom:'24px', fontFamily:'DM Sans,sans-serif', lineHeight:1.6, textAlign:'center' }}>
            {lang==='uz'
              ? "Timer boshlanayotganda test to'xtatib bo'lmaydi. Javob bermaganlar o'tkazilgan deb hisoblanadi."
              : lang==='ru'
              ? "После старта таймер не останавливается. Пропущенные вопросы считаются пропущенными."
              : "Timer starts when you click Start. Unanswered questions will be marked as skipped."}
          </p>

          <button
            onClick={startTest}
            style={{
              width:'100%', padding:'16px',
              borderRadius:'12px', border:'none',
              background:`linear-gradient(135deg, ${cfg.color}, #bf00ff)`,
              color:'#020209', fontFamily:'Syne,sans-serif',
              fontWeight:700, fontSize:'16px', cursor:'pointer',
              letterSpacing:'0.05em',
              boxShadow:`0 0 30px ${cfg.color}40`,
            }}
          >
            {lang==='uz'?'Testni Boshlash →':lang==='ru'?'Начать тест →':'Start Test →'}
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );

  // ── ACTIVE — TEST JARAYONI ──
  return (
    <div style={{ minHeight:'100vh', background:'#020209' }}>

      {/* TOP BAR */}
      <div style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(2,2,9,0.97)',
        backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'12px 24px',
      }}>
        <div style={{ maxWidth:'800px', margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px', flexWrap:'wrap', gap:'8px' }}>
            {/* Kategoriya */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'20px' }}>{cfg.icon}</span>
              <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'14px' }}>{catName}</span>
            </div>

            {/* Timer */}
            <div style={{
              display:'flex', alignItems:'center', gap:'7px',
              padding:'7px 14px', borderRadius:'8px',
              background:`${timerColor}15`,
              border:`1px solid ${timerColor}40`,
            }}>
              <span>⏱</span>
              <span style={{ fontFamily:'JetBrains Mono,monospace', fontWeight:600, fontSize:'17px', color:timerColor, letterSpacing:'0.1em' }}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Javoblar */}
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'13px', color:'rgba(255,255,255,0.5)' }}>
              {answeredCount}/{questions.length} {lang==='uz'?'javoblandi':lang==='ru'?'отвечено':'answered'}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height:'4px', background:'rgba(255,255,255,0.08)', borderRadius:'2px' }}>
            <div style={{
              height:'100%', width:`${progress}%`,
              background:`linear-gradient(90deg, ${cfg.color}, #bf00ff)`,
              borderRadius:'2px', transition:'width 0.3s ease',
              boxShadow:`0 0 8px ${cfg.color}60`,
            }} />
          </div>
        </div>
      </div>

      {/* SAVOL MAYDONI */}
      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'36px 24px' }}>
        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={current}
              initial={{ opacity:0, x:30 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-30 }}
              transition={{ duration:0.22 }}
            >
              {/* Savol raqami + daraja */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
                <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'12px', color:cfg.color, letterSpacing:'0.08em' }}>
                  {lang==='uz'?'SAVOL':lang==='ru'?'ВОПРОС':'QUESTION'} {current+1} / {questions.length}
                </span>
                <span style={{
                  padding:'3px 10px', borderRadius:'5px',
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  fontSize:'11px', color:'rgba(255,255,255,0.5)',
                  fontFamily:'Syne,sans-serif', fontWeight:600, textTransform:'uppercase',
                }}>
                  {currentQ.difficulty || 'medium'}
                </span>
              </div>

              {/* Savol matni */}
              <div style={{
                padding:'26px', borderRadius:'14px',
                background:'rgba(255,255,255,0.04)',
                border:`1px solid ${cfg.color}20`,
                marginBottom:'20px',
              }}>
                <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:'clamp(15px,2.3vw,18px)', lineHeight:1.7, color:'white', fontWeight:500 }}>
                  {currentQ.text}
                </p>
              </div>

              {/* Variantlar */}
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px' }}>
                {currentQ.options?.map((opt, i) => {
                  const isSel = selectedOption === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      initial={{ opacity:0, y:8 }}
                      animate={{ opacity:1, y:0 }}
                      transition={{ delay:i*0.06 }}
                      onClick={() => selectOption(opt.id)}
                      style={{
                        display:'flex', alignItems:'center', gap:'14px',
                        padding:'16px 18px', borderRadius:'12px',
                        background: isSel ? `${cfg.color}15` : 'rgba(255,255,255,0.03)',
                        border:`2px solid ${isSel ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                        cursor:'pointer', textAlign:'left',
                        transition:'all 0.18s ease', color:'white',
                        boxShadow: isSel ? `0 0 20px ${cfg.color}20` : 'none',
                      }}
                    >
                      <div style={{
                        width:'34px', height:'34px', borderRadius:'8px',
                        background: isSel ? cfg.color : 'rgba(255,255,255,0.06)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px',
                        color: isSel ? '#020209' : 'rgba(255,255,255,0.5)',
                        flexShrink:0, transition:'all 0.18s ease',
                      }}>
                        {opt.id}
                      </div>
                      <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'15px', lineHeight:1.5 }}>
                        {opt.text}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigatsiya */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
                {/* Prev */}
                <button
                  onClick={() => goTo(current-1)}
                  disabled={current===0}
                  style={{
                    padding:'11px 22px', borderRadius:'10px',
                    border:'1px solid rgba(255,255,255,0.15)',
                    background:'rgba(255,255,255,0.04)',
                    color: current===0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                    fontFamily:'Syne,sans-serif', fontWeight:600,
                    cursor: current===0 ? 'not-allowed' : 'pointer', fontSize:'13px',
                  }}
                >
                  ← {lang==='uz'?'Oldingi':lang==='ru'?'Назад':'Previous'}
                </button>

                {/* Savol raqamlari */}
                <div style={{ display:'flex', gap:'5px', flexWrap:'wrap', justifyContent:'center', maxWidth:'420px' }}>
                  {questions.slice(0, Math.min(questions.length, 20)).map((_,i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      style={{
                        width:'28px', height:'28px', borderRadius:'6px',
                        background: i===current ? cfg.color : answers[i] ? `${cfg.color}40` : 'rgba(255,255,255,0.06)',
                        border:`1px solid ${i===current ? cfg.color : answers[i] ? `${cfg.color}60` : 'rgba(255,255,255,0.1)'}`,
                        color: i===current ? '#020209' : answers[i] ? cfg.color : 'rgba(255,255,255,0.4)',
                        fontSize:'11px', fontFamily:'Syne,sans-serif', fontWeight:600,
                        cursor:'pointer', transition:'all 0.15s',
                      }}
                    >
                      {i+1}
                    </button>
                  ))}
                </div>

                {/* Next / Submit */}
                <button
                  onClick={() => current===questions.length-1 ? handleSubmit() : goTo(current+1)}
                  style={{
                    padding:'11px 22px', borderRadius:'10px', border:'none',
                    background: current===questions.length-1
                      ? 'linear-gradient(135deg,#00ff88,#00f5ff)'
                      : `linear-gradient(135deg,${cfg.color},#bf00ff)`,
                    color:'#020209', fontFamily:'Syne,sans-serif',
                    fontWeight:700, cursor:'pointer',
                    letterSpacing:'0.04em', fontSize:'13px',
                  }}
                >
                  {current===questions.length-1
                    ? (lang==='uz'?'Yakunlash ✓':lang==='ru'?'Завершить ✓':'Submit ✓')
                    : (lang==='uz'?'Keyingi →':lang==='ru'?'Далее →':'Next →')
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TestPage;
