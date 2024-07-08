import { Component } from "react"
import { ShimmerPostItem  } from "react-shimmer-effects"
import { withRouter } from '../helpers/with-router';
import PageService from "../services/page";

class Faq extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        document.title = 'FAQ | ' + process.env.REACT_APP_TITLE
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
        await PageService.faq().then((response) => {
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
                            <h1 className="fw-bolder">Frequently Asked Questions</h1>
                            <p className="lead fw-normal text-muted mb-0">How can we help you?</p>
                        </div>
                        <div className="row gx-5">
                            <div className="col-xl-8">
                            
                                { this.state.loading ? <>

                                    <ShimmerPostItem card title text cta />
                                    <ShimmerPostItem card title text cta />
                                    <ShimmerPostItem card title text cta />
                                    
                                </> : <>
                                
                                    <h2 className="fw-bolder mb-3">Account &amp; Billing</h2>
                                    <div className="accordion mb-5" id="accordionExample">
                                        {this.state.content.faq1.map((item,index)=>{
                                            return (
                                                <div key={index} className="accordion-item">
                                                    <h3 className="accordion-header" id={"heading"+item.id}><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+item.id} aria-expanded="true" aria-controls={"collapse"+item.id}>{item.question}</button></h3>
                                                    <div className={index === 0 ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'} id={"collapse"+item.id} aria-labelledby={"heading"+item.id} data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">
                                                           {item.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                
                                    <h2 className="fw-bolder mb-3">Website Issues</h2>
                                    <div className="accordion mb-5 mb-xl-0" id="accordionExample2">
                                        {this.state.content.faq2.map((item,index)=>{
                                            return (
                                                <div key={index} className="accordion-item">
                                                    <h3 className="accordion-header" id={"heading"+item.id}><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+item.id} aria-expanded="true" aria-controls={"collapse"+item.id}>{item.question}</button></h3>
                                                    <div className={index === 0 ? 'accordion-collapse collapse show' : 'accordion-collapse collapse'} id={"collapse"+item.id} aria-labelledby={"heading"+item.id} data-bs-parent="#accordionExample2">
                                                        <div className="accordion-body">
                                                           {item.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                
                                </> }



                            </div>
                            <div className="col-xl-4">
                                { this.state.loading ? <>
                                    <ShimmerPostItem card title text cta />
                                </> : <>
                                    <div className="card border-0 bg-light mt-xl-5">
                                        <div className="card-body p-4 py-lg-5">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <div className="text-center">
                                                    <div className="h6 fw-bolder">Have more questions?</div>
                                                    <p className="text-muted mb-4">
                                                        Contact us at
                                                        <br />
                                                        <a href="#!">support@domain.com</a>
                                                    </p>
                                                    <div className="h6 fw-bolder">Follow us</div>
                                                    <a className="fs-5 px-2 link-dark" href="#!"><i className="bi-twitter"></i></a>
                                                    <a className="fs-5 px-2 link-dark" href="#!"><i className="bi-facebook"></i></a>
                                                    <a className="fs-5 px-2 link-dark" href="#!"><i className="bi-linkedin"></i></a>
                                                    <a className="fs-5 px-2 link-dark" href="#!"><i className="bi-youtube"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </> }
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(Faq)