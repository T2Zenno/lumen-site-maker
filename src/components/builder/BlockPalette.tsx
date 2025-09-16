import React from 'react';
import { 
  Navigation,
  Zap,
  Grid3X3,
  ShoppingBag,
  Image,
  MessageSquare,
  DollarSign,
  Mail,
  Minus
} from 'lucide-react';

const blockCategories = [
  {
    name: 'Layout',
    blocks: [
      {
        id: 'navbar',
        name: 'Navbar',
        icon: Navigation,
        description: 'Navigation header'
      },
      {
        id: 'hero',
        name: 'Hero Section',
        icon: Zap,
        description: 'Main landing section'
      },
      {
        id: 'footer',
        name: 'Footer',
        icon: Minus,
        description: 'Page footer'
      }
    ]
  },
  {
    name: 'Content',
    blocks: [
      {
        id: 'features',
        name: 'Features',
        icon: Grid3X3,
        description: 'Feature showcase'
      },
      {
        id: 'gallery',
        name: 'Gallery',
        icon: Image,
        description: 'Image gallery'
      },
      {
        id: 'testimonials',
        name: 'Testimonials',
        icon: MessageSquare,
        description: 'Customer reviews'
      }
    ]
  },
  {
    name: 'E-Commerce',
    blocks: [
      {
        id: 'product',
        name: 'Product',
        icon: ShoppingBag,
        description: 'Single product showcase'
      },
      {
        id: 'product-grid',
        name: 'Product Grid',
        icon: Grid3X3,
        description: 'Multiple products'
      },
      {
        id: 'pricing',
        name: 'Pricing',
        icon: DollarSign,
        description: 'Pricing tables'
      }
    ]
  },
  {
    name: 'Forms',
    blocks: [
      {
        id: 'contact',
        name: 'Contact Form',
        icon: Mail,
        description: 'Contact form with WhatsApp'
      }
    ]
  }
];

interface BlockPaletteProps {
  onDragStart: (blockId?: string) => void;
  isMobile?: boolean;
}

export function BlockPalette({ onDragStart, isMobile }: BlockPaletteProps) {
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('text/blockId', blockId);
    onDragStart(blockId);
  };
  
  const handleDragEnd = () => {
    onDragStart();
  };
  
  return (
    <div className={`p-4 space-y-6 overflow-auto h-full ${isMobile ? 'pb-safe' : ''}`}>
      {blockCategories.map((category) => (
        <div key={category.name}>
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            {category.name}
          </h4>
          
          <div className="space-y-2">
            {category.blocks.map((block) => {
              const Icon = block.icon;
              
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragEnd={handleDragEnd}
                  className="group p-3 bg-muted hover:bg-accent rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm text-card-foreground group-hover:text-accent-foreground">
                        {block.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {block.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Quick Tips */}
      <div className="mt-8 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <h5 className="text-sm font-medium text-primary mb-2">Quick Tips</h5>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Drag blocks to the canvas</li>
          <li>• Click elements to edit them</li>
          <li>• Use the inspector for styling</li>
        </ul>
      </div>
    </div>
  );
}