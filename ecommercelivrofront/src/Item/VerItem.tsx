import React, { useState, useEffect, } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard } from '@phosphor-icons/react';
import { Alert, Snackbar } from '@mui/material';

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
  const [success, setSuccess] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInCart, setIsInCart] = useState(false);
  const [item, setItem] = useState<Item>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setUserId(navbar.dataset.userId);
    }
  }, []);

  const fetchItem = async () => {

    try {
      let response = await fetch(`http://localhost:8080/items/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const itemData = await response.json();
      setItem(itemData);

      response = await fetch(`http://localhost:8080/cart/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const cartData = await response.json();
      const cartItems = cartData.items || [];

      const itemInCart = cartItems.find((cartItem: { itemId: number }) => cartItem.itemId === itemData.id);
      setIsInCart(!!itemInCart);

    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchItem();
    }
  }, [id, userId]);

  if (!item) {
    return <div>Item não encontrado</div>;
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    try {
      let data = {
        "items": [
          {
            "itemId": item.id,
            "quantity": quantity,
          }
        ]
      };
      await fetch(`http://localhost:8080/cart/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      setIsInCart(true);
      setSuccess(`${quantity} ${item.title}(s) adicionado(s) ao carrinho!`);
    } catch (error) {
      console.error('Error inserting items:', error);
    }
  };

  const handleSeeCart = () => {
    navigate(`/carrinho`);
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
            {isInCart && (
              <button className="btn-see-cart" onClick={handleSeeCart}>
                Ver carrinho
              </button>
            )}
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
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess('');
        }}
      >
        <Alert
          severity="success"
          onClose={() => {
            setSuccess('');
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VerItem;