import { User } from "@phosphor-icons/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { ReactNode } from 'react';

function CustomLink({to, children, className}: {to: string, children: ReactNode, className?: string}) {
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

function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    
                </Link>
                
                <div className="navbar-nav">
                    <CustomLink to="/">Home</CustomLink>
                    <CustomLink to="/clientes/criar">Criar Cliente</CustomLink>
                    <CustomLink to="/clientes">Listar Clientes</CustomLink>
                </div>

                <div className="navbar-user">
                    <User size={32} weight="light" />
                </div>
            </div>
        </nav>
    );
}

export default NavBar;