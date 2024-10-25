import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';

function ProductDescription() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  // Base de datos de productos//
  const productos = [
    {
      id: 1,
      nombre: 'Chaqueta Algodon regular',
      precio: 29990,
      imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/883112989_1/w=800,h=800,fit=pad',
      descripcion: 'Chaqueta de algodón regular fit, perfecta para el uso diario. Confeccionada con algodón 100% orgánico, esta prenda combina comodidad y estilo de manera sostenible. Disponible en varios colores.',
      caracteristicas: [
        'Material: 100% Algodón orgánico',
        'Fit: Regular',
        'Cierre: Botones',
        'Bolsillos laterales',
        'Lavable a máquina'
      ]
    },
    {
      id: 2,
      nombre: 'Chaqueta de Hombre',
      precio: 27990,
      imagen: 'https://static.dafiti.cl/p/levis-1694-9904512-1-zoom.jpg',
      descripcion: 'Chaqueta clásica para hombre con un diseño versátil que se adapta a cualquier ocasión. Confeccionada con materiales de alta calidad para garantizar durabilidad y confort.',
      caracteristicas: [
        'Material: Mezcla de algodón y poliéster',
        'Fit: Regular',
        'Cierre: Cremallera',
        'Bolsillos múltiples',
        'Forro interior'
      ]
    },
    {
        id: 3,
        nombre: 'Camisa manga larga',
        precio: 14990,
        imagen: 'https://nautica.cl/cdn/shop/products/WR8390_4FXDEF_001_35d316d5-1922-40dc-8f94-9504da06cbca.jpg?v=1686236223',
        descripcion: 'Camisa de manga larga confeccionada con algodón de alta calidad que garantiza comodidad y durabilidad. Su diseño versátil la hace perfecta para cualquier ocasión, desde una reunión de trabajo hasta una salida casual. El corte clásico favorece a cualquier tipo de cuerpo.',
        caracteristicas: [
          'Material: Algodón 100% peinado',
          'Manga larga con puños ajustables',
          'Botones nacarados',
          'Bolsillo en el pecho',
          'Corte clásico',
          'Fácil planchado',
          'Disponible en varios colores'
        ]
      },
      {
        id: 4,
        nombre: 'Chaqueta de Mujer',
        precio: 19990,
        imagen: 'https://www.gnomowear.cl/cdn/shop/files/Felver-Chaqueta-Brown_Mujer_Gnomo_1200x.jpg?v=1711543350',
        descripcion: 'Elegante chaqueta para mujer que combina estilo y funcionalidad. Diseñada pensando en la mujer moderna, esta prenda ofrece un ajuste favorecedor y versatilidad para diferentes ocasiones. Su diseño atemporal asegura que permanezca en tendencia temporada tras temporada.',
        caracteristicas: [
          'Material: Poliéster de alta calidad con forro suave',
          'Fit: Semi-entallado femenino',
          'Cierre frontal con botones decorativos',
          'Bolsillos laterales con diseño discreto',
          'Manga larga con detalle en puños',
          'Ideal para looks formales e informales',
          'Disponible en varios colores'
        ]
      },
      {
        id: 5,
        nombre: 'Camisa manga larga algodon slim',
        precio: 14990,
        imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/882840835_1/w=1004,h=1500,fit=cover',
        descripcion: 'Camisa slim fit de manga larga diseñada para un look moderno y elegante. El corte ajustado realza la silueta masculina mientras mantiene la comodidad. Perfecta para ocasiones formales o para crear un look smart casual distintivo.',
        caracteristicas: [
          'Material: Algodón premium con elastano',
          'Corte: Slim fit',
          'Cuello italiano',
          'Puños ajustables',
          'Tejido easy care',
          'Resistente a las arrugas',
          'Ideal para ocasiones formales'
        ]
      },
      {
        id: 6,
        nombre: 'Chaqueta Biker',
        precio: 41990,
        imagen: 'https://www.amaliajeans.cl/cdn/shop/files/4464-5-6454c115-24f7-4a81-b517-42328cbfd244_9bf74998-f216-4362-83d6-7b6baf93ea4d_2048x.jpg?v=1718028150',
        descripcion: 'Chaqueta estilo biker que combina actitud y estilo. Confeccionada con materiales de alta calidad, esta prenda añade un toque de rebeldía a cualquier outfit. Sus detalles metálicos y el diseño clásico la convierten en una pieza statement de tu guardarropa.',
        caracteristicas: [
          'Material: Cuero sintético de alta calidad',
          'Forro interior completo',
          'Herrajes metálicos premium',
          'Múltiples bolsillos con cierre',
          'Cierre diagonal distintivo',
          'Hombreras reforzadas',
          'Ajuste en cintura'
        ]
      },
      {
        id: 7,
        nombre: 'Parca con capucha de Mujer',
        precio: 64990,
        imagen: 'https://home.ripley.cl/store/Attachment/WOP/D129/2000387149277/2000387149277-3.jpg',
        descripcion: 'Parca moderna y funcional diseñada para proteger del frío y la lluvia sin sacrificar el estilo. Su diseño versátil y detalles técnicos la hacen perfecta para el día a día en temporada de invierno. La capucha desmontable añade practicidad.',
        caracteristicas: [
          'Material: Tejido técnico impermeable',
          'Aislamiento térmico de alta calidad',
          'Capucha desmontable ajustable',
          'Cierre frontal doble con solapa',
          'Bolsillos con cierre impermeable',
          'Puños ajustables con velcro',
          'Cordón ajustable en cintura'
        ]
      },
      {
        id: 8,
        nombre: 'Vestido ajustado',
        precio: 20990,
        imagen: 'https://cdn1.moldesunicose.com/18660-large_default/molde-vestido-ajustado-mujer-2409.jpg',
        descripcion: 'Vestido ajustado que realza la silueta femenina con elegancia y sofisticación. El diseño atemporal y el corte favorecedor lo convierten en una pieza versátil para diferentes ocasiones. La tela de alta calidad asegura comodidad y durabilidad.',
        caracteristicas: [
          'Material: Mezcla de viscosa y elastano',
          'Corte: Ajustado bodycon',
          'Largo a la rodilla',
          'Escote redondo elegante',
          'Tejido con elasticidad',
          'Forro interior parcial',
          'Cierre invisible en espalda'
        ]
      },
      {
        id: 9,
        nombre: 'Chaqueta de vestir formal',
        precio: 49990,
        imagen: 'https://trialcl.vtexassets.com/arquivos/ids/3404867/0.jpg?v=638647154725930000',
        descripcion: 'Chaqueta formal de corte clásico, ideal para ocasiones especiales y entornos profesionales. La confección de alta calidad y los detalles refinados la convierten en una pieza esencial para el guardarropa formal. Perfecta para combinar con pantalones de vestir.',
        caracteristicas: [
          'Material: Lana mezclada de alta calidad',
          'Forro completo en acetato',
          'Botones premium',
          'Bolsillos con solapa',
          'Abertura trasera central',
          'Bolsillo interior',
          'Corte slim fit moderno'
        ]
      },
      {
        id: 10,
        nombre: 'Camisa cuello mao',
        precio: 89900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw9d801d69/images/hi-res/Todo/camisas-para-hombre-60010723-52076_1.jpg?sw=700&sh=700',
        descripcion: 'Camisa de cuello mao para hombre, perfecta para un look casual pero elegante. El diseño sin cuello le da un toque moderno y versátil, ideal para combinar con jeans o pantalones formales.',
        caracteristicas: [
          'Material: Algodón suave',
          'Fit: Regular',
          'Cierre: Botones',
          'Manga larga con puños ajustables',
          'Disponible en varios colores'
        ]
      },
      {
        id: 11,
        nombre: 'Chaqueta Tipo Trucker En Denim',
        precio: 129900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw1fa06e21/images/hi-res/Todo/chaquetas-para-hombre-60080125-51_1.jpg?sw=700&sh=700',
        descripcion: 'Chaqueta tipo trucker en denim con un diseño clásico y atemporal. Perfecta para complementar cualquier look casual. Confeccionada con denim de alta calidad, es ideal para uso diario.',
        caracteristicas: [
          'Material: 100% Algodón denim',
          'Corte: Regular fit',
          'Bolsillos en el pecho con solapa',
          'Botones metálicos',
          'Lavable a máquina'
        ]
      },
      {
        id: 12,
        nombre: 'Jean Regular Tono Negro',
        precio: 69900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwfd9704c0/images/hi-res/Todo/jeans-mujer-40160345-10_1.jpg?sw=700&sh=700',
        descripcion: 'Jeans de corte regular en tono negro, diseñados para ofrecer comodidad y estilo. La versatilidad del color negro los convierte en una pieza esencial para cualquier guardarropa.',
        caracteristicas: [
          'Material: Mezcla de algodón y elastano',
          'Corte: Regular fit',
          'Tono: Negro profundo',
          'Cierre: Cremallera y botón',
          'Cinco bolsillos'
        ]
      },
      {
        id: 13,
        nombre: 'Chaqueta Trucker Tono Negro',
        precio: 129900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwfa8cb9fd/images/hi-res/Todo/chaquetas-para-mujer-40080228-10_1.jpg?sw=700&sh=700',
        descripcion: 'Chaqueta tipo trucker en tono negro para mujer. Esta prenda icónica añade un toque moderno a cualquier look, con un ajuste que favorece la silueta femenina.',
        caracteristicas: [
          'Material: Denim de alta calidad',
          'Corte: Slim fit',
          'Cierre: Botones metálicos',
          'Bolsillos en el pecho',
          'Disponible en varios tonos'
        ]
      },
      {
        id: 14,
        nombre: 'Jean Regular Tono Oscuro',
        precio: 69900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw2bd0fc62/images/hi-res/Todo/jeans-mujer-40160348-539_2.jpg?sw=700&sh=700',
        descripcion: 'Jeans de corte regular en tono oscuro para mujer, diseñados para un look casual con un toque sofisticado. La mezclilla de alta calidad asegura comodidad y durabilidad.',
        caracteristicas: [
          'Material: Mezcla de algodón y elastano',
          'Corte: Regular fit',
          'Tono: Azul oscuro',
          'Cierre: Cremallera y botón',
          'Cinco bolsillos'
        ]
      },
      {
        id: 15,
        nombre: 'Vestido Off Shoulder',
        precio: 49900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw3103482d/images/hi-res/Todo/vestidos-para-mujer-40170276-3251_3.jpg?sw=700&sh=700',
        descripcion: 'Vestido Off Shoulder diseñado para un look elegante y femenino. Su corte ajustado y el escote off shoulder lo convierten en una opción perfecta para ocasiones especiales.',
        caracteristicas: [
          'Material: Poliéster y elastano',
          'Corte: Ajustado',
          'Escote: Off shoulder',
          'Largo: Hasta la rodilla',
          'Disponible en varios colores'
        ]
      },
      {
        id: 16,
        nombre: 'Vestido Largo Escote en V',
        precio: 89900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dwf267c2bd/images/hi-res/Todo/vestidos-para-mujer-40170260-06_1.jpg?sw=700&sh=700',
        descripcion: 'Vestido largo con escote en V que destaca por su elegancia y estilo. Ideal para eventos formales o casuales. La tela suave y fluida garantiza comodidad durante todo el día.',
        caracteristicas: [
          'Material: Poliéster de alta calidad',
          'Escote: En V',
          'Largo: Maxi',
          'Tirantes ajustables',
          'Disponible en varios colores'
        ]
      },
      {
        id: 17,
        nombre: 'Vestido con Anudado',
        precio: 19900,
        imagen: 'https://www.ostu.com/dw/image/v2/BHFM_PRD/on/demandware.static/-/Sites-storefront_catalog_ostu/default/dw5ccc425d/images/hi-res/Todo/vestidos-para-mujer-40170264-10_1.jpg?sw=700&sh=700',
        descripcion: 'Vestido casual con detalle anudado en la cintura para un ajuste favorecedor. Su diseño versátil lo convierte en una opción perfecta tanto para el día como para la noche.',
        caracteristicas: [
          'Material: Viscosa y elastano',
          'Corte: Ajustado',
          'Anudado en la cintura',
          'Largo: Mini',
          'Disponible en varios colores'
        ]
      },
      {
        id: 18,
        nombre: 'Parca deportiva hombre costuras',
        precio: 19990,
        imagen: 'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/BGHZ_STG/on/demandware.static/-/Sites-master-catalog-tricot/default/dwb672a26d/images/large/MD272202.jpg?sw=1000&sh=1000&sm=fit&q=100&strip=false',
        descripcion: 'Parca deportiva para hombre con costuras reforzadas, diseñada para ofrecer máxima protección y comodidad en actividades al aire libre. Ideal para climas fríos.',
        caracteristicas: [
          'Material: Tejido técnico impermeable',
          'Aislamiento térmico',
          'Cierre frontal con cremallera',
          'Capucha ajustable',
          'Disponible en varios colores'
        ]
      },
      {
        id: 19,
        nombre: 'Parka Sin Mangas Deportiva Hombre Mountain Gear',
        precio: 29990,
        imagen: 'https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaCL/883118095_1/w=1004,h=1500,fit=cover',
        descripcion: 'Parka sin mangas de estilo deportivo para hombre de la marca Mountain Gear. Ideal para actividades al aire libre, ofrece protección ligera y libertad de movimiento.',
        caracteristicas: [
          'Material: Tejido técnico resistente al agua',
          'Sin mangas para mayor movilidad',
          'Cierre frontal con cremallera',
          'Bolsillos laterales con cierre',
          'Ligero y cómodo'
        ]
      },
      {
        id: 20,
        nombre: 'Polera de verano',
        precio: 3990,
        imagen: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQoPDiUKtQWas7xY__scswETMz2OfFsAy5KoNayvFO4-k2ISgSoySlPYn4ogy1oOWj1wOMmN7rIj5bbEqDdKwzlrxfQNpqhZMpRGiZHyTAUIKsJQtEUXU16DA&usqp=CAY',
        descripcion: 'Polera ligera de verano, ideal para mantener la frescura en los días calurosos. Su diseño simple y cómodo la convierte en una prenda básica imprescindible.',
        caracteristicas: [
          'Material: Algodón 100%',
          'Corte: Regular fit',
          'Cuello redondo',
          'Manga corta',
          'Disponible en varios colores'
        ]
      }
      
    ];
 


  const producto = productos.find(p => p.id === parseInt(id));

  if (!producto) {
    return <div className="container py-5">Producto no encontrado</div>;
  }

  const handleAddToCart = () => {
    const productoConCantidad = {
      ...producto,
      cantidad: quantity
    };
    addToCart(productoConCantidad);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '600px', width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-12 col-md-6">
          <h1 className="fs-2 fw-bold mb-3">{producto.nombre}</h1>
          <p className="fs-3 fw-bold mb-4">${producto.precio.toLocaleString()}</p>
          
          <div className="mb-4">
            <h2 className="fs-5 fw-semibold mb-2">Descripción</h2>
            <p className="text-muted">{producto.descripcion}</p>
          </div>

          <div className="mb-4">
            <h2 className="fs-5 fw-semibold mb-2">Características</h2>
            <ul className="list-unstyled">
              {producto.caracteristicas.map((caracteristica, index) => (
                <li key={index} className="mb-2">
                  <i className="bi bi-check2 me-2 text-success"></i>
                  {caracteristica}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="form-label">Cantidad</label>
            <div className="input-group" style={{ width: '140px' }}>
              <button 
                className="btn btn-outline-dark" 
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <i className="bi bi-dash"></i>
              </button>
              <input
                type="number"
                className="form-control text-center"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button 
                className="btn btn-outline-dark" 
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>

          <button 
            className="btn btn-dark btn-lg w-100" 
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDescription;