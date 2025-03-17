import NavBar from './NavBar/NavBar';
import CriarCliente from './Cliente/CriarCliente';
import EditarCliente from './Cliente/EditarCliente';
import ListarClientes from './Cliente/ListarClientes';
import { Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="box-content">
          <Routes>
            <Route path="/" element={<Navigate to="/clientes" replace />} />
            <Route path="/clientes" element={<ListarClientes />} />
            <Route path="/clientes/criar" element={<CriarCliente />} />
            <Route path="/cliente/editar/:id" element={<EditarCliente />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;