import { Text, FlatList, ActivityIndicator } from 'react-native';
import OrderListItem from '@components/OrderListItem';
import { useUserOrderList } from '@/api/orders';

export default function OrdersScreen() {

  const { data: orders, isLoading, error } = useUserOrderList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!orders) {
    return <Text>No orders found</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}