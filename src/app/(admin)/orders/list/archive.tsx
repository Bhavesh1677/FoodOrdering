import { FlatList, Text, ActivityIndicator } from 'react-native';
import OrderListItem from '@components/OrderListItem';
import { useAdminOrderList } from '@/api/orders';

export default function OrdersScreen() {

const { data: orders, isLoading, error } = useAdminOrderList({archived:true});

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