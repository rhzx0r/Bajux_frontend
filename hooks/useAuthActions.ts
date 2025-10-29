import { useState } from 'react';
import { authService, type LoginData, type RegisterData } from '../lib/auth';
import { useAuth } from '../providers/AuthProvider';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchProfile } = useAuth();

  const login = async (credentials: LoginData) => {
    setLoading(true);
    setError(null);

    const { data, error } = await authService.login(credentials);

    if (error) {
      const errorMessage = (error as any)?.message || 'Error al iniciar sesión';
      setError(errorMessage);
    } else if (data?.user) {
      await refetchProfile();
    }

    setLoading(false);
    return { data, error };
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);

    const { data, error, message } = await authService.register(userData);

    if (error) {
      const errorMessage = (error as any)?.message || 'Error al registrar';
      setError(errorMessage);
    }

    setLoading(false);
    return { data, error, message };
  };

  const resendConfirmation = async (email: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await authService.resendConfirmationEmail(email);

    if (error) {
      const errorMessage = (error as any)?.message || 'Error al reenviar email';
      setError(errorMessage);
    }

    setLoading(false);
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);

    const { data, error } = await authService.resetPassword(email);

    if (error) {
      const errorMessage =
        (error as any)?.message || 'Error al restablecer contraseña';
      setError(errorMessage);
    }

    setLoading(false);
    return { data, error };
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    login,
    register,
    resendConfirmation,
    resetPassword,
    clearError,
  };
}
