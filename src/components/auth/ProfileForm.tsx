"use client"

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/formulaire/button';
import { Input } from '../ui/formulaire/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/formulaire/form";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginCredentials {
  username: string;
  password: string;
}

export const ProfileForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginCredentials>({
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      const sessionId = `session_${userData.id}_${Date.now()}`;
      
      const userWithSession = {
        ...userData,
        sessionId
      };
      
      login(userWithSession);
      toast.success('Connexion réussie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Identifiants incorrects');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez votre nom d'utilisateur" />
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
                <Input type="password" {...field} placeholder="Entrez votre mot de passe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </Form>
  );
};
