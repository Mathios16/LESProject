import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
import { PencilSimple, Trash } from '@phosphor-icons/react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentMethod {
  type: string;
  cardNumber?: string;
  cardHolder?: string;
  expirationDate?: string;
}

interface Customer {
  id: number;
  name: string;
  lastname: string;
  email: string;
  document: string;
  phoneDdd: string;
  phone: string;
  phoneType: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

const ListarClientes: React.FC = () => {
  const { type, id } = useUrlParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchDocument, setSearchDocument] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append('name', searchName);
      if (searchEmail) queryParams.append('email', searchEmail);
      if (searchDocument) queryParams.append('document', searchDocument);
      if (searchPhone) queryParams.append('phone', searchPhone);

      const response = await fetch(`http://localhost:8080/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchName, searchEmail, searchDocument, searchPhone]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await fetch(`http://localhost:8080/customers/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir cliente');
        }

        setSuccess('Cliente excluído com sucesso!');
        fetchCustomers();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">
            Lista de Clientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate(`/clientes/criar${type || id ? `?type=${type}&id=${id}` : ''}`);
            }}
          >
            Novo Cliente
          </Button>
        </Box>

        <Paper elevation={3}>
          <Box p={3}>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={searchDocument}
                  onChange={(e) => setSearchDocument(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                />
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name} {customer.lastname}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.document}</TableCell>
                      <TableCell>({customer.phoneDdd}) {customer.phone}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            navigate(`/cliente/editar/${customer.id}${type || id ? `?type=${type}&id=${id}` : ''}`)
                          }}
                        >
                          <PencilSimple />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
          setSuccess('');
        }}
      >
        <Alert
          severity={error ? "error" : "success"}
          onClose={() => {
            setError(null);
            setSuccess('');
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ListarClientes;