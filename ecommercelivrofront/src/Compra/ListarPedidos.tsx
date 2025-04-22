import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { PencilSimple } from "@phosphor-icons/react";

interface Order {
  id: number;
  status: string;
  customerName: string;
  addressStreet: string;
  subTotal: number;
}

const ListarPedidos: React.FC = () => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/order', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const getUpdateStatus = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'APROVAR';
      case 'APROVED': return 'ENVIAR';
      case 'SHIPPED': return 'ENTREGAR';
    }
  }

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      let newStatus = '';

      switch (status) {
        case 'APROVAR': newStatus = 'APROVED'; break;
        case 'ENVIAR': newStatus = 'SHIPPED'; break;
        case 'ENTREGAR': newStatus = 'DELIVERED'; break;
      }

      const response = await fetch(`http://localhost:8080/order/${orderId}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido');
      }

      fetchOrders();
      setSuccess('Status do pedido atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  };

  const convertStatus = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 'PROCESSANDO';
      case 'APROVED': return 'APROVADO';
      case 'SHIPPED': return 'ENVIADO';
      case 'DELIVERED': return 'ENTREGUE';
      case 'CANCELLED': return 'CANCELADO';
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">
            Lista de Clientes
          </Typography>
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
                  label="Status"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                />
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Endereço de Entrega</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.addressStreet}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/pedidos/${order.id}`)}
                        >
                          <PencilSimple />
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
    </Container>
  );
};

export default ListarPedidos;