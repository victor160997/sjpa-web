import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { Baia, Setor, TipoAnimal } from '@/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  idSetor: z.string().min(1, 'Setor é obrigatório'),
  numeroBaia: z.string().min(1, 'Número da baia é obrigatório'),
  observacao: z.string().optional(),
  tipo: z.string(),
});

type BaiaFormData = z.infer<typeof formSchema>;

const BaiaFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setores, baias, addBaia, updateBaia } = useApp();

  const { toast } = useToast();

  const baia = baias.find(b => b.id === id);

  const form = useForm<BaiaFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idSetor: baia?.idSetor || '',
      numeroBaia: baia?.numeroBaia.toString() || '',
      observacao: baia?.observacao || '',
      tipo: baia?.tipo.toString() || '1',
    },
  });

  useEffect(() => {
    if (baia) {
      form.reset({
        idSetor: baia.idSetor,
        numeroBaia: baia.numeroBaia.toString(),
        observacao: baia.observacao || '',
        tipo: baia.tipo.toString() || '1',
      });
    }
  }, [baia, form]);

  const onSubmit = async (data: BaiaFormData) => {
    try {
      if (id !== "novo") {
        await updateBaia(id, {
          idSetor: data.idSetor,
          numeroBaia: Number(data.numeroBaia),
          observacao: data.observacao || null,
          tipo: Number(data.tipo) as TipoAnimal,
        });
      } else {
        await addBaia({
          idSetor: data.idSetor,
          numeroBaia: Number(data.numeroBaia),
          observacao: data.observacao || null,
          tipo: Number(data.tipo) as TipoAnimal,
        });
      }
      toast({
        title: 'Ação realizada com sucesso!',
      });
      navigate(-1);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="idSetor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {setores.map((setor) => (
                      <SelectItem key={setor.id} value={setor.id || ''}>{setor.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numeroBaia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número da Baia</FormLabel>
                <FormControl>
                  <Input placeholder="Número da baia" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Animal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Cachorro</SelectItem>
                    <SelectItem value="2">Gato</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="observacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observação</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Observações sobre a baia"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Adicione qualquer informação adicional sobre a baia.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Salvar</Button>
        </form>
      </Form>
    </div>
  );
};

export default BaiaFormPage;
