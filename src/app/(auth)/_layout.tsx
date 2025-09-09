import { Stack } from 'expo-router';
import { ProtectedRoute } from '../../components/guards/ProtectedRoute';


export default function AuthLayout() {
  return (
    <ProtectedRoute requireAuth={false} redirectTo="/(tabs)">
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
    </ProtectedRoute>
  );
}