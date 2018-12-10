import {
  getId,
  saveRecord
} from './util_common.js'
import {
  allowRun,
  captureScreen
} from './util_background.js'
/**
 * 注意： 如果多个页面都监听 onMessage 事件，
 * 对于某一次事件只有第一次调用 sendResponse() 能成功发出回应
 * 所有其他回应将被忽略
 * 因此，最好只用content_script来发出事件
 * 有问题再一个个处理吧
 */
/**
 * 事件类型，以发出者为准
 */
export const EVENT_TYPES = {
  /**
   * 内容脚本发出的事件
   */
  content: {
    /**
     * 脚本询问，是否应该继续运行
     */
    SHOULD_RUN: 'SHOULD_RUN',
    /**
     * 推送记录
     */
    PUSH_RECORD: 'PUSH_RECORD',
    /**
     * 截屏
     */
    CAPTURE_SCREEN: 'CAPTURE_SCREEN'
  },
  /**
   * 后台脚本发出的事件
   */
  background: {
    /**
     * 脚本回复，是否允许运行,不是允许运行
     */
    ALLOW_RUN: 'ALLOW_RUN',
    /**
     * 发出当前截屏的dataurl
     */
    IMAGE_DATA_URL: 'IMAGE_DATA_URL'
  }
}

/**
 * 处理事件函数，在对应脚本页面依次注册
 * 后台脚本处理内容脚本发出的事件
 */
const handlers = {
  /**
   * 内容脚本
   */
  content: [
  ],
  /**
   * 后台脚本
   */
  background: [
    {
      type: 'connect',
      event: EVENT_TYPES.content.SHOULD_RUN,
      /**
       * 
       * @param {chrome.runtime.Port} port 
       */
      async handler(e, port) {
        port.postMessage({
          event: EVENT_TYPES.background.ALLOW_RUN,
          eventId: e.eventId,
          value: await allowRun(e.url)
        })
      }
    },
    {
      event: EVENT_TYPES.content.PUSH_RECORD,
      /**
       * @param {ReadRecord} request
       */
      async handler(request) {
        if (!await getId(request.url)) {
          console.log(request)
        }
        saveRecord({
          id: await getId(request.url),
          ...request
        })
      }
    },
    {
      type: 'connect',
      event: EVENT_TYPES.content.CAPTURE_SCREEN,
      async handler(e, port) {
        port.postMessage({
          event: EVENT_TYPES.background.IMAGE_DATA_URL,
          eventId: e.eventId,
          value: await captureScreen()
        })
      }
    }
  ]
}

export const backgroundHandlers = handlers.background