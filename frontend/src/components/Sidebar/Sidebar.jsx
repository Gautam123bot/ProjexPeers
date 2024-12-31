import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import logout_logo from '../../assets/icons/logout.svg'
import hamburger_logo from '../../assets/icons/hamburger.svg'
import routes from './sidebar_routes'
import "./Sidebar.css"

const Sidebar = ({ children, setIsLoggedIn, isLoggedIn}) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false);


    const sidebarToggle = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        localStorage.removeItem("user_spaces");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        navigate("/")
        window.location.reload();
    }

    return (
        <div className='main-con'>
            <motion.div animate={{ width: isOpen ? "18%" : "6%" }} className="sidebar">
                <div>
                    <div className="sidebar_top" onClick={sidebarToggle}>
                        {isOpen && <h1 className='header'>ProjexPeers</h1>}
                        <img src={hamburger_logo} alt="hamburger" />
                    </div>

                    <section className='routes'>
                        {routes.map((route) => {
                            return <NavLink to={route.path} key={route.name}>
                                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.9 }} className='route_con'>
                                    <img src={route.icon} alt={route.name} className="link_icon" />
                                    {isOpen && <p className="link_text">{route.name}</p>}
                                </motion.div>
                            </NavLink>
                        })}
                    </section>
                </div>
                <div className="logout" onClick={handleLogout}>
                    <img src={logout_logo} alt="logout" />
                    {isOpen && <p>Logout</p>}
                </div>

            </motion.div>
            {/* This main will render the individual pages */}
            <main>{children}</main>
        </div>
    )
}

export default Sidebar