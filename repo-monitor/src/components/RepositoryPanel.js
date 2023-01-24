
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { fetchData, getJsonData, getDaysSinceCommit, getUrl, fetchUrl } from "../utils.js"
import pipelinePass from '../static/pipeline-pass.png'
import pipelineFail from '../static/pipeline-fail.png'
import noPipeline from '../static/no-pipeline.png'


let Repository = class {

    constructor(id, name="", author="", stat=null, loading=true) {
        this.id = id
        this.name = name
        this.author = author
        this.stat = stat
        this.loading = loading
    }


    toString() {
        return `Repo: ${this.author} ${this.stat}`
    }

    fetchName = async () => {
        let data = await fetchData(this.id, "")
        let dataJson = await data.json()

        this.name = dataJson.name
        this.author = dataJson.namespace.name
        console.log("Should have changed now!: ", this.toString())
    }
}


let RepositoryPanel = ({id, repos, setRepos, metric, period, showHeaders}) => {

    let [repo, setRepo] = useState(new Repository(id))

    useEffect(() => {
        repo.fetchName()
        
        let requestUrl = getUrl(repo.id, "repository/commits")
        getRepoStat(repo, requestUrl)
    }, [])

    useEffect(() => {
        console.log("REPO HAS BEEN CHANGED, now: ", repo.toString())

        let newRepo = new Repository(
            repo.id,
            repo.name,
            repo.author,
            stat,
        )
        repos[id] = newRepo
        setRepos(repos)
        setRepo(newRepo)

    }, [repo.stat, setRepo])

    useEffect(() => {
        setRepo(repo)
    }, [repo.name, repo.author])
    
    useEffect(() => {
        repo.stat = null
        repo.loading = true
        setRepo(repo)
        // getRepoName(repo)
        
        switch (metric.endpoint) {
            case "pipelines":
                getPipelineStat(repo)
                break;
            
            case "issues":
                getIssues(repo)
                break
            
            case "last-commit":
                getLastCommit(repo)
                break

            case "merge_comments":
                getMergeComments(repo)
                break

            default:
                let requestUrl = getUrl(repo.id, metric.endpoint)
                getRepoStat(repo, requestUrl)
        }
        
    }, [metric, period])

    let dateInRange = (d) => {
        let dateFilter = period
        return (d >= dateFilter)
    }

    let getLastCommit = async (repo) => {
        let data = await getJsonData(repo.id, "repository/commits")
        let statistic = getDaysSinceCommit(data[0].created_at)
        repo.stat = statistic
        repo.loading = false
        setRepo(repo)
    }

    let getIssues = async (repo) => {
        let data = await getJsonData(repo.id, "issues_statistics")
        // console.log("ISSUESSS ", data.statistics.counts)
        let stats = data.statistics.counts
        
        repo.stat = stats.opened
        repo.loading = false
        setRepo(repo)
    }

    let getMergeComments = async (repo) => {
        
        let mergeRequests = await getJsonData(repo.id, "merge_requests")

        let mergeUrl = getUrl(repo.id, "merge_requests")
    
        let notes = await mergeRequests.map( async (merge) => {
            let requestUrl = `${mergeUrl}/${merge.iid}/notes`
            let pagesInRange = await getPagesInRange(requestUrl)
            let numComments, lastPageEntries
            
            if (pagesInRange != 0) {
                lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
                numComments = ((pagesInRange-1) * 20) + lastPageEntries
                return numComments
            }
        })

        repo.stat = await notes.reduce(async (a, b) => await a + await b, 0)

        console.log("Notes: ", notes)
        repo.loading = false
        setRepo(repo)

    }
    

    let getPipelineStat = async (id) => {
        let data = await getJsonData(id, "pipelines")
        // console.log("DATA: ", data)
        if (data.length == 0) {
            repo.stat = "no-pipeline"
        } else {
            repo.stat = "pipeline-pass"
        }
        repo.loading = false
        setRepo(repo)
    }
    
    let getPagesInRange = async (requestUrl) => {
        let page = 1
        
        while (true) { 
            let response = await fetchUrl(`${requestUrl}?page=${page}&per_page=20`)
            
            let nextPage = response.headers.get("x-next-page")
            if (!nextPage) return page

            let data = await response.json()
            let firstDateCreated = new Date(data[0].created_at)
    
            if (dateInRange(firstDateCreated)) {
                page ++
            } else {
                return page-1
            }
        }
    }

    let getPageEntries = async (requestUrl, page) => {
        let response = await fetchUrl(`${requestUrl}?page=${page}&per_page=20`)
        let data = await response.json()
        let numEntries = await getPageEntriesBeforeDate(data)
        if (numEntries == -1) {
            return 0
        } 
        return numEntries
    }

    let getPageEntriesBeforeDate = async (data) => {
        return data.filter((entry) => {
            let d = new Date(entry.created_at)
            return (dateInRange(d))
        }).length
    }

    let getRepoStat = async (repo, requestUrl) => {

        let pagesInRange = await getPagesInRange(requestUrl)
        let lastPageEntries
        
        if (pagesInRange == 0) {
            repo.stat = 0
        } else {
            lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
            repo.stat = ((pagesInRange-1) * 20) + lastPageEntries   
        }
        repo.loading = false
        setRepo(repo)
    }

    const ShowHeaders = ({ condition, children }) => 
        !condition ? 
            <span className="hovertext" id="hovertext" data-hover={`${repo.name} - ${repo.author}`}>
                {children}
            </span> 

            : children;

    return (
        <Link to={`/repository/${id}`} className='repo-title' >
        
        <div className="card animate" id={showHeaders? "card-headers-on" : "card-headers-off" }>

            <div id={repo.stat==null ? '' : repo.stat > metric.lowerBound(period) ? 'green' : 'red'}>
            <ShowHeaders condition={showHeaders}>

            {showHeaders ? 
            
                <div className="card-header">
                    {!Number.isNaN(repo.stat) ? 
                    <div className="name-and-author">
                        <h6 className="repo-title">{ repo.name }</h6>
                        
                        <p className="repo-title">
                        {repo.author.length < 26 ? 
                            <>{repo.author}</>  : <>{repo.author.substring(0, 20)}...</>
                        }
                        </p>
                    </div>: <></> }
                </div>
             : <></>
            }
            
            <div className="card-body">
            
                <h2 className="commits">
                
                { metric.endpoint === "pipelines" ?

                !repo.loading ?
                
                <img src={ repo.stat == "pipeline-pass" ? pipelinePass : repo.stat == "pipeline-fail" ? pipelineFail : noPipeline} className="pipeline-logo animate"/>
                
                :<span className="loader"></span> 
                
                :
                
                 !repo.loading && !Number.isNaN(repo.stat) ? 
                    <div className="animate">
                        {console.log("REPO STAT SHOULD BE: ", repo)}

                        {repo.stat}    
                    </div>
                  : 
                  <span className="loader"></span> 
            } 
                
                </h2>
                <use href="/assets/icons-7b0fcccb8dc2c0d0883e05f97e4678621a71b996ab2d30bb42fafc906c1ee13f.svg#status_success"></use>
            </div>
            
            
        {/* <button className="btn btn-sm btn-outline-danger">Delete</button> */}
            
            {/* </div>     */}
            </ShowHeaders>
            </div>
        </div>
        
        </Link>
    )
}

export default RepositoryPanel