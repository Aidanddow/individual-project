
import { Link } from "react-router-dom";

let Home = () => {
    return (
        <div>
            <h1 className="title">This is the Home Page!</h1>
            <Link to='/repository'>Repository</Link>
        </div>
    )
}

export default Home