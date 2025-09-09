import React from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Copy, ArrowUp, ArrowDown, Link } from 'lucide-react';

export function Inspector() {
  const { state, dispatch } = useAppState();
  
  if (!state.selectedElement) {
    return (
      <div className="p-6 text-center">
        <div className="text-muted-foreground">
          Select an element to edit its properties
        </div>
      </div>
    );
  }
  
  const handleDeleteElement = () => {
    if (state.selectedElement) {
      state.selectedElement.remove();
      dispatch({ type: 'SELECT_ELEMENT', payload: null });
    }
  };
  
  const handleDuplicateElement = () => {
    if (state.selectedElement) {
      const cloned = state.selectedElement.cloneNode(true) as HTMLElement;
      state.selectedElement.parentNode?.insertBefore(cloned, state.selectedElement.nextSibling);
    }
  };
  
  const handleMoveUp = () => {
    if (state.selectedElement?.previousElementSibling) {
      state.selectedElement.parentNode?.insertBefore(
        state.selectedElement, 
        state.selectedElement.previousElementSibling
      );
    }
  };
  
  const handleMoveDown = () => {
    if (state.selectedElement?.nextElementSibling) {
      state.selectedElement.parentNode?.insertBefore(
        state.selectedElement.nextElementSibling,
        state.selectedElement
      );
    }
  };
  
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
                  placeholder="Enter text..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="element-link" className="text-xs">Link URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="element-link"
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button size="icon" variant="outline">
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
              <Select>
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
                  className="mt-1 h-10"
                />
              </div>
              
              <div>
                <Label htmlFor="bg-color" className="text-xs">Background</Label>
                <Input
                  id="bg-color"
                  type="color"
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
                <Label htmlFor="padding" className="text-xs">Padding</Label>
                <Input
                  id="padding"
                  type="number"
                  placeholder="24"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="margin" className="text-xs">Margin</Label>
                <Input
                  id="margin"
                  type="number"
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
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Left" />
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
              <Select>
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