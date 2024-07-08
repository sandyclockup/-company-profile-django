import { Component } from "react"
import { NavLink  } from "react-router-dom"

class Error extends Component{

    constructor() {
        super();
        this.state = { 
            siteTitle: process.env.REACT_APP_TITLE
        }
    }

    componentDidMount(){
        document.title = '404 Not Found | ' + process.env.REACT_APP_TITLE
    }

    render(){
        return(
            <>
                 <div className="container py-5">
                    <div className="row h-100 justify-content-center align-items-center mt-5">
                        <div className="col-md-4 text-center">
                            <h1><i className="bi bi-emoji-frown font-error"></i></h1>
                            <h1 className="display-1 fw-bold">404</h1>
                            <h2>Page Not Found</h2>
                            <p className="text-muted">
                                <strong>
                                    The Page you are looking for doesn't exists or an other error occured. 
                                    Go back, or head over to 
                                    <NavLink to="/" className={"ms-1 me-1"}>
                                        {this.state.siteTitle}
                                    </NavLink>
                                    to choose a new direction.
                                </strong>
                            </p>
                        </div>
                    </div>
                 </div>
            </>
        )
    }

}

export default Error