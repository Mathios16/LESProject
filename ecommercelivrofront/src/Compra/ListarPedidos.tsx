import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";

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
      case 'PROCESSING': return ['APROVAR', 'REPROVAR', 'CANCELAR'];
      case 'APPROVED': return ['ENVIAR', 'CANCELAR'];
      case 'IN_TRANSIT': return ['ENTREGAR', 'CANCELAR'];
      case 'EXCHANGE_REQUESTED': return ['APROVAR TROCA', 'REPROVAR TROCA'];
      case 'EXCHANGE_APPROVED': return ['FINALIZAR TROCA'];
      case 'RETURN_REQUESTED': return ['APROVAR DEVOLUÇÃO', 'REPROVAR DEVOLUÇÃO'];
      case 'RETURN_APPROVED': return ['FINALIZAR DEVOLUÇÃO'];
      default: return [];
    }
  }

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      let newStatus = '';

      switch (status) {
        case 'APROVAR': newStatus = 'APPROVED'; break;
        case 'REPROVAR': newStatus = 'REPROVED'; break;
        case 'CANCELAR': newStatus = 'CANCELLED'; break;
        case 'ENVIAR': newStatus = 'IN_TRANSIT'; break;
        case 'ENTREGAR': newStatus = 'DELIVERED'; break;
        case 'APROVAR TROCA': newStatus = 'EXCHANGE_APPROVED'; break;
        case 'REPROVAR TROCA': newStatus = 'EXCHANGE_REFUSED'; break;
        case 'FINALIZAR TROCA': newStatus = 'EXCHANGE_COMPLETED'; break;
        case 'APROVAR DEVOLUÇÃO': newStatus = 'RETURN_APPROVED'; break;
        case 'REPROVAR DEVOLUÇÃO': newStatus = 'RETURN_REFUSED'; break;
        case 'FINALIZAR DEVOLUÇÃO': newStatus = 'RETURN_COMPLETED'; break;
      }

      const response = await fetch(`http://localhost:8080/order/${orderId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus
        }),
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
      case 'REPROVED': return 'REPROVADO';
      case 'APPROVED': return 'APROVADO';
      case 'CANCELLED': return 'CANCELADO';
      case 'IN_TRANSIT': return 'EM TRÂNSITO';
      case 'DELIVERED': return 'ENTREGUE';
      case 'EXCHANGE_REQUESTED': return 'TROCA SOLICITADA';
      case 'EXCHANGE_APPROVED': return 'TROCA APROVADA';
      case 'EXCHANGE_REFUSED': return 'TROCA REPROVADA';
      case 'EXCHANGE_COMPLETED': return 'TROCA FINALIZADA';
      case 'RETURN_REQUESTED': return 'DEVOLUÇÃO SOLICITADA';
      case 'RETURN_APPROVED': return 'DEVOLUÇÃO APROVADA';
      case 'RETURN_REFUSED': return 'DEVOLUÇÃO REPROVADA';
      case 'RETURN_COMPLETED': return 'DEVOLUÇÃO FINALIZADA';
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
                    <TableRow id={`order-row-${order.id}`} key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{convertStatus(order.status)}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.addressStreet}</TableCell>
                      <TableCell align="right">
                        <Select id={`order-select-${order.id}`} value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value)}>
                          {getUpdateStatus(order.status).map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
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