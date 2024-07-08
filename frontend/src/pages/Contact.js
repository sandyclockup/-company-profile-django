import { Component } from "react"
import { ShimmerThumbnail , ShimmerTitle  } from "react-shimmer-effects"
import { withRouter } from '../helpers/with-router';
import PageService from "../services/page";
import ReactFormInputValidation from "react-form-input-validation";

class Contact extends Component{

    constructor() {
        super();
        this.state = { 
            loadingSubmit:false,
            loading: true,
            content: {},
            success: false,
            fields: {
                name: "",
                email: "",
                subject: "",
                message: ""
            },
            errors: {}
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            name: "required",
            email: "email|required",
            subject: "required",
            message: "required"
        });
        this.form.onformsubmit = (fields) => {
            this.submitForm(fields);
        }
    }

    componentWillMount(){
        document.title = 'Contact | ' + process.env.REACT_APP_TITLE
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
        await PageService.contact().then((response) => {
            setTimeout(() => { 
                this.setState({
                    content: response.data,
                    loading: false
                })
            }, 1500)
        }).catch((error) => {
            console.log(error)
        })
    }

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            this.setState({ loadingSubmit: true, success: false })
            await PageService.message(fields).then((response) => {
                setTimeout(() => { 
                    this.setState({
                        fields: {
                            name: "",
                            email: "",
                            subject: "",
                            message: ""
                        },
                        loadingSubmit: false,
                        success: true
                    })
                }, 1500)
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    render(){
        return (
            <>
                 <section className="py-5">
                    <div className="container px-5">
                        
                        { this.state.loading ? <>
                            
                            <ShimmerThumbnail height={768} className="py-5 px-4 px-md-5 mb-5" rounded />

                        </> : <>
                        
                            <div className="bg-light rounded-3 py-5 px-4 px-md-5 mb-5">
                                <div className="text-center mb-5">
                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className="bi bi-envelope"></i></div>
                                    <h1 className="fw-bolder">Get in touch</h1>
                                    <p className="lead fw-normal text-muted mb-0">We'd love to hear from you</p>
                                </div>
                                <div className="row gx-5 justify-content-center">
                                    <div className="col-lg-8 col-xl-6">

                                            { this.state.success ? <>
                                            
                                                <div className="alert alert-success" role="alert">
                                                    Your message has been sent. Thank you!
                                                </div>
                                            
                                            </> : <></> }
                                    
                                            <form id="contactForm" noValidate autoComplete="off" onSubmit={this.form.handleSubmit} data-sb-form-api-token="API_TOKEN">
                                                
                                                <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            className={this.state.errors.name ? "form-control is-invalid" : "form-control"}
                                                            onBlur={this.form.handleBlurEvent}
                                                            onChange={this.form.handleChangeEvent}
                                                            value={this.state.fields.name}
                                                            placeholder="Enter your name"
                                                        />
                                                    <label htmlFor="name">Full name</label>
                                                    <div className="invalid-feedback">
                                                        {this.state.errors.name ? this.state.errors.name : ""}
                                                    </div>
                                                </div>

                                                <div className="form-floating mb-3">
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            className={this.state.errors.email ? "form-control is-invalid" : "form-control"}
                                                            onBlur={this.form.handleBlurEvent}
                                                            onChange={this.form.handleChangeEvent}
                                                            value={this.state.fields.email}
                                                            placeholder="name@example.com"
                                                        />
                                                    <label htmlFor="email">Email address</label>
                                                    <div className="invalid-feedback">
                                                        {this.state.errors.email ? this.state.errors.email : ""}
                                                    </div>
                                                </div>
                                            
                                                <div className="form-floating mb-3">
                                                        <input
                                                            type="text"
                                                            name="subject"
                                                            className={this.state.errors.subject ? "form-control is-invalid" : "form-control"}
                                                            onBlur={this.form.handleBlurEvent}
                                                            onChange={this.form.handleChangeEvent}
                                                            value={this.state.fields.subject}
                                                            placeholder="Enter your subject"
                                                        />
                                                    <label htmlFor="subject">Subject</label>
                                                    <div className="invalid-feedback">
                                                        {this.state.errors.subject ? this.state.errors.subject : ""}
                                                    </div>
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <textarea 
                                                        name="message"
                                                        className={this.state.errors.message ? "form-control is-invalid" : "form-control"}
                                                        onBlur={this.form.handleBlurEvent}
                                                        onChange={this.form.handleChangeEvent}
                                                        value={this.state.fields.message}
                                                        placeholder="Enter your message"
                                                        style={{height: '10em'}}
                                                    >
                                                    </textarea>
                                                    <label htmlFor="message">Message</label>
                                                    <div className="invalid-feedback">
                                                        {this.state.errors.message ? this.state.errors.message : ""}
                                                    </div>
                                                </div>
                                                
                                                <div className="d-none" id="submitSuccessMessage">
                                                    <div className="text-center mb-3">
                                                        <div className="fw-bolder">Form submission successful!</div>
                                                        To activate this form, sign up at
                                                        <br />
                                                        <a href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                                                    </div>
                                                </div>
                                                
                                                <div className="d-none" id="submitErrorMessage"><div className="text-center text-danger mb-3">Error sending message!</div></div>
                                            
                                                <div className="d-grid">
                                                    <button disabled={this.state.loadingSubmit} className="btn btn-primary btn-lg" id="submitButton" type="submit">
                                                        <i className={ this.state.loadingSubmit ? 'spinner-border spinner-border-sm me-1' : 'bi bi-envelope me-1' }></i>Send Message
                                                    </button>
                                                </div>
                                            </form>

                                    </div>
                                </div>
                            </div>
                        
                        </> }
                        
                        <div className="row gx-5 row-cols-2 row-cols-lg-4 py-5">
                            { this.state.loading ? <>
                                <div className="col">
                                    <ShimmerTitle line={5} gap={10} variant="primary" />
                                </div>
                                <div className="col">
                                    <ShimmerTitle line={5} gap={10} variant="primary" />
                                </div>
                                <div className="col">
                                    <ShimmerTitle line={5} gap={10} variant="primary" />
                                </div>
                                <div className="col">
                                    <ShimmerTitle line={5} gap={10} variant="primary" />
                                </div>
                            </> : <>
                                <div className="col">
                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className="bi bi-chat-dots"></i></div>
                                    <div className="h5 mb-2">Chat with us</div>
                                    <p className="text-muted mb-0">Chat live with one of our support specialists.</p>
                                </div>
                                <div className="col">
                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className="bi bi-people"></i></div>
                                    <div className="h5">Ask the community</div>
                                    <p className="text-muted mb-0">Explore our community forums and communicate with other users.</p>
                                </div>
                                <div className="col">
                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className="bi bi-question-circle"></i></div>
                                    <div className="h5">Support center</div>
                                    <p className="text-muted mb-0">Browse FAQ's and support articles to find solutions.</p>
                                </div>
                                <div className="col">
                                    <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3"><i className="bi bi-telephone"></i></div>
                                    <div className="h5">Call us</div>
                                    <p className="text-muted mb-0">Call us during normal business hours at (555) 892-9403.</p>
                                </div>
                            </> }
                        </div>
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(Contact)