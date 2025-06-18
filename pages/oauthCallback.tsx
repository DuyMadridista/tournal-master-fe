"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '../app/help/loading';

const OAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const access_token = searchParams?.get('access_token');
      const user = searchParams?.get('user');

      console.log({ access_token, user });

      if (access_token && user) {
        // Dynamically import auth handling logic
        const { setAuthToken, setUserData } = await import('../utils/authCookies');

        setAuthToken(access_token);
        setUserData(JSON.parse(user));

        router.replace('/');
      } else {
        router.replace('/login');
      }
    };

    handleAuth();
  }, [router, searchParams]);

  return <Loading></Loading>;
};

export default OAuthCallback;
