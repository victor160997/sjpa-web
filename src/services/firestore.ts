
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Animal, Baia, Setor, Check, TipoAnimal, StatusChecagem } from '@/types';

// Serviço para animais
export const animalService = {
  // Obter todos os animais
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'animais'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Animal));
  },

  // Obter um animal por ID
  getById: async (id: string) => {
    const docRef = doc(db, 'animais', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Animal;
    }
    return null;
  },

  // Obter animais por setor
  getBySetor: async (setorId: string) => {
    const q = query(collection(db, 'animais'), where('idSetor', '==', setorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Animal));
  },

  // Obter animais por baia
  getByBaia: async (baiaId: string) => {
    const q = query(collection(db, 'animais'), where('idBaia', '==', baiaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Animal));
  },

  // Adicionar um animal
  add: async (animal: Omit<Animal, 'id'>) => {
    // Verificar se o nome já existe para evitar duplicatas
    const q = query(collection(db, 'animais'), where('nome', '==', animal.nome));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('Já existe um animal com esse nome');
    }

    const docRef = await addDoc(collection(db, 'animais'), {
      ...animal,
      lastCheck: null,
    });
    return { id: docRef.id, ...animal } as Animal;
  },

  // Atualizar um animal
  update: async (id: string, animal: Partial<Animal>) => {
    const docRef = doc(db, 'animais', id);
    await updateDoc(docRef, animal);
    return { id, ...animal } as Animal;
  },

  // Deletar um animal
  delete: async (id: string) => {
    const docRef = doc(db, 'animais', id);
    await deleteDoc(docRef);
    return true;
  },
};

// Serviço para baias
export const baiaService = {
  // Obter todas as baias
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'baias'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Baia));
  },

  // Obter uma baia por ID
  getById: async (id: string) => {
    const docRef = doc(db, 'baias', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Baia;
    }
    return null;
  },

  // Obter baias por setor
  getBySetor: async (setorId: string) => {
    const q = query(collection(db, 'baias'), where('idSetor', '==', setorId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Baia));
  },

  // Adicionar uma baia
  add: async (baia: Omit<Baia, 'id'>) => {
    // Verificar se já existe uma baia com o mesmo número no mesmo setor
    const q = query(
      collection(db, 'baias'),
      where('idSetor', '==', baia.idSetor),
      where('numeroBaia', '==', baia.numeroBaia)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('Já existe uma baia com esse número neste setor');
    }

    const docRef = await addDoc(collection(db, 'baias'), {
      ...baia,
      animais: [],
    });
    return { id: docRef.id, ...baia } as Baia;
  },

  // Atualizar uma baia
  update: async (id: string, baia: Partial<Baia>) => {
    const docRef = doc(db, 'baias', id);
    await updateDoc(docRef, baia);
    return { id, ...baia } as Baia;
  },

  // Deletar uma baia
  delete: async (id: string) => {
    // Verificar se existem animais na baia
    const animais = await animalService.getByBaia(id);
    if (animais.length > 0) {
      throw new Error('Não é possível excluir uma baia com animais');
    }

    const docRef = doc(db, 'baias', id);
    await deleteDoc(docRef);
    return true;
  },
};

// Serviço para setores
export const setorService = {
  // Obter todos os setores
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'setores'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Setor));
  },

  // Obter um setor por ID
  getById: async (id: string) => {
    const docRef = doc(db, 'setores', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Setor;
    }
    return null;
  },

  // Adicionar um setor
  add: async (setor: Omit<Setor, 'id'>) => {
    // Verificar se já existe um setor com o mesmo nome
    const q = query(collection(db, 'setores'), where('nome', '==', setor.nome));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      throw new Error('Já existe um setor com esse nome');
    }

    const docRef = await addDoc(collection(db, 'setores'), {
      ...setor,
      animais: [],
      baias: [],
    });
    return { id: docRef.id, ...setor } as Setor;
  },

  // Atualizar um setor
  update: async (id: string, setor: Partial<Setor>) => {
    const docRef = doc(db, 'setores', id);
    await updateDoc(docRef, setor);
    return { id, ...setor } as Setor;
  },

  // Deletar um setor
  delete: async (id: string) => {
    // Verificar se existem baias ou animais no setor
    const baias = await baiaService.getBySetor(id);
    if (baias.length > 0) {
      throw new Error('Não é possível excluir um setor com baias');
    }

    const animais = await animalService.getBySetor(id);
    if (animais.length > 0) {
      throw new Error('Não é possível excluir um setor com animais');
    }

    const docRef = doc(db, 'setores', id);
    await deleteDoc(docRef);
    return true;
  },
};

// Serviço para checagens
export const checkService = {
  // Obter todas as checagens
  getAll: async () => {
    const snapshot = await getDocs(collection(db, 'checks'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Check));
  },

  // Obter uma checagem por ID
  getById: async (id: string) => {
    const docRef = doc(db, 'checks', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Check;
    }
    return null;
  },

  // Adicionar uma checagem
  add: async () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(now);

    const newCheck = {
      check: formattedDate,  // Store as a string instead of a timestamp object
      status: StatusChecagem.NAO_INICIADO
    };

    const docRef = await addDoc(collection(db, 'checks'), newCheck);
    return { id: docRef.id, ...newCheck } as Check;
  },

  // Atualizar uma checagem
  update: async (id: string, check: Partial<Check>) => {
    const docRef = doc(db, 'checks', id);
    await updateDoc(docRef, check);
    return { id, ...check } as Check;
  },

  // Atualizar status da checagem baseado no progresso
  updateStatus: async (id: string, status: StatusChecagem) => {
    const docRef = doc(db, 'checks', id);
    await updateDoc(docRef, { status });
    return true;
  },

  // Marcar um animal como checado
  checkAnimal: async (animalId: string, checkId: string) => {
    const animalRef = doc(db, 'animais', animalId);
    await updateDoc(animalRef, { lastCheck: checkId });

    // Atualizar status da checagem para "em andamento" se for a primeira checagem
    const check = await checkService.getById(checkId);
    if (check && check.status === StatusChecagem.NAO_INICIADO) {
      await checkService.updateStatus(checkId, StatusChecagem.EM_ANDAMENTO);
    }

    return true;
  },

  // Verificar se todos os animais em uma baia foram checados
  isBaiaChecked: async (baiaId: string, checkId: string) => {
    const animais = await animalService.getByBaia(baiaId);
    if (animais.length === 0) return true;

    return animais.every(animal => animal.lastCheck === checkId);
  },

  // Verificar se todos os animais em um setor foram checados
  isSetorChecked: async (setorId: string, checkId: string) => {
    // Verificar animais no setor (não em baias)
    const animaisNoSetor = await animalService.getBySetor(setorId);
    const animaisSetorChecked = animaisNoSetor.every(animal => animal.lastCheck === checkId);

    // Verificar animais nas baias do setor
    const baias = await baiaService.getBySetor(setorId);
    const baiasChecked = await Promise.all(baias.map(baia =>
      checkService.isBaiaChecked(baia.id!, checkId)
    ));

    return animaisSetorChecked && baiasChecked.every(checked => checked);
  },

  // Verificar se todos os setores foram checados
  isAllSetoresChecked: async (checkId: string) => {
    const setores = await setorService.getAll();
    const setoresChecked = await Promise.all(setores.map(setor =>
      checkService.isSetorChecked(setor.id!, checkId)
    ));

    const allChecked = setoresChecked.every(checked => checked);
    if (allChecked) {
      await checkService.updateStatus(checkId, StatusChecagem.CONCLUIDO);
    }

    return allChecked;
  },
};
