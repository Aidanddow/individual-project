
import pipelinePass from '../static/pipeline-pass.png'
import pipelineFail from '../static/pipeline-fail.png'
import noPipeline from '../static/no-pipeline.png'

/*
 * Component to display the stat for a RepositoryPanel
 */
let RepositoryStat = ( {stat, request} ) => {
    return (
        <h3> 
        {
            request !== "pipelines" ?

                // Stat is a number (Not pipeline)
                stat !== null && !Number.isNaN(stat) ? 
                    
                    
                        <div className="statistic animate">{stat}</div>

                // Stat hasn't loaded display loading    
                : <span className="loader"></span> 
            
            :
                // Request is for pipelines, show pipeline image
                (stat !== null ? 
                    
                    // If the stat has loaded, display pipeline image based on state
                    <img src={ 
                          stat ==="pipeline-pass" ? pipelinePass 
                        : stat ==="pipeline-fail" ? pipelineFail 
                        : noPipeline
                    } className="pipeline-logo animate" alt="pipeline"/>
                    
                    
                // Stat hasn't loaded display loading
                : <span className="loader"></span> )
        } 
        </h3>
    )
}

export default RepositoryStat