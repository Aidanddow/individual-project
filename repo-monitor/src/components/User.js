
import { useEffect, useState } from "react"
import { fetchUrl } from "../utils.js"
import noUserIcon from "../static/user.png"

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

            {!user.message ?
            <img src={user.avatar_url} className="profile-picture" alt=""/>
            :
            // <img src={noUserIcon} className="profile-picture" />
            <></>
        }
        </div>
    )
}

export default User