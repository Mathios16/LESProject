import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

const Carrinho: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // TODO: Fetch cart items from API/localStorage
    const mockItems: CartItem[] = [
      { id: 1, title: 'Livro 1', price: 29.90, quantity: 1 },
      { id: 2, title: 'Livro 2', price: 39.90, quantity: 2 },
    ];
    setCartItems(mockItems);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost - discount;
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ));
  };

  const calculateShipping = async () => {
    // TODO: Integrate with shipping API
    // Mock shipping calculation
    if (cep.length === 8) {
      setShippingCost(15.90);
    }
  };

  const applyCoupon = () => {
    // TODO: Integrate with coupon API
    // Mock coupon application
    if (couponCode === 'DESC10') {
      setDiscount(calculateSubtotal() * 0.1);
    }
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
                <TableCell>{item.title}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Calcular Frete
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={calculateShipping}
                disabled={cep.length !== 8}
              >
                Calcular
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cupom de Desconto
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Código do Cupom"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={applyCoupon}
                disabled={!couponCode}
              >
                Aplicar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo do Pedido
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal:</Typography>
            <Typography>R$ {calculateSubtotal().toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Frete:</Typography>
            <Typography>R$ {shippingCost.toFixed(2)}</Typography>
          </Box>
          {discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Desconto:</Typography>
              <Typography>-R$ {discount.toFixed(2)}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">R$ {calculateTotal().toFixed(2)}</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Carrinho;