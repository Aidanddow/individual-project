
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { fetchData, getJsonData, getDaysSinceCommit } from "../utils.js"
import pipelinePass from '../pipeline-pass.png'
import pipelineFail from '../pipeline-fail.png'
import noPipeline from '../no-pipeline.png'



let RepositoryPanel = ({id, request, period, showHeaders}) => {

    let [repoName, setRepoName] = useState([])
    let [repoAuthor, setRepoAuthor] = useState([])
    let [stat, setStat] = useState("...")
    let [good, setGood] = useState(true)
    
    useEffect(() => {
        setStat("...")
        // console.log("PERIODDDDDDDD: " + period)
        getRepoName(id)
        // console.log("REQ: ", request)

        if (request == "pipelines") {
            getPipelineStat(id)
        } else if (request == "last-commit") {
            getLastCommit(id)
        } else {
            getRepoStat(id, request)
        }
        
        setGood(stat > 5)
    }, [request, period])

    let dateInRange = (d) => {
        let dateFilter = period
        return (d >= dateFilter)
    }

    let getLastCommit = async (id) => {

        let data = await getJsonData(id, "repository/commits")
        let statistic = getDaysSinceCommit(data[0].created_at)
        setStat(statistic + " days")
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
    
    let getPagesInRange = async (id, request) => {
        let page = 1
        
        while (true) { 
            let response = await fetchData(id, `${request}?page=${page}&per_page=20`)
            
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

    let getPageEntries2 = async (id, request, page) => {
        let response = await fetchData(id, `${request}?page=${page}&per_page=20`)
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

    let getPageEntries = async (id, request, page) => {
        let response = await fetchData(id, `${request}?page=${page}&per_page=100`)
        let responseJSON = await response.json()
        let responseLength = await responseJSON.length
        return responseLength
    }

    let getRepoStat = async (id, request) => {
        let pagesInRange = await getPagesInRange(id, request)
        let statistic, lastPageEntries
        
        if (pagesInRange == 0) {
            statistic = 0
            setStat(statistic)
        } else {
            lastPageEntries = await getPageEntries2(id, request, pagesInRange)
            statistic = ((pagesInRange-1) * 20) + lastPageEntries
            setStat(statistic)
        }

        // console.log("Full Pages: " + pagesInRange)
        // console.log("Entries on last page: " + lastPageEntries)
        setStat(statistic)
    }

    let getRepoName = async (id) => {
        let data = await fetchData(id, "")
        let dataJson = await data.json()
        
        console.log("NAME: ", dataJson.name)
        setRepoName(dataJson.name)
        setRepoAuthor(dataJson.namespace.name)
    }

    return (
        
        <div className="card" id={showHeaders? "card-headers-on" : "card-headers-off" }>
            {/* <div id={stat > 5? 'green' : 'red'}> */}
            
            {showHeaders ? 
            <Link to={`/repository/${id}`} className='repo-title'>
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
            </Link> : <></>
            }
            
            <div className="card-body">
                <h2 className="commits">
                
                { request === "pipelines" ?

                <img src={ stat == "pipeline-pass" ? pipelinePass : stat == "pipeline-fail" ? pipelineFail : noPipeline} className="pipeline-logo"/>
                
                :
                !Number.isNaN(stat) ? stat : "-"
            } 
                    
                
                </h2>
                <use href="/assets/icons-7b0fcccb8dc2c0d0883e05f97e4678621a71b996ab2d30bb42fafc906c1ee13f.svg#status_success"></use>
            </div>
{/* 
            <button className="btn btn-sm btn-outline-danger">Delete</button> */}
            
            {/* </div>     */}
        </div>
    )
}

export default RepositoryPanel