import React from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { BlockPalette } from '@/components/builder/BlockPalette';
import { BuilderCanvas } from '@/components/builder/BuilderCanvas';
import { FunctionalInspector } from '@/components/builder/FunctionalInspector';

export function BuilderView() {
  const { state } = useAppState();
  
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