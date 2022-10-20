
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"

let Home = () => {
    const navigate = useNavigate();

    let [id, setId] = useState([])
    
    let handleIdInputChange = (event) => {
        setId(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        navigate(`/repository/${id}`);
    }

    return (
        <div className="homepage">
            <h1 className="title">Go to a repository</h1>
            
            <div className="enter-id">
                <form>
                    <input onSubmit={handleSubmit}
                        onChange={handleIdInputChange }
                        value={id}
                        placeholder="Enter Repository ID"
                        name="Repository ID"/>
                </form>
                
                <Link to={`/repository/${id}`} className="btn btn-primary gotorepo">Go</Link>
            </div>
        </div>
    )
}

export default Home