import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import CriarCliente from './Cliente/CriarCliente';
import EditarCliente from './Cliente/EditarCliente';
import ListarClientes from './Cliente/ListarClientes';
import CriarItem from './Item/CriarItem';
import VerItem from './Item/VerItem';
import Carrinho from './Compra/Carrinho';
// import EditarItem from './Item/EditarItem';
import ListarItens from './Item/ListarItens';
import Compra from './Compra/Compra';
import VerPedidos from './Compra/VerPedidos';
import CriarTroca from './Compra/CriarTroca';
import CriarDevolucao from './Compra/CriarDevolucao';
import ListarPedidos from './Compra/ListarPedidos';

import { Route, Routes } from 'react-router-dom';

interface User {
  id: number;
  type: 'user' | 'admin';
}

let userType: User['type'] = 'admin';
let userId: User['id'] = 25;

function App() {
  return (
    <>
      <NavBar userType={userType} userId={userId} />
      <div className="container">
        <div className="box-content">
          <Routes>
            {userType == 'admin' && (
              <>
                <Route path="/" element={<ListarPedidos />} />
                <Route path="/clientes" element={<ListarClientes />} />
                <Route path="/clientes/criar" element={<CriarCliente />} />
                <Route path="/cliente/editar/:id" element={<EditarCliente />} />
                <Route path="/itens" element={<ListarItens />} />
                <Route path="/itens/criar" element={<CriarItem />} />
                <Route path="/pedidos" element={<ListarPedidos />} />
              </>
            )}
            {userType == 'user' && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/clientes/criar" element={<CriarCliente />} />
                <Route path="/cliente/editar/:id" element={<EditarCliente />} />
                <Route path="/item/ver/:id" element={<VerItem />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/compra" element={<Compra />} />
                <Route path="/pedido/ver" element={<VerPedidos />} />
                <Route path="/pedido/:id/troca" element={<CriarTroca />} />
                <Route path="/pedido/:id/devolucao" element={<CriarDevolucao />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;