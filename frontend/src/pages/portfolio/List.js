import { withRouter } from '../../helpers/with-router';
import { Component } from "react"
import { ShimmerThumbnail, ShimmerText    } from "react-shimmer-effects"
import { NavLink  } from "react-router-dom"
import PortfolioService from "../../services/portfolio";
import PageService from "../../services/page"

class List extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        document.title = 'Portfolio | ' + process.env.REACT_APP_TITLE
        this.pingConnection()
    }

    async pingConnection(){
        await PageService.ping().then(() => {
            setTimeout(() => { 
                this.loadContent()
            }, 1500)
        }).catch((error) => {
            console.log(error)
            this.props.router.navigate("/unavailable")
        })
    }

    async loadContent(){
        await PortfolioService.list().then((response) => {
            setTimeout(() => { 
                this.setState({
                    content: response.data.data,
                    loading: false
                })
            }, 1500)
        }).catch((error) => {
            console.log(error)
        })
    }

    render(){
        return (
            <>
                <section className="py-5">
                    <div className="container px-5 my-5">
                        <div className="text-center mb-5">
                            <h1 className="fw-bolder">Our Work</h1>
                            <p className="lead fw-normal text-muted mb-0">Company portfolio</p>
                        </div>
                        <div className="row gx-5">
                            { this.state.loading ? <>

                                 <div className="col-lg-6">
                                    <div className="position-relative mb-5">
                                        <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                        <ShimmerText line={5} gap={10} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="position-relative mb-5">
                                        <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                        <ShimmerText line={5} gap={10} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="position-relative mb-5 mb-lg-0">
                                        <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                        <ShimmerText line={5} gap={10} />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="position-relative">
                                        <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                        <ShimmerText line={5} gap={10} />
                                    </div>
                                </div>

                            
                            </> : <>

                                {this.state.content.portfolios.map((item,index)=>{
                                    return (
                                        <div key={index} className="col-lg-6">
                                            <div className="position-relative mb-5">
                                                <img className="img-fluid rounded-3 mb-3" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/400"} alt="..." />
                                                <NavLink className="h3 fw-bolder text-decoration-none link-dark stretched-link" to={"/portfolio/"+item.id}>{item.title}</NavLink>
                                            </div>
                                        </div>
                                    )
                                })}
                                
                                
                                

                            </> }
                        </div>
                    </div>
                </section>
                <section className="py-5 bg-light">
                    <div className="container px-5 my-5">
                        <h2 className="display-4 fw-bolder mb-4">Let's build something together</h2>
                        <a className="btn btn-lg btn-primary" href="#!">Contact us</a>
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(List)