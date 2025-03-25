import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  TextField
} from '@mui/material';
import { Plus, Pencil, Trash } from '@phosphor-icons/react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Address {
  id: number;
  street: string;
  number: string;
  city: string;
  state: string;
  type: string[];
}

interface PaymentMethod {
  id: number;
  cardFlag: string;
  cardNumber: string;
  cardName: string;
}

const Compra: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Livro de React', price: 59.99, quantity: 2 },
    { id: 2, name: 'Livro de TypeScript', price: 49.99, quantity: 1 }
  ]);

  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<number | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const [addresses, setAddresses] = useState<Address[]>([
    { 
      id: 1, 
      street: 'Rua Principal', 
      number: '123', 
      city: 'São Paulo', 
      state: 'SP', 
      type: ['ENTREGA', 'COBRANCA'] 
    },
    { 
      id: 2, 
      street: 'Avenida Secundária', 
      number: '456', 
      city: 'Rio de Janeiro', 
      state: 'RJ', 
      type: ['RESIDENCIAL'] 
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { 
      id: 1, 
      cardFlag: 'VISA', 
      cardNumber: '**** **** **** 1234', 
      cardName: 'João Silva' 
    }
  ]);

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
      setDiscount(calculateTotal() * 0.1);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finalizar Compra
      </Typography>

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

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Itens do Carrinho
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>{item.name}</Typography>
                <Typography>
                  {item.quantity} x R$ {item.price.toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" align="right">
              Total: R$ {calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Addresses and Payment */}
        <Grid item xs={12} md={4}>
          {/* Delivery Address */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Endereço de Entrega</Typography>
              <IconButton size="small">
                <Plus />
              </IconButton>
            </Box>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup 
                value={selectedDeliveryAddress} 
                onChange={(e) => setSelectedDeliveryAddress(Number(e.target.value))}
              >
                {addresses.map((address) => (
                  <FormControlLabel
                    key={address.id}
                    value={address.id}
                    control={<Radio />}
                    label={`${address.street}, ${address.number} - ${address.city}/${address.state}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Billing Address */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Endereço de Cobrança</Typography>
              <IconButton size="small">
                <Plus />
              </IconButton>
            </Box>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup 
                value={selectedBillingAddress} 
                onChange={(e) => setSelectedBillingAddress(Number(e.target.value))}
              >
                {addresses.map((address) => (
                  <FormControlLabel
                    key={address.id}
                    value={address.id}
                    control={<Radio />}
                    label={`${address.street}, ${address.number} - ${address.city}/${address.state}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Payment Methods */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Método de Pagamento</Typography>
              <IconButton size="small">
                <Plus />
              </IconButton>
            </Box>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup 
                value={selectedPaymentMethod} 
                onChange={(e) => setSelectedPaymentMethod(Number(e.target.value))}
              >
                {paymentMethods.map((payment) => (
                  <FormControlLabel
                    key={payment.id}
                    value={payment.id}
                    control={<Radio />}
                    label={`${payment.cardFlag} - ${payment.cardNumber}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={
            !selectedDeliveryAddress || 
            !selectedBillingAddress || 
            !selectedPaymentMethod
          }
        >
          Confirmar Pedido
        </Button>
      </Box>

    </Container>
  );
};

export default Compra;