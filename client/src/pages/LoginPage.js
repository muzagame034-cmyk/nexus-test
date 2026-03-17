import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PageLayout from '../components/common/PageLayout';
import toast from 'react-hot-toast';

function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success(t('dash_welcome').replace(',','') + '!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const inp = {
    width:'100%', padding:'12px 16px', borderRadius:'10px',
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
    color:'white', fontSize:'15px', outline:'none',
    fontFamily:'DM Sans,sans-serif', transition:'border-color 0.2s', boxSizing:'border-box',
  };

  return (
    <PageLayout>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <motion.div initial={{opacity:0,y:30,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.5}}
          style={{width:'100%',maxWidth:'420px',background:'rgba(255,255,255,0.04)',backdropFilter:'blur(30px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'40px'}}
        >
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'14px',background:'linear-gradient(135deg,rgba(0,245,255,0.2),rgba(191,0,255,0.2))',border:'1px solid rgba(0,245,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',margin:'0 auto 16px'}}>◈</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'26px',marginBottom:'6px'}}>{t('login_title')}</h1>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'14px',fontFamily:'DM Sans,sans-serif'}}>{t('login_sub')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',marginBottom:'8px',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'13px',color:'rgba(255,255,255,0.6)',letterSpacing:'0.04em'}}>{t('login_email')}</label>
              <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required placeholder="you@example.com" style={inp}
                onFocus={e=>e.target.style.borderColor='#00f5ff'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            </div>
            <div style={{marginBottom:'24px'}}>
              <label style={{display:'block',marginBottom:'8px',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'13px',color:'rgba(255,255,255,0.6)',letterSpacing:'0.04em'}}>{t('login_pass')}</label>
              <input type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required placeholder="••••••••" style={inp}
                onFocus={e=>e.target.style.borderColor='#00f5ff'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            </div>
            <button type="submit" disabled={loading} style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',background:loading?'rgba(0,245,255,0.3)':'linear-gradient(135deg,#00f5ff,#bf00ff)',color:loading?'rgba(255,255,255,0.5)':'#020209',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px',cursor:loading?'not-allowed':'pointer',letterSpacing:'0.05em'}}>
              {loading ? t('login_loading') : t('login_btn')}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:'24px',color:'rgba(255,255,255,0.4)',fontSize:'14px',fontFamily:'DM Sans,sans-serif'}}>
            {t('login_no_acc')}{' '}
            <Link to="/register" style={{color:'#00f5ff',textDecoration:'none',fontWeight:600}}>{t('login_reg_link')}</Link>
          </p>
          <div style={{marginTop:'20px',padding:'12px 16px',borderRadius:'8px',background:'rgba(0,245,255,0.05)',border:'1px solid rgba(0,245,255,0.15)'}}>
            <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:'JetBrains Mono,monospace',marginBottom:'2px'}}>{t('login_demo')}:</p>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.45)',fontFamily:'JetBrains Mono,monospace'}}>admin@nexustest.com / Admin@123456</p>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
export default LoginPage;
