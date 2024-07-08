import { Component } from "react"
import { ShimmerThumbnail, ShimmerText, ShimmerPostItem  } from "react-shimmer-effects"
import { withRouter } from '../../helpers/with-router';
import moment from 'moment'
import { NavLink } from "react-router-dom";
import ArticleService from "../../services/article";
import PageService from "../../services/page";

class List extends Component{

    constructor() {
        super();
        this.state = { 
            params: {
                page: localStorage.getItem('page') || '1'
            },
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        if(!localStorage.getItem('page')){
            localStorage.setItem('page', '1')
        }
        document.title = 'Article | ' + process.env.REACT_APP_TITLE
        this.pingConnection()
    }

    async loadContent(){
        await ArticleService.list(this.state.params).then((response) => {
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

    async loadMore(e){
        e.preventDefault()
        let currentPage = localStorage.getItem('page') || '1'
        let nextPage = parseInt(currentPage) + 1
        localStorage.setItem('page', nextPage.toString())
        this.setState({ loading: true, params: { page: nextPage.toString() } })
        this.pingConnection()
    }

    render(){
        return (
            <>
                <section className="py-5">
                    <div className="container px-5">
                        <h1 className="fw-bolder fs-5 mb-4">Company Blog</h1>
                        <div className="card border-0 shadow rounded-3 overflow-hidden">
                            <div className="card-body p-0">
                                <div className="row gx-0">
                                    <div className="col-lg-6 col-xl-5 py-lg-5">
                                        { this.state.loading ? <>
                                            <ShimmerText line={10} gap={10} className="p-4 p-md-5" />
                                        </> : <>
                                            <div className="p-4 p-md-5">

                                                {this.state.content.new_article.categories.split(",").map((category, index)=>{
                                                    return (
                                                        <div key={index}  className="badge bg-primary bg-gradient rounded-pill mb-2 me-1">{category}</div>
                                                    )
                                                })}

                                                <div className="h2 fw-bolder">{this.state.content.new_article.title}</div>
                                                <p>{this.state.content.new_article.description}</p>
                                                <NavLink className="stretched-link text-decoration-none" to={"/article/"+this.state.content.new_article.slug}>
                                                    Read more
                                                    <i className="bi bi-arrow-right"></i>
                                                </NavLink>
                                            </div>
                                        </> }
                                    </div>
                                    <div className="col-lg-6 col-xl-7">
                                        { this.state.loading ? <>
                                            <ShimmerThumbnail height={350} className="bg-featured-blog" />
                                        </> : <>
                                            <div className="bg-featured-blog" style={{backgroundImage: `url("`+("https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/700/350")+`")` }}></div>
                                        </> }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-5 bg-light">
                    <div className="container px-5">
                        <div className="row gx-5">
                            <div className="col-xl-8">
                                <h2 className="fw-bolder fs-5 mb-4">News</h2>
                                
                                { this.state.loading ? <>

                                    <div className="mb-4">
                                        <ShimmerText line={5} gap={10}  />
                                    </div>
                                
                                    <div className="mb-5">
                                        <ShimmerText line={5} gap={10} />
                                    </div>
                                
                                    <div className="mb-5">
                                       <ShimmerText line={5} gap={10} />
                                    </div>
                           
                                
                                </> : <>

                                    {this.state.content.new_articles.map((article, index)=>{
                                        return (
                                            <div key={index} className="mb-4">
                                                <div className="small text-muted">{ moment(article.created_at).fromNow() }</div>
                                                <NavLink className="link-dark" to={"/article/"+article.slug}>
                                                    <h3>{article.title}</h3>
                                                </NavLink>
                                            </div>
                                        )
                                    })}
                                
                                    
                                
                                </> }


                            </div>
                            <div className="col-xl-4">
                                
                                { this.state.loading ? <>
                                    <ShimmerThumbnail height={400} rounded />
                                </> : <>
                                
                                <div className="card border-0 h-100">
                                    <div className="card-body p-4">
                                        <div className="d-flex h-100 align-items-center justify-content-center">
                                            <div className="text-center">
                                                <div className="h6 fw-bolder">Contact</div>
                                                <p className="text-muted mb-4">
                                                    For press inquiries, email us at
                                                    <br />
                                                    <a href="mailto:someone@example.com">sandy.andryanto.dev@gmail.com</a>
                                                </p>
                                                <div className="h6 fw-bolder">Follow us</div>
                                                <a className="fs-5 px-2 link-dark" target="_blank" rel="noreferrer" href="https://t.me/sand40"><i className="bi-telegram"></i></a>
                                                <a className="fs-5 px-2 link-dark" target="_blank" rel="noreferrer" href="https://www.facebook.com/sandyandryantz"><i className="bi-facebook"></i></a>
                                                <a className="fs-5 px-2 link-dark" target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/sand404"><i className="bi-linkedin"></i></a>
                                                <a className="fs-5 px-2 link-dark" target="_blank" rel="noreferrer" href="https://www.instagram.com/sandyandryanto"><i className="bi-instagram"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                </> }

                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="py-5">
                    <div className="container px-5">
                        <h2 className="fw-bolder fs-5 mb-4">Featured Stories</h2>
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
                            
                            {this.state.content.stories.map((article, index)=>{
                                return (
                                    <div key={index} className="col-lg-4 mb-5">
                                        <div className="card h-100 shadow border-0">
                                            <img className="card-img-top" src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/350"} alt="..." />
                                            <div className="card-body p-4">
                                                
                                                {article.categories.split(",").map((category, index)=>{
                                                    return (
                                                        <div key={index} className="badge bg-primary bg-gradient rounded-pill mb-2 me-1">{category}</div>
                                                    )
                                                })}

                                                <NavLink className="text-decoration-none link-dark stretched-link" to={"/article/"+article.slug}>
                                                    <div className="h5 card-title mb-3">{article.title}</div>
                                                </NavLink>
                                                <p className="card-text mb-0">{article.description}</p>
                                            </div>
                                            <div className="card-footer p-4 pt-0 bg-transparent border-top-0">
                                                <div className="d-flex align-items-end justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <img className="rounded-circle me-3" width={50} src={article.gender === 'M' ? '/male.png' : '/female.png'} alt="..." />
                                                        <div className="small">
                                                            <div className="fw-bold">{article.first_name} {article.last_name}</div>
                                                            <div className="text-muted">{ moment(article.created_at).fromNow() }</div>
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
                        { this.state.content.continue && !this.state.loading ? <>
                            <div className="text-end mb-5 mb-xl-0">
                                <a className="text-decoration-none" href="#!" onClick={(e) => this.loadMore(e)}>
                                    More stories
                                    <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </> : <></> }
                    </div>
                </section>
            </>
        )
    }

}

export default withRouter(List)