import { QuizQuestion, Language, TrackType } from './types';

// Coursiv-Style Quiz for Work-From-Home Parents - AI Passive Income Focus
export const coursivParentQuizQuestions: QuizQuestion[] = [
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
          en: 'YES',
          es: 'SÍ',
          ru: 'ДА',
          de: 'JA',
          fr: 'OUI',
          fa: 'بله',
          ps: 'هو'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'NO',
          es: 'NO',
          ru: 'НЕТ',
          de: 'NEIN',
          fr: 'NON',
          fa: 'خیر',
          ps: 'نه'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 2,
    category: 'age',
    text: {
      en: 'What is your age?',
      es: '¿Cuál es tu edad?',
      ru: 'Сколько вам лет?',
      de: 'Wie alt sind Sie?',
      fr: 'Quel âge avez-vous?',
      fa: 'سن شما چقدر است؟',
      ps: 'ستاسو عمر څومره دی؟'
    },
    subtitle: {
      en: 'We will personalize your AI challenge based on your answers',
      es: 'Personalizaremos tu desafío de IA basado en tus respuestas',
      ru: 'Мы персонализируем ваш AI-вызов на основе ваших ответов',
      de: 'Wir personalisieren Ihre AI-Herausforderung basierend auf Ihren Antworten',
      fr: 'Nous personnaliserons votre défi IA en fonction de vos réponses',
      fa: 'ما چالش AI شما را بر اساس پاسخ هایتان شخصی سازی می کنیم',
      ps: 'موږ به ستاسو د AI ننګونه ستاسو د ځوابونو پر بنسټ شخصي کړو'
    },
    options: [
      {
        text: {
          en: '18-24',
          es: '18-24',
          ru: '18-24',
          de: '18-24',
          fr: '18-24',
          fa: '18-24',
          ps: '18-24'
        },
        value: 6,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: '25-34',
          es: '25-34',
          ru: '25-34',
          de: '25-34',
          fr: '25-34',
          fa: '25-34',
          ps: '25-34'
        },
        value: 10,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '35-44',
          es: '35-44',
          ru: '35-44',
          de: '35-44',
          fr: '35-44',
          fa: '35-44',
          ps: '35-44'
        },
        value: 9,
        tracks: ['consulting', 'service']
      },
      {
        text: {
          en: '45+',
          es: '45+',
          ru: '45+',
          de: '45+',
          fr: '45+',
          fa: '45+',
          ps: '45+'
        },
        value: 7,
        tracks: ['consulting', 'ecommerce']
      }
    ]
  },
  {
    id: 3,
    category: 'main_goal',
    text: {
      en: 'What is your main goal?',
      es: '¿Cuál es tu objetivo principal?',
      ru: 'Какова ваша основная цель?',
      de: 'Was ist Ihr Hauptziel?',
      fr: 'Quel est votre objectif principal?',
      fa: 'هدف اصلی شما چیست؟',
      ps: 'ستاسو اصلي هدف څه دی؟'
    },
    options: [
      {
        text: {
          en: 'Create passive income while caring for kids',
          es: 'Crear ingresos pasivos mientras cuido a los niños',
          ru: 'Создать пассивный доход, заботясь о детях',
          de: 'Passives Einkommen schaffen, während ich mich um Kinder kümmere',
          fr: 'Créer un revenu passif en m\'occupant des enfants',
          fa: 'ایجاد درآمد غیرفعال در حین مراقبت از بچه ها',
          ps: 'د ماشومانو د پاملرنې په وخت کې غیرفعاله عاید رامینځته کول'
        },
        value: 10,
        tracks: ['digital_product', 'ecommerce']
      },
      {
        text: {
          en: 'Build flexible work-from-home income',
          es: 'Construir ingresos flexibles desde casa',
          ru: 'Создать гибкий доход, работая дома',
          de: 'Flexibles Einkommen von zu Hause aus aufbauen',
          fr: 'Construire un revenu flexible en travaillant à domicile',
          fa: 'ایجاد درآمد انعطاف پذیر در خانه',
          ps: 'د کور څخه د انعطاف وړ کار عاید جوړول'
        },
        value: 9,
        tracks: ['service', 'consulting']
      },
      {
        text: {
          en: 'Learn AI skills for family financial security',
          es: 'Aprender habilidades de IA para la seguridad financiera familiar',
          ru: 'Изучить навыки ИИ для финансовой безопасности семьи',
          de: 'AI-Fähigkeiten für die finanzielle Sicherheit der Familie erlernen',
          fr: 'Apprendre les compétences IA pour la sécurité financière familiale',
          fa: 'یادگیری مهارت های AI برای امنیت مالی خانواده',
          ps: 'د کورنۍ د مالي امنیت لپاره د AI مهارتونه زده کړه'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Supplement family income with AI tools',
          es: 'Complementar los ingresos familiares con herramientas de IA',
          ru: 'Дополнить семейный доход с помощью инструментов ИИ',
          de: 'Familieneinkommen mit AI-Tools ergänzen',
          fr: 'Compléter le revenu familial avec des outils IA',
          fa: 'تکمیل درآمد خانواده با ابزارهای AI',
          ps: 'د AI وسایلو سره د کورنۍ عاید بشپړول'
        },
        value: 7,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Future-proof my career as a parent',
          es: 'Asegurar mi carrera como padre/madre',
          ru: 'Обезопасить свою карьеру как родителя',
          de: 'Meine Karriere als Elternteil zukunftssicher machen',
          fr: 'Sécuriser ma carrière en tant que parent',
          fa: 'آینده نگری شغل من به عنوان والد',
          ps: 'د والدین په توګه زما د دندې راتلونکی خوندي کول'
        },
        value: 6,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 4,
    category: 'ai_overwhelm',
    text: {
      en: 'Do you feel overwhelmed with AI?',
      es: '¿Te sientes abrumado/a con la IA?',
      ru: 'Чувствуете ли вы себя подавленным ИИ?',
      de: 'Fühlen Sie sich von KI überfordert?',
      fr: 'Vous sentez-vous dépassé par l\'IA?',
      fa: 'آیا احساس غرق شدن در AI دارید؟',
      ps: 'ایا تاسو د AI سره ستړي احساس کوئ؟'
    },
    options: [
      {
        text: {
          en: 'Always',
          es: 'Siempre',
          ru: 'Всегда',
          de: 'Immer',
          fr: 'Toujours',
          fa: 'همیشه',
          ps: 'تل'
        },
        value: 3,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Often',
          es: 'A menudo',
          ru: 'Часто',
          de: 'Oft',
          fr: 'Souvent',
          fa: 'اغلب',
          ps: 'ډیری وختونه'
        },
        value: 5,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: 'Sometimes',
          es: 'A veces',
          ru: 'Иногда',
          de: 'Manchmal',
          fr: 'Parfois',
          fa: 'گاهی اوقات',
          ps: 'کله کله'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Not really',
          es: 'No realmente',
          ru: 'Не очень',
          de: 'Nicht wirklich',
          fr: 'Pas vraiment',
          fa: 'نه واقعا',
          ps: 'نه واقعیا'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      }
    ]
  },
  {
    id: 5,
    category: 'ai_comfort',
    text: {
      en: 'How comfortable are you with AI tools?',
      es: '¿Qué tan cómodo/a te sientes con las herramientas de IA?',
      ru: 'Насколько комфортно вы чувствуете себя с инструментами ИИ?',
      de: 'Wie wohl fühlen Sie sich mit KI-Tools?',
      fr: 'À quel point êtes-vous à l\'aise avec les outils IA?',
      fa: 'چقدر با ابزارهای AI راحت هستید؟',
      ps: 'تاسو د AI وسایلو سره څومره آرام یاست؟'
    },
    options: [
      {
        text: {
          en: 'I don\'t know anything',
          es: 'No sé nada',
          ru: 'Я ничего не знаю',
          de: 'Ich weiß nichts',
          fr: 'Je ne sais rien',
          fa: 'من چیزی نمی دانم',
          ps: 'زه هیڅ نه پوهیږم'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'I struggle a lot',
          es: 'Lucho mucho',
          ru: 'Мне очень трудно',
          de: 'Ich kämpfe sehr',
          fr: 'J\'ai beaucoup de mal',
          fa: 'خیلی مشکل دارم',
          ps: 'زه ډیر مبارزه کوم'
        },
        value: 6,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: 'I struggle sometimes',
          es: 'A veces tengo dificultades',
          ru: 'Иногда мне трудно',
          de: 'Manchmal kämpfe ich',
          fr: 'J\'ai parfois des difficultés',
          fa: 'گاهی مشکل دارم',
          ps: 'کله کله زه مبارزه کوم'
        },
        value: 8,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'I\'m comfortable',
          es: 'Me siento cómodo/a',
          ru: 'Мне комфортно',
          de: 'Ich bin wohl',
          fr: 'Je suis à l\'aise',
          fa: 'راحت هستم',
          ps: 'زه آرام یم'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      }
    ]
  },
  {
    id: 6,
    category: 'ai_fear',
    text: {
      en: 'Are you afraid to fall behind the AI trend?',
      es: '¿Tienes miedo de quedarte atrás en la tendencia de IA?',
      ru: 'Боитесь ли вы отстать от тренда ИИ?',
      de: 'Haben Sie Angst, den KI-Trend zu verpassen?',
      fr: 'Avez-vous peur de prendre du retard sur la tendance IA?',
      fa: 'آیا می ترسید از روند AI عقب بمانید؟',
      ps: 'ایا تاسو ویرېږئ چې د AI د رسۍ څخه شاته پاتې شئ؟'
    },
    options: [
      {
        text: {
          en: 'Always',
          es: 'Siempre',
          ru: 'Всегда',
          de: 'Immer',
          fr: 'Toujours',
          fa: 'همیشه',
          ps: 'تل'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Often',
          es: 'A menudo',
          ru: 'Часто',
          de: 'Oft',
          fr: 'Souvent',
          fa: 'اغلب',
          ps: 'ډیری وختونه'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Sometimes',
          es: 'A veces',
          ru: 'Иногда',
          de: 'Manchmal',
          fr: 'Parfois',
          fa: 'گاهی اوقات',
          ps: 'کله کله'
        },
        value: 6,
        tracks: ['ecommerce', 'service']
      },
      {
        text: {
          en: 'Not really',
          es: 'No realmente',
          ru: 'Не очень',
          de: 'Nicht wirklich',
          fr: 'Pas vraiment',
          fa: 'نه واقعا',
          ps: 'نه واقعیا'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 7,
    category: 'ai_difficulty',
    text: {
      en: 'Do you think that it\'s hard to learn AI?',
      es: '¿Crees que es difícil aprender IA?',
      ru: 'Считаете ли вы, что изучать ИИ сложно?',
      de: 'Glauben Sie, dass es schwer ist, KI zu lernen?',
      fr: 'Pensez-vous qu\'il est difficile d\'apprendre l\'IA?',
      fa: 'فکر می کنید یادگیری AI سخت است؟',
      ps: 'ایا تاسو فکر کوئ چې د AI زده کړه سخته ده؟'
    },
    options: [
      {
        text: {
          en: 'Yes, all the time',
          es: 'Sí, todo el tiempo',
          ru: 'Да, всегда',
          de: 'Ja, immer',
          fr: 'Oui, tout le temps',
          fa: 'بله، همیشه',
          ps: 'هو، تل'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Yes, but I still want to learn',
          es: 'Sí, pero aún quiero aprender',
          ru: 'Да, но я все равно хочу учиться',
          de: 'Ja, aber ich möchte trotzdem lernen',
          fr: 'Oui, mais je veux quand même apprendre',
          fa: 'بله، اما هنوز می خواهم یاد بگیرم',
          ps: 'هو، مګر زه لاهم غواړم زده کړم'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'No, it\'s not hard for me',
          es: 'No, no es difícil para mí',
          ru: 'Нет, для меня это не сложно',
          de: 'Nein, es ist nicht schwer für mich',
          fr: 'Non, ce n\'est pas difficile pour moi',
          fa: 'نه، برای من سخت نیست',
          ps: 'نه، دا زما لپاره سخت نه دی'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      }
    ]
  },
  {
    id: 8,
    category: 'programming_knowledge',
    text: {
      en: 'Do you think you need to know programming to learn AI?',
      es: '¿Crees que necesitas saber programación para aprender IA?',
      ru: 'Считаете ли вы, что нужно знать программирование, чтобы изучать ИИ?',
      de: 'Glauben Sie, dass Sie Programmierung kennen müssen, um KI zu lernen?',
      fr: 'Pensez-vous qu\'il faut connaître la programmation pour apprendre l\'IA?',
      fa: 'فکر می کنید برای یادگیری AI باید برنامه نویسی بلد باشید؟',
      ps: 'ایا تاسو فکر کوئ چې تاسو د AI د زده کړې لپاره پروګرامینګ پوهه ته اړتیا لری؟'
    },
    options: [
      {
        text: {
          en: 'Yes, of course',
          es: 'Sí, por supuesto',
          ru: 'Да, конечно',
          de: 'Ja, natürlich',
          fr: 'Oui, bien sûr',
          fa: 'بله، البته',
          ps: 'هو، بې له شکه'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Not really',
          es: 'No realmente',
          ru: 'Не очень',
          de: 'Nicht wirklich',
          fr: 'Pas vraiment',
          fa: 'نه واقعا',
          ps: 'نه واقعیا'
        },
        value: 9,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'I never thought about it',
          es: 'Nunca lo pensé',
          ru: 'Я никогда об этом не думал',
          de: 'Ich habe nie darüber nachgedacht',
          fr: 'Je n\'y ai jamais pensé',
          fa: 'هرگز به آن فکر نکردم',
          ps: 'زه هیکله د دې په اړه فکر نه کړی'
        },
        value: 7,
        tracks: ['ecommerce', 'service']
      }
    ]
  },
  {
    id: 9,
    category: 'ai_knowledge',
    text: {
      en: 'Rate your knowledge in AI tools',
      es: 'Califica tu conocimiento en herramientas de IA',
      ru: 'Оцените свои знания в области инструментов ИИ',
      de: 'Bewerten Sie Ihr Wissen über KI-Tools',
      fr: 'Évaluez vos connaissances des outils IA',
      fa: 'دانش خود را در ابزارهای AI ارزیابی کنید',
      ps: 'د AI وسایلو کې ستاسو پوهه وارزوئ'
    },
    options: [
      {
        text: {
          en: 'Expert - I have extensive knowledge',
          es: 'Experto - Tengo conocimiento extenso',
          ru: 'Эксперт - У меня обширные знания',
          de: 'Experte - Ich habe umfangreiches Wissen',
          fr: 'Expert - J\'ai des connaissances approfondies',
          fa: 'متخصص - دانش گسترده ای دارم',
          ps: 'ماهر - زه پراخه پوهه لرم'
        },
        value: 10,
        tracks: ['consulting', 'digital_product']
      },
      {
        text: {
          en: 'Proficient - I am skilled',
          es: 'Competente - Tengo habilidades',
          ru: 'Опытный - У меня есть навыки',
          de: 'Kompetent - Ich bin geschickt',
          fr: 'Compétent - Je suis qualifié',
          fa: 'ماهر - مهارت دارم',
          ps: 'ماهر - زه وړتیا لرم'
        },
        value: 9,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Intermediate - I have some knowledge',
          es: 'Intermedio - Tengo algo de conocimiento',
          ru: 'Средний - У меня есть некоторые знания',
          de: 'Mittelstufe - Ich habe einige Kenntnisse',
          fr: 'Intermédiaire - J\'ai quelques connaissances',
          fa: 'متوسط - مقداری دانش دارم',
          ps: 'منځنی - زه یو څه پوهه لرم'
        },
        value: 7,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: 'Novice - I have no experience',
          es: 'Novato - No tengo experiencia',
          ru: 'Новичок - У меня нет опыта',
          de: 'Anfänger - Ich habe keine Erfahrung',
          fr: 'Novice - Je n\'ai aucune expérience',
          fa: 'مبتدی - تجربه ای ندارم',
          ps: 'پیل کوونکی - زه هیڅ تجربه نه لرم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 10,
    category: 'chatgpt_usage',
    text: {
      en: 'Have you ever used ChatGPT?',
      es: '¿Has usado alguna vez ChatGPT?',
      ru: 'Использовали ли вы когда-нибудь ChatGPT?',
      de: 'Haben Sie jemals ChatGPT verwendet?',
      fr: 'Avez-vous déjà utilisé ChatGPT?',
      fa: 'آیا تا به حال از ChatGPT استفاده کرده اید؟',
      ps: 'ایا تاسو کله د ChatGPT څخه کار اخیستی دی؟'
    },
    options: [
      {
        text: {
          en: 'Yes, I use it daily',
          es: 'Sí, lo uso diariamente',
          ru: 'Да, я использую его ежедневно',
          de: 'Ja, ich benutze es täglich',
          fr: 'Oui, je l\'utilise quotidiennement',
          fa: 'بله، روزانه از آن استفاده می کنم',
          ps: 'هو، زه ورځني ورڅخه کار اخلم'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Yes, I used it few times',
          es: 'Sí, lo he usado algunas veces',
          ru: 'Да, я использовал его несколько раз',
          de: 'Ja, ich habe es ein paar Mal benutzt',
          fr: 'Oui, je l\'ai utilisé quelques fois',
          fa: 'بله، چند بار از آن استفاده کردم',
          ps: 'هو، زه یو څو ځلې ورڅخه کار اخیستی'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'I\'m afraid to use it',
          es: 'Tengo miedo de usarlo',
          ru: 'Я боюсь его использовать',
          de: 'Ich habe Angst, es zu benutzen',
          fr: 'J\'ai peur de l\'utiliser',
          fa: 'از استفاده آن می ترسم',
          ps: 'زه د هغه د کارولو څخه ویریږم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'I am not familiar with ChatGPT',
          es: 'No estoy familiarizado/a con ChatGPT',
          ru: 'Я не знаком с ChatGPT',
          de: 'Ich bin nicht mit ChatGPT vertraut',
          fr: 'Je ne connais pas ChatGPT',
          fa: 'با ChatGPT آشنا نیستم',
          ps: 'زه د ChatGPT سره اشنا نه یم'
        },
        value: 3,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 11,
    category: 'ai_tools_familiarity',
    text: {
      en: 'What other AI tools are you already familiar with?',
      es: '¿Con qué otras herramientas de IA ya estás familiarizado/a?',
      ru: 'С какими еще инструментами ИИ вы уже знакомы?',
      de: 'Mit welchen anderen KI-Tools sind Sie bereits vertraut?',
      fr: 'Avec quels autres outils IA êtes-vous déjà familier?',
      fa: 'با چه ابزارهای AI دیگری آشنا هستید؟',
      ps: 'تاسو د نورو کومو AI وسایلو سره اشنا یاست؟'
    },
    subtitle: {
      en: 'Choose all that apply',
      es: 'Elige todos los que correspondan',
      ru: 'Выберите все подходящие',
      de: 'Wählen Sie alle zutreffenden',
      fr: 'Choisissez tout ce qui s\'applique',
      fa: 'همه موارد مربوطه را انتخاب کنید',
      ps: 'ټول هغه غوره کړئ چې پلي کیږي'
    },
    options: [
      {
        text: {
          en: 'I\'m new to AI tools',
          es: 'Soy nuevo/a en herramientas de IA',
          ru: 'Я новичок в инструментах ИИ',
          de: 'Ich bin neu bei KI-Tools',
          fr: 'Je suis nouveau avec les outils IA',
          fa: 'تازه وارد ابزارهای AI هستم',
          ps: 'زه د AI وسایلو کې نوی یم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Canva (AI design features)',
          es: 'Canva (características de diseño IA)',
          ru: 'Canva (функции AI-дизайна)',
          de: 'Canva (KI-Design-Features)',
          fr: 'Canva (fonctionnalités de design IA)',
          fa: 'Canva (ویژگی های طراحی AI)',
          ps: 'Canva (د AI ډیزاین ځانګړتیاوې)'
        },
        value: 7,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Google Gemini',
          es: 'Google Gemini',
          ru: 'Google Gemini',
          de: 'Google Gemini',
          fr: 'Google Gemini',
          fa: 'Google Gemini',
          ps: 'Google Gemini'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Jasper (AI writing)',
          es: 'Jasper (escritura IA)',
          ru: 'Jasper (AI-письмо)',
          de: 'Jasper (KI-Schreiben)',
          fr: 'Jasper (écriture IA)',
          fa: 'Jasper (نوشتن AI)',
          ps: 'Jasper (د AI لیکل)'
        },
        value: 9,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'DALL-E (AI images)',
          es: 'DALL-E (imágenes IA)',
          ru: 'DALL-E (AI-изображения)',
          de: 'DALL-E (KI-Bilder)',
          fr: 'DALL-E (images IA)',
          fa: 'DALL-E (تصاویر AI)',
          ps: 'DALL-E (د AI انځورونه)'
        },
        value: 8,
        tracks: ['digital_product', 'ecommerce']
      }
    ]
  },
  {
    id: 12,
    category: 'ai_replacement_fear',
    text: {
      en: 'Are you afraid to be replaced by AI?',
      es: '¿Tienes miedo de ser reemplazado/a por la IA?',
      ru: 'Боитесь ли вы быть замененным ИИ?',
      de: 'Haben Sie Angst, von KI ersetzt zu werden?',
      fr: 'Avez-vous peur d\'être remplacé par l\'IA?',
      fa: 'آیا می ترسید توسط AI جایگزین شوید؟',
      ps: 'ایا تاسو ویرېږئ چې د AI لخوا بدل شئ؟'
    },
    options: [
      {
        text: {
          en: 'Yes, all the time',
          es: 'Sí, todo el tiempo',
          ru: 'Да, постоянно',
          de: 'Ja, die ganze Zeit',
          fr: 'Oui, tout le temps',
          fa: 'بله، همیشه',
          ps: 'هو، تل'
        },
        value: 8,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Yes, sometimes',
          es: 'Sí, a veces',
          ru: 'Да, иногда',
          de: 'Ja, manchmal',
          fr: 'Oui, parfois',
          fa: 'بله، گاهی اوقات',
          ps: 'هو، کله کله'
        },
        value: 7,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'No, because I know how to use it',
          es: 'No, porque sé cómo usarla',
          ru: 'Нет, потому что я знаю, как его использовать',
          de: 'Nein, weil ich weiß, wie man es benutzt',
          fr: 'Non, parce que je sais comment l\'utiliser',
          fa: 'نه، چون می دانم چگونه از آن استفاده کنم',
          ps: 'نه، ځکه چې زه پوهیږم چې دا څنګه وکاروم'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'I never thought about it',
          es: 'Nunca lo pensé',
          ru: 'Я никогда об этом не думал',
          de: 'Ich habe nie darüber nachgedacht',
          fr: 'Je n\'y ai jamais pensé',
          fa: 'هرگز به آن فکر نکردم',
          ps: 'زه هیکله د دې په اړه فکر نه کړی'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 13,
    category: 'income_goals',
    text: {
      en: 'What income range aligns with your current career goals?',
      es: '¿Qué rango de ingresos se alinea con tus objetivos profesionales actuales?',
      ru: 'Какой диапазон доходов соответствует вашим текущим карьерным целям?',
      de: 'Welcher Einkommensbereich passt zu Ihren aktuellen Karrierezielen?',
      fr: 'Quelle fourchette de revenus correspond à vos objectifs de carrière actuels?',
      fa: 'کدام محدوده درآمد با اهداف شغلی فعلی شما هماهنگ است؟',
      ps: 'د عاید کوم حد ستاسو د اوسني کیریر اهدافو سره سمون لري؟'
    },
    options: [
      {
        text: {
          en: '$500 - $2,000 per month (side income)',
          es: '$500 - $2,000 por mes (ingreso adicional)',
          ru: '$500 - $2,000 в месяц (дополнительный доход)',
          de: '$500 - $2,000 pro Monat (Nebeneinkommen)',
          fr: '$500 - $2,000 par mois (revenu d\'appoint)',
          fa: '$500 - $2,000 در ماه (درآمد جانبی)',
          ps: '$500 - $2,000 په میاشت کې (اړخیز عاید)'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '$2,000 - $5,000 per month (part-time income)',
          es: '$2,000 - $5,000 por mes (ingreso de medio tiempo)',
          ru: '$2,000 - $5,000 в месяц (доход на неполный рабочий день)',
          de: '$2,000 - $5,000 pro Monat (Teilzeiteinkommen)',
          fr: '$2,000 - $5,000 par mois (revenu à temps partiel)',
          fa: '$2,000 - $5,000 در ماه (درآمد پاره وقت)',
          ps: '$2,000 - $5,000 په میاشت کې (د برخې وخت عاید)'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '$5,000+ per month (replace full-time job)',
          es: '$5,000+ por mes (reemplazar trabajo de tiempo completo)',
          ru: '$5,000+ в месяц (заменить работу на полный рабочий день)',
          de: '$5,000+ pro Monat (Vollzeitjob ersetzen)',
          fr: '$5,000+ par mois (remplacer un emploi à temps plein)',
          fa: '$5,000+ در ماه (جایگزین شغل تمام وقت)',
          ps: '$5,000+ په میاشت کې (د بشپړ وخت دنده بدلول)'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  },
  {
    id: 14,
    category: 'ai_career_impact',
    text: {
      en: 'Have you considered how AI skills could impact your career?',
      es: '¿Has considerado cómo las habilidades de IA podrían impactar tu carrera?',
      ru: 'Рассматривали ли вы, как навыки ИИ могут повлиять на вашу карьеру?',
      de: 'Haben Sie darüber nachgedacht, wie KI-Fähigkeiten Ihre Karriere beeinflussen könnten?',
      fr: 'Avez-vous réfléchi à l\'impact que les compétences IA pourraient avoir sur votre carrière?',
      fa: 'آیا در نظر گرفته اید که مهارت های AI چگونه می تواند بر شغل شما تأثیر بگذارد؟',
      ps: 'ایا تاسو په دې فکر کړی چې د AI مهارتونه څنګه ستاسو په کیریر اغیزه کولی شي؟'
    },
    options: [
      {
        text: {
          en: 'Yes, I\'ve heard of it',
          es: 'Sí, he oído de ello',
          ru: 'Да, я слышал об этом',
          de: 'Ja, ich habe davon gehört',
          fr: 'Oui, j\'en ai entendu parler',
          fa: 'بله، در مورد آن شنیده ام',
          ps: 'هو، زه د دې په اړه اورېدلي'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'I\'m curious',
          es: 'Tengo curiosidad',
          ru: 'Мне любопытно',
          de: 'Ich bin neugierig',
          fr: 'Je suis curieux',
          fa: 'کنجکاو هستم',
          ps: 'زه لیوالتیا لرم'
        },
        value: 9,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'No, this is news to me',
          es: 'No, esto es nuevo para mí',
          ru: 'Нет, это новость для меня',
          de: 'Nein, das ist neu für mich',
          fr: 'Non, c\'est nouveau pour moi',
          fa: 'نه، این برای من خبر جدید است',
          ps: 'نه، دا زما لپاره نوي خبر دی'
        },
        value: 6,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 15,
    category: 'learning_comfort',
    text: {
      en: 'Are you comfortable with learning new skills or techniques?',
      es: '¿Te sientes cómodo/a aprendiendo nuevas habilidades o técnicas?',
      ru: 'Комфортно ли вам изучать новые навыки или техники?',
      de: 'Fühlen Sie sich wohl beim Erlernen neuer Fähigkeiten oder Techniken?',
      fr: 'Êtes-vous à l\'aise pour apprendre de nouvelles compétences ou techniques?',
      fa: 'آیا با یادگیری مهارت ها یا تکنیک های جدید راحت هستید؟',
      ps: 'ایا تاسو د نوو مهارتونو یا تخنیکونو د زده کړې سره آرام یاست؟'
    },
    options: [
      {
        text: {
          en: 'Yes',
          es: 'Sí',
          ru: 'Да',
          de: 'Ja',
          fr: 'Oui',
          fa: 'بله',
          ps: 'هو'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'No',
          es: 'No',
          ru: 'Нет',
          de: 'Nein',
          fr: 'Non',
          fa: 'خیر',
          ps: 'نه'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: 'Hm, not sure',
          es: 'Hm, no estoy seguro/a',
          ru: 'Хм, не уверен',
          de: 'Hm, nicht sicher',
          fr: 'Hm, pas sûr',
          fa: 'هوم، مطمئن نیستم',
          ps: 'هوم، ډاډه نه یم'
        },
        value: 6,
        tracks: ['ecommerce', 'service']
      }
    ]
  },
  {
    id: 16,
    category: 'interest_fields',
    text: {
      en: 'What other fields would you personally like to try yourself in?',
      es: '¿En qué otros campos te gustaría probarte personalmente?',
      ru: 'В каких других областях вы хотели бы попробовать себя лично?',
      de: 'In welchen anderen Bereichen möchten Sie sich persönlich versuchen?',
      fr: 'Dans quels autres domaines aimeriez-vous vous essayer personnellement?',
      fa: 'در چه زمینه های دیگری دوست دارید خود را امتحان کنید؟',
      ps: 'په کومو نورو برخو کې تاسو غواړئ ځان وازمویاست؟'
    },
    subtitle: {
      en: 'Choose all that apply',
      es: 'Elige todos los que correspondan',
      ru: 'Выберите все подходящие',
      de: 'Wählen Sie alle zutreffenden',
      fr: 'Choisissez tout ce qui s\'applique',
      fa: 'همه موارد مربوطه را انتخاب کنید',
      ps: 'ټول هغه غوره کړئ چې پلي کیږي'
    },
    options: [
      {
        text: {
          en: 'Content Creation (blogs, social media)',
          es: 'Creación de Contenido (blogs, redes sociales)',
          ru: 'Создание контента (блоги, социальные сети)',
          de: 'Content-Erstellung (Blogs, soziale Medien)',
          fr: 'Création de contenu (blogs, réseaux sociaux)',
          fa: 'تولید محتوا (وبلاگ، شبکه های اجتماعی)',
          ps: 'د منځپانګې جوړول (بلاګونه، ټولنیز رسنۍ)'
        },
        value: 9,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Online Tutoring & Course Creation',
          es: 'Tutoría en Línea y Creación de Cursos',
          ru: 'Онлайн-репетitorство и создание курсов',
          de: 'Online-Nachhilfe und Kurserstellung',
          fr: 'Tutorat en ligne et création de cours',
          fa: 'تدریس آنلاین و ایجاد دوره',
          ps: 'آنلاین ښوونه او د کورسونو جوړول'
        },
        value: 8,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'E-commerce & Online Selling',
          es: 'E-commerce y Venta en Línea',
          ru: 'Электронная коммерция и онлайн-продажи',
          de: 'E-Commerce und Online-Verkauf',
          fr: 'E-commerce et vente en ligne',
          fa: 'تجارت الکترونیک و فروش آنلاین',
          ps: 'بریښنايي سوداګرۍ او آنلاین پلورنه'
        },
        value: 10,
        tracks: ['ecommerce']
      },
      {
        text: {
          en: 'Virtual Assistant Services',
          es: 'Servicios de Asistente Virtual',
          ru: 'Услуги виртуального помощника',
          de: 'Virtuelle Assistenten-Services',
          fr: 'Services d\'assistant virtuel',
          fa: 'خدمات دستیار مجازی',
          ps: 'د مجازي مرستندوی خدمات'
        },
        value: 8,
        tracks: ['service']
      },
      {
        text: {
          en: 'Consulting & Coaching',
          es: 'Consultoría y Coaching',
          ru: 'Консультирование и коучинг',
          de: 'Beratung und Coaching',
          fr: 'Conseil et coaching',
          fa: 'مشاوره و کوچینگ',
          ps: 'مشورې او روزنه'
        },
        value: 9,
        tracks: ['consulting']
      }
    ]
  },
  {
    id: 17,
    category: 'ai_readiness',
    text: {
      en: 'Rate your readiness to master AI',
      es: 'Califica tu preparación para dominar la IA',
      ru: 'Оцените вашу готовность освоить ИИ',
      de: 'Bewerten Sie Ihre Bereitschaft, KI zu beherrschen',
      fr: 'Évaluez votre préparation à maîtriser l\'IA',
      fa: 'آمادگی خود را برای تسلط بر AI ارزیابی کنید',
      ps: 'د AI د زده کړې لپاره ستاسو چمتووالی وارزوئ'
    },
    options: [
      {
        text: {
          en: 'All set',
          es: 'Totalmente listo/a',
          ru: 'Полностью готов',
          de: 'Bereit',
          fr: 'Prêt',
          fa: 'کاملا آماده',
          ps: 'بشپړ چمتو'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Ready',
          es: 'Listo/a',
          ru: 'Готов',
          de: 'Bereit',
          fr: 'Prêt',
          fa: 'آماده',
          ps: 'چمتو'
        },
        value: 9,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Somewhat Ready',
          es: 'Un poco listo/a',
          ru: 'Частично готов',
          de: 'Etwas bereit',
          fr: 'Quelque peu prêt',
          fa: 'تا حدودی آماده',
          ps: 'یو څه چمتو'
        },
        value: 7,
        tracks: ['service', 'ecommerce']
      },
      {
        text: {
          en: 'Not Ready',
          es: 'No listo/a',
          ru: 'Не готов',
          de: 'Nicht bereit',
          fr: 'Pas prêt',
          fa: 'آماده نیستم',
          ps: 'چمتو نه یم'
        },
        value: 5,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 18,
    category: 'focus_ability',
    text: {
      en: 'Do you find it easy to maintain your focus?',
      es: '¿Te resulta fácil mantener tu concentración?',
      ru: 'Легко ли вам сохранять концентрацию?',
      de: 'Fällt es Ihnen leicht, Ihre Konzentration aufrechtzuerhalten?',
      fr: 'Trouvez-vous facile de maintenir votre concentration?',
      fa: 'آیا حفظ تمرکز برای شما آسان است؟',
      ps: 'ایا تاسو ته د خپل تمرکز ساتل اسانه دي؟'
    },
    options: [
      {
        text: {
          en: 'Yes, I can easily stay focused',
          es: 'Sí, puedo mantenerme concentrado/a fácilmente',
          ru: 'Да, я легко могу оставаться сосредоточенным',
          de: 'Ja, ich kann leicht konzentriert bleiben',
          fr: 'Oui, je peux facilement rester concentré',
          fa: 'بله، به راحتی می توانم متمرکز باشم',
          ps: 'هو، زه کولی شم په اسانۍ سره متمرکز پاتې شم'
        },
        value: 10,
        tracks: ['digital_product', 'consulting']
      },
      {
        text: {
          en: 'Mostly, but I sometimes get distracted',
          es: 'Mayormente, pero a veces me distraigo',
          ru: 'В основном, но иногда отвлекаюсь',
          de: 'Meistens, aber manchmal werde ich abgelenkt',
          fr: 'Surtout, mais je suis parfois distrait',
          fa: 'بیشتر اوقات، اما گاهی حواسم پرت می شود',
          ps: 'ډیری، مګر کله کله زه ګډوډیږم'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'I often struggle',
          es: 'A menudo lucho',
          ru: 'Я часто борюсь',
          de: 'Ich kämpfe oft',
          fr: 'Je lutte souvent',
          fa: 'اغلب مشکل دارم',
          ps: 'زه ډیری وختونه مبارزه کوم'
        },
        value: 6,
        tracks: ['ecommerce', 'service']
      },
      {
        text: {
          en: 'No, I frequently procrastinate',
          es: 'No, frecuentemente postergo',
          ru: 'Нет, я часто откладываю',
          de: 'Nein, ich prokrastiniere häufig',
          fr: 'Non, je procrastine souvent',
          fa: 'نه، مرتب به تعویق می اندازم',
          ps: 'نه، زه ډیری وختونه ځنډوم'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      }
    ]
  },
  {
    id: 19,
    category: 'special_achievement',
    text: {
      en: 'Is there something special you wish to achieve?',
      es: '¿Hay algo especial que desees lograr?',
      ru: 'Есть ли что-то особенное, чего вы хотите достичь?',
      de: 'Gibt es etwas Besonderes, das Sie erreichen möchten?',
      fr: 'Y a-t-il quelque chose de spécial que vous souhaitez accomplir?',
      fa: 'آیا چیز خاصی هست که می خواهید به آن برسید؟',
      ps: 'ایا کوم ځانګړی شی شته چې تاسو یې ترلاسه کول غواړئ؟'
    },
    subtitle: {
      en: 'You\'re more likely to reach your goal if you have something important to aim for',
      es: 'Es más probable que alcances tu objetivo si tienes algo importante a lo que apuntar',
      ru: 'Вы с большей вероятностью достигнете своей цели, если у вас есть что-то важное, к чему стремиться',
      de: 'Sie erreichen Ihr Ziel eher, wenn Sie etwas Wichtiges haben, worauf Sie hinarbeiten können',
      fr: 'Vous êtes plus susceptible d\'atteindre votre objectif si vous avez quelque chose d\'important à viser',
      fa: 'اگر چیز مهمی داشته باشید که برای آن تلاش کنید، احتمال رسیدن به هدفتان بیشتر است',
      ps: 'تاسو خپل هدف ته د رسیدو احتمال ډیر دی که که تاسو د هدف لپاره مهم څه ولرئ'
    },
    options: [
      {
        text: {
          en: 'Support my children\'s education',
          es: 'Apoyar la educación de mis hijos',
          ru: 'Поддержать образование моих детей',
          de: 'Die Bildung meiner Kinder unterstützen',
          fr: 'Soutenir l\'éducation de mes enfants',
          fa: 'حمایت از تحصیل فرزندانم',
          ps: 'د خپلو ماشومانو د زده کړې ملاتړ'
        },
        value: 10,
        tracks: ['digital_product', 'service']
      },
      {
        text: {
          en: 'Create financial security for my family',
          es: 'Crear seguridad financiera para mi familia',
          ru: 'Создать финансовую безопасность для моей семьи',
          de: 'Finanzielle Sicherheit für meine Familie schaffen',
          fr: 'Créer la sécurité financière pour ma famille',
          fa: 'ایجاد امنیت مالی برای خانواده ام',
          ps: 'د خپلې کورنۍ لپاره مالي امنیت رامینځته کول'
        },
        value: 9,
        tracks: ['consulting', 'ecommerce']
      },
      {
        text: {
          en: 'Build a flexible income while raising kids',
          es: 'Construir ingresos flexibles mientras crío hijos',
          ru: 'Создать гибкий доход, воспитывая детей',
          de: 'Flexibles Einkommen beim Kindererziehen aufbauen',
          fr: 'Construire un revenu flexible en élevant des enfants',
          fa: 'ایجاد درآمد انعطاف پذیر در حین پرورش بچه ها',
          ps: 'د ماشومانو د روزنې په وخت کې د انعطاف وړ عاید جوړول'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: 'Achieve work-life balance as a parent',
          es: 'Lograr equilibrio trabajo-vida como padre/madre',
          ru: 'Достичь баланса между работой и жизнью как родитель',
          de: 'Work-Life-Balance als Elternteil erreichen',
          fr: 'Atteindre l\'équilibre travail-vie en tant que parent',
          fa: 'دستیابی به تعادل کار و زندگی به عنوان والد',
          ps: 'د والدین په توګه د کار او ژوند تعادل ته رسیدل'
        },
        value: 7,
        tracks: ['ecommerce', 'service']
      },
      {
        text: {
          en: 'Other personal family goal',
          es: 'Otro objetivo personal familiar',
          ru: 'Другая личная семейная цель',
          de: 'Anderes persönliches Familienziel',
          fr: 'Autre objectif personnel familial',
          fa: 'هدف شخصی خانوادگی دیگر',
          ps: 'بل شخصي کورنی هدف'
        },
        value: 6,
        tracks: ['consulting', 'digital_product']
      }
    ]
  },
  {
    id: 20,
    category: 'time_commitment',
    text: {
      en: 'How much time are you ready to spend to achieve your goal?',
      es: '¿Cuánto tiempo estás dispuesto/a a dedicar para lograr tu objetivo?',
      ru: 'Сколько времени вы готовы потратить для достижения своей цели?',
      de: 'Wie viel Zeit sind Sie bereit aufzuwenden, um Ihr Ziel zu erreichen?',
      fr: 'Combien de temps êtes-vous prêt à consacrer pour atteindre votre objectif?',
      fa: 'چقدر زمان آماده اید برای رسیدن به هدفتان صرف کنید؟',
      ps: 'تاسو د خپل هدف ترلاسه کولو لپاره د څومره وخت لګولو ته چمتو یاست؟'
    },
    options: [
      {
        text: {
          en: '5 min/day',
          es: '5 min/día',
          ru: '5 мин/день',
          de: '5 Min/Tag',
          fr: '5 min/jour',
          fa: '5 دقیقه در روز',
          ps: '5 دقیقې/ورځ'
        },
        value: 4,
        tracks: ['ecommerce', 'consulting']
      },
      {
        text: {
          en: '10 min/day',
          es: '10 min/día',
          ru: '10 мин/день',
          de: '10 Min/Tag',
          fr: '10 min/jour',
          fa: '10 دقیقه در روز',
          ps: '10 دقیقې/ورځ'
        },
        value: 6,
        tracks: ['ecommerce', 'digital_product']
      },
      {
        text: {
          en: '15 min/day',
          es: '15 min/día',
          ru: '15 мин/день',
          de: '15 Min/Tag',
          fr: '15 min/jour',
          fa: '15 دقیقه در روز',
          ps: '15 دقیقې/ورځ'
        },
        value: 8,
        tracks: ['service', 'digital_product']
      },
      {
        text: {
          en: '20 min/day',
          es: '20 min/día',
          ru: '20 мин/день',
          de: '20 Min/Tag',
          fr: '20 min/jour',
          fa: '20 دقیقه در روز',
          ps: '20 دقیقې/ورځ'
        },
        value: 10,
        tracks: ['consulting', 'service']
      }
    ]
  }
];

// Parent-Focused AI Track Descriptions
export const coursivParentTrackDescriptions = {
  digital_product: {
    en: 'AI Content Creator: Master AI tools to create digital products, courses, and content that generate passive income while you care for your family. Perfect for parents who want flexible, scalable income streams.',
    es: 'Creador de Contenido AI: Domina las herramientas de IA para crear productos digitales, cursos y contenido que generen ingresos pasivos mientras cuidas a tu familia.',
    ru: 'AI Создатель Контента: Освойте AI-инструменты для создания цифровых продуктов, курсов и контента, генерирующих пассивный доход, пока вы заботитесь о семье.',
    de: 'AI Content Creator: Beherrschen Sie KI-Tools, um digitale Produkte, Kurse und Inhalte zu erstellen, die passives Einkommen generieren, während Sie sich um Ihre Familie kümmern.',
    fr: 'Créateur de Contenu IA: Maîtrisez les outils IA pour créer des produits numériques, cours et contenu générant des revenus passifs pendant que vous vous occupez de votre famille.',
    fa: 'سازنده محتوای AI: ابزارهای AI را برای ایجاد محصولات دیجیتال، دوره ها و محتوایی که درآمد غیرفعال تولید می کند در حین مراقبت از خانواده تسلط پیدا کنید.',
    ps: 'د AI د منځپانګې جوړونکی: د AI وسایل زده کړئ ترڅو ډیجیټل محصولات، کورسونه او منځپانګه جوړ کړئ چې د کورنۍ د پاملرنې په وخت کې غیرفعاله عاید تولیدوي.'
  },
  service: {
    en: 'AI Virtual Assistant: Provide AI-powered services to busy professionals and businesses. Work flexible hours from home while building reliable income as an AI-skilled virtual assistant.',
    es: 'Asistente Virtual AI: Proporciona servicios potenciados por IA a profesionales ocupados y empresas. Trabaja horarios flexibles desde casa mientras construyes ingresos confiables.',
    ru: 'AI Виртуальный Помощник: Предоставляйте AI-услуги занятым профессионалам и бизнесу. Работайте в гибком графике дома, строя надежный доход как AI-ассистент.',
    de: 'AI Virtueller Assistent: Bieten Sie KI-gestützte Services für beschäftigte Profis und Unternehmen. Arbeiten Sie flexible Stunden von zu Hause aus.',
    fr: 'Assistant Virtuel IA: Fournissez des services alimentés par l\'IA aux professionnels occupés et aux entreprises. Travaillez à horaires flexibles depuis chez vous.',
    fa: 'دستیار مجازی AI: خدمات مبتنی بر AI را به متخصصان مشغول و کسب و کارها ارائه دهید. با ساعات کاری انعطاف پذیر از خانه کار کنید.',
    ps: 'د AI مجازي مرستندوی: بوخت مسلکي کسانو او سوداګریو ته د AI پیاوړي خدمات وړاندې کړئ. د کور څخه د انعطاف وړ ساعتونو کار وکړئ.'
  },
  ecommerce: {
    en: 'AI E-commerce Parent: Use AI to identify profitable products, create automated stores, and manage online sales. Build a family business that works while you focus on parenting.',
    es: 'Padre E-commerce AI: Usa IA para identificar productos rentables, crear tiendas automatizadas y gestionar ventas en línea. Construye un negocio familiar.',
    ru: 'AI E-commerce Родитель: Используйте ИИ для выявления прибыльных товаров, создания автоматизированных магазинов и управления онлайн-продажами.',
    de: 'AI E-Commerce Elternteil: Nutzen Sie KI, um profitable Produkte zu identifizieren, automatisierte Shops zu erstellen und Online-Verkäufe zu verwalten.',
    fr: 'Parent E-commerce IA: Utilisez l\'IA pour identifier des produits rentables, créer des boutiques automatisées et gérer les ventes en ligne.',
    fa: 'والد تجارت الکترونیک AI: از AI برای شناسایی محصولات سودآور، ایجاد فروشگاه های خودکار و مدیریت فروش آنلاین استفاده کنید.',
    ps: 'د AI بریښنايي سوداګرۍ مور یا پلار: د ګټور محصولاتو د پیژندلو، اتوماتیک پلورنځیو جوړولو او آنلاین پلورنې اداره کولو لپاره AI وکاروئ.'
  },
  consulting: {
    en: 'Family AI Consultant: Help other parents and small businesses integrate AI into their lives and work. Share your knowledge while building a respected consulting practice from home.',
    es: 'Consultor AI Familiar: Ayuda a otros padres y pequeñas empresas a integrar la IA en sus vidas y trabajo. Comparte tu conocimiento mientras construyes una práctica consultiva respetada.',
    ru: 'Семейный AI Консультант: Помогайте другим родителям и малому бизнесу интегрировать ИИ в их жизнь и работу. Делитесь знаниями, строя уважаемую консалтинговую практику.',
    de: 'Familien-AI-Berater: Helfen Sie anderen Eltern und kleinen Unternehmen, KI in ihr Leben und ihre Arbeit zu integrieren.',
    fr: 'Consultant IA Familial: Aidez d\'autres parents et petites entreprises à intégrer l\'IA dans leur vie et travail.',
    fa: 'مشاور خانوادگی AI: به والدین دیگر و کسب و کارهای کوچک کمک کنید تا AI را در زندگی و کار خود ادغام کنند.',
    ps: 'د کورنۍ AI مشاور: نورو مور او پلرونو او کشرو سوداګریو سره مرسته وکړئ چې AI په خپل ژوند او کار کې شامل کړي.'
  }
};