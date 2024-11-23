import { CartContext } from './CartContext';
import CartModal from './CartModal';
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './Firebase';
import { signOut } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Nvar() {
  const { getTotalItems, user: contextUser } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = getTotalItems();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-dark text-white shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand fs-3 fw-bold mb-0 text-white">
            ECOFASHION
          </Link>
          <div className="d-flex gap-3 align-items-center">
            {user ? (
              <>
                <span className="text-white">{user.email}</span>
                {user.email === 'admin@gmail.com' && (
                  <Link to="/admin" className="btn btn-outline-light">
                    Panel Admin
                  </Link>
                )}
                <button 
                  className="btn btn-outline-light" 
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
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
              className="d-flex align-items-center cursor-pointer position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsCartOpen(true)}
            >
              <i className="bi bi-cart fs-4"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                  <span className="visually-hidden">productos en el carrito</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Nvar;