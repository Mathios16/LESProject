import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilSimple, Trash } from '@phosphor-icons/react';

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
  phoneddd: string;
  phone: string;
  phoneType: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

const ListarClientes: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchDocument, setSearchDocument] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append('name', searchName);
      if (searchEmail) queryParams.append('email', searchEmail);
      if (searchDocument) queryParams.append('document', searchDocument);

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
      console.error('Erro na busca de clientes:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchName, searchEmail, searchDocument]);

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

        fetchCustomers();
      } catch (error) {
        console.error('Erro na exclusão de cliente:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      }
    }
  };

  return (
    <div className="cliente-container">
      <div className="cliente-header">
        <h1>Lista de Clientes</h1>
        <div className="cliente-actions">
          <button className="primary" onClick={() => navigate('/cliente/criar')}>
            Novo Cliente
          </button>
        </div>
      </div>
      
      <div className="cliente-form">
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-control"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Buscar por nome"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Buscar por email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">CPF/CNPJ</label>
            <input
              type="text"
              className="form-control"
              value={searchDocument}
              onChange={(e) => setSearchDocument(e.target.value)}
              placeholder="Buscar por documento"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name} {customer.lastname}</td>
                <td>{customer.email}</td>
                <td>{customer.document}</td>
                <td>
                  {customer.phoneddd} {customer.phone}
                </td>
                <td>
                  <div className="actions">
                    <button
                      className="edit"
                      onClick={() => navigate(`/cliente/editar/${customer.id}`)}
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ListarClientes;