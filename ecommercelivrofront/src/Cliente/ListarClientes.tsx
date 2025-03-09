import "../../public/cliente.css"
import { Circle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

function ListarClientes() {
    return (
    <>
    <div className="title">
        <h1>Clientes</h1>
        <div>
            <Link to="/cliente/criar" className="button">Criar Cliente</Link>
        </div>
    </div>
    <div className="table">
        <div className="table-head" style={{ minWidth: '1400px', maxWidth: '100%' }}>
            <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>nome</div>
            <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>razão social</div>
            <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>telefone</div>
            <div className="column" style={{ minWidth: '200px', paddingRight: '1rem' }}></div>
        </div>
        {getClientes().map((cliente, key) => (
            <div key={key} className={`table-content ${(key + 1) % 2 === 0 ? 'table-content-color' : ''}`} style={{ minWidth: '1400px', maxWidth: '100%' }}>
                <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>
                    <Circle weight="fill" className={`${cliente.isinactive === false ? 'active' : 'invalid'}`}></Circle>
                    <div>
                    <strong>
                        {cliente.nome}
                    </strong>
                    <br />
                    <small>
                        {cliente.documento}
                    </small>
                    </div>
                </div>
                <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>
                    {cliente.razao_social}
                </div>
                <div className="column" style={{ minWidth: '400px', paddingRight: '1rem' }}>
                    {cliente.telefone}
                </div>
                <div className="column" style={{ minWidth: '200px', paddingRight: '1rem' }}>
                    <Link to={`/cliente/${cliente.id}/ver`}>ver</Link>
                    <Link to={`/cliente/${cliente.id}/editar`}>editar</Link>
                </div>
            </div>
        ))}
        </div>
    </>
    );
}

function getClientes() {

    return [
        {
            "id": 1,
            "nome": "João",
            "documento": "123.456.789-00",
            "razao_social": "João LTDA",
            "telefone": "11 99999-9999",
            "isinactive": false
        },
        {
            "id": 2,
            "nome": "Maria",
            "documento": "123.456.789-00",
            "razao_social": "Maria LTDA",
            "telefone": "11 99999-9999",
            "isinactive": false
        }
    ];
}

export default ListarClientes;