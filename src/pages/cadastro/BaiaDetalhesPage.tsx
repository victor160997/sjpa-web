
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { TipoAnimal } from '@/types';

const BaiaDetalhesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baias, animais, loading, fetchAnimais, currentCheck, isBaiaChecked } = useApp();
  const [isCheckedStatus, setIsCheckedStatus] = useState(false);

  const baia = baias.find(b => b.id === id);

  useEffect(() => {
    if (id) {
      fetchAnimais(undefined, id);
    }
  }, [id]);

  useEffect(() => {
    const checkStatus = async () => {
      if (id && currentCheck) {
        const status = await isBaiaChecked(id);
        setIsCheckedStatus(status);
      }
    };
    checkStatus();
  }, [id, currentCheck, animais]);

  if (!baia) return <div>Baia não encontrada</div>;

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

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Baia {baia.numeroBaia}</h1>
          {currentCheck && (
            <div className="text-lg">
              {isCheckedStatus ? (
                <Check className="text-green-500" />
              ) : (
                <X className="text-red-500" />
              )}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/cadastro/baias/${id}/editar`)}
        >
          <Edit className="mr-2" />
          Editar
        </Button>
      </div>

      <div className="mb-4">
        <Button onClick={() => navigate(`/cadastro/animais/novo?baiaId=${id}&setorId=${baia.idSetor}`)}>
          <Plus className="mr-2" />
          Novo Animal
        </Button>
      </div>

      {loading.animais ? (
        <p>Carregando animais...</p>
      ) : (
        <div className="grid gap-4">
          {animais.map((animal) => (
            <Card
              key={animal.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/cadastro/animais/${animal.id}`)}
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{animal.nome}</CardTitle>
                  {currentCheck && (
                    <div className="text-lg">
                      {animal.lastCheck === currentCheck.id ? (
                        <Check className="text-green-500" />
                      ) : (
                        <X className="text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600">
                  {animal.tipo === TipoAnimal.CACHORRO ? 'Cachorro' : 'Gato'} •{' '}
                  {animal.idade} anos • {animal.raca}
                </p>
                {animal.observacao && (
                  <p className="text-sm text-gray-500 mt-2">{animal.observacao}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaiaDetalhesPage;
