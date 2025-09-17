import React, { useState, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Copy, ArrowUp, ArrowDown, Link, Move } from 'lucide-react';

export function FunctionalInspector() {
  const { state, dispatch } = useAppState();
  const [elementText, setElementText] = useState('');
  const [elementLink, setElementLink] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [textAlign, setTextAlign] = useState('left');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  
  // Update form when element changes
  useEffect(() => {
    if (state.selectedElement) {
      const element = state.selectedElement;
      
      // Get current text content
      const textContent = element.textContent || '';
      setElementText(textContent);
      
      // Get current link
      const linkElement = element.closest('a') || element.querySelector('a');
      setElementLink(linkElement?.getAttribute('href') || '');
      
      // Get current styles
      const computedStyle = window.getComputedStyle(element);
      setTextColor(rgbToHex(computedStyle.color));
      setBgColor(rgbToHex(computedStyle.backgroundColor));
      setPadding(computedStyle.padding.replace('px', ''));
      setMargin(computedStyle.margin.replace('px', ''));
      setTextAlign(computedStyle.textAlign);
    }
  }, [state.selectedElement]);
  
  // Helper function to convert RGB to HEX
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match) return '#000000';
    return '#' + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
  };
  
  // Update element text
  const handleTextChange = (value: string) => {
    setElementText(value);
    if (state.selectedElement) {
      // Update the actual element
      const textNodes = state.selectedElement.childNodes;
      for (let node of textNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = value;
          break;
        }
      }
      // If no text node found, set innerHTML
      if (state.selectedElement.children.length === 0) {
        state.selectedElement.textContent = value;
      }
      
      // Update page HTML
      updatePageHTML();
    }
  };
  
  // Update element link
  const handleLinkChange = (value: string) => {
    setElementLink(value);
    if (state.selectedElement) {
      if (value) {
        // Add or update link
        if (state.selectedElement.tagName === 'A') {
          state.selectedElement.setAttribute('href', value);
        } else {
          // Wrap element in link
          const link = document.createElement('a');
          link.href = value;
          state.selectedElement.parentNode?.insertBefore(link, state.selectedElement);
          link.appendChild(state.selectedElement);
        }
      } else {
        // Remove link
        if (state.selectedElement.tagName === 'A') {
          const parent = state.selectedElement.parentNode;
          if (parent) {
            parent.insertBefore(state.selectedElement.firstChild!, state.selectedElement);
            parent.removeChild(state.selectedElement);
          }
        }
      }
      updatePageHTML();
    }
  };
  
  // Update element styles
  const handleStyleChange = (property: string, value: string) => {
    if (!state.selectedElement) return;
    
    switch (property) {
      case 'color':
        setTextColor(value);
        state.selectedElement.style.color = value;
        break;
      case 'backgroundColor':
        setBgColor(value);
        state.selectedElement.style.backgroundColor = value;
        break;
      case 'padding':
        setPadding(value);
        state.selectedElement.style.padding = value + 'px';
        break;
      case 'margin':
        setMargin(value);
        state.selectedElement.style.margin = value + 'px';
        break;
      case 'textAlign':
        setTextAlign(value);
        state.selectedElement.style.textAlign = value;
        break;
    }
    updatePageHTML();
  };
  
  // Update page HTML in state
  const updatePageHTML = () => {
    const currentPage = state.pages.find(p => p.id === state.currentPageId);
    if (currentPage) {
      // Get the canvas container
      const canvas = document.querySelector('.builder-canvas [data-canvas-content]');
      if (canvas) {
        dispatch({
          type: 'UPDATE_PAGE_HTML',
          payload: { id: state.currentPageId, html: canvas.innerHTML }
        });
      }
    }
  };
  
  // Element actions
  const handleDeleteElement = () => {
    if (state.selectedElement) {
      state.selectedElement.remove();
      dispatch({ type: 'SELECT_ELEMENT', payload: null });
      updatePageHTML();
    }
  };
  
  const handleDuplicateElement = () => {
    if (state.selectedElement) {
      const cloned = state.selectedElement.cloneNode(true) as HTMLElement;
      state.selectedElement.parentNode?.insertBefore(cloned, state.selectedElement.nextSibling);
      updatePageHTML();
    }
  };
  
  const handleMoveUp = () => {
    if (state.selectedElement?.previousElementSibling) {
      state.selectedElement.parentNode?.insertBefore(
        state.selectedElement, 
        state.selectedElement.previousElementSibling
      );
      updatePageHTML();
    }
  };
  
  const handleMoveDown = () => {
    if (state.selectedElement?.nextElementSibling) {
      state.selectedElement.parentNode?.insertBefore(
        state.selectedElement.nextElementSibling,
        state.selectedElement
      );
      updatePageHTML();
    }
  };
  
  // Make element draggable
  const handleMakeDraggable = () => {
    if (state.selectedElement) {
      state.selectedElement.draggable = true;
      state.selectedElement.style.cursor = 'move';
      
      state.selectedElement.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/element-id', state.selectedElement?.id || '');
      });
      
      updatePageHTML();
    }
  };
  
  if (!state.selectedElement) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">
          Select an element to edit its properties
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 space-y-4 h-full overflow-auto">
      {/* Element Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveUp}
              className="gap-2"
            >
              <ArrowUp className="w-3 h-3" />
              Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveDown}
              className="gap-2"
            >
              <ArrowDown className="w-3 h-3" />
              Down
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicateElement}
              className="gap-2"
            >
              <Copy className="w-3 h-3" />
              Copy
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteElement}
              className="gap-2"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMakeDraggable}
            className="w-full gap-2"
          >
            <Move className="w-3 h-3" />
            Make Draggable
          </Button>
        </CardContent>
      </Card>
      
      {/* Element Properties */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Text Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="element-text" className="text-xs">Text</Label>
                <Input
                  id="element-text"
                  value={elementText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Enter text..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="element-link" className="text-xs">Link URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="element-link"
                    value={elementLink}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => handleLinkChange(elementLink)}
                  >
                    <Link className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Product Binding</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product..." />
                </SelectTrigger>
                <SelectContent>
                  {state.products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="text-color" className="text-xs">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                  className="mt-1 h-10"
                />
              </div>
              
              <div>
                <Label htmlFor="bg-color" className="text-xs">Background</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="mt-1 h-10"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Spacing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="padding" className="text-xs">Padding (px)</Label>
                <Input
                  id="padding"
                  type="number"
                  value={padding}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  placeholder="24"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="margin" className="text-xs">Margin (px)</Label>
                <Input
                  id="margin"
                  type="number"
                  value={margin}
                  onChange={(e) => handleStyleChange('margin', e.target.value)}
                  placeholder="16"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="alignment" className="text-xs">Text Alignment</Label>
                <Select value={textAlign} onValueChange={(value) => handleStyleChange('textAlign', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedImage} onValueChange={setSelectedImage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select image..." />
                </SelectTrigger>
                <SelectContent>
                  {state.media.map((media) => (
                    <SelectItem key={media.id} value={media.id}>
                      {media.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}