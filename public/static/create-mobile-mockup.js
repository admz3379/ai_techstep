// Script to create mobile mockup placeholder images
// This would typically be done with actual screenshots, but we'll create SVG placeholders

const createMobileMockup = () => {
  const svg = `<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
    <!-- Phone frame -->
    <rect width="390" height="844" rx="40" fill="#1f2937" stroke="#374151" stroke-width="2"/>
    
    <!-- Screen area -->
    <rect x="10" y="44" width="370" height="756" rx="30" fill="#ffffff"/>
    
    <!-- Notch -->
    <rect x="145" y="10" width="100" height="24" rx="12" fill="#000000"/>
    
    <!-- AI TechStep header -->
    <rect x="30" y="70" width="330" height="60" rx="8" fill="#f3f4f6"/>
    <text x="195" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">AI TechStep</text>
    
    <!-- Badge -->
    <rect x="120" y="150" width="150" height="30" rx="15" fill="#3b82f6"/>
    <text x="195" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="white">28-DAY AI CHALLENGE</text>
    
    <!-- Main headline -->
    <text x="195" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#111827">Launch Your First $1K+</text>
    <text x="195" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#111827">AI Project in 30 Days</text>
    
    <!-- Journey boxes -->
    <rect x="30" y="280" width="330" height="120" rx="12" fill="#f0fdf4"/>
    <circle cx="70" cy="320" r="15" fill="#3b82f6"/>
    <text x="70" y="326" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">1</text>
    <text x="100" y="318" font-family="Arial, sans-serif" font-size="12" fill="#111827">Week 1: Discover Your AI Idea</text>
    
    <circle cx="70" cy="360" r="15" fill="#8b5cf6"/>
    <text x="70" y="366" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="white">2</text>
    <text x="100" y="358" font-family="Arial, sans-serif" font-size="12" fill="#111827">Week 2: Build Your Asset</text>
    
    <!-- CTA buttons -->
    <rect x="40" y="450" width="310" height="50" rx="25" fill="#10b981"/>
    <text x="195" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">🚀 YES - I've experimented with it</text>
    
    <rect x="40" y="520" width="310" height="50" rx="25" fill="#3b82f6"/>
    <text x="195" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">✨ NO - I'm ready to start fresh</text>
    
    <!-- Bottom content -->
    <rect x="30" y="600" width="330" height="60" rx="8" fill="#f9fafb"/>
    <text x="195" y="625" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">700k+ users choice</text>
    <text x="195" y="645" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">★★★★★ 4.5 Rated on Trustpilot</text>
  </svg>`;
  
  return svg;
};

console.log('Mobile mockup SVG created');