
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Animal, Baia, Setor, Check, StatusChecagem } from '@/types';
import { animalService, baiaService, setorService, checkService } from '@/services/firestore';
import { useAuth } from './AuthContext';

interface AppContextType {
  // Estado
  setores: Setor[];
  baias: Baia[];
  animais: Animal[];
  checks: Check[];
  currentCheck: Check | null;

  // Loading states
  loading: {
    setores: boolean;
    baias: boolean;
    animais: boolean;
    checks: boolean;
  };

  // Ações
  fetchSetores: () => Promise<void>;
  fetchBaias: (setorId?: string) => Promise<void>;
  fetchAnimais: (setorId?: string, baiaId?: string) => Promise<void>;
  fetchChecks: () => Promise<void>;

  // CRUD Setores
  addSetor: (setor: Omit<Setor, 'id' | 'animais' | 'baias'>) => Promise<Setor>;
  updateSetor: (id: string, setor: Partial<Setor>) => Promise<Setor>;
  deleteSetor: (id: string) => Promise<boolean>;

  // CRUD Baias
  addBaia: (baia: Omit<Baia, 'id' | 'animais'>) => Promise<Baia>;
  updateBaia: (id: string, baia: Partial<Baia>) => Promise<Baia>;
  deleteBaia: (id: string) => Promise<boolean>;

  // CRUD Animais
  addAnimal: (animal: Omit<Animal, 'id' | 'lastCheck'>) => Promise<Animal>;
  updateAnimal: (id: string, animal: Partial<Animal>) => Promise<Animal>;
  deleteAnimal: (id: string) => Promise<boolean>;

  // Checagem
  startNewCheck: () => Promise<Check>;
  checkAnimal: (animalId: string) => Promise<boolean>;
  isBaiaChecked: (baiaId: string) => Promise<boolean>;
  isSetorChecked: (setorId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const { currentUser } = useAuth();

  // Estado
  const [setores, setSetores] = useState<Setor[]>([]);
  const [baias, setBaias] = useState<Baia[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);
  const [currentCheck, setCurrentCheck] = useState<Check | null>(null);

  // Loading states
  const [loading, setLoading] = useState({
    setores: false,
    baias: false,
    animais: false,
    checks: false,
  });

  // Funções de busca
  const fetchSetores = async () => {
    if (!currentUser) return;

    setLoading(prev => ({ ...prev, setores: true }));
    try {
      const data = await setorService.getAll();
      setSetores(data);
    } catch (error) {
      console.error('Erro ao buscar setores:', error);
    } finally {
      setLoading(prev => ({ ...prev, setores: false }));
    }
  };

  const fetchBaias = async (setorId?: string) => {
    if (!currentUser) return;

    setLoading(prev => ({ ...prev, baias: true }));
    try {
      let data: Baia[];
      if (setorId) {
        data = await baiaService.getBySetor(setorId);
      } else {
        data = await baiaService.getAll();
      }
      setBaias(data);
    } catch (error) {
      console.error('Erro ao buscar baias:', error);
    } finally {
      setLoading(prev => ({ ...prev, baias: false }));
    }
  };

  const fetchAnimais = async (setorId?: string, baiaId?: string) => {
    if (!currentUser) return;

    setLoading(prev => ({ ...prev, animais: true }));
    try {
      let data: Animal[];
      if (baiaId) {
        data = await animalService.getByBaia(baiaId);
      } else if (setorId) {
        data = await animalService.getBySetor(setorId);
      } else {
        data = await animalService.getAll();
      }
      setAnimais(data);
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
    } finally {
      setLoading(prev => ({ ...prev, animais: false }));
    }
  };

  const fetchChecks = async () => {
    if (!currentUser) return;

    setLoading(prev => ({ ...prev, checks: true }));
    try {
      const data = await checkService.getAll();
      // Ordenar checagens por data (mais recentes primeiro)
      const sortedChecks = data.sort((a, b) => {
        return new Date(b.check).getTime() - new Date(a.check).getTime();
      });
      setChecks(sortedChecks);

      // Definir a checagem ativa (mais recente não concluída)
      const activeCheck = sortedChecks.find(check =>
        check.status === StatusChecagem.NAO_INICIADO ||
        check.status === StatusChecagem.EM_ANDAMENTO
      );
      setCurrentCheck(activeCheck || null);
    } catch (error) {
      console.error('Erro ao buscar checagens:', error);
    } finally {
      setLoading(prev => ({ ...prev, checks: false }));
    }
  };

  // CRUD Setores
  const addSetor = async (setor: Omit<Setor, 'id' | 'animais' | 'baias'>) => {
    try {
      const newSetor = await setorService.add({
        ...setor,
        animais: [],
        baias: [],
      });
      setSetores(prev => [...prev, newSetor]);
      return newSetor;
    } catch (error) {
      console.error('Erro ao adicionar setor:', error);
      throw error;
    }
  };

  const updateSetor = async (id: string, setor: Partial<Setor>) => {
    try {
      const updatedSetor = await setorService.update(id, setor);
      setSetores(prev => prev.map(s => s.id === id ? { ...s, ...setor } : s));
      return updatedSetor;
    } catch (error) {
      console.error('Erro ao atualizar setor:', error);
      throw error;
    }
  };

  const deleteSetor = async (id: string) => {
    try {
      await setorService.delete(id);
      setSetores(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar setor:', error);
      throw error;
    }
  };

  // CRUD Baias
  const addBaia = async (baia: Omit<Baia, 'id' | 'animais'>) => {
    try {
      const newBaia = await baiaService.add({
        ...baia,
        animais: [],
      });
      setBaias(prev => [...prev, newBaia]);
      return newBaia;
    } catch (error) {
      console.error('Erro ao adicionar baia:', error);
      throw error;
    }
  };

  const updateBaia = async (id: string, baia: Partial<Baia>) => {
    try {
      const updatedBaia = await baiaService.update(id, baia);
      setBaias(prev => prev.map(b => b.id === id ? { ...b, ...baia } : b));
      return updatedBaia;
    } catch (error) {
      console.error('Erro ao atualizar baia:', error);
      throw error;
    }
  };

  const deleteBaia = async (id: string) => {
    try {
      await baiaService.delete(id);
      setBaias(prev => prev.filter(b => b.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar baia:', error);
      throw error;
    }
  };

  // CRUD Animais
  const addAnimal = async (animal: Omit<Animal, 'id' | 'lastCheck'>) => {
    try {
      const newAnimal = await animalService.add(animal);
      setAnimais(prev => [...prev, newAnimal]);
      return newAnimal;
    } catch (error) {
      console.error('Erro ao adicionar animal:', { error });
      throw error;
    }
  };

  const updateAnimal = async (id: string, animal: Partial<Animal>) => {
    try {
      const updatedAnimal = await animalService.update(id, animal);
      setAnimais(prev => prev.map(a => a.id === id ? { ...a, ...animal } : a));
      return updatedAnimal;
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
      throw error;
    }
  };

  const deleteAnimal = async (id: string) => {
    try {
      await animalService.delete(id);
      setAnimais(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar animal:', error);
      throw error;
    }
  };

  // Checagem
  const startNewCheck = async () => {
    try {
      const newCheck = await checkService.add();
      setChecks(prev => [newCheck, ...prev]);
      setCurrentCheck(newCheck);
      return newCheck;
    } catch (error) {
      console.error('Erro ao iniciar nova checagem:', error);
      throw error;
    }
  };

  const checkAnimal = async (animalId: string) => {
    if (!currentCheck?.id) {
      throw new Error('Não há checagem ativa');
    }

    try {
      await checkService.checkAnimal(animalId, currentCheck.id);
      setAnimais(prev =>
        prev.map(a => a.id === animalId ? { ...a, lastCheck: currentCheck.id } : a)
      );

      // Atualizar status da checagem
      const updatedCheck = await checkService.getById(currentCheck.id);
      if (updatedCheck) {
        setCurrentCheck(updatedCheck);
      }

      // Verificar se todos os animais foram checados
      await checkService.isAllSetoresChecked(currentCheck.id);
      await fetchChecks();

      return true;
    } catch (error) {
      console.error('Erro ao marcar animal como checado:', error);
      throw error;
    }
  };

  const isBaiaChecked = async (baiaId: string) => {
    if (!currentCheck?.id) return false;

    try {
      return await checkService.isBaiaChecked(baiaId, currentCheck.id);
    } catch (error) {
      console.error('Erro ao verificar status da baia:', error);
      return false;
    }
  };

  const isSetorChecked = async (setorId: string) => {
    if (!currentCheck?.id) return false;

    try {
      return await checkService.isSetorChecked(setorId, currentCheck.id);
    } catch (error) {
      console.error('Erro ao verificar status do setor:', error);
      return false;
    }
  };

  // Carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    if (currentUser) {
      fetchSetores();
      fetchChecks();
    }
  }, [currentUser]);

  const value = {
    setores,
    baias,
    animais,
    checks,
    currentCheck,
    loading,
    fetchSetores,
    fetchBaias,
    fetchAnimais,
    fetchChecks,
    addSetor,
    updateSetor,
    deleteSetor,
    addBaia,
    updateBaia,
    deleteBaia,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    startNewCheck,
    checkAnimal,
    isBaiaChecked,
    isSetorChecked,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
