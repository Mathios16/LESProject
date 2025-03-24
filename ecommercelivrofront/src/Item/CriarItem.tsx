import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Trash, Pencil, Eye, EyeSlash } from '@phosphor-icons/react';
import Modal from '../Auxiliares/Modal';

interface Item {
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
  image?: File;
  category?: Category[];
}

interface Category {
  id: number;
  name: string;
  tag?: string;
}

const CriarItem: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [categorySearch, setCategorySearch] = useState('');
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoryTags] = useState(['blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black']);
  const [usedTags, setUsedTags] = useState<string[]>([]);

  const fetchCategories = async (searchTerm: string) => {
    let categories = [];

    setAvailableCategories([{'id': 1, 'name': 'romance', 'tag': 'blue'}]);

    // const response = await fetch('http://localhost:8080/booksCategories?name=' + searchTerm);
    // const data = await response.json();
    // categories = data;

    // setAvailableCategories(categories);
  };

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setCategorySearch(searchTerm);
    if (searchTerm.length > 2) {
      fetchCategories(searchTerm);
    }
  };

  const handleCategorySelect = (category: Category) => {

    if (selectedCategories.some(c => c.id === category.id)) return;

    const availableTags = categoryTags.filter(tag => !usedTags.includes(tag));
    const newTag = availableTags.length > 0 ? availableTags[0] : categoryTags[0];

    const newSelectedCategory = { ...category, tag: newTag };
    setSelectedCategories([...selectedCategories, newSelectedCategory]);
    setUsedTags([...usedTags, newTag]);

    setCategorySearch('');
    setAvailableCategories([]);
  };

  const removeCategory = (categoryToRemove: Category & { tag?: string }) => {
    const updatedCategories = selectedCategories.filter(c => c.id !== categoryToRemove.id);
    setSelectedCategories(updatedCategories);
    
    if (categoryToRemove.tag) {
      setUsedTags(usedTags.filter(tag => tag !== categoryToRemove.tag));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

  };

  return (
    <div className="item-container">
      <div className="header">
        <h1>Cadastro de Livro</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="row-group">
          <div className="form-group">
            <label className="form-label" htmlFor="title">Título</label>
            <input type="text" id="title" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edition">Edição</label>
            <input type="text" id="edition" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="isbn">ISBN</label>
            <input type="text" id="isbn" className="form-control" />
          </div>
        </div>
        
        <div className="row-group">
          <div className="form-group">
            <label className="form-label" htmlFor="description">Descrição</label>
            <textarea id="description" className="form-control" rows={4} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="synopsis">Sinopse</label>
            <textarea id="synopsis" className="form-control" rows={4} />
          </div>
        </div>
        
        <div className="row-group">
          <div className="form-group">
            <label className="form-label" htmlFor="pages">Número de Páginas</label>
            <input type="number" id="pages" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="price">Preço</label>
            <input type="number" id="price" className="form-control" step="0.01" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Data</label>
            <input type="date" id="date" className="form-control" />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label" htmlFor="dimensions">Dimensões</label>
            <input type="text" id="dimensions" className="form-control" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="barcode">Código de Barra</label>
            <input type="number" id="barcode" className="form-control" />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label" htmlFor="publisher">Editora</label>
            <select id="publisher" className="form-control">
              <option value="">Selecione uma editora</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="pricingGroup">Grupo de Precificação</label>
            <select id="pricingGroup" className="form-control">
              <option value="">Selecione um grupo de precificação</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Categorias</label>
          <div className="category-search">
            <input 
              type="text" 
              className="form-control" 
              value={categorySearch}
              onChange={handleCategorySearch}
            />
            {availableCategories.length > 0 && (
              <div className="category-dropdown">
                {availableCategories.map(category => (
                  <div 
                    key={category.id} 
                    onClick={() => handleCategorySelect(category)}
                    className="category-option"
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="list-item">
            {selectedCategories.map(category => (
              <div key={category.id} className="selected-category item-info">
                <div className="item-type">
                  <span className={`type-tag ${category.tag}`}>{category.name}</span>
                  <button 
                    type="button" 
                    onClick={() => removeCategory(category)}
                    className="remove-category"
                  >
                    <X weight="bold" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="actions">
          <button
            id="cancel"
            type="button" 
            className="secondary"
            onClick={() => navigate('/clientes')}
          >
            Cancelar
          </button>
          <button type="submit" className="primary">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarItem;