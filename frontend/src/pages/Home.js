import { Component, Fragment } from "react"
import { ShimmerThumbnail, ShimmerTitle, ShimmerPostItem  } from "react-shimmer-effects"
import PageService from "../services/page";
import { withRouter } from '../helpers/with-router';
import { Carousel } from "react-responsive-carousel";
import moment from 'moment'
import { NavLink } from "react-router-dom";
import ReactFormInputValidation from "react-form-input-validation";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class Home extends Component{

    constructor() {
        super();
        this.state = { 
            loadingSubscribe: false,
            loading: true,
            content: {},
            fields: {
                email: ""
            },
            errors: {},
            message: ""
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            email: "email|required"
        });
        this.form.onformsubmit = (fields) => {
            this.submitForm(fields);
        }
    }

    componentWillMount(){
        document.title = 'Home | ' + process.env.REACT_APP_TITLE
        this.pingConnection()
    }

    async loadContent(){
        await PageService.home().then((response) => {
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

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            this.setState({
                loadingSubscribe: true,
                message: ""
            })
            await PageService.subscribe(fields).then(() => {
                setTimeout(() => { 
                    this.setState({
                        loadingSubscribe: false,
                        fields: {
                            email: "",
                        },
                        message:"Thank for subscribing to our newsletter."
                    })
                }, 1500)
            }).catch((error) => {
                this.setState({
                    loadingSubscribe: false,
                    fields: {
                        email: "",
                    },
                    message:""
                })
                let resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage)
            })
        }
    }

    serviceClassName(index){
        if(parseInt(index) === 2){
            return "col mb-5 mb-md-0 h-100"
        }else if(parseInt(index) === 3){
            return "col h-100"
        }else{
            return "col mb-5 h-100"
        }
    }

    getPeopleImage(gender){
       if(gender){
            return gender === 'M' ? "/male.png" : "/female.png"
       }else{
            let arrs = ["male.png", "female.png"]
            let random = Math.floor(Math.random() * arrs.length)
            let result = arrs[random]
            return "/"+result
       }
    }

    render(){
        return (
            <>
                <header className="bg-dark py-5">
                    <div className="container px-5">
                        <div className="row gx-5 align-items-center justify-content-center">
                            <div className="col-lg-8 col-xl-7 col-xxl-6">
                                { this.state.loading ? <>
                                    <ShimmerTitle line={5} gap={10} variant="primary" />
                                </> : <>
                                    <div className="my-5 text-center text-xl-start">
                                        <h1 className="display-5 fw-bolder text-white mb-2">{this.state.content.header.title}</h1>
                                        <p className="lead fw-normal text-white-50 mb-4">{this.state.content.header.description}</p>
                                        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xl-start">
                                            <a className="btn btn-primary btn-lg px-4 me-sm-3" href="#features">Get Started</a>
                                            <a className="btn btn-outline-light btn-lg px-4" href="#!">Learn More</a>
                                        </div>
                                    </div>
                                </> }
                            </div>
                            <div className="col-xl-5 col-xxl-6 d-none d-xl-block text-center">
                               { this.state.loading ? <>
                                   <ShimmerThumbnail height={400} rounded />
                               </> : <>
                                    
                                    <Carousel autoPlay>

                                   
                                    {this.state.content.sliders.map((item,index)=>{
                                        return (
                                            <div key={index}>
                                                <img alt={item.title} className="img-fluid rounded-3 mb-2" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/5000/3333"} />
                                                <p className="legend">
                                                    {item.description}
                                                </p>
                                            </div>
                                        )
                                    })}

                                    </Carousel>

                               </> }
                            </div>
                        </div>
                    </div>
                </header>

                <section className="py-5" id="features">
                    <div className="container px-5 my-5">
                        <div className="row gx-5">
                            <div className="col-lg-4 mb-5 mb-lg-0"><h2 className="fw-bolder mb-0">A better way to start building.</h2></div>
                            <div className="col-lg-8">
                                <div className="row gx-5 row-cols-1 row-cols-md-2">
                                    { this.state.loading ? <>
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
                                    </> : <>
                                    {this.state.content.services.map((item, index)=>{
                                            return (
                                                <div key={index} className={this.serviceClassName(index)}>
                                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className={item.icon}></i></div>
                                                    <h2 className="h5">{item.title}</h2>
                                                    <p className="mb-0">{item.description}</p>
                                                </div>
                                            )
                                        })}
                                    </> }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
              
                <div className="py-5 bg-light">
                    <div className="container px-5 my-5">
                        <div className="row gx-5 justify-content-center">
                            <div className="col-lg-10 col-xl-7">
                                <div className="text-center">
                                    { this.state.loading ? <>
                                        <ShimmerTitle line={5} gap={10} variant="primary" />    
                                    </> : <>
                                        <div className="fs-4 mb-4 fst-italic">{this.state.content.testimonial.quote}</div>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <img className="rounded-circle me-3" width="70" src={this.getPeopleImage()} alt="..." />
                                                <div className="fw-bold">
                                                    {this.state.content.testimonial.name}
                                                    <span className="fw-bold text-primary mx-1">/</span>
                                                    {this.state.content.testimonial.position},  {this.state.content.testimonial.customer_name}
                                                </div>
                                            </div>
                                    </> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              
                <section className="py-5">
                    <div className="container px-5 my-5">
                        <div className="row gx-5 justify-content-center">
                            <div className="col-lg-8 col-xl-6">
                                <div className="text-center">
                                    <h2 className="fw-bolder">From our blog</h2>
                                    <p className="lead fw-normal text-muted mb-5">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque fugit ratione dicta mollitia. Officiis ad.</p>
                                </div>
                            </div>
                        </div>
                        <div className="row gx-5">
                            { this.state.loading ? <>
                                <div className="col-lg-4 mb-5">
                                    <ShimmerPostItem card title text cta />
                                </div>
                                <div className="col-lg-4 mb-5">
                                    <ShimmerPostItem card title text cta />
                                </div>
                                <div className="col-lg-4 mb-5">
                                    <ShimmerPostItem card title text cta />
                                </div>
                            </> : <>
                                {this.state.content.articles.map((item, index)=>{
                                    return (
                                        <div key={index} className="col-lg-4 mb-5">
                                            <div className="card h-100 shadow border-0">
                                                <img className="card-img-top" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/350"} alt="..." />
                                                <div className="card-body p-4">
                                                    
                                                    {item.categories.split(",").map((category, index)=>{
                                                        return (
                                                            <div key={index} className="badge bg-primary bg-gradient rounded-pill mb-2 me-1">{category}</div>
                                                        )
                                                    })}
                                                    <NavLink className="text-decoration-none link-dark stretched-link" to={"/article/"+item.slug}>
                                                        <h5 className="card-title mb-3">{item.title}</h5>
                                                    </NavLink>
                                                    <p className="card-text mb-0">{item.description}</p>
                                                </div>
                                                <div className="card-footer p-4 pt-0 bg-transparent border-top-0">
                                                    <div className="d-flex align-items-end justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <img className="rounded-circle me-3"  width="50" src={this.getPeopleImage(item.gender)} alt="..." />
                                                            <div className="small">
                                                                <div className="fw-bold">{item.first_name} {item.last_name}</div>
                                                                <div className="text-muted">{ moment(item.updated_at).fromNow() }</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </> }
                        </div>
                      
                        { this.state.loading ? <>
                            <ShimmerTitle line={2} gap={10} variant="primary" />    
                        </> : <>
                        
                            <aside className="bg-primary bg-gradient rounded-3 p-4 p-sm-5 mt-5">
                                <div className="d-flex align-items-center justify-content-between flex-column flex-xl-row text-center text-xl-start">
                                    <div className="mb-4 mb-xl-0">
                                        <div className="fs-3 fw-bold text-white">New products, delivered to you.</div>
                                        <div className="text-white-50">Sign up for our newsletter for the latest updates.</div>
                                    </div>
                                    <form noValidate autoComplete="off" onSubmit={this.form.handleSubmit}>
                                        <div className="ms-xl-4">
                                            <div className="input-group mb-2">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={this.state.errors.email ? "form-control is-invalid" : "form-control"}
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.email}
                                                    placeholder="Email address..."
                                                    readOnly={this.loadingSubscribe}
                                                />
                                                <button disabled={this.state.loadingSubscribe} className="btn btn-outline-light" id="button-newsletter" type="submit">
                                                    <i className={this.state.loadingSubscribe ? 'spinner-border spinner-border-sm me-1' : ''}></i>Sign up
                                                </button>
                                                <span className="error invalid-feedback">
                                                    {this.state.errors.email ? this.state.errors.email : ""}
                                                </span>
                                            </div>
                                            <div className="small text-white-50">We care about privacy, and will never share your data.</div>
                                            { this.state.message ? <>
                                                <div className="alert alert-success small mt-2">
                                                    {this.state.message}
                                                </div>
                                            </> : <></> }
                                        </div>
                                    </form>
                                </div>
                            </aside>
                        
                        </> }

                    </div>
                </section>

            </>
        )
    }

}

export default withRouter(Home)