

// export const getUrl = (id, request, section = "projects") => {
//     return `https://stgit.dcs.gla.ac.uk/api/v4//projects/${id}/${request}`
// }


export const getUrl = (id, request, section="projects") => {
    return `https://stgit.dcs.gla.ac.uk/api/v4//${section}/${id}/${request}`
}

export const fetchSearch = async (section, search) => {
    let requestUrl =  `https://stgit.dcs.gla.ac.uk/api/v4//${section}?search=${search}&per_page=100`
    return fetchUrl(requestUrl)
}

export const fetchData = async (id, request, section="projects") => {
    let requestUrl = getUrl(id, request, section)
    return fetchUrl(requestUrl)
}

export const getJsonData = async (id, request, section="projects") => {
    let response = await fetchData(id, request, section)
    let data = await response.json()
    return data
}

export const fetchUrl = async (requestUrl) => {
    let token = localStorage.getItem("pat")

    let response = await fetch(requestUrl, {
        headers: {
            "PRIVATE-TOKEN": token
            // "PRIVATE-TOKEN": "glpat-N7BrBvPV3CqT2Unn1-Zh"
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
    // daysAgo. setDate(date.getDate() - numOfDays)
    return diffInDays
}