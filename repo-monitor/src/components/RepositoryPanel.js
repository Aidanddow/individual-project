
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { fetchData, getJsonData, getDaysSinceCommit, getUrl, fetchUrl } from "../utils.js"
import pipelinePass from '../static/pipeline-pass.png'
import pipelineFail from '../static/pipeline-fail.png'
import noPipeline from '../static/no-pipeline.png'


let RepositoryPanel = ({id, metric, period, showHeaders}) => {

    let [repoName, setRepoName] = useState([])
    let [repoAuthor, setRepoAuthor] = useState([])
    let [stat, setStat] = useState(null)
    
    useEffect(() => {
        setStat(null)
        getRepoName(id)

        switch (metric.endpoint) {
            case "pipelines":
                getPipelineStat(id)
                break;
            
            case "issues":
                getIssues(id)
                break
            
            case "last-commit":
                getLastCommit(id)
                break

            case "merge_comments":
                getMergeComments(id)
                break

            default:
                let requestUrl = getUrl(id, metric.endpoint)
                getRepoStat(requestUrl)
        }
        
    }, [metric, period])

    let dateInRange = (d) => {
        let dateFilter = period
        return (d >= dateFilter)
    }

    let getLastCommit = async (id) => {
        let data = await getJsonData(id, "repository/commits")
        let statistic = getDaysSinceCommit(data[0].created_at)
        setStat(statistic)
    }

    let getIssues = async (id) => {
        let data = await getJsonData(id, "issues_statistics")
        // console.log("ISSUESSS ", data.statistics.counts)
        let stats = data.statistics.counts
        setStat(stats.opened)
    }

    let getMergeComments = async (id) => {
        console.log("------------------------------- Getting Merge Notes")
        let mergeRequests = await getJsonData(id, "merge_requests")

        let mergeUrl = getUrl(id, "merge_requests")
    
        let notes = await mergeRequests.map( async (merge) => {
            console.log("TRYing this:::::: ---------------------------------------------------")
            let requestUrl = `${mergeUrl}/${merge.iid}/notes`
            let pagesInRange = await getPagesInRange(requestUrl)
            let numComments, lastPageEntries
            
            if (pagesInRange != 0) {
                lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
                numComments = ((pagesInRange-1) * 20) + lastPageEntries
                return numComments
            }
        })

        notes = await notes.reduce(async (a, b) => await a + await b, 0)

        console.log("Notes: ", notes)

        setStat(notes)

    }
    

    let getPipelineStat = async (id) => {
        let data = await getJsonData(id, "pipelines")
        // console.log("DATA: ", data)
        if (data.length == 0) {
            setStat("no-pipeline")
        } else {
            setStat("pipeline-pass")
        }
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

    let getRepoStat = async (requestUrl) => {

        let pagesInRange = await getPagesInRange(requestUrl)
        let statistic, lastPageEntries
        
        if (pagesInRange == 0) {
            statistic = 0
            setStat(statistic)
        } else {
            lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
            statistic = ((pagesInRange-1) * 20) + lastPageEntries
            setStat(statistic)
        }

        setStat(statistic)
    }

    let getRepoName = async (id) => {
        let data = await fetchData(id, "")
        let dataJson = await data.json()
        
        console.log("NAME: ", dataJson.name)
        setRepoName(dataJson.name)
        setRepoAuthor(dataJson.namespace.name)
    }

    const ShowHeaders = ({ condition, children }) => 
        !condition ? 
            <span className="hovertext" id="hovertext" data-hover={`${repoName} - ${repoAuthor}`}>
                {children}
            </span> 

            : children;

    return (
        <Link to={`/repository/${id}`} className='repo-title' >
        
        <div className="card animate" id={showHeaders? "card-headers-on" : "card-headers-off" }>

            <div id={stat==null ? '' : stat > metric.lowerBound(period) ? 'green' : 'red'}>
            <ShowHeaders condition={showHeaders}>

            {showHeaders ? 
            
                <div className="card-header">
                    {!Number.isNaN(stat) ? 
                    <div className="name-and-author">
                        <h6 className="repo-title">{ repoName }</h6>
                        
                        <p className="repo-title">
                        {repoAuthor.length < 26 ? 
                            <>{repoAuthor}</>  : <>{repoAuthor.substring(0, 20)}...</>
                        }
                        </p>
                    </div>: <></> }
                </div>
             : <></>
            }
            
            <div className="card-body">
            
                <h2 className="commits">
                
                { metric.endpoint === "pipelines" ?

                stat != null ? 
                
                <img src={ stat == "pipeline-pass" ? pipelinePass : stat == "pipeline-fail" ? pipelineFail : noPipeline} className="pipeline-logo animate"/>
                
                :<span className="loader"></span> 
                
                :
                
                  stat!=null && !Number.isNaN(stat) ? 
                    <div className="animate">
                        {stat}    
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