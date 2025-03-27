import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Sample data - in a real app, this would come from an API
const sampleItems = [
  {
    id: 1,
    title: 'A cantiga dos pássaros e das serpentes',
    price: 59.90,
    image: 'https://m.media-amazon.com/images/I/61MCf2k-MgS._AC_UF1000,1000_QL80_.jpg',
    category: [{ id: 1, name: 'Ação' }]
  },
  {
    id: 2,
    title: 'O Senhor dos Anéis: A Sociedade do Anel',
    price: 45.50,
    image: 'https://m.media-amazon.com/images/I/91b0C2YNSrL._AC_UF1000,1000_QL80_.jpg',
    category: [{ id: 2, name: 'Fantasia' }]
  },
  {
    id: 3,
    title: 'Neuromancer',
    price: 35.99,
    image: 'https://m.media-amazon.com/images/I/91Bx5ilP+EL._SY466_.jpg',
    category: [{ id: 3, name: 'Ficção Científica' }]
  },
  {
    id: 4,
    title: 'Duna',
    price: 55.00,
    image: 'https://m.media-amazon.com/images/I/81zN7udGRUL._SY425_.jpg',
    category: [{ id: 3, name: 'Ficção Científica' }]
  }
];

const Home: React.FC = () => {
  const [itemsByCategory, setItemsByCategory] = useState<{ [key: string]: any[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Group items by category
    const categorizedItems = sampleItems.reduce((acc: { [key: string]: any[] }, item) => {
      item.category.forEach(cat => {
        if (!acc[cat.name]) {
          acc[cat.name] = [];
        }
        acc[cat.name].push(item);
      });
      return acc;
    }, {});

    setItemsByCategory(categorizedItems);
  }, []);

  const handleItemClick = (item: any) => {
    // Navigate to item detail page (you'll need to implement this route)
    navigate(`/item/ver/${item.id}`);
  };

  return (
    <div className="home-container">
      <h1>Nossos Livros</h1>
      {Object.entries(itemsByCategory).map(([category, items]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="items-grid">
            {items.map((item, index) => (
              <div
                key={index}
                className="item-card"
                onClick={() => handleItemClick(item)}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">R$ {item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;