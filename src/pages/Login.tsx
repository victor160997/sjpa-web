
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      navigate('/cadastro');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'E-mail ou senha inválidos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-ong-primary p-4">
      <div className="flex flex-col items-center justify-center mt-8">
        <Logo className="mb-4" />
        <h1 className="text-2xl font-bold text-white mb-1">Bem Vindo!</h1>
        <p className="text-white mb-8">Faça login para usar o app</p>
      </div>
      
      <div className="bg-white p-6 rounded-t-3xl flex-1 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="seu.email@exemplo.com"
              {...register('email', { 
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido',
                }
              })}
              className="w-full"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Senha</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                {...register('password', { required: 'Senha é obrigatória' })}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-ong-primary hover:bg-ong-dark"
          >
            {loading ? 'Carregando...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
