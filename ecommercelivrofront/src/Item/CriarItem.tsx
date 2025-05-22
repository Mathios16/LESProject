import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Trash, Pencil } from '@phosphor-icons/react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';

import { SelectChangeEvent } from '@mui/material/Select';

interface Category {
  id: number;
  name: string;
  tag?: string;
}

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
  inventory?: Inventory[];
}

interface Inventory {
  id?: number;
  quantity: number;
  costPrice: number;
  entryDate: string;
  supplier: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton onClick={onClose} size="small">
            <X />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

const CriarItem: React.FC = () => {

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [categorySearch, setCategorySearch] = useState('');
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categoryTags] = useState(['blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black']);
  const [usedTags, setUsedTags] = useState<string[]>([]);

  const [item, setItem] = useState<Item>({
    title: '',
    description: '',
    price: 0,
    date: '',
    edition: '',
    isbn: '',
    pages: 0,
    synopsis: '',
    publisher: '',
    pricingGroup: '',
    height: 0,
    width: 0,
    depth: 0,
    barcode: 0,
    inventory: []
  });

  const [editingInventoryIndex, setEditingInventoryIndex] = useState<number | null>(null);
  const [currentInventory, setCurrentInventory] = useState<Inventory>({ quantity: 0, costPrice: 0, entryDate: '', supplier: '' });
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const fetchCategories = async (searchTerm: string) => {
    let categories = [];
    const response = await fetch('http://localhost:8080/categories');
    const data = await response.json();
    categories = data;

    categories = categories.filter((category: string) => category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    setAvailableCategories(categories);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof Item;
    const value = e.target.value;
    setItem(prev => ({ ...prev, [name]: value }));
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

  const handleAddInventory = () => {
    setEditingInventoryIndex(null);
    setCurrentInventory({ quantity: 0, costPrice: 0, entryDate: '', supplier: '' });
    setIsInventoryModalOpen(true);
  };

  const handleEditInventory = (index: number) => {
    setEditingInventoryIndex(index);
    if (!item.inventory) return;
    setCurrentInventory(item.inventory[index]);
    setIsInventoryModalOpen(true);
  };

  const handleDeleteInventory = (index: number) => {
    if (!item.inventory) return;
    const updatedInventory = item.inventory.filter((inventory, i) => i !== index);
    setItem(prev => ({ ...prev, inventory: updatedInventory }));
  };

  const handleSaveInventory = () => {
    if (!item.inventory) return;
    if (editingInventoryIndex !== null) {
      const updatedInventory = item.inventory.map((inventory, i) => i === editingInventoryIndex ? currentInventory : inventory);
      setItem(prev => ({ ...prev, inventory: updatedInventory }));
    } else {
      setItem(prev => ({ ...prev, inventory: [...prev.inventory || [], currentInventory] }));
    }
    setIsInventoryModalOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cadastro de Livro
        </Typography>

        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {success && (
          <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
            <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Título"
                name="title"
                value={item.title}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Edição"
                name="edition"
                value={item.edition}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ISBN"
                name="isbn"
                value={item.isbn}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={item.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sinopse"
                name="synopsis"
                value={item.synopsis}
                onChange={handleInputChange}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Número de Páginas"
                name="pages"
                type="number"
                value={item.pages}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Preço"
                name="price"
                type="number"
                value={item.price}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data"
                name="date"
                type="date"
                value={item.date}
                onChange={handleInputChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dimensões"
                name="dimensions"
                value={`${item.height} x ${item.width} x ${item.depth}`}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código de Barra"
                name="barcode"
                type="number"
                value={item.barcode}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Editora</InputLabel>
                <Select
                  name="publisher"
                  value={item.publisher}
                  onChange={handleSelectChange}
                  label="Editora"
                >
                  <MenuItem value="">Selecione uma editora</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Grupo de Precificação</InputLabel>
                <Select
                  name="pricingGroup"
                  value={item.pricingGroup}
                  onChange={handleSelectChange}
                  label="Grupo de Precificação"
                >
                  <MenuItem value="">Selecione um grupo de precificação</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Estoque</Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={handleAddInventory}
                >
                  Adicionar ao Estoque
                </Button>
              </Box>
              {item.inventory && item.inventory.map((inventoryLine, index) => (
                <Paper key={inventoryLine.id || index} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>
                      Qtd: {inventoryLine.quantity}, Custo: R$ {inventoryLine.costPrice.toFixed(2)}, Entrada: {inventoryLine.entryDate}
                      {inventoryLine.supplier && `, Fornecedor: ${inventoryLine.supplier}`}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleEditInventory(index)}>
                        <Pencil />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteInventory(index)} color="error">
                        <Trash />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Buscar Categorias"
                value={categorySearch}
                onChange={handleCategorySearch}
                variant="outlined"
              />
              {availableCategories.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {availableCategories.map(category => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      onClick={() => handleCategorySelect(category)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedCategories.map(category => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onDelete={() => removeCategory(category)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Cadastrar Livro
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Modal
        open={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        title="Gerenciar Estoque"
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade"
                name="quantity"
                type="number"
                value={currentInventory.quantity}
                onChange={(e) => setCurrentInventory(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Custo"
                name="costPrice"
                type="number"
                value={currentInventory.costPrice}
                onChange={(e) => setCurrentInventory(prev => ({ ...prev, costPrice: parseFloat(e.target.value) }))}
                variant="outlined"
                inputProps={{ step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Entrada"
                name="entryDate"
                type="date"
                value={currentInventory.entryDate}
                onChange={(e) => setCurrentInventory(prev => ({ ...prev, entryDate: e.target.value }))}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fornecedor"
                name="supplier"
                value={currentInventory.supplier}
                onChange={(e) => setCurrentInventory(prev => ({ ...prev, supplier: e.target.value }))}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveInventory}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Modal>
    </Container>
  );
};

export default CriarItem;