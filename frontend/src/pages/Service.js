import { Component } from "react"
import { ShimmerTitle, ShimmerPostItem, ShimmerCircularImage, ShimmerSectionHeader   } from "react-shimmer-effects"
import { withRouter } from '../helpers/with-router';
import PageService from "../services/page";

class Service extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        document.title = 'Service | ' + process.env.REACT_APP_TITLE
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
        await PageService.service().then((response) => {
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

    getRate(){
        var result = ""
        let max = (Math.floor(Math.random() * 20) + 1)
        for(var i = 1; i <= max; i++){
            result += `<i class="bi bi-star text-warning me-2"></i>`
        }
        return result
    }
  

    render(){
        return (
            <>
                <header className="py-5">
                    <div className="container px-5">
                         <div className="row justify-content-center">
                            { this.state.loading ? <>
                                <div className="col-lg-8 col-xxl-6">
                                    <ShimmerTitle line={5} gap={15} variant="primary" />    
                                </div>
                            </> : <>
                                <div className="col-lg-8 col-xxl-6">
                                    <div className="text-center my-5">
                                        <h1 className="fw-bolder mb-3">{this.state.content.header.title}</h1>
                                        <p className="lead fw-normal text-muted mb-4">{this.state.content.header.description}</p>
                                        <a className="btn btn-primary btn-lg" href="#scroll-target">Read our story</a>
                                    </div>
                                </div>
                            </> }
                         </div>
                    </div>
                </header>
                <section className="py-5 bg-light" id="features">
                    <div className="container px-5 my-5">
                         <div className="row gx-5">
                            <div className="col-lg-4 mb-5 mb-lg-0">
                                <h2 className="fw-bolder mb-0">A better way to start building.</h2>
                            </div>
                            <div className="col-lg-8">
                                { this.state.loading ? <>
                                    <div className="row gx-5 row-cols-1 row-cols-md-2">
                                        <div className="col mb-5 h-100">
                                            <ShimmerTitle line={5} gap={10} variant="primary" />
                                        </div>
                                        <div className="col mb-5 h-100">
                                            <ShimmerTitle line={5} gap={10} variant="primary" />
                                        </div>
                                        <div className="col mb-5 mb-md-0 h-100">
                                            <ShimmerTitle line={5} gap={10} variant="primary" />
                                        </div>
                                        <div className="col h-100">
                                            <ShimmerTitle line={5} gap={10} variant="primary" />
                                        </div>
                                    </div>
                                </> : <>
                                    <div className="row gx-5 row-cols-1 row-cols-md-2">
                                        {this.state.content.services.map((item,index)=>{
                                            return (
                                                <div key={index} className={"col mb-5 h-100"}>
                                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3">
                                                        <i className={item.icon}></i></div>
                                                    <h2 className="h5">{item.title}</h2>
                                                    <p className="mb-0">{item.description}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </> }
                            </div>
                         </div>
                    </div>
                </section>
                <section className="py-5">
                    <div className="container px-5 my-5">
                        <div className="text-center">
                            <h2 className="fw-bolder">Our Customer</h2>
                            <p className="lead fw-normal text-muted mb-5">Dedicated to quality and your success</p>
                        </div>
                        <div className="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-4 justify-content-center">
                            { this.state.loading ? <>
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <ShimmerCircularImage size={150} />
                                        <ShimmerSectionHeader center />
                                    </div>
                                </div>
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <ShimmerCircularImage size={150} />
                                        <ShimmerSectionHeader center />
                                    </div>
                                </div>
                                <div className="col mb-5 mb-5 mb-sm-0">
                                    <div className="text-center">
                                        <ShimmerCircularImage size={150} />
                                        <ShimmerSectionHeader center />
                                    </div>
                                </div>
                                <div className="col mb-5">
                                    <div className="text-center">
                                        <ShimmerCircularImage size={150} />
                                        <ShimmerSectionHeader center />
                                    </div>
                                </div>
                            </> : <>
                                {this.state.content.customers.map((item,index)=>{
                                    return (
                                        <div key={index} className="col mb-5 mb-5 mb-xl-0">
                                            <div className="text-center mb-3">
                                                <img className="img-fluid rounded-circle mb-4 px-4" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/150/150"} alt="..." />
                                                <h5 className="fw-bolder">{item.name}</h5>
                                                <div className="fst-italic text-muted">{item.address}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </> }        
                        </div>            
                    </div>               
                </section>
                <section className="bg-light py-5 py-xl-8">
                    <div className="container">
                        <div className="text-center">
                            <h2 className="fw-bolder">Testimonials</h2>
                            <p className="lead fw-normal text-muted mb-5">
                                We deliver what we promise. See what clients are expressing about us.
                            </p>
                        </div>
                    </div> 
                    <div className="container overflow-hidden">
                        <div className="row gy-4 gy-md-0 gx-xxl-5">
                            { this.state.loading ? <>

                                <div className="col-12 col-md-4">
                                    <ShimmerPostItem card title text cta />
                                </div>

                                <div className="col-12 col-md-4">
                                    <ShimmerPostItem card title text cta />
                                </div>

                                <div className="col-12 col-md-4">
                                    <ShimmerPostItem card title text cta />
                                </div>
                            
                            </> : <>
                                
                                {this.state.content.testimonials.map((item,index)=>{
                                    return (
                                        <div key={index} className="col-12 col-md-4 mb-4">
                                            <div className="card border-0 border-bottom border-primary shadow-sm">
                                                <div className="card-body p-4 p-xxl-5">
                                                    <figure>
                                                        <img className="img-fluid rounded rounded-circle mb-4 border border-5" loading="lazy" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/150/150"} alt=""/>
                                                        <figcaption>
                                                            <div className="mb-3 mt-2"  dangerouslySetInnerHTML={{ __html: this.getRate() }}></div>
                                                            <blockquote className="bsb-blockquote-icon mb-4">{item.quote}</blockquote>
                                                            <h4 className="mb-2">{item.name}</h4>
                                                            <h5 className="fs-6 text-secondary mb-0">{item.position}</h5>
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                            </> }
                        </div>
                    </div>         
                </section>
            </>
        )
    }

}

export default withRouter(Service)