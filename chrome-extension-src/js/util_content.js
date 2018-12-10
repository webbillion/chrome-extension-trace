import {
  sendMessage,
  setLocalStorage,
  getLocalStorage,
  getRecordByUrl,
  getFileSystem,
  dataUrlToFile,
  readFileAsDataURL,
  getCurrentUrl,
  setConfigByUrl
} from './util_common.js'
import {
  EVENT_TYPES
} from './event.js'
import {
  JUMPT_STATUS_KEY
} from './variable.js'
import showConfirm from '../showConfirmVue/dist/index.umd.js'
/**
 * 连接到后台，主要获取是否能运行的状态
 */
export function connectBackground(fn) {
  let port = chrome.runtime.connect({ name: 'read' })
  port.onMessage.addListener(fn)

  return port
}
// TODO: 暂时认为所有网页共享一个跳转状态
export function getJumpStatus() {
  return getLocalStorage(JUMPT_STATUS_KEY)
}

/**
 * 
 * @param {boolean} status
 */
export function changeJumpStatus(status) {
  return setLocalStorage({
    [JUMPT_STATUS_KEY]: status
  })
}
/**
 * 获取目标元素
 * @param {string|HTMLElement} target 目标，可能是字符串，也可能是html元素
 */
export function getTarget (target) {
  if (typeof target === 'string') {
    // 根据字符串的值查找元素    
    return document.querySelector(target) || document.documentElement
  }
  // 根据元素生成字符串标识
  if (target === document) {
    return 'document'
  }
  // 优先取id
  if (target.id) {
    return `#${target.id}`
  }
  let tag = target.tagName.toLowerCase()
  // 其次取标签和类名
  if (target.className) {
    return `${tag}.${target.className.replace(/\s/, '.')}`
  }
  //  其次取属性
  let attributes = target.getAttributeNames()
  if (attributes.length) {
    attributes = attributes.map(attribute => `[${attribute}="${target.getAttribute(attribute)}"]`).join('')
    return `${tag}${attributes}`
  }
}
/**
 * 推送记录给后台
 * @param {ReadRecord} record
 */
export function pushRedord (record) {
  return sendMessage({
    event: EVENT_TYPES.content.PUSH_RECORD,
    ...record
  })
}
/**
 * 滚动到上次浏览记录
 */
export async function scrollToRecord() {
  let record = await getRecordByUrl(document.URL)
  let lastHistory = record.lastHistory
  let el = getTarget(lastHistory.scrollEl)
  el.scrollTop = lastHistory.scrollTop
  changeJumpStatus(false)
}
/**
 * 询问是否跳转
 */
export async function askJump() {
  let record = await getRecordByUrl(document.URL)
  if (record && record.lastHistory && !record.config.notAuto) {
    let screenShootSrc = await getImgSrc(record.lastHistory.screenShootPath)
    let notAuto
    window.screenShootSrc = screenShootSrc
    notAuto = await showConfirm({
      screenShootSrc,
      ...record.lastHistory
    }).catch((result) => notAuto = result)
    setConfigByUrl(document.URL, {
      notAuto
    })
    await changeJumpStatus(true)
    if (location.href === record.lastHistory.url) {
      return scrollToRecord()
    }
    location.href = record.lastHistory.url
  }
  
}
/**
 * 事件触发时，调用resolve，以实现异步效果
 */
let EVENT_RESOLVE = {
}
function createEventId(event) {
  return `${event}_id_${Math.random()}`
}
let port = connectBackground((res) => {
  EVENT_RESOLVE[res.eventId] && EVENT_RESOLVE[res.eventId](res.value)
})
export function shouldRun() {
  return new Promise(async (resolve) => {
    let eventId = createEventId(EVENT_TYPES.content.SHOULD_RUN)
    EVENT_RESOLVE[eventId] = resolve
    port.postMessage({
      event: EVENT_TYPES.content.SHOULD_RUN,
      eventId,
      url: await getCurrentUrl()
    })
  })
}
export function captureScreen() {
  return new Promise((resolve) => {
    let eventId = createEventId(EVENT_TYPES.content.CAPTURE_SCREEN)
    EVENT_RESOLVE[eventId] = resolve
    port.postMessage({
      event: EVENT_TYPES.content.CAPTURE_SCREEN,
      eventId
    })
  })
}
export async function saveDataUrl(dataUrl) {
  let filename = 'history-screen-shoot.png'
  let path = `/${filename}`
  return new Promise(async (resolve) => {
    let fs = await getFileSystem()
    let file = await dataUrlToFile(dataUrl, filename)
    // filename包含http://会无法成功
    fs.root.getFile(filename, {
      create: true
    }, (fileEntry) => {
      fileEntry.createWriter((fileWriter) => {
        fileWriter.onwriteend = () => {
          resolve(path)
        }
        fileWriter.write(file)
      })
    })
  })
  
}
export function getImgSrc(path) {
  return new Promise(async (resolve) => {
    let fs = await getFileSystem()
    fs.root.getFile(path, {
    }, (fileEntry) => {
      window.fileEntry = fileEntry
      if (!fileEntry.isFile) {
        resolve('')
      } else {
        fileEntry.file(async (file) => {
          resolve(await readFileAsDataURL(file))
        })
      }
      
    })
  })
}
