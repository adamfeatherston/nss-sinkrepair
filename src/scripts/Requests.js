import { getRequests } from "./dataAccess.js"
import { deleteRequest } from "./dataAccess.js"
import { getPlumbers } from "./dataAccess.js"
import { saveCompletion } from "./dataAccess.js"
//function to convert each service request to HTML and iterate to display each request along with who serviced the request.

//broken into 2 parts/2 functions
//function to generate HTML before the user interacts.
//  1. will have the description and id# of the request
//  2.  will have a dropdown menu of the available plumbers.
//      a. iterate thru all plumbers to have them displayed.
//  3. will have a delete button so user can delete requests
const convertRequestToListElement = (request) => {
    const plumbers = getPlumbers()
    let html = `<li>
    Service request #${request.id}: ${request.description}
    <div class="field">
    <label class="label" for="dateServiced">Date this job was completed</label>
    <input type="date" name="dateServiced" class="input" />
    </div>
    <select class="plumbers" id="plumbers">
    <option value="">Choose Technician</option>
    ${plumbers.map(
        plumber => {
            return `<option value="${request.id}--${plumber.id}">${plumber.name}</option>`
        }
    ).join("")}
        </select>
        <button class="request__delete"
        id="request--${request.id}">
        Delete
        </button>
        </li>`
    return html
}
//function to generate HTML after the user interacts.
//  1. will have the description and id# of the request
//  2.  dropdown menu will not be regenerated following, instead will display when job was completed.
//      a. iterate thru completions to list date user completed the request.
//  3. will have a delete button so user can delete requests
const completedListElement = (request) => {
    let html =
        `<li>
        Service request #${request.id}: ${request.description}
        <div class="field">
        <label class="label" for="dateServiced">Job completed on 
        ${completions.map(
            completion => {
                return `<option value="${request.id}--${completion.id}">${completion.date_created}</option>`
            }
        ).join("")
        }</label>
        </select>
        <button class="request__delete"
        id="request--${request.id}">
        Delete
        </button>
        </li>`
    return html

}
//function to display HTML of the changes the user made.
//afterEvent HTML is displayed if request is completed. 
// beforeEvent HTML is displayed if request is not completed.
export const Requests = () => {
    const requests = getRequests()
    const completions = saveCompletion()

    return `
        <article class ="requests">
    ${
        requests.map(request => {
       const completedRequest = completions.find(completion => {
            return request.id === completion.requestId
        })

        if (completedRequest) {
           return completedListElement(request)
        
        }
        else {
            //if user has chosen a technician, function that returns HTML without technician menu and states date job was completed.
           return convertRequestToListElement(request)
        }
        }).join("")
        }
        </article>` 
    }




const mainContainer = document.querySelector("#container")
//function that "listens" for a user to click on "delete" button and invoke the DELETE function
mainContainer.addEventListener("click", click => {
    if (click.target.id.startsWith("request--")) {
        const [, requestId] = click.target.id.split("--")
        deleteRequest(parseInt(requestId))
    }
})
//change eventListener function to identify which plumber who serviced a request.
mainContainer.addEventListener(
    "change",
    (event) => {
        if (event.target.id === "plumbers") {
            const [requestId, plumberId] = event.target.value.split("--")
            const userDateServiced = document.querySelector("input[name='dateServiced']").value
                        /*
                This object should have 3 properties
                   1. requestId
                   2. plumberId
                   3. date_created
            */
            const completion = {
                requestId: requestId,
                plumberId: plumberId,
                date_created: userDateServiced
            }

            /*
                Invoke the function that performs the POST request
                to the `completions` resource for your API. Send the
                completion object as a parameter.
             */
            saveCompletion(completion)
        }
    }
)