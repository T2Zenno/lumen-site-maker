import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users, TrendingUp, DollarSign, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const stages = ['To Contact', 'In Progress', 'Won', 'Lost'] as const;

export function CRMView() {
  const { state, dispatch } = useAppState();
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadNote, setNewLeadNote] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const handleAddLead = () => {
    if (!newLeadName.trim()) return;
    
    const newCard = {
      id: 'card_' + Date.now(),
      name: newLeadName.trim(),
      note: newLeadNote.trim(),
      stage: 'To Contact' as const
    };
    
    dispatch({ type: 'ADD_CRM_CARD', payload: newCard });
    setNewLeadName('');
    setNewLeadNote('');
    setShowAddDialog(false);
  };
  
  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, newStage: typeof stages[number]) => {
    e.preventDefault();
    
    if (!draggedCard) return;
    
    dispatch({
      type: 'UPDATE_CRM_CARD',
      payload: {
        id: draggedCard,
        updates: { stage: newStage }
      }
    });
    
    setDraggedCard(null);
  };
  
  // Calculate statistics
  const totalLeads = state.crm.cards.length;
  const wonLeads = state.crm.cards.filter(card => card.stage === 'Won').length;
  const inProgressLeads = state.crm.cards.filter(card => card.stage === 'In Progress').length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'To Contact':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'In Progress':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'Won':
        return 'border-green-500/20 bg-green-500/5';
      case 'Lost':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-border bg-muted/5';
    }
  };
  
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'To Contact':
        return '📞';
      case 'In Progress':
        return '⏳';
      case 'Won':
        return '🎉';
      case 'Lost':
        return '❌';
      default:
        return '📋';
    }
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">CRM</h1>
          <p className="text-muted-foreground">Manage leads and customer relationships</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="lead-name">Lead Name</Label>
                <Input
                  id="lead-name"
                  placeholder="Enter lead name..."
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lead-note">Notes</Label>
                <Textarea
                  id="lead-note"
                  placeholder="Add any notes about this lead..."
                  value={newLeadNote}
                  onChange={(e) => setNewLeadNote(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLead} disabled={!newLeadName.trim()}>
                  Add Lead
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-card-foreground">{totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">In Progress</p>
                <p className="text-2xl font-bold text-warning">{inProgressLeads}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Won Leads</p>
                <p className="text-2xl font-bold text-success">{wonLeads}</p>
              </div>
              <Award className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          {state.crm.cards.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No leads yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first lead to track through the sales pipeline.
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Lead
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stages.map((stage) => {
                const stageCards = state.crm.cards.filter(card => card.stage === stage);
                
                return (
                  <div key={stage} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-card-foreground flex items-center gap-2">
                        <span>{getStageIcon(stage)}</span>
                        {stage}
                      </h3>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {stageCards.length}
                      </span>
                    </div>
                    
                    <div
                      className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${getStageColor(stage)}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, stage)}
                    >
                      <div className="space-y-3">
                        {stageCards.map((card) => (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={() => handleDragStart(card.id)}
                            className="p-3 bg-card border border-border rounded-lg cursor-move hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-medium text-card-foreground mb-1">
                              {card.name}
                            </h4>
                            {card.note && (
                              <p className="text-sm text-muted-foreground">
                                {card.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* CRM Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>CRM Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Lead Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Track leads through sales pipeline</li>
                <li>• Drag and drop to update stages</li>
                <li>• Add notes and contact information</li>
                <li>• Monitor conversion rates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Pipeline Stages</h4>
              <div className="space-y-2">
                {stages.map((stage) => (
                  <div key={stage} className="flex items-center gap-2 text-sm">
                    <span>{getStageIcon(stage)}</span>
                    <span className="text-card-foreground">{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}