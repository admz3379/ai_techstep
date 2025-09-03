import { QuizQuestion, Language, TrackType } from './types';

// Quiz questions with multilingual support and track scoring
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'goal',
    text: {
      en: 'What is your primary goal for earning income with AI?',
      es: '¿Cuál es tu objetivo principal para generar ingresos con IA?',
      ru: 'Какова ваша основная цель заработка с помощью ИИ?',
      de: 'Was ist Ihr Hauptziel beim Einkommen mit KI?',
      fr: 'Quel est votre objectif principal pour gagner de l\'argent avec l\'IA?',
      fa: 'هدف اصلی شما برای کسب درآمد با هوش مصنوعی چیست؟',
      ps: 'د AI سره د عاید ترلاسه کولو ستاسو اصلي هدف څه دی؟'
    },
    options: [
      {
        text: {
          en: 'Create and sell digital products (courses, ebooks, templates)',
          es: 'Crear y vender productos digitales (cursos, ebooks, plantillas)',
          ru: 'Создавать и продавать цифровые продукты (курсы, электронные книги, шаблоны)',
          de: 'Digitale Produkte erstellen und verkaufen (Kurse, E-Books, Vorlagen)',
          fr: 'Créer et vendre des produits numériques (cours, ebooks, modèles)',
          fa: 'ایجاد و فروش محصولات دیجیتال (دوره ها، کتاب های الکترونیکی، قالب ها)',
          ps: 'د ډیجیټل محصولاتو جوړول او پلورل (کورسونه، بریښنايي کتابونه، ټیمپلیټونه)'
        },
        value: 10,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Offer AI-powered services to clients (writing, design, consulting)',
          es: 'Ofrecer servicios potenciados por IA a clientes (escritura, diseño, consultoría)',
          ru: 'Предлагать услуги на основе ИИ клиентам (письмо, дизайн, консультирование)',
          de: 'KI-gestützte Dienstleistungen für Kunden anbieten (Schreiben, Design, Beratung)',
          fr: 'Offrir des services alimentés par l\'IA aux clients (écriture, design, conseil)',
          fa: 'ارائه خدمات مبتنی بر هوش مصنوعی به مشتریان (نویسندگی، طراحی، مشاوره)',
          ps: 'پیرودونکو ته د AI پر بنسټ خدماتو وړاندې کول (لیکنه، ډیزاین، مشورې)'
        },
        value: 10,
        tracks: ['service']
      },
      {
        text: {
          en: 'Start an AI-enhanced e-commerce business',
          es: 'Iniciar un negocio de comercio electrónico mejorado con IA',
          ru: 'Начать бизнес электронной коммерции с использованием ИИ',
          de: 'Ein KI-verbessertes E-Commerce-Geschäft starten',
          fr: 'Démarrer une entreprise de commerce électronique améliorée par l\'IA',
          fa: 'شروع کسب و کار تجارت الکترونیک تقویت شده با هوش مصنوعی',
          ps: 'د AI لخوا ښه شوي بریښنايي سوداګرۍ سوداګرۍ پیل کول'
        },
        value: 10,
        tracks: ['ecommerce']
      },
      {
        text: {
          en: 'Become an AI expert consultant and coach',
          es: 'Convertirse en consultor experto en IA y coach',
          ru: 'Стать экспертом-консультантом и тренером по ИИ',
          de: 'AI-Experte, Berater und Coach werden',
          fr: 'Devenir consultant expert en IA et coach',
          fa: 'تبدیل شدن به مشاور متخصص و مربی هوش مصنوعی',
          ps: 'د AI د ماهر مشاور او روزونکي کیدل'
        },
        value: 10,
        tracks: ['consulting']
      }
    ]
  },
  {
    id: 2,
    category: 'experience',
    text: {
      en: 'How much experience do you have with AI tools?',
      es: '¿Cuánta experiencia tienes con herramientas de IA?',
      ru: 'Какой у вас опыт работы с инструментами ИИ?',
      de: 'Wie viel Erfahrung haben Sie mit KI-Tools?',
      fr: 'Quelle expérience avez-vous avec les outils d\'IA?',
      fa: 'چقدر تجربه با ابزارهای هوش مصنوعی دارید؟',
      ps: 'تاسو د AI وسایلو سره څومره تجربه لرئ؟'
    },
    options: [
      {
        text: {
          en: 'Complete beginner - never used AI tools',
          es: 'Principiante completo - nunca he usado herramientas de IA',
          ru: 'Полный новичок - никогда не использовал инструменты ИИ',
          de: 'Vollständiger Anfänger - noch nie KI-Tools verwendet',
          fr: 'Débutant complet - jamais utilisé d\'outils d\'IA',
          fa: 'مبتدی کامل - هرگز از ابزارهای هوش مصنوعی استفاده نکرده ام',
          ps: 'بشپړ پیل کوونکی - هیڅکله د AI وسایلو نه دي کارولي'
        },
        value: 2,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Some experience - used ChatGPT occasionally',
          es: 'Algo de experiencia - he usado ChatGPT ocasionalmente',
          ru: 'Некоторый опыт - иногда использовал ChatGPT',
          de: 'Etwas Erfahrung - gelegentlich ChatGPT verwendet',
          fr: 'Quelque expérience - utilisé ChatGPT occasionnellement',
          fa: 'تجربه کمی - گاهی اوقات از ChatGPT استفاده کرده ام',
          ps: 'یو څه تجربه - کله ناکله یې ChatGPT کارولی'
        },
        value: 5,
        tracks: ['digital_product', 'service', 'consulting']
      },
      {
        text: {
          en: 'Good experience - regularly use multiple AI tools',
          es: 'Buena experiencia - uso regularmente múltiples herramientas de IA',
          ru: 'Хороший опыт - регулярно использую несколько инструментов ИИ',
          de: 'Gute Erfahrung - regelmäßig mehrere KI-Tools verwenden',
          fr: 'Bonne expérience - utilise régulièrement plusieurs outils d\'IA',
          fa: 'تجربه خوب - به طور منظم از چندین ابزار هوش مصنوعی استفاده می کنم',
          ps: 'ښه تجربه - په منظمه توګه د څو AI وسایلو کاروي'
        },
        value: 8,
        tracks: ['service', 'consulting']
      },
      {
        text: {
          en: 'Expert level - I understand AI workflows and automation',
          es: 'Nivel experto - entiendo los flujos de trabajo y automatización de IA',
          ru: 'Экспертный уровень - понимаю рабочие процессы и автоматизацию ИИ',
          de: 'Expertenlevel - verstehe KI-Workflows und Automatisierung',
          fr: 'Niveau expert - je comprends les flux de travail et l\'automatisation de l\'IA',
          fa: 'سطح متخصص - من جریان کار و اتوماسیون هوش مصنوعی را درک می کنم',
          ps: 'د ماهر کچه - زه د AI کاري بهیرونه او اتومات پوهیږم'
        },
        value: 10,
        tracks: ['consulting']
      }
    ]
  },
  {
    id: 3,
    category: 'time',
    text: {
      en: 'How much time can you dedicate to building your AI income stream?',
      es: '¿Cuánto tiempo puedes dedicar a construir tu flujo de ingresos con IA?',
      ru: 'Сколько времени вы можете посвятить построению потока доходов с ИИ?',
      de: 'Wie viel Zeit können Sie dem Aufbau Ihres KI-Einkommensstroms widmen?',
      fr: 'Combien de temps pouvez-vous consacrer à construire votre flux de revenus IA?',
      fa: 'چه مقدار زمان می توانید به ایجاد جریان درآمد هوش مصنوعی اختصاص دهید؟',
      ps: 'تاسو کولی شئ د خپل د AI عاید جریان جوړولو لپاره څومره وخت ځانګړی کړئ؟'
    },
    options: [
      {
        text: {
          en: '1-2 hours per week (side hustle)',
          es: '1-2 horas por semana (negocio secundario)',
          ru: '1-2 часа в неделю (подработка)',
          de: '1-2 Stunden pro Woche (Nebentätigkeit)',
          fr: '1-2 heures par semaine (activité secondaire)',
          fa: '1-2 ساعت در هفته (کار جانبی)',
          ps: 'په اونۍ کې 1-2 ساعته (د اړخ سوداګرۍ)'
        },
        value: 3,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: '5-10 hours per week (serious side project)',
          es: '5-10 horas por semana (proyecto secundario serio)',
          ru: '5-10 часов в неделю (серьезный побочный проект)',
          de: '5-10 Stunden pro Woche (ernsthaftes Nebenprojekt)',
          fr: '5-10 heures par semaine (projet secondaire sérieux)',
          fa: '5-10 ساعت در هفته (پروژه جانبی جدی)',
          ps: 'په اونۍ کې 5-10 ساعته (د جدي اړخ پروژه)'
        },
        value: 6,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '20+ hours per week (part-time transition)',
          es: '20+ horas por semana (transición a tiempo parcial)',
          ru: '20+ часов в неделю (переход на неполный рабочий день)',
          de: '20+ Stunden pro Woche (Teilzeit-Übergang)',
          fr: '20+ heures par semaine (transition à temps partiel)',
          fa: '20+ ساعت در هفته (انتقال پاره وقت)',
          ps: 'په اونۍ کې 20+ ساعتونه (د برخې وخت لیږد)'
        },
        value: 8,
        tracks: ['service', 'consulting', 'ecommerce']
      },
      {
        text: {
          en: '40+ hours per week (full-time commitment)',
          es: '40+ horas por semana (compromiso de tiempo completo)',
          ru: '40+ часов в неделю (полная занятость)',
          de: '40+ Stunden pro Woche (Vollzeit-Engagement)',
          fr: '40+ heures par semaine (engagement à temps plein)',
          fa: '40+ ساعت در هفته (تعهد تمام وقت)',
          ps: 'په اونۍ کې 40+ ساعتونه (د بشپړ وخت ژمنتیا)'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 4,
    category: 'budget',
    text: {
      en: 'What budget do you have for tools and resources?',
      es: '¿Qué presupuesto tienes para herramientas y recursos?',
      ru: 'Какой у вас бюджет на инструменты и ресурсы?',
      de: 'Welches Budget haben Sie für Tools und Ressourcen?',
      fr: 'Quel budget avez-vous pour les outils et les ressources?',
      fa: 'چه بودجه ای برای ابزار و منابع دارید؟',
      ps: 'تاسو د وسایلو او سرچینو لپاره څومره بودیجه لرئ؟'
    },
    options: [
      {
        text: {
          en: '$0 - I want to use only free tools',
          es: '$0 - Quiero usar solo herramientas gratuitas',
          ru: '$0 - Хочу использовать только бесплатные инструменты',
          de: '$0 - Ich möchte nur kostenlose Tools verwenden',
          fr: '$0 - Je veux utiliser uniquement des outils gratuits',
          fa: '$0 - من فقط می خواهم از ابزارهای رایگان استفاده کنم',
          ps: '$0 - زه غواړم یوازې وړیا وسایل وکاروم'
        },
        value: 2,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: '$50-200/month - Basic paid tools',
          es: '$50-200/mes - Herramientas básicas de pago',
          ru: '$50-200/месяц - Базовые платные инструменты',
          de: '$50-200/Monat - Grundlegende bezahlte Tools',
          fr: '$50-200/mois - Outils payants de base',
          fa: '$50-200/ماه - ابزارهای پایه پولی',
          ps: '$50-200/میاشت - د بنسټیز تادیه شوي وسایل'
        },
        value: 6,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$500+/month - Professional tools and software',
          es: '$500+/mes - Herramientas profesionales y software',
          ru: '$500+/месяц - Профессиональные инструменты и программное обеспечение',
          de: '$500+/Monat - Professionelle Tools und Software',
          fr: '$500+/mois - Outils professionnels et logiciels',
          fa: '$500+/ماه - ابزارها و نرم افزارهای حرفه ای',
          ps: '$500+/میاشت - مسلکي وسایل او سافټویر'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 5,
    category: 'skills',
    text: {
      en: 'Which skill do you feel most confident about?',
      es: '¿En qué habilidad te sientes más confiado?',
      ru: 'В какой навык вы чувствуете себя наиболее уверенно?',
      de: 'Bei welcher Fähigkeit fühlen Sie sich am sichersten?',
      fr: 'Dans quelle compétence vous sentez-vous le plus confiant?',
      fa: 'در مورد کدام مهارت بیشترین اعتماد را دارید؟',
      ps: 'ستاسو د کومې مهارت په اړه ډیر باور لرئ؟'
    },
    options: [
      {
        text: {
          en: 'Writing and content creation',
          es: 'Escritura y creación de contenido',
          ru: 'Письмо и создание контента',
          de: 'Schreiben und Content-Erstellung',
          fr: 'Écriture et création de contenu',
          fa: 'نویسندگی و ایجاد محتوا',
          ps: 'لیکنه او د منځپانګې جوړول'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Design and visual creativity',
          es: 'Diseño y creatividad visual',
          ru: 'Дизайн и визуальное творчество',
          de: 'Design und visuelle Kreativität',
          fr: 'Design et créativité visuelle',
          fa: 'طراحی و خلاقیت بصری',
          ps: 'ډیزاین او لیدونکي خلاقیت'
        },
        value: 7,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Marketing and sales',
          es: 'Marketing y ventas',
          ru: 'Маркетинг и продажи',
          de: 'Marketing und Verkauf',
          fr: 'Marketing et ventes',
          fa: 'بازاریابی و فروش',
          ps: 'بازار موندنه او پلورنه'
        },
        value: 9,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Teaching and explaining concepts',
          es: 'Enseñar y explicar conceptos',
          ru: 'Обучение и объяснение концепций',
          de: 'Lehren und Konzepte erklären',
          fr: 'Enseigner et expliquer des concepts',
          fa: 'آموزش و توضیح مفاهیم',
          ps: 'د روزنې او د مفاهیمو تشریح'
        },
        value: 10,
        tracks: ['consulting', 'digital_product']
      }
    ]
  },
  // Add more questions to reach 20 total
  {
    id: 6,
    category: 'audience',
    text: {
      en: 'Who would be your ideal target audience?',
      es: '¿Quién sería tu audiencia objetivo ideal?',
      ru: 'Кто был бы вашей идеальной целевой аудиторией?',
      de: 'Wer wäre Ihre ideale Zielgruppe?',
      fr: 'Qui serait votre public cible idéal?',
      fa: 'مخاطبان هدف ایده آل شما چه کسانی هستند؟',
      ps: 'ستاسو د مثالي هدف لیدونکي څوک وي؟'
    },
    options: [
      {
        text: {
          en: 'Small business owners and entrepreneurs',
          es: 'Propietarios de pequeñas empresas y emprendedores',
          ru: 'Владельцы малого бизнеса и предприниматели',
          de: 'Kleinunternehmer und Unternehmer',
          fr: 'Propriétaires de petites entreprises et entrepreneurs',
          fa: 'صاحبان مشاغل کوچک و کارآفرینان',
          ps: 'د کشرو سوداګرۍ خاوندان او سوداګر'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Students and learning enthusiasts',
          es: 'Estudiantes y entusiastas del aprendizaje',
          ru: 'Студенты и энтузиасты обучения',
          de: 'Studenten und Lernbegeisterte',
          fr: 'Étudiants et passionnés d\'apprentissage',
          fa: 'دانشجویان و علاقه مندان به یادگیری',
          ps: 'زده کوونکي او د زده کړې لیواله'
        },
        value: 10,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Online shoppers and consumers',
          es: 'Compradores en línea y consumidores',
          ru: 'Онлайн-покупатели и потребители',
          de: 'Online-Käufer und Verbraucher',
          fr: 'Acheteurs en ligne et consommateurs',
          fa: 'خریداران آنلاین و مصرف کنندگان',
          ps: 'آنلاین پیرودونکي او پیرودونکي'
        },
        value: 10,
        tracks: ['ecommerce']
      },
      {
        text: {
          en: 'Creative professionals and freelancers',
          es: 'Profesionales creativos y freelancers',
          ru: 'Творческие профессионалы и фрилансеры',
          de: 'Kreative Profis und Freelancer',
          fr: 'Professionnels créatifs et freelances',
          fa: 'متخصصان خلاق و فریلنسرها',
          ps: 'تخلیقي متخصصین او د خپلواکو کارکوونکو'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      }
    ]
  }
  // Continue with questions 7-20...
];

export const trackDescriptions = {
  digital_product: {
    en: 'Create and sell digital products like online courses, ebooks, templates, and software tools powered by AI.',
    es: 'Crea y vende productos digitales como cursos online, ebooks, plantillas y herramientas de software potenciadas por IA.',
    ru: 'Создавайте и продавайте цифровые продукты, такие как онлайн-курсы, электронные книги, шаблоны и программные инструменты на основе ИИ.',
    de: 'Erstellen und verkaufen Sie digitale Produkte wie Online-Kurse, E-Books, Vorlagen und Software-Tools, die von KI unterstützt werden.',
    fr: 'Créez et vendez des produits numériques comme des cours en ligne, des ebooks, des modèles et des outils logiciels alimentés par l\'IA.',
    fa: 'محصولات دیجیتالی مانند دوره های آنلاین، کتاب های الکترونیکی، قالب ها و ابزارهای نرم افزاری مبتنی بر هوش مصنوعی ایجاد و بفروشید.',
    ps: 'د AI لخوا پیاوړي د ډیجیټل محصولاتو لکه آنلاین کورسونه ، بریښنايي کتابونه ، ټیمپلیټونه ، او د سافټویر وسایلو رامینځته کول او پلورل.'
  },
  service: {
    en: 'Offer AI-powered services like content writing, design, social media management, and business consulting.',
    es: 'Ofrece servicios potenciados por IA como redacción de contenido, diseño, gestión de redes sociales y consultoría empresarial.',
    ru: 'Предлагайте услуги на основе ИИ, такие как написание контента, дизайн, управление социальными сетями и бизнес-консультирование.',
    de: 'Bieten Sie KI-gestützte Dienstleistungen wie Content-Writing, Design, Social Media Management und Unternehmensberatung an.',
    fr: 'Offrez des services alimentés par l\'IA comme la rédaction de contenu, le design, la gestion des médias sociaux et le conseil en affaires.',
    fa: 'خدمات مبتنی بر هوش مصنوعی مانند نویسندگی محتوا، طراحی، مدیریت رسانه های اجتماعی و مشاوره کسب و کار ارائه دهید.',
    ps: 'د AI پر بنسټ خدماتو وړاندې کول لکه د منځپانګې لیکنه ، ډیزاین ، د ټولنیزو رسنیو اداره ، او د سوداګرۍ مشورې.'
  },
  ecommerce: {
    en: 'Start an AI-enhanced e-commerce business with automated product research, listings, and customer service.',
    es: 'Inicia un negocio de comercio electrónico mejorado con IA con investigación automatizada de productos, listados y atención al cliente.',
    ru: 'Начните бизнес электронной коммерции с использованием ИИ с автоматизированным исследованием продуктов, листингами и обслуживанием клиентов.',
    de: 'Starten Sie ein KI-verbessertes E-Commerce-Geschäft mit automatisierter Produktrecherche, Listings und Kundenservice.',
    fr: 'Démarrez une entreprise de commerce électronique améliorée par l\'IA avec recherche de produits automatisée, listings et service client.',
    fa: 'کسب و کار تجارت الکترونیک تقویت شده با هوش مصنوعی با تحقیق خودکار محصول، فهرست بندی و خدمات مشتری شروع کنید.',
    ps: 'د اتوماتیک محصول څیړنو ، لیستونو ، او د پیرودونکو خدماتو سره د AI ښه شوي بریښنايي سوداګرۍ سوداګرۍ پیل کړئ.'
  },
  consulting: {
    en: 'Become an AI expert consultant, offering strategic guidance and implementation services to businesses.',
    es: 'Conviértete en consultor experto en IA, ofreciendo orientación estratégica y servicios de implementación a empresas.',
    ru: 'Станьте экспертом-консультантом по ИИ, предлагая стратегическое руководство и услуги по внедрению для бизнеса.',
    de: 'Werden Sie ein KI-Experten-Berater und bieten Sie strategische Beratung und Implementierungsdienstleistungen für Unternehmen an.',
    fr: 'Devenez consultant expert en IA, offrant des conseils stratégiques et des services d\'implémentation aux entreprises.',
    fa: 'مشاور متخصص هوش مصنوعی شوید و راهنمایی های استراتژیک و خدمات پیاده سازی به کسب و کارها ارائه دهید.',
    ps: 'د AI د ماهر مشاور شئ ، سوداګرۍ ته د ستراتیژیک لارښوونې او پلي کولو خدماتو وړاندې کول.'
  }
};