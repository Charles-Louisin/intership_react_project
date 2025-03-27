"use client"

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/formulaire/button';
import { Input } from '../ui/formulaire/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/formulaire/form";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const formSchema = z.object({
  username: z.string()
    .min(5, 'Le nom d\'utilisateur doit contenir au moins 5 caractères')
    .max(20, 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Uniquement des lettres, chiffres et underscores sont autorisés'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
});

type LoginCredentials = z.infer<typeof formSchema>;

export const ProfileForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-0">
      <div className="w-full sm:max-w-md sm:bg-white sm:rounded-2xl sm:shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        {...field}
                        placeholder="Entrez votre nom d'utilisateur"
                        className={`pl-10 ${form.formState.errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="Entrez votre mot de passe"
                        className={`pl-10 ${form.formState.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-lg bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-500 hover:to-orange-400 text-white font-medium shadow-md transition-all cursor-pointer duration-200"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Pas encore de compte?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};