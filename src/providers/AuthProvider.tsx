import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Profile } from "../types";

type AuthData = {
    session: Session | null;
    loading: boolean;
    profile: Profile | null;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
    profile: null,
    isAdmin: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {

    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('AuthProvider render', { session: session?.user?.id, loading, isAdmin: profile?.group === 'ADMIN' });

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            console.log('AuthProvider: session set', session?.user?.id);

            if (session) {
                // fetch profile
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(data || null);
                console.log('AuthProvider: profile set', data);
            }
            setLoading(false);
        };
        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('AuthProvider: onAuthStateChange', _event, session?.user?.id);
            setSession(session);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ session, loading, profile, isAdmin: profile?.group === 'ADMIN' }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
