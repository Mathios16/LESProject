import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControlLabel,
  Checkbox
} from '@mui/material';

// Mock data interfaces
interface OrderItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

const CriarDevolucao: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useUrlParams();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setUserId(navbar.dataset.userId);
    }
  }, []);

  const [orderId, setOrderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = window.location.pathname;
    const orderId = url.split('/').filter(Boolean)[1].split('?')[0];

    setOrderId(orderId || undefined);
  }, []);

  const [originalOrderItems, setOriginalOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (orderId) {
      const fetchItem = async () => {
        try {
          const response = await fetch(`http://localhost:8080/order/${orderId}/order`);
          if (!response.ok) {
            throw new Error('Erro ao buscar pedido');
          }
          const data = await response.json();
          console.log(data);
          setOriginalOrderItems(data[0].items);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao buscar pedido. Tente novamente.');
        }
      };
      fetchItem();
    }
  }, [orderId]);

  const [selectedReturns, setSelectedReturns] = useState<number[]>([]);

  const handleReturnSelection = (itemId: number) => {
    setSelectedReturns(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const ReturnSummary = useMemo(() => {
    const totalOriginalValue = originalOrderItems.reduce((sum, item) => sum + item.price, 0);
    const totalReturnValue = originalOrderItems.filter(item => selectedReturns.includes(item.id))
      .reduce((sum, item) => sum + (item?.price || 0), 0);

    return {
      totalOriginalValue,
      totalReturnValue
    };
  }, [selectedReturns, originalOrderItems]);

  const handleSubmit = async () => {
    try {
      let response = await fetch(`http://localhost:8080/order/${orderId}/return`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          items: Object.values(selectedReturns).filter(item => item !== null)
        })
      });
      const returnData = await response.json();

      navigate(`/pedidos/ver${type || id ? `?type=${type}&id=${id}` : ''}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar devolução. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Solicitar Devolução de Itens
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Selecione os itens que deseja devolver
        </Typography>

        {originalOrderItems.map(originalItem => {

          return (
            <Card key={originalItem.id} sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={originalItem.image}
                      alt={originalItem.title}
                      sx={{ objectFit: 'contain' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {originalItem.title}
                    </Typography>
                    <Typography variant="body2">
                      Valor: R$ {originalItem.price.toFixed(2)}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={() => handleReturnSelection(originalItem.id)}
                        />
                      }
                      label="Adicionar a Devolução"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}

        <Divider sx={{ my: 2 }} />

        <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Resumo da Devolução
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">
                Valor Total Original: R$ {ReturnSummary.totalOriginalValue.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body1"
                color='info.main'
              >
                {`Cupom Gerado: R$ ${Math.abs(ReturnSummary.totalReturnValue).toFixed(2)}`}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={Object.values(selectedReturns).length == 0}
        >
          Solicitar Devolução
        </Button>
      </Paper>
    </Container>
  );
};

export default CriarDevolucao;