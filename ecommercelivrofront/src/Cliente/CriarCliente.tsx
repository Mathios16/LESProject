import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Trash, Pencil, Eye, EyeSlash } from '@phosphor-icons/react';

interface Address {
  streetType: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  addressType: string[];
}

interface PaymentMethod {
  primary: boolean;
  cardFlag: string;
  cardNumber: string;
  cardName: string;
  cardExpiration: string;
  cvv: string;
}

interface Customer {
  name: string;
  lastname: string;
  gender: string;
  document: string;
  birthdate: string;
  email: string;
  password: string;
  phoneDdd: string;
  phoneType: string;
  phone: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const CriarCliente: React.FC = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    lastname: '',
    gender: '',
    document: '',
    birthdate: '',
    email: '',
    password: '',
    phoneDdd: '',
    phone: '',
    phoneType: '',
    addresses: [],
    paymentMethods: []
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [currentAddress, setCurrentAddress] = useState<Address>({
    streetType: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    addressType: []
  });

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod>({
    primary: false,
    cardFlag: '',
    cardNumber: '',
    cardName: '',
    cardExpiration: '',
    cvv: ''
  });

  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState<number | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, '');

    if (cleanedCep.length !== 8) {
      setError('CEP inválido. Digite um CEP com 8 dígitos.');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar endereço');
      }

      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado. Verifique o número digitado.');
        return;
      }

      setCurrentAddress(prevAddress => ({
        ...prevAddress,
        streetType: '',
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        country: 'Brasil',
        zipCode: `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5, 8)}`
      }));

      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar endereço. Tente novamente.');
    }
  }, []);

  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Address
  ) => {
    const value = e.target.value;

    if (field === 'zipCode') {
      const cleanedCep = value.replace(/\D/g, '');

      const formattedCep = cleanedCep.length > 5
        ? `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5, 8)}`
        : cleanedCep;

      setCurrentAddress(prev => ({
        ...prev,
        [field]: formattedCep
      }));

      if (cleanedCep.length === 8) {
        fetchAddressByCep(cleanedCep);
      }
    } else {
      setCurrentAddress(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePaymentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof PaymentMethod
  ) => {
    const value = e.target.value;

    if (field === 'cardExpiration') {
      const cleanedDate = value.replace(/\D/g, '');
      const formattedDate = `${cleanedDate.slice(0, 2)}/${cleanedDate.slice(2, 4)}`;

      setCurrentPaymentMethod(prev => ({
        ...prev,
        [field]: formattedDate
      }));
      return;
    }
    setCurrentPaymentMethod(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Customer
  ) => {
    const value = e.target.value;

    if (field === 'document') {
      const cleanedCpf = value.replace(/\D/g, '');

      const formattedCpf = `${cleanedCpf.slice(0, 3)}.${cleanedCpf.slice(3, 6)}.${cleanedCpf.slice(6, 9)}-${cleanedCpf.slice(9, 11)}`;

      setCustomer(prev => ({
        ...prev,
        [field]: formattedCpf
      }));
      return;
    }

    if (field === 'phone') {
      const cleanedPhone = value.replace(/\D/g, '');

      let phoneType = '';
      let phoneDdd = '';

      if (cleanedPhone.length === 10) {
        phoneType = 'FIXO';
      } else if (cleanedPhone.length === 11) {
        phoneType = 'CELULAR';
      }

      const formattedPhone = cleanedPhone.length >= 11
        ? `${cleanedPhone.slice(2, 7)}-${cleanedPhone.slice(7)}`
        : `${cleanedPhone.slice(2, 6)}-${cleanedPhone.slice(6)}`;

      phoneDdd = cleanedPhone.slice(0, 2);

      setCustomer(prev => ({
        ...prev,
        phoneType,
        phoneDdd,
        [field]: formattedPhone
      }));
      return;
    }

    if (field === 'email') {
      const cleanedEmail = value.replace(/\s/g, '');

      if (!/^[^\s]+@[^\s]+\.[^\s]+$/.test(cleanedEmail)) {
        setError('Email inválido');
      } else {
        setError('');
      }

      setCustomer(prev => ({
        ...prev,
        [field]: cleanedEmail
      }));
      return;
    }

    if (field === 'password') {
      const cleanedPassword = value.replace(/\s/g, '');

      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)[\w\W]{8,}$/.test(cleanedPassword)) {
        setError('Senha inválida');
      } else {
        setError('');
      }

      setCustomer(prev => ({
        ...prev,
        [field]: cleanedPassword
      }));
      return;
    }

    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customer.addresses) {
      customer.addresses = [];
    }

    if (!customer.paymentMethods) {
      customer.paymentMethods = [];
    }

    if (customer.addresses.length === 0) {
      setError('Adicione pelo menos um endereço');
      return;
    }

    const hasBillingAddress = customer.addresses.some(addr => addr.addressType.includes('COBRANCA'));
    const hasShippingAddress = customer.addresses.some(addr => addr.addressType.includes('ENTREGA'));
    const hasResidenceAddress = customer.addresses.some(addr => addr.addressType.includes('RESIDENCIAL'));

    if (!hasBillingAddress) {
      setError('Adicione pelo menos um endereço de cobrança');
      return;
    }

    if (!hasShippingAddress) {
      setError('Adicione pelo menos um endereço de entrega');
      return;
    }

    if (!hasResidenceAddress) {
      setError('Adicione pelo menos um endereço residencial');
      return;
    }

    if (customer.paymentMethods.length === 0) {
      setError('Adicione pelo menos um método de pagamento');
      return;
    }

    const hasPrimaryCard = customer.paymentMethods.some(payment => payment.primary);
    if (!hasPrimaryCard) {
      setError('Defina um cartão como principal');
      return;
    }

    if (customer.password && passwordConfirmation && customer.password !== passwordConfirmation) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      let addresses = customer.addresses;
      let paymentMethods = customer.paymentMethods;
      delete customer.addresses;
      delete customer.paymentMethods;

      console.log(JSON.stringify({
        customer,
        addresses,
        paymentMethods
      }));
      const response = await fetch('http://localhost:8080/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          addresses,
          paymentMethods
        }),
      });

      if (!response.ok) {
        customer.addresses = addresses;
        customer.paymentMethods = paymentMethods;
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Erro ao criar cliente');
      }

      setSuccess('Cliente criado com sucesso!');
      setTimeout(() => navigate('/clientes'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente. Por favor, tente novamente.');
    }
  };

  const detectStreetType = (street: string): string => {
    const streetLower = street.toLowerCase().trim();
    const streetTypeMappings = [
      { prefix: 'rua', type: 'RUA' },
      { prefix: 'avenida', type: 'AVENIDA' },
      { prefix: 'av.', type: 'AVENIDA' },
      { prefix: 'condomínio', type: 'CONDOMINIO' },
      { prefix: 'praça', type: 'PRACA' },
      { prefix: 'estrada', type: 'ESTRADA' },
      { prefix: 'rod.', type: 'ESTRADA' },
      { prefix: 'rodovia', type: 'ESTRADA' }
    ];

    for (const mapping of streetTypeMappings) {
      if (streetLower.startsWith(mapping.prefix)) {
        return mapping.type;
      }
    }

    return 'OUTRO';
  };

  const handleAddAddress = () => {
    if (currentAddress.addressType.length === 0) {
      setError('Selecione pelo menos um tipo de endereço');
      return;
    }

    const detectedStreetType = currentAddress.streetType || detectStreetType(currentAddress.street);

    const addressToAdd = {
      ...currentAddress,
      streetType: detectedStreetType
    };

    if (!customer.addresses) {
      customer.addresses = [];
    }

    if (editingAddressIndex !== null) {
      const newAddresses = [...customer.addresses];
      newAddresses[editingAddressIndex] = addressToAdd;
      setCustomer({ ...customer, addresses: newAddresses });
      setEditingAddressIndex(null);
    } else {
      const hasConflictingTypes = currentAddress.addressType.some(type =>
        customer.addresses?.some(addr => addr.addressType.includes(type))
      );

      if (hasConflictingTypes) {
        setError('Já existe um endereço com um dos tipos selecionados');
        return;
      }
      setCustomer({ ...customer, addresses: [...customer.addresses, addressToAdd] });
    }

    setCurrentAddress({
      streetType: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      addressType: []
    });
    setIsAddressModalOpen(false);
    setError('');
  };

  const handleAddPaymentMethod = () => {
    if (!currentPaymentMethod.cardNumber || !currentPaymentMethod.cardName ||
      !currentPaymentMethod.cardExpiration || !currentPaymentMethod.cvv) {
      setError('Preencha todos os campos do cartão');
      return;
    }

    if (!customer.paymentMethods) {
      customer.paymentMethods = [];
    }

    if (editingPaymentIndex !== null) {
      if (currentPaymentMethod.primary &&
        !customer.paymentMethods[editingPaymentIndex].primary &&
        customer.paymentMethods.some((p, i) => i !== editingPaymentIndex && p.primary)) {
        setError('Já existe um cartão principal');
        return;
      }

      const newPaymentMethods = [...customer.paymentMethods];
      newPaymentMethods[editingPaymentIndex] = currentPaymentMethod;
      setCustomer({ ...customer, paymentMethods: newPaymentMethods });
      setEditingPaymentIndex(null);
    } else {
      if (currentPaymentMethod.primary && customer.paymentMethods.some(p => p.primary)) {
        setError('Já existe um cartão principal');
        return;
      }
      setCustomer({ ...customer, paymentMethods: [...customer.paymentMethods, currentPaymentMethod] });
    }

    setCurrentPaymentMethod({
      primary: false,
      cardFlag: '',
      cardNumber: '',
      cardName: '',
      cardExpiration: '',
      cvv: ''
    });
    setIsPaymentModalOpen(false);
    setError('');
  };

  const handleEditAddress = (index: number) => {
    if (!customer.addresses) {
      customer.addresses = [];
    }
    setCurrentAddress(customer.addresses[index]);
    setEditingAddressIndex(index);
    setIsAddressModalOpen(true);
  };

  const handleEditPaymentMethod = (index: number) => {
    if (!customer.paymentMethods) {
      customer.paymentMethods = [];
    }
    setCurrentPaymentMethod(customer.paymentMethods[index]);
    setEditingPaymentIndex(index);
    setIsPaymentModalOpen(true);
  };

  const handleDeleteAddress = (index: number) => {
    const newAddresses = customer.addresses?.filter((_, i) => i !== index) || [];
    setCustomer({ ...customer, addresses: newAddresses });
  };

  const handleDeletePaymentMethod = (index: number) => {
    const newPaymentMethods = customer.paymentMethods?.filter((_, i) => i !== index) || [];
    setCustomer({ ...customer, paymentMethods: newPaymentMethods });
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    setCurrentAddress({
      streetType: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      addressType: []
    });
    setEditingAddressIndex(null);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentPaymentMethod({
      primary: false,
      cardFlag: '',
      cardNumber: '',
      cardName: '',
      cardExpiration: '',
      cvv: ''
    });
    setEditingPaymentIndex(null);
  };

  const isPasswordValid = () => {
    if (customer.password && passwordConfirmation) {
      return customer.password === passwordConfirmation;
    }
    return true;
  };

  return (
    <div className="cliente-container">
      <div className="header">
        <h1>Cadastro de Cliente</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Nome</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sobrenome</label>
            <input
              id="lastname"
              type="text"
              className="form-control"
              value={customer.lastname}
              onChange={(e) => setCustomer({ ...customer, lastname: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">CPF</label>
            <input
              id="document"
              type="text"
              className="form-control"
              value={customer.document}
              onChange={(e) => handleInputChange(e, 'document')}
              required
            />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Data de Nascimento</label>
            <input
              id="birthdate"
              type="date"
              className="form-control"
              value={customer.birthdate}
              onChange={(e) => setCustomer({ ...customer, birthdate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <input
              id="phone"
              type="text"
              className="form-control"
              value={`(${customer.phoneDdd}) ${customer.phone}`}
              onChange={(e) => handleInputChange(e, 'phone')}
              required
              maxLength={15}
            />
            {customer.phoneType === 'FIXO' && <small className="form-text text-muted">Telefone Fixo</small>}
            {customer.phoneType === 'CELULAR' && <small className="form-text text-muted">Celular</small>}
          </div>

          <div className="form-group">
            <label className="form-label">Gênero</label>
            <select
              id="gender"
              className="form-control"
              value={customer.gender}
              onChange={(e) => setCustomer({ ...customer, gender: e.target.value })}
              required
            >
              <option value="">Selecione</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              onBlur={(e) => handleInputChange(e, 'email')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="password-input-container" style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={customer.password}
                onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                onBlur={(e) => handleInputChange(e, 'password')}
                required
                style={{
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {customer.password && (
            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div className="password-input-container" style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${!isPasswordValid() ? 'is-invalid' : ''}`}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  style={{
                    paddingRight: '40px'
                  }}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="password-toggle"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? (
                    <EyeSlash size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {!isPasswordValid() && (
                <small className="form-text text-muted">As senhas não coincidem</small>
              )}
            </div>
          )}
        </div>

        <div className="section-header">
          <h4>Endereços</h4>
          <button
            id="create-address"
            type="button"
            className="add-button"
            onClick={() => {
              setEditingAddressIndex(null);
              setIsAddressModalOpen(true);
            }}
          >
            <Plus size={20} />
            Adicionar Endereço
          </button>
        </div>

        <div className="items-list addresses">
          {customer.addresses?.map((address, index) => (
            <div key={index} className="list-item">
              <div className="item-info">
                <div className="item-type">
                  {address.addressType.includes('COBRANCA') && <span className="type-tag green">Cobrança</span>}
                  {address.addressType.includes('ENTREGA') && <span className="type-tag red">Entrega</span>}
                  {address.addressType.includes('RESIDENCIAL') && <span className="type-tag blue">Residencial</span>}
                </div>
                <p>{address.street}, {address.number}</p>
                {address.complement && <p>Complemento: {address.complement}</p>}
                <p>{address.neighborhood}</p>
                <p>{address.city} - {address.state}</p>
                <p>CEP: {address.zipCode}</p>
              </div>
              <div className="item-actions">
                <button
                  id="edit-address"
                  type="button"
                  className="edit-button"
                  onClick={() => handleEditAddress(index)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  id="delete-address"
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteAddress(index)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-header">
          <h4>Métodos de Pagamento</h4>
          <button
            id="create-payment"
            type="button"
            className="add-button"
            onClick={() => {
              setEditingPaymentIndex(null);
              setIsPaymentModalOpen(true);
            }}
          >
            <Plus size={20} />
            Adicionar Método de Pagamento
          </button>
        </div>

        <div className="items-list paymentMethods">
          {customer.paymentMethods?.map((payment, index) => (
            <div key={index} className="list-item">
              <div className="item-info">
                <div className="item-type">
                  {payment.primary && <span className="type-tag yellow">Cartão Principal</span>}
                </div>
                <strong>{payment.cardName}</strong>
                <p>**** **** **** {payment.cardNumber?.slice(-4)}</p>
                <p>Validade: {payment.cardExpiration}</p>
              </div>
              <div className="item-actions">
                <button
                  id="edit-payment"
                  type="button"
                  className="edit-button"
                  onClick={() => handleEditPaymentMethod(index)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  id="delete-payment"
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeletePaymentMethod(index)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button
            id="cancel"
            type="button"
            className="secondary"
            onClick={() => navigate('/clientes')}
          >
            Cancelar
          </button>
          <button type="submit" className="primary">
            Cadastrar
          </button>
        </div>
      </form>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        title={editingAddressIndex !== null ? "Editar Endereço" : "Adicionar Endereço"}
      >
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">CEP</label>
            <input
              id="zip"
              type="text"
              className="form-control"
              value={currentAddress.zipCode}
              onChange={(e) => handleAddressInputChange(e, 'zipCode')}
              required
            />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Logradouro</label>
            <input
              id="street"
              type="text"
              className="form-control"
              value={currentAddress.street}
              onChange={(e) => handleAddressInputChange(e, 'street')}
              required
            />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Número</label>
            <input
              id="number"
              type="text"
              className="form-control"
              value={currentAddress.number}
              onChange={(e) => handleAddressInputChange(e, 'number')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Complemento</label>
            <input
              id="complement"
              type="text"
              className="form-control"
              value={currentAddress.complement}
              onChange={(e) => handleAddressInputChange(e, 'complement')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bairro</label>
            <input
              id="neighborhood"
              type="text"
              className="form-control"
              value={currentAddress.neighborhood}
              onChange={(e) => handleAddressInputChange(e, 'neighborhood')}
              required
            />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Cidade</label>
            <input
              id="city"
              type="text"
              className="form-control"
              value={currentAddress.city}
              onChange={(e) => handleAddressInputChange(e, 'city')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <input
              id="state"
              type="text"
              className="form-control"
              value={currentAddress.state}
              onChange={(e) => handleAddressInputChange(e, 'state')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">País</label>
            <input
              id="country"
              type="text"
              className="form-control"
              value={currentAddress.country}
              onChange={(e) => handleAddressInputChange(e, 'country')}
              required
            />
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Tipo do Endereço</label>
            <div className="type-group">
              <div className="type-option">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={currentAddress.addressType.includes('COBRANCA')}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...currentAddress.addressType, 'COBRANCA']
                        : currentAddress.addressType.filter(t => t !== 'COBRANCA');
                      setCurrentAddress({ ...currentAddress, addressType: newTypes });
                      setError('');
                    }}
                  />
                  <span id="billing" className="slider"></span>
                </label>
                <span>Cobrança</span>
              </div>
              <div className="type-option">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={currentAddress.addressType.includes('ENTREGA')}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...currentAddress.addressType, 'ENTREGA']
                        : currentAddress.addressType.filter(t => t !== 'ENTREGA');
                      setCurrentAddress({ ...currentAddress, addressType: newTypes });
                      setError('');
                    }}
                  />
                  <span id="delivery" className="slider"></span>
                </label>
                <span>Entrega</span>
              </div>
              <div className="type-option">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={currentAddress.addressType.includes('RESIDENCIAL')}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...currentAddress.addressType, 'RESIDENCIAL']
                        : currentAddress.addressType.filter(t => t !== 'RESIDENCIAL');
                      setCurrentAddress({ ...currentAddress, addressType: newTypes });
                      setError('');
                    }}
                  />
                  <span id="residence" className="slider"></span>
                </label>
                <span>Residencial</span>
              </div>
            </div>
          </div>
        </div>

        {currentAddress.addressType.length === 0 && (
          <div className="alert alert-error">
            Selecione pelo menos um tipo de endereço
          </div>
        )}

        <div className="modal-actions">
          <button
            id="cancel-address"
            type="button"
            className="secondary"
            onClick={() => {
              setIsAddressModalOpen(false);
              setError('');
              setCurrentAddress({
                streetType: '',
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                addressType: []
              });
            }}
          >
            Cancelar
          </button>
          <button
            id="add-address"
            type="button"
            className="primary"
            onClick={handleAddAddress}
            disabled={currentAddress.addressType.length === 0}
          >
            {editingAddressIndex !== null ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        title={editingPaymentIndex !== null ? "Editar Método de Pagamento" : "Adicionar Método de Pagamento"}
      >
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Número do Cartão</label>
            <input
              id="cardNumber"
              type="text"
              className="form-control"
              value={currentPaymentMethod.cardNumber}
              onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, cardNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bandeira do Cartão</label>
            <select
              id="cardFlag"
              className="form-control"
              value={currentPaymentMethod.cardFlag}
              onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, cardFlag: e.target.value })}
              required
            >
              <option value="">Selecione</option>
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">MASTERCARD</option>
              <option value="AMERICANEXPRESS">AMERICANEXPRESS</option>
            </select>
          </div>
        </div>

        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Nome no Cartão</label>
            <input
              id="cardName"
              type="text"
              className="form-control"
              value={currentPaymentMethod.cardName}
              onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, cardName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Expiração</label>
            <input
              id="cardExpiration"
              type="text"
              className="form-control"
              value={currentPaymentMethod.cardExpiration}
              onChange={(e) => handlePaymentInputChange(e, 'cardExpiration')}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">CVV</label>
            <input
              id="cvv"
              type="text"
              className="form-control"
              value={currentPaymentMethod.cvv}
              onChange={(e) => setCurrentPaymentMethod({ ...currentPaymentMethod, cvv: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cartão Principal</label>
            <div className="type-group">
              <div className="type-option">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={currentPaymentMethod.primary}
                    onChange={(e) => {
                      if (e.target.checked && customer.paymentMethods?.some(p => p.primary)) {
                        setError('Já existe um cartão principal');
                        return;
                      }
                      setCurrentPaymentMethod({ ...currentPaymentMethod, primary: e.target.checked });
                      setError('');
                    }}
                  />
                  <span id="primary" className="slider"></span>
                </label>
                <span>Definir como Principal</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              id="cancel-payment"
              type="button"
              className="secondary"
              onClick={() => {
                setIsPaymentModalOpen(false);
                setError('');
                setCurrentPaymentMethod({
                  primary: false,
                  cardFlag: '',
                  cardNumber: '',
                  cardName: '',
                  cardExpiration: '',
                  cvv: ''
                });
              }}
            >
              Cancelar
            </button>
            <button
              id="add-payment"
              type="button"
              className="primary"
              onClick={handleAddPaymentMethod}
            >
              {editingPaymentIndex !== null ? "Salvar" : "Adicionar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CriarCliente;