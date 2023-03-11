
import { useState } from "react"
import { Link } from "react-router-dom";
import { fetchSearch, getJsonData } from "../utils.js"
import searchLogo from '../static/search.png'

let RepositorySearch = ( {gridRepos, setGridRepos} ) => {

    let [results, setResults] = useState([])
    let [searchSection, setSearchSection] = useState("projects")

    let [loadingResults, setLoadingResults] = useState(false)
    let [adding, setAdding] = useState(false)

    let [sections] = useState(new Map([
        ["Projects", "projects"],
        ["Groups", "groups"],
    ]))

    let [searchTerm, setSearchTerm] = useState("")

    let searchRepos = async () => {
        let response = await fetchSearch(searchSection, searchTerm)
        let data = await response.json()

        data.forEach(proj => {
            console.log("ID: " + proj.id)
            return proj.id
        })

        return data
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        setResults([])
        setLoadingResults(true)
        let newRepos = await searchRepos(searchTerm)
        console.log("REPOS: " + newRepos)
        setResults([...newRepos]) 
        setLoadingResults(false)
        
        console.log("REPOS: " + results)
    }

    let handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    let addToGrid = async (event, id) => {
        setAdding(true)
        if (searchSection ==="projects") {
            setGridRepos([...gridRepos, id])
            return
        }
        
        let groupProjects = await getJsonData(id, "projects?include_subgroups=true&per_page=100", "groups")
        setGridRepos([...gridRepos, ...groupProjects.map( project => project.id.toString() )])
        setAdding(false)
    }

    let addAll = () => {
        console.log("IDDSSSSSS: ", results)
        
        setGridRepos([...gridRepos, ...results.map(result => result.id.toString())])
    }

    const handleKeyDown = async event => {
        if (event.key ==='Enter') {
          event.preventDefault();
          setLoadingResults(true);
          setResults([])
          let newRepos = await searchRepos(searchTerm)
          setResults([...newRepos])
          setLoadingResults(false)
        }
    }

    return (
        <div className="container-fluid repository-search-list">

            <div className="row">
                
                {[...sections.keys()].map((name) => (
                    <div className="col">
                        <button onClick={() => {
                            setSearchSection(sections.get(name))
                            setResults([]) 
                        }} 
                        className={`metric-button
                            ${searchSection===sections.get(name) && "active"}`}>
                                {name}
                        </button>
                    </div>
                ))}

        </div>

            <div className="enter-id">
                <form>
                    <input className="repository-search"
                        onSubmit={handleSubmit}
                        onChange={handleInputChange }
                        onKeyDown={handleKeyDown}
                        value={searchTerm}
                        placeholder={`Search for ${searchSection}`}
                        name="Repository ID"/>
                </form>
            
                <button onClick={handleSubmit} className="gotorepo">
                    {loadingResults ? 
                        <span className="loader-small"></span> 
                        : 
                        <img src={searchLogo} className="search-logo" alt="Search"></img>}
                </button>
            </div>

            <div className="search-results">
                <table className="table table-hover results-table">  
                    
                    {results.length !== 0 && searchSection ==="projects"?  

                    <tr key="head" className="search-result search-summary">
                        <tc>{results.length !== 0 ? <>Showing: {results.length} results</> : <></>}</tc>
                        <tc><button onClick={addAll} className="btn btn-outline-primary">Add All</button></tc>
                    </tr>
                    : <></>
                    }
                    
                    {results.map((repo, index) => (
                    
                        <tr className="search-result" key={`repository${index}`}>
                            
                            <Link to={`/repository/${repo.id}`}>
                                <tc className="result-name">
                                    {repo.name}
                                </tc>
                            </Link> 
                            
                            <tc>
                                <button onClick={event => addToGrid(event, repo.id)} className="btn-add-to-grid">
                                    {searchSection==="groups" && adding? <span className="loader-small"></span> : <>+</>}
                                </button>
                            </tc>
                            
                        </tr>
                    ))}
                   
                </table>
            </div>
        </div>
    )
}

export default RepositorySearch