
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


let RepositoryPanel = ({id, request}) => {

    let [repoName, setRepoName] = useState([])
    let [stat, setStat] = useState([])
    
    useEffect(() => {
        getRepoName(id)
        getRepoStat(id, request)
    }, [request])

    let getUrl = (id, request) => {
        return `https://stgit.dcs.gla.ac.uk/api/v4//projects/${id}/${request}`
    }

    let fetchData = async (id, request) => {
        let requestUrl = getUrl(id, request)
        let response = await fetch(requestUrl, {
            headers: {
                "PRIVATE-TOKEN": "glpat-N7BrBvPV3CqT2Unn1-Zh"
            }
        })
        return response
    }

    
    let getFullPages = async (id, request) => {
        let page = 1
        while (true) { 
            let response = await fetchData(id, `${request}?page=${page}&per_page=100`)
            
            let nextPage = await response.headers.get("x-next-page")
            if (!nextPage) return page-1
            page ++
        }
    }

    let getPageEntries = async (id, request, page) => {
        let response = await fetchData(id, `${request}?page=${page}&per_page=100`)
        let responseJSON = await response.json()
        let responseLength = await responseJSON.length
        return responseLength
    }

    let getRepoStat = async (id, request) => {
        let fullPages = await getFullPages(id, request)
        let lastPageEntries = await getPageEntries(id, request, fullPages+1)
        let statistic = (fullPages * 100) + lastPageEntries

        console.log("Full Pages: " + fullPages)
        console.log("Entries on last page: " + lastPageEntries)
        setStat(statistic)
    }

    let getRepoName = async (id) => {
        let data = await fetchData(id, "")
        let dataJson = await data.json()
        
        console.log("NAME: ", dataJson.name)
        setRepoName(dataJson.name)
    }

    return (
        <div className="card">
            <Link to={`/repository/${id}`} className='repo-title'>
                <div className="card-header">
                <h6 className="repo-title">{!Number.isNaN(stat) ? repoName : "Not Found"}</h6>
                </div>
            </Link>
            <div className="card-body">
                <h2 className="commits">{!Number.isNaN(stat) ? stat : "-"}</h2>
            </div>

            <button className="btn btn-sm btn-outline-danger">Delete</button>
            
            
        </div>
    )
}

export default RepositoryPanel