import { User } from "@phosphor-icons/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { ReactNode } from 'react';

const CustomLink: React.FC<{ id?: string, to: string, children: ReactNode, className?: string }> = ({ id, to, children, className }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <Link
            id={id}
            to={to}
            className={`${className || ''} ${isActive ? 'active' : ''}`}
        >
            {children}
        </Link>
    )
}

const NavBar: React.FC<{ userType: string, userId?: number }> = ({ userType, userId }) => {
    return (
        <nav className="navbar" id="navbar" data-user-id={userId}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">

                </Link>

                <div className="navbar-nav">
                    {userType === 'admin' && (
                        <>
                            <CustomLink id="manage-orders-button" to={`/pedidos${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Pedidos</CustomLink>
                            <CustomLink id="create-client-button" to={`/clientes/criar${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Criar Cliente</CustomLink>
                            <CustomLink id="list-clients-button" to={`/clientes${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Clientes</CustomLink>
                            <CustomLink id="create-item-button" to={`/itens/criar${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Criar Item</CustomLink>
                            <CustomLink id="list-items-button" to={`/itens${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Itens</CustomLink>
                        </>
                    )}
                    {userType === 'user' && (
                        <>
                            <CustomLink id="home-button" to={`/${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Home</CustomLink>
                            <CustomLink id="cart-button" to={`/carrinho${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Carrinho</CustomLink>
                            <CustomLink id="my-orders-button" to={`/pedidos/ver${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Ver Pedidos</CustomLink>
                        </>
                    )}
                </div>

                <div className="navbar-user">
                    {userType === 'user' && <CustomLink id="user-button" to={userId ? `/clientes/editar/${userId}` : '/clientes/criar'}><User size={32} weight="light" /></CustomLink>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;