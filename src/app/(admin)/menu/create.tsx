import { StyleSheet, Image, Text, View, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState } from 'react'
import Button from '@components/Button'
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker'
import { Stack, useLocalSearchParams } from 'expo-router';

const CreateProductScreen = () => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id } = useLocalSearchParams();

  const isUpdating = !!id;

  const resetFields = () => {
    setName('');
    setPrice('');
    setImage(null);
    setErrors('');
  };

  const validateInput = () => {
    setErrors('');
    if (!name && !price) {
      setErrors('Please enter both name and price');
      return false;
    }
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price must be a number');
      return false;
    }
    return true;
  }

  const onSubmit = () => {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  }

  const onUpdate = () => {
    if (!validateInput()) {
      return;
    }

    console.log('Updating Product: ', name);

    // save in the database

    resetFields();
  }

  const onCreate = () => {
    if (!validateInput()) {
      return;
    }

    console.log('Creating Product: ', name);

    // save in the database

    resetFields();
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const onDelete = () => {
    console.warn('DELETE!!!!!')
  }

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      }
    ])
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding' keyboardVerticalOffset={100}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
      <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
      <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput placeholder='Pizza' style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Price (₹)</Text>
      <TextInput placeholder='99.00' style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} />

      <Text style={{ color: 'red', textAlign: 'center' }}>{errors}</Text>
      <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />
      {isUpdating && <Text onPress={confirmDelete} style={styles.textButton}>Delete</Text>}
    </KeyboardAvoidingView>
  )
}

export default CreateProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center'
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
  }
})