import React, { useState, useRef } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Grid3X3, List, Search, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export function LibraryView() {
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [deleteMediaId, setDeleteMediaId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia = {
            id: 'media_' + Date.now() + '_' + Math.random(),
            name: file.name,
            dataUrl: e.target?.result as string
          };
          
          dispatch({ type: 'ADD_MEDIA', payload: newMedia });
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSelectMedia = (mediaId: string, checked: boolean) => {
    if (checked) {
      setSelectedMedia([...selectedMedia, mediaId]);
    } else {
      setSelectedMedia(selectedMedia.filter(id => id !== mediaId));
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMedia(filteredMedia.map(media => media.id));
    } else {
      setSelectedMedia([]);
    }
  };
  
  const handleDeleteSelected = () => {
    if (selectedMedia.length === 0) return;
    setShowBulkDeleteDialog(true);
  };
  
  const confirmBulkDelete = () => {
    selectedMedia.forEach(mediaId => {
      dispatch({ type: 'DELETE_MEDIA', payload: mediaId });
    });
    
    setSelectedMedia([]);
    setShowBulkDeleteDialog(false);
    toast({
      title: "Success",
      description: `Deleted ${selectedMedia.length} media files`,
    });
  };
  
  const handleDeleteMedia = (mediaId: string) => {
    setDeleteMediaId(mediaId);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteMedia = () => {
    dispatch({ type: 'DELETE_MEDIA', payload: deleteMediaId });
    setShowDeleteDialog(false);
    toast({
      title: "Success",
      description: "Media file deleted successfully",
    });
  };
  
  // Filter media based on search query
  const filteredMedia = state.media.filter(media =>
    media.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatFileSize = (dataUrl: string) => {
    // Rough estimation of file size from base64
    const sizeInBytes = (dataUrl.length * 3) / 4;
    if (sizeInBytes < 1024) return `${Math.round(sizeInBytes)} B`;
    if (sizeInBytes < 1024 * 1024) return `${Math.round(sizeInBytes / 1024)} KB`;
    return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Media Library</h1>
          <p className="text-muted-foreground">Manage images and media files</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Media
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Files</p>
                <p className="text-2xl font-bold text-card-foreground">{state.media.length}</p>
              </div>
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Selected Files</p>
                <p className="text-2xl font-bold text-primary">{selectedMedia.length}</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Storage Used</p>
                <p className="text-2xl font-bold text-success">
                  {state.media.length > 0 ? '~' + Math.round(state.media.length * 0.5) + ' MB' : '0 MB'}
                </p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">💾</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedMedia.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedMedia.length})
            </Button>
          )}
          
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Media Grid/List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Media Files ({filteredMedia.length})</CardTitle>
            {filteredMedia.length > 0 && (
              <Checkbox
                checked={selectedMedia.length === filteredMedia.length}
                onCheckedChange={handleSelectAll}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                {state.media.length === 0 ? 'No media files yet' : 'No files match your search'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {state.media.length === 0 
                  ? 'Upload images to use in your pages and products.'
                  : 'Try adjusting your search query.'
                }
              </p>
              {state.media.length === 0 && (
                <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Your First Image
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((media) => (
                <div key={media.id} className="group relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox
                      checked={selectedMedia.includes(media.id)}
                      onCheckedChange={(checked) => handleSelectMedia(media.id, !!checked)}
                      className="bg-background/80 border-border"
                    />
                  </div>
                  
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity">
                    <img
                      src={media.dataUrl}
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-2 px-1">
                    <p className="text-xs font-medium text-card-foreground truncate" title={media.name}>
                      {media.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(media.dataUrl)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((media) => (
                <div key={media.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg hover:bg-accent transition-colors">
                  <Checkbox
                    checked={selectedMedia.includes(media.id)}
                    onCheckedChange={(checked) => handleSelectMedia(media.id, !!checked)}
                  />
                  
                  <img
                    src={media.dataUrl}
                    alt={media.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">{media.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(media.dataUrl)}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteMedia(media.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Usage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Media Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• Media files are stored locally and included in HTML exports.</p>
            <p>• Supported formats: JPG, PNG, GIF, SVG, WebP</p>
            <p>• Recommended size: Under 2MB per file for optimal performance</p>
            <p>• Files can be used in page blocks, product images, and site settings</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogs */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Media File"
        description="Are you sure you want to delete this media file? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteMedia}
      />
      
      <ConfirmationDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Selected Files"
        description={`Are you sure you want to delete ${selectedMedia.length} selected media files? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}