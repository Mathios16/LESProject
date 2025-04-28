import { InputLabel, Select, TextField, MenuItem, FormControl, Grid, Container, Paper, Box, FormGroup, FormLabel, FormControlLabel, Checkbox } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';

interface Item {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string[];
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

const Home: React.FC = () => {
  const { type, id } = useUrlParams();
  const [items, setItems] = useState<Item[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<{ [key: string]: any[] }>({});
  const [searchTitle, setSearchTitle] = useState('');
  const [searchDateAfter, setSearchDateAfter] = useState('');
  const [searchDateBefore, setSearchDateBefore] = useState('');
  const [searchPublisher, setSearchPublisher] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchPriceMin, setSearchPriceMin] = useState('');
  const [searchPriceMax, setSearchPriceMax] = useState('');
  const [searchCategory, setSearchCategory] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTitle) queryParams.append('title', searchTitle);
      if (searchDateAfter) queryParams.append('dateAfter', searchDateAfter);
      if (searchDateBefore) queryParams.append('dateBefore', searchDateBefore);
      if (searchPublisher) queryParams.append('publisher', searchPublisher);
      if (searchAuthor) queryParams.append('author', searchAuthor);
      if (searchPriceMin) queryParams.append('priceMin', searchPriceMin);
      if (searchPriceMax) queryParams.append('priceMax', searchPriceMax);
      if (searchCategory) queryParams.append('category', categoriesName.filter(c => searchCategory.includes(c.name)).map(c => c.id).join(","));

      const response = await fetch(`http://localhost:8080/items${queryParams.toString() ? `?${queryParams.toString()}` : ''}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      let categorizedItems = data.reduce((acc: { [key: string]: any[] }, item: Item) => {
        item.category.forEach(cat => {
          if (!!categoriesName.find(c => c.id === cat)?.name) {
            let catName = categoriesName.find(c => c.id === cat)?.name;
            if (!!catName && !acc[catName]) {
              acc[catName] = [];
            }
            if (!!catName) {
              acc[catName].push(item);
            }
          }
        });
        return acc;
      }, {});

      setItemsByCategory(categorizedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTitle, searchDateAfter, searchDateBefore, searchPublisher, searchAuthor, searchPriceMin, searchPriceMax, searchCategory]);


  const handleItemClick = (item: any) => {
    navigate(`/item/ver/${item.id}${type || id ? `?type=${type}&id=${id}` : ''}`);
  };

  return (
    <div className="container">
      <h1>Nossos Livros</h1>
      <Grid container spacing={2} className="home-container">
        <Grid item xs={3}>
          <Container maxWidth="sm" className="home-search">
            <Paper elevation={3}>
              <Box>
                <FormGroup className="filter-inputs">
                  <FormLabel component="legend">Pesquisar por</FormLabel>
                  <TextField
                    label="Nome do livro"
                    variant="outlined"
                    onChange={e => setSearchTitle(e.target.value)}
                  />
                  <TextField
                    label="Nome da editora"
                    variant="outlined"
                    onChange={e => setSearchPublisher(e.target.value)}
                  />
                  <TextField
                    label="Nome do autor"
                    variant="outlined"
                    onChange={e => setSearchAuthor(e.target.value)}
                  />
                </FormGroup>
                <div className="filter-inputs">
                  <FormGroup>
                    <FormLabel component="legend">Categorias</FormLabel>
                    {categoriesName.map(category => (
                      <FormControlLabel
                        key={category.id}
                        label={category.name}
                        control={
                          <Checkbox
                            checked={searchCategory.includes(category.name)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSearchCategory([...searchCategory, category.name]);
                              } else {
                                setSearchCategory(searchCategory.filter(c => c !== category.name));
                              }
                            }}
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                </div>
                <FormGroup className="filter-inputs">
                  <FormLabel component="legend">Preço</FormLabel>
                  <div className="line-inputs">
                    <TextField
                      label="Minimo"
                      type="number"
                      variant="outlined"
                      onChange={e => setSearchPriceMin(e.target.value)}
                    />
                    <TextField
                      label="Máximo"
                      type="number"
                      variant="outlined"
                      onChange={e => setSearchPriceMax(e.target.value)}
                    />
                  </div>
                </FormGroup>
                <FormGroup className="filter-inputs">
                  <FormLabel component="legend">Ano de Publicação</FormLabel>
                  <div className="line-inputs">
                    <TextField
                      label="Inicial"
                      type="number"
                      variant="outlined"
                      fullWidth
                      onChange={e => setSearchDateBefore(e.target.value)}
                    />
                    <TextField
                      label="Final"
                      type="number"
                      variant="outlined"
                      fullWidth
                      onChange={e => setSearchDateAfter(e.target.value)}
                    />
                  </div>
                </FormGroup>
              </Box>
            </Paper>
          </Container>
        </Grid>
        <div className="home-list">
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
      </Grid>
    </div>
  );
};

export default Home;