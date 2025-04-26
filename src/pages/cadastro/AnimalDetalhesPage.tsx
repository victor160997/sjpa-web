
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { TipoAnimal } from '@/types';

const AnimalDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { animais, currentCheck, checkAnimal } = useApp();
  const [isChecked, setIsChecked] = useState(false);

  const animal = animais.find(a => a.id === id);

  useEffect(() => {
    if (animal && currentCheck) {
      setIsChecked(animal.lastCheck === currentCheck.id);
    }
  }, [animal, currentCheck]);

  const handleCheck = async () => {
    if (!animal) return;
    try {
      await checkAnimal(animal.id!);
      setIsChecked(true);
    } catch (error) {
      console.error('Error checking animal:', error);
    }
  };

  if (!animal) return <div>Animal não encontrado</div>;

  return (
    <div className="container p-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-medium">{animal.nome}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <p><strong>Idade:</strong> {animal.idade} anos</p>
            <p><strong>Raça:</strong> {animal.raca}</p>
            <p><strong>Tipo:</strong> {animal.tipo === TipoAnimal.CACHORRO ? 'Cachorro' : 'Gato'}</p>
            {animal.observacao && <p><strong>Observação:</strong> {animal.observacao}</p>}
            
            {currentCheck && (
              <div className="flex items-center space-x-4">
                <Switch
                  checked={isChecked}
                  onCheckedChange={handleCheck}
                  disabled={isChecked}
                />
                <span className="text-sm">
                  {isChecked 
                    ? `Checado em ${currentCheck.check}` 
                    : 'Não Checado'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDetalhesPage;
