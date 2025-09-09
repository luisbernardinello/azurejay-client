import { Ionicons } from '@expo/vector-icons';
import { Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../../../shared/utils/colors';
import { APP_CONFIG } from '../../../../shared/utils/constants';
import { LoginFormModel } from './model';

export function LoginFormView({
  loginForm,
  showPassword,
  isLoading,
  handleLogin,
  navigateToRegister,
  updateLoginForm,
  setShowPassword,
}: LoginFormModel) {
  const colorScheme = useColorScheme();
  const themeColors = getThemeColors(colorScheme === 'dark');

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          
          {/* Header */}
          <View className="items-center py-10 px-5">
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-5"
              style={{ backgroundColor: `${Colors.primary[500]}15` }}
            >
              <Image
                source={require('../../../../assets/azurejay.png')}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
            <Text 
              className="text-3xl font-bold mb-2"
              style={{ color: themeColors.text.primary }}
            >
              {APP_CONFIG.NAME}
            </Text>
            <Text 
              className="text-base text-center"
              style={{ color: themeColors.text.secondary }}
            >
              {APP_CONFIG.DESCRIPTION}
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1 px-5">
            
            {/* Email Input */}
            <View className="mb-5">
              <Text 
                className="text-base font-semibold mb-2"
                style={{ color: themeColors.text.primary }}
              >
                Email
              </Text>
              <View 
                className="flex-row items-center border rounded-xl px-4 h-14"
                style={{ 
                  backgroundColor: themeColors.input.background,
                  borderColor: themeColors.input.border 
                }}
              >
                <Ionicons name="mail-outline" size={20} color={themeColors.text.tertiary} />
                <TextInput
                  className="flex-1 text-base ml-3 h-full"
                  style={{ color: themeColors.text.primary }}
                  value={loginForm.email}
                  onChangeText={(value) => updateLoginForm('email', value)}
                  placeholder="seu@email.com"
                  placeholderTextColor={themeColors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text 
                className="text-base font-semibold mb-2"
                style={{ color: themeColors.text.primary }}
              >
                Senha
              </Text>
              <View 
                className="flex-row items-center border rounded-xl px-4 h-14"
                style={{ 
                  backgroundColor: themeColors.input.background,
                  borderColor: themeColors.input.border 
                }}
              >
                <Ionicons name="lock-closed-outline" size={20} color={themeColors.text.tertiary} />
                <TextInput
                  className="flex-1 text-base ml-3 h-full"
                  style={{ color: themeColors.text.primary }}
                  value={loginForm.password}
                  onChangeText={(value) => updateLoginForm('password', value)}
                  placeholder="Sua senha"
                  placeholderTextColor={themeColors.text.tertiary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-1"
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={themeColors.text.tertiary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="h-14 rounded-xl items-center justify-center mt-5 mb-5"
              style={{ 
                backgroundColor: Colors.primary[500],
                opacity: isLoading ? 0.7 : 1 
              }}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <Ionicons name="hourglass-outline" size={20} color="#ffffff" />
                  <Text className="text-white text-lg font-semibold ml-2">Entrando...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-semibold">Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center items-center py-5">
              <Text style={{ color: themeColors.text.secondary }}>
                Não tem uma conta?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToRegister} disabled={isLoading}>
                <Text 
                  className="text-base font-semibold"
                  style={{ color: Colors.primary[500] }}
                >
                  Criar conta
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}