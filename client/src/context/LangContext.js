/**
 * Language Context — UZ / RU / EN
 * Covers: Navbar, Home, Login, Register, Dashboard,
 *         Test, Results, Leaderboard, Profile, Admin
 */
import React, { createContext, useContext, useState } from 'react';

export const T = {
  // NAVBAR
  nav_home:        { uz:'Bosh sahifa',   ru:'Главная',           en:'Home' },
  nav_dashboard:   { uz:'Boshqaruv',    ru:'Панель',            en:'Dashboard' },
  nav_leaderboard: { uz:'Reyting',      ru:'Рейтинг',           en:'Leaderboard' },
  nav_admin:       { uz:'Admin',         ru:'Админ',             en:'Admin' },
  nav_login:       { uz:'Kirish',        ru:'Войти',             en:'Login' },
  nav_register:    { uz:"Ro'yxat",       ru:'Регистрация',       en:'Register' },
  nav_logout:      { uz:'Chiqish',       ru:'Выйти',             en:'Logout' },

  // HERO
  hero_badge:    { uz:'AI BILAN ISHLAYDI',  ru:'РАБОТАЕТ С ИИ',     en:'AI-POWERED PLATFORM' },
  hero_title1:   { uz:'BILIMINGIZNI',       ru:'ПРОВЕРЬТЕ',          en:'TEST YOUR' },
  hero_title2:   { uz:"SINAB KO'RING",      ru:'СВОИ ЗНАНИЯ',        en:'KNOWLEDGE' },
  hero_subtitle: { uz:"Barcha fanlar bo'yicha professional testlar. Matematika, fizika, tarix, ingliz tili va boshqa ko'plab fanlar.", ru:'Профессиональные тесты по всем предметам. Математика, физика, история, английский и многое другое.', en:'Professional tests across all subjects. Math, Physics, History, English and many more.' },
  hero_start:    { uz:'Boshlash →',         ru:'Начать →',            en:'Get Started →' },
  hero_dashboard:{ uz:'Boshqaruvga →',      ru:'На панель →',         en:'Go to Dashboard →' },
  hero_lb:       { uz:'Reyting',            ru:'Рейтинг',             en:'Leaderboard' },

  // STATS
  stat_categories:{ uz:'Test turlari', ru:'Категории',   en:'Categories' },
  stat_questions: { uz:'Savollar',     ru:'Вопросы',     en:'Questions' },
  stat_ai:        { uz:'AI Generator', ru:'ИИ генератор',en:'AI Generator' },
  stat_sessions:  { uz:'Mashqlar',     ru:'Занятия',     en:'Sessions' },

  // CATEGORIES
  choose_test:     { uz:'Testni tanlang',             ru:'Выберите тест',          en:'Choose Your Test' },
  choose_sub:      { uz:'Fan tanlang va boshlang',    ru:'Выберите предмет',       en:'Select a subject and start' },
  start_btn:       { uz:'Boshlash →',                 ru:'Начать →',               en:'Start →' },
  questions_label: { uz:'savol',                      ru:'вопросов',               en:'questions' },

  // FEATURES
  features_title:{ uz:'Nima uchun NEXUS?', ru:'Почему NEXUS?',     en:'Why NEXUS?' },
  feat1_title:   { uz:'AI Savol Generator',ru:'ИИ генератор',      en:'AI Question Generator' },
  feat1_desc:    { uz:'Admin panelda AI yordamida savollar yarating', ru:'Создавайте вопросы с помощью ИИ', en:'Generate questions automatically with AI' },
  feat2_title:   { uz:'Real vaqt tahlili', ru:'Аналитика',          en:'Real-time Analytics' },
  feat2_desc:    { uz:"Har bir testdan so'ng batafsil statistika", ru:'Статистика после каждого теста', en:'Detailed stats after every test' },
  feat3_title:   { uz:'3D Interfeys',      ru:'3D Интерфейс',       en:'3D Interface' },
  feat3_desc:    { uz:'Three.js animatsiyalar va glassmorphism', ru:'Анимации Three.js, дизайн glassmorphism', en:'Three.js animations, glassmorphism design' },
  feat4_title:   { uz:'Global Reyting',    ru:'Глобальный рейтинг', en:'Global Leaderboard' },
  feat4_desc:    { uz:"Barcha foydalanuvchilar orasida reyting", ru:'Рейтинг среди всех пользователей', en:'See ranking among all users' },

  // FOOTER
  footer_desc:   { uz:"Barcha fanlar bo'yicha professional test platformasi. AI texnologiyalari bilan.", ru:'Профессиональная платформа тестирования с ИИ.', en:'Professional test platform powered by AI.' },
  footer_links:  { uz:'Havolalar',   ru:'Ссылки',     en:'Quick Links' },
  footer_contact:{ uz:'Aloqa',       ru:'Контакты',   en:'Contact' },
  footer_rights: { uz:'Barcha huquqlar himoyalangan', ru:'Все права защищены', en:'All rights reserved' },
  footer_privacy:{ uz:'Maxfiylik siyosati', ru:'Конфиденциальность', en:'Privacy Policy' },
  footer_terms:  { uz:'Foydalanish shartlari', ru:'Условия использования', en:'Terms of Use' },
  footer_hours:  { uz:'Ish vaqti',   ru:'Время работы', en:'Working Hours' },
  footer_24_7:   { uz:'Platforma 24/7 ishlaydi', ru:'Платформа работает 24/7', en:'Platform available 24/7' },

  // LOGIN
  login_title:   { uz:'Xush kelibsiz',         ru:'Добро пожаловать',       en:'Welcome Back' },
  login_sub:     { uz:'Davom etish uchun kiring', ru:'Войдите, чтобы продолжить', en:'Sign in to continue' },
  login_email:   { uz:'EMAIL',                  ru:'ЭЛЕКТРОННАЯ ПОЧТА',      en:'EMAIL' },
  login_pass:    { uz:'PAROL',                  ru:'ПАРОЛЬ',                 en:'PASSWORD' },
  login_btn:     { uz:'Kirish →',               ru:'Войти →',                en:'Sign In →' },
  login_loading: { uz:'Kirilmoqda...',           ru:'Вход...',                en:'Signing In...' },
  login_no_acc:  { uz:"Hisob yo'qmi?",           ru:'Нет аккаунта?',          en:"Don't have an account?" },
  login_reg_link:{ uz:"Bepul ro'yxat",           ru:'Регистрация',            en:'Register free' },
  login_demo:    { uz:'Demo kirish',             ru:'Демо-вход',              en:'Demo credentials' },

  // REGISTER
  reg_title:     { uz:'Hisob yarating',          ru:'Создать аккаунт',        en:'Create Account' },
  reg_sub:       { uz:"NEXUS ga qo'shiling",     ru:'Присоединяйтесь к NEXUS',en:'Join NEXUS today' },
  reg_name:      { uz:"TO'LIQ ISM",              ru:'ПОЛНОЕ ИМЯ',             en:'FULL NAME' },
  reg_email:     { uz:'EMAIL',                   ru:'ЭЛЕКТРОННАЯ ПОЧТА',      en:'EMAIL' },
  reg_pass:      { uz:'PAROL',                   ru:'ПАРОЛЬ',                 en:'PASSWORD' },
  reg_confirm:   { uz:'PAROLNI TASDIQLANG',      ru:'ПОДТВЕРДИТЕ ПАРОЛЬ',     en:'CONFIRM PASSWORD' },
  reg_btn:       { uz:'Hisob yaratish →',        ru:'Создать аккаунт →',      en:'Create Account →' },
  reg_loading:   { uz:'Yaratilmoqda...',          ru:'Создание...',            en:'Creating...' },
  reg_has_acc:   { uz:'Hisobingiz bormi?',        ru:'Уже есть аккаунт?',      en:'Already have an account?' },
  reg_login_link:{ uz:'Kirish',                   ru:'Войти',                  en:'Sign in' },

  // DASHBOARD
  dash_welcome:  { uz:'Xush kelibsiz,',          ru:'Добро пожаловать,',      en:'Welcome back,' },
  dash_sub:      { uz:"Natijalaringiz ko'rinishi",ru:'Обзор ваших результатов',en:"Here's your performance overview" },
  dash_tests:    { uz:'TESTLAR',                  ru:'ТЕСТОВ',                 en:'TESTS TAKEN' },
  dash_avg:      { uz:"O'RT. BALL",               ru:'СРЕДНИЙ БАЛЛ',           en:'AVG SCORE' },
  dash_best:     { uz:'ENG YAXSHI',               ru:'ЛУЧШИЙ БАЛЛ',            en:'BEST SCORE' },
  dash_correct:  { uz:"TO'G'RI",                  ru:'ПРАВИЛЬНЫХ',             en:'CORRECT' },
  dash_trend:    { uz:'Ball Trendi',              ru:'Динамика баллов',        en:'Score Trend' },
  dash_radar:    { uz:"Ko'nikmalar Radari",        ru:'Радар навыков',          en:'Skills Radar' },
  dash_quick:    { uz:'Tez Boshlash',             ru:'Быстрый старт',          en:'Quick Start' },
  dash_recent:   { uz:"So'nggi Testlar",           ru:'Последние тесты',        en:'Recent Tests' },
  dash_no_tests: { uz:"Hali test yo'q. Boshlang!", ru:'Тестов нет. Начните!',  en:'No tests yet. Go take one!' },
  dash_no_recent:{ uz:'Natijalar topilmadi',       ru:'Результаты не найдены',  en:'No results found' },

  // TEST PAGE
  test_loading:  { uz:'Savollar yuklanmoqda...', ru:'Загрузка вопросов...', en:'Loading questions...' },
  test_questions:{ uz:'savol',                   ru:'вопросов',              en:'questions' },
  test_time:     { uz:'Vaqt chegarasi',          ru:'Лимит времени',         en:'Time Limit' },
  test_min:      { uz:'daq.',                    ru:'мин.',                  en:'min' },
  test_options:  { uz:'Variant/savol',           ru:'Вариантов/вопрос',      en:'Options per Q' },
  test_random:   { uz:'Aralashtirilgan',         ru:'Случайный порядок',     en:'Randomized' },
  test_start:    { uz:'Testni Boshlash →',       ru:'Начать тест →',         en:'Start Test →' },
  test_prev:     { uz:'← Oldingi',              ru:'← Назад',               en:'← Previous' },
  test_next:     { uz:'Keyingi →',              ru:'Далее →',               en:'Next →' },
  test_submit:   { uz:'Testni Yakunlash ✓',     ru:'Завершить тест ✓',      en:'Submit Test ✓' },
  test_answered: { uz:'javoblandi',              ru:'отвечено',              en:'answered' },
  test_info:     { uz:'Timer boshlanayotganda testni to\'xtatib bo\'lmaydi. Javob bermaganlar "o\'tkazilgan" deb hisoblanadi.', ru:'После старта таймер не останавливается. Пропущенные вопросы считаются пропущенными.', en:'Timer starts when you click Start Test. Unanswered questions will be marked as skipped.' },
  test_calc:     { uz:'Natijalar hisoblanmoqda...', ru:'Подсчёт результатов...', en:'Calculating your results...' },

  // RESULTS
  res_title:     { uz:'Test Tugadi!',            ru:'Тест завершён!',         en:'Test Complete!' },
  res_correct:   { uz:"To'g'ri",                 ru:'Правильных',             en:'Correct' },
  res_wrong:     { uz:"Noto'g'ri",               ru:'Неправильных',           en:'Incorrect' },
  res_skipped:   { uz:"O'tkazilgan",             ru:'Пропущено',              en:'Skipped' },
  res_time:      { uz:'Sarflangan vaqt',         ru:'Затраченное время',      en:'Time Taken' },
  res_total:     { uz:'Jami savollar',           ru:'Всего вопросов',         en:'Total Questions' },
  res_breakdown: { uz:'Taqsimot',                ru:'Разбивка',               en:'Breakdown' },
  res_review:    { uz:'▼ Javoblarni Ko\'rish',   ru:'▼ Просмотр ответов',     en:'▼ Review Answers' },
  res_hide:      { uz:'▲ Yopish',                ru:'▲ Скрыть',               en:'▲ Hide' },
  res_retake:    { uz:'Qayta Boshlash',          ru:'Пройти снова',           en:'Retake Test' },
  res_dashboard: { uz:'Boshqaruv',               ru:'Панель',                 en:'Dashboard' },
  res_q_correct: { uz:'✓ To\'g\'ri',             ru:'✓ Верно',                en:'✓ Correct' },
  res_q_wrong:   { uz:'✗ Noto\'g\'ri',           ru:'✗ Неверно',              en:'✗ Wrong' },
  res_q_skipped: { uz:'— O\'tkazilgan',          ru:'— Пропущено',            en:'— Skipped' },
  res_your_ans:  { uz:'Javobingiz:',             ru:'Ваш ответ:',             en:'Your answer:' },
  res_correct_ans:{ uz:"To'g'ri javob:",         ru:'Правильный ответ:',      en:'Correct answer:' },

  // LEADERBOARD
  lb_title:      { uz:'🏆 Reyting',             ru:'🏆 Рейтинг',             en:'🏆 Leaderboard' },
  lb_sub:        { uz:'Barcha foydalanuvchilar orasida eng yaxshi natijalar', ru:'Лучшие результаты среди всех пользователей', en:'Top performers across all test categories' },
  lb_all:        { uz:'Barcha kategoriyalar',    ru:'Все категории',          en:'All Categories' },
  lb_tests:      { uz:'test',                    ru:'тестов',                 en:'test(s)' },
  lb_avg:        { uz:"O'rtacha:",               ru:'Среднее:',               en:'Avg:' },
  lb_best:       { uz:'eng yaxshi',              ru:'лучший',                 en:'best' },
  lb_empty:      { uz:"Natija yo'q. Birinchi bo'ling!", ru:'Результатов нет. Будьте первым!', en:"No results yet. Be the first!" },
  lb_you:        { uz:'(Siz)',                   ru:'(Вы)',                   en:'(You)' },

  // PROFILE
  prof_title:    { uz:'Profil',                  ru:'Профиль',                en:'Profile' },
  prof_stats:    { uz:'📊 Statistika',           ru:'📊 Статистика',          en:'📊 Stats' },
  prof_history:  { uz:'📋 Tarix',                ru:'📋 История',             en:'📋 History' },
  prof_settings: { uz:'⚙️ Sozlamalar',           ru:'⚙️ Настройки',           en:'⚙️ Settings' },
  prof_tests:    { uz:'Test olindi',             ru:'Тестов пройдено',        en:'Tests Taken' },
  prof_best:     { uz:'Eng yaxshi',              ru:'Лучший',                 en:'Best' },
  prof_avg:      { uz:"O'rtacha",               ru:'Среднее',                en:'Avg' },
  prof_correct:  { uz:"To'g'ri",                 ru:'Правильных',             en:'Correct' },
  prof_perf:     { uz:'📊 Kategoriya bo\'yicha natija', ru:'📊 Результат по категориям', en:'📊 Category Performance' },
  prof_no_hist:  { uz:"Tarix yo'q.",             ru:'Истории нет.',           en:'No history yet.' },
  prof_update:   { uz:'✏️ Profilni Yangilash',   ru:'✏️ Обновить профиль',    en:'✏️ Update Profile' },
  prof_pwd:      { uz:'🔒 Parolni O\'zgartirish',ru:'🔒 Изменить пароль',     en:'🔒 Change Password' },
  prof_name:     { uz:"TO'LIQ ISM",              ru:'ПОЛНОЕ ИМЯ',             en:'FULL NAME' },
  prof_email_ro: { uz:'EMAIL (o\'zgartirilmaydi)',ru:'EMAIL (только чтение)',  en:'EMAIL (read-only)' },
  prof_upd_btn:  { uz:'Ismni Yangilash',         ru:'Обновить имя',           en:'Update Name' },
  prof_saving:   { uz:'Saqlanmoqda...',          ru:'Сохранение...',          en:'Saving...' },
  prof_cur_pass: { uz:'HOZIRGI PAROL',           ru:'ТЕКУЩИЙ ПАРОЛЬ',         en:'CURRENT PASSWORD' },
  prof_new_pass: { uz:'YANGI PAROL',             ru:'НОВЫЙ ПАРОЛЬ',           en:'NEW PASSWORD' },
  prof_confirm:  { uz:'TASDIQLANG',              ru:'ПОДТВЕРДИТЕ',            en:'CONFIRM NEW' },
  prof_chg_btn:  { uz:'Parolni O\'zgartirish',   ru:'Изменить пароль',        en:'Change Password' },
  prof_changing: { uz:'O\'zgartirilmoqda...',    ru:'Изменение...',           en:'Changing...' },
  prof_role_admin:{ uz:'ADMIN',                  ru:'АДМИН',                  en:'ADMIN' },
  prof_role_user:{ uz:'FOYDALANUVCHI',           ru:'ПОЛЬЗОВАТЕЛЬ',           en:'USER' },

  // ADMIN
  adm_title:     { uz:'⚙️ Admin Panel',          ru:'⚙️ Панель администратора',en:'⚙️ Admin Panel' },
  adm_sub:       { uz:'Savollar, foydalanuvchilar va platformani boshqaring', ru:'Управляйте вопросами, пользователями и платформой', en:'Manage questions, users, and platform settings' },
  adm_overview:  { uz:'Ko\'rinish',              ru:'Обзор',                  en:'Overview' },
  adm_questions: { uz:'Savollar',                ru:'Вопросы',                en:'Questions' },
  adm_ai:        { uz:'AI Generator',            ru:'ИИ Генератор',           en:'AI Generator' },
  adm_users:     { uz:'Foydalanuvchilar',        ru:'Пользователи',           en:'Users' },
  adm_total_users:{ uz:'FOYDALANUVCHILAR',       ru:'ПОЛЬЗОВАТЕЛЕЙ',          en:'TOTAL USERS' },
  adm_total_q:   { uz:'SAVOLLAR',                ru:'ВОПРОСОВ',               en:'TOTAL QUESTIONS' },
  adm_total_t:   { uz:'TESTLAR',                 ru:'ТЕСТОВ',                 en:'TESTS TAKEN' },
  adm_avg_score: { uz:"O'RT BALL",               ru:'СРЕДНИЙ БАЛЛ',           en:'AVG SCORE' },
  adm_recent:    { uz:'📋 So\'nggi Testlar',      ru:'📋 Последние тесты',     en:'📋 Recent Tests' },
  adm_add_q:     { uz:'+ Savol Qo\'shish',       ru:'+ Добавить вопрос',      en:'+ Add Question' },
  adm_search_q:  { uz:'Savollarni qidiring...', ru:'Поиск вопросов...',      en:'Search questions...' },
  adm_all_cats:  { uz:'Barcha kategoriyalar',    ru:'Все категории',          en:'All Categories' },
  adm_all_diff:  { uz:'Barcha darajalar',        ru:'Все уровни',             en:'All Difficulties' },
  adm_edit:      { uz:'Tahrirlash',              ru:'Редактировать',          en:'Edit' },
  adm_delete:    { uz:'O\'chirish',              ru:'Удалить',                en:'Delete' },
  adm_gen_btn:   { uz:'🤖 Savollar Yaratish',    ru:'🤖 Генерировать вопросы',en:'🤖 Generate Questions' },
  adm_generating:{ uz:'AI yaratmoqda...',        ru:'ИИ генерирует...',       en:'Generating with AI...' },
  adm_save_sel:  { uz:'Tanlanganlarni Saqlash',  ru:'Сохранить выбранные',    en:'Save Selected' },
  adm_select_all:{ uz:'Hammasini Tanlash',       ru:'Выбрать все',            en:'Select All' },
  adm_deselect:  { uz:'Bekor Qilish',            ru:'Отменить выбор',         en:'Deselect' },
  adm_ban:       { uz:'Bloklash',                ru:'Заблокировать',          en:'Ban' },
  adm_activate:  { uz:'Faollashtirish',          ru:'Активировать',           en:'Activate' },
  adm_search_u:  { uz:'Foydalanuvchilarni qidiring...', ru:'Поиск пользователей...', en:'Search users by name...' },
  adm_active:    { uz:'Faol',                    ru:'Активен',                en:'Active' },
  adm_banned:    { uz:'Bloklangan',              ru:'Заблокирован',           en:'Banned' },
  adm_joined:    { uz:"Qo'shildi",               ru:'Дата регистрации',       en:'Joined' },
  adm_delete_confirm: { uz:'Siz ushbu savolni o\'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo\'lmaydi.', ru:'Вы уверены, что хотите удалить этот вопрос? Действие необратимо.', en:'Are you sure you want to delete this question? This cannot be undone.' },
  adm_q_text:    { uz:'SAVOL MATNI',             ru:'ТЕКСТ ВОПРОСА',          en:'QUESTION TEXT' },
  adm_q_cat:     { uz:'KATEGORIYA',              ru:'КАТЕГОРИЯ',              en:'CATEGORY' },
  adm_q_diff:    { uz:'DARAJA',                  ru:'СЛОЖНОСТЬ',              en:'DIFFICULTY' },
  adm_q_explain: { uz:'IZOH (ixtiyoriy)',        ru:'ОБЪЯСНЕНИЕ (необязательно)', en:'EXPLANATION (optional)' },
  adm_q_correct_hint: { uz:"To'g'ri javobni tanlash uchun harf tugmasini bosing", ru:'Нажмите кнопку буквы для правильного ответа', en:'Click the letter button to mark correct answer' },
  adm_q_add:     { uz:'Savol Qo\'shish',         ru:'Добавить вопрос',        en:'Add Question' },
  adm_q_update:  { uz:'Savolni Yangilash',       ru:'Обновить вопрос',        en:'Update Question' },
  adm_cancel:    { uz:'Bekor qilish',            ru:'Отмена',                 en:'Cancel' },
  adm_saving:    { uz:'Saqlanmoqda...',          ru:'Сохранение...',          en:'Saving...' },
  adm_ai_title:  { uz:'AI Savol Generator',      ru:'ИИ Генератор вопросов',  en:'AI Question Generator' },
  adm_ai_sub:    { uz:'OpenAI GPT-4o-mini bilan ishlaydi', ru:'Работает на OpenAI GPT-4o-mini', en:'Powered by OpenAI GPT-4o-mini' },
  adm_prompt:    { uz:'PROMPT',                  ru:'ЗАПРОС',                 en:'PROMPT' },
  adm_count:     { uz:'SONI',                    ru:'КОЛ-ВО',                 en:'COUNT' },
  adm_category:  { uz:'KATEGORIYA',              ru:'КАТЕГОРИЯ',              en:'CATEGORY' },
  adm_templates: { uz:'TEZKOR SHABLONLAR',       ru:'БЫСТРЫЕ ШАБЛОНЫ',        en:'QUICK TEMPLATES' },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('nexus_lang') || 'uz');

  const changeLang = (l) => { setLang(l); localStorage.setItem('nexus_lang', l); };

  const t = (key) => {
    const e = T[key];
    if (!e) return key;
    return e[lang] || e.en || key;
  };

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

// backward compat
export const translations = T;
