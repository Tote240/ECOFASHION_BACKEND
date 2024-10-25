import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Nvar from './Com/nvar';  
import Banner from './Com/Banner';
import Pd from './Com/Productos_Destacados';
import Pie from './Com/Pie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Productos from './Com/Productos';
import { CartProvider } from './Com/CartContext';  
import ProductDescription from './Com/DescripcionP';
import Login from './Com/Login';
import Register from './Com/Registro';
import AdminPanel from './Com/AdminPanel';
import ContactForm from './Com/Formulario';


function App() {
  return (
    <CartProvider> 
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Nvar />
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Banner />
                  <Pd />
                </>
              } 
            />
            <Route path="/Productos" element={<Productos />} />
            <Route path="/descripcion/:id" element={<ProductDescription />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} /> {/* Ruta de administración */}
            <Route path="/contact" element={<ContactForm />} />

          </Routes>
          <Pie />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
