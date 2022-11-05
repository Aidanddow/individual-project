
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


let RepositoryPanel = ({id}) => {

    let [repoName, setRepoName] = useState([])
    let [commits, setCommits] = useState([])
    let [startDate, setStartDate] = useState([])
   
    useEffect(() => {
        let pid
        if (!id) 
            pid = 2413;
        else
            pid = id;
        console.log("ID: " + pid)
        
        getRepoName(id)
        getRepoCommits(id)
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

    
    let getCommitPages = async (id) => {
        let page = 1
        while (true) { 
            let response = await fetchData(id, `repository/commits?page=${page}&per_page=100`)
            console.log("I: " + page)
            
            let nextPage = await response.headers.get("x-next-page")
            if (!nextPage) return page-1
            page ++
        }
    }

    let getPageCommits = async (id, page) => {
        let response = await fetchData(id, `repository/commits?page=${page}&per_page=100`)
        let responseJSON = await response.json()
        let responseLength = await responseJSON.length
        return responseLength
    }

    let getRepoCommits = async (id) => {
        let fullPages = await getCommitPages(id)
        let lastPageCommits = await getPageCommits(id, fullPages+1)
        let commits = (fullPages * 100) + lastPageCommits

        console.log("Full Pages: " + fullPages)
        console.log("commits on last page: " + lastPageCommits)
        setCommits(commits)
    }

    let dateInRange = (data) => {
        let earliest = new Date("2022-01-01")
        console.log("Date start: " + earliest)
        
        let commit, d1
        

        let num = data.filter((commit) => {
            try {
                d1 = new Date(commit.created_at)
                return (d1 >= earliest)
            } catch {
                return false
            }
            
        }).length
        console.log("NUM " + num);
        
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
                <h2 className="commits">{commits}</h2>
            </div>
            
            
        </div>
    )
}

export default RepositoryPanel