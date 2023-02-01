// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// renderer.js
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data.type === 'response') {
    const config = event.data.content
  }
})
window.postMessage('request')

