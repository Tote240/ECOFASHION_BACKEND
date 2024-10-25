import { CartContext } from './CartContext';
import CartModal from './CartModal';
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged} from 'firebase/auth';

function Nvar() {  
  const { carrito } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión y redirigir al inicio
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');  // Redirigir al inicio tras cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-dark text-white shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand fs-3 fw-bold mb-0 text-white">ECOFASHION</Link>
          <div className="d-flex gap-3">
            {user ? (
              <>
                <span>{user.email}</span>
                <button className="btn btn-outline-light" onClick={handleLogout}>Cerrar sesión</button>
              </>
            ) : (
              <Link 
                to="/login" 
                state={{ from: location.pathname }}
                className="text-white text-decoration-none"
              >
                <i className="bi bi-person fs-4"></i>
              </Link>
            )}
            <div
              className="d-flex align-items-center cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsCartOpen(true)}
            >
              <i className="bi bi-cart fs-4"></i>
              <span className="ms-1">{totalItems}</span>
            </div>
          </div>
        </div>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Nvar;
