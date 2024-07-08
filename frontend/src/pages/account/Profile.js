import { Component } from "react"
import { ShimmerThumbnail } from "react-shimmer-effects"
import { Tooltip } from 'react-tooltip'
import country from 'country-list-js'
import { withRouter } from '../../helpers/with-router';
import ReactFormInputValidation from "react-form-input-validation";
import AccountService from "../../services/account"
import PageService from "../../services/page";

class Profile extends Component{

    constructor() {
        super();
        this.state = { 
            message: "",
            success:"",
            loadingSubmit: false,
            loadingFile: false,
            loading: true,
            auth: localStorage.getItem("token") !== null,
            countries: [],
            imgPreview:"https://dummyimage.com/150x150/343a40/6c757d",
            fields: {
                username:"",
                email:"",
                first_name:"",
                last_name:"",
                address:"",
                gender:"",
                country:"",
                about_me:""
            },
            errors: {}
        }
        this.onChangeGender = this.onChangeGender.bind(this)
        this.onChangeCountry = this.onChangeCountry.bind(this)
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            username: "required",
            email: "required|email",
            first_name:"string",
            last_name:"string",
            address:"string",
            gender:"string",
            country:"string",
            about_me:"string"
        });
        this.form.onformsubmit = (fields) => {
            this.submitForm(fields);
        }
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    componentDidMount(){
        if(!this.state.auth){
            window.location.href = "/"
        }else{
            document.title = 'Manage Profile | ' + process.env.REACT_APP_TITLE
            this.pingConnection()
        }
    }

    async submitForm(fields){
        if(Object.keys(this.state.errors).length === 0){
            this.setState({
                message: "",
                success:"",
                loadingSubmit: true
            });
            await AccountService.profileUpdate(fields).then((result) => {
                setTimeout(() => {
                    let data = result.data
                    let success = data.message
                    this.setState({
                        loadingSubmit: false,
                        success: success,
                        loading: true
                    })
                    setTimeout(() => { 
                        this.pingConnection()
                    }, 1500)
                }, 2000)
            }).catch((error) => {
                this.setState({
                    loadingSubmit: false,
                    message: error.response.data.message
                })
            })
        }
    }

    async pingConnection(){
        await PageService.ping().then(() => {
            setTimeout(() => { 
                this.loadContent()
            }, 1500)
        }).catch((error) => {
            console.log(error)
            this.props.router.navigate("/auth/login")
        })
    }

    async loadContent(){
        await AccountService.profileDetail().then((result) => {
            let data = result.data
            let profile = data.data
            let countries = country.names().sort()
            let defaultImage = this.state.imgPreview

            

            if(profile.image){
                defaultImage = process.env.REACT_APP_BACKEND_URL+"/page/download/"+profile.image
            }

            this.setState({
                fields: {
                    username: profile.username,
                    email: profile.email,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    address: profile.address,
                    gender: profile.gender,
                    country: profile.country,
                    about_me: profile.about_me
                },
                countries: countries,
                loading: false,
                imgPreview: defaultImage
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    onChangeGender(e){
        let fields = this.state.fields;
        fields.gender = e.target.value;
        this.setState({
            fields: fields
        })
      }

    onChangeCountry(e){
        let fields = this.state.fields;
        fields.country = e.target.value;
        this.setState({
            fields: fields
        })
      }

    async handleFileChange (e) {
        if (e.target.files) {
            let formData = new FormData()
            formData.append("file", e.target.files[0]);
            this.setState({ loadingFile: true })
            await AccountService.upload(formData).then((result) => { 
                setTimeout(() => {
                    let defaultImage  = this.state.imgPreview
                    if(result.data.data){
                        defaultImage =process.env.REACT_APP_BACKEND_URL+"/page/download/"+result.data.data
                    }
                    this.setState({
                        imgPreview: defaultImage,
                        loadingFile: false
                    })
                }, 2000)
            }).catch((error) => {
                let message =
                    (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString()
                this.setState({
                    loadingFile: false,
                    message: message
                })
            })
        }
    }

    render(){
        return (
            <>
                 <div className="container py-5">
                    <div className="row h-100 justify-content-center align-items-center mt-5">
                        { this.state.loading ? <>
                            <div className="col-md-7">
                                <ShimmerThumbnail height={400} rounded />
                            </div>
                        </> : <>
                            <div className="col-md-7">
                                <div className="card">
                                    <div className="card-header bg-primary text-white">
                                        <h4 className="p-2  text-center">
                                            <i className="bi bi-person me-1"></i> Manage Profile
                                        </h4>
                                    </div>
                                    <div className="card-body">

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

                                        <form noValidate onSubmit={this.form.handleSubmit} method="POST" autoComplete="off">
                                                <div className="row mt-4 mb-2 justify-content-center align-items-center">
                                                    <div className="col-md-6">
                                                        { this.state.loadingFile ? <>

                                                            <div className="text-center">
                                                                <ShimmerThumbnail height={200} width={200} rounded />
                                                            </div>
                                                        
                                                        </> : <>
                                                            
                                                            <div className="text-center">
                                                                <h5>
                                                                    <small>Profile Picture</small>
                                                                </h5>
                                                                <img className="img-fluid rounded-3" width={150} src={this.state.imgPreview} alt="..." />
                                                            </div>
                                                            <div className="mb-3 mt-3">
                                                                <input type="file" className="form-control" onChange={this.handleFileChange} id="" placeholder="" name="file_image"/>
                                                            </div>

                                                        </> }
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 mt-3">
                                                            <label htmlFor="email" className="form-label">Email:</label>
                                                            
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className={this.state.errors.email ? "form-control is-invalid" : "form-control"}
                                                                placeholder=""
                                                                onBlur={this.form.handleBlurEvent}
                                                                onChange={this.form.handleChangeEvent}
                                                                value={this.state.fields.email}
                                                                readOnly={this.state.loadingSubmit}
                                                            />

                                                            <div className="invalid-feedback">
                                                                {this.state.errors.email ? this.state.errors.email : ""}
                                                            </div>

                                                        </div>
                                                        <div className="mb-3 mt-3">
                                                            <label htmlFor="first_name" className="form-label">First Name:</label>
                                                            
                                                            <input
                                                                type="text"
                                                                name="first_name"
                                                                className={this.state.errors.first_name ? "form-control is-invalid" : "form-control"}
                                                                placeholder=""
                                                                onBlur={this.form.handleBlurEvent}
                                                                onChange={this.form.handleChangeEvent}
                                                                value={this.state.fields.first_name}
                                                                readOnly={this.state.loadingSubmit}
                                                            />

                                                            <div className="invalid-feedback">
                                                                {this.state.errors.first_name ? this.state.errors.first_name : ""}
                                                            </div>

                                                        </div>
                                                        <div className="mb-3 mt-3">
                                                            <label htmlFor="gender" className="form-label">Gender:</label>
                                                            <select name="gender"  className="form-control" options={[]} onChange={(e) => this.onChangeGender(e)} value={this.state.fields.gender}>
                                                                <option disabled value="">Choose Gender</option>
                                                                <option value="M">Male</option>
                                                                <option value="F">Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3 mt-3">
                                                        <label htmlFor="username" className="form-label">Username:</label>
                                                        
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            className={this.state.errors.username ? "form-control is-invalid" : "form-control"}
                                                            placeholder=""
                                                            onBlur={this.form.handleBlurEvent}
                                                            onChange={this.form.handleChangeEvent}
                                                            value={this.state.fields.username}
                                                            readOnly={this.state.loadingSubmit}
                                                        />

                                                        <div className="invalid-feedback">
                                                            {this.state.errors.username ? this.state.errors.username : ""}
                                                        </div>

                                                    </div>
                                                    <div className="mb-3 mt-3">
                                                        <label htmlFor="last_name" className="form-label">Last Name:</label>
                                                        
                                                        <input
                                                            type="text"
                                                            name="last_name"
                                                            className={this.state.errors.last_name ? "form-control is-invalid" : "form-control"}
                                                            placeholder=""
                                                            onBlur={this.form.handleBlurEvent}
                                                            onChange={this.form.handleChangeEvent}
                                                            value={this.state.fields.last_name}
                                                            readOnly={this.state.loadingSubmit}
                                                        />

                                                        <div className="invalid-feedback">
                                                            {this.state.errors.last_name ? this.state.errors.last_name : ""}
                                                        </div>

                                                    </div>
                                                    <div className="mb-3 mt-3">
                                                        <label htmlFor="country" className="form-label">Country:</label>
                                                        <select name="country"  className="form-control" options={[]} onChange={(e) => this.onChangeCountry(e)} value={this.state.fields.country}>
                                                            <option disabled value="">Choose Country</option>
                                                            {this.state.countries.map((item,index)=>{
                                                                return (
                                                                    <option key={index} value={item}>{ item }</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="address" className="form-label">Address:</label>
                                                <textarea 
                                                    name="address"
                                                    className="form-control"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.address}
                                                    rows="4"
                                                >
                                                </textarea>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="about" className="form-label">About Me:</label>
                                                <textarea 
                                                    name="about_me"
                                                    className="form-control"
                                                    onBlur={this.form.handleBlurEvent}
                                                    onChange={this.form.handleChangeEvent}
                                                    value={this.state.fields.about_me}
                                                    rows="4"
                                                >
                                                </textarea>
                                            </div>
                                            <button type="submit" disabled={this.state.loadingSubmit} className="btn btn-success" >
                                                <i className={ this.state.loadingSubmit ? 'spinner-border spinner-border-sm me-1' : 'bi bi-save me-1' }></i> Save Changed
                                            </button>
                                            <button type="reset" className="ms-1 text-white btn btn-warning">
                                                <i className="bi bi-arrow-clockwise me-1"></i> Reset Form
                                            </button>
                                            <Tooltip anchorSelect=".btn-success" content="Update Profile" />
                                            <Tooltip anchorSelect=".btn-warning" content="Reset Form" />
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

export default withRouter(Profile)