import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        try {
            const encrypted = await SecureStore.getItemAsync(key);
            if (!encrypted) { return encrypted; }

            // Check for chunked data
            if (encrypted.startsWith('chunked:')) {
                const chunkCount = parseInt(encrypted.split(':')[1]);
                if (isNaN(chunkCount)) return encrypted;

                let combined = '';
                for (let i = 0; i < chunkCount; i++) {
                    const chunk = await SecureStore.getItemAsync(`${key}_chunk_${i}`);
                    if (chunk) combined += chunk;
                }
                return combined;
            }

            return encrypted;
        } catch (error) {
            console.warn('SecureStore getItem error:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            // Clear previous chunks if any
            await ExpoSecureStoreAdapter.removeItem(key);

            const chunkSize = 2000; // Leaving some buffer for metadata/overhead if needed by system
            if (value.length <= chunkSize) {
                await SecureStore.setItemAsync(key, value);
                return;
            }

            const chunkCount = Math.ceil(value.length / chunkSize);
            await SecureStore.setItemAsync(key, `chunked:${chunkCount}`);

            for (let i = 0; i < chunkCount; i++) {
                const chunk = value.slice(i * chunkSize, (i + 1) * chunkSize);
                await SecureStore.setItemAsync(`${key}_chunk_${i}`, chunk);
            }
        } catch (error) {
            console.warn('SecureStore setItem error:', error);
        }
    },
    removeItem: async (key: string) => {
        try {
            const encrypted = await SecureStore.getItemAsync(key);
            if (encrypted && encrypted.startsWith('chunked:')) {
                const chunkCount = parseInt(encrypted.split(':')[1]);
                if (!isNaN(chunkCount)) {
                    for (let i = 0; i < chunkCount; i++) {
                        await SecureStore.deleteItemAsync(`${key}_chunk_${i}`);
                    }
                }
            }
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.warn('SecureStore removeItem error:', error);
        }
    },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});