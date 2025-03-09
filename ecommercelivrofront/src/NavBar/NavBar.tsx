import { User } from "@phosphor-icons/react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

function NavBar() {
    return (
        <>
        <nav>
            <div className="logo">
                <h1>Logo</h1>
            </div>
            <div className="header-menu">
                <ul>
                    <CustomLink to="/" className="click-header-menu">Home</CustomLink>
                    <CustomLink to="/cliente/criar" className="click-header-menu">Criar Cliente</CustomLink>
                    <CustomLink to="/cliente/listar" className="click-header-menu">Listar Cliente</CustomLink>
                </ul>
            </div>  
            <div className="user-infos">
                <div className="avatar">
                    <User size={32} />
                </div>
            </div> 
        </nav>
        </>
      );
}

import { ReactNode } from 'react';

function CustomLink({to, children, className}: {to: string, children: ReactNode, className?: string}) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} className={className}>{children}</Link>
        </li>
    )
}
export default NavBar;