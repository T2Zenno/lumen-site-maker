import React from 'react';
import { MousePointer2, Sparkles } from 'lucide-react';

export function DropZone() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center">
          <MousePointer2 className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold text-card-foreground mb-2">
          Start Building Your Page
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Drag blocks from the left palette to this canvas to start building your page.
        </p>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Drag & drop to add blocks</span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Click elements to edit them</span>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Use inspector for advanced styling</span>
          </div>
        </div>
      </div>
    </div>
  );
}