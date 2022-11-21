
import { useState } from "react"
import { Link } from "react-router-dom";

let RepositoryList = () => {

    let [repos, setRepos] = useState([])
    let [searchTerm, setSearchTerm] = useState("")

    let getUrl = (search) => {
        return `https://stgit.dcs.gla.ac.uk/api/v4//projects?search=${search}`
    }

    let fetchData = async (search) => {
        let requestUrl = getUrl(search)
        let response = await fetch(requestUrl, {
            headers: {
                "PRIVATE-TOKEN": "glpat-N7BrBvPV3CqT2Unn1-Zh"
            }
        })
        return response
    }

    let searchRepos = async () => {
        let response = await fetchData(searchTerm)
        let data
        data = await response.json()

        data.forEach(proj => {
            console.log("ID: " + proj.id)
            return proj.id
        })
           
        return data
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        let newRepos = await searchRepos(searchTerm)
        console.log("REPOS: " + newRepos)
        setRepos([...newRepos])
        
        
        console.log("REPOS: " + repos)
    }

    let handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    return (
        <div className="homepage">
            <h2>Enter Search Term</h2>

            <div className="enter-id">
                    <form>
                        <input onSubmit={handleSubmit}
                            onChange={handleInputChange }
                            value={searchTerm}
                            placeholder="Search for Projects"
                            name="Repository ID"/>
                    </form>
                
                    <button onClick={handleSubmit} className="btn btn-primary gotorepo">Search</button>
                </div>


            <ul>
                
                {repos.map((repo, index) => (
                            
                    <li key={`repository${index}`}>
                        <Link to={`/repository/${repo.id}`}>
                            {console.log("Repos: " + repo)}
                            {repo.name_with_namespace}
                        </Link> 
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RepositoryList