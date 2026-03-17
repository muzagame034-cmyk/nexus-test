/**
 * Home Page - 12 fan, UZ/RU/EN, Footer
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PageLayout from '../components/common/PageLayout';

const subjectColors = {
  exact:    { bg: 'rgba(0,245,255,0.06)',  border: 'rgba(0,245,255,0.18)',  c: '#00f5ff' },
  natural:  { bg: 'rgba(0,255,136,0.06)',  border: 'rgba(0,255,136,0.18)',  c: '#00ff88' },
  social:   { bg: 'rgba(255,215,0,0.06)',  border: 'rgba(255,215,0,0.18)',  c: '#ffd700' },
  language: { bg: 'rgba(191,0,255,0.06)',  border: 'rgba(191,0,255,0.18)',  c: '#bf00ff' },
  general:  { bg: 'rgba(255,149,0,0.06)',  border: 'rgba(255,149,0,0.18)',  c: '#ff9500' },
  ielts:    { bg: 'rgba(255,107,53,0.1)',  border: 'rgba(255,107,53,0.35)', c: '#ff6b35' },
};

const subjectNames = {
  exact:    { uz: 'Aniq fanlar',     ru: 'Точные науки',   en: 'Exact Sciences'   },
  natural:  { uz: 'Tabiiy fanlar',   ru: 'Естественные',   en: 'Natural Sciences' },
  social:   { uz: 'Ijtimoiy fanlar', ru: 'Социальные',     en: 'Social Sciences'  },
  language: { uz: 'Til fanlari',     ru: 'Языки',          en: 'Languages'        },
  general:  { uz: 'Umumiy',          ru: 'Общее',          en: 'General'          },
  ielts:    { uz: 'IELTS',           ru: 'IELTS',          en: 'IELTS'            },
};

const CATS = [
  { id:'math',              icon:'📐', color:'#00f5ff', count:'30+', subject:'exact',
    level:{uz:'1-11 sinf',ru:'1-11 кл.',en:'Gr.1-11'},
    title:{uz:'Matematika',ru:'Математика',en:'Mathematics'},
    desc:{uz:"Algebra, geometriya, logarifm va ko'paytirish",ru:'Алгебра, геометрия, логарифмы',en:'Algebra, geometry, logarithms & more'} },
  { id:'physics',           icon:'⚡', color:'#bf00ff', count:'30+', subject:'exact',
    level:{uz:'7-11 sinf',ru:'7-11 кл.',en:'Gr.7-11'},
    title:{uz:'Fizika',ru:'Физика',en:'Physics'},
    desc:{uz:'Mexanika, elektr, optika va termodinamika',ru:'Механика, электричество, оптика',en:'Mechanics, electricity, optics'} },
  { id:'chemistry',         icon:'🧪', color:'#00ff88', count:'30+', subject:'exact',
    level:{uz:'8-11 sinf',ru:'8-11 кл.',en:'Gr.8-11'},
    title:{uz:'Kimyo',ru:'Химия',en:'Chemistry'},
    desc:{uz:'Organik va anorganik kimyo, reaksiyalar',ru:'Органическая и неорганическая химия',en:'Organic, inorganic chemistry'} },
  { id:'biology',           icon:'🧬', color:'#ff006e', count:'30+', subject:'natural',
    level:{uz:'6-11 sinf',ru:'6-11 кл.',en:'Gr.6-11'},
    title:{uz:'Biologiya',ru:'Биология',en:'Biology'},
    desc:{uz:'Hujayra, genetika, evolyutsiya',ru:'Клетка, генетика, эволюция',en:'Cell biology, genetics, evolution'} },
  { id:'history',           icon:'🏛️', color:'#ffd700', count:'30+', subject:'social',
    level:{uz:'5-11 sinf',ru:'5-11 кл.',en:'Gr.5-11'},
    title:{uz:'Tarix',ru:'История',en:'History'},
    desc:{uz:"O'zbekiston va jahon tarixi",ru:'История Узбекистана и мира',en:'Uzbekistan & world history'} },
  { id:'geography',         icon:'🌍', color:'#ff6b35', count:'30+', subject:'natural',
    level:{uz:'5-11 sinf',ru:'5-11 кл.',en:'Gr.5-11'},
    title:{uz:'Geografiya',ru:'География',en:'Geography'},
    desc:{uz:"Fizik, iqtisodiy geografiya",ru:'Физическая и экономическая география',en:'Physical & economic geography'} },
  { id:'english-vocabulary',icon:'🇬🇧', color:'#00f5ff', count:'30+', subject:'language',
    level:{uz:'1-11 sinf',ru:'1-11 кл.',en:'Gr.1-11'},
    title:{uz:'Ingliz tili',ru:'Английский язык',en:'English Language'},
    desc:{uz:'Grammar, vocabulary, reading',ru:'Грамматика, лексика, чтение',en:'Grammar, vocabulary & reading'} },
  { id:'it',                icon:'💻', color:'#7b61ff', count:'30+', subject:'exact',
    level:{uz:'5-11 sinf',ru:'5-11 кл.',en:'Gr.5-11'},
    title:{uz:'Informatika',ru:'Информатика',en:'Computer Science'},
    desc:{uz:"Dasturlash, algoritmlar, ma'lumotlar bazasi",ru:'Программирование, алгоритмы',en:'Programming, algorithms & databases'} },
  { id:'literature',        icon:'📖', color:'#ff9500', count:'30+', subject:'language',
    level:{uz:'5-11 sinf',ru:'5-11 кл.',en:'Gr.5-11'},
    title:{uz:"O'zbek adabiyoti",ru:'Литература',en:'Literature'},
    desc:{uz:"O'zbek va jahon adabiyoti",ru:'Узбекская и мировая литература',en:'Uzbek & world literature'} },
  { id:'general-knowledge', icon:'🌐', color:'#00ff88', count:'30+', subject:'general',
    level:{uz:'Barchaga',ru:'Любой',en:'Any'},
    title:{uz:'Umumiy Bilim',ru:'Общие знания',en:'General Knowledge'},
    desc:{uz:"Fan, madaniyat, zamonaviy dunyo",ru:'Наука, культура, современный мир',en:'Science, culture & modern world'} },
  { id:'logic',             icon:'🧩', color:'#bf00ff', count:'20+', subject:'general',
    level:{uz:'Barchaga',ru:'Любой',en:'Any'},
    title:{uz:'Mantiq',ru:'Логика',en:'Logic & Reasoning'},
    desc:{uz:"Mantiqiy masalalar va fikrlash",ru:'Логические задачи и мышление',en:'Logical puzzles & critical thinking'} },
  { id:'ielts-mock',        icon:'🏆', color:'#ff6b35', count:'40', subject:'ielts', featured:true,
    level:{uz:'IELTS',ru:'IELTS',en:'IELTS'},
    title:{uz:'IELTS Mock Test',ru:'IELTS Пробный тест',en:'IELTS Mock Test'},
    desc:{uz:"To'liq IELTS simulyatsiyasi — 4 bo'lim",ru:'Полная симуляция IELTS — 4 раздела',en:'Full IELTS simulation — all 4 sections'} },
];

function Footer({ t, lang }) {
  const year = new Date().getFullYear();
  const sl = (uz,ru,en) => lang==='uz'?uz:lang==='ru'?ru:en;

  const quickLinks = [
    {path:'/',            label:t('nav_home')        },
    {path:'/dashboard',   label:t('nav_dashboard')   },
    {path:'/leaderboard', label:t('nav_leaderboard') },
    {path:'/register',    label:t('nav_register')    },
    {path:'/login',       label:t('nav_login')       },
  ];

  return (
    <footer style={{borderTop:'1px solid rgba(255,255,255,0.07)',background:'rgba(2,2,9,0.96)',backdropFilter:'blur(20px)',marginTop:'80px',position:'relative',zIndex:1}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'48px 24px 24px'}}>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'40px',marginBottom:'36px'}}>

          {/* Brand */}
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00f5ff" strokeWidth="1.5" fill="rgba(0,245,255,0.1)"/>
                <circle cx="14" cy="14" r="3" fill="#00f5ff"/>
              </svg>
              <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'20px',background:'linear-gradient(135deg,#00f5ff,#bf00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>NEXUS</span>
            </div>
            <p style={{color:'rgba(255,255,255,0.37)',fontFamily:'DM Sans,sans-serif',fontSize:'13px',lineHeight:1.7,maxWidth:'260px',marginBottom:'20px'}}>
              {t('footer_desc')}
            </p>
            {/* Faqat email */}
            <a href="mailto:info@nexustest.uz" style={{
              display:'inline-flex',alignItems:'center',gap:'8px',
              padding:'9px 16px',borderRadius:'8px',
              background:'rgba(0,245,255,0.07)',
              border:'1px solid rgba(0,245,255,0.2)',
              color:'#00f5ff',textDecoration:'none',
              fontFamily:'DM Sans,sans-serif',fontSize:'13px',
              transition:'all 0.2s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,245,255,0.14)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,245,255,0.07)';}}
            >
              <span>📧</span>
              <span>info@nexustest.uz</span>
            </a>
          </div>

          {/* Tezkor havolalar */}
          <div>
            <h4 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'11px',color:'#00f5ff',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'16px'}}>
              {t('footer_links')}
            </h4>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {quickLinks.map(l=>(
                <Link key={l.path} to={l.path} style={{color:'rgba(255,255,255,0.43)',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'13px',transition:'color 0.2s',display:'flex',alignItems:'center',gap:'7px'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#00f5ff'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.43)'}
                >
                  <span style={{color:'rgba(0,245,255,0.35)',fontSize:'9px'}}>▶</span>{l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Fanlar */}
          <div>
            <h4 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'11px',color:'#00f5ff',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'16px'}}>
              {sl('Fanlar','Предметы','Subjects')}
            </h4>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[
                {id:'math',       icon:'📐', label:{uz:'Matematika',ru:'Математика',en:'Math'}},
                {id:'physics',    icon:'⚡', label:{uz:'Fizika',     ru:'Физика',     en:'Physics'}},
                {id:'chemistry',  icon:'🧪', label:{uz:'Kimyo',      ru:'Химия',      en:'Chemistry'}},
                {id:'biology',    icon:'🧬', label:{uz:'Biologiya',  ru:'Биология',   en:'Biology'}},
                {id:'history',    icon:'🏛️', label:{uz:'Tarix',      ru:'История',    en:'History'}},
                {id:'it',         icon:'💻', label:{uz:'Informatika',ru:'Информатика',en:'IT'}},
              ].map(s=>(
                <Link key={s.id} to={`/test/${s.id}`} style={{
                  display:'flex',alignItems:'center',gap:'5px',
                  color:'rgba(255,255,255,0.4)',textDecoration:'none',
                  fontFamily:'DM Sans,sans-serif',fontSize:'12px',
                  transition:'color 0.2s',
                }}
                  onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.8)'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
                >
                  <span style={{fontSize:'13px'}}>{s.icon}</span>
                  {s.label[lang]||s.label.en}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:'20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'10px'}}>
          <p style={{color:'rgba(255,255,255,0.22)',fontFamily:'DM Sans,sans-serif',fontSize:'12px'}}>
            © {year} NEXUS. {t('footer_rights')}.
          </p>
          <div style={{display:'flex',gap:'18px'}}>
            {[
              {label:sl('Maxfiylik siyosati','Конфиденциальность','Privacy Policy'), href:'/policy?type=privacy'},
              {label:sl('Foydalanish shartlari','Условия использования','Terms of Use'), href:'/policy?type=terms'},
            ].map(item=>(
              <a key={item.label} href={item.href} style={{color:'rgba(255,255,255,0.22)',textDecoration:'none',fontFamily:'DM Sans,sans-serif',fontSize:'11px',transition:'color 0.2s'}}
                onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.6)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.22)'}
              >{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}


function HomePage() {
  const { isAuthenticated } = useAuth();
  const { t, lang } = useLang();

  const cv = {
    hidden: {opacity:0,y:26},
    visible: (i) => ({opacity:1,y:0,transition:{delay:i*0.06,duration:0.4,ease:'easeOut'}}),
  };

  const stats = [
    {value:'12',  label:t('stat_categories'),icon:'📊'},
    {value:'400+',label:t('stat_questions'), icon:'❓'},
    {value:'AI',  label:t('stat_ai'),        icon:'🤖'},
    {value:'∞',   label:t('stat_sessions'),  icon:'🔄'},
  ];

  return (
    <PageLayout>
      {/* HERO */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'40px 24px 60px',textAlign:'center'}}>
        <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.75}}>
          <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.2}}
            style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'6px 20px',borderRadius:'20px',border:'1px solid rgba(0,245,255,0.3)',background:'rgba(0,245,255,0.08)',marginBottom:'24px',fontFamily:'Syne,sans-serif',fontSize:'12px',color:'#00f5ff',letterSpacing:'0.1em',fontWeight:600}}
          >
            <span style={{width:'7px',height:'7px',borderRadius:'50%',background:'#00ff88',display:'inline-block'}}/>
            {t('hero_badge')}
          </motion.div>

          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'clamp(36px,7.5vw,82px)',fontWeight:800,lineHeight:1.05,marginBottom:'18px',letterSpacing:'-0.02em'}}>
            <span style={{color:'white'}}>{t('hero_title1')}</span><br/>
            <span style={{background:'linear-gradient(135deg,#00f5ff,#bf00ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{t('hero_title2')}</span>
          </h1>

          <p style={{fontFamily:'DM Sans,sans-serif',fontSize:'clamp(14px,2vw,18px)',color:'rgba(255,255,255,0.5)',maxWidth:'560px',margin:'0 auto 38px',lineHeight:1.65}}>
            {t('hero_subtitle')}
          </p>

          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to={isAuthenticated?'/dashboard':'/register'} style={{padding:'14px 32px',borderRadius:'12px',background:'linear-gradient(135deg,#00f5ff,#bf00ff)',color:'#020209',textDecoration:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px',letterSpacing:'0.04em',boxShadow:'0 0 28px rgba(0,245,255,0.3)'}}>
              {isAuthenticated?t('hero_dashboard'):t('hero_start')}
            </Link>
            <Link to="/leaderboard" style={{padding:'14px 32px',borderRadius:'12px',border:'1px solid rgba(0,245,255,0.3)',background:'rgba(0,245,255,0.06)',color:'#00f5ff',textDecoration:'none',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px'}}>
              {t('hero_lb')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* STATS */}
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'11px',marginBottom:'60px'}}>
          {stats.map((s,i)=>(
            <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={cv}
              style={{textAlign:'center',padding:'18px 10px',background:'rgba(255,255,255,0.03)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px'}}
            >
              <div style={{fontSize:'22px',marginBottom:'6px'}}>{s.icon}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'22px',color:'#00f5ff',marginBottom:'3px'}}>{s.value}</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans,sans-serif'}}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CATEGORIES TITLE */}
        <div style={{marginBottom:'22px'}}>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(22px,4vw,34px)',marginBottom:'5px'}}>{t('choose_test')}</h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans,sans-serif',fontSize:'14px'}}>{t('choose_sub')}</p>
        </div>

        {/* CATEGORIES GRID */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'13px',marginBottom:'72px'}}>
          {CATS.map((cat,i)=>{
            const sc = subjectColors[cat.subject];
            const sn = subjectNames[cat.subject];
            return (
              <motion.div key={cat.id} custom={i} initial="hidden" animate="visible" variants={cv} whileHover={{y:-5,transition:{duration:0.16}}}>
                <Link to={isAuthenticated?`/test/${cat.id}`:'/register'} style={{textDecoration:'none',display:'block',height:'100%'}}>
                  <div style={{padding:'21px',background:cat.featured?'linear-gradient(135deg,rgba(255,107,53,0.12),rgba(191,0,255,0.07))':sc.bg,backdropFilter:'blur(20px)',border:`1px solid ${cat.featured?'rgba(255,107,53,0.4)':sc.border}`,borderRadius:'14px',cursor:'pointer',transition:'all 0.22s',position:'relative',overflow:'hidden',height:'100%',boxSizing:'border-box'}}>
                    {cat.featured&&(
                      <div style={{position:'absolute',top:'11px',right:'11px',padding:'3px 9px',borderRadius:'5px',background:'linear-gradient(135deg,#ff6b35,#bf00ff)',fontSize:'9px',fontFamily:'Syne,sans-serif',fontWeight:700,color:'white',letterSpacing:'0.05em'}}>
                        ★ {lang==='uz'?'MASHHUR':lang==='ru'?'ТОП':'TOP'}
                      </div>
                    )}
                    <div style={{display:'flex',alignItems:'flex-start',gap:'13px'}}>
                      <div style={{width:'46px',height:'46px',borderRadius:'11px',background:`${cat.color}18`,border:`1px solid ${cat.color}40`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'21px',flexShrink:0}}>
                        {cat.icon}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <span style={{display:'inline-block',padding:'2px 7px',borderRadius:'4px',background:`${cat.color}12`,border:`1px solid ${cat.color}25`,color:cat.color,fontSize:'10px',fontFamily:'Syne,sans-serif',fontWeight:600,letterSpacing:'0.05em',marginBottom:'5px',textTransform:'uppercase'}}>
                          {sn[lang]||sn.en}
                        </span>
                        <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px',marginBottom:'5px',color:'white',lineHeight:1.2}}>
                          {cat.title[lang]||cat.title.en}
                        </h3>
                        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',lineHeight:1.5,marginBottom:'12px',fontFamily:'DM Sans,sans-serif'}}>
                          {cat.desc[lang]||cat.desc.en}
                        </p>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div style={{display:'flex',gap:'7px',alignItems:'center'}}>
                            <span style={{fontSize:'11px',color:cat.color,fontFamily:'Syne,sans-serif',fontWeight:600}}>
                              {cat.count} {t('questions_label')}
                            </span>
                            <span style={{width:'3px',height:'3px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'inline-block'}}/>
                            <span style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',fontFamily:'DM Sans,sans-serif'}}>
                              {cat.level[lang]||cat.level.en}
                            </span>
                          </div>
                          <span style={{fontSize:'13px',color:cat.color,fontFamily:'Syne,sans-serif',fontWeight:700}}>
                            {t('start_btn')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* FEATURES */}
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(20px,3.5vw,32px)'}}>{t('features_title')}</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'11px'}}>
          {[
            {icon:'🤖',tk:'feat1_title',dk:'feat1_desc',color:'#bf00ff'},
            {icon:'📊',tk:'feat2_title',dk:'feat2_desc',color:'#00f5ff'},
            {icon:'✨',tk:'feat3_title',dk:'feat3_desc',color:'#00ff88'},
            {icon:'🏆',tk:'feat4_title',dk:'feat4_desc',color:'#ffd700'},
          ].map((f,i)=>(
            <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={cv}
              style={{padding:'21px',background:'rgba(255,255,255,0.03)',border:`1px solid ${f.color}15`,borderRadius:'13px',backdropFilter:'blur(20px)'}}
            >
              <div style={{fontSize:'25px',marginBottom:'9px'}}>{f.icon}</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'14px',color:f.color,marginBottom:'7px'}}>{t(f.tk)}</h3>
              <p style={{color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans,sans-serif',fontSize:'12px',lineHeight:1.6}}>{t(f.dk)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <Footer t={t} lang={lang}/>
    </PageLayout>
  );
}

export default HomePage;
