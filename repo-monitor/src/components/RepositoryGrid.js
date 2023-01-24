
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";


let RepositoryGrid = ({metric, repoIds, period, showHeaders}) => {

    let [repos, setRepos] = useState([])
    let [stats, setStats] = useState([])

    useEffect(() => {
        console.log("REPO IDS: ", repoIds)
        // let repoDict = []
        // repoIds.forEach(repoId => repoDict.push({id:repoId, name: null, stat: null}))
        
        setRepos(repoIds)
    }, [])

    useEffect(() => {
        console.log("TOTAL IS: ", stats.reduce((partialSum, a) => partialSum + a, 0))

    }, [stats, setStats])

    let sortReposAsc = async () => {
        console.log("REPOS BEFORE: ", repos)
        let sortedRepos = [...repos]
            .map((id, index) => [id, stats[index]] )
            .sort( (a, b) => a[1] > b[1] )

        // console.log("REPOS SORTED: ", sortedRepos)
        setStats( (stats) => sortedRepos.map(a => a[1]))
        setRepos( (repos) => sortedRepos.map(a => a[0]))
        console.log("REPOS AFTER: ", sortedRepos.map(a => a[0]))
    }


    let sortReposDesc = async () => {
        console.log("REPOS BEFORE: ", repos)
        let sortedRepos = [...repos]
            .map((id, index) => [id, stats[index]] )
            .sort( (a, b) => a[1] < b[1] )

        // console.log("REPOS SORTED: ", sortedRepos)
        setStats( (stats) => sortedRepos.map(a => a[1]))
        setRepos( (repos) => sortedRepos.map(a => a[0]))
        console.log("REPOS AFTER: ", repos)
    }

    return (
        <div className="repo-grid">
            <button className="btn btn-outline-primary" onClick={sortReposAsc}>Click Me Ascend</button>
            <button className="btn btn-outline-primary" onClick={sortReposDesc}>Click Me Reverse</button>
            <button className="btn btn-outline-primary" onClick={()=> {console.log(stats)}}>Show Stats</button>
            <div className={showHeaders? "cards-headers" : "cards-no-headers"}>
                {repos.map((repo, index) => (
                    <div key={`repository${index}`}>
                        
                        <RepositoryPanel 
                            id={repo} 
                            index={index} 
                            request={metric.endpoint} 
                            period={period} 
                            showHeaders={showHeaders} 
                            stats={stats} 
                            setStats={setStats}
                        />
                    
                    </div>
                ))}       
            </div>

        </div>
    )
}


export default RepositoryGrid