// Logout.js
import React from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';

function Logout() {
  const handleLogout = () => {
    signOut(auth).then(() => {
      alert('Sesión cerrada con éxito');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  return (
    <button onClick={handleLogout}> <i className="bi bi-person-x fs-4"></i></button>
  );
}

export default Logout;
