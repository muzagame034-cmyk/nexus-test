import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { useAuth, API } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PageLayout from '../components/common/PageLayout';
import { format } from 'date-fns';

const CAT_CFG = {
  'general-knowledge':  {icon:'🌐',color:'#00f5ff'},
  'english-vocabulary': {icon:'🇬🇧',color:'#bf00ff'},
  'grammar':            {icon:'✏️',color:'#00ff88'},
  'reading':            {icon:'📖',color:'#ff006e'},
  'listening':          {icon:'🎧',color:'#ffd700'},
  'ielts-mock':         {icon:'🏆',color:'#ff6b35'},
  'math':               {icon:'📐',color:'#00f5ff'},
  'physics':            {icon:'⚡',color:'#bf00ff'},
  'chemistry':          {icon:'🧪',color:'#00ff88'},
  'biology':            {icon:'🧬',color:'#ff006e'},
  'history':            {icon:'🏛️',color:'#ffd700'},
  'geography':          {icon:'🌍',color:'#ff6b35'},
  'it':                 {icon:'💻',color:'#7b61ff'},
  'literature':         {icon:'📖',color:'#ff9500'},
  'logic':              {icon:'🧩',color:'#bf00ff'},
};

const CAT_NAMES = {
  'general-knowledge':{uz:'Umumiy Bilim',ru:'Общие знания',en:'General Knowledge'},
  'english-vocabulary':{uz:'Ingliz tili',ru:'Английский',en:'English'},
  'grammar':          {uz:'Grammatika', ru:'Грамматика',  en:'Grammar'},
  'reading':          {uz:'O\'qish',    ru:'Чтение',      en:'Reading'},
  'listening':        {uz:'Tinglash',   ru:'Аудирование', en:'Listening'},
  'ielts-mock':       {uz:'IELTS Mock', ru:'IELTS',       en:'IELTS Mock'},
  'math':             {uz:'Matematika', ru:'Математика',  en:'Math'},
  'physics':          {uz:'Fizika',     ru:'Физика',      en:'Physics'},
  'chemistry':        {uz:'Kimyo',      ru:'Химия',       en:'Chemistry'},
  'biology':          {uz:'Biologiya',  ru:'Биология',    en:'Biology'},
  'history':          {uz:'Tarix',      ru:'История',     en:'History'},
  'geography':        {uz:'Geografiya', ru:'География',   en:'Geography'},
  'it':               {uz:'Informatika',ru:'Информатика', en:'IT'},
  'literature':       {uz:'Adabiyot',   ru:'Литература',  en:'Literature'},
  'logic':            {uz:'Mantiq',     ru:'Логика',      en:'Logic'},
};

const gradeColors = {'A+':'#00ff88','A':'#00f5ff','B':'#7b61ff','C':'#ffd700','D':'#ff9500','F':'#ff006e'};

function StatCard({label,value,icon,color,suffix=''}) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      style={{padding:'22px',borderRadius:'14px',background:'rgba(255,255,255,0.03)',border:`1px solid ${color}20`}}
    >
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div>
          <p style={{color:'rgba(255,255,255,0.45)',fontSize:'12px',fontFamily:'Syne,sans-serif',fontWeight:600,letterSpacing:'0.06em',marginBottom:'8px'}}>{label}</p>
          <p style={{color,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'30px',lineHeight:1}}>{value}<span style={{fontSize:'18px',opacity:0.7}}>{suffix}</span></p>
        </div>
        <div style={{width:'44px',height:'44px',borderRadius:'10px',background:`${color}15`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>{icon}</div>
      </div>
    </motion.div>
  );
}

function DashboardPage() {
  const { user, refreshUser } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pr, hr] = await Promise.all([API.get('/tests/progress'), API.get('/tests/history?limit=8')]);
        setProgress(pr.data); setHistory(hr.data.results || []);
      } catch(e){} finally { setLoading(false); }
    };
    fetch(); refreshUser();
  }, []);

  const trendData = (progress?.recentTests||[]).slice().reverse().map((t,i)=>({name:`#${i+1}`,score:t.percentage}));
  const radarData = Object.entries(CAT_CFG).slice(0,8).map(([key])=>{
    const stat = progress?.categoryStats?.find(s=>s._id===key);
    const nm = CAT_NAMES[key];
    return { category: nm?.[lang]||nm?.en||key, score: Math.round(stat?.avgScore||0) };
  });

  if(loading) return <PageLayout><div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spinner"/></div></PageLayout>;

  return (
    <PageLayout>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'20px 24px 60px'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{marginBottom:'32px'}}>
          <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(26px,4vw,38px)',marginBottom:'6px'}}>
            {t('dash_welcome')} <span style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{color:'rgba(255,255,255,0.45)',fontFamily:'DM Sans,sans-serif'}}>{t('dash_sub')}</p>
        </motion.div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:'14px',marginBottom:'28px'}}>
          <StatCard label={t('dash_tests')}   value={user?.stats?.totalTests||0}    icon="📊" color="#00f5ff"/>
          <StatCard label={t('dash_avg')}     value={user?.stats?.averageScore||0}  icon="⭐" color="#bf00ff" suffix="%"/>
          <StatCard label={t('dash_best')}    value={user?.stats?.bestScore||0}     icon="🏆" color="#00ff88" suffix="%"/>
          <StatCard label={t('dash_correct')} value={user?.stats?.correctAnswers||0}icon="✓"  color="#ffd700"/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'18px',marginBottom:'28px'}}>
          <div style={{padding:'22px',borderRadius:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'18px',fontSize:'14px',color:'rgba(255,255,255,0.8)'}}>📈 {t('dash_trend')}</h3>
            {trendData.length>0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fontSize:11}}/>
                  <YAxis domain={[0,100]} stroke="rgba(255,255,255,0.3)" tick={{fontSize:11}}/>
                  <Tooltip contentStyle={{background:'#12122e',border:'1px solid rgba(0,245,255,0.3)',borderRadius:'8px',fontSize:'12px'}} labelStyle={{color:'#00f5ff'}}/>
                  <Line type="monotone" dataKey="score" stroke="#00f5ff" strokeWidth={2} dot={{fill:'#00f5ff',r:4}}/>
                </LineChart>
              </ResponsiveContainer>
            ) : <div style={{height:'190px',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>{t('dash_no_tests')}</div>}
          </div>

          <div style={{padding:'22px',borderRadius:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'18px',fontSize:'14px',color:'rgba(255,255,255,0.8)'}}>📡 {t('dash_radar')}</h3>
            <ResponsiveContainer width="100%" height={190}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)"/>
                <PolarAngleAxis dataKey="category" tick={{fill:'rgba(255,255,255,0.5)',fontSize:10}}/>
                <Radar name="Score" dataKey="score" stroke="#00f5ff" fill="#00f5ff" fillOpacity={0.15} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'18px'}}>
          <div style={{padding:'22px',borderRadius:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'14px',fontSize:'14px'}}>🚀 {t('dash_quick')}</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {Object.entries(CAT_CFG).slice(0,8).map(([key,cfg])=>{
                const nm = CAT_NAMES[key];
                return (
                  <button key={key} onClick={()=>navigate(`/test/${key}`)}
                    style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',borderRadius:'9px',background:'rgba(255,255,255,0.03)',border:`1px solid ${cfg.color}20`,cursor:'pointer',textAlign:'left',transition:'all 0.2s',color:'white'}}
                    onMouseEnter={e=>{e.currentTarget.style.background=`${cfg.color}10`;e.currentTarget.style.borderColor=`${cfg.color}45`;}}
                    onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor=`${cfg.color}20`;}}
                  >
                    <span style={{fontSize:'17px'}}>{cfg.icon}</span>
                    <span style={{fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'12px'}}>{nm?.[lang]||nm?.en||key}</span>
                    <span style={{marginLeft:'auto',color:cfg.color,fontSize:'11px',fontWeight:600}}>→</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{padding:'22px',borderRadius:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'14px',fontSize:'14px'}}>📋 {t('dash_recent')}</h3>
            {history.length===0 ? (
              <div style={{textAlign:'center',padding:'40px 0',color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>{t('dash_no_tests')}</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
                {history.map(test=>{
                  const cfg=CAT_CFG[test.category]||{icon:'📊',color:'#00f5ff'};
                  const nm=CAT_NAMES[test.category];
                  return (
                    <Link key={test._id} to={`/results/${test._id}`} style={{textDecoration:'none'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'11px',padding:'11px 14px',borderRadius:'9px',background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',transition:'all 0.2s',cursor:'pointer'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      >
                        <span style={{fontSize:'18px'}}>{cfg.icon}</span>
                        <div style={{flex:1}}>
                          <p style={{fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'13px',marginBottom:'2px'}}>{nm?.[lang]||nm?.en||test.category}</p>
                          <p style={{color:'rgba(255,255,255,0.35)',fontSize:'11px',fontFamily:'DM Sans,sans-serif'}}>{test.correctAnswers}/{test.totalQuestions} • {format(new Date(test.createdAt),'MMM d, yyyy')}</p>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'17px',color:gradeColors[test.grade]||'#00f5ff'}}>{test.percentage}%</div>
                          <div style={{fontSize:'11px',color:gradeColors[test.grade]||'#00f5ff',fontWeight:600}}>{test.grade}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
export default DashboardPage;
