import {
  onMessage,
  getAllRecords,
  serializeStorageInstance
} from './util_common.js'
import {
  RECORDS_KEY
} from './variable.js'
import { backgroundHandlers } from './event'
async function init() {
  let records = await getAllRecords()
  // TODO:可以移到初次获取数据时操作
  if (!records) {
    await serializeStorageInstance.setItemAsync(RECORDS_KEY, {})
  }
}
init()
let connectHanlders = {}
let onMessageHandlers = {}
backgroundHandlers.forEach(backgroundHandler => {
  if (backgroundHandler.type !== 'connect') {
    onMessageHandlers[backgroundHandler.event] = backgroundHandler.handler
  }  else {
    connectHanlders[backgroundHandler.event] = backgroundHandler.handler
  }
})
onMessage((request) => {
  onMessageHandlers[request.event] && onMessageHandlers[request.event](request)
})
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    connectHanlders[message.event] && connectHanlders[message.event](message, port)
  })
})