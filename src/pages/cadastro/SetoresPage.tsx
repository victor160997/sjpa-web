
import { useNavigate } from 'react-router-dom';
import { Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';

const SetoresPage = () => {
  const navigate = useNavigate();
  const { setores, loading, fetchBaias, fetchAnimais, baias, animais, currentCheck, isSetorChecked } = useApp();
  const [setoresStatus, setSetoresStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchBaias();
      await fetchAnimais();
      if (currentCheck) {
        const status: { [key: string]: boolean } = {};
        for (const setor of setores) {
          if (setor.id) {
            status[setor.id] = await isSetorChecked(setor.id);
          }
        }
        setSetoresStatus(status);
      }
    };
    fetchData();
  }, [setores, currentCheck]);

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Setores</h1>
        <Button onClick={() => navigate('setores/novo')}>
          <Plus className="mr-2" />
          Novo Setor
        </Button>
      </div>

      {loading.setores ? (
        <p>Carregando setores...</p>
      ) : (
        <div className="grid gap-4">
          {setores.map((setor) => {
            const animalCount = animais
              .filter((animal) => animal.idSetor === setor.id)

            const baiasCount = baias.filter((baia) => baia.idSetor === setor.id);

            return (
              <Card
                key={setor.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`setores/${setor.id}/detalhes`)}
              >
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Setor {setor.nome}</CardTitle>
                    {currentCheck && (
                      <div className="text-lg">
                        {setoresStatus[setor.id!] ? (
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
                    {animalCount.length} animais •{' '}
                    {baiasCount.length || 0} baias
                  </p>
                  {setor.observacao && (
                    <p className="text-sm text-gray-500 mt-2">{setor.observacao}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default SetoresPage;
