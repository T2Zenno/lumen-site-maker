// Block templates for the page builder

const svgPlaceholder = (w = 320, h = 180, text = 'Image') => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stop-color="hsl(225 30% 12%)"/>
          <stop offset="100%" stop-color="hsl(225 25% 18%)"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="hsl(225 50% 95%)" font-family="Inter,system-ui,Arial" font-size="20">
        ${text}
      </text>
    </svg>
  `)}`;
};

export const blockTemplates: Record<string, () => string> = {
  navbar: () => `
    <nav data-block-id="navbar" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 mb-4">
      <div class="flex justify-between items-center">
        <div class="font-bold text-lg sm:text-xl text-primary" contenteditable="true">
          Your Brand
        </div>
        <div class="hidden sm:flex gap-4">
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors" contenteditable="true">
            Home
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors" contenteditable="true">
            Products
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors" contenteditable="true">
            About
          </a>
          <a href="#" class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors" contenteditable="true">
            Contact
          </a>
        </div>
        <button class="sm:hidden p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  `,

  hero: () => `
    <section data-block-id="hero" class="block-element bg-gradient-surface border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        <div class="text-center lg:text-left">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-card-foreground mb-4" contenteditable="true">
            Build Amazing Pages in Minutes
          </h1>
          <p class="text-base sm:text-lg text-muted-foreground mb-6" contenteditable="true">
            Create stunning landing pages and stores with our drag-and-drop builder. 
            No coding required.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button class="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto">
              Get Started
            </button>
            <button class="border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
        <div class="order-first lg:order-last">
          <img 
            src="${svgPlaceholder(500, 300, 'Hero Image')}" 
            alt="Hero" 
            class="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  `,

  features: () => `
    <section data-block-id="features" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          Why Choose Us
        </h2>
        <p class="text-muted-foreground" contenteditable="true">
          Discover the benefits that make us stand out
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="bg-muted p-4 sm:p-6 rounded-lg text-center">
          <div class="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span class="text-primary text-xl">⚡</span>
          </div>
          <h3 class="font-semibold text-card-foreground mb-2" contenteditable="true">
            Fast & Reliable
          </h3>
          <p class="text-muted-foreground text-sm" contenteditable="true">
            Lightning-fast performance with 99.9% uptime guarantee.
          </p>
        </div>
        
        <div class="bg-muted p-4 sm:p-6 rounded-lg text-center">
          <div class="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span class="text-primary text-xl">🎨</span>
          </div>
          <h3 class="font-semibold text-card-foreground mb-2" contenteditable="true">
            Beautiful Design
          </h3>
          <p class="text-muted-foreground text-sm" contenteditable="true">
            Stunning templates and customizable components.
          </p>
        </div>
        
        <div class="bg-muted p-4 sm:p-6 rounded-lg text-center sm:col-span-2 lg:col-span-1">
          <div class="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span class="text-primary text-xl">🔒</span>
          </div>
          <h3 class="font-semibold text-card-foreground mb-2" contenteditable="true">
            Secure
          </h3>
          <p class="text-muted-foreground text-sm" contenteditable="true">
            Enterprise-grade security to protect your data.
          </p>
        </div>
      </div>
    </section>
  `,

  product: () => `
    <div data-block-id="product" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 mb-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <img 
          src="${svgPlaceholder(400, 300, 'Product')}" 
          alt="Product" 
          class="w-full h-48 sm:h-64 object-cover rounded-lg"
        />
        
        <div>
          <h3 class="text-xl sm:text-2xl font-bold text-card-foreground mb-2" contenteditable="true">
            Premium Product
          </h3>
          <p class="text-muted-foreground mb-4" contenteditable="true">
            High-quality product with amazing features and great value for money.
          </p>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <span class="text-xl sm:text-2xl font-bold text-primary" contenteditable="true">
              $299
            </span>
            <div class="flex items-center gap-2">
              <label class="text-sm text-muted-foreground">Qty:</label>
              <input 
                type="number" 
                min="1" 
                value="1" 
                class="w-16 px-2 py-1 border border-border rounded bg-background text-foreground"
              />
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <button class="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors w-full">
              Buy via WhatsApp
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button class="border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                Transfer
              </button>
              <button class="border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
                QRIS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  'product-grid': () => `
    <section data-block-id="product-grid" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          Featured Products
        </h2>
        <p class="text-muted-foreground" contenteditable="true">
          Check out our best-selling items
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="bg-muted rounded-lg p-4">
          <img 
            src="${svgPlaceholder(300, 200, 'Product 1')}" 
            alt="Product 1" 
            class="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"
          />
          <h4 class="font-semibold text-card-foreground mb-2" contenteditable="true">Product 1</h4>
          <p class="text-muted-foreground text-sm mb-3" contenteditable="true">Great product description</p>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span class="font-bold text-primary text-lg">$199</span>
            <button class="bg-primary text-primary-foreground px-3 py-2 rounded text-sm w-full sm:w-auto">
              Buy Now
            </button>
          </div>
        </div>
        
        <div class="bg-muted rounded-lg p-4">
          <img 
            src="${svgPlaceholder(300, 200, 'Product 2')}" 
            alt="Product 2" 
            class="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"
          />
          <h4 class="font-semibold text-card-foreground mb-2" contenteditable="true">Product 2</h4>
          <p class="text-muted-foreground text-sm mb-3" contenteditable="true">Another great product</p>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span class="font-bold text-primary text-lg">$299</span>
            <button class="bg-primary text-primary-foreground px-3 py-2 rounded text-sm w-full sm:w-auto">
              Buy Now
            </button>
          </div>
        </div>
        
        <div class="bg-muted rounded-lg p-4 sm:col-span-2 lg:col-span-1">
          <img 
            src="${svgPlaceholder(300, 200, 'Product 3')}" 
            alt="Product 3" 
            class="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"
          />
          <h4 class="font-semibold text-card-foreground mb-2" contenteditable="true">Product 3</h4>
          <p class="text-muted-foreground text-sm mb-3" contenteditable="true">Premium quality item</p>
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span class="font-bold text-primary text-lg">$399</span>
            <button class="bg-primary text-primary-foreground px-3 py-2 rounded text-sm w-full sm:w-auto">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  `,

  gallery: () => `
    <section data-block-id="gallery" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          Gallery
        </h2>
        <p class="text-muted-foreground" contenteditable="true">
          Take a look at our work
        </p>
      </div>
      
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
        <img 
          src="${svgPlaceholder(250, 200, 'Image 1')}" 
          alt="Gallery 1" 
          class="w-full h-24 sm:h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
        />
        <img 
          src="${svgPlaceholder(250, 200, 'Image 2')}" 
          alt="Gallery 2" 
          class="w-full h-24 sm:h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
        />
        <img 
          src="${svgPlaceholder(250, 200, 'Image 3')}" 
          alt="Gallery 3" 
          class="w-full h-24 sm:h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
        />
        <img 
          src="${svgPlaceholder(250, 200, 'Image 4')}" 
          alt="Gallery 4" 
          class="w-full h-24 sm:h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
        />
      </div>
    </section>
  `,

  testimonials: () => `
    <section data-block-id="testimonials" class="block-element bg-gradient-surface border border-border rounded-lg p-8 mb-4">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          What Our Customers Say
        </h2>
      </div>
      
      <div class="max-w-2xl mx-auto">
        <blockquote class="bg-card p-6 rounded-lg border border-border">
          <p class="text-card-foreground mb-4 text-lg" contenteditable="true">
            "This product is absolutely amazing! It has transformed the way I work and 
            I couldn't be happier with the results."
          </p>
          <footer class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
              JD
            </div>
            <div>
              <div class="font-semibold text-card-foreground" contenteditable="true">
                John Doe
              </div>
              <div class="text-muted-foreground text-sm" contenteditable="true">
                CEO, Company Inc.
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  `,

  pricing: () => `
    <section data-block-id="pricing" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          Choose Your Plan
        </h2>
        <p class="text-muted-foreground" contenteditable="true">
          Select the perfect plan for your needs
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        <div class="bg-muted p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-bold text-card-foreground mb-2" contenteditable="true">Basic</h3>
          <div class="text-2xl sm:text-3xl font-bold text-primary mb-4" contenteditable="true">$29/mo</div>
          <ul class="space-y-2 text-muted-foreground mb-6 text-sm sm:text-base">
            <li contenteditable="true">✓ 5 Projects</li>
            <li contenteditable="true">✓ 10GB Storage</li>
            <li contenteditable="true">✓ Email Support</li>
          </ul>
          <button class="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg hover:bg-primary-hover transition-colors">
            Choose Plan
          </button>
        </div>
        
        <div class="bg-primary p-4 sm:p-6 rounded-lg text-primary-foreground relative order-first lg:order-none">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent px-3 py-1 rounded-full text-xs">
            Popular
          </div>
          <h3 class="text-lg sm:text-xl font-bold mb-2" contenteditable="true">Pro</h3>
          <div class="text-2xl sm:text-3xl font-bold mb-4" contenteditable="true">$59/mo</div>
          <ul class="space-y-2 mb-6 text-sm sm:text-base">
            <li contenteditable="true">✓ 50 Projects</li>
            <li contenteditable="true">✓ 100GB Storage</li>
            <li contenteditable="true">✓ Priority Support</li>
          </ul>
          <button class="w-full bg-primary-foreground text-primary py-2 sm:py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            Choose Plan
          </button>
        </div>
        
        <div class="bg-muted p-4 sm:p-6 rounded-lg">
          <h3 class="text-lg sm:text-xl font-bold text-card-foreground mb-2" contenteditable="true">Enterprise</h3>
          <div class="text-2xl sm:text-3xl font-bold text-primary mb-4" contenteditable="true">$99/mo</div>
          <ul class="space-y-2 text-muted-foreground mb-6 text-sm sm:text-base">
            <li contenteditable="true">✓ Unlimited Projects</li>
            <li contenteditable="true">✓ 1TB Storage</li>
            <li contenteditable="true">✓ 24/7 Support</li>
          </ul>
          <button class="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg hover:bg-primary-hover transition-colors">
            Choose Plan
          </button>
        </div>
      </div>
    </section>
  `,

  contact: () => `
    <section data-block-id="contact" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center mb-6 sm:mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-card-foreground mb-4" contenteditable="true">
          Get In Touch
        </h2>
        <p class="text-muted-foreground" contenteditable="true">
          Send us a message and we'll respond via WhatsApp
        </p>
      </div>
      
      <div class="max-w-md mx-auto space-y-4">
        <input 
          type="text" 
          placeholder="Your Name" 
          class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base"
        />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base"
        />
        <textarea 
          placeholder="Your Message" 
          rows="4" 
          class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-border rounded-lg bg-background text-foreground text-sm sm:text-base resize-none"
        ></textarea>
        
        <button class="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg hover:bg-primary-hover transition-colors text-sm sm:text-base">
          Send via WhatsApp
        </button>
      </div>
    </section>
  `,

  footer: () => `
    <footer data-block-id="footer" class="block-element bg-card border border-border rounded-lg p-4 sm:p-6 lg:p-8 mb-4">
      <div class="text-center">
        <p class="text-muted-foreground text-sm sm:text-base" contenteditable="true">
          © 2024 <span class="text-primary font-semibold">Your Brand</span>. All rights reserved.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mt-4">
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base" contenteditable="true">
            Privacy
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base" contenteditable="true">
            Terms
          </a>
          <a href="#" class="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base" contenteditable="true">
            Support
          </a>
        </div>
      </div>
    </footer>
  `
};