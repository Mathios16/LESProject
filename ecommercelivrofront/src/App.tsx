import NavBar from './NavBar/NavBar';
import Home from './Home/Home';
import CriarCliente from './Cliente/CriarCliente';
import EditarCliente from './Cliente/EditarCliente';
import ListarClientes from './Cliente/ListarClientes';
import CriarItem from './Item/CriarItem';
import VerItem from './Item/VerItem';
import Carrinho from './Carrinho/Carrinho';
// import EditarItem from './Item/EditarItem';
import ListarItens from './Item/ListarItens';
import { Route, Routes} from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar userType="user" />
      <div className="container">
        <div className="box-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clientes" element={<ListarClientes />} />
            <Route path="/clientes/criar" element={<CriarCliente />} />
            <Route path="/cliente/editar/:id" element={<EditarCliente />} />
            <Route path="/itens" element={<ListarItens />} />
            <Route path="/itens/criar" element={<CriarItem />} />
            <Route path="/item/ver/:id" element={<VerItem />} />
            <Route path="/carrinho" element={<Carrinho />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;