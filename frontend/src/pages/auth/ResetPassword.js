import { Component } from "react"
import { ShimmerThumbnail } from "react-shimmer-effects"
import { Tooltip } from 'react-tooltip'
import { withRouter } from '../../helpers/with-router';
import ReactFormInputValidation from "react-form-input-validation";
import AuthService from "../../services/auth";

class ResetPassword extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            auth: localStorage.getItem("token") !== null,
            fields: {
                email: "",
                password: "",
                password_confirmation: ""
            },
            success:"",
            message:"",
            errors: {}
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            email: "required|email",
            password: "required|min:8|confirmed",
            password_confirmation: "required"
        });
        this.form.onformsubmit = (fields) => {
            this.setState({
                success:"",
                message:"",
                loadingSubmit: true,
                fields: {
                    email: "",
                    password: "",
                    password_confirmation: ""
                }
            });
            this.submitForm(fields);
        }
    }

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            let token = this.props.router.params.token
            let formData = {
                email: fields.email,
                password: fields.password,
                password_confirm: fields.password_confirmation
            }
            await AuthService.resetPassword(token, formData).then((result) => {
                let data = result.data
                let success = data.message
                this.setState({
                    loadingSubmit: false,
                    success: success
                })
                setTimeout(() => { 
                    this.props.router.navigate("/auth/login")
                }, 3000)
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
                document.title = 'Reset Password | ' + process.env.REACT_APP_TITLE
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
                                            <i className="bi bi-lock me-1"></i> Reset Password
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
                                            <div className="input-group mb-3">
                                                
                                                <input
                                                    type="password"
                                                    name="password_confirmation"
                                                    className={this.state.errors.password_confirmation ? "form-control is-invalid" : "form-control"}
                                                    placeholder="Confirm Password"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.password_confirmation}
                                                    readOnly={this.state.loadingSubmit}
                                                />

                                                <span className="input-group-text" id="basic-addon1">
                                                    <i className="bi bi-key"></i>
                                                </span>
                                                <div className="invalid-feedback">
                                                    {this.state.errors.password_confirmation ? this.state.errors.password_confirmation : ""}
                                                </div>
                                            </div>

                                            <button type="submit" disabled={this.state.loadingSubmit}  className="btn btn-primary w-100">
                                                <i className={this.state.loadingSubmit ? 'spinner-border spinner-border-sm me-1' : 'bi bi-save me-1'}></i> Set Password
                                                <Tooltip anchorSelect=".btn-primary" content="Update New Password" />
                                            </button>
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

export default withRouter(ResetPassword)