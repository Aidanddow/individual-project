
import { useEffect, useState } from "react"
import { fetchData, getJsonData, getUrl, fetchUrl } from "../utils.js"

let Developer = ({ id }) => {

    let [developer, setDeveloper] = useState([])

    useEffect(() => {
        let a = async () => {
            const dev = await getJsonData(id, "", "users")
            setDeveloper(dev)
            console.log("DEV: ", dev)
        }
        a()
        
    }, [])

    return (
        <div className="container-fluid">
            <h1>Developer</h1>

            {developer}
        </div>
    )
}

export default Developer