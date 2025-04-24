import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  subTotal: number;
}

const VerPedidos: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setUserId(navbar.dataset.userId);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/order/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PROCESSANDO': return 'warning';
      case 'ENVIADO': return 'primary';
      case 'ENTREGUE': return 'success';
      case 'CANCELADO': return 'error';
    }
  };

  const convertStatus = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'PROCESSANDO';
      case 'SHIPPED': return 'ENVIADO';
      case 'DELIVERED': return 'ENTREGUE';
      case 'CANCELLED': return 'CANCELADO';
    }
  };

  const handleRequestExchange = (orderId: number) => {
    navigate(`/pedido/${orderId}/troca`);
  };

  const handleRequestReturn = (orderId: number) => {
    navigate(`/pedido/${orderId}/devolucao`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Meus Pedidos
      </Typography>
      {orders.map((order) => (
        <Paper
          key={order.id}
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderLeft: `4px solid ${getStatusColor(order.status) === 'warning' ? 'orange' :
              getStatusColor(order.status) === 'primary' ? 'blue' :
                getStatusColor(order.status) === 'success' ? 'green' : 'red'}`
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">
                Pedido #{order.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
              <Chip
                label={convertStatus(order.status)}
                color={getStatusColor(order.status)}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Preço</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">R$ {(item.price / item.quantity).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      R$ {(item.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2
            }}
          >
            <Typography variant="h6">
              Total do Pedido: R$ {order.subTotal.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRequestExchange(order.id)}
              disabled={order.status !== 'DELIVERED'}
            >
              Solicitar Troca
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRequestReturn(order.id)}
              disabled={order.status !== 'DELIVERED'}
            >
              Solicitar Devolução
            </Button>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default VerPedidos;