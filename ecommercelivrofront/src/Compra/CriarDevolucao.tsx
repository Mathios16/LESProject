import React, { useState, useMemo, useEffect } from 'react';
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
  InputLabel,
  TextField,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';

interface OrderItem {
  id: number;
  itemId?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface SelectedReturnItemDetail {
  orderItemId: number;
  itemId?: number;
  title: string;
  price: number;
  image: string;
  originalQuantity: number;
  quantityToReturn: number;
}

const CriarDevolucao: React.FC = () => {
  const navigate = useNavigate();
  const { type, id: routeIdParam } = useUrlParams();
  const [searchParams] = useSearchParams();

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const idFromParams = searchParams.get('id');
    if (idFromParams) {
      setUserId(idFromParams);
    } else {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        setUserId(navbar.dataset.userId);
      }
    }
  }, [searchParams]);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = window.location.pathname;
    const pathParts = url.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0].toLowerCase() === 'pedido') {
      setOrderId(pathParts[1]);
    }
  }, []);

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

  const [selectedItemsForReturn, setSelectedItemsForReturn] = useState<SelectedReturnItemDetail[]>([]);

  const handleReturnQuantityChange = (item: OrderItem, quantityToReturn: number) => {
    const newQuantity = Math.min(Math.max(0, quantityToReturn), item.quantity);

    setSelectedItemsForReturn(prev => {
      const existingIndex = prev.findIndex(r => r.orderItemId === item.id);
      if (newQuantity > 0) {
        const itemDetail: SelectedReturnItemDetail = {
          orderItemId: item.id,
          itemId: item.itemId,
          title: item.title,
          price: item.price,
          image: item.image,
          originalQuantity: item.quantity,
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

  const returnSummary = useMemo(() => {
    const totalReturnValueOfSelected = selectedItemsForReturn.reduce((sum, item) => sum + (item.price * item.quantityToReturn), 0);

    return {
      totalReturnValueOfSelected
    };
  }, [selectedItemsForReturn]);

  const handleSubmit = async () => {
    if (selectedItemsForReturn.length === 0) {
      setError("Por favor, selecione a quantidade de pelo menos um item para devolver.");
      return;
    }
    setError('');
    setSuccess('');

    const payload = {
      orderId: orderId,
      orderReturnItems: selectedItemsForReturn.map(item => ({
        orderItemId: item.orderItemId,
        itemId: item.itemId,
        quantity: item.quantityToReturn,
        price: item.price
      })),
      value: returnSummary.totalReturnValueOfSelected
    };

    try {
      const response = await fetch(`http://localhost:8080/order/${orderId}/return`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erro ao processar devolução." }));
        throw new Error(errorData.message || 'Falha ao solicitar devolução.');
      }

      const returnData = await response.json();
      setSuccess(returnData.message || `Devolução solicitada. Cupom de R$ ${returnSummary.totalReturnValueOfSelected.toFixed(2)} será gerado.`);
      setSelectedItemsForReturn([]);

      setTimeout(() => {
        navigate(`/pedidos/ver${type || routeIdParam ? `?type=${type}&id=${routeIdParam}` : ''}`);
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar devolução. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Solicitar Devolução de Itens
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Selecione os itens e quantidades para devolver:
            </Typography>
            {originalOrderItems.length === 0 && <Typography>Carregando itens do pedido...</Typography>}
            {originalOrderItems.map(originalItem => {
              const selectedQty = selectedItemsForReturn.find(r => r.orderItemId === originalItem.id)?.quantityToReturn || 0;
              return (
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
                      <InputLabel sx={{ mr: 1, fontSize: '0.9rem' }}>Qtd. a devolver:</InputLabel>
                      <TextField
                        id={`return-item-${originalItem.id}`}
                        type="number"
                        size="small"
                        value={selectedQty}
                        inputProps={{ min: 0, max: originalItem.quantity }}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          handleReturnQuantityChange(originalItem, isNaN(value) ? 0 : value)
                        }}
                        sx={{ width: '80px' }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumo da Devolução
              </Typography>
              <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold', mt: 1 }}>
                Valor do Cupom a ser Gerado: R$ {returnSummary.totalReturnValueOfSelected.toFixed(2)}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Um cupom de desconto no valor dos itens devolvidos será gerado em sua conta.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Button
          id="submit-return-request"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={selectedItemsForReturn.length === 0}
        >
          Confirmar Solicitação de Devolução
        </Button>
      </Paper>
      <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={() => { setError(''); setSuccess(''); }}>
        <Alert onClose={() => { setError(''); setSuccess(''); }} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CriarDevolucao;