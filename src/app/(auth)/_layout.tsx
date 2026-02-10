import { useAuth } from '@/providers/AuthProvider';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {

    const { session } = useAuth();
    console.log('AuthLayout render', { session: session?.user?.id });

    if (session) {
        return <Redirect href={'/'} />;
    }

    return (
        <Stack>
            <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
            <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
        </Stack>
    );
}