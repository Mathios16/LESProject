import { User } from "@phosphor-icons/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { ReactNode } from 'react';

const CustomLink: React.FC<{ to: string, children: ReactNode, className?: string }> = ({ to, children, className }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <Link
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
                            <CustomLink to={`/pedidos${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Pedidos</CustomLink>
                            <CustomLink to={`/clientes/criar${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Criar Cliente</CustomLink>
                            <CustomLink to={`/clientes${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Clientes</CustomLink>
                            <CustomLink to={`/itens/criar${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Criar Item</CustomLink>
                            <CustomLink to={`/itens${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Listar Itens</CustomLink>
                        </>
                    )}
                    {userType === 'user' && (
                        <>
                            <CustomLink to={`/${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Home</CustomLink>
                            <CustomLink to={`/carrinho${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Carrinho</CustomLink>
                            <CustomLink to={`/pedidos/ver${userType || userId ? `?type=${userType}&id=${userId}` : ''}`}>Ver Pedidos</CustomLink>
                        </>
                    )}
                </div>

                <div className="navbar-user">
                    {userType === 'user' && <CustomLink to={userId ? `/clientes/editar/${userId}` : '/clientes/criar'}><User size={32} weight="light" /></CustomLink>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;