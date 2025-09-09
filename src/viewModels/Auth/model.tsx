import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { LoginRequest, RegisterRequest } from '../../shared/interfaces/auth.interface';
import { useAuth } from '../../shared/services/auth.service';
import { sanitizeInput, validateEmail, validateName, validatePassword, validateRequired } from '../../shared/utils/validation';

export const useAuthModel = () => {
  const auth = useAuth();
  
  // Form states
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterRequest>({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const validateLoginForm = (): boolean => {
    if (!validateRequired(loginForm.email)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira seu email.');
      return false;
    }

    if (!validateEmail(loginForm.email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return false;
    }
    
    if (!validateRequired(loginForm.password)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira sua senha.');
      return false;
    }
    
    return true;
  };

  const validateRegisterForm = (): boolean => {
    if (!validateRequired(registerForm.first_name)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira seu nome.');
      return false;
    }

    if (!validateName(registerForm.first_name)) {
      Alert.alert('Nome inválido', 'Nome deve ter pelo menos 2 caracteres.');
      return false;
    }
    
    if (!validateRequired(registerForm.last_name)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira seu sobrenome.');
      return false;
    }

    if (!validateName(registerForm.last_name)) {
      Alert.alert('Sobrenome inválido', 'Sobrenome deve ter pelo menos 2 caracteres.');
      return false;
    }
    
    if (!validateRequired(registerForm.email)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira seu email.');
      return false;
    }

    if (!validateEmail(registerForm.email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return false;
    }
    
    if (!validateRequired(registerForm.password)) {
      Alert.alert('Campo obrigatório', 'Por favor, insira sua senha.');
      return false;
    }

    if (!validatePassword(registerForm.password)) {
      Alert.alert('Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    if (!validateRequired(confirmPassword)) {
      Alert.alert('Campo obrigatório', 'Por favor, confirme sua senha.');
      return false;
    }
    
    if (registerForm.password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem.');
      return false;
    }
    
    return true;
  };

  // Actions
  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    
    try {
      await auth.login.mutateAsync(loginForm);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Erro no login',
        error.message || 'Email ou senha incorretos. Tente novamente.'
      );
    }
  };

  const handleRegister = async () => {
    if (!validateRegisterForm()) return;
    
    try {
      await auth.register.mutateAsync(registerForm);
      Alert.alert(
        'Conta criada!',
        'Sua conta foi criada com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erro no registro',
        error.message || 'Não foi possível criar sua conta. Tente novamente.'
      );
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  const navigateToLogin = () => {
    router.back();
  };

  const updateLoginForm = (field: keyof LoginRequest, value: string) => {
    const sanitizedValue = field === 'email' ? sanitizeInput(value).toLowerCase() : sanitizeInput(value);
    setLoginForm(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const updateRegisterForm = (field: keyof RegisterRequest, value: string) => {
    let sanitizedValue = sanitizeInput(value);
    
    if (field === 'email') {
      sanitizedValue = sanitizedValue.toLowerCase();
    } else if (field === 'first_name' || field === 'last_name') {
      sanitizedValue = sanitizedValue.charAt(0).toUpperCase() + sanitizedValue.slice(1).toLowerCase();
    }
    
    setRegisterForm(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(sanitizeInput(value));
  };

  return {
    loginForm,
    registerForm,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading: auth.login.isPending || auth.register.isPending,
    
    handleLogin,
    handleRegister,
    navigateToRegister,
    navigateToLogin,
    updateLoginForm,
    updateRegisterForm,
    setConfirmPassword: handleConfirmPasswordChange,
    setShowPassword,
    setShowConfirmPassword,
  };
};