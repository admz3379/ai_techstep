// Simple English-only Quiz Data for AI TechStep Challenge
import type { QuizQuestion, TrackDescriptions } from './types'

export const aiTechStepQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'ai_experience',
    text: 'HAVE YOU EVER USED AI?',
    options: [
      { text: 'YES', value: 10, tracks: ['digital_product', 'service'] },
      { text: 'NO', value: 5, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 2,
    category: 'age',
    text: 'What is your age?',
    subtitle: 'We will personalize your AI challenge based on your answers',
    options: [
      { text: '18-24', value: 6, tracks: ['digital_product', 'ecommerce'] },
      { text: '25-34', value: 10, tracks: ['service', 'digital_product'] },
      { text: '35-44', value: 9, tracks: ['consulting', 'service'] },
      { text: '45+', value: 7, tracks: ['consulting', 'ecommerce'] }
    ]
  },
  {
    id: 3,
    category: 'main_goal',
    text: 'Picture this: It\'s 30 days from today. What did you just launch?',
    subtitle: '💫 Choose your adventure—I\'ll show you exactly how to build it',
    options: [
      { text: '🚀 "The Passive Income Machine" - A digital product that sells while I sleep', value: 10, tracks: ['digital_product', 'ecommerce'] },
      { text: '🎯 "The AI Service Pro" - High-value services clients love to pay for', value: 9, tracks: ['service', 'consulting'] },
      { text: '⏰ "The Family-First Business" - Income that fits around my kids\' schedule', value: 8, tracks: ['digital_product', 'service'] },
      { text: '💰 "The Multi-Stream Creator" - Several AI income sources running simultaneously', value: 7, tracks: ['ecommerce', 'consulting'] },
      { text: '👩‍🏫 "The Parent Coach" - Helping other families master AI (and getting paid well for it)', value: 6, tracks: ['consulting', 'service'] }
    ]
  },
  {
    id: 4,
    category: 'ai_overwhelm',
    text: 'When you hear "AI," what\'s your first reaction?',
    subtitle: '🧠 Honest answer—there\'s a perfect path for every starting point',
    options: [
      { text: '😵‍💫 "My brain hurts" - It all feels like rocket science to me', value: 3, tracks: ['ecommerce', 'consulting'] },
      { text: '😰 "Information overload" - So many tools, where do I even start?', value: 5, tracks: ['service', 'ecommerce'] },
      { text: '🤔 "Cautiously curious" - Interested but need someone to hold my hand', value: 8, tracks: ['digital_product', 'service'] },
      { text: '😎 "Bring it on" - I love learning new tech and tools', value: 10, tracks: ['digital_product', 'consulting'] }
    ]
  },
  {
    id: 5,
    category: 'ai_comfort',
    text: 'How comfortable are you with AI tools?',
    options: [
      { text: "I don't know anything", value: 4, tracks: ['ecommerce', 'consulting'] },
      { text: 'I struggle a lot', value: 6, tracks: ['service', 'ecommerce'] },
      { text: 'I struggle sometimes', value: 8, tracks: ['digital_product', 'service'] },
      { text: "I'm comfortable", value: 10, tracks: ['digital_product', 'consulting'] }
    ]
  },
  {
    id: 6,
    category: 'ai_fear',
    text: 'Are you afraid to fall behind the AI trend?',
    options: [
      { text: 'Always', value: 10, tracks: ['digital_product', 'consulting'] },
      { text: 'Often', value: 8, tracks: ['service', 'digital_product'] },
      { text: 'Sometimes', value: 6, tracks: ['ecommerce', 'service'] },
      { text: 'Not really', value: 4, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 7,
    category: 'ai_difficulty',
    text: "Do you think that it's hard to learn AI?",
    options: [
      { text: 'Yes, all the time', value: 4, tracks: ['ecommerce', 'consulting'] },
      { text: 'Yes, but I still want to learn', value: 8, tracks: ['service', 'digital_product'] },
      { text: "No, it's not hard for me", value: 10, tracks: ['digital_product', 'consulting'] }
    ]
  },
  {
    id: 8,
    category: 'programming_knowledge',
    text: 'Programming and AI: What\'s the connection in your mind?',
    subtitle: '💻 Let\'s bust some myths right here',
    options: [
      { text: '🤓 "Total prerequisite" - You definitely need to code to use AI properly', value: 5, tracks: ['ecommerce', 'consulting'] },
      { text: '🚫 "Not necessary" - AI tools work fine without coding skills', value: 9, tracks: ['service', 'digital_product'] },
      { text: '🤷 "Never considered it" - Honestly, I haven\'t thought about this connection', value: 7, tracks: ['ecommerce', 'service'] }
    ]
  },
  {
    id: 9,
    category: 'ai_knowledge',
    text: 'If AI knowledge was a video game, what level are you?',
    subtitle: '🎮 Be honest—we\'ll meet you exactly where you are',
    options: [
      { text: '🏆 "Level 99 Boss" - I could teach others about AI tools', value: 10, tracks: ['consulting', 'digital_product'] },
      { text: '⚡ "Advanced Player" - I know my way around most AI tools', value: 9, tracks: ['service', 'digital_product'] },
      { text: '🎯 "Getting There" - I\'ve figured out some basics', value: 7, tracks: ['service', 'ecommerce'] },
      { text: '🆕 "Newbie Zone" - I just picked up the controller', value: 5, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 10,
    category: 'chatgpt_usage',
    text: 'ChatGPT: What\'s your relationship status?',
    subtitle: '🤖 The world\'s most famous AI—have you two met?',
    options: [
      { text: '💕 "We\'re married" - I use it every single day', value: 10, tracks: ['digital_product', 'service'] },
      { text: '🤝 "We\'re dating" - I\'ve used it a few times, pretty cool', value: 8, tracks: ['service', 'digital_product'] },
      { text: '😰 "It\'s complicated" - I\'m scared it\'ll judge my questions', value: 5, tracks: ['ecommerce', 'consulting'] },
      { text: '🤷 "Never heard of them" - ChatGPT? Is that a person?', value: 3, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 11,
    category: 'ai_tools_familiarity',
    text: 'Quick AI tool check—which ones have you actually used?',
    subtitle: '🛠️ Just pick the one that best describes your current toolkit',
    options: [
      { text: '🆕 "Total beginner" - AI tools? What AI tools?', value: 5, tracks: ['ecommerce', 'consulting'] },
      { text: '🎨 "Design dabbler" - I\'ve played with Canva\'s AI features', value: 7, tracks: ['digital_product', 'service'] },
      { text: '🔍 "Search savvy" - Google Gemini is my research buddy', value: 8, tracks: ['service', 'digital_product'] },
      { text: '💼 "Office optimizer" - Microsoft Copilot helps with work stuff', value: 9, tracks: ['consulting', 'service'] },
      { text: '🤖 "AI explorer" - I\'ve tried Claude, ChatGPT, and more', value: 9, tracks: ['digital_product', 'consulting'] }
    ]
  },
  {
    id: 12,
    category: 'time_availability',
    text: 'Real talk: When can you carve out time to build your launch?',
    subtitle: '⏰ Remember: Small consistent action beats weekend warriors every time',
    options: [
      { text: '☕ "Nap time ninja" - 15-30 minutes when the house is quiet', value: 8, tracks: ['digital_product', 'ecommerce'] },
      { text: '🌅 "Early bird entrepreneur" - 30-60 min before everyone wakes up', value: 10, tracks: ['service', 'digital_product'] },
      { text: '🏫 "School hours hustler" - 1-2 hours during school time', value: 9, tracks: ['consulting', 'service'] },
      { text: '😅 "Weekend warrior" - Stealing time whenever I can find it', value: 6, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 13,
    category: 'income_goal',
    text: 'When you hit your first $1K month (and you will), what happens next?',
    subtitle: '🎯 This moment changes everything—what does it unlock for you?',
    options: [
      { text: '🎉 "I KNEW I could do this!" - The proof I needed to go all-in', value: 10, tracks: ['digital_product', 'service'] },
      { text: '🏡 "More mommy/daddy time" - Financial freedom = family freedom', value: 9, tracks: ['service', 'digital_product'] },
      { text: '💳 "Bills without stress" - No more money anxiety keeping me up at night', value: 8, tracks: ['ecommerce', 'consulting'] },
      { text: '🌟 "Time to dream bigger" - This is just the beginning of what\'s possible', value: 7, tracks: ['consulting', 'digital_product'] }
    ]
  },
  {
    id: 14,
    category: 'learning_preference',
    text: 'What\'s your ideal "learning while parenting" setup?',
    subtitle: '🎓 How do you absorb new skills without losing your sanity?',
    options: [
      { text: '📱 "Bite-sized videos" - 5-10 min tutorials I can pause when chaos erupts', value: 9, tracks: ['digital_product', 'ecommerce'] },
      { text: '📖 "Step-by-step guides" - Written instructions I can reference anytime', value: 8, tracks: ['service', 'consulting'] },
      { text: '🎮 "Learn by doing" - Just give me the tools and let me figure it out', value: 10, tracks: ['digital_product', 'service'] },
      { text: '👥 "Live support" - Real-time help when I\'m stuck', value: 7, tracks: ['consulting', 'service'] }
    ]
  },
  {
    id: 15,
    category: 'biggest_challenge',
    text: 'What\'s your biggest "parent entrepreneur" struggle right now?',
    subtitle: '🎯 Let\'s solve this together—what\'s holding you back most?',
    options: [
      { text: '⏰ "Time thief" - Between diapers and dishes, where\'s MY time?', value: 9, tracks: ['digital_product', 'ecommerce'] },
      { text: '🧠 "Squirrel brain" - Kids make it impossible to focus for more than 5 minutes', value: 8, tracks: ['service', 'digital_product'] },
      { text: '📱 "Tech overwhelm" - Technology moves so fast, I can\'t keep up', value: 7, tracks: ['consulting', 'service'] },
      { text: '🤷‍♀️ "Imposter syndrome" - "Who am I to think I can do this?"', value: 6, tracks: ['ecommerce', 'consulting'] }
    ]
  },
  {
    id: 16,
    category: 'motivation_level',
    text: 'On a scale of "maybe someday" to "let\'s freaking GO!"—where are you?',
    subtitle: '🔥 Your energy level determines your launch timeline',
    options: [
      { text: '🔥 "FIRE ME UP!" - I\'m ready to start building TODAY', value: 10, tracks: ['digital_product', 'service'] },
      { text: '⚡ "Let\'s do this!" - Excited and ready to dive in', value: 9, tracks: ['service', 'digital_product'] },
      { text: '👍 "I\'m game" - Willing to put in the work', value: 7, tracks: ['ecommerce', 'consulting'] },
      { text: '🤷 "Still exploring" - Need to see more before committing', value: 5, tracks: ['consulting', 'ecommerce'] }
    ]
  },
  {
    id: 17,
    category: 'family_support',
    text: 'When you talk about launching your AI business, your family says...',
    subtitle: '👨‍👩‍👧‍👦 Family dynamics matter—what\'s your support system like?',
    options: [
      { text: '🎉 "Go for it!" - They\'re my biggest cheerleaders', value: 10, tracks: ['digital_product', 'consulting'] },
      { text: '👍 "We believe in you" - Supportive and understanding', value: 8, tracks: ['service', 'digital_product'] },
      { text: '🤷 "Whatever makes you happy" - They don\'t really get it but they don\'t oppose it', value: 6, tracks: ['ecommerce', 'service'] },
      { text: '😬 "Prove it first" - I need to show results before they\'ll believe', value: 7, tracks: ['consulting', 'ecommerce'] }
    ]
  },
  {
    id: 18,
    category: 'tech_comfort',
    text: 'When faced with new technology, you\'re typically the person who...',
    subtitle: '💻 No judgment here—just need to know your tech personality',
    options: [
      { text: '🚀 "Early adopter" - Give me the latest gadget and I\'ll figure it out', value: 10, tracks: ['digital_product', 'service'] },
      { text: '🎯 "Quick learner" - I need 10 minutes and I\'ve got it mastered', value: 9, tracks: ['service', 'digital_product'] },
      { text: '🤝 "Guided explorer" - Just show me once and I can replicate it', value: 7, tracks: ['ecommerce', 'consulting'] },
      { text: '😅 "Reluctant user" - Technology makes me want to hide under a blanket', value: 5, tracks: ['consulting', 'ecommerce'] }
    ]
  },
  {
    id: 19,
    category: 'success_definition',
    text: 'Fast-forward 6 months: What victory are you celebrating?',
    subtitle: '🏆 Paint the picture—what does winning look like for YOU?',
    options: [
      { text: '💰 "The consistent earner" - Reliable monthly income I can count on', value: 10, tracks: ['digital_product', 'service'] },
      { text: '🎯 "The multi-stream master" - Several AI income sources running smoothly', value: 9, tracks: ['service', 'consulting'] },
      { text: '🦸 "The confident creator" - AI is now my superpower, not my struggle', value: 8, tracks: ['digital_product', 'ecommerce'] },
      { text: '👩‍🏫 "The parent mentor" - Other families are paying me to teach them AI', value: 7, tracks: ['consulting', 'service'] }
    ]
  },
  {
    id: 20,
    category: 'commitment_level',
    text: '🎯 Final question: How ready are you to become a Creator?',
    subtitle: '"I already started. I\'ve already won. I trust this." - Which energy matches yours?',
    options: [
      { text: '🚀 "LET\'S GO!" - I\'m launching something in 30 days, period.', value: 10, tracks: ['digital_product', 'service'] },
      { text: '💪 "I\'m in, coach!" - Just show me the exact steps and I\'ll execute', value: 9, tracks: ['service', 'digital_product'] },
      { text: '⏰ "I\'m committed but need this to work around my family"', value: 7, tracks: ['ecommerce', 'consulting'] },
      { text: '🤔 "Prove to me this isn\'t another shiny object"', value: 5, tracks: ['consulting', 'ecommerce'] }
    ]
  }
];

export const aiTechStepTrackDescriptions: TrackDescriptions = {
  digital_product: {
    title: 'AI Digital Product Creator',
    description: 'Perfect for parents who want to create and sell AI-powered digital products like courses, templates, and automated services while managing family life.',
    income_potential: '$2,000-$10,000/month',
    time_commitment: '15-30 minutes daily',
    best_for: 'Creative parents with limited time who want passive income streams'
  },
  service: {
    title: 'AI Service Provider', 
    description: 'Ideal for parents who want to offer AI-enhanced services like content creation, social media management, or virtual assistance with flexible schedules.',
    income_potential: '$1,500-$5,000/month',
    time_commitment: '30-60 minutes daily',
    best_for: 'Parents who enjoy helping others and want client-based income'
  },
  ecommerce: {
    title: 'AI E-commerce Optimizer',
    description: 'Great for parents who want to use AI to optimize online stores, product listings, and customer experiences while working from home.',
    income_potential: '$1,000-$3,000/month',
    time_commitment: '20-45 minutes daily',
    best_for: 'Parents interested in online sales and product optimization'
  },
  consulting: {
    title: 'AI Parent Consultant',
    description: 'Perfect for experienced parents who want to help other families integrate AI into their lives and businesses through consulting and coaching.',
    income_potential: '$3,000-$8,000/month', 
    time_commitment: '45-90 minutes daily',
    best_for: 'Parents with professional experience who want to guide others'
  }
};