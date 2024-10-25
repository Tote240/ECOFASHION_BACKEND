import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext'; 
import '../Com/style.css'

function Productos() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState(''); 

  const productos = [
    {
      id: 1,
      nombre: 'Chaqueta Algodon regular',
      precio: 29990,
      imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/883112989_1/w=800,h=800,fit=pad',
      categoria: 'Chaquetas',
    },
    {
      id: 2,
      nombre: 'Chaqueta de Hombre',
      precio: 27990,
      imagen: 'https://static.dafiti.cl/p/levis-1694-9904512-1-zoom.jpg',
      categoria: 'Chaquetas',
    },
    {
      id: 3,
      nombre: 'Camisa manga larga',
      precio: 14990,
      imagen: 'https://nautica.cl/cdn/shop/products/WR8390_4FXDEF_001_35d316d5-1922-40dc-8f94-9504da06cbca.jpg?v=1686236223',
      categoria: 'Camisa',
    },
    {
        id: 4,
        nombre: 'Chaqueta de Mujer',
        precio: 19990,
        imagen: 'https://www.gnomowear.cl/cdn/shop/files/Felver-Chaqueta-Brown_Mujer_Gnomo_1200x.jpg?v=1711543350', 
        categoria: 'Chaquetas',
      },
      {
        id: 5,
        nombre: 'Camisa manga larga algodon slim',
        precio: 14990,
        imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/882840835_1/w=1004,h=1500,fit=cover',
        categoria: 'Camisa',
      },
      {
        id: 6,
        nombre: 'Chaqueta Biker',
        precio: 41990,
        imagen: 'https://www.amaliajeans.cl/cdn/shop/files/4464-5-6454c115-24f7-4a81-b517-42328cbfd244_9bf74998-f216-4362-83d6-7b6baf93ea4d_2048x.jpg?v=1718028150',
        categoria: 'Chaquetas',
      },
      {
        id: 7,
        nombre: 'Parca con capucha de Mujer',
        precio: 64990,
        imagen: 'https://home.ripley.cl/store/Attachment/WOP/D129/2000387149277/2000387149277-3.jpg',
        categoria: 'Parcas',
      },
      {
        id: 8,
        nombre: 'Vestido ajustado',
        precio: 20990,
        imagen: 'https://cdn1.moldesunicose.com/18660-large_default/molde-vestido-ajustado-mujer-2409.jpg',
        categoria: 'Vestidos',
      },
      {
        id: 9,
        nombre: 'Chaqueta de vestir formal',
        precio: 49990,
        imagen: 'https://trialcl.vtexassets.com/arquivos/ids/3404867/0.jpg?v=638647154725930000',
        categoria: 'Chaquetas',
      },
      {
        id: 10,
        nombre: 'Camisa cuello mao',
        precio: 89900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw9d801d69/images/hi-res/Todo/camisas-para-hombre-60010723-52076_1.jpg?sw=700&sh=700',
        categoria: 'Camisa',
      },
      {
        id: 11,
        nombre: 'Chaqueta Tipo Trucker En Denim',
        precio: 129900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw1fa06e21/images/hi-res/Todo/chaquetas-para-hombre-60080125-51_1.jpg?sw=700&sh=700',
        categoria: 'Chaquetas',
      },
      {
        id: 12,
        nombre: 'Jean Regular Tono Negro',
        precio: 69900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwfd9704c0/images/hi-res/Todo/jeans-mujer-40160345-10_1.jpg?sw=700&sh=700',
        categoria: 'Jeans',
      },
      {
        id: 13,
        nombre: 'Chaqueta Trucker Tono Negro',
        precio: 129900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwfa8cb9fd/images/hi-res/Todo/chaquetas-para-mujer-40080228-10_1.jpg?sw=700&sh=700',
        categoria: 'Chaquetas',
      },
      {
        id: 14,
        nombre: 'Jean Regular Tono Oscuro',
        precio: 69900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw2bd0fc62/images/hi-res/Todo/jeans-mujer-40160348-539_2.jpg?sw=700&sh=700',
        categoria: 'Jeans',
      },
      {
        id: 15,
        nombre: 'Vestido Off Shoulder',
        precio: 49900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw3103482d/images/hi-res/Todo/vestidos-para-mujer-40170276-3251_3.jpg?sw=700&sh=700',
        categoria: 'Vestidos',
      },
      {
        id: 16,
        nombre: 'Vestido Largo Escote en V',
        precio: 89900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwf267c2bd/images/hi-res/Todo/vestidos-para-mujer-40170260-06_1.jpg?sw=700&sh=700',
        categoria: 'Vestidos',
      },
      {
        id: 17,
        nombre: 'Vestido con Anudado',
        precio: 19900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw5ccc425d/images/hi-res/Todo/vestidos-para-mujer-40170264-10_1.jpg?sw=700&sh=700',
        categoria: 'Vestidos',
      },
      {
        id: 18,
        nombre: 'Parca deportiva hombre costuras',
        precio: 19990,
        imagen: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BGHZ_STG/on/demandware.static/-/Sites-master-catalog-tricot/default/dwb672a26d/images/large/MD272202.jpg?sw=1000&sh=1000&sm=fit&q=100&strip=false',
        categoria: 'Parcas',
      },
      {
        id: 19,
        nombre: 'Parka Sin Mangas Deportiva Hombre Mountain Gear',
        precio: 29990,
        imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/883118095_1/w=1004,h=1500,fit=cover',
        categoria: 'Chaquetas',
      },
      {
        id: 20,
        nombre: 'Polera de verano',
        precio: 3990,
        imagen: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQoPDiUKtQWas7xY__scswETMz2OfFsAy5KoNayvFO4-k2ISgSoySlPYn4ogy1oOWj1wOMmN7rIj5bbEqDdKwzlrxfQNpqhZMpRGiZHyTAUIKsJQtEUXU16DA&usqp=CAY',
        categoria: 'Poleras',
      },
      

      
  ];

 const handleImageClick = (id) => {
    navigate(`/descripcion/${id}`);
  };
  // Filtrar productos según la búsqueda, precio y categoría
  const filteredProducts = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) &&

    (selectedCategory === '' || producto.categoria === selectedCategory)
  );

  return (
    <div className="container py-5">
      {/* Busqueda */}
      <div className="mb-4">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar productos..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      {/* Categoría */}
      <div className="mb-4">
        <label>Filtrar por categoría:</label>
        <select 
          className="form-select" 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Chaquetas">Chaquetas</option>
          <option value="Poleras">Poleras</option>
          <option value="Jeans">Jeans</option>
          <option value="Parcas">Parcas</option>
          <option value="Camisa">Camisa</option>
          <option value="Vestidos">Vestidos</option>
        </select>
      </div>

      {/* Mostrar productos filtrados */}
      <div className="row g-4">
        {filteredProducts.map((producto) => (
          <div key={producto.id} className="col-12 col-md-4">
            <div className="card border-0">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="card-img-top object-fit-cover"
                style={{ height: '320px', cursor: 'pointer' }}
                onClick={() => handleImageClick(producto.id)} 
              />
              <div className="card-body px-0">
                <h3 className="card-title fs-5">{producto.nombre}</h3>
                <p className="card-text fs-4 fw-bold">${producto.precio.toLocaleString()}</p>
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
    

export default Productos;