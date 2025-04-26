
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusChecagem } from '@/types';

export default function CheckagemPage() {
  const { checks, startNewCheck } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleNewCheck = async () => {
    await startNewCheck();
    setDialogOpen(false);
  };

  // Helper function to ensure check data is properly formatted as a string
  const formatCheckData = (checkData: any) => {
    if (!checkData) return '';
    
    // If checkData is a Firestore timestamp (has seconds and nanoseconds)
    if (typeof checkData === 'object' && checkData.seconds !== undefined) {
      return new Date(checkData.seconds * 1000).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    
    // If it's already a string, return it directly
    return String(checkData);
  };

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checagem</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2" />
          Iniciar Nova Checagem
        </Button>
      </div>

      <div className="space-y-4">
        {checks.map((check, index) => (
          <Card key={check.id} className={index > 0 ? 'opacity-70' : ''}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg font-medium">
                Checagem {formatCheckData(check.check)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-gray-600">
                Status: {check.status}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Checagem</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja iniciar uma nova checagem em{' '}
              {new Date().toLocaleDateString('pt-BR')}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewCheck}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
