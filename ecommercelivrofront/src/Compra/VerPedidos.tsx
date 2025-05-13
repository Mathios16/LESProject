import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
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
  total: number;
  cupomId: number;
}

const VerPedidos: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useUrlParams();
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
      const response = await fetch(`http://localhost:8080/order/${userId}/customer`, {
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
      case 'PROCESSING': return 'warning';
      case 'IN_TRANSIT': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      case 'EXCHANGE_REQUESTED': return 'warning';
      case 'EXCHANGE_APPROVED': return 'primary';
      case 'EXCHANGE_REFUSED': return 'error';
      case 'EXCHANGE_COMPLETED': return 'success';
      case 'RETURN_REQUESTED': return 'warning';
      case 'RETURN_APPROVED': return 'primary';
      case 'RETURN_REFUSED': return 'error';
      case 'RETURN_COMPLETED': return 'success';
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

  const handleRequestExchange = (orderId: number) => {
    navigate(`/pedido/${orderId}/troca${type || id ? `?type=${type}&id=${id}` : ''}`);
  };

  const handleRequestReturn = (orderId: number) => {
    navigate(`/pedido/${orderId}/devolucao${type || id ? `?type=${type}&id=${id}` : ''}`);
  };

  const getReturnCupom = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/order/${orderId}/return`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data[0].cupom) {
        return data[0].cupom.code;
      }
      return '';
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return '';
    }
  };

  const getExchangeCupom = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/order/${orderId}/exchange`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data) {
        return data.code;
      }
      return '';
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return '';
    }
  };

  const getCupom = async (cupomId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/cupom/${cupomId}/id`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data) {
        return data.code;
      }
      return '';
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return '';
    }
  };

  const [cupomValues, setCupomValues] = useState<Record<number, string>>({});

  const loadCupomValue = async (id: number) => {
    const value = await getReturnCupom(id);
    if (value) {
      console.log(value);
      setCupomValues(prev => ({ ...prev, [id]: value }));
    }
    const exchangeValue = await getExchangeCupom(id);
    if (exchangeValue) {
      setCupomValues(prev => ({ ...prev, [id]: exchangeValue }));
    }
    const cupomValue = orders.find(order => order.id === id)?.cupomId;
    if (cupomValue) {
      const cupom = await getCupom(cupomValue);
      if (cupom) {
        setCupomValues(prev => ({ ...prev, [id]: cupom }));
      }
    }
  };

  useEffect(() => {
    if (orders) {
      orders.forEach(order => {
        loadCupomValue(order.id);
      });
    }
  }, [orders]);

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
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="h6">
                Pedido #{order.id}
              </Typography>
            </Box>
            <Box sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              {order.status === 'DELIVERED' && (
                <>
                  <Button
                    id={`request-exchange-${order.id}`}
                    variant="contained"
                    color="secondary"
                    sx={{ m: 1 }}
                    onClick={() => handleRequestExchange(order.id)}
                  >
                    Solicitar Troca
                  </Button>
                  <Button
                    id={`request-return-${order.id}`}
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRequestReturn(order.id)}
                  >
                    Solicitar Devolução
                  </Button>
                </>
              )}
              {order.status === 'RETURN_COMPLETED' && (
                <>
                  <Typography variant="h6">
                    Cupom de devolução: {cupomValues[order.id] || 'Carregando...'}
                  </Typography>
                </>
              )}
              {order.status === 'EXCHANGE_COMPLETED' && (
                <>
                  <Typography variant="h6">
                    Cupom de troca: {cupomValues[order.id] || 'Carregando...'}
                  </Typography>
                </>
              )}
              {order.cupomId && (
                <>
                  <Typography variant="h6">
                    Cupom de pedido: {cupomValues[order.id] || 'Carregando...'}
                  </Typography>
                </>
              )}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={convertStatus(order.status)}
                color={getStatusColor(order.status)}
                variant="outlined"
              />
            </Box>
          </Box>

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
              Total do Pedido: R$ {order.total.toFixed(2)}
            </Typography>

          </Box>
        </Paper>
      ))
      }
    </Container >
  );
};

export default VerPedidos;