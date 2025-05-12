import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
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
  id: string,
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, open, onClose, title, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton id={id} onClick={onClose} size="small">
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
  const { type, id } = useUrlParams();
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
    const response = await fetch(`http://localhost:8080/cupom/${code}/code`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      setError('Erro ao buscar cupom.');
      return;
    }

    const cupomData = await response.json();

    if (cupomData.id && !cupoms.find(cupom => cupom.id === cupomData.id)) {
      setCupoms(prev => [...prev, cupomData]);
      setDiscount(prevDiscount => prevDiscount + cupomData.value);
      setSuccess('Cupom aplicado com sucesso!');
      setCupomCode('');
    } else if (cupoms.find(cupom => cupom.id === cupomData.id)) {
      setError('Este cupom já foi aplicado.');
    }
    else {
      setError('Cupom inválido ou expirado.');
    }
  };

  const calculateSubtotalAndShipping = useCallback(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = calculateShipping();
    return subtotal + shipping;
  }, [cartItems, addresses, selectedDeliveryAddress]);

  const calculateTotal = useCallback(() => {
    const subtotalAndShipping = calculateSubtotalAndShipping();
    return Math.max(0, subtotalAndShipping - discount);
  }, [calculateSubtotalAndShipping, discount]);

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
    const remainingPayments = orderPayments.filter(p => p.paymentMethodId !== id);
    const currentPaymentCount = remainingPayments.length;

    const validAmount = Math.max(0, Number(amount) || 0);
    const amountToDistribute = total - validAmount;

    const equalAmount = currentPaymentCount > 0
      ? Math.max(0, amountToDistribute / currentPaymentCount)
      : 0;

    setOrderPayments(prev =>
      prev.map(payment => {
        if (payment.paymentMethodId === id) {
          return { ...payment, amount: Number(validAmount.toFixed(2)) };
        } else if (remainingPayments.some(p => p.paymentMethodId === payment.paymentMethodId)) {
          return { ...payment, amount: Number(equalAmount.toFixed(2)) };
        }
        return payment;
      })
    );
  };

  const handleRemoveOrderPayment = (id: number) => {
    const updatedPayments = orderPayments.filter(payment => payment.paymentMethodId !== id);
    const total = calculateTotal();
    const currentPaymentCount = updatedPayments.length;

    if (currentPaymentCount > 0) {
      const equalAmount = (total / currentPaymentCount).toFixed(2);
      setOrderPayments(
        updatedPayments.map(payment => ({
          ...payment,
          amount: Number(equalAmount)
        }))
      );
    } else {
      setOrderPayments([]);
    }
  };

  const handleRecalculateOrderPayment = useCallback(() => {
    const total = calculateTotal();
    const currentPaymentCount = orderPayments.length;
    if (currentPaymentCount > 0) {
      const equalAmount = (total / currentPaymentCount).toFixed(2);
      setOrderPayments(prev =>
        prev.map(payment => ({
          ...payment,
          amount: Number(equalAmount)
        }))
      );
    }
  }, [orderPayments, calculateTotal]);

  const handleRemoveItem = useCallback((id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  useEffect(() => {
    handleRecalculateOrderPayment();
  }, [cartItems, handleRecalculateOrderPayment]);

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
    const subtotalAndShipping = calculateSubtotalAndShipping();
    const finalTotal = calculateTotal();
    const isCoveredByCoupon = discount >= subtotalAndShipping;
    const remainingCouponValue = Math.max(0, discount - subtotalAndShipping);

    if (!selectedDeliveryAddress) {
      setError("Por favor, selecione um endereço de entrega.");
      return;
    }

    if (!isCoveredByCoupon && orderPayments.length === 0) {
      setError("Por favor, adicione um método de pagamento.");
      return;
    }

    if (!isCoveredByCoupon) {
      const paymentSum = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
      if (Math.abs(paymentSum - finalTotal) > 0.01) {
        setError(`A soma dos pagamentos (R$ ${paymentSum.toFixed(2)}) não corresponde ao total do pedido (R$ ${finalTotal.toFixed(2)}).`);
        return;
      }
      if (orderPayments.some(p => p.amount < 0)) {
        setError("O valor do pagamento não pode ser negativo.");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8080/order/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          addressId: selectedDeliveryAddress,
          orderPayments: isCoveredByCoupon ? [] : orderPayments,
          cupoms: cupoms
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao confirmar o pedido.');
      }

      const orderData = await response.json();

      let successMessage = "Pedido confirmado com sucesso!";
      if (isCoveredByCoupon && remainingCouponValue > 0) {
        successMessage += ` Valor do cupom gerado: R$ ${remainingCouponValue.toFixed(2)}`;
      }

      setSuccess(successMessage);
      setCartItems([]);
      setCupoms([]);
      setDiscount(0);
      setOrderPayments([]);

      setTimeout(() => {
        navigate(`/${type || id ? `?type=${type}&id=${id}` : ''}`);
      }, 3000);

    } catch (error) {
      console.error('Error submitting order:', error);
      setError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    }
  };

  const subtotalAndShipping = calculateSubtotalAndShipping();
  const finalTotal = calculateTotal();
  const isCoveredByCoupon = discount >= subtotalAndShipping;
  const paymentSum = orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const isPaymentSumCorrect = Math.abs(paymentSum - finalTotal) < 0.01;

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

                  <IconButton size="small" onClick={() => handleRemoveItem(item.id)}>
                    <Trash />
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
              Total: R$ {finalTotal.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Endereço de Entrega</Typography>
              <IconButton id="add-new-address-button" size="small" onClick={() => setIsAddressModalOpen(true)}>
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
              <IconButton id="add-new-payment-button" size="small" onClick={() => setIsPaymentModalOpen(true)}>
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
                          onChange={(e) => handleUpdateOrderPayment(orderPayment.paymentMethodId, parseFloat(e.target.value))}
                          inputProps={{ min: 0, step: "0.01" }}
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
                disabled={isCoveredByCoupon}
              />
              <Button
                variant="contained"
                onClick={() => applyCupom(cupomCode)}
                disabled={!cupomCode || isCoveredByCoupon}
              >
                Aplicar
              </Button>
            </Box>
            {isCoveredByCoupon && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                O valor do cupom cobre o total da compra. Nenhum pagamento adicional é necessário.
                <br />
                Cupom gerado: {Math.abs(subtotalAndShipping - discount).toFixed(2)}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          id="submit-order-button"
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={
            !selectedDeliveryAddress ||
            (!isCoveredByCoupon && (!orderPayments.length || !isPaymentSumCorrect))
          }
        >
          Confirmar Pedido
        </Button>
      </Box>

      <Modal
        id="address-modal"
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
                id="zip"
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
                id="streetType"
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
                id="street"
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
                id="number"
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
                id="complement"
                label="Complemento"
                name="complement"
                value={currentAddress.complement}
                onChange={handleAddressChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="neighborhood"
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
                id="city"
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
                id="state"
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
                id="country"
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
                        id="billing"
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
                        id="shipping"
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
                        id="residential"
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
            <IconButton id="add-address" onClick={() => setIsAddressModalOpen(false)}>
              <Button>Cancelar</Button>
            </IconButton>
            <Button type="submit" variant="contained">Adicionar</Button>
          </DialogActions>
        </Box>
      </Modal>

      <Modal
        id="payment-modal"
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
                id="cardNumber"
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
                  id="cardFlag"
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
                id="cardName"
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
                id="cardExpiration"
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
                id="cvv"
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
                    id="primary"
                    checked={currentPayment.primary}
                    onChange={(e) => setCurrentPayment(prev => ({ ...prev, primary: e.target.checked }))}
                  />
                }
                label="Cartão Principal"
              />
            </Grid>
          </Grid>
          <DialogActions>
            <IconButton id="add-payment" onClick={() => setIsPaymentModalOpen(false)}>
              <Button>Cancelar</Button>
            </IconButton>
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