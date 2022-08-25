import { fetchRequests } from "./dataAccess.js"
import { SinkRepair } from "./SinkRepair.js"
import { fetchPlumbers } from "./dataAccess.js"
//this page fetches data from API and stores in application state before converting to HTML.
const mainContainer = document.querySelector("#container")

const render = () => {
    fetchRequests()
        .then(() => fetchPlumbers())
        .then(
            () => {
                mainContainer.innerHTML = SinkRepair()
            }
        )
}

render()

//renders regenerated HTML when event has happened that changes the state.
document.addEventListener(
    "stateChanged",
    customEvent => {
        render()
    }
)