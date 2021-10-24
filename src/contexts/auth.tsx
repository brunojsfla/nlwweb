import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string,
    avatar_url: string,
    nome: string,
    login: string
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

interface AuthResponse {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        nome: string,
        login: string
    }
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children : ReactNode;
}

export function AuthProvider(props: AuthProvider){
    const [user, setUser] = useState<User | null>(null);
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=8e264661cb7999448560`;

    async function signIn(githubCode: string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        });

        const { token, user } = response.data;

        localStorage.setItem('@user:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        console.log({user});
        
    }

    function signOut(){
        setUser(null);
        localStorage.removeItem('@user:token');
    }

    useEffect(() => {
        const token = localStorage.getItem('@user:token');

        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User>('profile').then(response => {
                setUser(response.data);
            });
        }
    }, []);

    useEffect(() =>{
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if(hasGithubCode){
            const [urlWithoutCode, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    }, []);

    return(
        <AuthContext.Provider value={{ user, signInUrl, signOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}