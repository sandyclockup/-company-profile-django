import { withRouter } from '../../helpers/with-router';
import { Component } from "react"
import { ShimmerThumbnail, ShimmerText    } from "react-shimmer-effects"
import PortfolioService from "../../services/portfolio";
import PageService from "../../services/page"
import { NavLink  } from "react-router-dom"

class Detail extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        document.title = 'Portfolio Details| ' + process.env.REACT_APP_TITLE
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
        let id = this.props.router.params.id
        await PortfolioService.detail(id).then((response) => {
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
                        <div className="row gx-5 justify-content-center">
                            <div className="col-lg-6">
                                <div className="text-center mb-5">
                                   { this.state.loading ? <>
                                        <ShimmerText line={5} gap={10} />
                                   </> : <>
                                        <h1 className="fw-bolder">{this.state.content.portfolio.title}</h1>
                                        <p className="lead fw-normal text-muted mb-0">{this.state.content.portfolio.description}</p>
                                   </> }
                                </div>
                            </div>
                        </div>
                        <div className="row gx-5">
                            { this.state.loading ? <>
                                <div className="col-12">
                                     <ShimmerThumbnail height={700} className="py-5 px-4 px-md-5 mb-5" rounded />
                                </div>
                                <div className="col-lg-6">
                                     <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                </div>
                                <div className="col-lg-6">
                                     <ShimmerThumbnail height={400} className="py-5 px-4 px-md-5 mb-5" rounded />
                                </div>
                            </> : <>
                                <div className="col-12">
                                    <img className="img-fluid rounded-3 mb-5" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/1300/700"} alt="..." />
                                </div>
                                <div className="col-lg-6">
                                    <img className="img-fluid rounded-3 mb-5" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/400"} alt="..." />
                                </div>
                                <div className="col-lg-6">
                                    <img className="img-fluid rounded-3 mb-5" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/400"} alt="..." />
                                </div>
                            </> }
                        </div>
                        <div className="row gx-5 justify-content-center">
                            <div className="col-lg-6">
                                <div className="text-center mb-5">
                                   { this.state.loading ? <>
                                        <ShimmerText line={10} gap={10} />
                                   </> : <>
                                        <p className="lead fw-normal text-muted">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam deserunt architecto enim eos accusantium fugit recusandae illo iste dignissimos possimus facere ducimus odit voluptatibus exercitationem, ex laudantium illum voluptatum corporis.</p>
                                        <NavLink className="text-decoration-none" to={"/portfolio"}>
                                            View project
                                            <i className="bi-arrow-right"></i>
                                        </NavLink>
                                   </> }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(Detail)