import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
import { Plus, X, Trash, Pencil, Eye, EyeSlash } from '@phosphor-icons/react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  Grid,
  Paper,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormGroup,
  FormLabel
} from '@mui/material';

import { SelectChangeEvent } from '@mui/material/Select';

interface Address {
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
  primary: boolean;
  cardFlag: string;
  cardNumber: string;
  cardName: string;
  cardExpiration: string;
  cvv: string;
}

interface Customer {
  name: string;
  lastname: string;
  gender: string;
  document: string;
  birthdate: string;
  email: string;
  password: string;
  phoneDdd: string;
  phoneType: string;
  phone: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
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

const EditarCliente: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useUrlParams();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    name: '',
    lastname: '',
    gender: '',
    document: '',
    birthdate: '',
    email: '',
    password: '',
    phoneDdd: '',
    phone: '',
    phoneType: '',
    addresses: [],
    paymentMethods: []
  });

  const previousCustomer = useRef<Customer>(customer);

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

  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const urlSegments = window.location.pathname.split('/');
    const userIdFromUrl = urlSegments[3].split('?')[0];
    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
    }
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:8080/customers/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar cliente');
        }

        const data = await response.json();
        setCustomer(data);
        previousCustomer.current = data;
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      }
    };

    if (userId) {
      fetchCustomer();
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChangeCustomer = (e: SelectChangeEvent<string>) => {
    const name = e.target.name as keyof Customer;
    const value = e.target.value;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/customers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }

      setSuccess('Cliente atualizado com sucesso!');
      navigate(`/clientes${type || id ? `?type=${type}&id=${id}` : ''}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Editar Cliente
        </Typography>

        <Paper elevation={3}>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    name="name"
                    value={customer.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sobrenome"
                    name="lastname"
                    value={customer.lastname}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gênero</InputLabel>
                    <Select
                      name="gender"
                      value={customer.gender}
                      onChange={handleSelectChangeCustomer}
                      required
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Feminino</MenuItem>
                      <MenuItem value="O">Outro</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CPF"
                    name="document"
                    value={customer.document}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Data de Nascimento"
                    name="birthdate"
                    value={customer.birthdate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    label="Senha"
                    name="password"
                    value={customer.password}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="DDD"
                      name="phoneDdd"
                      value={customer.phoneDdd}
                      onChange={handleInputChange}
                      required
                      style={{ width: '80px' }}
                    />
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <FormControl style={{ minWidth: '120px' }}>
                      <InputLabel>Tipo</InputLabel>
                      <Select
                        name="phoneType"
                        value={customer.phoneType}
                        onChange={handleSelectChangeCustomer}
                        required
                      >
                        <MenuItem value="MOBILE">Celular</MenuItem>
                        <MenuItem value="HOME">Residencial</MenuItem>
                        <MenuItem value="WORK">Trabalho</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Endereços</Typography>
                    <Button
                      variant="contained"
                      startIcon={<Plus />}
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      Adicionar Endereço
                    </Button>
                  </Box>
                  {customer.addresses && customer.addresses.map((address, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography>
                          {address.street}, {address.number} - {address.city}/{address.state}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => {/* Edit address */ }}>
                            <Pencil />
                          </IconButton>
                          <IconButton onClick={() => {/* Delete address */ }} color="error">
                            <Trash />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Métodos de Pagamento</Typography>
                    <Button
                      variant="contained"
                      startIcon={<Plus />}
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      Adicionar Método de Pagamento
                    </Button>
                  </Box>
                  {customer.paymentMethods && customer.paymentMethods.map((payment, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography>
                          {payment.cardFlag} **** {payment.cardNumber.slice(-4)}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => {/* Edit payment */ }}>
                            <Pencil />
                          </IconButton>
                          <IconButton onClick={() => {/* Delete payment */ }} color="error">
                            <Trash />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        navigate(`/clientes${type || id ? `?type=${type}&id=${id}` : ''}`);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Salvar Alterações
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Box>

      <Modal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Adicionar Endereço"
      >
        <Box component="form" onSubmit={(e) => {
          e.preventDefault();
          setCustomer(prev => ({
            ...prev,
            addresses: [...(prev.addresses || []), currentAddress]
          }));
          setIsAddressModalOpen(false);
          setCurrentAddress({
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
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo de Rua"
                name="streetType"
                value={currentAddress.streetType}
                onChange={handleAddressChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rua"
                name="street"
                value={currentAddress.street}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número"
                name="number"
                value={currentAddress.number}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Complemento"
                name="complement"
                value={currentAddress.complement}
                onChange={handleAddressChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={currentAddress.neighborhood}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={currentAddress.city}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={currentAddress.state}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="País"
                name="country"
                value={currentAddress.country}
                onChange={handleAddressChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CEP"
                name="zipCode"
                value={currentAddress.zipCode}
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
          setCustomer(prev => ({
            ...prev,
            paymentMethods: [...(prev.paymentMethods || []), currentPayment]
          }));
          setIsPaymentModalOpen(false);
          setCurrentPayment({
            primary: false,
            cardFlag: '',
            cardNumber: '',
            cardName: '',
            cardExpiration: '',
            cvv: ''
          });
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número do Cartão"
                name="cardNumber"
                value={currentPayment.cardNumber}
                onChange={handlePaymentChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome no Cartão"
                name="cardName"
                value={currentPayment.cardName}
                onChange={handlePaymentChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Expiração"
                name="cardExpiration"
                value={currentPayment.cardExpiration}
                onChange={handlePaymentChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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
    </Container>
  );
};

export default EditarCliente;