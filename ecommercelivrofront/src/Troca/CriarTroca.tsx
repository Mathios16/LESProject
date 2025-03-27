import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
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

interface ExchangeItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

const CriarTroca: React.FC = () => {
  const navigate = useNavigate();
  // Mock order items
  const [originalOrderItems] = useState<OrderItem[]>([
    {
      id: 1,
      title: 'A cantiga dos pássaros e das serpentes',
      price: 59.90,
      image: 'https://m.media-amazon.com/images/I/61MCf2k-MgS._AC_UF1000,1000_QL80_.jpg'
    }
  ]);

  // Mock available exchange items
  const [availableItems] = useState<ExchangeItem[]>([
    {
      id: 101,
      title: 'Algoritmos e Estruturas de Dados',
      price: 75.00,
      image: 'https://example.com/algorithms-book.jpg'
    },
    {
      id: 102,
      title: 'Design de Software Orientado a Objetos',
      price: 95.30,
      image: 'https://example.com/oop-book.jpg'
    },
    {
      id: 103,
      title: 'Arquitetura de Computadores',
      price: 65.20,
      image: 'https://example.com/computer-arch-book.jpg'
    }
  ]);

  // State to track selected exchanges and search
  const [selectedExchanges, setSelectedExchanges] = useState<{ [key: number]: ExchangeItem | null }>({});
  const [searchTerms, setSearchTerms] = useState<{ [key: number]: string }>({});

  // const handleExchangeSelection = (originalItemId: number, exchangeItem: ExchangeItem | null) => {
  //   setSelectedExchanges(prev => ({
  //     ...prev,
  //     [originalItemId]: exchangeItem
  //   }));
  // };

  const handleExchangeSelection = (itemId: number, item: ExchangeItem) => {
    setSelectedExchanges(prev =>
      prev[itemId] ? { ...prev, [itemId]: null } : { ...prev, [itemId]: item }
    );
  };

  const exchangeSummary = useMemo(() => {
    const totalOriginalValue = originalOrderItems.reduce((sum, item) => sum + item.price, 0);
    const totalExchangeValue = Object.values(selectedExchanges)
      .filter(item => item !== null)
      .reduce((sum, item) => sum + (item?.price || 0), 0);

    return {
      totalOriginalValue,
      totalExchangeValue
    };
  }, [selectedExchanges, originalOrderItems]);

  const handleSubmitExchange = () => {
    navigate('/pedido/ver');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Solicitar Troca de Itens
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Selecione os itens que deseja trocar
        </Typography>

        {originalOrderItems.map(originalItem => {
          const selectedExchangeItem = selectedExchanges[originalItem.id];

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
                          onChange={() => handleExchangeSelection(originalItem.id, originalItem)}
                        />
                      }
                      label="Adicionar a Troca"
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
            Resumo da Troca
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">
                Valor Total Original: R$ {exchangeSummary.totalOriginalValue.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="body1"
                color='info.main'
              >
                {`Cupom Gerado: R$ ${Math.abs(exchangeSummary.totalExchangeValue).toFixed(2)}`}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSubmitExchange}
        >
          Solicitar Troca
        </Button>
      </Paper>
    </Container>
  );
};

export default CriarTroca;