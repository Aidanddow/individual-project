
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
        let requestUrl

        switch (request) {

            case "repository/commits":
                getCommits(id)
                break;

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
                requestUrl = getUrl(id, request) +"?"
                let statt = getRepoStat(requestUrl)
                setStat(statt)
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

    let getCommits = async (id) => {
        let branchUrl = getUrl(id, "/repository/branches")
        let response = await fetchUrl(branchUrl)
        let branches = await response.json()
        let totalCommits = 0

        await Promise.all(branches.map(async (b) => {
            let commitUrl = getUrl(id, request) + "?ref_name=" + b.name
            let commits = await getCommitsForBranch(commitUrl)
            console.log(b.name + ": " +  commits.length + " Commits")
            totalCommits += commits.length
            return commits.length
        }))
      
        setStat(totalCommits)
    }

    let getCommitsForBranch = async (requestUrl) => {
        let commits = []
        let page=0
        while (true) { 
            let response = await fetchUrl(`${requestUrl}&page=${page}&per_page=100`)
            let data = await response.json()

            console.log("DATAAAAAAAA: ", data)

            data.forEach(commit => {
                console.log("Looking at commit: ", commit)
                let dateCreated = new Date(commit.created_at)
                if (dateInRange(dateCreated)) {
                    commits.push(commit.short_id)
                }
            })

            console.log("COMMITS: ", commits)

            let nextPage = response.headers.get("x-next-page")
            if (!nextPage) return commits
            page ++
        }
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

        console.log("Notes: ", notes)

        setStat(notes)

    }
    

    let getPipelineStat = async (id) => {
        let data = await getJsonData(id, "pipelines")
        // console.log("DATA: ", data)
        if (data.length ===0) {
            setStat("no-pipeline")
        } else {
            setStat("pipeline-pass")
        }
    }
    
    let getPagesInRange = async (requestUrl) => {
        let page = 1
        
        while (true) { 
            let response = await fetchUrl(`${requestUrl}&page=${page}&per_page=20`)
            
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
        let response = await fetchUrl(`${requestUrl}&page=${page}&per_page=20`)
        console.log("GETTING: ", `${requestUrl}&page=${page}&per_page=20`)
        let data = await response.json()
        let numEntries = await getPageEntriesBeforeDate(data)
        if (numEntries === -1) {
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
            return 0
        } else {
            lastPageEntries = await getPageEntries(requestUrl, pagesInRange)
            console.log("On Last Page there are: ", lastPageEntries)
            return ((pagesInRange-1) * 20) + lastPageEntries
        }
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

    let getColour = (stat, avg) => {
        const delta = (stat/avg) - 1

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



    // function getColour(stat, avg) {
    //     let perc = stat / avg
    //     var r, g, b = 0;
    //     if(perc < 50) {
    //         r = 255;
    //         g = Math.round(5.1 * perc);
    //     }
    //     else {
    //         g = 255;
    //         r = Math.round(510 - 5.10 * perc);
    //     }
    //     var h = r * 0x10000 + g * 0x100 + b * 0x1;
    //     return '#' + ('000000' + h.toString(16)).slice(-6);
    // }
    

    return (
        <Link to={`/repository/${id}`} className='repo-title' >
        
        <div className="card animate" id={showHeaders? "card-headers-on" : "card-headers-off" }>

            <div id={stat==null ? '' : getColour(stat, avgStat)}>
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
                
                { request ==="pipelines" ?

                stat !== null ? 
                
                <img src={ stat ==="pipeline-pass" ? pipelinePass : stat ==="pipeline-fail" ? pipelineFail : noPipeline} className="pipeline-logo animate" alt="pipeline"/>
                
                :<span className="loader"></span> 
                
                :
                
                    stat !== null && !Number.isNaN(stat) ? 
                    <div className="animate">

                        {stat}    
                    </div>
                  : 
                  <span className="loader"></span> 
            } 
                
                </h2>
                <div href="/assets/icons-7b0fcccb8dc2c0d0883e05f97e4678621a71b996ab2d30bb42fafc906c1ee13f.svg#status_success"></div>
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