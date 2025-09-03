import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'Executive Edge Academy'}</title>
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Font Awesome Icons */}
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        
        {/* Custom CSS */}
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* Meta tags for SEO */}
        <meta name="description" content="Premium business transformation platform for ambitious executives and entrepreneurs. Build AI-powered businesses generating $10K-$100K+ monthly revenue." />
        <meta name="keywords" content="executive coaching, business transformation, AI consulting, executive education, leadership development, strategic planning" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Executive Edge Academy - Premium Business Transformation" />
        <meta property="og:description" content="Take our executive assessment to discover your optimal AI business model. Join 2,847+ successful graduates building $10K-$100K+ monthly businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://executive-edge-academy.pages.dev" />
        
        {/* Favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
      </head>
      <body className="antialiased">
        {children}
        
        {/* Main application scripts */}
        <script src="/static/app.js"></script>
        <script src="/static/ai-profile-quiz.js"></script>
        <script src="/static/pricing-modal.js"></script>
      </body>
    </html>
  )
})
