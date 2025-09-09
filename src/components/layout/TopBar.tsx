import React, { useState } from 'react';
import { 
  Menu,
  Plus,
  Copy,
  Eye,
  Download,
  Rocket,
  ChevronDown
} from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function TopBar() {
  const { state, dispatch } = useAppState();
  const [showPublishModal, setShowPublishModal] = useState(false);
  
  const currentPage = state.pages.find(p => p.id === state.currentPageId);
  
  const handleToggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };
  
  const handleAddPage = () => {
    const name = prompt('Page name?', 'New Page');
    if (!name) return;
    
    const id = 'page_' + Date.now();
    dispatch({ type: 'ADD_PAGE', payload: { id, name } });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: id });
  };
  
  const handleDuplicatePage = () => {
    if (!currentPage) return;
    
    const name = currentPage.name + ' (Copy)';
    const id = 'page_' + Date.now();
    dispatch({ type: 'ADD_PAGE', payload: { id, name } });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: id });
  };
  
  const handlePreview = () => {
    // Implementation for preview functionality
    console.log('Preview page');
  };
  
  const handleExportHTML = () => {
    // Implementation for HTML export
    console.log('Export HTML');
  };
  
  const handlePublish = () => {
    setShowPublishModal(true);
  };
  
  const handlePageSelect = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
  };
  
  return (
    <>
      <header className="sticky top-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span className="font-medium">{currentPage?.name || 'Pages'}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {state.pages.map((page) => (
                  <DropdownMenuItem
                    key={page.id}
                    onClick={() => handlePageSelect(page.id)}
                    className={page.id === state.currentPageId ? 'bg-primary/10 text-primary' : ''}
                  >
                    {page.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleAddPage} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPage}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicatePage}
            disabled={!currentPage}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportHTML}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export HTML
          </Button>
          
          <Button
            onClick={handlePublish}
            className="gap-2"
          >
            <Rocket className="w-4 h-4" />
            Publish
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
          
          <div className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
            {state.settings.workspace || 'default'}
          </div>
        </div>
      </header>
    </>
  );
}