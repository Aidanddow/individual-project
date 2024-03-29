
import { useState } from "react"
import rightArrow from '../static/arrow.png'

let SetToken = () => {

    let [token, setToken] = useState("")

    let [validating, setValidating] = useState(false)

    let [validated, setValidated] = useState(false)
    let [error, setError] = useState(false)

    let validateToken = async (token) => {
        
        if (!token) {
            return false
        }

        let url = `https://stgit.dcs.gla.ac.uk/api/v4//projects?per_page=1`
        
        let response = await fetch(url, {
            headers: {
                "PRIVATE-TOKEN": token
            }
        })

        if (response.status === 401) {
            setError(true)
            return false
        }
        return true
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        handleSubmittedToken(token)
    }

    let handleSubmittedToken = async (token) => {
        setError(false)
        setValidating(true)

        let authenticated = await validateToken(token)
        
        setValidated(authenticated)
        if (authenticated) {
            localStorage.setItem("pat", token)
        } else {
            setValidated(false)   
        }
        setValidating(false)
    }

    let handleInputChange = (event) => {
        setToken(event.target.value)
    }

    const handleKeyDown = async event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleSubmittedToken(token)
        }
    }

    return (

        <div className="container-fluid">

            <div className="settoken">

                <h2>Enter your GitLab Personal Access Token</h2>

                <div className="enter-id">
                <form>
                    <input className="repository-search token-input"
                        onSubmit={handleSubmit}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={token}
                        placeholder="Enter Token"
                        data-testid="token-input"
                        name="Repository ID"/>
                </form>

                <button onClick={handleSubmit} className="gotorepo" data-testid="validate-token-btn">
                    {validating ? 
                        <span className="loader-small"></span>
                        : 
                        <img src={rightArrow} className="search-logo" alt="Go"></img>
                    }
                </button>
                </div> 
            
                <div className={error ? "error" : "hidden"}  data-testid="token-error-text">
                    Invalid Token
                </div>

                {validated === true ? 
                    <div className="validated-text">
                        Validated
                    </div> 
                    
                    : <></>
                }
            
                <ol className="token-instructions">
                    <li>
                        Go to https://stgit.dcs.gla.ac.uk
                    </li>

                    <li>
                        Click on your profile in the top right, then navigate to Preferences
                    </li>
                    <li>
                        In the left sidebar choose "Access Tokens"
                    </li>
                    <li>
                        Enter a name and expiration date for your token
                    </li>
                    <li>
                        Grant access to "api", "read_api", "read_user", "read_repository" and "read_registry"
                    </li>
                    <li>
                        Click "Create Personal Access Token", and paste the token here.
                    </li>
                    
                    {/* <li>
                        glpat-N7BrBvPV3CqT2Unn1-Zh
                    </li> */}
                </ol>

            </div>
        </div>

    );
};

export default SetToken