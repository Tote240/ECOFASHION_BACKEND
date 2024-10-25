import React, { useState, useEffect } from 'react';
import './Banner.css';
import imagen1 from '../imagenes/In.jpg'; 

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);


  const bannerImages = [
    {
      url: imagen1, 
      title: "Nueva Colección Invierno",
      subtitle: "Descubre las últimas tendencias en moda sostenible"
    },
    {
      url: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
      title: "Colección Exclusiva",
      subtitle: "Las mejores marcas eco-friendly"
    },
    {
      url: "https://images.pexels.com/photos/5868738/pexels-photo-5868738.jpeg",
      title: "Ofertas Especiales",
      subtitle: "Hasta 50% de descuento"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
    );
  };


  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
    );
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner-container">
      <div className="position-relative" style={{ height: '500px' }}>
        <div className="w-100 h-100">
          <img
            src={bannerImages[currentIndex].url} 
            className="w-100 h-100 object-fit-cover"
            alt={`Banner ${currentIndex + 1}`}
          />
 
          
          

          <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold mb-4">{bannerImages[currentIndex].title}</h1>
            <p className="fs-5 mb-4">{bannerImages[currentIndex].subtitle}</p>
            
            
          </div>


          <button 
            className="position-absolute start-0 top-50 translate-middle-y btn btn-light rounded-circle ms-4"
            onClick={prevSlide}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button 
            className="position-absolute end-0 top-50 translate-middle-y btn btn-light rounded-circle me-4"
            onClick={nextSlide}
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                className={`mx-2 btn btn-light rounded-circle p-2 ${
                  currentIndex === index ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ width: '12px', height: '12px' }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>


      <div className="bg-white py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-truck fs-4"></i>
              <span>Envío gratis en compras sobre $30.000</span>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-arrow-repeat fs-4"></i>
              <span>30 días para cambios y devoluciones</span>
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-shield-check fs-4"></i>
              <span>Compra segura garantizada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
