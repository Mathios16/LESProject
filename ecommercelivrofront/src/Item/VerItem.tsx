import React, { useState, useEffect, } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, CreditCard } from '@phosphor-icons/react';

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
  category?: String[];
  tag?: string;
}

const categoriesName = [
  { id: "ASTRONOMIA", name: "Astronomia" },
  { id: "FICCAO_CIENTIFICA", name: "Ficção Científica" },
  { id: "FANTASIA", name: "Fantasia" },
  { id: "ACAO", name: "Ação" },
  { id: "ROMANCE", name: "Romance" },
  { id: "ADOLECENTE", name: "Adolescente" },
  { id: "ESPACIAL", name: "Espacial" },
  { id: "FILOSOFIA_POLITICA", name: "Filosofia Política" }
];

const VerItem: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [item, setItem] = useState<Item>();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const fetchItem = async () => {

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/items/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setItem(data);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (!item) {
    return <div>Item não encontrado</div>;
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    try {
      await fetch(`http://localhost:8080/cart/25`, {
        method: 'POST',
        credentials: 'include',

      });
      setIsInCart(true);
      alert(`${quantity} ${item.title}(s) adicionado(s) ao carrinho!`);
    } catch (error) {
      console.error('Error inserting items:', error);
    }
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
                {item.category?.map(cat => categoriesName.find(c => c.id === cat)?.name).join(', ')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerItem;