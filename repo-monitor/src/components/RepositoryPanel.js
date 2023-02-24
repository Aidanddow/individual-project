
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { fetchData, getJsonData, getDaysSinceCommit, getUrl, fetchUrl } from "../utils.js"
import pipelinePass from '../static/pipeline-pass.png'
import pipelineFail from '../static/pipeline-fail.png'
import noPipeline from '../static/no-pipeline.png'


let RepositoryPanel = ({id, index, request, period, showHeaders, stats, setStats, avgStat}) => {

    let [repoName, setRepoName] = useState([])
    let [repoAuthor, setRepoAuthor] = useState([])
    let [stat, setStat] = useState(null)
    
    useEffect(() => {
        setStat(null)
        // console.log("PERIODDDDDDDD: " + period)
        getRepoName(id)
        // console.log("REQ: ", request)

        switch (request) {
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
                let requestUrl = getUrl(id, request)
                getRepoStat(requestUrl)
        }
        
    }, [request, period, id])

    useEffect(() => {
        setRepoName("")
        setRepoAuthor("")
        setStat(null)
    }, [id])


    useEffect(() => {
        stats[index] = stat
        setStats(stats)
    }, [stat, setStat])

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
            
            if (pagesInRange !== 0) {
                lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
                numComments = ((pagesInRange-1) * 20) + lastPageEntries
                return numComments
            }
        })

        notes = await notes.reduce(async (a, b) => await a + await b, 0)

        // console.log("Notes: ", notes)
        setStat(notes)
    }
    
    let getPipelineStat = async (id) => {
        let data = await getJsonData(id, "pipelines")

        if (data.length ===0) {
            setStat("no-pipeline")
        } else {
            if (data[0].status === "failed") {
                setStat("pipeline-fail")
            } else {
                setStat("pipeline-pass")
            }
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
        if (numEntries ===-1) {
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
        
        if (pagesInRange ===0) {
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
        
        // console.log("NAME: ", dataJson.name)
        setRepoName(dataJson.name)
        setRepoAuthor(dataJson.namespace.name)
    }

    const ShowHeaders = ({ condition, children }) => 
        !condition ? 
            <span className="hovertext" id="hovertext" data-hover={`${repoName} - ${repoAuthor}`}>
                {children}
            </span> 

            : children;

    let getColour = (stat, avg, request) => {
        let delta = (stat/avg) - 1

        // Higher last commit day is bad
        if (request === "last-commit") delta = -1 * delta
        
        if (delta >= 0) {
            return 'green'
        }
        else if (delta <= -0.5) {
            return 'red'
        }
        else {
            return 'orange'
        }
    }

    return (
        <Link to={`/repository/${id}`} className='repo-title' >
        
        <div className="card animate" id={showHeaders? "card-headers-on" : "card-headers-off" }>

            <div id={
                // If stat is null or request is for pipeline, don't show colour otherwise do
                stat == null || request === "pipelines" ? '' : getColour(stat, avgStat, request)
            }>

            {/* Disables hovertext if headers are enabled */}
            <ShowHeaders condition={showHeaders}>

            {/* Show card header */}
            {showHeaders ? 
                <div className="card-header">
                    {
                        !Number.isNaN(stat) ? 
                            <div className="name-and-author">
                                <h6 className="repo-title">{ repoName }</h6>
                                
                                <p className="repo-title">
                                    {
                                        repoAuthor.length < 26 ? 
                                          <>{repoAuthor}</>  
                                        : <>{repoAuthor.substring(0, 22)}...</>
                                    }
                                </p>
                            </div>
                            
                        : <></> 
                    }
                </div>

             : <></>
            }
            
            <div className="card-body">
                <h2 className="commits">

                {
                    request !== "pipelines" ?
                        stat !== null && !Number.isNaN(stat) ? 
                            <div className="animate">
                                {stat}    
                            </div>
    
                        // Stat hasn't loaded display loading    
                        : <span className="loader"></span> 
                    
                    :
                    // Request is for pipelines, show pipeline image
                        (stat !== null ? 
                            // If the stat has loaded, display pipeline image based on state
                            <img src={ 
                                  stat ==="pipeline-pass" ? pipelinePass 
                                : stat ==="pipeline-fail" ? pipelineFail 
                                : noPipeline
                            } className="pipeline-logo animate" alt="pipeline"/>
                            
                            
                        // Stat hasn't loaded display loading
                        : <span className="loader"></span> )
                } 
                
                </h2>
            </div>
            
            </ShowHeaders>
            </div>
        </div>
        
        </Link>
    )
}

export default RepositoryPanel