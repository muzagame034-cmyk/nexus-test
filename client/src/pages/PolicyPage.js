/**
 * PolicyPage — Maxfiylik siyosati & Foydalanish shartlari
 * ?type=privacy  →  Maxfiylik siyosati
 * ?type=terms    →  Foydalanish shartlari
 */
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageLayout from '../components/common/PageLayout';
import { useLang } from '../context/LangContext';

const CONTENT = {
  privacy: {
    title: { uz:'Maxfiylik Siyosati', ru:'Политика конфиденциальности', en:'Privacy Policy' },
    updated: { uz:'Yangilangan: 2024-yil', ru:'Обновлено: 2024 год', en:'Updated: 2024' },
    sections: [
      {
        icon: '🔐',
        title: { uz:'Qanday ma\'lumotlar yig\'iladi?', ru:'Какие данные собираются?', en:'What data do we collect?' },
        content: {
          uz: `Biz faqat quyidagi ma'lumotlarni yig'amiz:\n\n• **Ro'yxatdan o'tish**: Ism, elektron pochta manzili va parol (shifrlanган holda).\n• **Test natijalari**: Test tarixi, ballar va statistika — progress kuzatish uchun.\n• **Texnik ma'lumotlar**: Brauzer turi va tizim platformasi — saytni yaxshilash uchun.\n\nBiz hech qanday to'lov ma'lumoti, joylashuv yoki shaxsiy hujjatlarni yig'maymiz.`,
          ru: `Мы собираем только следующие данные:\n\n• **Регистрация**: Имя, адрес электронной почты и пароль (в зашифрованном виде).\n• **Результаты тестов**: История тестов, баллы и статистика — для отслеживания прогресса.\n• **Технические данные**: Тип браузера и платформа — для улучшения сайта.\n\nМы не собираем платёжные данные, геолокацию или личные документы.`,
          en: `We only collect the following data:\n\n• **Registration**: Name, email address and password (encrypted).\n• **Test results**: Test history, scores and statistics — for progress tracking.\n• **Technical data**: Browser type and platform — to improve the site.\n\nWe do not collect payment information, location data or personal documents.`,
        }
      },
      {
        icon: '🛡️',
        title: { uz:'Ma\'lumotlar qanday himoyalanadi?', ru:'Как защищены данные?', en:'How is data protected?' },
        content: {
          uz: `Sizning ma'lumotlaringiz xavfsizligi bizning ustuvor vazifamiz:\n\n• **Parollar**: bcrypt algorimi bilan 12 saltli shifrlash.\n• **Token**: JWT (JSON Web Token) — 30 kunlik amal qilish muddati.\n• **HTTPS**: Barcha ma'lumot uzatish SSL/TLS orqali shifrlanadi.\n• **Bazaga kirish**: Faqat autentifikatsiyalangan foydalanuvchilar o'z ma'lumotlariga kira oladi.`,
          ru: `Безопасность ваших данных — наш главный приоритет:\n\n• **Пароли**: Шифрование bcrypt с 12 итерациями соли.\n• **Токены**: JWT (JSON Web Token) — срок действия 30 дней.\n• **HTTPS**: Все передаваемые данные шифруются через SSL/TLS.\n• **Доступ к базе**: Только аутентифицированные пользователи могут видеть свои данные.`,
          en: `Your data security is our top priority:\n\n• **Passwords**: bcrypt encryption with 12 salt rounds.\n• **Tokens**: JWT (JSON Web Token) — 30-day expiry.\n• **HTTPS**: All data transmission encrypted via SSL/TLS.\n• **Database access**: Only authenticated users can access their own data.`,
        }
      },
      {
        icon: '📤',
        title: { uz:'Ma\'lumotlar uchinchi tomonlarga beriladimi?', ru:'Передаются ли данные третьим лицам?', en:'Do we share data with third parties?' },
        content: {
          uz: `Yo'q. Biz sizning shaxsiy ma'lumotlaringizni hech qanday uchinchi tomonga sotmaymiz, ijaraga bermaymiz yoki almashmaymiz.\n\nFaqat istisno: qonun talabi bo'lganda tegishli davlat organlariga ma'lumot berilishi mumkin.`,
          ru: `Нет. Мы не продаём, не сдаём в аренду и не передаём ваши личные данные третьим лицам.\n\nЕдинственное исключение: по требованию закона данные могут быть предоставлены соответствующим государственным органам.`,
          en: `No. We do not sell, rent or share your personal data with any third parties.\n\nThe only exception: data may be provided to relevant authorities when required by law.`,
        }
      },
      {
        icon: '🗑️',
        title: { uz:'Ma\'lumotlarni o\'chirish', ru:'Удаление данных', en:'Data deletion' },
        content: {
          uz: `Hisobingizni o'chirmoqchi bo'lsangiz, bizga elektron pochta orqali murojaat qiling: info@nexustest.uz\n\nBiz 7 ish kuni ichida barcha shaxsiy ma'lumotlaringizni bazadan o'chiramiz.`,
          ru: `Если вы хотите удалить свою учётную запись, свяжитесь с нами по электронной почте: info@nexustest.uz\n\nМы удалим все ваши личные данные из базы данных в течение 7 рабочих дней.`,
          en: `If you want to delete your account, contact us by email: info@nexustest.uz\n\nWe will delete all your personal data from our database within 7 business days.`,
        }
      },
      {
        icon: '🍪',
        title: { uz:'Cookie fayllari', ru:'Файлы cookie', en:'Cookies' },
        content: {
          uz: `Biz faqat kerakli cookie fayllarini ishlatamiz:\n\n• **Autentifikatsiya tokeni**: localStorage da saqlanadi (30 kun).\n• **Til sozlamasi**: localStorage da saqlanadi.\n• **Ekran rejimi (3D/Lite)**: localStorage da saqlanadi.\n\nBiz reklama yoki kuzatish cookie fayllarini ishlatmaymiz.`,
          ru: `Мы используем только необходимые файлы cookie:\n\n• **Токен аутентификации**: Хранится в localStorage (30 дней).\n• **Настройка языка**: Хранится в localStorage.\n• **Режим экрана (3D/Lite)**: Хранится в localStorage.\n\nМы не используем рекламные или отслеживающие cookie.`,
          en: `We only use essential cookies:\n\n• **Authentication token**: Stored in localStorage (30 days).\n• **Language setting**: Stored in localStorage.\n• **Display mode (3D/Lite)**: Stored in localStorage.\n\nWe do not use advertising or tracking cookies.`,
        }
      },
    ]
  },
  terms: {
    title: { uz:'Foydalanish Shartlari', ru:'Условия использования', en:'Terms of Use' },
    updated: { uz:'Yangilangan: 2024-yil', ru:'Обновлено: 2024 год', en:'Updated: 2024' },
    sections: [
      {
        icon: '✅',
        title: { uz:'Platformadan foydalanish shartlari', ru:'Условия использования платформы', en:'Platform usage terms' },
        content: {
          uz: `NEXUS test platformasidan foydalanish uchun quyidagi shartlarga rozilik bildirasiz:\n\n• Siz kamida 7 yoshda bo'lishingiz kerak.\n• Ro'yxatdan o'tishda to'g'ri va haqiqiy ma'lumot kiritishingiz shart.\n• Bir shaxs faqat bitta hisob yaratishi mumkin.\n• Boshqa foydalanuvchilar hisobiga kirish taqiqlanadi.`,
          ru: `Используя платформу NEXUS, вы соглашаетесь со следующими условиями:\n\n• Вам должно быть не менее 7 лет.\n• При регистрации необходимо вводить точные и достоверные данные.\n• Один человек может создать только одну учётную запись.\n• Доступ к учётным записям других пользователей запрещён.`,
          en: `By using the NEXUS platform, you agree to the following terms:\n\n• You must be at least 7 years old.\n• You must provide accurate and truthful information during registration.\n• One person may only create one account.\n• Accessing other users' accounts is prohibited.`,
        }
      },
      {
        icon: '📚',
        title: { uz:'Kontent va intellektual mulk', ru:'Контент и интеллектуальная собственность', en:'Content and intellectual property' },
        content: {
          uz: `• Platformadagi barcha savollar, dizayn va kontent NEXUS platformasiga tegishli.\n• Test savollarini nusxalash, tarqatish yoki tijorat maqsadida ishlatish taqiqlanadi.\n• AI tomonidan yaratilgan savollar ham NEXUS platformasiga tegishli.\n• Foydalanuvchilar faqat shaxsiy o'quv maqsadlarida platformadan foydalanishlari mumkin.`,
          ru: `• Все вопросы, дизайн и контент платформы принадлежат NEXUS.\n• Копирование, распространение или коммерческое использование вопросов запрещено.\n• Вопросы, созданные ИИ, также принадлежат платформе NEXUS.\n• Пользователи могут использовать платформу только в личных образовательных целях.`,
          en: `• All questions, design and content on the platform belong to NEXUS.\n• Copying, distributing or commercial use of questions is prohibited.\n• AI-generated questions also belong to the NEXUS platform.\n• Users may only use the platform for personal educational purposes.`,
        }
      },
      {
        icon: '🚫',
        title: { uz:'Taqiqlangan harakatlar', ru:'Запрещённые действия', en:'Prohibited actions' },
        content: {
          uz: `Platformada quyidagi harakatlar qat'iyan taqiqlanadi:\n\n• Bot yoki avtomatlashtirilgan skriptlar orqali testlarni bajarish.\n• Natijalarni sun'iy oshirish yoki manipulatsiya qilish.\n• Boshqa foydalanuvchilarga zarar yetkazish.\n• Platformani buzish yoki xavfsizlikka tahdid solish urinishlari.\n• Spam yoki zararli kontent joylash.\n\nBu qoidalarni buzgan foydalanuvchilar hisobi bloklandi.`,
          ru: `На платформе строго запрещены следующие действия:\n\n• Прохождение тестов через боты или автоматические скрипты.\n• Искусственное завышение или манипуляция результатами.\n• Нанесение вреда другим пользователям.\n• Попытки взлома платформы или угрозы безопасности.\n• Размещение спама или вредоносного контента.\n\nПользователи, нарушившие эти правила, будут заблокированы.`,
          en: `The following actions are strictly prohibited on the platform:\n\n• Taking tests through bots or automated scripts.\n• Artificially inflating or manipulating results.\n• Harming other users.\n• Attempting to hack the platform or threaten security.\n• Posting spam or malicious content.\n\nUsers who violate these rules will have their accounts blocked.`,
        }
      },
      {
        icon: '⚖️',
        title: { uz:'Mas\'uliyat chegarasi', ru:'Ограничение ответственности', en:'Limitation of liability' },
        content: {
          uz: `NEXUS platformasi quyidagilar uchun mas'uliyat olmaydi:\n\n• Texnik nosozliklar yoki server uzilishlari tufayli yo'qolgan ma'lumotlar.\n• Test natijalari asosida qabul qilingan qarorlar.\n• Uchinchi tomon xizmatlari (internet provayder va h.k.) tufayli yuzaga kelgan muammolar.\n\nPlatforma "qanday bo'lsa shunday" asosida taqdim etiladi.`,
          ru: `Платформа NEXUS не несёт ответственности за:\n\n• Потерю данных из-за технических неисправностей или отключения сервера.\n• Решения, принятые на основе результатов тестов.\n• Проблемы, возникшие из-за сторонних сервисов (интернет-провайдер и т.д.).\n\nПлатформа предоставляется «как есть».`,
          en: `NEXUS platform is not responsible for:\n\n• Data loss due to technical failures or server outages.\n• Decisions made based on test results.\n• Problems caused by third-party services (internet provider, etc.).\n\nThe platform is provided "as is".`,
        }
      },
      {
        icon: '📝',
        title: { uz:'Shartlarning o\'zgarishi', ru:'Изменение условий', en:'Changes to terms' },
        content: {
          uz: `Biz ushbu shartlarni istalgan vaqtda o'zgartirish huquqini saqlaymiz. O'zgarishlar platformada e'lon qilinadi. Platformadan foydalanishni davom ettirsangiz, yangi shartlarga rozilik bildirgan hisoblanasiz.\n\nSavollar uchun: info@nexustest.uz`,
          ru: `Мы оставляем за собой право изменять эти условия в любое время. Изменения будут опубликованы на платформе. Продолжение использования платформы означает согласие с новыми условиями.\n\nПо вопросам: info@nexustest.uz`,
          en: `We reserve the right to modify these terms at any time. Changes will be announced on the platform. Continued use of the platform constitutes agreement to the new terms.\n\nFor questions: info@nexustest.uz`,
        }
      },
    ]
  }
};

function PolicyPage() {
  const [params] = useSearchParams();
  const { lang } = useLang();
  const type = params.get('type') === 'terms' ? 'terms' : 'privacy';
  const data = CONTENT[type];

  const title = data.title[lang] || data.title.en;
  const updated = data.updated[lang] || data.updated.en;

  // Matnni render qilish — **bold** qismlarni qayta ishlash
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i}/>;
      // **text** → bold
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{
          marginBottom:'6px',
          color: line.startsWith('•') ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.6)',
          fontFamily:'DM Sans,sans-serif', fontSize:'14px', lineHeight:1.7,
        }}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{color:'white', fontWeight:600}}>{part}</strong>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <PageLayout>
      <div style={{maxWidth:'800px', margin:'0 auto', padding:'20px 24px 80px'}}>

        {/* Header */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{marginBottom:'40px'}}>
          {/* Tab switcher */}
          <div style={{display:'flex',gap:'8px',marginBottom:'28px'}}>
            {[
              {type:'privacy', label:{uz:'Maxfiylik Siyosati',ru:'Конфиденциальность',en:'Privacy Policy'}},
              {type:'terms',   label:{uz:'Foydalanish Shartlari',ru:'Условия использования',en:'Terms of Use'}},
            ].map(tab => (
              <Link
                key={tab.type}
                to={`/policy?type=${tab.type}`}
                style={{
                  padding:'8px 18px', borderRadius:'8px',
                  border:`1px solid ${type===tab.type?'rgba(0,245,255,0.4)':'rgba(255,255,255,0.1)'}`,
                  background: type===tab.type?'rgba(0,245,255,0.1)':'rgba(255,255,255,0.03)',
                  color: type===tab.type?'#00f5ff':'rgba(255,255,255,0.5)',
                  fontFamily:'Syne,sans-serif', fontWeight:600, fontSize:'13px',
                  textDecoration:'none', transition:'all 0.2s',
                }}
              >
                {tab.label[lang]||tab.label.en}
              </Link>
            ))}
          </div>

          <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(24px,4vw,36px)',marginBottom:'8px'}}>
            {type==='privacy'?'🔐':'📋'} {title}
          </h1>
          <p style={{color:'rgba(255,255,255,0.35)',fontFamily:'DM Sans,sans-serif',fontSize:'13px'}}>
            {updated} • NEXUS Test Platform
          </p>
        </motion.div>

        {/* Sections */}
        <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
          {data.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{opacity:0,y:16}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.08}}
              style={{
                padding:'24px',
                borderRadius:'14px',
                background:'rgba(255,255,255,0.03)',
                border:'1px solid rgba(255,255,255,0.07)',
                backdropFilter:'blur(20px)',
              }}
            >
              <h3 style={{
                fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'16px',
                marginBottom:'14px', display:'flex', alignItems:'center', gap:'10px',
              }}>
                <span style={{fontSize:'22px'}}>{section.icon}</span>
                {section.title[lang]||section.title.en}
              </h3>
              <div>{renderText(section.content[lang]||section.content.en)}</div>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
          style={{
            marginTop:'28px', padding:'20px 24px', borderRadius:'14px',
            background:'rgba(0,245,255,0.05)',
            border:'1px solid rgba(0,245,255,0.2)',
            textAlign:'center',
          }}
        >
          <p style={{fontFamily:'DM Sans,sans-serif',fontSize:'14px',color:'rgba(255,255,255,0.6)',marginBottom:'8px'}}>
            {lang==='uz'?'Savollaringiz bormi?':lang==='ru'?'Есть вопросы?':'Have questions?'}
          </p>
          <a href="mailto:info@nexustest.uz" style={{
            color:'#00f5ff', fontFamily:'Syne,sans-serif', fontWeight:700,
            fontSize:'15px', textDecoration:'none',
          }}>
            📧 info@nexustest.uz
          </a>
        </motion.div>

        {/* Back */}
        <div style={{textAlign:'center',marginTop:'24px'}}>
          <Link to="/" style={{
            color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif',
            fontSize:'13px', textDecoration:'none',
          }}>
            ← {lang==='uz'?'Bosh sahifaga qaytish':lang==='ru'?'Вернуться на главную':'Back to Home'}
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

export default PolicyPage;
