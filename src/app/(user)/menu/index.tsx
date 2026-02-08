import { FlatList, Platform, ActivityIndicator, Text } from 'react-native';
import ProductListItem from '@components/ProductListItem';
import { StatusBar } from 'expo-status-bar';
import { useProductList } from '@/api/products';

export default function MenuScreen() {

  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <>
      <FlatList 
        data={products}
        renderItem={({ item }) => <ProductListItem product={item}/>}
        numColumns={2}
        contentContainerStyle={{ gap: 10,padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </>
  );
}
