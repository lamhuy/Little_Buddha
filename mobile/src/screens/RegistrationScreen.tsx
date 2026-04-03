import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { authService } from '../api/authService';

export const RegistrationScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name || !birthYear) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await authService.register(email, password, name, parseInt(birthYear, 10));
    setLoading(false);

    if (result.success) {
      navigation.navigate('Verification', { email });
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Little Buddha</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your given or Buddhist name"
        value={name}
        onChangeText={setName}
        testID="input-name"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter your birth year (e.g., 2015)"
        keyboardType="numeric"
        value={birthYear}
        onChangeText={setBirthYear}
        testID="input-birthyear"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        testID="input-email"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        testID="input-password"
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={loading}
        testID="btn-register"
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F6F0', // Calming modern off-white
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#D4AF37', // Calming dark gold/saffron variant
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    color: '#5D6D7E',
    textAlign: 'center',
    fontSize: 16,
  }
});
