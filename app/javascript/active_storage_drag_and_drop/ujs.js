import { UploadQueueProcessor } from "./upload_queue_processor"
import { UploaderInput } from "./uploader_input"

let started = false

function didSubmitForm(event) {
  handleFormSubmissionEvent(event)
}

function didSubmitRemoteElement(event) {
  if (event.target.tagName == "FORM") {
    handleFormSubmissionEvent(event)
  }
}

function handleFormSubmissionEvent(event) {
  const form = event.target
  const next_upload = new UploadQueueProcessor(form)
  // if the upload processor has no dnd file inputs, then we let the event happen naturally
  // if it DOES have dnd file inputs, then we have to process our queue first and then submit the form
  if( next_upload.current_uploaders.length > 0) {
    event.preventDefault()
    // inputs.forEach(disable)
    next_upload.start(error => {
      if (error) {
        // inputs.forEach(enable)
      } else {
        // The original ActiveStorage DirectUpload system did this action using
        // input.click(), but doing that either makes the form submission event
        // happen multiple times, or the browser seems to block the input.click()
        // event completely, because it's not a trusted 'as a result of a mouse
        // click' event.
        form.submit()
      }
    })
  }
}

function initializeDragAndDropUploader() {
  document.querySelectorAll('input[type=file][data-dnd=true]').forEach(input => {
    new UploaderInput(input)
  })
}

export function start() {
  if (!started) {
    started = true
    document.addEventListener("submit", didSubmitForm)
    document.addEventListener("ajax:before", didSubmitRemoteElement)
    addEventListener("turbolinks:load", initializeDragAndDropUploader)
    addEventListener("load", initializeDragAndDropUploader)
  }
}