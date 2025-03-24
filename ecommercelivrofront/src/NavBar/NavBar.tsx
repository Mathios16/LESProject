import { User } from "@phosphor-icons/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { ReactNode } from 'react';

const CustomLink: React.FC<{to: string, children: ReactNode, className?: string}> = ({to, children, className}) => {
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

const NavBar: React.FC<{userType: string, userId?: number}> = ({userType, userId}) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    
                </Link>
                
                <div className="navbar-nav">
                    {userType === 'admin' && (
                        <>
                            <CustomLink to="/clientes/criar">Criar Cliente</CustomLink>
                            <CustomLink to="/clientes">Listar Clientes</CustomLink>
                            <CustomLink to="/itens/criar">Criar Item</CustomLink>
                            <CustomLink to="/itens">Listar Itens</CustomLink>
                        </>
                    )}
                    {userType === 'user' && (
                        <>
                            <CustomLink to="/">Home</CustomLink>
                            <CustomLink to="/carrinho">Carrinho</CustomLink>
                        </>
                    )}
                </div>

                <div className="navbar-user">
                    {userType === 'user' && <CustomLink to={ userId ? `/clientes/editar/${userId}` : '/clientes/criar'}><User size={32} weight="light" /></CustomLink>}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;