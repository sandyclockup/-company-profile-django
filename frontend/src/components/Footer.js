import { Component } from "react"

class Footer extends Component{

    constructor() {
        super();
        this.state = { 
            siteTitle: process.env.REACT_APP_TITLE,
            year: new Date().getFullYear()
        }
    }

    render(){
        return (
            <>
                <footer className="bg-primary py-4 mt-auto footer">
                    <div className="container px-5">
                        <div className="row align-items-center justify-content-between flex-column flex-sm-row">
                            <div className="col-auto"><div className="small m-0 text-white">Copyright &copy; {this.state.siteTitle} {this.state.year}</div></div>
                            <div className="col-auto">
                                <a className="link-light small" href="#!">Privacy</a>
                                <span className="text-white mx-1">&middot;</span>
                                <a className="link-light small" href="#!">Terms</a>
                                <span className="text-white mx-1">&middot;</span>
                                <a className="link-light small" href="#!">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        )
    }

}

export default Footer