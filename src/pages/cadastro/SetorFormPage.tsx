import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface SetorFormData {
  nome: string;
  observacao?: string;
}

const SetorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setores, addSetor, updateSetor, deleteSetor } = useApp();

  const form = useForm<SetorFormData>({
    defaultValues: {
      nome: '',
      observacao: '',
    },
  });

  useEffect(() => {
    if (id && id !== 'novo') {
      const setor = setores.find(s => s.id === id);
      if (setor) {
        form.reset({
          nome: setor.nome,
          observacao: setor.observacao || '',
        });
      }
    }
  }, [id, setores]);

  const onSubmit = async (data: SetorFormData) => {
    try {
      if (id === 'novo') {
        await addSetor(data);
        toast({
          title: 'Setor criado com sucesso!',
        });
      } else {
        await updateSetor(id!, data);
        toast({
          title: 'Setor atualizado com sucesso!',
        });
      }
      navigate('/cadastro');
    } catch (error) {
      toast({
        title: 'Erro ao salvar setor',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!id || id === 'novo') return;

    if (confirm('Tem certeza que deseja excluir este setor?')) {
      try {
        await deleteSetor(id);
        toast({
          title: 'Setor excluído com sucesso!',
        });
        navigate('/cadastro');
      } catch (error) {
        toast({
          title: 'Erro ao excluir setor',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    }
  };

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

      <h1 className="text-2xl font-bold mb-6">
        {id === 'novo' ? 'Novo Setor' : 'Editar Setor'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Setor</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: A, B, C..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observação (opcional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Adicione uma observação..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="submit" className="bg-ong-primary">
              Salvar
            </Button>

            {id !== 'novo' && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Excluir
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SetorFormPage;
