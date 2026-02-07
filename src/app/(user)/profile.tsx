import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase'
import Button from '@/components/Button'
import { router } from 'expo-router'

const onsubmit = async () => {
  await supabase.auth.signOut();
  router.replace('/sign-in');
}

const profile = () => {
  return (
    <View style={styles.container}>
      <Text>profile</Text>
      <Button text="Sign out" onPress={onsubmit}/>
    </View>
  )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})