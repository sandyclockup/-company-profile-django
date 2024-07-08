import { Component } from "react"
import { ShimmerCircularImage, ShimmerSectionHeader, ShimmerText, ShimmerThumbnail  } from "react-shimmer-effects"
import { withRouter } from '../../helpers/with-router';
import moment from 'moment'
import ArticleService from "../../services/article";
import PageService from "../../services/page";
import Comment from "../../components/Comment"
import ReactFormInputValidation from "react-form-input-validation";

class Detail extends Component{

    constructor() {
        super();
        this.state = { 
            auth: localStorage.getItem("token") !== null,
            loading: true,
            loadingComment: true,
            content: {},
            comments:[],
            fields: {
                comment: ""
            },
            errors: {}
        }
        this.form = new ReactFormInputValidation(this);
        this.form.useRules({
            comment: "required"
        });
        this.form.onformsubmit = (fields) => {
            this.submitForm(fields);
        }
    }

    componentWillMount(){
        document.title = 'Article Details | ' + process.env.REACT_APP_TITLE
        this.pingConnection()
    }

    async loadComment(id){
        await ArticleService.commentList(id).then((response) => {
            this.setState({
                comments: response.data.comments,
                loadingComment: false
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    async loadContent(){
        let slug = this.props.router.params.slug
        await ArticleService.detail(slug).then((response) => {
            let data = response.data
            setTimeout(() => { 
                this.setState({
                    content: data.data,
                    loading: false
                })
                this.loadComment(data.data.id)
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
            this.setState({ loadingComment: true })
            let id = this.state.content.id
            await ArticleService.commentCreate(id, fields).then((response) => {
                setTimeout(() => { 
                    this.setState({
                        fields: {
                            comment: ""
                        },
                        loadingComment: false
                    })
                    this.loadComment(id)
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
                    <div className="container px-5 my-5">
                        <div className="row gx-5">
                            <div className="col-lg-3">
                                { this.state.loading ? <>
                                    <ShimmerCircularImage center size={150} />
                                    <ShimmerSectionHeader center />
                                </> : <>
                                    <div className="d-flex align-items-center mt-lg-5 mb-4">
                                        <img className="img-fluid rounded-circle" width={50} src={this.state.content.gender === 'M' ? '/male.png' : '/female.png'} alt="..." />
                                        <div className="ms-3">
                                            <div className="fw-bold">{this.state.content.first_name} {this.state.content.last_name}</div>
                                            <div  className="text-muted">{this.state.content.about_me}</div>
                                        </div>
                                    </div>
                                </> }
                            </div>
                            <div className="col-lg-9">
                               
                                <article>
                                   
                                    <header className="mb-4">
                                        
                                        { this.state.loading ? <>
                                            <ShimmerText line={5} gap={10} />
                                        </> : <>
                                            <h1 className="fw-bolder mb-1">{this.state.content.title}</h1>
                                            <div className="text-muted fst-italic mb-2">{ moment(this.state.content.created_at).fromNow()}</div>

                                            {this.state.content.categories.split(",").map((category, index)=>{
                                                return (
                                                    <a key={index} className="badge bg-secondary text-decoration-none link-light me-1" href="#!">{category}</a>
                                                )
                                            })}

                                        </> }

                                    </header>
                                   
                                    <figure className="mb-4">
                                        { this.state.loading ? <>
                                            <ShimmerThumbnail height={400}  rounded />
                                        </> : <>
                                            <img className="img-fluid rounded" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/900/400"} alt="..." />
                                        </> }
                                    </figure>
                                   
                                    { this.state.loading ? <>
                                        
                                        <ShimmerText line={20} gap={10} />

                                    </> : <>
                                    
                                        <section className="mb-5">
                                            {this.state.content.content}
                                        </section>
                                    
                                    </> }

                                </article>
                              
                                <section>
                                    
                                    { this.state.loading ? <>
                                        <ShimmerThumbnail height={150}  rounded />
                                    </> : <>
                                    
                                        { this.state.loadingComment ? <>

                                            <ShimmerThumbnail height={150}  rounded />
                                        
                                        </> : <>
                                        
                                            <div className="card bg-light">
                                                <div className="card-body">

                                                    { this.state.auth ? <>
                                                        <form  noValidate autoComplete="off" onSubmit={this.form.handleSubmit} className="mb-4">
                                                            <textarea 
                                                                name="comment"
                                                                className={this.state.errors.comment ? "form-control is-invalid" : "form-control"}
                                                                onBlur={this.form.handleBlurEvent}
                                                                onChange={this.form.handleChangeEvent}
                                                                value={this.state.fields.comment}
                                                                placeholder="Join the discussion and leave a comment!"
                                                                rows={3}
                                                            />
                                                             <div className="invalid-feedback">
                                                                {this.state.errors.comment ? this.state.errors.comment : ""}
                                                            </div>
                                                             <button disabled={this.state.loadingComment} className="btn btn-primary btn-sm mt-2" id="submitButton" type="submit">
                                                                <i className={ this.state.loadingComment ? 'spinner-border spinner-border-sm me-1' : 'bi bi-chat-right-text me-1' }></i>Send Comment
                                                            </button>
                                                        </form>

                                                    </> : <></> }
                                                
                                                    {this.state.comments.map((comment, index)=>{
                                                        return (<Comment key={index} comment={comment} />)
                                                    })}
                                            
                                                </div>
                                            </div>
                                        
                                        </> }
                                    
                                    </> }

                                </section>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(Detail)