
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { TipoAnimal } from '@/types';

const SetorDetalhesPage = () => {
  const { id: idSetor } = useParams();
  const navigate = useNavigate();
  const { setores, baias, animais, loading, fetchBaias, fetchAnimais } = useApp();

  const setor = setores.find(s => s.id === idSetor);

  useEffect(() => {
    if (idSetor) {
      fetchBaias(idSetor);
      fetchAnimais(idSetor);
    }
  }, [idSetor]);

  if (!setor) return <div>Setor não encontrado</div>;

  return (
    <div className="container p-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/cadastro')}
      >
        <ArrowLeft className="mr-2" />
        Voltar
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Setor {setor.nome}</h1>
        <Button
          variant="outline"
          onClick={() => navigate(`/cadastro/setores/${idSetor}/editar`)}
        >
          <Edit className="mr-2" />
          Editar
        </Button>
      </div>

      <Tabs defaultValue="baias">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="baias">Baias</TabsTrigger>
          <TabsTrigger value="animais">Animais Soltos</TabsTrigger>
        </TabsList>

        <TabsContent value="baias">
          <div className="mb-4">
            <Button onClick={() => navigate(`/cadastro/baias/novo?setorId=${idSetor}`)}>
              <Plus className="mr-2" />
              Nova Baia
            </Button>
          </div>

          {loading.baias ? (
            <p>Carregando baias...</p>
          ) : (
            <div className="grid gap-4">
              {baias.map((baia) => (
                <Card
                  key={baia.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/cadastro/baia/${baia.id}/detalhes`)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">
                      Baia {baia.numeroBaia}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600">
                      {animais.filter(animal => animal.idBaia === baia.id).length
                        || 0} animais •{' '}
                      {baia.tipo === TipoAnimal.CACHORRO ? 'Cachorros' : 'Gatos'}
                    </p>
                    {baia.observacao && (
                      <p className="text-sm text-gray-500 mt-2">{baia.observacao}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="animais">
          <div className="mb-4">
            <Button onClick={() => navigate(`/cadastro/animais/novo?setorId=${idSetor}`)}>
              <Plus className="mr-2" />
              Novo Animal
            </Button>
          </div>

          {loading.animais ? (
            <p>Carregando animais...</p>
          ) : (
            <div className="grid gap-4">
              {animais
                .filter(animal => !animal.idBaia)
                .map((animal) => (
                  <Card
                    key={animal.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/cadastro/animais/${animal.id}`)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{animal.nome}</CardTitle>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SetorDetalhesPage;
