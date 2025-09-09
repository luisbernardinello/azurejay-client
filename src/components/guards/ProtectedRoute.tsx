import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../shared/services/auth.service';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirectedRef = useRef(false);
  const lastAuthStateRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (hasRedirectedRef.current) {
      return;
    }

    if (lastAuthStateRef.current !== null && lastAuthStateRef.current === isAuthenticated) {
      return;
    }

    lastAuthStateRef.current = isAuthenticated;

    if (requireAuth && !isAuthenticated) {
      setIsRedirecting(true);
      hasRedirectedRef.current = true;
      
      setTimeout(() => {
        router.replace(redirectTo || '/(auth)/login');
      }, 100);
      return;
    }

    if (!requireAuth && isAuthenticated) {
      setIsRedirecting(true);
      hasRedirectedRef.current = true;
      
      setTimeout(() => {
        router.replace(redirectTo || '/(tabs)');
      }, 100);
      return;
    }

    setIsRedirecting(false);
    hasRedirectedRef.current = false;
    
  }, [isAuthenticated, isLoading, requireAuth, redirectTo]);

  useEffect(() => {
    return () => {
      hasRedirectedRef.current = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Carregando..." overlay={false} />;
  }

  if (isRedirecting) {
    return <LoadingSpinner text="Redirecionando..." overlay={false} />;
  }

  const shouldShowContent = requireAuth ? isAuthenticated : !isAuthenticated;
  
  if (!shouldShowContent) {
    return <LoadingSpinner text="Verificando acesso..." overlay={false} />;
  }

  return <>{children}</>;
}