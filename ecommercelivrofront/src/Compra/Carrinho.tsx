import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Carrinho: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    // TODO: Fetch cart items from API/localStorage
    const mockItems: CartItem[] = [
      {
        id: 1, title: 'A cantiga dos pássaros e das serpentes',
        image: 'https://m.media-amazon.com/images/I/61MCf2k-MgS._AC_UF1000,1000_QL80_.jpg',
        price: 59.90, quantity: 1
      }
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

  // const calculateShipping = async () => {
  //   // TODO: Integrate with shipping API
  //   // Mock shipping calculation
  //   if (cep.length === 8) {
  //     setShippingCost(15.90);
  //   }
  // };

  // const applyCoupon = () => {
  //   // TODO: Integrate with coupon API
  //   // Mock coupon application
  //   if (couponCode === 'DESC10') {
  //     setDiscount(calculateSubtotal() * 0.1);
  //   }
  // };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Finalizar Pedido');
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
                  <IconButton size="small">
                    <Trash onClick={() => handleRemoveItem(item.id)} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Grid container spacing={3}>
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
      </Grid> */}

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
          onClick={() => navigate('/compra')}
          disabled={cartItems.length === 0}
        >
          Finalizar Pedido
        </Button>
      </Box>
    </Container>
  );
};

export default Carrinho;