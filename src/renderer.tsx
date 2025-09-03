import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'AI Income Builder v1.0'}</title>
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Font Awesome Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom CSS */}
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* Meta tags for SEO */}
        <meta name="description" content="Transform your skills into AI-powered income streams. Join our exclusive 4-week gamified program and discover your perfect AI business model." />
        <meta name="keywords" content="AI income, artificial intelligence, online business, digital products, AI consulting, e-commerce, freelancing" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="AI Income Builder v1.0 - Build Your AI-Powered Income Stream" />
        <meta property="og:description" content="Take our quiz to discover your perfect AI income track: Digital Products, Services, E-commerce, or Consulting. Start building today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-income-builder.pages.dev" />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Main application scripts */}
        <script src="/static/app.js"></script>
        <script src="/static/quiz.js"></script>
      </body>
    </html>
  )
})
