import { QuizQuestion, Language, TrackType } from './types';

// Executive Edge Academy Quiz Questions - Premium Business Assessment
export const executiveQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'background',
    text: {
      en: 'What best describes your current professional situation?',
      es: '¿Qué describe mejor tu situación profesional actual?',
      ru: 'Что лучше всего описывает вашу текущую профессиональную ситуацию?',
      de: 'Was beschreibt Ihre aktuelle berufliche Situation am besten?',
      fr: 'Qu\'est-ce qui décrit le mieux votre situation professionnelle actuelle?',
      fa: 'کدام گزینه وضعیت حرفه ای فعلی شما را بهتر توصیف می کند؟',
      ps: 'ستاسو د اوسني مسلکي وضعیت څه غوره بیانوي؟'
    },
    options: [
      {
        text: {
          en: 'Senior executive at a Fortune 1000 company ($150K+ annually)',
          es: 'Ejecutivo senior en empresa Fortune 1000 ($150K+ anuales)',
          ru: 'Топ-менеджер в компании из Fortune 1000 ($150K+ в год)',
          de: 'Senior Executive in Fortune 1000 Unternehmen ($150K+ jährlich)',
          fr: 'Cadre supérieur dans une entreprise Fortune 1000 ($150K+ par an)',
          fa: 'مدیر ارشد در شرکت Fortune 1000 (سالانه $150K+)',
          ps: 'د Fortune 1000 شرکت کې د لوړ پوړي اجرایوي ($150K+ په کال)'
        },
        value: 10,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: 'Successful business owner with established revenue ($500K+ annually)',
          es: 'Propietario exitoso con ingresos establecidos ($500K+ anuales)',
          ru: 'Успешный владелец бизнеса с устоявшимся доходом ($500K+ в год)',
          de: 'Erfolgreicher Geschäftsinhaber mit etabliertem Umsatz ($500K+ jährlich)',
          fr: 'Propriétaire d\'entreprise prospère avec revenus établis ($500K+ par an)',
          fa: 'صاحب کسب و کار موفق با درآمد ثابت (سالانه $500K+)',
          ps: 'بریالي د سوداګرۍ خاوند د ټاکل شوي عاید سره (په کال $500K+)'
        },
        value: 10,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'High-performing professional seeking additional revenue streams ($75K-$150K)',
          es: 'Profesional de alto rendimiento buscando ingresos adicionales ($75K-$150K)',
          ru: 'Высокоэффективный профессионал, ищущий дополнительные источники дохода ($75K-$150K)',
          de: 'Leistungsstarker Profi auf der Suche nach zusätzlichen Einnahmequellen ($75K-$150K)',
          fr: 'Professionnel performant cherchant des sources de revenus supplémentaires ($75K-$150K)',
          fa: 'متخصص با عملکرد بالا که به دنبال منابع درآمد اضافی است ($75K-$150K)',
          ps: 'د لوړ فعالیت مسلکي چې د اضافي عاید سرچینې غواړي ($75K-$150K)'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Serial entrepreneur with multiple ventures and exits',
          es: 'Emprendedor serial con múltiples ventures y salidas exitosas',
          ru: 'Серийный предприниматель с несколькими проектами и успешными выходами',
          de: 'Serieller Unternehmer mit mehreren Ventures und Exits',
          fr: 'Entrepreneur en série avec plusieurs ventures et sorties',
          fa: 'کارآفرین سریالی با چندین کسب و کار و خروج موفق',
          ps: 'د سلسله وار سوداګر د ډیری کارونو او بریالۍ وتلو سره'
        },
        value: 10,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 2,
    category: 'investment_capacity',
    text: {
      en: 'What investment level are you comfortable committing to your business transformation?',
      es: '¿Qué nivel de inversión estás dispuesto a comprometer en tu transformación empresarial?',
      ru: 'Какой уровень инвестиций вы готовы вложить в трансформацию бизнеса?',
      de: 'Welche Investitionshöhe können Sie für Ihre Geschäftstransformation aufbringen?',
      fr: 'Quel niveau d\'investissement êtes-vous prêt à engager pour votre transformation d\'entreprise?',
      fa: 'چه سطح سرمایه گذاری برای تحول کسب و کار خود راحت هستید؟',
      ps: 'ستاسو د سوداګرۍ بدلون لپاره د پانګونې کومه کچه دی چې تاسو یې آرام یاست؟'
    },
    options: [
      {
        text: {
          en: '$25K-$50K for a comprehensive transformation program with guaranteed ROI',
          es: '$25K-$50K para programa integral de transformación con ROI garantizado',
          ru: '$25K-$50K для комплексной программы трансформации с гарантированной окупаемостью',
          de: '$25K-$50K für ein umfassendes Transformationsprogramm mit garantierter ROI',
          fr: '$25K-$50K pour un programme de transformation complet avec ROI garanti',
          fa: '$25K-$50K برای برنامه تحول جامع با بازگشت سرمایه تضمینی',
          ps: 'د ټول پراخه بدلون پروګرام لپاره $25K-$50K د تضمین شوي ROI سره'
        },
        value: 10,
        tracks: ['consulting']
      },
      {
        text: {
          en: '$10K-$25K for premium tools, mentorship, and proven systems',
          es: '$10K-$25K para herramientas premium, mentoría y sistemas probados',
          ru: '$10K-$25K для премиум-инструментов, наставничества и проверенных систем',
          de: '$10K-$25K für Premium-Tools, Mentoring und bewährte Systeme',
          fr: '$10K-$25K pour des outils premium, du mentorat et des systèmes éprouvés',
          fa: '$10K-$25K برای ابزارهای پریمیوم، مربیگری و سیستم های اثبات شده',
          ps: 'د پریمیم وسایلو، مشورو او ثابت شوي سیسټمونو لپاره $10K-$25K'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$5K-$10K for essential training and implementation support',
          es: '$5K-$10K para entrenamiento esencial y soporte de implementación',
          ru: '$5K-$10K для базового обучения и поддержки внедрения',
          de: '$5K-$10K für essentielles Training und Implementierungssupport',
          fr: '$5K-$10K pour une formation essentielle et un support d\'implémentation',
          fa: '$5K-$10K برای آموزش اساسی و پشتیبانی پیاده سازی',
          ps: 'د اړین روزنې او د پلي کولو ملاتړ لپاره $5K-$10K'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: 'Currently evaluating investment options based on proven results',
          es: 'Evaluando opciones de inversión basadas en resultados probados',
          ru: 'Сейчас оцениваю варианты инвестиций на основе доказанных результатов',
          de: 'Bewerte derzeit Investitionsoptionen basierend auf bewiesenen Ergebnissen',
          fr: 'J\'évalue actuellement les options d\'investissement basées sur des résultats prouvés',
          fa: 'در حال حاضر گزینه های سرمایه گذاری را بر اساس نتایج اثبات شده ارزیابی می کنم',
          ps: 'اوس مهال د ثابت شوي پایلو پر بنسټ د پانګونې انتخابونه ارزونه کوم'
        },
        value: 4,
        tracks: ['service', 'ecommerce']
      }
    ]
  },
  {
    id: 3,
    category: 'revenue_goals',
    text: {
      en: 'What monthly revenue target are you aiming to achieve within 12 months?',
      es: '¿Qué objetivo de ingresos mensuales buscas lograr en 12 meses?',
      ru: 'Какую цель месячного дохода вы планируете достичь в течение 12 месяцев?',
      de: 'Welches monatliche Umsatzziel möchten Sie innerhalb von 12 Monaten erreichen?',
      fr: 'Quel objectif de revenus mensuels visez-vous à atteindre dans les 12 mois?',
      fa: 'هدف درآمد ماهانه شما که قصد دستیابی در 12 ماه دارید چقدر است؟',
      ps: 'د میاشتنۍ عاید هدف څومره دی چې تاسو د 12 میاشتو په اوږدو کې ترلاسه کول غواړئ؟'
    },
    options: [
      {
        text: {
          en: '$50K-$100K+ monthly (building a scalable enterprise)',
          es: '$50K-$100K+ mensual (construyendo empresa escalable)',
          ru: '$50K-$100K+ в месяц (создание масштабируемого предприятия)',
          de: '$50K-$100K+ monatlich (Aufbau eines skalierbaren Unternehmens)',
          fr: '$50K-$100K+ mensuels (construire une entreprise évolutive)',
          fa: '$50K-$100K+ ماهانه (ساخت یک کسب و کار مقیاس پذیر)',
          ps: '$50K-$100K+ میاشتني (د پراخیدونکي تصدۍ جوړول)'
        },
        value: 10,
        tracks: ['consulting', 'ecommerce']
      },
      {
        text: {
          en: '$25K-$50K monthly (premium service or product business)',
          es: '$25K-$50K mensual (negocio de servicios o productos premium)',
          ru: '$25K-$50K в месяц (премиум-сервис или продуктовый бизнес)',
          de: '$25K-$50K monatlich (Premium-Service oder Produktgeschäft)',
          fr: '$25K-$50K mensuels (service premium ou entreprise de produits)',
          fa: '$25K-$50K ماهانه (کسب و کار خدمات یا محصولات پریمیوم)',
          ps: '$25K-$50K میاشتني (د پریمیم خدماتو یا د تولیداتو سوداګرۍ)'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$10K-$25K monthly (substantial supplemental income)',
          es: '$10K-$25K mensual (ingreso suplementario sustancial)',
          ru: '$10K-$25K в месяц (существенный дополнительный доход)',
          de: '$10K-$25K monatlich (erhebliches Zusatzeinkommen)',
          fr: '$10K-$25K mensuels (revenu supplémentaire substantiel)',
          fa: '$10K-$25K ماهانه (درآمد تکمیلی قابل توجه)',
          ps: '$10K-$25K میاشتني (د پام وړ اضافي عاید)'
        },
        value: 6,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: '$5K-$10K monthly (meaningful side revenue while maintaining current role)',
          es: '$5K-$10K mensual (ingresos secundarios significativos manteniendo rol actual)',
          ru: '$5K-$10K в месяц (значительный побочный доход при сохранении текущей роли)',
          de: '$5K-$10K monatlich (bedeutende Nebeneinnahmen bei Beibehaltung der aktuellen Rolle)',
          fr: '$5K-$10K mensuels (revenus secondaires significatifs tout en maintenant le rôle actuel)',
          fa: '$5K-$10K ماهانه (درآمد جانبی معنادار در حین حفظ نقش فعلی)',
          ps: '$5K-$10K میاشتني (د پام وړ اړخیز عاید د اوسني رول ساتلو سره)'
        },
        value: 4,
        tracks: ['ecommerce', 'digital_product']
      }
    ]
  },
  {
    id: 4,
    category: 'time_commitment',
    text: {
      en: 'How much time can you realistically dedicate to building this business?',
      es: '¿Cuánto tiempo puedes dedicar realisticamente a construir este negocio?',
      ru: 'Сколько времени вы реально можете посвятить построению этого бизнеса?',
      de: 'Wie viel Zeit können Sie realistisch dem Aufbau dieses Geschäfts widmen?',
      fr: 'Combien de temps pouvez-vous réalistiquement consacrer à la construction de cette entreprise?',
      fa: 'چقدر زمان می توانید به طور واقعی به ساخت این کسب و کار اختصاص دهید؟',
      ps: 'تاسو کولی شئ د دې سوداګرۍ د جوړولو لپاره واقعیا څومره وخت ځانګړی کړئ؟'
    },
    options: [
      {
        text: {
          en: '40+ hours/week (ready to fully commit and build something transformational)',
          es: '40+ horas/semana (listo para comprometerme completamente y construir algo transformacional)',
          ru: '40+ часов в неделю (готов полностью посвятить себя и создать что-то трансформационное)',
          de: '40+ Stunden/Woche (bereit, sich voll zu engagieren und etwas Transformatives aufzubauen)',
          fr: '40+ heures/semaine (prêt à m\'engager pleinement et construire quelque chose de transformationnel)',
          fa: '40+ ساعت در هفته (آماده تعهد کامل و ساخت چیزی تحول آفرین)',
          ps: '40+ ساعته/اونۍ (چمتو یم چې بشپړ ژمنتیا وکړم او بدلون راوړونکی شی جوړ کړم)'
        },
        value: 10,
        tracks: ['consulting', 'ecommerce']
      },
      {
        text: {
          en: '20-40 hours/week (serious part-time commitment with clear growth plan)',
          es: '20-40 horas/semana (compromiso serio de medio tiempo con plan de crecimiento claro)',
          ru: '20-40 часов в неделю (серьезная работа на неполный рабочий день с четким планом роста)',
          de: '20-40 Stunden/Woche (ernsthaftes Teilzeit-Engagement mit klarem Wachstumsplan)',
          fr: '20-40 heures/semaine (engagement sérieux à temps partiel avec un plan de croissance clair)',
          fa: '20-40 ساعت در هفته (تعهد جدی پاره وقت با برنامه رشد مشخص)',
          ps: '20-40 ساعته/اونۍ (د برخې وخت جدي ژمنتیا د روښانه وده پلان سره)'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '10-20 hours/week (strategic time allocation during evenings/weekends)',
          es: '10-20 horas/semana (asignación estratégica de tiempo en noches/fines de semana)',
          ru: '10-20 часов в неделю (стратегическое распределение времени по вечерам/выходным)',
          de: '10-20 Stunden/Woche (strategische Zeitverteilung an Abenden/Wochenenden)',
          fr: '10-20 heures/semaine (allocation stratégique du temps en soirées/week-ends)',
          fa: '10-20 ساعت در هفته (تخصیص استراتژیک زمان در شب ها/آخر هفته ها)',
          ps: '10-20 ساعته/اونۍ (د ماښامونو/د اونۍ د پای ستراتیژیک وخت ویش)'
        },
        value: 6,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: '5-10 hours/week (focused effort with maximum efficiency and leverage)',
          es: '5-10 horas/semana (esfuerzo enfocado con máxima eficiencia y apalancamiento)',
          ru: '5-10 часов в неделю (сфокусированные усилия с максимальной эффективностью и рычагами)',
          de: '5-10 Stunden/Woche (fokussierte Anstrengung mit maximaler Effizienz und Hebelwirkung)',
          fr: '5-10 heures/semaine (effort ciblé avec efficacité maximale et effet de levier)',
          fa: '5-10 ساعت در هفته (تلاش متمرکز با حداکثر کارایی و اهرم)',
          ps: '5-10 ساعته/اونۍ (د غوره موثریت او لیور سره متمرکز هڅه)'
        },
        value: 4,
        tracks: ['ecommerce', 'digital_product']
      }
    ]
  },
  {
    id: 5,
    category: 'expertise_area',
    text: {
      en: 'Which area represents your strongest professional expertise?',
      es: '¿Qué área representa tu mayor expertise profesional?',
      ru: 'Какая область представляет вашу самую сильную профессиональную экспертизу?',
      de: 'Welcher Bereich repräsentiert Ihre stärkste berufliche Expertise?',
      fr: 'Quel domaine représente votre expertise professionnelle la plus forte?',
      fa: 'کدام حوزه نمایانگر قوی ترین تخصص حرفه ای شما است؟',
      ps: 'کوم ساحه ستاسو د پیاوړي مسلکي تخصص استازیتوب کوي؟'
    },
    options: [
      {
        text: {
          en: 'Strategic leadership and organizational transformation',
          es: 'Liderazgo estratégico y transformación organizacional',
          ru: 'Стратегическое лидерство и организационная трансформация',
          de: 'Strategische Führung und organisatorische Transformation',
          fr: 'Leadership stratégique et transformation organisationnelle',
          fa: 'رهبری استراتژیک و تحول سازمانی',
          ps: 'ستراتیژیک مشرتابه او د سازمان بدلون'
        },
        value: 10,
        tracks: ['consulting']
      },
      {
        text: {
          en: 'Technology, product development, and innovation',
          es: 'Tecnología, desarrollo de productos e innovación',
          ru: 'Технологии, разработка продуктов и инновации',
          de: 'Technologie, Produktentwicklung und Innovation',
          fr: 'Technologie, développement de produits et innovation',
          fa: 'فناوری، توسعه محصول و نوآوری',
          ps: 'ټیکنالوژي، د محصولاتو پراختیا او نوښت'
        },
        value: 8,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Sales, marketing, and client relationship management',
          es: 'Ventas, marketing y gestión de relaciones con clientes',
          ru: 'Продажи, маркетинг и управление клиентскими отношениями',
          de: 'Vertrieb, Marketing und Kundenbeziehungsmanagement',
          fr: 'Ventes, marketing et gestion des relations clients',
          fa: 'فروش، بازاریابی و مدیریت روابط با مشتری',
          ps: 'پلورنه، بازارموندنه او د پیرودونکو اړیکو اداره'
        },
        value: 9,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: 'Finance, operations, and business optimization',
          es: 'Finanzas, operaciones y optimización empresarial',
          ru: 'Финансы, операции и бизнес-оптимизация',
          de: 'Finanzen, Betrieb und Geschäftsoptimierung',
          fr: 'Finance, opérations et optimisation des affaires',
          fa: 'مالی، عملیات و بهینه سازی کسب و کار',
          ps: 'مالي، عملیات او د سوداګرۍ غوره کول'
        },
        value: 7,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 6,
    category: 'business_model_preference',
    text: {
      en: 'Which business model appeals most to your entrepreneurial vision?',
      es: '¿Qué modelo de negocio atrae más a tu visión emprendedora?',
      ru: 'Какая бизнес-модель больше всего привлекает ваше предпринимательское видение?',
      de: 'Welches Geschäftsmodell spricht Ihre unternehmerische Vision am meisten an?',
      fr: 'Quel modèle d\'affaires attire le plus votre vision entrepreneuriale?',
      fa: 'کدام مدل کسب و کار بیشتر از همه چشم انداز کارآفرینی شما را جذب می کند؟',
      ps: 'کوم د سوداګرۍ ماډل ستاسو د سوداګر لید ته ډیر زړه راښکوي؟'
    },
    options: [
      {
        text: {
          en: 'High-touch consulting with Fortune 500 clients ($50K-$200K projects)',
          es: 'Consultoría de alto contacto con clientes Fortune 500 (proyectos $50K-$200K)',
          ru: 'Консалтинг высокого уровня с клиентами Fortune 500 (проекты $50K-$200K)',
          de: 'High-Touch-Beratung mit Fortune 500-Kunden ($50K-$200K Projekte)',
          fr: 'Conseil haut de gamme avec des clients Fortune 500 (projets $50K-$200K)',
          fa: 'مشاوره سطح بالا با مشتریان Fortune 500 (پروژه های $50K-$200K)',
          ps: 'د Fortune 500 پیرودونکو سره د لوړ کچې مشورې ($50K-$200K پروژې)'
        },
        value: 10,
        tracks: ['consulting']
      },
      {
        text: {
          en: 'Scalable digital products with recurring revenue streams',
          es: 'Productos digitales escalables con flujos de ingresos recurrentes',
          ru: 'Масштабируемые цифровые продукты с повторяющимися потоками доходов',
          de: 'Skalierbare digitale Produkte mit wiederkehrenden Einnahmeströmen',
          fr: 'Produits numériques évolutifs avec des flux de revenus récurrents',
          fa: 'محصولات دیجیتال مقیاس پذیر با جریان درآمد تکراری',
          ps: 'د تکراري عاید جریانونو سره د پراخیدونکي ډیجیټل محصولات'
        },
        value: 9,
        tracks: ['digital_product']
      },
      {
        text: {
          en: 'Premium service business with predictable monthly contracts',
          es: 'Negocio de servicios premium con contratos mensuales predecibles',
          ru: 'Премиум-сервисный бизнес с предсказуемыми месячными контрактами',
          de: 'Premium-Service-Geschäft mit vorhersagbaren monatlichen Verträgen',
          fr: 'Entreprise de services premium avec contrats mensuels prévisibles',
          fa: 'کسب و کار خدمات پریمیوم با قراردادهای ماهانه قابل پیش بینی',
          ps: 'د وړاندوینې وړ میاشتنۍ تړونونو سره د پریمیم خدماتو سوداګرۍ'
        },
        value: 8,
        tracks: ['service']
      },
      {
        text: {
          en: 'E-commerce empire with automated systems and inventory management',
          es: 'Imperio de e-commerce con sistemas automatizados y gestión de inventario',
          ru: 'E-commerce империя с автоматизированными системами и управлением запасами',
          de: 'E-Commerce-Imperium mit automatisierten Systemen und Bestandsmanagement',
          fr: 'Empire e-commerce avec systèmes automatisés et gestion des stocks',
          fa: 'امپراتوری تجارت الکترونیک با سیستم های خودکار و مدیریت موجودی',
          ps: 'د اتوماتیک سیسټمونو او د موجوداتو اداره سره د بریښنايي سوداګرۍ امپراتورۍ'
        },
        value: 7,
        tracks: ['ecommerce']
      }
    ]
  }
];

// Premium track descriptions for Executive Edge Academy
export const executiveTrackDescriptions = {
  consulting: {
    en: 'Build an AI Consulting Empire: Position yourself as the go-to AI transformation expert for Fortune 500 companies. Develop proprietary methodologies, command $50K-$200K project fees, and build recurring revenue through strategic retainer agreements.',
    es: 'Construye un Imperio de Consultoría AI: Posiciónate como el experto en transformación AI para empresas Fortune 500. Desarrolla metodologías propias, cobra honorarios de $50K-$200K por proyecto y construye ingresos recurrentes.',
    ru: 'Создайте Империю AI Консалтинга: Позиционируйте себя как эксперта по AI-трансформации для компаний Fortune 500. Разрабатывайте собственные методологии, берите $50K-$200K за проект и стройте повторяющиеся доходы.',
    de: 'Bauen Sie ein AI-Consulting-Imperium auf: Positionieren Sie sich als AI-Transformationsexperte für Fortune 500-Unternehmen. Entwickeln Sie eigene Methoden, verlangen Sie $50K-$200K Projektgebühren.',
    fr: 'Construisez un Empire de Conseil AI: Positionnez-vous comme l\'expert en transformation AI pour les entreprises Fortune 500. Développez des méthodologies propriétaires, facturez $50K-$200K par projet.',
    fa: 'ساخت امپراتوری مشاوره هوش مصنوعی: خود را به عنوان متخصص تحول AI برای شرکت های Fortune 500 معرفی کنید. روش های اختصاصی ایجاد کرده، $50K-$200K برای هر پروژه دریافت کنید.',
    ps: 'د AI مشورتي امپراتورۍ جوړول: د Fortune 500 شرکتونو لپاره د AI بدلون د ماهر په توګه ځان وښایاست. ځانګړي میتودونه رامینځته کړئ، د $50K-$200K پروژې فیسونه واخلئ.'
  },
  digital_product: {
    en: 'Create Digital Intelligence Products: Build AI-powered SaaS tools, subscription platforms with AI tutors, and premium automation systems. Generate $10K-$75K monthly through scalable digital products that serve thousands of customers.',
    es: 'Crea Productos de Inteligencia Digital: Construye herramientas SaaS potenciadas por AI, plataformas de suscripción con tutores AI y sistemas premium de automatización. Genera $10K-$75K mensuales.',
    ru: 'Создавайте Продукты Цифрового Интеллекта: Стройте SaaS-инструменты на базе AI, подписочные платформы с AI-наставниками и премиум системы автоматизации. Зарабатывайте $10K-$75K в месяц.',
    de: 'Erstellen Sie digitale Intelligence-Produkte: Bauen Sie AI-gestützte SaaS-Tools, Abo-Plattformen mit AI-Tutoren und Premium-Automatisierungssysteme. Generieren Sie $10K-$75K monatlich.',
    fr: 'Créez des Produits d\'Intelligence Numérique: Construisez des outils SaaS alimentés par l\'AI, des plateformes d\'abonnement avec des tuteurs AI et des systèmes d\'automatisation premium. Générez $10K-$75K mensuels.',
    fa: 'ایجاد محصولات هوش دیجیتال: ابزارهای SaaS مبتنی بر AI، پلتفرم های اشتراک با مربیان AI و سیستم های اتوماسیون پریمیوم بسازید. درآمد ماهانه $10K-$75K کسب کنید.',
    ps: 'د ډیجیټل استخباراتو محصولات جوړول: د AI لخوا پیاوړي SaaS وسایل، د AI ښوونکو سره د ګډون پلیټفارمونه او د پریمیم اتومات سیسټمونه جوړ کړئ. میاشتني $10K-$75K ترلاسه کړئ.'
  },
  service: {
    en: 'Launch Enterprise AI Services: Provide white-label AI solutions, done-for-you implementations, and specialized industry solutions. Build a $15K-$50K monthly service business with predictable contracts and premium positioning.',
    es: 'Lanza Servicios AI Empresariales: Proporciona soluciones AI de marca blanca, implementaciones listas e soluciones especializadas. Construye un negocio de servicios de $15K-$50K mensuales.',
    ru: 'Запустите Корпоративные AI Услуги: Предоставляйте white-label AI решения, готовые внедрения и специализированные отраслевые решения. Стройте сервисный бизнес на $15K-$50K в месяц.',
    de: 'Starten Sie Enterprise AI Services: Bieten Sie White-Label-AI-Lösungen, fertige Implementierungen und spezialisierte Branchenlösungen. Bauen Sie ein $15K-$50K monatliches Service-Geschäft auf.',
    fr: 'Lancez des Services AI d\'Entreprise: Fournissez des solutions AI en marque blanche, des implémentations clé en main et des solutions sectorielles spécialisées. Construisez une entreprise de services de $15K-$50K mensuels.',
    fa: 'راه اندازی خدمات AI سازمانی: راه حل های AI برند سفید، پیاده سازی های آماده و راه حل های تخصصی صنعت ارائه دهید. کسب و کار خدماتی $15K-$50K ماهانه بسازید.',
    ps: 'د تصدۍ AI خدماتو پیل کول: د سپینې نښې AI حلونه، د تاسو لپاره د پلي کولو او د ځانګړي صنعت حلونه چمتو کړئ. د میاشتنۍ $15K-$50K خدماتو سوداګرۍ جوړ کړئ.'
  },
  ecommerce: {
    en: 'Scale AI Investment & E-commerce: Build AI-powered investment systems, automated business acquisition strategies, and AI-enhanced e-commerce empires. Target $50K-$200K monthly through systematic wealth building and scaling.',
    es: 'Escala Inversión AI y E-commerce: Construye sistemas de inversión potenciados por AI, estrategias automatizadas de adquisición y imperios de e-commerce mejorados con AI. Apunta a $50K-$200K mensuales.',
    ru: 'Масштабируйте AI Инвестиции и E-commerce: Стройте AI-системы инвестирования, автоматизированные стратегии приобретения бизнеса и AI-улучшенные e-commerce империи. Цель: $50K-$200K в месяц.',
    de: 'Skalieren Sie AI Investment & E-Commerce: Bauen Sie AI-gestützte Investitionssysteme, automatisierte Geschäftsakquisitionsstrategien und AI-verbesserte E-Commerce-Imperien auf. Ziel: $50K-$200K monatlich.',
    fr: 'Développez l\'Investissement AI et E-commerce: Construisez des systèmes d\'investissement alimentés par l\'AI, des stratégies d\'acquisition automatisées et des empires e-commerce améliorés par l\'AI. Objectif: $50K-$200K mensuels.',
    fa: 'مقیاس بندی سرمایه گذاری AI و تجارت الکترونیک: سیستم های سرمایه گذاری مبتنی بر AI، استراتژی های خودکار خرید کسب و کار و امپراتوری های تجارت الکترونیک تقویت شده با AI بسازید. هدف: ماهانه $50K-$200K.',
    ps: 'د AI پانګونې او بریښنايي سوداګرۍ پراخول: د AI لخوا پیاوړي د پانګونې سیسټمونه، د اتوماتیک سوداګرۍ اخیستلو ستراتیژۍ او د AI لخوا ښه شوي د بریښنايي سوداګرۍ امپراتورۍ جوړ کړئ. هدف: میاشتني $50K-$200K.'
  }
};