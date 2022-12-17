
import { useState } from "react"

let SetTokenModal = () => {

    let [token, setToken] = useState("")
    let [submitted, setSubmitted] = useState(false)
    let [validated, setValidated] = useState(false)
    let [error, setError] = useState("")

    let validateToken = async (token) => {
        let url = `https://stgit.dcs.gla.ac.uk/api/v4//projects?per_page=1`
        
        let response = await fetch(url, {
            headers: {
                // "PRIVATE-TOKEN": localStorage.getItem("pat")
                "PRIVATE-TOKEN": token
            }
        })

        if (response.status === 401) {
            setError("Invalid Token!")
            return false
        }
        return true
    }

    let handleSubmit = async (event) => {
        event.preventDefault();
        setError("")
        setSubmitted(true)
        console.log("Validating")
        let authenticated = await validateToken(token)
        
        setValidated(authenticated)
        if (authenticated) {
            localStorage.setItem("pat", token)
        } else {
            setValidated(false)
            setSubmitted(false)
        }

    }

    let handleInputChange = (event) => {
        setToken(event.target.value)
    }

    return (
        <div className="container-fluid">
            <h2>Enter your GitLab Personal Access Token</h2>
        
            <div className="error">
                {error}
            </div>
            
            <div className="enter-id">
            <form>
                <input onSubmit={handleSubmit}
                    onChange={handleInputChange }
                    value={token}
                    placeholder="Enter Token"
                    name="Repository ID"/>
            </form>

            <button onClick={handleSubmit} className="btn btn-primary gotorepo">Store</button>
            </div> 
           
            {submitted ? <>{validated==true ? 
            <div className="validated-text">
                Validated
            </div> : <></>}</> : <></>}
           
        

            <ol>
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


                <li>
                    glpat-N7BrBvPV3CqT2Unn1-Zh
                </li>
            </ol>

        </div>
    );
};

export default SetTokenModal