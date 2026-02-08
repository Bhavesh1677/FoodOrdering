import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export const useProductList = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        staleTime: 10000,
    })
}

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !!id && id !== -1, // disable query if id is not valid
        staleTime: 10000,
    })
}

export const useInsertProduct = () => {

    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: any) {
            const { error, data: newProduct } = await supabase.from('products').insert({
                name: data.name,
                image: data.image,
                price: data.price
            })
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return newProduct;
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })
}

export const useUpdateProduct = () => {

    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: any) {
            const { error, data: updatedProduct } = await supabase
                .from('products')
                .update({
                    name: data.name,
                    image: data.image,
                    price: data.price
                })
                .eq('id', data.id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return updatedProduct;
        },
        onSuccess(_, data) {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['products', data.id] });
        }
    })
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(id: number) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })
}