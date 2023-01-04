

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"

let RepositorySearch = () => {
    
    const navigate = useNavigate()

    let [id, setId] = useState([])
    
    let handleIdInputChange = (event) => {
        setId(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault()
        navigate(`/repository/${id}`)
    }

    return (
        <div className="enter-id">
            <form>
                <input onSubmit={handleSubmit}
                    className="input-dark"
                    onChange={handleIdInputChange }
                    value={id}
                    placeholder="Go to a Repository (ID)"
                    name="Repository ID"/>
            </form>
            
            <Link to={`/repository/${id}`} className="btn btn-primary gotorepo">Go</Link>
        </div>
            
    )
}

export default RepositorySearch