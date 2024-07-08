import { Component } from "react"
import { NavLink  } from "react-router-dom"
import { ShimmerThumbnail } from "react-shimmer-effects"
import { Tooltip } from 'react-tooltip'
import { withRouter } from '../../helpers/with-router';
import ReactFormInputValidation from "react-form-input-validation";
import AuthService from "../../services/auth";

class ForgotPassword extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            auth: localStorage.getItem("token") !== null,
            fields: {
                email: ""
            },
            success:"",
            message:"",
            errors: {}
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            email: "required|email"
        });
        this.form.onformsubmit = (fields) => {
            this.setState({
                success:"",
                message:"",
                loadingSubmit: true,
                fields: {
                    email: ""
                }
            });
            this.submitForm(fields);
        }
    }

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            await AuthService.emailForgot(fields).then((result) => {
                let data = result.data
                let token = data.data.token
                let success = data.message
                this.setState({
                    loadingSubmit: false,
                    success: success
                })
                setTimeout(() => { 
                    this.props.router.navigate("/auth/email/reset/"+token)
                }, 2500)
            }).catch((error) => {
                let response = error.response
                let data = response.data
                let message = data.message
                this.setState({
                    loadingSubmit: false,
                    message: message
                })
            })
        }
    }

    componentDidMount(){
        if(this.state.auth){
            setTimeout(() => {
                this.props.router.navigate("/")
            }, 3000)
        }else{
            setTimeout(() => {
                document.title = 'Forgot Password | ' + process.env.REACT_APP_TITLE
                this.setState({ loading: false })
            }, 3000)
        }
    }

    render(){
        return (
            <>
                 <div className="container py-5">
                    <div className="row h-100 justify-content-center align-items-center mt-5">
                        { this.state.loading ? <>
                            <div className="col-md-4">
                                <ShimmerThumbnail height={400} rounded />
                            </div>
                        </> : <>
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header text-center bg-primary text-white">
                                        <h4 className="p-2">
                                            <i className="bi bi-lock me-1"></i> Forgot Password
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="text-center mb-2 auth-icon text-primary"><i className="bi bi-person-circle"></i></h1>
                                        <form noValidate onSubmit={this.form.handleSubmit} method="POST" autoComplete="off">
                                            <p className="card-text fw-bold text-muted text-center mb-4">
                                                <small>Please complete the form below.</small>
                                            </p>
                                            
                                            <p className="text-center">
                                                <small>Enter your email address and we'll send you an email that will allow you reset
                                                    password.</small>
                                            </p>

                                            { this.state.message ? <>
                                                <div className="alert alert-danger" role="alert">
                                                    <small>{this.state.message}</small>
                                                </div>
                                            </> : <></> }

                                            { this.state.success ? <>
                                                <div className="alert alert-success" role="alert">
                                                    <small>{this.state.success}</small>
                                                </div>
                                            </> : <></> }

                                            <div className="input-group mb-3">
                                                
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={this.state.errors.email ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Email Address"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.email}
                                                    readOnly={this.state.loadingSubmit}
                                                />

                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className="bi bi-envelope"></i>
                                                </span>
                                                <div className="invalid-feedback">
                                                    {this.state.errors.email ? this.state.errors.email : ""}
                                                </div>
                                            </div>
                                            <button type="submit" disabled={this.state.loadingSubmit} className="btn btn-primary w-100">
                                               <i className={ this.state.loadingSubmit ? 'spinner-border spinner-border-sm me-1' : 'bi bi-send me-1' }></i> Send Link
                                               <Tooltip anchorSelect=".btn-primary" content="Send link reset password now." />
                                            </button>
                                            <div className="mt-3 text-center">
                                                <NavLink to="/auth/login" className={"text-decoration-none login-link"}>
                                                    <i className="bi bi-arrow-left me-1"></i>Remember your password ? <strong>Log In</strong>
                                                </NavLink>
                                                <Tooltip anchorSelect=".login-link" content="Users enter their email and password in the designated fields to access their accounts" />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </> }
                    </div>
                 </div>
            </>
        )
    }

}

export default withRouter(ForgotPassword)