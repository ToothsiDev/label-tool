import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useAuth } from './auth';

export default function Login({ history }) {
  const { login } = useAuth();
  const responseGoogle = async accessToken => {
    try {
      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        body: JSON.stringify({ accessToken: accessToken }),
      });

      const data = await res.json();
      if (data && data.success && data.user) {
        login({
          ...data,
        });
        history.push('/');
      }
    } catch (error) {
      // history.push('/login');
      console.log(error);
    }
  };
  const failureGoogle = response => {
    console.log(response);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
        buttonText="Login With Google"
        onSuccess={googleResponse =>
          responseGoogle(googleResponse.getAuthResponse().access_token)
        }
        onFailure={failureGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
}
