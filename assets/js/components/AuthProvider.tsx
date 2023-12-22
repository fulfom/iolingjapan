import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { auth } from '@js/firebase-initialize';
import { User } from 'firebase/auth';

const AuthContext = createContext<User | null>(null);

export function useAuthContext() {
    const user = useContext(AuthContext);
    if (user === null) throw new Error("Provider null")
    return user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(auth.currentUser);

    const value = useMemo(() => {
        return user
    }, [user])

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((usertmp) => {
            setUser(usertmp);
        });
        return () => {
            unsubscribed();
        };
    }, []);

    return (user === null ? <div>読み込み中</div> :
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

};