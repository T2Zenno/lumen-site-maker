import React, { useRef, useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { blockTemplates } from '@/lib/blockTemplates';
import { DropZone } from './DropZone';

interface BuilderCanvasProps {
  draggedBlock: string | null;
}

export function BuilderCanvas({ draggedBlock }: BuilderCanvasProps) {
  const { state, dispatch } = useAppState();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const blockId = e.dataTransfer.getData('text/blockId');
    if (!blockId || !blockTemplates[blockId]) return;
    
    // Create new block element
    const blockHtml = blockTemplates[blockId]();
    
    // Add to page HTML (simplified - in real implementation would insert at drop position)
    const updatedHtml = (currentPage?.html || '') + blockHtml;
    
    dispatch({
      type: 'UPDATE_PAGE_HTML',
      payload: { id: state.currentPageId, html: updatedHtml }
    });
  };
  
  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = e.target as HTMLElement;
    
    // Find the closest block element
    const blockElement = element.closest('[data-block-id]') as HTMLElement;
    if (blockElement) {
      dispatch({ type: 'SELECT_ELEMENT', payload: blockElement });
    }
  };
  
  const handleCanvasClick = () => {
    dispatch({ type: 'SELECT_ELEMENT', payload: null });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          {currentPage?.name || 'Untitled Page'}
        </h2>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md">
              Desktop
            </button>
            <button className="px-3 py-1 text-sm text-muted-foreground hover:text-card-foreground">
              Tablet
            </button>
            <button className="px-3 py-1 text-sm text-muted-foreground hover:text-card-foreground">
              Mobile
            </button>
          </div>
        </div>
      </div>
      
      <div
        ref={canvasRef}
        className={`builder-canvas flex-1 ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {currentPage?.html ? (
          <div
            className="p-6 space-y-4"
            onClick={handleElementClick}
            dangerouslySetInnerHTML={{ __html: currentPage.html }}
          />
        ) : (
          <DropZone />
        )}
      </div>
    </div>
  );
}