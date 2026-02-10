import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Link, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Button from '../components/Button';

const index = () => {

  const { session, loading, isAdmin } = useAuth();

  console.log('Index render', { session: session?.user?.id, loading, isAdmin });

  if (loading) {
    return (
      <ActivityIndicator />
    );
  }

  if (!session) {
    return (
      <Redirect href={'/sign-in'} />
    );
  }

  if (!isAdmin) {
    return (
      <Redirect href={'/(user)'} />
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
        <Link href={'/(user)'} asChild>
          <Button text="User" />
        </Link>
        <Link href={'/(admin)'} asChild>
          <Button text="Admin" />
        </Link>
        <Button text="Sign out" onPress={() => supabase.auth.signOut()} />
      </View>
    </SafeAreaProvider>
  );
};

export default index;