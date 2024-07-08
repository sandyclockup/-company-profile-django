import { Component } from "react"
import { NavLink  } from "react-router-dom"

class Navigation extends Component{

    constructor() {
        super();
        this.state = { 
            active: '',
            siteTitle: '',
            auth: localStorage.getItem("token") !== null
        }
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout(e){
        e.preventDefault()
        localStorage.removeItem("token")
        setTimeout(() => { 
            window.location.href = "/"
        }, 1500)
    }

    componentDidMount(){
        this.setState({
            siteTitle: process.env.REACT_APP_TITLE
        })   
    }

    render(){
        return (
            <>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                    <div className="container px-5">
                        <NavLink className="navbar-brand" to="/">{this.state.siteTitle}</NavLink>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/">Home</NavLink>
                                </li>
                                <li className="nav-item">
                                   <NavLink className="nav-link" to="/about">About</NavLink>
                                </li>
                                <li className="nav-item">
                                   <NavLink className="nav-link" to="/service">Service</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/portfolio">Portfolio</NavLink>
                                </li>
                                <li className="nav-item">
                                   <NavLink className="nav-link" to="/article">Article</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/faq">Faq</NavLink>
                                </li>
                                <li className="nav-item">
                                   <NavLink className="nav-link" to="/contact">Contact</NavLink>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" id="accountDropdown" href="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Account</a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                                        { this.state.auth ? <>
                                            <li>
                                                <NavLink className="dropdown-item" to="/account/password">
                                                    <i className="bi bi-lock me-2"></i> Change Password
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink className="dropdown-item" to="/account/profile">
                                                    <i className="bi bi-person me-2"></i>Manage Profile
                                                </NavLink>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="/#" onClick={(e) => this.handleLogout(e)}>
                                                    <i className="bi bi-power me-2"></i>Log Out
                                                </a>
                                            </li>
                                        </> : <>
                                            <li>
                                                <NavLink className="dropdown-item" to="/auth/login">
                                                    <i className="bi bi-lock me-2"></i> Login
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink className="dropdown-item" to="/auth/register">
                                                    <i className="bi bi-person me-2"></i> Register
                                                </NavLink>
                                            </li>
                                        </> }
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </>
        )
    }

}

export default Navigation