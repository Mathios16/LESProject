import React, { useState } from 'react';
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
  status: 'PROCESSANDO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';
  date: string;
  items: OrderItem[];
  subtotal: number;
}

const VerPedidos: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      status: 'PROCESSANDO',
      date: '2024-03-20',
      items: [
        { id: 101, name: 'Livro de React', quantity: 2, price: 59.99 },
        { id: 102, name: 'Livro de TypeScript', quantity: 1, price: 49.99 }
      ],
      subtotal: 169.97
    },
    {
      id: 2,
      status: 'ENVIADO',
      date: '2024-03-15',
      items: [
        { id: 201, name: 'Livro de Node.js', quantity: 1, price: 69.99 }
      ],
      subtotal: 69.99
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
    // TODO: Implement exchange request logic
    console.log(`Solicitar troca para pedido ${orderId}`);
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
                Pedido #{order.id} - {order.date}
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