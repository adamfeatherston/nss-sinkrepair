//variable that stores application state in an empty array.
const applicationState = {
    requests: []
}

const API = "http://localhost:8088"
//function to get the service requests from API and change from json to javascript. 
export const fetchRequests = () => {
    return fetch(`${API}/requests`)
        .then(response => response.json())
        .then(
            (serviceRequests) => {
                // Store the external state in application state
                applicationState.requests = serviceRequests
            }
        )
}
//function to export requests from applicationState
export const getRequests = () => {
    return applicationState.requests.map(request => ({...request}))
}
//floowing function saves to permanent state ("POST")
export const sendRequest = (userServiceRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userServiceRequest)
    }

//dispatchs customEvent after POST operation (regenerates HTML in main.js)
    return fetch(`${API}/requests`, fetchOptions)
    .then(response => response.json())
    .then(() => {
        document.dispatchEvent(new CustomEvent("stateChanged"))
    })
}

//function to POST plumbers to application state and return the response. Similar function to sendRequest
export const saveCompletion = (userCompletedRequest) => {
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userCompletedRequest)
    }


    return fetch(`${API}/completions`, fetchOptions)
    .then(response => response.json())
    .then(() => {
        document.dispatchEvent(new CustomEvent("stateChanged"))
    })
}

//function to get the service completions from API
export const fetchCompletions = () => {
    return fetch(`${API}/completions`)
        .then(response => response.json())
        .then(
            (data) => {
                applicationState.plumbers = data
            }
        )
}
//function that allows user to delete service requests (DELETE)
export const deleteRequest = (id) => {
    return fetch(`${API}/requests/${id}`, { method: "DELETE" })
        .then(
            () => {
                document.dispatchEvent(new CustomEvent("stateChanged"))
            }
        )
}
//function to get the plumbers from API
export const fetchPlumbers = () => {
    return fetch(`${API}/plumbers`)
        .then(response => response.json())
        .then(
            (data) => {
                applicationState.plumbers = data
            }
        )
}
export const getPlumbers = () => {
    return applicationState.plumbers.map(plumber => ({...plumber}))
}