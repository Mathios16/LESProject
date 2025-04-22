import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  InputLabel,
  Select,
  FormGroup,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { Plus, Pencil, Trash, X } from '@phosphor-icons/react';

import { SelectChangeEvent } from '@mui/material/Select';

interface CartItem {
  id: number;
  itemId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Address {
  id?: number;
  streetType: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  addressType: string[];
}

interface PaymentMethod {
  id?: number;
  primary: boolean;
  cardFlag: string;
  cardNumber: string;
  cardName: string;
  cardExpiration: string;
  cvv: string;
}

interface Cupom {
  id: number;
  code: string;
  value: number;
  expirationDate: Date;
}

interface OrderPayment {
  paymentMethodId: number;
  amount: number;
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

const Compra: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [cupomCode, setCupomCode] = useState('');
  const [cupoms, setCupoms] = useState<Cupom[]>([]);
  const [discount, setDiscount] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<number | null>(addresses[0]?.id || null);
  const [orderPayments, setOrderPayments] = useState<OrderPayment[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address>({
    streetType: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    addressType: []
  });

  const [currentPayment, setCurrentPayment] = useState<PaymentMethod>({
    primary: false,
    cardFlag: '',
    cardNumber: '',
    cardName: '',
    cardExpiration: '',
    cvv: ''
  });


  const handleSelectChangePayment = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof PaymentMethod;
    const value = e.target.value;
    setCurrentPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment(prev => ({ ...prev, [name]: value }));
  };

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

      cartItemData.items.forEach(async (item: { id: number, itemId: number, quantity: number }) => {

        response = await fetch(`http://localhost:8080/items/${item.itemId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const itemData = await response.json();

        if (cartItems.find(cartItem => cartItem.id === item.id)) {
          return;
        }

        setCartItems(prev => [...prev, {
          id: item.id,
          itemId: item.itemId,
          title: itemData.title,
          price: itemData.price,
          image: itemData.image,
          quantity: item.quantity
        }]);
      });

      response = await fetch(`http://localhost:8080/customers/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      const customerData = await response.json();
      setAddresses(customerData.addresses);
      setPaymentMethods(customerData.paymentMethods);

    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }

      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado. Verifique o número digitado.');
        return;
      }

      setCurrentAddress(prevAddress => ({
        ...prevAddress,
        streetType: '',
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        country: 'Brasil',
        zipCode: `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5, 8)}`
      }));

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar endereço. Tente novamente.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchItem();
    }
  }, [userId]);

  const calculateShipping = () => {

    let freight = 0.0;
    if (cartItems.length >= 3) {
      freight += cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.1;
    }
    if (!!selectedDeliveryAddress && addresses.find(address => address.id === selectedDeliveryAddress)?.state !== 'SP') {
      freight += 10.0;
    }
    return freight;
  };

  const applyCupom = async (code: string) => {
    const response = await fetch(`http://localhost:8080/cupom/${code}`, {
      method: 'GET',
      credentials: 'include',
    });

    const cupomData = await response.json();

    if (cupomData.id && !cupoms.find(cupom => cupom.id === cupomData.id)) {
      setCupoms(prev => [...prev, cupomData]);
      setDiscount(discount + cupomData.value);
      setSuccess('Cupom aplicado com sucesso!');
    } else {
      setError('Cupom inválido');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity) + calculateShipping() - discount, 0);
  };

  const handleAddOrderPayment = (id: number) => {
    const total = calculateTotal();
    const currentPaymentCount = orderPayments.length + 1;
    const equalAmount = (total / currentPaymentCount).toFixed(2);

    setOrderPayments(prev => [
      ...prev.map(payment => ({
        ...payment,
        amount: Number(equalAmount)
      })),
      {
        paymentMethodId: id,
        amount: Number(equalAmount)
      }
    ]);
  };

  const handleUpdateOrderPayment = (id: number, amount: number) => {
    const total = calculateTotal();
    const currentPaymentCount = orderPayments.length - 1;
    const equalAmount = ((total - amount) / currentPaymentCount).toFixed(2);

    setOrderPayments(prev => [
      ...prev.map(payment => (payment.paymentMethodId === id ?
        {
          ...payment,
          amount: Number(amount.toFixed(2))
        } : {
          ...payment,
          amount: Number(equalAmount)
        }))
    ]);
  };

  const handleRemoveOrderPayment = (id: number) => {
    const total = calculateTotal();
    const currentPaymentCount = orderPayments.length - 1;
    const equalAmount = (total / currentPaymentCount).toFixed(2);
    setOrderPayments(prev => prev.filter(payment => payment.paymentMethodId !== id));
    setOrderPayments(prev => [
      ...prev.map(payment => ({
        ...payment,
        amount: Number(equalAmount)
      }))
    ]);
  };

  const handleRecalculateOrderPayment = () => {
    const total = calculateTotal();
    const currentPaymentCount = orderPayments.length;
    const equalAmount = (total / currentPaymentCount).toFixed(2);

    setOrderPayments(prev => [
      ...prev.map(payment => ({
        ...payment,
        amount: Number(equalAmount)
      }))
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    handleRecalculateOrderPayment();
  };

  const handleUpdateAddress = async (address: Address) => {
    let response = await fetch(`http://localhost:8080/customers/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });

    let customerData = await response.json();
    customerData.addresses = [...customerData.addresses, address];

    response = await fetch(`http://localhost:8080/customers/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    const updatedAddress = await response.json();
    setAddresses(updatedAddress.addresses);
  };

  const handleUpdatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    let response = await fetch(`http://localhost:8080/customers/${userId}`, {
      method: 'GET',
      credentials: 'include'
    });

    let customerData = await response.json();
    customerData.paymentMethods = [...customerData.paymentMethods, paymentMethod];

    response = await fetch(`http://localhost:8080/customers/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    const updatedPaymentMethod = await response.json();
    setPaymentMethods(updatedPaymentMethod.paymentMethods);
  };

  const handleSubmit = async () => {

    let response = await fetch(`http://localhost:8080/order/${userId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        addressId: selectedDeliveryAddress,
        orderPayments: orderPayments,
        cupoms: cupoms
      })
    });

    const orderData = await response.json();
    setSuccess(orderData);
    navigate(`/`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Finalizar Compra
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Itens do Carrinho
            </Typography>
            {cartItems.map((item) => (
              <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                <Box display="flex" alignItems="center">
                  <Typography>
                    {item.quantity} x R$ {item.price.toFixed(2)}
                    <br />
                    Subtotal: R$ {(item.price * item.quantity).toFixed(2)}
                  </Typography>

                  <IconButton size="small">
                    <Trash onClick={() => handleRemoveItem(item.id)} />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography align="right">
              Desconto: R$ {discount.toFixed(2)}
            </Typography>
            <Typography align="right">
              Frete: R$ {calculateShipping().toFixed(2)}
            </Typography>
            <Typography variant="h6" align="right">
              Total: R$ {calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* Delivery Address */}
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Endereço de Entrega</Typography>
              <IconButton size="small" onClick={() => setIsAddressModalOpen(true)}>
                Novo<Plus />
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
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Métodos de Pagamento</Typography>
              <IconButton size="small" onClick={() => setIsPaymentModalOpen(true)}>
                Novo<Plus />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center">
              {paymentMethods.map((payment) => (
                <Box key={payment.id} display="flex" flexWrap="wrap" alignItems="center">
                  <Typography>
                    {payment.cardFlag} - {payment.cardNumber}
                  </Typography>
                  {orderPayments.filter(orderPayment => orderPayment.paymentMethodId === payment.id).length === 0 && (
                    <IconButton className="add-order-payment" size="small" onClick={() => handleAddOrderPayment(payment.id || 1)}>
                      <Plus />
                    </IconButton>
                  )}
                  <Box display="flex" alignItems="center">
                    {orderPayments.filter(orderPayment => orderPayment.paymentMethodId === payment.id).map(orderPayment => (
                      <Box key={orderPayment.paymentMethodId} display="flex" alignItems="center">
                        <TextField
                          type="number"
                          value={orderPayment.amount.toFixed(2)}
                          onChange={(e) => handleUpdateOrderPayment(orderPayment.paymentMethodId, parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                          size="small"
                        />
                        <IconButton size="small" onClick={() => handleRemoveOrderPayment(orderPayment.paymentMethodId)}>
                          <Trash />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
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
                value={cupomCode}
                onChange={(e) => setCupomCode(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={() => applyCupom(cupomCode)}
                disabled={!cupomCode}
              >
                Aplicar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={
            !selectedDeliveryAddress
            || !orderPayments.length
            || orderPayments.reduce((total, payment) => total + payment.amount, 0) !== Number(calculateTotal().toFixed(2))
            || (orderPayments.some(payment => payment.amount < 10) && cupoms.reduce((total, cupom) => total + cupom.value, 0) <= calculateTotal() - 10)
          }
          onClick={handleSubmit}
        >
          Confirmar Pedido
        </Button>
      </Box>

      <Modal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Adicionar Endereço"
      >
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          setAddresses(prev => [...prev, currentAddress]);
          setIsAddressModalOpen(false);
          handleUpdateAddress(currentAddress);
          setCurrentAddress({
            zipCode: '',
            streetType: '',
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            country: '',
            addressType: [],
            id: 0,
          });
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CEP"
                name="zipCode"
                value={currentAddress.zipCode}
                onChange={handleAddressChange}
                onBlur={(e) => fetchAddressByCep(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tipo de Logradouro"
                name="streetType"
                value={currentAddress.streetType}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Logradouro"
                name="street"
                value={currentAddress.street}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número"
                name="number"
                value={currentAddress.number}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Complemento"
                name="complement"
                value={currentAddress.complement}
                onChange={handleAddressChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={currentAddress.neighborhood}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={currentAddress.city}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={currentAddress.state}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={currentAddress.country}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Tipo do Endereço</FormLabel>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentAddress.addressType.includes('COBRANCA')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...currentAddress.addressType, 'COBRANCA']
                            : currentAddress.addressType.filter(t => t !== 'COBRANCA');
                          setCurrentAddress({ ...currentAddress, addressType: newTypes });
                          setError('');
                        }}
                      />
                    }
                    label="Cobrança"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentAddress.addressType.includes('ENTREGA')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...currentAddress.addressType, 'ENTREGA']
                            : currentAddress.addressType.filter(t => t !== 'ENTREGA');
                          setCurrentAddress({ ...currentAddress, addressType: newTypes });
                          setError('');
                        }}
                      />
                    }
                    label="Entrega"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentAddress.addressType.includes('RESIDENCIAL')}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...currentAddress.addressType, 'RESIDENCIAL']
                            : currentAddress.addressType.filter(t => t !== 'RESIDENCIAL');
                          setCurrentAddress({ ...currentAddress, addressType: newTypes });
                          setError('');
                        }}
                      />
                    }
                    label="Residencial"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setIsAddressModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Adicionar</Button>
          </DialogActions>
        </Box>
      </Modal>

      <Modal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Adicionar Método de Pagamento"
      >
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          setPaymentMethods(prev => [...(prev || []), currentPayment]);
          setIsPaymentModalOpen(false);
          handleUpdatePaymentMethod(currentPayment);
          setCurrentPayment({
            primary: false,
            cardFlag: '',
            cardNumber: '',
            cardName: '',
            cardExpiration: '',
            cvv: '',
            id: 0,
          });
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Número do Cartão"
                name="cardNumber"
                value={currentPayment.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Bandeira do Cartão</InputLabel>
                <Select
                  name="cardFlag"
                  value={currentPayment.cardFlag}
                  onChange={handleSelectChangePayment}
                  required
                >
                  <MenuItem value="VISA">VISA</MenuItem>
                  <MenuItem value="MASTERCARD">MASTERCARD</MenuItem>
                  <MenuItem value="AMERICANEXPRESS">AMERICANEXPRESS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome no Cartão"
                name="cardName"
                value={currentPayment.cardName}
                onChange={handlePaymentChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Data de Expiração"
                name="cardExpiration"
                value={currentPayment.cardExpiration}
                onChange={handlePaymentChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CVV"
                name="cvv"
                value={currentPayment.cvv}
                onChange={handlePaymentChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentPayment.primary}
                    onChange={(e) => setCurrentPayment(prev => ({ ...prev, primary: e.target.checked }))}
                  />
                }
                label="Cartão Principal"
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Adicionar</Button>
          </DialogActions>
        </Box>
      </Modal>
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError('');
          setSuccess('');
        }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => {
            setError('');
            setSuccess('');
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container >
  );
};

export default Compra;