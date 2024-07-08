import { Component } from "react"
import { NavLink  } from "react-router-dom"
import { ShimmerThumbnail } from "react-shimmer-effects"
import { Tooltip } from 'react-tooltip'
import { withRouter } from '../../helpers/with-router';
import ReactFormInputValidation from "react-form-input-validation";
import AuthService from "../../services/auth";

class Login extends Component{

    constructor() {
        super();
        this.state = { 
            loadingSubmit: false,
            loading: true,
            auth: localStorage.getItem("token") !== null,
            fields: {
                username: "",
                password: "",
                remember_me: ""
            },
            message:"",
            errors: {}
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            username: "required",
            password: "required",
            remember: "string"
        });
        this.form.onformsubmit = (fields) => {
            this.setState({
                message: "",
                loadingSubmit: true
            });
            this.submitForm(fields);
        }
    }

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            await AuthService.login(fields).then((result) => {
                let data = result.data
                let token = data.token
                setTimeout(() => {
                    this.setState({
                        loadingSubmit: false,
                        message: ""
                    })
                    localStorage.setItem("token", token)
                    window.location.href = "/"
                }, 2000)
            }).catch((error) => {
                let message = error.response.data.non_field_errors[0]
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
                document.title = 'Sign In | ' + process.env.REACT_APP_TITLE
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
                                            <i className="bi bi-lock me-1"></i> Sign In
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="text-center mb-2 auth-icon text-primary"><i className="bi bi-person-circle"></i></h1>

                                        <form noValidate onSubmit={this.form.handleSubmit} method="POST" autoComplete="off">
                                            <p className="card-text fw-bold text-muted text-center mb-4">
                                                <small>Please complete the form below.</small>
                                            </p>

                                            { this.state.message ? <>
                                                <div className="alert alert-danger" role="alert">
                                                    <small>{this.state.message}</small>
                                                </div>
                                            </> : <></> }

                                            <div className="input-group mb-3">
                                                
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className={this.state.errors.username ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Your Username"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.username}
                                                    readOnly={this.state.loadingSubmit}
                                                />

                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className="bi bi-person"></i>
                                                </span>
                                                <div className="invalid-feedback">
                                                    {this.state.errors.username ? this.state.errors.username : ""}
                                                </div>
                                            </div>
                                            <div className="input-group mb-3">
                                                
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className={this.state.errors.password ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Your Password"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.password}
                                                    readOnly={this.state.loadingSubmit}
                                                />

                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className="bi bi-key"></i>
                                                </span>
                                                <div className="invalid-feedback">
                                                    {this.state.errors.password ? this.state.errors.password : ""}
                                                </div>
                                            </div>
                                            <div className="clearfix">
                                                <div className="float-start">
                                                    <div className="mb-3 form-check">
                                                        <input type="checkbox" name="remember_me" id="remember_me" className="form-check-input" />
                                                        <label className="form-check-label" htmlFor="exampleCheck1">Remember Me</label>
                                                    </div>
                                                </div>
                                                <div className="float-end">
                                                    <NavLink to="/auth/email/forgot" className={"text-decoration-none forgot-password-link"}>
                                                        <i className="bi bi-key me-2" ></i>Forgot password ?
                                                    </NavLink>
                                                    <Tooltip anchorSelect=".forgot-password-link" content="Forgot Password service that allows the user to request a password reset." />
                                                </div>
                                            </div>
                                            <button type="submit" disabled={this.state.loadingSubmit}  className="btn btn-primary w-100">
                                                <i className={ this.state.loadingSubmit ? 'spinner-border spinner-border-sm me-1' : 'bi bi-arrow-right me-1' }></i> Sign In
                                                <Tooltip anchorSelect=".btn-primary" content="Users enter their email and password in the designated fields to access their accounts" />
                                            </button>
                                            <div className="mt-3 text-center">
                                                <NavLink to="/auth/register" className={"text-decoration-none register-link"}>
                                                    <i className="bi bi-pencil-square me-1"></i>Don't have an account ? <strong>Register Here</strong>
                                                </NavLink>
                                                <Tooltip anchorSelect=".register-link" content="The process of registering for a new user account on a website." />
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

export default withRouter(Login)