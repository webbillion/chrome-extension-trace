import {
  getId,
  getRecordById
} from './util_common.js'
/**
 * 获取所有标签页
 * @memberof background
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
export function getAllTabs () {
  return new Promise((resolve,) => {
    chrome.tabs.query({}, (tabs) => {
      resolve(tabs)
    })
  })
}
/**
 * 该脚本是否该继续运行
 * @memberof background
 */
export async function allowRun(url) {
  let id = await getId(url)
  if (!id) {
    return false
  }
  let record = await getRecordById(id)
  let tabs = await getAllTabs()
  const urlsID = await Promise.all(tabs.map(async tab => await getId(tab.url)))
  return record
         && record.mode
         && urlsID.filter(urlId => id === urlId).length < 2
}
/**
 * 对当前网页截屏
 * @return {Promise<string>}
 */
export function captureScreen() {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((dataUrl) => resolve(dataUrl))
  })
}