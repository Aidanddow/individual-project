
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


let RepositoryPanel = ({id, request}) => {

    let [repoName, setRepoName] = useState([])
    let [stat, setStat] = useState([])
    let [startDate, setStartDate] = useState([])
   
    useEffect(() => {
        getRepoName(id)
        getRepoStat(id, request)
        setStartDate("2022-05-01")

    }, [])

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

    let dateInRange = (data) => {
        let earliest = new Date("2022-01-01")
        let commit, d1
        

        let num = data.filter((commit) => {
            try {
                d1 = new Date(commit.created_at)
                return (d1 >= earliest)
            } catch {
                return false
            }
            
        }).length
  
        return [true, num]
    }

    let getRepoName = async (id) => {
        let data = await fetchData(id, "")
        let dataJson = await data.json()
        
        console.log("NAME: ", dataJson.name)
        setRepoName(dataJson.name)
    }

    return (
        <div className="card">
            <Link to={`/repository/${id}`}>
                <div className="card-header">
                <h6 className="title">{repoName}</h6>
                </div>
            </Link>
            <div className="card-body">
                <h2 className="commits">{stat}</h2>
            </div>
            
            
        </div>
    )
}

export default RepositoryPanel