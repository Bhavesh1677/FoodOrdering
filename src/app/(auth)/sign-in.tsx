import { Text, TextInput, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, router, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setErrors('');
  };

  const validateInput = () => {
    setErrors('');
    if (!email && !password) {
      setErrors('Please enter both email and password');
      return false;
    }
    if (!email) {
      setErrors('Email is required');
      return false;
    }
    if (!password) {
      setErrors('Password is required');
      return false;
    }
    if (password.length < 6) {
      setErrors('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  async function signInWithEmail() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error) { 
        Alert.alert('Success', 'You are Sign-In') 
      } else {
        Alert.alert('Error from try', error.message);
      }
      
      setLoading(false)
    } catch (error) {
      Alert.alert('Error from catch', (error as Error).message); 
    }
  };

  const onSubmit = () => {
    if (!validateInput()) {
      return;
    }
    signInWithEmail();
    resetFields();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Text style={{ color: 'red', textAlign: 'center' }}>{errors}</Text>

      <Button text={loading ? 'Signing in...' : 'Sign in'} onPress={onSubmit} disabled={loading} />
      <Link href="/sign-up" style={styles.textButton}>
        Create an account
      </Link>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignInScreen;