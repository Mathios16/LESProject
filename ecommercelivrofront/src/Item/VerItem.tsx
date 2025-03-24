import React, { useState } from 'react';
import { ShoppingCart, CreditCard } from '@phosphor-icons/react';

interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  date: string;
  edition: string;
  isbn: string;
  pages: number;
  synopsis: string;
  publisher: string;
  pricingGroup: string;
  height: number;
  width: number;
  depth: number;
  barcode: number;
  image: string;
  category?: Category[];
  tag?: string;
}

const VerItem: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);

  const item = {
    id: 1,
    title: 'A cantiga dos pássaros e das serpentes',
    price: 10.99,
    image: 'https://m.media-amazon.com/images/I/61MCf2k-MgS._AC_UF1000,1000_QL80_.jpg',
    category: [{ id: 1, name: 'Ação' }],
    description: 'Um livro emocionante que explora os limites da sobrevivência e do poder.',
    date: '2023-01-01',
    edition: '1ª Edição',
    isbn: '978-0-3856-1734-4',
    pages: 517,
    synopsis: 'Décadas antes de Katniss Everdeen, a 10ª edição anual dos Jogos Vorazes vai revelar como a traição pode surgir nos lugares mais inesperados.',
    publisher: 'Rocco',
    pricingGroup: 'A',
    height: 23,
    width: 16,
    depth: 3,
    barcode: 7890123456,
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    // TODO: Implement actual cart functionality
    setIsInCart(true);
    alert(`${quantity} ${item.title}(s) adicionado(s) ao carrinho!`);
  };

  const handleBuyNow = () => {
    // TODO: Implement purchase flow
    alert(`Comprando ${quantity} ${item.title}(s)`);
  };

  return (
    <div className="item-detail-container">
      <div className="item-detail-content">
        <div className="item-image-section">
          <div className="item-image">
            <img 
              src={item.image} 
              alt={item.title} 
            />
          </div>
        </div>
        
        <div className="item-info-section">
          <h1>{item.title}</h1>
          
          <div className="item-meta">
            <span>Editora: {item.publisher}</span>
            <span>Edição: {item.edition}</span>
            <span>ISBN: {item.isbn}</span>
          </div>
          
          <div className="item-price-section">
            <h2 className="item-price">R$ {item.price.toFixed(2)}</h2>
          </div>
          
          <div className="item-quantity-selector">
            <button 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>
              +
            </button>
          </div>
          
          <div className="item-actions">
            <button 
              className={`btn-add-to-cart ${isInCart ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              <ShoppingCart weight="bold" />
              {isInCart ? 'Adicionado' : 'Adicionar ao Carrinho'}
            </button>
            
            <button 
              className="btn-buy-now"
              onClick={handleBuyNow}
            >
              <CreditCard weight="bold" />
              Comprar Agora
            </button>
          </div>
          
          <div className="item-description">
            <h3>Descrição</h3>
            <p>{item.description}</p>
          </div>
          
          <div className="item-synopsis">
            <h3>Sinopse</h3>
            <p>{item.synopsis}</p>
          </div>
          
          <div className="item-details">
            <h3>Detalhes do Livro</h3>
            <ul>
              <li><strong>Páginas:</strong> {item.pages}</li>
              <li><strong>Dimensões:</strong> {item.height}cm x {item.width}cm x {item.depth}cm</li>
              <li><strong>Código de Barras:</strong> {item.barcode}</li>
              <li>
                <strong>Categorias:</strong> 
                {item.category?.map(cat => cat.name).join(', ')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerItem;