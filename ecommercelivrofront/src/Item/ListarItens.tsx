import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUrlParams from '../Auxiliares/UrlParams';
import { PencilSimple, Trash } from '@phosphor-icons/react';

interface Item {
  id: number;
  title: string;
  code: string;
  edition: string;
  date: string;
}

const ListarItens: React.FC = () => {
  const navigate = useNavigate();
  const { type, id } = useUrlParams();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);

  return (
    <div className="item-container">
      <div className="header">
        <h1>Lista de Itens</h1>
        <div className="actions">
          <button className="primary" onClick={() => {
            navigate(`/item/criar${type || id ? `?type=${type}&id=${id}` : ''}`);
          }}>
            Novo Item
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form">
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              id="searchName"
              type="text"
              className="form-control"
              placeholder="Buscar por título"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Código</label>
            <input
              id="searchCode"
              type="text"
              className="form-control"
              placeholder="Buscar por código"
            />
          </div>
        </div>
        <div className="row-group">
          <div className="form-group">
            <label className="form-label">Edição</label>
            <input
              id="searchEdition"
              type="text"
              className="form-control"
              placeholder="Buscar por edição"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data</label>
            <input
              id="searchDate"
              type="text"
              className="form-control"
              placeholder="Buscar por data"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Código</th>
              <th>Edição</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.code}</td>
                <td>{item.edition}</td>
                <td>{item.date}</td>
                <td>
                  <div className="actions">
                    <button
                      className="edit"
                      onClick={() => {
                        navigate(`/item/editar/${item.id}${type || id ? `?type=${type}&id=${id}` : ''}`);
                      }}
                    >
                      <PencilSimple size={20} />
                    </button>
                    <button
                      className="delete"
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
    </div>
  );
};

export default ListarItens;