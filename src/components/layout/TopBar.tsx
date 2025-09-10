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
    const wa = state.settings.waNumber || '';
    const waTpl = state.settings.waTemplate || '';
    const bank = state.settings.bankInfo || '';
    const qrisImg = state.media.find(m => m.id === state.settings.qrisImg)?.dataUrl || '';
    const qrisId = state.settings.qrisId || '';

    return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title || brand}</title>${faviconHref ? `<link rel="icon" href="${faviconHref}">` : ''}<style>body{margin:0;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:${theme === 'light' ? '#f5f7ff' : '#0b1126'};color:${theme === 'light' ? '#0f1220' : '#e8ecff'}} .blk{border-radius:16px;border:1px solid ${theme === 'light' ? '#d8def7' : '#243056'};background:${theme === 'light' ? '#ffffff' : '#12173a'};padding:24px;max-width:980px;margin:14px auto} .btn{display:inline-block;padding:10px 14px;border-radius:12px;background:${theme === 'light' ? '#eef2ff' : '#1e2442'};border:1px solid ${theme === 'light' ? '#d8def7' : '#2a315a'};color:inherit;text-decoration:none} .btn.acc{background:${theme === 'light' ? '#6366f1' : '#6366f1'};border-color:#6d6de5;color:white} input{padding:10px;border-radius:10px;border:1px solid ${theme === 'light' ? '#d8def7' : '#2a315a'};background:${theme === 'light' ? '#fff' : '#0f1329'};color:inherit} .muted{opacity:.8}</style></head><body>${inner}<script>(function(){const currency=n=> new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);function waCheckout(blk){var price=parseInt((blk.querySelector('[data-role="price"]')||{}).innerText||'0',10);var title=(blk.querySelector('h3,h2,h1')||{}).innerText||'Produk';var qty=parseInt((blk.querySelector('[data-role="qty"]')||{}).value||'1',10);var num='${wa}'.replace(/\\D/g,''); if(!num){alert('Nomor WhatsApp belum diatur.'); return;} var total=price*qty; var msg='${waTpl}'.replace('{{product}}',title).replace('{{qty}}',qty).replace('{{total}}',currency(total)); var url='https://wa.me/'+num+'?text='+encodeURIComponent(msg); window.open(url,'_blank');} function openTransfer(blk){var price=parseInt((blk.querySelector('[data-role="price"]')||{}).innerText||'0',10);var qty=parseInt((blk.querySelector('[data-role="qty"]')||{}).value||'1',10);var title=(blk.querySelector('h3,h2,h1')||{}).innerText||'Produk';var total=price*qty; var info='${bank}'.trim()||'Info bank belum diatur.'; alert('Transfer '+currency(total)+'\\n\\n'+title+'\\n\\n'+info);} function openQris(){var modal=document.getElementById('qrisModal'); if(!modal){modal=document.createElement('div'); modal.id='qrisModal'; modal.style='position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99'; modal.innerHTML='<div style="background:${theme === 'light' ? '#fff' : '#0f1329'};padding:18px;border-radius:14px;min-width:280px;text-align:center"><h3>Bayar via QRIS</h3><div id="_qrisWrap"></div><div style="margin:8px 0;opacity:.8">Merchant: ${qrisId || '-'}</div><button onclick="this.closest(\\'div#qrisModal\\').remove()" style="padding:9px 12px;border-radius:12px;border:1px solid ${theme === 'light' ? '#d8def7' : '#2a315a'}">Tutup</button></div>'; document.body.appendChild(modal);} var wrap=modal.querySelector('#_qrisWrap'); wrap.innerHTML=${qrisImg ? "'" + `<img alt=QRIS style="width:260px;height:260px;object-fit:contain;border-radius:12px;border:1px solid ${theme === 'light' ? '#d8def7' : '#2a315a'}" src="${qrisImg}">` + "'" : "'QRIS belum diatur'"}; } function contactWA(blk){var inputs=blk.querySelectorAll('input'); var name=inputs[0]?.value||''; var phone=inputs[1]?.value||''; var msg=inputs[2]?.value||''; var num='${wa}'.replace(/\\D/g,''); if(!num){alert('Nomor WhatsApp belum diatur.'); return;} var full=encodeURIComponent('Nama: '+name+'%0ANomor: '+phone+'%0APesan: '+msg); window.open('https://wa.me/'+num+'?text='+full,'_blank'); } document.querySelectorAll('[data-action="buy-wa"]').forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); waCheckout(b.closest('.blk')); })); document.querySelectorAll('[data-action="buy-transfer"]').forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); openTransfer(b.closest('.blk')); })); document.querySelectorAll('[data-action="buy-qris"]').forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); openQris(); })); document.querySelectorAll('[data-action="contact-wa"]').forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); contactWA(b.closest('.blk')); })); })();<\\/script></body></html>`;
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
    console.log('Preview - Current page:', currentPage);
    console.log('Preview - Current page HTML:', currentPage?.html);
    
    if (!currentPage || !currentPage.html) {
      alert('No content to preview. Please add some blocks to your page first.');
      return;
    }
    
    const html = buildStandaloneHTML(state.settings.brandName || 'Landing');
    const w = window.open();
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };
  
  const handleExportHTML = () => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    console.log('Export - Current page:', currentPage);
    
    if (!currentPage || !currentPage.html) {
      alert('No content to export. Please add some blocks to your page first.');
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