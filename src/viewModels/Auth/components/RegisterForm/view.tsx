import { Ionicons } from '@expo/vector-icons';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { Colors, getThemeColors } from '../../../../shared/utils/colors';
import { LoginFormModel } from '../LoginForm/model';

export function RegisterFormView({
  registerForm,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  isLoading,
  handleRegister,
  navigateToLogin,
  updateRegisterForm,
  setConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
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
          <View className="flex-row items-center px-5 py-5">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full items-center justify-center"
              onPress={navigateToLogin}
              disabled={isLoading}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color={themeColors.text.primary} 
              />
            </TouchableOpacity>
            
            <View className="flex-1 ml-4">
              <Text 
                className="text-2xl font-bold"
                style={{ color: themeColors.text.primary }}
              >
                Criar conta
              </Text>
              <Text 
                className="text-base"
                style={{ color: themeColors.text.secondary }}
              >
                Junte-se ao AzureJay
              </Text>
            </View>
          </View>

          {/* Form */}
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* Name Row */}
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1">
                <Text 
                  className="text-base font-semibold mb-2"
                  style={{ color: themeColors.text.primary }}
                >
                  Nome
                </Text>
                <View 
                  className="flex-row items-center border rounded-xl px-4 h-14"
                  style={{ 
                    backgroundColor: themeColors.input.background,
                    borderColor: themeColors.input.border 
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={themeColors.text.tertiary} />
                  <TextInput
                    className="flex-1 text-base ml-3 h-full"
                    style={{ color: themeColors.text.primary }}
                    value={registerForm.first_name}
                    onChangeText={(value) => updateRegisterForm('first_name', value)}
                    placeholder="Nome"
                    placeholderTextColor={themeColors.text.tertiary}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text 
                  className="text-base font-semibold mb-2"
                  style={{ color: themeColors.text.primary }}
                >
                  Sobrenome
                </Text>
                <View 
                  className="flex-row items-center border rounded-xl px-4 h-14"
                  style={{ 
                    backgroundColor: themeColors.input.background,
                    borderColor: themeColors.input.border 
                  }}
                >
                  <Ionicons name="person-outline" size={20} color={themeColors.text.tertiary} />
                  <TextInput
                    className="flex-1 text-base ml-3 h-full"
                    style={{ color: themeColors.text.primary }}
                    value={registerForm.last_name}
                    onChangeText={(value) => updateRegisterForm('last_name', value)}
                    placeholder="Sobrenome"
                    placeholderTextColor={themeColors.text.tertiary}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
              </View>
            </View>

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
                  value={registerForm.email}
                  onChangeText={(value) => updateRegisterForm('email', value)}
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
                  value={registerForm.password}
                  onChangeText={(value) => updateRegisterForm('password', value)}
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirm password input */}
            <View className="mb-5">
              <Text 
                className="text-base font-semibold mb-2"
                style={{ color: themeColors.text.primary }}
              >
                Confirmar senha
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
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repita sua senha"
                  placeholderTextColor={themeColors.text.tertiary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1"
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={themeColors.text.tertiary} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="h-14 rounded-xl items-center justify-center mt-5"
              style={{ 
                backgroundColor: Colors.primary[500],
                opacity: isLoading ? 0.7 : 1 
              }}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <Ionicons name="hourglass-outline" size={20} color="#ffffff" />
                  <Text className="text-white text-lg font-semibold ml-2">Criando conta...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-semibold">Criar conta</Text>
              )}
            </TouchableOpacity>

          </ScrollView>
          
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}