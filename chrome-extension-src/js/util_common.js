import SerializeStorage from 'serialize-storage'

import {
  RECORDS_KEY,
  MODE
} from './variable.js'
import {
  objToArr
} from './util_js'
/**
 * 获取本地存储的数据
 * @param {string|string[]} key
 */
export function getLocalStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}
/**
 * 设置本地存储的数据
 * @param {object} items
 */
export function setLocalStorage(items) {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => {
      resolve(items)
    })
  })
}
/**
 * 设置本地存储的数据
 * @param {string} key
 */
export function removeLocalStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(key, () => {
      resolve(key)
    })
  })
}
/**
 * @type {import('serialize-storage').SomeStorage}
 */
const mockStorage = {
  getItem(key) {
    return getLocalStorage(key)
  },
  removeItem(key) {
    return removeLocalStorage(key)
  },
  setItem(key, val) {
    // !测试用
    this[key] = val
    return setLocalStorage({
      [key]: val
    })
  }
}
export const serializeStorageInstance = new SerializeStorage(mockStorage)
window.serializeStorageInstance = serializeStorageInstance
/**
 * 获取所有记录
 */
export async function getAllRecordsStorageItem() {
  return serializeStorageInstance.getItemAsync(RECORDS_KEY)
}
let paramConfig = {
  /**
   * 转换为数组
   */
  toArray: false,
  /**
   * 过滤函数
   */
  filter: () => true,
  /**
   * 排序函数
   */
  sort: (a, b) => {
    return new Date(b.lastHistory.date) - new Date(a.lastHistory.date)
  }
}
/**
 * @returns {{[x: string]: ReadRecord} | ReadRecord[]}
 */
export async function getAllRecords(params = {}) {
  params = {
    ...paramConfig,
    ...params
  }
  let item = await serializeStorageInstance.getItemAsync(RECORDS_KEY)
  let records = item && item.value
  if (records) {
    /**
     * @type {ReadRecord[]}
     */
    let recordsArr = objToArr(records)
    recordsArr = recordsArr.filter(params.filter)
    if (params.toArray) {
      recordsArr = recordsArr.sort(params.sort)
      records = recordsArr
    } else {
      records = {}
      recordsArr.forEach(record => records[record.id] = record)
    }
  }
  return records
}
/**
 * 向后台或前台发送数据
 * @param {{event: string}} message
 */
export function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      ...message
    }, (res) => {
      resolve(res)
    })
  })
}
/**
 * 监听消息
 * @param {*} fn
 */
export function onMessage(fn) {
  chrome.runtime.onMessage.addListener(fn)
}
/**
 * 获取电子书路径
 */
export function getUrlBookPath(url) {
  url = url.split('?')[0]
  return url.replace(/\/[^/]*$/, '/')
}
/**
 * 获取URL模式
 * @param {string} url
 * @return {MODES}
 */
export async function getUrlMode(url) {
  let records = await getAllRecords()
  // 首先全匹配
  if (records[url]) {
    if (records[url].modes.LONG) {
      return {
        LONG: true
      }
    }
    if (records[url].modes.BOOK) {
      return {
        BOOK: true
      }
    }
  }
  // 其次路径匹配
  if (records[getUrlBookPath(url)]) {
    return {
      BOOK: true
    }
  }
  return {}
}
/**
 * 根据url和模式获取ID
 * @param {string} url
 * @returns {string}
 */
export async function getId(url, mode) {
  url = url.split('?')[0]
  if (mode === MODE.LONG) {
    return url
  }
  if (mode === MODE.BOOK) {
    return getUrlBookPath(url)
  }
  // 如果没有传入，则需要去找
  let record = await getRecordById(url)
  if (record && record.mode) {
    return url
  }
  record = await getRecordById(getUrlBookPath(url))
  if (record && record.mode) {
    return getUrlBookPath(url)
  }
}
/**
 * 对事件处理函数进行包装
 * @param {string} event 事件名称
 * @param {function} handler 处理函数
 * @return {function}
 */
export function coverEventHandler(event, handler) {
  return (request, sender, sendResponse) => {
    if (request.event === event) {
      delete request.event
      handler(request, sender, sendResponse)
    }
  }
}
/**
 * 获取同步存储的数据
 * @param {string|string[]} key
 */
export function getSyncStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key])
    })
  })
}

/**
 * 设置同步存储的数据
 * @param {object} items
 */
export function setSyncStorage(items) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => {
      resolve()
    })
  })
}
export function removeSyncStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve()
    })
  })
}

/**
 * @return {Promise<ReadRecord>}
 */
export async function getRecordById(recordId) {
  let records = await getAllRecords()
  return (records || {})[recordId]
}
export async function getRecordByUrl(url, mode) {
  let id = await getId(url, mode)
  return getRecordById(id)
}
/**
 * 存储记录
 * @param {ReadRecord} record
 */
export async function saveRecord(record) {
  let recordsStorageItem = await getAllRecordsStorageItem()
  let records = recordsStorageItem.value
  /**
   * @type {ReadRecord}
   */
  let alreadyRecord = records[record.id]
  if (alreadyRecord) {
    // 暂时只存放一条，后续可能依次存放
    if (alreadyRecord.history.length === 10) {
      alreadyRecord.history.shift()
    }
    alreadyRecord.history.push(record.lastHistory)
  } else {
    alreadyRecord = {}
    records[record.id] = alreadyRecord
  }
  Object.assign(alreadyRecord, record)
  // await removeSyncStorage(RECORDS_KEY)
  return recordsStorageItem.save()
}
/**
 * 创建记录
 * @param {string} url
 * @param {MODE} mode
 */
export async function createRecord(url, mode) {
  /**
   * @type {ReadRecord}
   */
  let record = {
    id: await getId(url, mode),
    mode,
    scrollEl: 'document',
    history: [
    ],
    bookId: getUrlBookPath(url),
    lastHistory: {},
    config: {}
  }
  return saveRecord(record)
}
// /**
//  * 创建一个异步的resolve，以便调用者能够得到提示信息，并可以由调用者来决定是否进行下一步
//  * @param {string} message
//  * @param {function} next
//  */
// function createAsyncResolve(message, next) {
//   return {
//     message,
//     next
//   }
// }
/**
 * 设置record模式
 * @param {string} mode
 * @param {string} [originMode]
 */
export async function setRecordMode(url, mode, originMode) {
  let record = await getRecordByUrl(url,  mode === MODE.LONG ? mode : (originMode || mode))
  // 如果是改变已有模式
  if (record) {
    // 当前为长网页且不再记住，所属电子书也不再可用
    if (originMode === MODE.LONG) {
      record.mode = ''
      let bookRecord = await getRecordById(record.bookId)
      if (bookRecord) {
        bookRecord.mode = mode
        await saveRecord(bookRecord)
      }
    } else {
      record.mode = mode
    }
    return saveRecord(record)
  } else {
    return createRecord(url, mode)
  }
}
export function getActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({
      active: true
    }, result => resolve(result[0].url))
  })
}
/**
 * 获取当前的url
 */
export function getCurrentUrl() {
  if (/http/.test(document.URL)) {
    return document.URL
  }
  return getActiveTabUrl()
  
}
export async function getModeByUrl(url) {
  let record = await getRecordByUrl(url, MODE.LONG) || {}
  if (record.mode) {
    return record.mode
  }
  record = await getRecordByUrl(url, MODE.BOOK) || {}
  return record.mode || ''
}
export async function getConfigByUrl(url) {
  let record = await getRecordByUrl(url, MODE.LONG) || {}
  if (record.mode && record.config) {
    return record.config
  }
  record = await getRecordByUrl(url, MODE.BOOK) || {}
  return record.config || {}
}
export async function setConfigByUrl(url, config) {
  let record = await getRecordByUrl(url, MODE.LONG)
  if (!record || !record.mode) {
    record = await getRecordByUrl(url, MODE.BOOK) || {}
  }
  if (record.mode && record.config) {
    Object.assign(record.config, config)
    return saveRecord(record)
  }
}
/**
 * 获取文件系统
 * @returns {Promise<FileSystem>}
 */
export function getFileSystem() {
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem
  // 暂定就10mb吧，也用不着扩展
  return new Promise((resolve, reject) => {
    navigator.webkitPersistentStorage.requestQuota( 10 * 1024 * 1024, function(grantedBytes) {
      window.requestFileSystem(window.PERSISTENT, grantedBytes, (e) => resolve(e))
    }, function(e) {
      reject(e)
    });
    
  })
}
export function dataUrlToFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  let file =new File([u8arr], filename, {type:mime})
  return file
}

export function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    var a = new FileReader()
    a.onload = function(e) {resolve(e.target.result);};
    a.readAsDataURL(file);
  })
}
/**
 * 获取网站icon地址
 */
export function getFaviconUrl() {
  // 先查找是否有link元素
  let linkEl = document.querySelector('link[rel~=icon]')
  if (linkEl && linkEl.href ) {
    let href = linkEl.href
    if (/http/.test(href)) {
      return href
    }
    return `${location.origin}${href}`
  }
  return `${location.origin}/favicon.ico`
}
