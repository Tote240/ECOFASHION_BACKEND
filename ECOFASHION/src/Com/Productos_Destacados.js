import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';  

function Pd() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 

  const productosDestacados = [
    {
      id: 1,
      nombre: 'Chaqueta marron de polar',
      precio: 19990,
      imagen: 'https://resize.sprintercdn.com/f/1440x1440/products/0384637/regatta-kemilia_0384637_03_4_1055525880.jpg?w=1440&q=75'
    },
    {
      id: 2,
      nombre: 'Chaqueta traje formal',
      precio: 79990,
      imagen: 'https://www.perryellis.cl/arquivos/ids/416655-700-1000/label-0.jpg?v=638630515006970000'
    },
    {
      id: 3,
      nombre: 'Chaqueta Acolchada Regular Fit Mujer',
      precio: 29990,
      imagen: 'https://www.stedman.eu/out/pictures-2024/zoom/ST5520_model.jpg?02012023'
    }
  ];

  const handleButtonClick = () => {
    navigate('/Productos'); 
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fs-2 fw-semibold">Mejores productos</h2>
        <button className="btn btn-dark px-4" onClick={handleButtonClick}>
          VER MAS
        </button>
      </div>
      <div className="row g-4">
        {productosDestacados.map((producto) => (
          <div key={producto.id} className="col-12 col-md-4">
            <div className="card border-0">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="card-img-top object-fit-cover"
                style={{ height: '320px' }}
              />
              <div className="card-body px-0">
                <h3 className="card-title fs-5">{producto.nombre}</h3>
                <p className="card-text fs-4 fw-bold">
                  ${producto.precio.toLocaleString()}
                </p>
                <button 
                  className="btn btn-dark" 
                  onClick={() => addToCart(producto)}  
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pd;