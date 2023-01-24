
import { useEffect, useState } from "react"
import RepositoryPanel from "./RepositoryPanel";


let RepositoryGrid = ({metric, repos, period, showHeaders, stats, setStats, setRepos}) => {

    // let [repos, setRepos] = useState([])
    // let [stats, setStats] = useState([])

    useEffect(() => {
        console.log("REPO IDS: ", repos)
        // setRepos(repos)
    }, [])

    

    return (
        <div className="repo-grid">
            
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