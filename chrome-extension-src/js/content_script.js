import {
  getCurrentUrl,
  getFaviconUrl
} from './util_common.js'
import {
  pushRedord,
  getTarget,
  getJumpStatus,
  askJump,
  scrollToRecord,
  captureScreen,
  shouldRun,
  saveDataUrl
} from './util_content.js'
import {
  debounce,
  getPercent,
  dateFormat
} from './util_js.js'
// 现在设计为，有存在相同网页则不进行记录和跳转
// function ready() {
//   return shouldRun()
// }
async function start() {
  let handlerScroll = debounce(async (e) => {
    let run = await shouldRun()
    if (!run) {
      return
    }
    let scrollEl = e.target.scrollTop ? e.target : document.documentElement
    let scrollTop = scrollEl.scrollTop
    let scrollHeight = e.target.scrollHeight || document.documentElement.scrollHeight
    pushRedord({
      url: await getCurrentUrl(),
      scrollEl: getTarget(e.target),
      lastHistory: {
        url: document.URL,
        screenShootPath: await saveDataUrl(await captureScreen()),
        scrollTop,
        scrollEl: getTarget(e.target),
        percent: getPercent(scrollTop + scrollEl.clientHeight, scrollHeight),
        title: document.title,
        date: dateFormat(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        faviconUrl: getFaviconUrl()
      }
    })
  })
  window.addEventListener('scroll', handlerScroll, true)
  if (!(await shouldRun())) {
    return
  }
  // 如果正在跳转中，即此页面是由contentscript跳转来的
  if (await getJumpStatus()) {
    await scrollToRecord()
  } else {
    // 否则询问
    await askJump()
  }
  
}
// 延时执行获取状态
setTimeout(start, 200)
