
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { TipoAnimal, Genero } from '@/types';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  idade: z.string().min(1, 'Idade é obrigatória'),
  raca: z.string().min(1, 'Raça é obrigatória'),
  observacao: z.string().optional(),
  tipo: z.string(),
  gender: z.string(),
});

type AnimalFormData = z.infer<typeof formSchema>;

const AnimalFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    animais,
    addAnimal,
    updateAnimal,
    currentCheck,
    checkAnimal
  } = useApp();
  const [isChecked, setIsChecked] = useState(false);

  const { toast } = useToast();

  const animal = animais.find(a => a.id === id);

  const form = useForm<AnimalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: animal?.nome || '',
      idade: animal?.idade ? animal.idade.toString() : '',
      raca: animal?.raca || '',
      observacao: animal?.observacao || '',
      tipo: animal?.tipo ? animal.tipo.toString() : '1',
      gender: animal?.gender ? animal.gender.toString() : '1',
    },
  });

  useEffect(() => {
    if (animal && currentCheck) {
      setIsChecked(animal.lastCheck === currentCheck.id);
    }
  }, [animal, currentCheck]);

  const handleCheck = async () => {
    if (!animal) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);

    if (newChecked) {
      await checkAnimal(animal.id!);
    }
  };

  const onSubmit = async (data: AnimalFormData) => {
    try {
      const animalData = {
        nome: data.nome,
        idade: Number(data.idade),
        raca: data.raca,
        observacao: data.observacao || null,
        tipo: Number(data.tipo) as TipoAnimal,
        gender: Number(data.gender) as Genero,
        idSetor: animal?.idSetor || '',
        idBaia: animal?.idBaia || null,
      };

      if (id !== "novo") {
        await updateAnimal(id, animalData);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const setorId = urlParams.get('setorId');
        const baiaId = urlParams.get('baiaId');

        await addAnimal({
          ...animalData,
          idSetor: setorId || '',
          idBaia: baiaId || null,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do animal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade</FormLabel>
                <FormControl>
                  <Input placeholder="Idade do animal" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="raca"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raça</FormLabel>
                <FormControl>
                  <Input placeholder="Raça do animal" {...field} />
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
                <FormLabel>Observação</FormLabel>
                <FormControl>
                  <Input placeholder="Observação" {...field} />
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
                <FormLabel>Tipo</FormLabel>
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Masculino</SelectItem>
                    <SelectItem value="2">Feminino</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {currentCheck && (
            <div className="flex items-center space-x-4 mb-4">
              <Switch
                checked={isChecked}
                onCheckedChange={handleCheck}
              />
              <span className="text-sm">
                {isChecked
                  ? `Checado em ${currentCheck.check}`
                  : 'Não Checado'}
              </span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnimalFormPage;
