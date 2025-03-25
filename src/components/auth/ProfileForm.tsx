"use client"

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/api';
import { LoginCredentials } from '../../types/user';
import { Button } from '../ui/formulaire/button';
import { Input } from '../ui/formulaire/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/formulaire/form";
import { useAuth } from '../../context/AuthContext';

export const ProfileForm = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  
  const form = useForm<LoginCredentials>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Connexion réussie!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
    }
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  );
};
