import NavBar from './NavBar/NavBar';
import CriarCliente from './Cliente/CriarCliente';
import ListarClientes from './Cliente/ListarClientes';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
    <NavBar />
    <div className="container">
      <div className="box-content">
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/cliente/criar" element={<CriarCliente />} />
          <Route path="/cliente/listar" element={<ListarClientes />} />
        </Routes>
      </div>
    </div>
    </>
  );
}

export default App;