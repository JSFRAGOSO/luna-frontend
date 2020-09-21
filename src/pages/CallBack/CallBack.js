import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';
import './CallBack.css';

function CallBack({history}) {
  const params =  new URLSearchParams(useLocation().search);
  const { signIn } = useAuth();

  useEffect(() => {
    const code = params.get('code');

    async function loadToken() {
      signIn({code, redirect_uri:'http://localhost:3000/callback'})
      history.push('dashboard')
    }

    loadToken()
  }, [history, params, signIn])

  return (
    <div className="CallBack">
      <div className="CallBack-content">
        <p>
          Você será redirecionado em breve...
        </p>
      </div>
    </div>
  );
}

export default CallBack;
