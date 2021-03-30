import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

export function SignInButton() {
  const [session, loading] = useSession();

  return session ? (
    <button 
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub color="#04D361" />
      {session.user.name}
      <FiX className={styles.closeIcon} />
    </button>
  ) : (
    <button 
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#F0CF65" />
      Sitn in with GitHub
    </button>
  )
}

