import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  IconButton
} from '@mui/material';
import { Trash } from '@phosphor-icons/react';

interface CartItem {
  id: number;
  itemId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Carrinho: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useUrlParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setUserId(navbar.dataset.userId);
    }
  }, []);


  const fetchItem = async () => {

    try {

      let response = await fetch(`http://localhost:8080/cart/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      let cartItemData = await response.json();

      setCartItems(cartItemData.items);

    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchItem();
    }
  }, [userId]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost - discount;
  };

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    try {
      let data = {
        "items": [
          {
            "id": id,
            "quantity": newQuantity
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
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const handleRemoveItem = async (id: number) => {
    try {
      let data = {
        "items": [
          {
            "id": id
          }
        ]
      };
      await fetch(`http://localhost:8080/cart/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    navigate(`/compra${type || id ? `?type=${type}&id=${id}` : ''}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carrinho de Compras
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell align="right">Preço</TableCell>
              <TableCell align="center">Quantidade</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <span>{item.title}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">R$ {item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleRemoveItem(item.id)} >
                    <Trash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo do Pedido
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">R$ {calculateTotal().toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          Finalizar Pedido
        </Button>
      </Box>
    </Container>
  );
};

export default Carrinho;