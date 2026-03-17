import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PageLayout from '../components/common/PageLayout';
import toast from 'react-hot-toast';

function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password min 6 chars'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to NEXUS!');
      navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%',padding:'12px 16px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',color:'white',fontSize:'15px',outline:'none',fontFamily:'DM Sans,sans-serif',transition:'border-color 0.2s',boxSizing:'border-box' };
  const lbl = { display:'block',marginBottom:'8px',fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'13px',color:'rgba(255,255,255,0.6)',letterSpacing:'0.04em' };

  const fields = [
    { key:'name',    label:t('reg_name'),    type:'text',     placeholder:'John Doe' },
    { key:'email',   label:t('reg_email'),   type:'email',    placeholder:'you@example.com' },
    { key:'password',label:t('reg_pass'),    type:'password', placeholder:'••••••••' },
    { key:'confirm', label:t('reg_confirm'), type:'password', placeholder:'••••••••' },
  ];

  return (
    <PageLayout>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <motion.div initial={{opacity:0,y:30,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.5}}
          style={{width:'100%',maxWidth:'440px',background:'rgba(255,255,255,0.04)',backdropFilter:'blur(30px)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'40px'}}
        >
          <div style={{textAlign:'center',marginBottom:'32px'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'14px',background:'linear-gradient(135deg,rgba(0,255,136,0.2),rgba(0,245,255,0.2))',border:'1px solid rgba(0,255,136,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',margin:'0 auto 16px'}}>✦</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'26px',marginBottom:'6px'}}>{t('reg_title')}</h1>
            <p style={{color:'rgba(255,255,255,0.45)',fontSize:'14px',fontFamily:'DM Sans,sans-serif'}}>{t('reg_sub')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.key} style={{marginBottom:'14px'}}>
                <label style={lbl}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} required placeholder={f.placeholder} style={inp}
                  onFocus={e=>e.target.style.borderColor='#00ff88'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
              </div>
            ))}
            <button type="submit" disabled={loading} style={{marginTop:'8px',width:'100%',padding:'14px',borderRadius:'10px',border:'none',background:loading?'rgba(0,255,136,0.3)':'linear-gradient(135deg,#00ff88,#00f5ff)',color:'#020209',fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'15px',cursor:loading?'not-allowed':'pointer',letterSpacing:'0.05em'}}>
              {loading ? t('reg_loading') : t('reg_btn')}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:'24px',color:'rgba(255,255,255,0.4)',fontSize:'14px',fontFamily:'DM Sans,sans-serif'}}>
            {t('reg_has_acc')}{' '}
            <Link to="/login" style={{color:'#00ff88',textDecoration:'none',fontWeight:600}}>{t('reg_login_link')}</Link>
          </p>
        </motion.div>
      </div>
    </PageLayout>
  );
}
export default RegisterPage;
