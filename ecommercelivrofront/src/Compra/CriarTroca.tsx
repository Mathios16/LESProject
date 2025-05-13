import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  InputLabel,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  FormGroup,
  IconButton,
  FormLabel,
} from '@mui/material';
import { Plus, X, Trash } from '@phosphor-icons/react';
import { SelectChangeEvent } from '@mui/material/Select';

interface OrderItem {
  id: number;
  itemId?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

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

interface OrderPayment {
  paymentMethodId: number;
  amount: number;
}

interface SelectedReturnItem {
  orderItemId: number;
  title: string;
  price: number;
  image: string;
  quantityInOrder: number;
  quantityToReturn: number;
}

interface ModalProps {
  id: string;
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
          <IconButton id={`${id}-close-button`} onClick={onClose} size="small">
            <X />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

const CriarTroca: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { type, id: routeIdParam } = useUrlParams();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUserIdFromParams = async () => {
      const idFromParams = await searchParams.get('id');
      setUserId(idFromParams || undefined);
    };
    fetchUserIdFromParams();
  }, [searchParams]);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = window.location.pathname;
    const pathParts = url.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0].toLowerCase() === 'pedido') {
      setOrderId(pathParts[1]);
    }
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!userId) return;
        const response = await fetch(`http://localhost:8080/cart/${userId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar itens do carrinho');
        }
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar itens do carrinho. Tente novamente.');
      }
    };

    if (userId) fetchCartItems();
  }, [userId]);

  const [originalOrderItems, setOriginalOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (orderId) {
      const fetchOriginalOrder = async () => {
        try {
          const response = await fetch(`http://localhost:8080/order/${orderId}/order`);
          if (!response.ok) {
            throw new Error('Erro ao buscar pedido original');
          }
          const data = await response.json();
          if (data && data.length > 0 && data[0].items) {
            const itemsWithUnitPrice = data[0].items.map((item: OrderItem) => ({
              ...item,
              price: item.quantity > 0 ? item.price / item.quantity : item.price,
            }));
            setOriginalOrderItems(itemsWithUnitPrice);
          } else {
            setOriginalOrderItems([]);
            setError("Nenhum item encontrado no pedido original ou formato de dados inesperado.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar pedido original. Tente novamente.');
        }
      };
      fetchOriginalOrder();
    }
  }, [orderId]);

  const [selectedItemsToReturn, setSelectedItemsToReturn] = useState<SelectedReturnItem[]>([]);

  const handleReturnSelectionChange = (item: OrderItem, quantityToReturn: number) => {
    const newQuantity = Math.min(Math.max(0, quantityToReturn), item.quantity);
    setSelectedItemsToReturn(prev => {
      const existingIndex = prev.findIndex(r => r.orderItemId === item.id);
      if (newQuantity > 0) {
        const itemDetail = {
          orderItemId: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantityInOrder: item.quantity,
          quantityToReturn: newQuantity,
        };
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = itemDetail;
          return updated;
        } else {
          return [...prev, itemDetail];
        }
      } else {
        if (existingIndex > -1) {
          return prev.filter(r => r.orderItemId !== item.id);
        }
        return prev;
      }
    });
  };

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<number | null>(null);
  const [orderPayments, setOrderPayments] = useState<OrderPayment[]>([]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [currentAddress, setCurrentAddress] = useState<Address>({
    streetType: '', street: '', number: '', complement: '', neighborhood: '',
    city: '', state: '', country: 'Brasil', zipCode: '', addressType: []
  });
  const [currentPayment, setCurrentPayment] = useState<PaymentMethod>({
    primary: false, cardFlag: '', cardNumber: '', cardName: '', cardExpiration: '', cvv: ''
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:8080/customers/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar dados do cliente');
        const customerData = await response.json();
        setAddresses(customerData.addresses || []);
        setPaymentMethods(customerData.paymentMethods || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar dados do cliente.');
      }
    };
    if (userId) fetchCustomerData();
  }, [userId]);

  const valueOfReturnedItems = useMemo(() => {
    return selectedItemsToReturn.reduce((sum, item) => sum + item.price * item.quantityToReturn, 0);
  }, [selectedItemsToReturn]);

  const valueOfNewItemsInCart = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCostForNewItems = useMemo(() => {
    let freight = 0.0;
    if (cartItems.length >= 3) {
      const newItemsSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      freight += newItemsSubtotal * 0.1;
    }
    if (selectedDeliveryAddress) {
      const deliveryAddress = addresses.find(address => address.id === selectedDeliveryAddress);
      if (deliveryAddress && deliveryAddress.state !== 'SP') {
        freight += 10.0;
      }
    }
    return freight;
  }, [cartItems, selectedDeliveryAddress, addresses]);

  const amountToPay = useMemo(() => {
    const valueWithShipping = valueOfNewItemsInCart + shippingCostForNewItems;
    return Math.max(0, valueWithShipping - valueOfReturnedItems);
  }, [valueOfNewItemsInCart, valueOfReturnedItems, shippingCostForNewItems]);

  const couponValueGenerated = useMemo(() => {
    const valueWithShipping = valueOfNewItemsInCart + shippingCostForNewItems;
    return Math.max(0, valueOfReturnedItems - valueWithShipping);
  }, [valueOfNewItemsInCart, valueOfReturnedItems, shippingCostForNewItems]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) { setError('CEP inválido.'); return; }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      if (!response.ok) throw new Error('Erro ao buscar endereço pelo CEP');
      const data = await response.json();
      if (data.erro) { setError('CEP não encontrado.'); return; }
      setCurrentAddress(prev => ({
        ...prev, street: data.logradouro, neighborhood: data.bairro, city: data.localidade,
        state: data.uf, country: 'Brasil', zipCode: data.cep, streetType: prev.streetType || ''
      }));
      setError('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao buscar CEP.'); }
  }, []);

  const handleUpdateAddress = async (addressToAdd: Address) => {
    if (!userId) { setError("ID do usuário não encontrado para salvar endereço."); return; }
    try {
      let response = await fetch(`http://localhost:8080/customers/${userId}`);
      if (!response.ok) throw new Error("Falha ao buscar dados do cliente antes de adicionar endereço.");
      let customerData = await response.json();

      const newAddressWithId = { ...addressToAdd, id: Date.now() };
      customerData.addresses = [...(customerData.addresses || []), newAddressWithId];

      response = await fetch(`http://localhost:8080/customers/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      if (!response.ok) throw new Error("Falha ao salvar novo endereço.");
      const updatedCustomer = await response.json();
      setAddresses(updatedCustomer.addresses || []);
      setSuccess("Endereço adicionado com sucesso!");
      setIsAddressModalOpen(false);
      setCurrentAddress({ streetType: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', country: 'Brasil', zipCode: '', addressType: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar endereço.");
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChangePayment = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof PaymentMethod;
    setCurrentPayment(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleUpdatePaymentMethod = async (paymentToAdd: PaymentMethod) => {
    if (!userId) { setError("ID do usuário não encontrado para salvar método de pagamento."); return; }
    try {
      let response = await fetch(`http://localhost:8080/customers/${userId}`);
      if (!response.ok) throw new Error("Falha ao buscar dados do cliente antes de adicionar pagamento.");
      let customerData = await response.json();

      const newPaymentWithId = { ...paymentToAdd, id: Date.now() };
      customerData.paymentMethods = [...(customerData.paymentMethods || []), newPaymentWithId];

      response = await fetch(`http://localhost:8080/customers/${userId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      if (!response.ok) throw new Error("Falha ao salvar novo método de pagamento.");
      const updatedCustomer = await response.json();
      setPaymentMethods(updatedCustomer.paymentMethods || []);
      setSuccess("Método de pagamento adicionado com sucesso!");
      setIsPaymentModalOpen(false);
      setCurrentPayment({ primary: false, cardFlag: '', cardNumber: '', cardName: '', cardExpiration: '', cvv: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar método de pagamento.");
    }
  };

  const handleAddOrderPayment = (paymentMethodId: number) => {
    const total = amountToPay;
    const currentPaymentCount = orderPayments.length + 1;
    const equalAmount = currentPaymentCount > 0 ? total / currentPaymentCount : total;

    setOrderPayments(prev => [
      ...prev.map(p => ({ ...p, amount: parseFloat(equalAmount.toFixed(2)) })),
      { paymentMethodId, amount: parseFloat(equalAmount.toFixed(2)) }
    ]);
  };

  const handleUpdateOrderPaymentAmount = (paymentMethodId: number, newAmount: number) => {
    const total = amountToPay;
    const updatedAmount = Math.max(0, newAmount);

    setOrderPayments(prev => {
      const otherPayments = prev.filter(p => p.paymentMethodId !== paymentMethodId);
      const sumOfOtherPayments = otherPayments.reduce((sum, p) => sum + p.amount, 0);

      let amountForThisPayment = updatedAmount;
      if (updatedAmount + sumOfOtherPayments > total && otherPayments.length === 0) {
        amountForThisPayment = total;
      } else if (updatedAmount + sumOfOtherPayments > total && otherPayments.length > 0) {
        amountForThisPayment = Math.min(updatedAmount, total - sumOfOtherPayments);
      }

      const newPayments = prev.map(p =>
        p.paymentMethodId === paymentMethodId ? { ...p, amount: parseFloat(amountForThisPayment.toFixed(2)) } : p
      );

      if (newPayments.length === 2 && paymentMethodId !== newPayments.find(p => p.paymentMethodId !== paymentMethodId)!.paymentMethodId) {
        const otherPaymentIndex = newPayments.findIndex(p => p.paymentMethodId !== paymentMethodId);
        if (otherPaymentIndex !== -1) {
          newPayments[otherPaymentIndex].amount = parseFloat(Math.max(0, total - amountForThisPayment).toFixed(2));
        }
      } else if (newPayments.length > 1) {
      }
      return newPayments;
    });
  };

  const handleRemoveOrderPayment = (paymentMethodId: number) => {
    const updated = orderPayments.filter(p => p.paymentMethodId !== paymentMethodId);
    const total = amountToPay;
    const count = updated.length;
    if (count > 0) {
      const equalAmount = total / count;
      setOrderPayments(updated.map(p => ({ ...p, amount: parseFloat(equalAmount.toFixed(2)) })));
    } else {
      setOrderPayments([]);
    }
  };

  const sumOfOrderPayments = useMemo(() => {
    return orderPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [orderPayments]);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (selectedItemsToReturn.length === 0) {
      setError("Selecione pelo menos um item para trocar.");
      return;
    }
    if (!selectedDeliveryAddress) {
      setError("Selecione um endereço de entrega para os novos itens.");
      return;
    }
    if (amountToPay > 0) {
      if (orderPayments.length === 0) {
        setError("Adicione um método de pagamento para o valor pendente.");
        return;
      }
      if (Math.abs(sumOfOrderPayments - amountToPay) > 0.01) {
        setError(`A soma dos pagamentos (R$ ${sumOfOrderPayments.toFixed(2)}) não corresponde ao valor a pagar (R$ ${amountToPay.toFixed(2)}).`);
        return;
      }
    }

    const payload = {
      orderId: orderId,
      orderItems: selectedItemsToReturn.map(item => ({
        itemId: item.orderItemId,
        quantity: item.quantityToReturn,
        price: item.price,
      })),
      items: cartItems,
      addressId: selectedDeliveryAddress,
      orderPayments: amountToPay > 0 ? orderPayments.map(p => ({
        paymentMethodId: p.paymentMethodId,
        amount: p.amount
      })) : [],
    };

    try {
      const response = await fetch(`http://localhost:8080/order/${orderId}/exchange`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ message: "Erro na solicitação de troca." }));
        throw new Error(errData.message || "Falha ao processar a troca.");
      }

      const resultData = await response.json();
      let successMsg = resultData.message || "Troca solicitada com sucesso!";
      if (resultData.generatedCouponValue && resultData.generatedCouponValue > 0) {
        successMsg += ` Cupom de R$ ${resultData.generatedCouponValue.toFixed(2)} gerado.`
      } else if (amountToPay > 0) {
        successMsg += ` Pagamento de R$ ${amountToPay.toFixed(2)} processado.`
      }
      setSuccess(successMsg);

      setSelectedItemsToReturn([]);
      setCartItems([]);
      setOrderPayments([]);
      setTimeout(() => {
        navigate(`/pedidos/ver${type || routeIdParam ? `?type=${type}&id=${routeIdParam}` : ''}`);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar troca. Tente novamente.');
    }
  };

  const isSubmitDisabled = selectedItemsToReturn.length === 0 ||
    !selectedDeliveryAddress ||
    (amountToPay > 0 && (orderPayments.length === 0 || Math.abs(sumOfOrderPayments - amountToPay) > 0.01));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Solicitar Troca de Itens
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Selecione os itens do pedido original que deseja trocar:
            </Typography>
            {originalOrderItems.length === 0 && <Typography>Carregando itens do pedido original...</Typography>}
            {originalOrderItems.map(originalItem => (
              <Card key={originalItem.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', p: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'contain', mr: 2 }}
                  image={originalItem.image}
                  alt={originalItem.title}
                />
                <CardContent sx={{ flexGrow: 1, p: '0 !important' }}>
                  <Typography variant="subtitle1">{originalItem.title}</Typography>
                  <Typography variant="body2">
                    Preço Unitário: R$ {originalItem.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Quantidade no Pedido: {originalItem.quantity}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <InputLabel sx={{ mr: 1, fontSize: '0.9rem' }}>Qtd. para trocar:</InputLabel>
                    <TextField
                      type="number"
                      size="small"
                      value={selectedItemsToReturn.find(r => r.orderItemId === originalItem.id)?.quantityToReturn || 0}
                      inputProps={{ min: 0, max: originalItem.quantity }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        handleReturnSelectionChange(originalItem, isNaN(val) ? 0 : val);
                      }}
                      sx={{ width: '80px' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Itens no seu carrinho atual:
            </Typography>
            {cartItems.length === 0 && <Typography>Seu carrinho está vazio. Adicione itens que deseja em troca.</Typography>}
            {cartItems.map(cartItem => (
              <Card key={cartItem.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', p: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80, objectFit: 'contain', mr: 2 }}
                  image={cartItem.image}
                  alt={cartItem.title}
                />
                <CardContent sx={{ flexGrow: 1, p: '0 !important' }}>
                  <Typography variant="subtitle1">{cartItem.title}</Typography>
                  <Typography variant="body2">
                    {cartItem.quantity} x R$ {cartItem.price.toFixed(2)} = R$ {(cartItem.price * cartItem.quantity).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Resumo da Troca</Typography>
            <Typography>Valor dos itens devolvidos: R$ {valueOfReturnedItems.toFixed(2)}</Typography>
            <Typography>Valor dos novos itens: R$ {valueOfNewItemsInCart.toFixed(2)}</Typography>
            {cartItems.length > 0 && selectedDeliveryAddress && (
              <Typography>Frete: R$ {shippingCostForNewItems.toFixed(2)}</Typography>
            )}
            {amountToPay > 0 && (
              <Typography color="error" variant="h6" sx={{ mt: 1 }}>
                Valor a Pagar: R$ {amountToPay.toFixed(2)}
              </Typography>
            )}
            {couponValueGenerated > 0 && (
              <Typography color="primary" variant="h6" sx={{ mt: 1 }}>
                Cupom a ser Gerado: R$ {couponValueGenerated.toFixed(2)}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Endereço de Entrega</Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1">Selecione o endereço</Typography>
            <Button startIcon={<Plus />} size="small" onClick={() => setIsAddressModalOpen(true)}>
              Novo Endereço
            </Button>
          </Box>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={selectedDeliveryAddress} onChange={(e) => setSelectedDeliveryAddress(Number(e.target.value))}>
              {addresses.map((addr) => (
                <FormControlLabel key={addr.id} value={addr.id} control={<Radio />}
                  label={`${addr.streetType} ${addr.street}, ${addr.number} - ${addr.neighborhood}, ${addr.city}/${addr.state} (${addr.zipCode})`}
                />
              ))}
            </RadioGroup>
            {addresses.length === 0 && <Typography variant="body2">Nenhum endereço cadastrado. Adicione um novo.</Typography>}
          </FormControl>
        </Paper>

        {amountToPay > 0 && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Pagamento</Typography>
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">Selecione o método de pagamento</Typography>
                <Button startIcon={<Plus />} size="small" onClick={() => setIsPaymentModalOpen(true)}>
                  Novo Cartão
                </Button>
              </Box>
              {paymentMethods.map((pm) => (
                <Box key={pm.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, p: 1, border: '1px solid lightgray', borderRadius: 1 }}>
                  <Typography>
                    {pm.cardFlag} **** {pm.cardNumber.slice(-4)} ({pm.cardName})
                  </Typography>
                  {!orderPayments.find(op => op.paymentMethodId === pm.id) ? (
                    <IconButton size="small" onClick={() => handleAddOrderPayment(pm.id!)}>
                      <Plus color="green" /> Adicionar
                    </IconButton>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        type="number"
                        label="Valor"
                        size="small"
                        value={orderPayments.find(op => op.paymentMethodId === pm.id)?.amount.toFixed(2) || ''}
                        onChange={(e) => handleUpdateOrderPaymentAmount(pm.id!, parseFloat(e.target.value))}
                        inputProps={{ min: 0, step: "0.01" }}
                        sx={{ width: '100px', mr: 1 }}
                      />
                      <IconButton size="small" onClick={() => handleRemoveOrderPayment(pm.id!)}>
                        <Trash color="red" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
              {paymentMethods.length === 0 && <Typography variant="body2">Nenhum método de pagamento cadastrado. Adicione um novo.</Typography>}
              {orderPayments.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'right' }}>
                  Total Pago: R$ {sumOfOrderPayments.toFixed(2)}
                </Typography>
              )}
            </Paper>
          </>
        )}
        <Divider sx={{ my: 3 }} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Confirmar Solicitação de Troca
        </Button>
      </Paper>

      <Modal id="address-modal" open={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Adicionar Novo Endereço">
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdateAddress(currentAddress); }}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="CEP" name="zipCode" value={currentAddress.zipCode} onChange={handleAddressChange} onBlur={(e) => fetchAddressByCep(e.target.value)} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Tipo Logradouro" name="streetType" value={currentAddress.streetType} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Logradouro" name="street" value={currentAddress.street} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={4}><TextField fullWidth label="Número" name="number" value={currentAddress.number} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={8}><TextField fullWidth label="Complemento" name="complement" value={currentAddress.complement} onChange={handleAddressChange} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Bairro" name="neighborhood" value={currentAddress.neighborhood} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Cidade" name="city" value={currentAddress.city} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Estado (UF)" name="state" value={currentAddress.state} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="País" name="country" value={currentAddress.country} onChange={handleAddressChange} required /></Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" fullWidth><FormLabel component="legend">Tipo do Endereço</FormLabel>
                <FormGroup row>
                  {['COBRANCA', 'ENTREGA', 'RESIDENCIAL'].map(type => (
                    <FormControlLabel key={type} control={<Checkbox checked={currentAddress.addressType.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked ? [...currentAddress.addressType, type] : currentAddress.addressType.filter(t => t !== type);
                        setCurrentAddress({ ...currentAddress, addressType: newTypes });
                      }} />} label={type.charAt(0) + type.slice(1).toLowerCase()} />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setIsAddressModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Adicionar Endereço</Button>
          </DialogActions>
        </Box>
      </Modal>

      <Modal id="payment-modal" open={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="Adicionar Novo Cartão">
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleUpdatePaymentMethod(currentPayment); }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Número do Cartão" name="cardNumber" value={currentPayment.cardNumber} onChange={handlePaymentChange} required /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Bandeira</InputLabel>
                <Select name="cardFlag" value={currentPayment.cardFlag} label="Bandeira" onChange={handleSelectChangePayment}>
                  <MenuItem value="VISA">VISA</MenuItem><MenuItem value="MASTERCARD">MASTERCARD</MenuItem><MenuItem value="AMEX">AMEX</MenuItem><MenuItem value="ELO">ELO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Nome no Cartão" name="cardName" value={currentPayment.cardName} onChange={handlePaymentChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Validade (MM/AA)" name="cardExpiration" value={currentPayment.cardExpiration} onChange={handlePaymentChange} required /></Grid>
            <Grid item xs={6}><TextField fullWidth label="CVV" name="cvv" value={currentPayment.cvv} onChange={handlePaymentChange} required /></Grid>
            <Grid item xs={12}><FormControlLabel control={<Checkbox checked={currentPayment.primary} onChange={(e) => setCurrentPayment(prev => ({ ...prev, primary: e.target.checked }))} />} label="Cartão Principal" /></Grid>
          </Grid>
          <DialogActions>
            <Button onClick={() => setIsPaymentModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Adicionar Cartão</Button>
          </DialogActions>
        </Box>
      </Modal>

      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={() => { setError(''); setSuccess(''); }}>
        <Alert onClose={() => { setError(''); setSuccess(''); }} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default CriarTroca;