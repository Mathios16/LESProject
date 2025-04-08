import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  category: { id: number; name: string }[];
}
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

const categoriesName = {
  ASTRONOMIA: "Astronomia",
  FICCAO_CIENTIFICA: "Ficção Científica",
  FANTASIA: "Fantasia",
  ACAO: "Ação",
  ROMANCE: "Romance",
  ADOLECENTE: "Adolescente",
  ESPACIAL: "Espacial",
  FILOSOFIA_POLITICA: "Filosofia Política"
};

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<{ [key: string]: any[] }>({});
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/items', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      // setItems(data);

      // data.forEach((item: Item) => {
      //   item.category = item.category.map(cat => ({
      //     id: cat.id,
      //     name: cat.name
      //   }));
      // });
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchItems();
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