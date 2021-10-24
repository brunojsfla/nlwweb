import { useContext, useEffect, useState } from 'react';
import {VscGithubInverted} from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import styles from './styles.module.scss'

export function LoginBox(){
    const {user, signInUrl} = useContext(AuthContext);

    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24" />
                {user ? user.nome || user.login : 'Entrar com o GitHub'}
            </a>
        </div>
    );
}