
import { useEffect, useState } from "react"
import userProfile from '../user.jpeg'
import { fetchUrl } from "../utils.js"

let User = () => {

    let [user, setUser] = useState({})

    useEffect(() => {

        let r = async () => {
            let response = await fetchUrl("https://stgit.dcs.gla.ac.uk/api/v4//user")
            let user = await response.json()
            setUser(user)
        }

        r()
    }, [])
    
    return (
        <div className="profile pic">

            {user ?
            <img src={user.avatar_url} className="profile-picture"/>
            :
            <></>
        }
        </div>
    )
}

export default User