import { Component } from "react"
import { ShimmerTitle, ShimmerThumbnail, ShimmerCircularImage, ShimmerSectionHeader   } from "react-shimmer-effects"
import { withRouter } from '../helpers/with-router';
import PageService from "../services/page";

class About extends Component{

    constructor() {
        super();
        this.state = { 
            loading: true,
            content: {}
        }
    }

    componentWillMount(){
        document.title = 'About | ' + process.env.REACT_APP_TITLE
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
        await PageService.about().then((response) => {
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

    getPeopleImage(){
        let arrs = ["male.png", "female.png"]
        let random = Math.floor(Math.random() * arrs.length)
        let result = arrs[random]
        return "/"+result
    }

    getClassName(index){
        if(parseInt(index) <= 1){
            return "col mb-5 mb-5 mb-xl-0"
        }else if(parseInt(index) === 2){
            return "col mb-5 mb-5 mb-sm-0"
        }else{
            return "col mb-5"
        }
    }

    render(){
        return (
            <>
                <header className="py-5">
                    <div className="container px-5">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-xxl-6">
                                { this.state.loading ? <>
                                    <ShimmerTitle line={5} gap={15} variant="primary" />    
                                </> : <>
                                    <div className="text-center my-5">
                                        <h1 className="fw-bolder mb-3">{this.state.content.header.title}</h1>
                                        <p className="lead fw-normal text-muted mb-4">{this.state.content.header.description}</p>
                                        <a className="btn btn-primary btn-lg" href="#scroll-target">Read our story</a>
                                    </div>
                                </> }
                            </div>
                        </div>
                    </div>  
                </header>
                <section className="py-5 bg-light" id="scroll-target">
                    <div className="container px-5 my-5">
                         <div className="row gx-5 align-items-center">
                            { this.state.loading ? <>
                                <div className="col-lg-6">
                                    <ShimmerThumbnail height={400} rounded />
                                </div>
                                <div className="col-lg-6">
                                    <ShimmerTitle line={5} gap={15} variant="primary" />    
                                </div>
                             </> : <>
                                <div className="col-lg-6"><img className="img-fluid rounded mb-5 mb-lg-0"  src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/400"} alt="..." /></div>
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">{this.state.content.section1.title}</h2>
                                    <p className="lead fw-normal text-muted mb-0">{this.state.content.section1.description}</p>
                                </div>
                             </> }
                         </div>
                    </div>
                </section>
                <section className="py-5">
                     <div className="container px-5 my-5">
                          <div className="row gx-5 align-items-center">
                              { this.state.loading ? <>
                                <div className="col-lg-6 order-first order-lg-last">
                                    <ShimmerThumbnail height={400} rounded />
                                </div>
                                <div className="col-lg-6">
                                    <ShimmerTitle line={5} gap={15} variant="primary" />    
                                </div>
                              </> : <>
                                <div className="col-lg-6 order-first order-lg-last"><img className="img-fluid rounded mb-5 mb-lg-0"  src={"https://picsum.photos/id/"+(Math.floor(Math.random() * 100) + 0)+"/600/400"} alt="..." /></div>
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">{this.state.content.section1.title}</h2>
                                    <p className="lead fw-normal text-muted mb-0">{this.state.content.section1.description}</p>
                                </div>
                              </> }
                          </div>
                     </div>           
                </section>
                <section className="py-5 bg-light">
                    <div className="container px-5 my-5">
                        <div className="text-center">
                            <h2 className="fw-bolder">Our team</h2>
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
                                {this.state.content.teams.map((item,index)=>{
                                    return (
                                        <div key={index} className={this.getClassName(index)}>
                                            <div className="text-center">
                                                <img className="img-fluid rounded-circle mb-4 px-4" width="150" src={this.getPeopleImage()} alt="..." />
                                                <h5 className="fw-bolder">{item.name}</h5>
                                                <div className="fst-italic text-muted">{item.position_name}</div>
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

export default withRouter(About)