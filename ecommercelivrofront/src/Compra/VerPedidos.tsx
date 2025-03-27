import React, { useState } from 'react';
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
  image: string;
}

interface Order {
  id: number;
  status: 'PROCESSANDO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  date: string;
  items: OrderItem[];
  subtotal: number;
}

const VerPedidos: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      status: 'ENTREGUE',
      date: '2024-03-20',
      items: [
        {
          id: 1, name: 'A cantiga dos pássaros e das serpentes',
          image: 'https://m.media-amazon.com/images/I/61MCf2k-MgS._AC_UF1000,1000_QL80_.jpg',
          quantity: 2, price: 59.90
        }
      ],
      subtotal: 125.70
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PROCESSANDO': return 'warning';
      case 'ENVIADO': return 'primary';
      case 'ENTREGUE': return 'success';
      case 'CANCELADO': return 'error';
    }
  };

  const handleRequestExchange = (orderId: number) => {
    navigate(`/pedido/${orderId}/troca`);
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
                label={order.status}
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
                    <TableCell align="right">R$ {item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      R$ {(item.quantity * item.price).toFixed(2)}
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
              Total do Pedido: R$ {order.subtotal.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRequestExchange(order.id)}
              disabled={order.status !== 'ENTREGUE'}
            >
              Solicitar Troca
            </Button>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default VerPedidos;