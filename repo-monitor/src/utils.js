
// Variable to set gitlab instance
const GITLAB_INSTANCE = "stgit.dcs.gla.ac.uk"

// Get the url for a request
export const getUrl = (id, request, section="projects") => {
    return `https://${GITLAB_INSTANCE}/api/v4//${section}/${id}/${request}`
}

// Get the url to search in a section
export const fetchSearch = async (section, search) => {
    let requestUrl = `https://${GITLAB_INSTANCE}/api/v4//${section}?search=${search}&per_page=100`
    return fetchUrl(requestUrl)
}

// Fetch the response from request
export const fetchData = async (id, request, section="projects") => {
    let requestUrl = getUrl(id, request, section)
    return fetchUrl(requestUrl)
}

// Fetch response from request, then convert to JSON
export const getJsonData = async (id, request, section="projects") => {
    let response = await fetchData(id, request, section)
    let data = await response.json()
    return data
}

// Fetch response from request url
export const fetchUrl = async (requestUrl) => {
    let token = localStorage.getItem("pat")

    let response = await fetch(requestUrl, {
        headers: {
            "PRIVATE-TOKEN": token

        }
    })
    return response
}

export const getDaysSinceCommit = (timeStr) => {
    const date = new Date(timeStr)
    const today = new Date()
    const oneDay = 1000 * 60 * 60 * 24;

    const delta = today.getTime() - date.getTime()
    const diffInDays = Math.round(delta / oneDay);
    return diffInDays
}