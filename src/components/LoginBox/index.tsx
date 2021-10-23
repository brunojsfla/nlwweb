import { useEffect, useState } from 'react';
import {VscGithubInverted} from 'react-icons/vsc';
import { api } from '../../services/api';
import styles from './styles.module.scss'

interface AuthResponse {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        nome: string,
        login: string
    }
}

type User = {
    user: {
        id: string,
        avatar_url: string,
        nome: string,
        login: string
    }
}

export function LoginBox(){
    
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=8e264661cb7999448560`;

    async function signIn(githubCode: string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        });

        const { token, user } = response.data;

        localStorage.setItem('@user:token', token);

        console.log({user});
        
    }

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
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com o GitHub
            </a>
        </div>
    );
}