/**
 * ResultsPage
 * - A/B/C/D variantlari to'liq ko'rinadi
 * - To'g'ri javob yashil, noto'g'ri qizil
 * - 3 tilda
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { API } from '../context/AuthContext';
import PageLayout from '../components/common/PageLayout';
import { useLang } from '../context/LangContext';
import { format } from 'date-fns';

const CAT_CFG = {
  'general-knowledge':  { icon:'🌐', color:'#00f5ff', label:{uz:'Umumiy Bilim',     ru:'Общие знания',       en:'General Knowledge'  }},
  'english-vocabulary': { icon:'🇬🇧', color:'#bf00ff', label:{uz:'Ingliz tili',      ru:'Английский',         en:'English'            }},
  'grammar':            { icon:'✏️', color:'#00ff88', label:{uz:'Grammatika',        ru:'Грамматика',         en:'Grammar'            }},
  'reading':            { icon:'📖', color:'#ff006e', label:{uz:"O'qish",            ru:'Чтение',             en:'Reading'            }},
  'listening':          { icon:'🎧', color:'#ffd700', label:{uz:'Tinglash',          ru:'Аудирование',        en:'Listening'          }},
  'ielts-mock':         { icon:'🏆', color:'#ff6b35', label:{uz:'IELTS Mock',        ru:'IELTS',              en:'IELTS Mock'         }},
  'math':               { icon:'📐', color:'#00f5ff', label:{uz:'Matematika',        ru:'Математика',         en:'Mathematics'        }},
  'physics':            { icon:'⚡', color:'#bf00ff', label:{uz:'Fizika',            ru:'Физика',             en:'Physics'            }},
  'chemistry':          { icon:'🧪', color:'#00ff88', label:{uz:'Kimyo',             ru:'Химия',              en:'Chemistry'          }},
  'biology':            { icon:'🧬', color:'#ff006e', label:{uz:'Biologiya',         ru:'Биология',           en:'Biology'            }},
  'history':            { icon:'🏛️', color:'#ffd700', label:{uz:'Tarix',             ru:'История',            en:'History'            }},
  'geography':          { icon:'🌍', color:'#ff6b35', label:{uz:'Geografiya',        ru:'География',          en:'Geography'          }},
  'it':                 { icon:'💻', color:'#7b61ff', label:{uz:'Informatika',       ru:'Информатика',        en:'Computer Science'   }},
  'literature':         { icon:'📚', color:'#ff9500', label:{uz:"Adabiyot",          ru:'Литература',         en:'Literature'         }},
  'logic':              { icon:'🧩', color:'#bf00ff', label:{uz:'Mantiq',            ru:'Логика',             en:'Logic'              }},
};

const gradeColors = {'A+':'#00ff88','A':'#00f5ff','B':'#7b61ff','C':'#ffd700','D':'#ff9500','F':'#ff006e'};

const gradeMsg = {
  'A+': {uz:"Ajoyib! Zo'r natija!",          ru:'Исключительно! Отлично!',       en:"Exceptional! Outstanding!"},
  'A':  {uz:"A'lo! Davom eting!",             ru:'Отлично! Продолжайте!',         en:'Excellent! Keep it up!'},
  'B':  {uz:"Yaxshi! Biroz ko'proq mashq.",   ru:'Хорошо! Ещё немного практики.', en:'Good! A bit more practice.'},
  'C':  {uz:"O'rtacha. Ko'proq o'qing!",      ru:'Неплохо. Учитесь больше!',      en:'Decent. Keep studying!'},
  'D':  {uz:"Yaxshiroq qilish mumkin.",        ru:'Можно лучше. Повторите.',       en:'You can do better.'},
  'F':  {uz:"Tushkunlikka tushmang! Mashq qiling.", ru:'Не сдавайтесь! Практикуйтесь.', en:"Don't give up! More practice."},
};

// Doira score komponenti
function CircularScore({ percentage, color, label }) {
  const r = 70, circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div style={{position:'relative',width:'180px',height:'180px'}}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{transform:'rotate(-90deg)'}}>
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{transition:'stroke-dashoffset 1.5s ease-in-out', filter:`drop-shadow(0 0 8px ${color})`}}
        />
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'36px',color}}>{percentage}%</span>
        <span style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans,sans-serif'}}>{label}</span>
      </div>
    </div>
  );
}

// ── JAVOB KAROCHKASI — A/B/C/D variantlari bilan ──
function AnswerCard({ ans, index, lang }) {
  const isCorrect = ans.isCorrect;
  const isSkipped = !ans.selectedAnswer;

  const statusColor = isCorrect ? '#00ff88' : isSkipped ? '#ffd700' : '#ff006e';
  const statusBg    = isCorrect ? 'rgba(0,255,136,0.06)' : isSkipped ? 'rgba(255,215,0,0.06)' : 'rgba(255,0,110,0.06)';
  const statusBorder= isCorrect ? 'rgba(0,255,136,0.2)'  : isSkipped ? 'rgba(255,215,0,0.2)'  : 'rgba(255,0,110,0.2)';

  const statusText = isSkipped
    ? (lang==='uz'?"— O'tkazilgan":lang==='ru'?'— Пропущено':'— Skipped')
    : isCorrect
    ? (lang==='uz'?"✓ To'g'ri":lang==='ru'?'✓ Верно':'✓ Correct')
    : (lang==='uz'?"✗ Noto'g'ri":lang==='ru'?'✗ Неверно':'✗ Wrong');

  // Variantlarni aniqlash
  const options = ans.options && ans.options.length === 4
    ? ans.options
    : ['A','B','C','D'].map(id => ({ id, text: id === ans.selectedAnswer ? `(${lang==='uz'?'Javobingiz':lang==='ru'?'Ваш ответ':'Your answer'})` : '' }));

  return (
    <motion.div
      initial={{opacity:0, y:10}}
      animate={{opacity:1, y:0}}
      transition={{delay: index * 0.04}}
      style={{
        borderRadius:'14px', overflow:'hidden',
        border:`1px solid ${statusBorder}`,
        background: statusBg,
        marginBottom:'0',
      }}
    >
      {/* Savol header */}
      <div style={{
        padding:'14px 18px',
        borderBottom:`1px solid ${statusBorder}`,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        gap:'10px',
      }}>
        <span style={{
          fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'12px',
          color:'rgba(255,255,255,0.5)', letterSpacing:'0.05em',
        }}>
          {lang==='uz'?'SAVOL':lang==='ru'?'ВОПРОС':'QUESTION'} {index+1}
        </span>
        <span style={{
          fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'12px',
          color: statusColor,
          padding:'3px 10px', borderRadius:'6px',
          background:`${statusColor}15`,
        }}>
          {statusText}
        </span>
      </div>

      {/* Savol matni */}
      <div style={{padding:'16px 18px 12px'}}>
        <p style={{
          fontFamily:'DM Sans,sans-serif', fontSize:'14px',
          lineHeight:1.6, color:'rgba(255,255,255,0.9)',
          marginBottom:'14px', fontWeight:500,
        }}>
          {ans.questionText}
        </p>

        {/* A/B/C/D variantlari */}
        <div style={{display:'flex', flexDirection:'column', gap:'7px'}}>
          {options.map((opt) => {
            const isSelected = ans.selectedAnswer === opt.id;
            const isRight    = ans.correctAnswer  === opt.id;

            // Rang logikasi:
            // To'g'ri javob — har doim yashil
            // Tanlangan noto'g'ri — qizil
            // Qolganlar — neytral
            let bgColor = 'rgba(255,255,255,0.04)';
            let borderColor = 'rgba(255,255,255,0.08)';
            let textColor = 'rgba(255,255,255,0.55)';
            let letterBg = 'rgba(255,255,255,0.06)';
            let letterColor = 'rgba(255,255,255,0.4)';
            let icon = null;

            if (isRight) {
              bgColor = 'rgba(0,255,136,0.1)';
              borderColor = 'rgba(0,255,136,0.4)';
              textColor = 'white';
              letterBg = '#00ff88';
              letterColor = '#020209';
              icon = '✓';
            } else if (isSelected && !isRight) {
              bgColor = 'rgba(255,0,110,0.1)';
              borderColor = 'rgba(255,0,110,0.4)';
              textColor = 'rgba(255,200,200,0.9)';
              letterBg = '#ff006e';
              letterColor = 'white';
              icon = '✗';
            }

            return (
              <div key={opt.id} style={{
                display:'flex', alignItems:'center', gap:'12px',
                padding:'10px 14px', borderRadius:'10px',
                background: bgColor,
                border:`1px solid ${borderColor}`,
                transition:'all 0.2s',
              }}>
                {/* Harf (A/B/C/D) */}
                <div style={{
                  width:'32px', height:'32px', borderRadius:'8px',
                  background: letterBg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'13px',
                  color: letterColor, flexShrink:0,
                  boxShadow: isRight ? '0 0 10px rgba(0,255,136,0.4)' : isSelected && !isRight ? '0 0 10px rgba(255,0,110,0.3)' : 'none',
                }}>
                  {icon || opt.id}
                </div>

                {/* Variant matni */}
                <span style={{
                  fontFamily:'DM Sans,sans-serif', fontSize:'13px',
                  color: textColor, lineHeight:1.4, flex:1,
                }}>
                  {opt.text}
                </span>

                {/* Badge: Sizning javob / To'g'ri javob */}
                <div style={{display:'flex', gap:'5px', flexShrink:0}}>
                  {isSelected && !isRight && (
                    <span style={{
                      fontSize:'10px', padding:'2px 7px', borderRadius:'4px',
                      background:'rgba(255,0,110,0.2)', color:'#ff006e',
                      fontFamily:'Syne,sans-serif', fontWeight:600,
                    }}>
                      {lang==='uz'?'Sizniki':lang==='ru'?'Ваш':'Yours'}
                    </span>
                  )}
                  {isRight && (
                    <span style={{
                      fontSize:'10px', padding:'2px 7px', borderRadius:'4px',
                      background:'rgba(0,255,136,0.2)', color:'#00ff88',
                      fontFamily:'Syne,sans-serif', fontWeight:600,
                    }}>
                      {lang==='uz'?"To'g'ri":lang==='ru'?'Верно':'Correct'}
                    </span>
                  )}
                  {isSelected && isRight && (
                    <span style={{
                      fontSize:'10px', padding:'2px 7px', borderRadius:'4px',
                      background:'rgba(0,255,136,0.2)', color:'#00ff88',
                      fontFamily:'Syne,sans-serif', fontWeight:600,
                    }}>
                      {lang==='uz'?'Siz va To\'g\'ri':lang==='ru'?'Ваш и Верный':'Yours ✓'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Izoh (explanation) */}
        {ans.explanation && (
          <div style={{
            marginTop:'10px', padding:'10px 14px', borderRadius:'8px',
            background:'rgba(0,245,255,0.05)',
            border:'1px solid rgba(0,245,255,0.15)',
          }}>
            <p style={{
              fontSize:'12px', color:'rgba(0,245,255,0.8)',
              fontFamily:'DM Sans,sans-serif', lineHeight:1.6,
            }}>
              💡 {ans.explanation}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── ASOSIY KOMPONENT ──
function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  const tx = (uz, ru, en) => lang==='uz'?uz:lang==='ru'?ru:en;

  useEffect(() => {
    API.get(`/tests/result/${id}`)
      .then(({data}) => setResult(data.result))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <PageLayout>
      <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="spinner"/>
      </div>
    </PageLayout>
  );
  if (!result) return null;

  const cfg = CAT_CFG[result.category] || {icon:'📊',color:'#00f5ff',label:{uz:result.category,ru:result.category,en:result.category}};
  const gradeColor = gradeColors[result.grade] || '#00f5ff';
  const catLabel = cfg.label[lang] || cfg.label.en;
  const gMsg = gradeMsg[result.grade]?.[lang] || '';
  const timeMins = result.timeTaken ? Math.floor(result.timeTaken/60) : 0;
  const timeSecs = result.timeTaken ? result.timeTaken%60 : 0;

  const pieData = [
    {name:tx("To'g'ri",'Правильно','Correct'),  value:result.correctAnswers,       color:'#00ff88'},
    {name:tx("Noto'g'ri",'Неверно','Wrong'),     value:result.incorrectAnswers,     color:'#ff006e'},
    {name:tx("O'tkazilgan",'Пропущено','Skipped'),value:result.skippedAnswers||0,   color:'rgba(255,255,255,0.15)'},
  ].filter(d=>d.value>0);

  return (
    <PageLayout>
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'20px 24px 60px'}}>

        {/* HEADER */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{fontSize:'46px',marginBottom:'10px'}}>{cfg.icon}</div>
          <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(24px,4vw,38px)',marginBottom:'6px'}}>
            {tx('Test Yakunlandi!','Тест завершён!','Test Complete!')}
          </h1>
          <p style={{color:'rgba(255,255,255,0.45)',fontFamily:'DM Sans,sans-serif',fontSize:'14px'}}>
            {catLabel} • {format(new Date(result.createdAt),'dd.MM.yyyy HH:mm')}
          </p>
        </motion.div>

        {/* SCORE + GRADE + PIE */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'16px',marginBottom:'20px'}}>

          <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.2}}
            style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',background:'rgba(255,255,255,0.03)',border:`1px solid ${gradeColor}25`,borderRadius:'16px'}}
          >
            <CircularScore percentage={result.percentage} color={gradeColor} label={tx('Ball','Балл','Score')}/>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',background:'rgba(255,255,255,0.03)',border:`1px solid ${gradeColor}25`,borderRadius:'16px',textAlign:'center'}}
          >
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'62px',color:gradeColor,lineHeight:1,filter:`drop-shadow(0 0 15px ${gradeColor}80)`,marginBottom:'10px'}}>
              {result.grade}
            </div>
            <p style={{color:'rgba(255,255,255,0.6)',fontFamily:'DM Sans,sans-serif',fontSize:'13px',lineHeight:1.5}}>{gMsg}</p>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
            style={{padding:'20px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px'}}
          >
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'11px',marginBottom:'10px',color:'rgba(255,255,255,0.45)',letterSpacing:'0.08em'}}>
              {tx('TAQSIMOT','РАЗБИВКА','BREAKDOWN')}
            </h3>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                  {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{background:'#12122e',border:'1px solid rgba(0,245,255,0.3)',borderRadius:'8px',fontSize:'12px'}}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',flexDirection:'column',gap:'5px',marginTop:'6px'}}>
              {pieData.map(d=>(
                <div key={d.name} style={{display:'flex',justifyContent:'space-between',fontSize:'12px'}}>
                  <span style={{display:'flex',alignItems:'center',gap:'5px',color:'rgba(255,255,255,0.55)'}}>
                    <span style={{width:'7px',height:'7px',borderRadius:'50%',background:d.color,display:'inline-block'}}/>
                    {d.name}
                  </span>
                  <span style={{color:d.color,fontFamily:'Syne,sans-serif',fontWeight:700}}>{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* STATISTIKA */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px',marginBottom:'22px'}}>
          {[
            {label:tx('Jami savollar','Всего вопросов','Total Questions'),  value:result.totalQuestions,                          icon:'❓', color:'white'   },
            {label:tx("To'g'ri",'Правильно','Correct'),                     value:result.correctAnswers,                          icon:'✅', color:'#00ff88' },
            {label:tx("Noto'g'ri",'Неверно','Wrong'),                       value:result.incorrectAnswers,                        icon:'❌', color:'#ff006e' },
            {label:tx('Sarflangan vaqt','Затрачено','Time Taken'),           value:`${timeMins}m ${timeSecs}s`,                    icon:'⏱', color:'#00f5ff' },
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.07}}
              style={{padding:'16px',borderRadius:'12px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',textAlign:'center'}}
            >
              <div style={{fontSize:'20px',marginBottom:'6px'}}>{s.icon}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'20px',color:s.color,marginBottom:'3px'}}>{s.value}</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans,sans-serif'}}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* JAVOBLARNI KO'RISH TUGMASI */}
        <div style={{marginBottom:'20px'}}>
          <button
            onClick={()=>setShowAnswers(p=>!p)}
            style={{
              width:'100%', padding:'14px', borderRadius:'10px',
              border:'1px solid rgba(255,255,255,0.12)',
              background: showAnswers ? 'rgba(0,245,255,0.08)' : 'rgba(255,255,255,0.03)',
              color: showAnswers ? '#00f5ff' : 'rgba(255,255,255,0.6)',
              fontFamily:'Syne,sans-serif', fontWeight:600,
              cursor:'pointer', fontSize:'14px',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            }}
          >
            {showAnswers
              ? `▲ ${tx("Javoblarni Yopish",'Скрыть ответы','Hide Answers')}`
              : `▼ ${tx("Javoblarni Ko'rish (A/B/C/D)",'Просмотр ответов (A/B/C/D)','Review Answers (A/B/C/D)')}`
            }
          </button>

          <AnimatePresence>
            {showAnswers && (
              <motion.div
                initial={{opacity:0, height:0}}
                animate={{opacity:1, height:'auto'}}
                exit={{opacity:0, height:0}}
                style={{marginTop:'14px', display:'flex', flexDirection:'column', gap:'10px', overflow:'hidden'}}
              >
                {result.answers.map((ans,i)=>(
                  <AnswerCard key={i} ans={ans} index={i} lang={lang}/>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TUGMALAR */}
        <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
          <button
            onClick={()=>navigate(`/test/${result.category}`)}
            style={{
              padding:'13px 26px', borderRadius:'10px', border:'none',
              background:`linear-gradient(135deg,${cfg.color||'#00f5ff'},#bf00ff)`,
              color:'#020209', fontFamily:'Syne,sans-serif', fontWeight:700,
              fontSize:'14px', cursor:'pointer',
            }}
          >
            🔄 {tx('Qayta Boshlash','Пройти снова','Retake Test')}
          </button>
          <Link to="/dashboard" style={{
            padding:'13px 26px', borderRadius:'10px',
            border:'1px solid rgba(255,255,255,0.15)',
            background:'rgba(255,255,255,0.04)',
            color:'rgba(255,255,255,0.7)',
            fontFamily:'Syne,sans-serif', fontWeight:700,
            fontSize:'14px', textDecoration:'none',
          }}>
            📊 {tx('Boshqaruv','Панель','Dashboard')}
          </Link>
          <Link to="/leaderboard" style={{
            padding:'13px 26px', borderRadius:'10px',
            border:'1px solid rgba(0,245,255,0.3)',
            background:'rgba(0,245,255,0.08)',
            color:'#00f5ff',
            fontFamily:'Syne,sans-serif', fontWeight:700,
            fontSize:'14px', textDecoration:'none',
          }}>
            🏆 {tx('Reyting','Рейтинг','Leaderboard')}
          </Link>
        </div>

      </div>
    </PageLayout>
  );
}

export default ResultsPage;
