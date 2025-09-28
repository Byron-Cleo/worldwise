import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import styles from "./PageNav.module.css";


function PageNav() {
    return (
        <nav className={styles.nav}>
            <Logo />
            
            <ul>
                <li>
                    <NavLink to="/" activeClassName="active" exact>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/pricing" activeClassName="active" exact>Pricing</NavLink>
                </li>
                <li>
                    <NavLink to="/product" activeClassName="active" exact>Product</NavLink>
                </li>
            </ul>
            
        </nav>
    )
}

export default PageNav
