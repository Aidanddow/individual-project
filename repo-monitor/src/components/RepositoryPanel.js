
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import RepositoryStat from "../components/RepositoryStat";
import { fetchData, getJsonData, getDaysSinceCommit, getUrl, fetchUrl } from "../utils.js"

/**
 * Repository Panel
 * 
 * @param {string} id - the id of a repository
 * @param {int} index - the index at which the repository lies in the stats array
 * @param {string} request - the requested metric - "repository/commits" or "issues", etc
 * @param {Date} period - the earliest date for the given time period
 * @param {boolean} showHeaders - a boolean value determining whether to show the project title or not.
 * @param {int[]} stats - an array of repository stats
 * @param {function} setStats - setter function for stats
 * @param {int} avgStat - the average stat (for computing colour)
 */
let RepositoryPanel = ({id, request, period, stats, index, setStats, avgStat, showHeaders}) => {

    let [repoName, setRepoName] = useState([])
    let [repoAuthor, setRepoAuthor] = useState([])
    let [stat, setStat] = useState(null)
    
    // Compute updated stat each time request or period changes
    useEffect(() => {
        setStat(null)
        getRepoName(id)

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

    // When a repositories id is changed, reset it
    useEffect(() => {
        setRepoName("")
        setRepoAuthor("")
        setStat(null)
    }, [id])

    // When the repository has computed its stat, reflect that in stats array
    useEffect(() => {
        stats[index] = stat
        setStats(stats)
    }, [stat, setStat])


    let getRepoName = async (id) => {
        let data = await fetchData(id, "")
        let dataJson = await data.json()
    
        setRepoName(dataJson.name)
        setRepoAuthor(dataJson.namespace.name)
    }

    // Counts pages in range, counts items on last page, sums up total items
    let getRepoStat = async (requestUrl) => {

        let pagesInRange = await getPagesInRange(requestUrl)
        let statistic, lastPageEntries
        
        if (pagesInRange ===0) {
            statistic = 0
        } else {
            lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
            
            // Since per_page=20, multiply pagesInRange-1 by 20
            statistic = ((pagesInRange-1) * 90) + lastPageEntries
        }
        setStat(statistic)
    }

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
        let stats = data.statistics.counts
        setStat(stats.opened)
    }

    let getMergeComments = async (id) => {
        
        let mergeUrl = getUrl(id, "merge_requests")
        let mergeRequests = await getJsonData(id, "merge_requests")
    
        let notes = await mergeRequests.map( async (merge) => {
            let requestUrl = `${mergeUrl}/${merge.iid}/notes`
            let pagesInRange = await getPagesInRange(requestUrl)
            let numComments, lastPageEntries
            
            if (pagesInRange !== 0) {
                lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
                numComments = ((pagesInRange-1) * 20) + lastPageEntries
                return numComments
            }
        })

        // Sum up notes array (since map was async, may need to await)
        notes = await notes.reduce(async (a, b) => await a + await b, 0)
        setStat(notes)
    }
    
    let getPipelineStat = async (id) => {
        let data = await getJsonData(id, "pipelines")

        if (data.length === 0) {
            console.log("NO DATA")
            setStat("no-pipeline")
        } else {
            if (data[0].status === "failed") {
                setStat("pipeline-fail")
            } else {
                setStat("pipeline-pass")
            }
        }
    }
    
    /* 
     * Function to return the pages which are in range for a request
     * Iteratively requests the next page until there are no pages left
     * or the date of the items on the page are outwith the time period.
     */
    let getPagesInRange = async (requestUrl) => {
        let page = 1
        
        while (true) { 
            let response = await fetchUrl(`${requestUrl}?page=${page}&per_page=90`)
            
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

    // Returns the number of entries on a page
    let getPageEntries = async (requestUrl, page) => {
        let response = await fetchUrl(`${requestUrl}?page=${page}&per_page=90`)
        let data = await response.json()
        let numEntries = await getPageEntriesBeforeDate(data)
        if (numEntries ===-1) {
            return 0
        } 
        return numEntries
    }

    // Returns the number of items within the time period on a page
    let getPageEntriesBeforeDate = async (data) => {
        return data.filter((entry) => {
            let d = new Date(entry.created_at)
            return (dateInRange(d))
        }).length
    }

    let getColour = (stat, avg, request) => {
        if (avg ==0) avg = 1
        let delta = (stat/avg) - 1
        
        // Higher days since last commit is bad, so reverse colouring
        if (request === "last-commit") delta = -1 * delta
        
        if (delta >= 0) {
            return 'green'
        } else if (delta <= -0.5) {
            return 'red'
        } else {
            return 'orange'
        }
    }

    /*
     * A component to conditionally wrap children with the "hovertext" class
     */
    const ShowHeaders = ({ condition, children }) => 
        !condition ? 
            <span className="hovertext" id="hovertext" data-hover={`${repoName} - ${repoAuthor}`}>
                {children}
            </span> 

            : children;

    return (
        <Link to={`/repository/${id}`} className='repo-title' >
        
            <div className="card animate" id={showHeaders? "card-headers-on" : "card-headers-off" }>

                <div id={
                    // Show colour unless stat is null or request is for pipeline
                    stat == null || request === "pipelines" ? '' : getColour(stat, avgStat, request)
                }>

                {/* Disables hovertext if headers are enabled */}
                <ShowHeaders condition={showHeaders}>

                    {showHeaders ? 
                        
                        // Show card header, or show nothing
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
                        <RepositoryStat stat={stat} request={request}/>
                    </div>
                    
                </ShowHeaders>
                </div>
            </div>
        
        </Link>
    )
}

export default RepositoryPanel