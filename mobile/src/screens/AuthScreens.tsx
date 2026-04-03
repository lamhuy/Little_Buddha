import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { authService } from '../api/authService';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success && result.claims) {
      login(result.claims.name, result.claims.birthYear, result.claims.jwt);
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <View style={styles.container} testID="login-screen">
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')} testID="nav-register-button">
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.header,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.layout.borderRadius,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.layout.borderRadius,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: theme.spacing.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontSize: 16,
  }
});
