import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const isUserLoggedIn = true;

  const colorButton = isUserLoggedIn ? "#04D361" : "#EBA417";

  return (
    <button className={styles.signInButton}>
      <FaGithub color={colorButton} />

      {isUserLoggedIn ? 'Héliton Oliveira' : 'Sign in with GitHub'}
      
      {isUserLoggedIn && <FiX className={styles.closeIcon} />}
    </button>
  )
}

