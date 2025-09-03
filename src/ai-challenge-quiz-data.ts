import { QuizQuestion, Language, TrackType } from './types';

// 28-Day AI Challenge Quiz Questions - B2C Mass Market Approach
export const aiChallengeQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'ai_experience',
    text: {
      en: 'HAVE YOU EVER USED AI?',
      es: '¿HAS USADO ALGUNA VEZ IA?',
      ru: 'ВЫ КОГДА-НИБУДЬ ИСПОЛЬЗОВАЛИ ИИ?',
      de: 'HABEN SIE JEMALS KI VERWENDET?',
      fr: 'AVEZ-VOUS DÉJÀ UTILISÉ L\'IA?',
      fa: 'آیا تا به حال از هوش مصنوعی استفاده کرده اید؟',
      ps: 'ایا تاسو کله د AI څخه کار اخیستی دی؟'
    },
    options: [
      {
        text: {
          en: 'YES - I use AI tools regularly (ChatGPT, etc.)',
          es: 'SÍ - Uso herramientas de IA regularmente (ChatGPT, etc.)',
          ru: 'ДА - Я регулярно использую инструменты ИИ (ChatGPT и др.)',
          de: 'JA - Ich nutze KI-Tools regelmäßig (ChatGPT usw.)',
          fr: 'OUI - J\'utilise régulièrement des outils IA (ChatGPT, etc.)',
          fa: 'بله - من به طور منظم از ابزارهای AI استفاده می کنم',
          ps: 'هو - زه په منظمه توګه د AI وسایل کاروم'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'NO - I\'m completely new to AI',
          es: 'NO - Soy completamente nuevo en IA',
          ru: 'НЕТ - Я совершенно новичок в ИИ',
          de: 'NEIN - Ich bin völlig neu bei KI',
          fr: 'NON - Je suis complètement nouveau avec l\'IA',
          fa: 'خیر - من کاملاً در AI تازه کار هستم',
          ps: 'نه - زه په AI کې بشپړ نوی یم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 2,
    category: 'age_group',
    text: {
      en: 'What\'s your age range?',
      es: '¿Cuál es tu rango de edad?',
      ru: 'Какой у вас возрастной диапазон?',
      de: 'Wie alt sind Sie?',
      fr: 'Quelle est votre tranche d\'âge?',
      fa: 'محدوده سنی شما چقدر است؟',
      ps: 'ستاسو د عمر حد څومره دی؟'
    },
    options: [
      {
        text: {
          en: '18-25 years old',
          es: '18-25 años',
          ru: '18-25 лет',
          de: '18-25 Jahre alt',
          fr: '18-25 ans',
          fa: '18-25 سال',
          ps: '18-25 کلن'
        },
        value: 8,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: '26-35 years old',
          es: '26-35 años',
          ru: '26-35 лет',
          de: '26-35 Jahre alt',
          fr: '26-35 ans',
          fa: '26-35 سال',
          ps: '26-35 کلن'
        },
        value: 10,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '36-45 years old',
          es: '36-45 años',
          ru: '36-45 лет',
          de: '36-45 Jahre alt',
          fr: '36-45 ans',
          fa: '36-45 سال',
          ps: '36-45 کلن'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: '46+ years old',
          es: '46+ años',
          ru: '46+ лет',
          de: '46+ Jahre alt',
          fr: '46+ ans',
          fa: '46+ سال',
          ps: '46+ کلن'
        },
        value: 7,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 3,
    category: 'income_goal',
    text: {
      en: 'What\'s your monthly income goal with AI?',
      es: '¿Cuál es tu meta de ingresos mensuales con IA?',
      ru: 'Какая ваша цель месячного дохода с ИИ?',
      de: 'Was ist Ihr monatliches Einkommensziel mit KI?',
      fr: 'Quel est votre objectif de revenus mensuels avec l\'IA?',
      fa: 'هدف درآمد ماهانه شما با AI چقدر است؟',
      ps: 'د AI سره ستاسو د میاشتني عاید هدف څومره دی؟'
    },
    options: [
      {
        text: {
          en: '$500-$2,000/month (Side income)',
          es: '$500-$2,000/mes (Ingreso extra)',
          ru: '$500-$2,000/мес (Дополнительный доход)',
          de: '$500-$2,000/Monat (Nebeneinkommen)',
          fr: '$500-$2,000/mois (Revenu d\'appoint)',
          fa: '$500-$2,000/ماه (درآمد جانبی)',
          ps: '$500-$2,000/میاشت (اړخیز عاید)'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '$2,000-$5,000/month (Part-time replacement)',
          es: '$2,000-$5,000/mes (Reemplazo de tiempo parcial)',
          ru: '$2,000-$5,000/мес (Замена работы на полставки)',
          de: '$2,000-$5,000/Monat (Teilzeit-Ersatz)',
          fr: '$2,000-$5,000/mois (Remplacement temps partiel)',
          fa: '$2,000-$5,000/ماه (جایگزین کار پاره وقت)',
          ps: '$2,000-$5,000/میاشت (د برخې وخت بدیل)'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$5,000-$10,000/month (Full-time income)',
          es: '$5,000-$10,000/mes (Ingreso de tiempo completo)',
          ru: '$5,000-$10,000/мес (Доход полного рабочего дня)',
          de: '$5,000-$10,000/Monat (Vollzeit-Einkommen)',
          fr: '$5,000-$10,000/mois (Revenu temps plein)',
          fa: '$5,000-$10,000/ماه (درآمد تمام وقت)',
          ps: '$5,000-$10,000/میاشت (د بشپړ وخت عاید)'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: '$10,000+/month (Business replacement)',
          es: '$10,000+/mes (Reemplazo de negocio)',
          ru: '$10,000+/мес (Замена бизнеса)',
          de: '$10,000+/Monat (Geschäfts-Ersatz)',
          fr: '$10,000+/mois (Remplacement d\'entreprise)',
          fa: '$10,000+/ماه (جایگزین کسب و کار)',
          ps: '$10,000+/میاشت (د سوداګرۍ بدیل)'
        },
        value: 10,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 4,
    category: 'work_situation',
    text: {
      en: 'What\'s your current work situation?',
      es: '¿Cuál es tu situación laboral actual?',
      ru: 'Какова ваша текущая рабочая ситуация?',
      de: 'Wie ist Ihre aktuelle Arbeitssituation?',
      fr: 'Quelle est votre situation de travail actuelle?',
      fa: 'وضعیت کاری فعلی شما چیست؟',
      ps: 'ستاسو اوسنۍ د کار وضعیت څنګه دی؟'
    },
    options: [
      {
        text: {
          en: 'Full-time employee',
          es: 'Empleado de tiempo completo',
          ru: 'Сотрудник на полный рабочий день',
          de: 'Vollzeitangestellter',
          fr: 'Employé à temps plein',
          fa: 'کارمند تمام وقت',
          ps: 'د بشپړ وخت کارکوونکی'
        },
        value: 7,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Part-time employee',
          es: 'Empleado de tiempo parcial',
          ru: 'Сотрудник на неполный рабочий день',
          de: 'Teilzeitangestellter',
          fr: 'Employé à temps partiel',
          fa: 'کارمند پاره وقت',
          ps: 'د برخې وخت کارکوونکی'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Self-employed/Freelancer',
          es: 'Trabajador independiente/Freelancer',
          ru: 'Самозанятый/Фрилансер',
          de: 'Selbständig/Freelancer',
          fr: 'Indépendant/Freelancer',
          fa: 'خود اشتغال/فریلنسر',
          ps: 'ځان ګمارونکی/فریلانسر'
        },
        value: 10,
        tracks: ['service', 'consulting']
      },
      {
        text: {
          en: 'Student/Unemployed',
          es: 'Estudiante/Desempleado',
          ru: 'Студент/Безработный',
          de: 'Student/Arbeitslos',
          fr: 'Étudiant/Sans emploi',
          fa: 'دانشجو/بیکار',
          ps: 'زده کوونکی/بې کار'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      }
    ]
  },
  {
    id: 5,
    category: 'time_available',
    text: {
      en: 'How much time can you dedicate daily?',
      es: '¿Cuánto tiempo puedes dedicar diariamente?',
      ru: 'Сколько времени вы можете уделять ежедневно?',
      de: 'Wie viel Zeit können Sie täglich aufbringen?',
      fr: 'Combien de temps pouvez-vous consacrer quotidiennement?',
      fa: 'روزانه چقدر زمان می توانید اختصاص دهید؟',
      ps: 'تاسو ورځني څومره وخت کولی شئ ځانګړی کړئ؟'
    },
    options: [
      {
        text: {
          en: '1-2 hours/day',
          es: '1-2 horas/día',
          ru: '1-2 часа в день',
          de: '1-2 Stunden/Tag',
          fr: '1-2 heures/jour',
          fa: '1-2 ساعت در روز',
          ps: '1-2 ساعته/ورځ'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '2-4 hours/day',
          es: '2-4 horas/día',
          ru: '2-4 часа в день',
          de: '2-4 Stunden/Tag',
          fr: '2-4 heures/jour',
          fa: '2-4 ساعت در روز',
          ps: '2-4 ساعته/ورځ'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '4-6 hours/day',
          es: '4-6 horas/día',
          ru: '4-6 часов в день',
          de: '4-6 Stunden/Tag',
          fr: '4-6 heures/jour',
          fa: '4-6 ساعت در روز',
          ps: '4-6 ساعته/ورځ'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: '6+ hours/day (Full commitment)',
          es: '6+ horas/día (Compromiso total)',
          ru: '6+ часов в день (Полная приверженность)',
          de: '6+ Stunden/Tag (Volles Engagement)',
          fr: '6+ heures/jour (Engagement total)',
          fa: '6+ ساعت در روز (تعهد کامل)',
          ps: '6+ ساعته/ورځ (بشپړ ژمنتیا)'
        },
        value: 10,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 6,
    category: 'tech_comfort',
    text: {
      en: 'How comfortable are you with technology?',
      es: '¿Qué tan cómodo te sientes con la tecnología?',
      ru: 'Насколько комфортно вы чувствуете себя с технологиями?',
      de: 'Wie wohl fühlen Sie sich mit Technologie?',
      fr: 'À quel point êtes-vous à l\'aise avec la technologie?',
      fa: 'تا چه حد با فناوری راحت هستید؟',
      ps: 'تاسو د ټیکنالوژۍ سره څومره آرام یاست؟'
    },
    options: [
      {
        text: {
          en: 'Beginner - I need step-by-step guidance',
          es: 'Principiante - Necesito guía paso a paso',
          ru: 'Новичок - Мне нужно пошаговое руководство',
          de: 'Anfänger - Ich brauche Schritt-für-Schritt-Anleitung',
          fr: 'Débutant - J\'ai besoin de conseils étape par étape',
          fa: 'مبتدی - به راهنمایی گام به گام نیاز دارم',
          ps: 'پیل کوونکی - زه د ګام په ګام لارښود ته اړتیا لرم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Intermediate - I can follow tutorials',
          es: 'Intermedio - Puedo seguir tutoriales',
          ru: 'Средний - Я могу следовать руководствам',
          de: 'Mittelstufe - Ich kann Tutorials folgen',
          fr: 'Intermédiaire - Je peux suivre des tutoriels',
          fa: 'متوسط - می توانم آموزش ها را دنبال کنم',
          ps: 'منځنی - زه کولی شم د زده کړې څانګو تعقیب وکړم'
        },
        value: 7,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Advanced - I love learning new tech',
          es: 'Avanzado - Me encanta aprender nueva tecnología',
          ru: 'Продвинутый - Я люблю изучать новые технологии',
          de: 'Fortgeschritten - Ich liebe es, neue Technologie zu lernen',
          fr: 'Avancé - J\'adore apprendre de nouvelles technologies',
          fa: 'پیشرفته - عاشق یادگیری فناوری های جدید هستم',
          ps: 'پرمختللی - زه د نوي ټیکنالوژۍ زده کړه خوښوم'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Expert - I work in tech/IT',
          es: 'Experto - Trabajo en tecnología/IT',
          ru: 'Эксперт - Я работаю в сфере технологий/ИТ',
          de: 'Experte - Ich arbeite in der Tech/IT-Branche',
          fr: 'Expert - Je travaille dans la tech/IT',
          fa: 'متخصص - در حوزه فناوری/IT کار می کنم',
          ps: 'متخصص - زه د ټیکنالوژۍ/IT په برخه کې کار کوم'
        },
        value: 9,
        tracks: ['service', 'consulting']
      }
    ]
  },
  {
    id: 7,
    category: 'learning_style',
    text: {
      en: 'What\'s your preferred learning style?',
      es: '¿Cuál es tu estilo de aprendizaje preferido?',
      ru: 'Какой ваш предпочтительный стиль обучения?',
      de: 'Was ist Ihr bevorzugter Lernstil?',
      fr: 'Quel est votre style d\'apprentissage préféré?',
      fa: 'سبک یادگیری مورد علاقه شما چیست؟',
      ps: 'ستاسو د غوره شوي زده کړې سټایل څه دی؟'
    },
    options: [
      {
        text: {
          en: 'Video tutorials and demonstrations',
          es: 'Tutoriales en video y demostraciones',
          ru: 'Видеоуроки и демонстрации',
          de: 'Video-Tutorials und Demonstrationen',
          fr: 'Tutoriels vidéo et démonstrations',
          fa: 'آموزش های ویدیویی و نمایش ها',
          ps: 'د ویډیو روزنې او څرګندونې'
        },
        value: 8,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Interactive courses and quizzes',
          es: 'Cursos interactivos y cuestionarios',
          ru: 'Интерактивные курсы и викторины',
          de: 'Interaktive Kurse und Quizzes',
          fr: 'Cours interactifs et quiz',
          fa: 'دوره های تعاملی و آزمون ها',
          ps: 'تعاملي کورسونه او پوښتنې'
        },
        value: 9,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Live workshops and community',
          es: 'Talleres en vivo y comunidad',
          ru: 'Живые мастер-классы и сообщество',
          de: 'Live-Workshops und Community',
          fr: 'Ateliers en direct et communauté',
          fa: 'کارگاه های زنده و جامعه',
          ps: 'د ژوندۍ ورکشاپونو او ټولنه'
        },
        value: 10,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Self-paced reading and practice',
          es: 'Lectura y práctica a mi ritmo',
          ru: 'Самостоятельное чтение и практика',
          de: 'Selbstbestimmtes Lesen und Üben',
          fr: 'Lecture et pratique à son rythme',
          fa: 'مطالعه و تمرین در سرعت شخصی',
          ps: 'د ځان د سرعت لوستل او تمرین'
        },
        value: 7,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 8,
    category: 'business_interest',
    text: {
      en: 'Which business area interests you most?',
      es: '¿Qué área de negocio te interesa más?',
      ru: 'Какая бизнес-область вас больше всего интересует?',
      de: 'Welcher Geschäftsbereich interessiert Sie am meisten?',
      fr: 'Quel domaine d\'affaires vous intéresse le plus?',
      fa: 'کدام حوزه کسب و کار بیشتر از همه مورد علاقه شما است؟',
      ps: 'د سوداګرۍ کومه برخه ستاسو لپاره ډیره په زړه پورې ده؟'
    },
    options: [
      {
        text: {
          en: 'Online selling and e-commerce',
          es: 'Ventas en línea y comercio electrónico',
          ru: 'Онлайн-продажи и электронная коммерция',
          de: 'Online-Verkauf und E-Commerce',
          fr: 'Vente en ligne et e-commerce',
          fa: 'فروش آنلاین و تجارت الکترونیک',
          ps: 'آنلاین پلورنه او بریښنایي سوداګرۍ'
        },
        value: 10,
        tracks: ['ecommerce']
      },
      {
        text: {
          en: 'Creating digital products and courses',
          es: 'Crear productos digitales y cursos',
          ru: 'Создание цифровых продуктов и курсов',
          de: 'Digitale Produkte und Kurse erstellen',
          fr: 'Créer des produits numériques et des cours',
          fa: 'ایجاد محصولات دیجیتال و دوره ها',
          ps: 'د ډیجیټل محصولاتو او کورسونو جوړول'
        },
        value: 10,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Providing services and consulting',
          es: 'Proporcionar servicios y consultoría',
          ru: 'Предоставление услуг и консультирование',
          de: 'Dienstleistungen und Beratung anbieten',
          fr: 'Fournir des services et du conseil',
          fa: 'ارائه خدمات و مشاوره',
          ps: 'د خدماتو او مشورو وړاندې کول'
        },
        value: 10,
        tracks: ['service']
      },
      {
        text: {
          en: 'Business coaching and training',
          es: 'Coaching y entrenamiento empresarial',
          ru: 'Бизнес-коучинг и тренинги',
          de: 'Business-Coaching und Training',
          fr: 'Coaching et formation d\'entreprise',
          fa: 'کوچینگ و آموزش کسب و کار',
          ps: 'د سوداګرۍ روزنه او تربیه'
        },
        value: 10,
        tracks: ['consulting']
      }
    ]
  },
  {
    id: 9,
    category: 'investment_willingness',
    text: {
      en: 'How much are you willing to invest in your AI journey?',
      es: '¿Cuánto estás dispuesto a invertir en tu viaje de IA?',
      ru: 'Сколько вы готовы инвестировать в ваш путь с ИИ?',
      de: 'Wie viel sind Sie bereit, in Ihre KI-Reise zu investieren?',
      fr: 'Combien êtes-vous prêt à investir dans votre parcours IA?',
      fa: 'چقدر حاضرید در مسیر AI سرمایه گذاری کنید؟',
      ps: 'تاسو د خپل AI سفر کې د څومره پانګونې لپاره چمتو یاست؟'
    },
    options: [
      {
        text: {
          en: '$0 - I want free resources only',
          es: '$0 - Solo quiero recursos gratuitos',
          ru: '$0 - Я хочу только бесплатные ресурсы',
          de: '$0 - Ich möchte nur kostenlose Ressourcen',
          fr: '$0 - Je veux seulement des ressources gratuites',
          fa: '$0 - فقط منابع رایگان می خواهم',
          ps: '$0 - زه یوازې د وړیا سرچینې غواړم'
        },
        value: 3,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '$1-$100 - Basic training materials',
          es: '$1-$100 - Materiales básicos de entrenamiento',
          ru: '$1-$100 - Базовые учебные материалы',
          de: '$1-$100 - Grundlegende Trainingsmaterialien',
          fr: '$1-$100 - Matériaux de formation de base',
          fa: '$1-$100 - مواد آموزشی پایه',
          ps: '$1-$100 - د اساسي روزنې توکي'
        },
        value: 6,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: '$100-$500 - Comprehensive course',
          es: '$100-$500 - Curso integral',
          ru: '$100-$500 - Комплексный курс',
          de: '$100-$500 - Umfassender Kurs',
          fr: '$100-$500 - Cours complet',
          fa: '$100-$500 - دوره جامع',
          ps: '$100-$500 - پراخه کورس'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$500+ - Premium mentorship program',
          es: '$500+ - Programa premium de mentoría',
          ru: '$500+ - Премиум программа наставничества',
          de: '$500+ - Premium-Mentoring-Programm',
          fr: '$500+ - Programme de mentorat premium',
          fa: '$500+ - برنامه مربیگری پریمیوم',
          ps: '$500+ - د پریمیم ښوونې پروګرام'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 10,
    category: 'urgency',
    text: {
      en: 'How urgently do you need to start earning?',
      es: '¿Qué tan urgentemente necesitas empezar a ganar?',
      ru: 'Насколько срочно вам нужно начать зарабатывать?',
      de: 'Wie dringend müssen Sie anfangen zu verdienen?',
      fr: 'À quel point devez-vous commencer à gagner de l\'argent de manière urgente?',
      fa: 'چقدر فوری نیاز دارید شروع به کسب درآمد کنید؟',
      ps: 'تاسو د عاید پیل کولو ته څومره بیړني اړتیا لری؟'
    },
    options: [
      {
        text: {
          en: 'ASAP - I need income within 30 days',
          es: 'ASAP - Necesito ingresos en 30 días',
          ru: 'СРОЧНО - Мне нужен доход в течение 30 дней',
          de: 'SOFORT - Ich brauche Einkommen innerhalb von 30 Tagen',
          fr: 'URGENT - J\'ai besoin de revenus dans les 30 jours',
          fa: 'فوری - ظرف 30 روز نیاز به درآمد دارم',
          ps: 'سمدلاسه - زه د 30 ورځو دننه عاید ته اړتیا لرم'
        },
        value: 10,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: '2-3 months - Building for steady income',
          es: '2-3 meses - Construyendo para ingresos estables',
          ru: '2-3 месяца - Строю для стабильного дохода',
          de: '2-3 Monate - Aufbau für stabiles Einkommen',
          fr: '2-3 mois - Construction pour un revenu stable',
          fa: '2-3 ماه - ایجاد درآمد ثابت',
          ps: '2-3 میاشتې - د ثابت عاید لپاره جوړول'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: '6+ months - Long-term wealth building',
          es: '6+ meses - Construcción de riqueza a largo plazo',
          ru: '6+ месяцев - Долгосрочное создание богатства',
          de: '6+ Monate - Langfristiger Vermögensaufbau',
          fr: '6+ mois - Construction de richesse à long terme',
          fa: '6+ ماه - ایجاد ثروت بلندمدت',
          ps: '6+ میاشتې - د اوږدمهاله شتمنۍ جوړول'
        },
        value: 6,
        tracks: ['consulting', 'digital_product']
      },
      {
        text: {
          en: '1+ years - I\'m just exploring options',
          es: '1+ años - Solo estoy explorando opciones',
          ru: '1+ год - Я просто изучаю варианты',
          de: '1+ Jahre - Ich erkunde nur Optionen',
          fr: '1+ an - J\'explore juste les options',
          fa: '1+ سال - فقط گزینه ها را بررسی می کنم',
          ps: '1+ کلونه - زه یوازې د انتخابونو سپړنه کوم'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 11,
    category: 'biggest_challenge',
    text: {
      en: 'What\'s your biggest challenge right now?',
      es: '¿Cuál es tu mayor desafío ahora mismo?',
      ru: 'Какой ваш самый большой вызов прямо сейчас?',
      de: 'Was ist Ihre größte Herausforderung im Moment?',
      fr: 'Quel est votre plus grand défi en ce moment?',
      fa: 'بزرگترین چالش شما در حال حاضر چیست؟',
      ps: 'ستاسو تر ټولو لوی ننګونه اوس مهال څه دی؟'
    },
    options: [
      {
        text: {
          en: 'I don\'t know where to start with AI',
          es: 'No sé por dónde empezar con IA',
          ru: 'Я не знаю, с чего начать с ИИ',
          de: 'Ich weiß nicht, wo ich mit KI anfangen soll',
          fr: 'Je ne sais pas par où commencer avec l\'IA',
          fa: 'نمی دانم از کجا با AI شروع کنم',
          ps: 'زه نه پوهیږم چې د AI سره له کومه ځایه پیل وکړم'
        },
        value: 8,
        tracks: ['consulting', 'ecommerce']
      },
      {
        text: {
          en: 'I lack technical skills and confidence',
          es: 'Me faltan habilidades técnicas y confianza',
          ru: 'Мне не хватает технических навыков и уверенности',
          de: 'Mir fehlen technische Fähigkeiten und Selbstvertrauen',
          fr: 'Il me manque des compétences techniques et de la confiance',
          fa: 'مهارت های فنی و اعتماد به نفس ندارم',
          ps: 'زه د تخنیکي مهارتونو او باور څخه محروم یم'
        },
        value: 7,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'I need a proven step-by-step system',
          es: 'Necesito un sistema paso a paso probado',
          ru: 'Мне нужна проверенная пошаговая система',
          de: 'Ich brauche ein bewährtes Schritt-für-Schritt-System',
          fr: 'J\'ai besoin d\'un système étape par étape éprouvé',
          fa: 'به یک سیستم گام به گام اثبات شده نیاز دارم',
          ps: 'زه د ثابت شوي ګام په ګام سیسټم ته اړتیا لرم'
        },
        value: 9,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'I want to avoid costly mistakes',
          es: 'Quiero evitar errores costosos',
          ru: 'Я хочу избежать дорогостоящих ошибок',
          de: 'Ich möchte kostspielige Fehler vermeiden',
          fr: 'Je veux éviter les erreurs coûteuses',
          fa: 'می خواهم از اشتباهات پرهزینه اجتناب کنم',
          ps: 'زه غواړم د ګرانو غلطیو څخه ډډه وکړم'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 12,
    category: 'motivation',
    text: {
      en: 'What motivates you to learn AI?',
      es: '¿Qué te motiva a aprender IA?',
      ru: 'Что мотивирует вас изучать ИИ?',
      de: 'Was motiviert Sie, KI zu lernen?',
      fr: 'Qu\'est-ce qui vous motive à apprendre l\'IA?',
      fa: 'چه چیزی شما را برای یادگیری AI انگیزه می دهد؟',
      ps: 'څه شی تاسو ته د AI زده کړې ته هڅوي؟'
    },
    options: [
      {
        text: {
          en: 'Financial freedom and independence',
          es: 'Libertad financiera e independencia',
          ru: 'Финансовая свобода и независимость',
          de: 'Finanzielle Freiheit und Unabhängigkeit',
          fr: 'Liberté financière et indépendance',
          fa: 'آزادی مالی و استقلال',
          ps: 'مالي ازادي او خپلواکي'
        },
        value: 10,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Career advancement and job security',
          es: 'Avance profesional y seguridad laboral',
          ru: 'Карьерный рост и стабильность работы',
          de: 'Karriereförderung und Arbeitsplatzsicherheit',
          fr: 'Avancement de carrière et sécurité d\'emploi',
          fa: 'پیشرفت شغلی و امنیت شغل',
          ps: 'د کیریر پرمختګ او د دندې امنیت'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Curiosity and passion for technology',
          es: 'Curiosidad y pasión por la tecnología',
          ru: 'Любопытство и страсть к технологиям',
          de: 'Neugier und Leidenschaft für Technologie',
          fr: 'Curiosité et passion pour la technologie',
          fa: 'کنجکاوی و عشق به فناوری',
          ps: 'د ټیکنالوژۍ لپاره لیوالتیا او میړانه'
        },
        value: 9,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Helping others and making an impact',
          es: 'Ayudar a otros y generar un impacto',
          ru: 'Помощь другим и создание влияния',
          de: 'Anderen helfen und Wirkung erzielen',
          fr: 'Aider les autres et avoir un impact',
          fa: 'کمک به دیگران و تاثیرگذاری',
          ps: 'نورو ته مرسته کول او اغیزه کول'
        },
        value: 7,
        tracks: ['service', 'consulting']
      }
    ]
  },
  {
    id: 13,
    category: 'support_preference',
    text: {
      en: 'What type of support do you prefer?',
      es: '¿Qué tipo de apoyo prefieres?',
      ru: 'Какой тип поддержки вы предпочитаете?',
      de: 'Welche Art von Unterstützung bevorzugen Sie?',
      fr: 'Quel type de support préférez-vous?',
      fa: 'چه نوع پشتیبانی را ترجیح می دهید؟',
      ps: 'تاسو د کومې ډول ملاتړ ته غوره ورکوئ؟'
    },
    options: [
      {
        text: {
          en: '1-on-1 personal mentorship',
          es: 'Mentoría personal 1-a-1',
          ru: 'Личное наставничество один на один',
          de: 'Persönliches 1-zu-1-Mentoring',
          fr: 'Mentorat personnel 1-à-1',
          fa: 'مربیگری شخصی یک به یک',
          ps: '1-څخه-1 شخصي ښوونه'
        },
        value: 10,
        tracks: ['consulting']
      },
      {
        text: {
          en: 'Small group coaching (5-10 people)',
          es: 'Coaching en grupos pequeños (5-10 personas)',
          ru: 'Коучинг в малых группах (5-10 человек)',
          de: 'Kleingruppencoaching (5-10 Personen)',
          fr: 'Coaching en petits groupes (5-10 personnes)',
          fa: 'کوچینگ گروه کوچک (5-10 نفر)',
          ps: 'د کشرې ډلې روزنه (5-10 خلک)'
        },
        value: 9,
        tracks: ['service']
      },
      {
        text: {
          en: 'Online community and forums',
          es: 'Comunidad en línea y foros',
          ru: 'Онлайн-сообщество и форумы',
          de: 'Online-Community und Foren',
          fr: 'Communauté en ligne et forums',
          fa: 'جامعه آنلاین و انجمن ها',
          ps: 'آنلاین ټولنه او فورمونه'
        },
        value: 7,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Self-service resources and tools',
          es: 'Recursos y herramientas de autoservicio',
          ru: 'Ресурсы и инструменты самообслуживания',
          de: 'Self-Service-Ressourcen und Tools',
          fr: 'Ressources et outils en libre-service',
          fa: 'منابع و ابزارهای خودخدماتی',
          ps: 'د ځان خدماتو سرچینې او وسایل'
        },
        value: 6,
        tracks: ['ecommerce']
      }
    ]
  },
  {
    id: 14,
    category: 'success_measurement',
    text: {
      en: 'How do you define success in your AI journey?',
      es: '¿Cómo defines el éxito en tu viaje de IA?',
      ru: 'Как вы определяете успех в вашем пути с ИИ?',
      de: 'Wie definieren Sie Erfolg in Ihrer KI-Reise?',
      fr: 'Comment définissez-vous le succès dans votre parcours IA?',
      fa: 'موفقیت در مسیر AI را چگونه تعریف می کنید؟',
      ps: 'تاسو د خپل AI سفر کې بریالیتوب څنګه تعریفوئ؟'
    },
    options: [
      {
        text: {
          en: 'Consistent monthly income growth',
          es: 'Crecimiento constante de ingresos mensuales',
          ru: 'Постоянный рост месячного дохода',
          de: 'Konstantes monatliches Einkommenswachstum',
          fr: 'Croissance constante des revenus mensuels',
          fa: 'رشد مستمر درآمد ماهانه',
          ps: 'د میاشتني عاید دوامداره وده'
        },
        value: 9,
        tracks: ['ecommerce', 'service']
      },
      {
        text: {
          en: 'Building a scalable business',
          es: 'Construir un negocio escalable',
          ru: 'Создание масштабируемого бизнеса',
          de: 'Aufbau eines skalierbaren Geschäfts',
          fr: 'Construire une entreprise évolutive',
          fa: 'ایجاد کسب و کار مقیاس پذیر',
          ps: 'د پراخیدونکي سوداګرۍ جوړول'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Mastering AI skills and expertise',
          es: 'Dominar habilidades y expertise en IA',
          ru: 'Овладение навыками и экспертизой ИИ',
          de: 'KI-Fähigkeiten und Expertise beherrschen',
          fr: 'Maîtriser les compétences et l\'expertise IA',
          fa: 'تسلط بر مهارت ها و تخصص AI',
          ps: 'د AI مهارتونو او تخصص ته لاس موندل'
        },
        value: 8,
        tracks: ['consulting', 'digital_product']
      },
      {
        text: {
          en: 'Freedom and flexible lifestyle',
          es: 'Libertad y estilo de vida flexible',
          ru: 'Свобода и гибкий образ жизни',
          de: 'Freiheit und flexibler Lebensstil',
          fr: 'Liberté et style de vie flexible',
          fa: 'آزادی و سبک زندگی انعطاف پذیر',
          ps: 'ازادي او د ژوند د انعطاف وړ سټایل'
        },
        value: 7,
        tracks: ['service', 'ecommerce']
      }
    ]
  },
  {
    id: 15,
    category: 'biggest_fear',
    text: {
      en: 'What\'s your biggest fear about starting?',
      es: '¿Cuál es tu mayor miedo sobre empezar?',
      ru: 'Какой ваш самый большой страх по поводу начала?',
      de: 'Was ist Ihre größte Angst vor dem Start?',
      fr: 'Quelle est votre plus grande peur concernant le début?',
      fa: 'بزرگترین ترس شما از شروع کردن چیست؟',
      ps: 'د پیل کولو په اړه ستاسو تر ټولو لویه ویره څه دی؟'
    },
    options: [
      {
        text: {
          en: 'Wasting time on the wrong approach',
          es: 'Perder tiempo en el enfoque equivocado',
          ru: 'Потратить время на неправильный подход',
          de: 'Zeit mit dem falschen Ansatz verschwenden',
          fr: 'Perdre du temps avec la mauvaise approche',
          fa: 'اتلاف زمان روی رویکرد اشتباه',
          ps: 'د غلط چلند په اړه د وخت ضایع کول'
        },
        value: 8,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Not being tech-savvy enough',
          es: 'No ser lo suficientemente experto en tecnología',
          ru: 'Недостаточная техническая грамотность',
          de: 'Nicht technisch versiert genug sein',
          fr: 'Ne pas être assez doué en technologie',
          fa: 'به اندازه کافی متخصص فناوری نبودن',
          ps: 'د ټیکنالوژۍ پوهه کافي نه ده'
        },
        value: 7,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: 'Losing money on failed investments',
          es: 'Perder dinero en inversiones fallidas',
          ru: 'Потерять деньги на неудачных инвестициях',
          de: 'Geld bei gescheiterten Investitionen verlieren',
          fr: 'Perdre de l\'argent sur des investissements ratés',
          fa: 'از دست دادن پول در سرمایه گذاری های شکست خورده',
          ps: 'د ناکامو پانګونو کې د پیسو له لاسه ورکول'
        },
        value: 9,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Getting overwhelmed by information',
          es: 'Sentirse abrumado por la información',
          ru: 'Перегрузиться информацией',
          de: 'Von Informationen überwältigt werden',
          fr: 'Être submergé par l\'information',
          fa: 'تحت فشار اطلاعات قرار گرفتن',
          ps: 'د معلوماتو له کبله ستړی کیدل'
        },
        value: 6,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 16,
    category: 'ideal_outcome',
    text: {
      en: 'What\'s your ideal outcome in 1 year?',
      es: '¿Cuál es tu resultado ideal en 1 año?',
      ru: 'Каков ваш идеальный результат через 1 год?',
      de: 'Was ist Ihr ideales Ergebnis in 1 Jahr?',
      fr: 'Quel est votre résultat idéal dans 1 an?',
      fa: 'نتیجه ایده آل شما در 1 سال چیست؟',
      ps: 'ستاسو په 1 کال کې مثالي پایله څه ده؟'
    },
    options: [
      {
        text: {
          en: 'Replace my full-time job income',
          es: 'Reemplazar mis ingresos de trabajo de tiempo completo',
          ru: 'Заменить доход от основной работы',
          de: 'Mein Vollzeit-Job-Einkommen ersetzen',
          fr: 'Remplacer mes revenus d\'emploi à temps plein',
          fa: 'جایگزینی درآمد شغل تمام وقت',
          ps: 'د خپل بشپړ وخت دندې عاید بدلول'
        },
        value: 10,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Build multiple income streams',
          es: 'Construir múltiples fuentes de ingresos',
          ru: 'Создать множественные источники дохода',
          de: 'Mehrere Einkommensströme aufbauen',
          fr: 'Construire plusieurs flux de revenus',
          fa: 'ایجاد منابع درآمد چندگانه',
          ps: 'د څانګو عاید جریانونه جوړول'
        },
        value: 9,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Launch my own AI business',
          es: 'Lanzar mi propio negocio de IA',
          ru: 'Запустить собственный ИИ-бизнес',
          de: 'Mein eigenes KI-Geschäft starten',
          fr: 'Lancer ma propre entreprise IA',
          fa: 'راه اندازی کسب و کار AI خود',
          ps: 'د خپل AI سوداګرۍ پیل کول'
        },
        value: 8,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Achieve financial independence',
          es: 'Lograr independencia financiera',
          ru: 'Достичь финансовой независимости',
          de: 'Finanzielle Unabhängigkeit erreichen',
          fr: 'Atteindre l\'indépendance financière',
          fa: 'دستیابی به استقلال مالی',
          ps: 'مالي خپلواکي ته رسیدل'
        },
        value: 7,
        tracks: ['ecommerce', 'service']
      }
    ]
  },
  {
    id: 17,
    category: 'learning_pace',
    text: {
      en: 'What\'s your preferred learning pace?',
      es: '¿Cuál es tu ritmo de aprendizaje preferido?',
      ru: 'Какой ваш предпочтительный темп обучения?',
      de: 'Was ist Ihr bevorzugtes Lerntempo?',
      fr: 'Quel est votre rythme d\'apprentissage préféré?',
      fa: 'سرعت یادگیری مورد علاقه شما چیست؟',
      ps: 'ستاسو د غوره شوي زده کړې سرعت څه دی؟'
    },
    options: [
      {
        text: {
          en: 'Intensive - I want to learn everything fast',
          es: 'Intensivo - Quiero aprender todo rápido',
          ru: 'Интенсивный - Я хочу быстро все изучить',
          de: 'Intensiv - Ich möchte alles schnell lernen',
          fr: 'Intensif - Je veux tout apprendre rapidement',
          fa: 'فشرده - می خواهم همه چیز را سریع یاد بگیرم',
          ps: 'کلک - زه غواړم ټول شیان ګړندي زده کړم'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Steady - Consistent progress week by week',
          es: 'Constante - Progreso consistente semana a semana',
          ru: 'Устойчивый - Последовательный прогресс неделя за неделей',
          de: 'Stetig - Konsistenter Fortschritt Woche für Woche',
          fr: 'Régulier - Progrès constant semaine après semaine',
          fa: 'پیوسته - پیشرفت مداوم هفته به هفته',
          ps: 'دوامداره - د اونۍ په اونۍ ثابت پرمختګ'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Flexible - Learn when I have time',
          es: 'Flexible - Aprender cuando tenga tiempo',
          ru: 'Гибкий - Учиться, когда есть время',
          de: 'Flexibel - Lernen, wenn ich Zeit habe',
          fr: 'Flexible - Apprendre quand j\'ai le temps',
          fa: 'انعطاف پذیر - وقتی وقت دارم یاد بگیرم',
          ps: 'انعطاف وړ - کله چې وخت لرم زده کړم'
        },
        value: 7,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: 'Casual - No pressure, just exploring',
          es: 'Casual - Sin presión, solo explorando',
          ru: 'Свободный - Без давления, просто изучаю',
          de: 'Zwanglos - Kein Druck, nur Erkunden',
          fr: 'Décontracté - Sans pression, juste explorer',
          fa: 'غیررسمی - بدون فشار، فقط کاوش',
          ps: 'ساده - هیڅ فشار نشته، یوازې سپړنه'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 18,
    category: 'accountability',
    text: {
      en: 'How important is accountability for you?',
      es: '¿Qué tan importante es la responsabilidad para ti?',
      ru: 'Насколько важна для вас подотчетность?',
      de: 'Wie wichtig ist Verantwortlichkeit für Sie?',
      fr: 'Quelle est l\'importance de la responsabilité pour vous?',
      fa: 'پاسخگویی برای شما چقدر مهم است؟',
      ps: 'ستاسو لپاره حساب ورکونه څومره مهمه ده؟'
    },
    options: [
      {
        text: {
          en: 'Critical - I need someone to check on my progress',
          es: 'Crítico - Necesito que alguien revise mi progreso',
          ru: 'Критично - Мне нужен кто-то для проверки прогресса',
          de: 'Kritisch - Ich brauche jemanden, der meinen Fortschritt überprüft',
          fr: 'Critique - J\'ai besoin de quelqu\'un pour vérifier mes progrès',
          fa: 'حیاتی - نیاز دارم کسی پیشرفت من را بررسی کند',
          ps: 'بحراني - زه یو چا ته اړتیا لرم چې زموږ پرمختګ وګوري'
        },
        value: 10,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Important - Regular check-ins would help',
          es: 'Importante - Las verificaciones regulares ayudarían',
          ru: 'Важно - Регулярные проверки помогли бы',
          de: 'Wichtig - Regelmäßige Check-ins würden helfen',
          fr: 'Important - Des vérifications régulières aideraient',
          fa: 'مهم - بررسی های منظم کمک می کند',
          ps: 'مهم - منظم چیک اپونه به ګټور وي'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Somewhat - I prefer community support',
          es: 'Algo - Prefiero el apoyo de la comunidad',
          ru: 'Отчасти - Я предпочитаю поддержку сообщества',
          de: 'Etwas - Ich bevorzuge Community-Unterstützung',
          fr: 'Un peu - Je préfère le soutien communautaire',
          fa: 'تا حدودی - ترجیح می دهم از جامعه حمایت شوم',
          ps: 'یو څه - زه د ټولنې ملاتړ ته غوره ورکوم'
        },
        value: 6,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Low - I\'m self-motivated and disciplined',
          es: 'Bajo - Soy auto-motivado y disciplinado',
          ru: 'Низко - Я самомотивирован и дисциплинирован',
          de: 'Niedrig - Ich bin selbstmotiviert und diszipliniert',
          fr: 'Faible - Je suis auto-motivé et discipliné',
          fa: 'کم - من خودانگیخته و منضبط هستم',
          ps: 'ټیټ - زه د ځان هڅونکی او نظم دار یم'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 19,
    category: 'risk_tolerance',
    text: {
      en: 'What\'s your risk tolerance level?',
      es: '¿Cuál es tu nivel de tolerancia al riesgo?',
      ru: 'Каков ваш уровень толерантности к риску?',
      de: 'Wie ist Ihr Risikotoleranz-Level?',
      fr: 'Quel est votre niveau de tolérance au risque?',
      fa: 'سطح تحمل ریسک شما چقدر است؟',
      ps: 'ستاسو د خطر زغم کچه څومره ده؟'
    },
    options: [
      {
        text: {
          en: 'High - I\'m willing to take big risks for big rewards',
          es: 'Alto - Estoy dispuesto a tomar grandes riesgos por grandes recompensas',
          ru: 'Высокий - Я готов принимать большие риски ради больших наград',
          de: 'Hoch - Ich bin bereit, große Risiken für große Belohnungen einzugehen',
          fr: 'Élevé - Je suis prêt à prendre de gros risques pour de gros profits',
          fa: 'بالا - حاضرم برای پاداش های بزرگ ریسک بزرگ کنم',
          ps: 'لوړ - زه د لویو انعامونو لپاره د لویو خطرونو اخیستلو ته چمتو یم'
        },
        value: 10,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Medium - Calculated risks with proven strategies',
          es: 'Medio - Riesgos calculados con estrategias probadas',
          ru: 'Средний - Расчетные риски с проверенными стратегиями',
          de: 'Mittel - Kalkulierte Risiken mit bewährten Strategien',
          fr: 'Moyen - Risques calculés avec des stratégies éprouvées',
          fa: 'متوسط - ریسک های محاسبه شده با استراتژی های اثبات شده',
          ps: 'منځنی - د ثابت شوي ستراتیژیو سره محاسبه شوي خطرونه'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Low - I prefer safe, guaranteed approaches',
          es: 'Bajo - Prefiero enfoques seguros y garantizados',
          ru: 'Низкий - Я предпочитаю безопасные, гарантированные подходы',
          de: 'Niedrig - Ich bevorzuge sichere, garantierte Ansätze',
          fr: 'Faible - Je préfère des approches sûres et garanties',
          fa: 'پایین - رویکردهای امن و تضمین شده را ترجیح می دهم',
          ps: 'ټیټ - زه د خوندي، تضمین شوي چلندونو ته غوره ورکوم'
        },
        value: 6,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Very Low - I need step-by-step proven systems',
          es: 'Muy Bajo - Necesito sistemas probados paso a paso',
          ru: 'Очень низкий - Мне нужны пошаговые проверенные системы',
          de: 'Sehr niedrig - Ich brauche schrittweise bewährte Systeme',
          fr: 'Très faible - J\'ai besoin de systèmes éprouvés étape par étape',
          fa: 'بسیار پایین - به سیستم های اثبات شده گام به گام نیاز دارم',
          ps: 'ډیر ټیټ - زه د ګام په ګام ثابت شوي سیسټمونو ته اړتیا لرم'
        },
        value: 4,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 20,
    category: 'commitment_level',
    text: {
      en: 'How committed are you to making this work?',
      es: '¿Qué tan comprometido estás para hacer que esto funcione?',
      ru: 'Насколько вы привержены тому, чтобы это сработало?',
      de: 'Wie engagiert sind Sie, damit das funktioniert?',
      fr: 'À quel point êtes-vous engagé à faire en sorte que cela fonctionne?',
      fa: 'چقدر متعهد هستید که این کار موفق شود؟',
      ps: 'تاسو د دې د کار کولو لپاره څومره ژمن یاست؟'
    },
    options: [
      {
        text: {
          en: '100% - I\'ll do whatever it takes to succeed',
          es: '100% - Haré lo que sea necesario para tener éxito',
          ru: '100% - Я сделаю все необходимое для успеха',
          de: '100% - Ich werde alles tun, was nötig ist, um erfolgreich zu sein',
          fr: '100% - Je ferai tout ce qu\'il faut pour réussir',
          fa: '100% - برای موفقیت هر کاری می کنم',
          ps: '100% - زه به د بریالیتوب لپاره هر هغه کار وکړم چې اړین وي'
        },
        value: 10,
        tracks: ['consulting', 'service', 'digital_product', 'ecommerce']
      },
      {
        text: {
          en: '75% - Very committed, but need work-life balance',
          es: '75% - Muy comprometido, pero necesito equilibrio trabajo-vida',
          ru: '75% - Очень привержен, но нужен баланс работы и жизни',
          de: '75% - Sehr engagiert, aber brauche Work-Life-Balance',
          fr: '75% - Très engagé, mais besoin d\'équilibre travail-vie',
          fa: '75% - بسیار متعهد، اما به تعادل کار و زندگی نیاز دارم',
          ps: '75% - ډیر ژمن، مګر د کار او ژوند تعادل ته اړتیا لرم'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '50% - Interested but have other priorities',
          es: '50% - Interesado pero tengo otras prioridades',
          ru: '50% - Заинтересован, но есть другие приоритеты',
          de: '50% - Interessiert, aber habe andere Prioritäten',
          fr: '50% - Intéressé mais j\'ai d\'autres priorités',
          fa: '50% - علاقه مند اما اولویت های دیگری دارم',
          ps: '50% - لیوالتیا لرم مګر نور لومړیتوبونه لرم'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '25% - Just exploring possibilities right now',
          es: '25% - Solo explorando posibilidades ahora mismo',
          ru: '25% - Просто изучаю возможности прямо сейчас',
          de: '25% - Erkunde gerade nur die Möglichkeiten',
          fr: '25% - J\'explore juste les possibilités en ce moment',
          fa: '25% - فقط در حال کشف احتمالات هستم',
          ps: '25% - اوس مهال یوازې د احتمالاتو سپړنه کوم'
        },
        value: 3,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  }
];

// B2C Track Descriptions - Accessible and gamified language
export const aiChallengeTrackDescriptions = {
  digital_product: {
    en: '🚀 AI Digital Product Creator: Learn to build and sell AI-powered apps, courses, and digital tools that generate $2,000-$10,000+ monthly. Perfect for tech-curious creators who want recurring income!',
    es: '🚀 Creador de Productos Digitales AI: Aprende a construir y vender apps, cursos y herramientas digitales potenciadas por IA que generan $2,000-$10,000+ mensuales.',
    ru: '🚀 Создатель AI Цифровых Продуктов: Изучите создание и продажу AI-приложений, курсов и цифровых инструментов, генерирующих $2,000-$10,000+ в месяц.',
    de: '🚀 AI Digital Product Creator: Lernen Sie, AI-gestützte Apps, Kurse und digitale Tools zu erstellen und zu verkaufen, die $2,000-$10,000+ monatlich generieren.',
    fr: '🚀 Créateur de Produits Numériques IA: Apprenez à créer et vendre des apps, cours et outils numériques alimentés par l\'IA générant $2,000-$10,000+ mensuels.',
    fa: '🚀 سازنده محصولات دیجیتال AI: یاد بگیرید اپلیکیشن ها، دوره ها و ابزارهای دیجیتال مبتنی بر AI بسازید که ماهانه $2,000-$10,000+ درآمد دارند.',
    ps: '🚀 د AI ډیجیټل محصولاتو جوړونکی: د AI لخوا پیاوړي اپسونه، کورسونه او ډیجیټل وسایل جوړول او پلورل زده کړئ چې میاشتني $2,000-$10,000+ تولیدوي.'
  },
  service: {
    en: '💼 AI Service Provider: Offer in-demand AI services like content creation, automation, and consulting. Start earning $1,000-$5,000+ monthly helping businesses with AI solutions!',
    es: '💼 Proveedor de Servicios AI: Ofrece servicios de IA demandados como creación de contenido, automatización y consultoría. ¡Empieza a ganar $1,000-$5,000+ mensuales!',
    ru: '💼 Поставщик AI Услуг: Предлагайте востребованные AI-услуги, такие как создание контента, автоматизация и консультирование. Начните зарабатывать $1,000-$5,000+ в месяц!',
    de: '💼 AI Service Provider: Bieten Sie gefragte AI-Services wie Content-Erstellung, Automatisierung und Beratung an. Verdienen Sie $1,000-$5,000+ monatlich!',
    fr: '💼 Fournisseur de Services IA: Offrez des services IA demandés comme la création de contenu, l\'automatisation et le conseil. Gagnez $1,000-$5,000+ mensuels!',
    fa: '💼 ارائه دهنده خدمات AI: خدمات پرتقاضای AI مانند تولید محتوا، اتوماسیون و مشاوره ارائه دهید. شروع به کسب درآمد ماهانه $1,000-$5,000+ کنید!',
    ps: '💼 د AI خدماتو وړاندې کوونکی: د AI غوښتل شوي خدمات لکه د مینځپانګې جوړول، اتومات کول او مشورې وړاندې کړئ. میاشتني $1,000-$5,000+ عاید پیل کړئ!'
  },
  ecommerce: {
    en: '🛒 AI E-commerce Entrepreneur: Use AI to find winning products, create stores, and automate sales processes. Build an online business generating $500-$15,000+ monthly!',
    es: '🛒 Emprendedor de E-commerce AI: Usa IA para encontrar productos ganadores, crear tiendas y automatizar procesos de ventas. ¡Construye un negocio online que genere $500-$15,000+ mensuales!',
    ru: '🛒 AI E-commerce Предприниматель: Используйте ИИ для поиска выигрышных продуктов, создания магазинов и автоматизации продаж. Постройте онлайн-бизнес, генерирующий $500-$15,000+ в месяц!',
    de: '🛒 AI E-Commerce Unternehmer: Nutzen Sie KI, um Gewinnprodukte zu finden, Shops zu erstellen und Verkaufsprozesse zu automatisieren. Bauen Sie ein Online-Geschäft mit $500-$15,000+ monatlich auf!',
    fr: '🛒 Entrepreneur E-commerce IA: Utilisez l\'IA pour trouver des produits gagnants, créer des boutiques et automatiser les processus de vente. Construisez un business en ligne générant $500-$15,000+ mensuels!',
    fa: '🛒 کارآفرین تجارت الکترونیک AI: از AI برای یافتن محصولات برنده، ایجاد فروشگاه و اتوماسیون فروش استفاده کنید. کسب و کار آنلاین با درآمد ماهانه $500-$15,000+ بسازید!',
    ps: '🛒 د AI بریښنايي سوداګرۍ سوداګر: د ګټونکو محصولاتو موندلو، پلورنځیو جوړولو او د پلورنې پروسې اتومات کولو لپاره AI وکاروئ. آنلاین سوداګرۍ جوړ کړئ چې میاشتني $500-$15,000+ تولیدوي!'
  },
  consulting: {
    en: '🎯 AI Strategy Consultant: Guide businesses through AI transformation as a trusted advisor. Command premium rates of $100-$500+ per hour sharing your AI expertise!',
    es: '🎯 Consultor de Estrategia AI: Guía a las empresas a través de la transformación AI como asesor de confianza. ¡Cobra tarifas premium de $100-$500+ por hora compartiendo tu expertise en IA!',
    ru: '🎯 AI Стратегический Консультант: Направляйте бизнес через AI-трансформацию как доверенный советник. Берите премиальные ставки $100-$500+ в час, делясь экспертизой в ИИ!',
    de: '🎯 AI Strategy Consultant: Führen Sie Unternehmen durch die KI-Transformation als vertrauensvoller Berater. Verlangen Sie Premium-Raten von $100-$500+ pro Stunde für Ihre KI-Expertise!',
    fr: '🎯 Consultant en Stratégie IA: Guidez les entreprises à travers la transformation IA en tant que conseiller de confiance. Facturez des tarifs premium de $100-$500+ par heure en partageant votre expertise IA!',
    fa: '🎯 مشاور استراتژی AI: کسب و کارها را به عنوان مشاور مورد اعتماد در تحول AI راهنمایی کنید. نرخ های پریمیوم $100-$500+ در ساعت با به اشتراک گذاری تخصص AI خود دریافت کنید!',
    ps: '🎯 د AI ستراتیژۍ مشاور: د باور وړ مشاور په توګه د AI بدلون له لارې سوداګریو ته لارښوونه وکړئ. د خپل AI تخصص د شریکولو سره د ساعت $100-$500+ پریمیم نرخونه واخلئ!'
  }
};