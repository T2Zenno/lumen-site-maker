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
  
  const svgPlaceholder = (w = 320, h = 180, text = 'Image') => 
    'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stop-color="#11162f"/><stop offset="100%" stop-color="#303a7a"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#cbd5ff" font-family="system-ui,Arial" font-size="20">${text}</text></svg>`);

  const currency = (n: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(n || 0);

  const buildStandaloneHTML = (title: string) => {
    const brand = state.settings.brandName || 'Brand Anda';
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    const inner = currentPage?.html || '';
    const faviconHref = state.media.find(m => m.id === state.settings.favicon)?.dataUrl || '';
    const theme = state.settings.theme || 'dark';
    const lang = state.settings.lang || 'id';
    
    // Get the full Tailwind CSS for proper styling
    const tailwindCSS = `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      
      /* Dark theme variables */
      :root {
        --background: 225 25% 8%;
        --foreground: 225 50% 95%;
        --card: 225 30% 12%;
        --card-foreground: 225 50% 95%;
        --primary: 227 78% 65%;
        --primary-foreground: 0 0% 100%;
        --secondary: 225 25% 18%;
        --secondary-foreground: 225 40% 85%;
        --muted: 225 20% 22%;
        --muted-foreground: 225 30% 70%;
        --accent: 225 70% 58%;
        --accent-foreground: 0 0% 100%;
        --destructive: 0 84% 60%;
        --destructive-foreground: 0 0% 100%;
        --border: 225 25% 25%;
        --input: 225 30% 16%;
        --ring: 227 78% 65%;
        --radius: 0.75rem;
      }
      
      * { box-sizing: border-box; }
      body { 
        font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        margin: 0;
        padding: 0;
      }
      
      /* Tailwind utility classes */
      .bg-primary { background-color: hsl(var(--primary)); }
      .text-primary { color: hsl(var(--primary)); }
      .text-primary-foreground { color: hsl(var(--primary-foreground)); }
      .bg-card { background-color: hsl(var(--card)); }
      .text-card-foreground { color: hsl(var(--card-foreground)); }
      .bg-secondary { background-color: hsl(var(--secondary)); }
      .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
      .text-muted-foreground { color: hsl(var(--muted-foreground)); }
      .border { border: 1px solid hsl(var(--border)); }
      .rounded-lg { border-radius: calc(var(--radius) - 2px); }
      .rounded-md { border-radius: calc(var(--radius) - 4px); }
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
      .m-4 { margin: 1rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      .font-bold { font-weight: 700; }
      .font-semibold { font-weight: 600; }
      .text-sm { font-size: 0.875rem; }
      .text-lg { font-size: 1.125rem; }
      .text-xl { font-size: 1.25rem; }
      .text-2xl { font-size: 1.5rem; }
      .text-3xl { font-size: 1.875rem; }
      .text-4xl { font-size: 2.25rem; }
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .gap-4 { gap: 1rem; }
      .gap-2 { gap: 0.5rem; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .max-w-6xl { max-width: 72rem; }
      .max-w-4xl { max-width: 56rem; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .grid { display: grid; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        border-radius: calc(var(--radius) - 4px);
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;
        border: none;
      }
      .btn-primary {
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
      }
      .btn-primary:hover {
        background-color: hsl(var(--primary) / 0.9);
      }
      .btn-secondary {
        background-color: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));
      }
      
      @media (max-width: 768px) {
        .container { padding: 0 0.5rem; }
        .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .text-4xl { font-size: 1.875rem; }
        .text-3xl { font-size: 1.5rem; }
        .p-8 { padding: 1rem; }
        .p-6 { padding: 1rem; }
      }
    `;
    const wa = state.settings.waNumber || '';
    const waTpl = state.settings.waTemplate || '';
    const bank = state.settings.bankInfo || '';
    const qrisImg = state.media.find(m => m.id === state.settings.qrisImg)?.dataUrl || '';
    const qrisId = state.settings.qrisId || '';

    return `<!DOCTYPE html>
<html lang="${lang}" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${brand}</title>
  ${faviconHref ? `<link rel="icon" href="${faviconHref}">` : ''}
  <style>${tailwindCSS}</style>
</head>
<body>
  <div id="root">
    ${inner}
  </div>
</body>
</html>`;
  };

  const downloadFile = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handlePreview = () => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    
    if (!currentPage || !currentPage.html) {
      // Use toast instead of alert
      import('@/hooks/use-toast').then(({ toast }) => {
        toast({
          title: "No content to preview",
          description: "Please add some blocks to your page first.",
          variant: "destructive"
        });
      });
      return;
    }
    
    const html = buildStandaloneHTML(state.settings.brandName || 'Landing');
    const w = window.open('', '_blank', 'width=1200,height=800');
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };
  
  const handleExportHTML = () => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    
    if (!currentPage || !currentPage.html) {
      import('@/hooks/use-toast').then(({ toast }) => {
        toast({
          title: "No content to export",
          description: "Please add some blocks to your page first.",
          variant: "destructive"
        });
      });
      return;
    }
    
    const html = buildStandaloneHTML(state.settings.brandName || 'Landing');
    downloadFile('halaman.html', html);
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