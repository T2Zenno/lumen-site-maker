import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { BlockPalette } from '@/components/builder/BlockPalette';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { FunctionalInspector } from '@/components/builder/FunctionalInspector';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Settings, X } from 'lucide-react';

export function BuilderView() {
  const { state } = useAppState();
  const isMobile = useIsMobile();
  const [showPalette, setShowPalette] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  // Auto-show inspector when element is selected on mobile
  React.useEffect(() => {
    if (isMobile && state.selectedElement) {
      setShowInspector(true);
    }
  }, [isMobile, state.selectedElement]);

  if (isMobile) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Controls */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-card">
          <Sheet open={showPalette} onOpenChange={setShowPalette}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4 mr-2" />
                Blocks
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-card-foreground">Blocks & Components</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag blocks to build your page
                </p>
              </div>
              <BlockPalette 
                onDragStart={() => setShowPalette(false)} 
                isMobile={true}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={showInspector} onOpenChange={setShowInspector}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" disabled={!state.selectedElement}>
                <Settings className="h-4 w-4 mr-2" />
                Inspector
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">Inspector</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {state.selectedElement ? 'Edit selected element' : 'Select an element to edit'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowInspector(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <FunctionalInspector />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Canvas */}
        <div className="flex-1 bg-workspace overflow-hidden">
          <BuilderCanvas 
            draggedBlock={null} 
            isMobile={true}
            onElementSelect={() => setShowInspector(true)}
            onDragStart={() => setShowPalette(false)}
          />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Left Panel - Block Palette */}
      <div className="w-80 border-r border-border bg-palette flex-shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-card-foreground">Blocks & Components</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag blocks to build your page
          </p>
        </div>
        <BlockPalette onDragStart={() => {}} />
      </div>
      
      {/* Center Panel - Canvas */}
      <div className="flex-1 bg-workspace p-6 overflow-hidden">
        <BuilderCanvas draggedBlock={null} />
      </div>
      
      {/* Right Panel - Inspector */}
      <div className="w-80 border-l border-border bg-card flex-shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-card-foreground">Inspector</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {state.selectedElement ? 'Edit selected element' : 'Select an element to edit'}
          </p>
        </div>
        <FunctionalInspector />
      </div>
    </div>
  );
}