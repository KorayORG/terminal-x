'use client';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { JwtPayload } from '@terminal-x/shared';

export default function Dashboard() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token =
      url.searchParams.get('token') || localStorage.getItem('token');
    if (token) {
      localStorage.setItem('token', token);
      setUser(jwtDecode<JwtPayload>(token));
    }
  }, []);

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div className="p-4">
      <p>Hello, {user.username}</p>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
      >
        Logout
      </button>
    </div>
  );
}
