import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Button from '../components/Button';
import { Link } from 'expo-router';
import { SafeAreaProvider } from "react-native-safe-area-context";

const index = () => {
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
      <Link href={'/sign-in'} asChild>
        <Button text="Sign in" />
      </Link>
    </View>
    </SafeAreaProvider>
  );
};

export default index;