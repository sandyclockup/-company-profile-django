import { Component } from "react"
import { NavLink  } from "react-router-dom"

class Unavailable extends Component{

    constructor() {
        super();
        this.state = { 
            siteTitle: process.env.REACT_APP_TITLE
        }
    }

    componentDidMount(){
        document.title = '503 Service Unavailable | ' + process.env.REACT_APP_TITLE
    }

    render(){
        return(
            <>
                 <div className="container py-5">
                    <div className="row h-100 justify-content-center align-items-center mt-5">
                        <div className="col-md-4 text-center">
                            <h1><i className="bi bi-wifi-off font-error"></i></h1>
                            <h1 className="display-1 fw-bold">503</h1>
                            <h2>Service Unavailable</h2>
                            <p className="text-muted">
                                <strong>
                                    The server is temporary busy, try again later!
                                </strong>
                            </p>
                            <p>
                                <NavLink to="/">
                                    Go back
                                </NavLink>
                            </p>
                        </div>
                    </div>
                 </div>
            </>
        )
    }

}

export default Unavailable