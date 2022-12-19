
import { useState } from "react"
import { Link } from "react-router-dom";
import { fetchSearch, fetchData } from "../utils.js"

let RepositoryList = ( {gridRepos, setGridRepos} ) => {

    let [results, setResults] = useState([])
    let [searchSection, setSearchSection] = useState("projects")
    
    let [search, setSearch] = useState(1)

    let [sections, setSections] = useState(new Map([
        ["Groups", "groups"],
        ["Projects", "projects"],
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
        let newRepos = await searchRepos(searchTerm)
        console.log("REPOS: " + newRepos)
        setResults([...newRepos]) 
        
        console.log("REPOS: " + results)
    }

    let handleInputChange = (event) => {
        setSearchTerm(event.target.value)
    }

    let addToGrid = async (event, id) => {
        if (searchSection == "projects") {
            setGridRepos([...gridRepos, id])
            return
        }
        
        let response = await fetchData(id, "projects", "groups")

        let groupProjects = await response.json()

        setGridRepos([...gridRepos, ...groupProjects.map( project => project.id.toString() )])
    }

    let addAll = () => {
        console.log("IDDSSSSSS: ", results)
        
        setGridRepos([...gridRepos, ...results.map(result => result.id.toString())])
    }

    const handleKeyDown = async event => {
        if (event.key === 'Enter') {
          event.preventDefault();

          console.log('User pressed Enter ✅');
          console.log("SEARCH FOR: ", searchTerm)
          let newRepos = await searchRepos(searchTerm)
          setResults([...newRepos])
        }
      };

    return (
        <div>
            <h2>Search</h2>


            {[...sections.keys()].map((name) => (
                <button onClick={() => {setSearchSection(sections.get(name)) }} 
                className={`btn btn-outline-primary 
                    ${searchSection===sections.get(name) && "active"}`}>
                        {name}
                </button>
            ))}

            <div className="enter-id">
                <form>
                    <input onSubmit={handleSubmit}
                        onChange={handleInputChange }
                        onKeyDown={handleKeyDown}
                        value={searchTerm}
                        placeholder={`Search for ${searchSection}`}
                        name="Repository ID"/>
                </form>
            
                <button onClick={handleSubmit} className="btn btn-primary gotorepo">Search</button>
            </div>


            <ul className="results-list">  
                {results.length != 0 && searchSection == "projects"?  

                <li>
                    <button onClick={addAll} className="btn btn-primary">Add All to Grid</button>
                </li>
                : <></>
                }
                
                {results.map((repo, index) => (
                 
                    <li className="search-result" key={`repository${index}`}>
                        
                            <Link to={`/repository/${repo.id}`}>
                               
                                    {/* {searchSection == "groups" ? <>Group:</> : <>Project:</>} */}
                                    {repo.name}    
                                
                            </Link> 
                            <button onClick={event => addToGrid(event, repo.id)} className="btn btn-outline-primary btn-sm" id="btn-add-to-grid">Add</button>
                        
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default RepositoryList