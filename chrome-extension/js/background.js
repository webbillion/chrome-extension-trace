/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./chrome-extension-src/js/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./chrome-extension-src/js/background.js":
/*!***********************************************!*\
  !*** ./chrome-extension-src/js/background.js ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util_common.js */ "./chrome-extension-src/js/util_common.js");
/* harmony import */ var _variable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable.js */ "./chrome-extension-src/js/variable.js");
/* harmony import */ var _event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event */ "./chrome-extension-src/js/event.js");



async function init() {
  let records = await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getAllRecords"])()
  // TODO:可以移到初次获取数据时操作
  if (!records) {
    await _util_common_js__WEBPACK_IMPORTED_MODULE_0__["serializeStorageInstance"].setItemAsync(_variable_js__WEBPACK_IMPORTED_MODULE_1__["RECORDS_KEY"], {})
  }
}
init()
let connectHanlders = {}
let onMessageHandlers = {}
_event__WEBPACK_IMPORTED_MODULE_2__["backgroundHandlers"].forEach(backgroundHandler => {
  if (backgroundHandler.type !== 'connect') {
    onMessageHandlers[backgroundHandler.event] = backgroundHandler.handler
  }  else {
    connectHanlders[backgroundHandler.event] = backgroundHandler.handler
  }
})
Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["onMessage"])((request) => {
  onMessageHandlers[request.event] && onMessageHandlers[request.event](request)
})
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    connectHanlders[message.event] && connectHanlders[message.event](message, port)
  })
})

/***/ }),

/***/ "./chrome-extension-src/js/event.js":
/*!******************************************!*\
  !*** ./chrome-extension-src/js/event.js ***!
  \******************************************/
/*! exports provided: EVENT_TYPES, backgroundHandlers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EVENT_TYPES", function() { return EVENT_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backgroundHandlers", function() { return backgroundHandlers; });
/* harmony import */ var _util_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util_common.js */ "./chrome-extension-src/js/util_common.js");
/* harmony import */ var _util_background_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util_background.js */ "./chrome-extension-src/js/util_background.js");


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
const EVENT_TYPES = {
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
          value: await Object(_util_background_js__WEBPACK_IMPORTED_MODULE_1__["allowRun"])(e.url)
        })
      }
    },
    {
      event: EVENT_TYPES.content.PUSH_RECORD,
      /**
       * @param {ReadRecord} request
       */
      async handler(request) {
        if (!await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getId"])(request.url)) {
          console.log(request)
        }
        Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["saveRecord"])({
          id: await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getId"])(request.url),
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
          value: await Object(_util_background_js__WEBPACK_IMPORTED_MODULE_1__["captureScreen"])()
        })
      }
    }
  ]
}

const backgroundHandlers = handlers.background

/***/ }),

/***/ "./chrome-extension-src/js/util_background.js":
/*!****************************************************!*\
  !*** ./chrome-extension-src/js/util_background.js ***!
  \****************************************************/
/*! exports provided: getAllTabs, allowRun, captureScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllTabs", function() { return getAllTabs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "allowRun", function() { return allowRun; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureScreen", function() { return captureScreen; });
/* harmony import */ var _util_common_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util_common.js */ "./chrome-extension-src/js/util_common.js");

/**
 * 获取所有标签页
 * @memberof background
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
function getAllTabs () {
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
async function allowRun(url) {
  let id = await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getId"])(url)
  if (!id) {
    return false
  }
  let record = await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getRecordById"])(id)
  let tabs = await getAllTabs()
  const urlsID = await Promise.all(tabs.map(async tab => await Object(_util_common_js__WEBPACK_IMPORTED_MODULE_0__["getId"])(tab.url)))
  return record
         && record.mode
         && urlsID.filter(urlId => id === urlId).length < 2
}
/**
 * 对当前网页截屏
 * @return {Promise<string>}
 */
function captureScreen() {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((dataUrl) => resolve(dataUrl))
  })
}

/***/ }),

/***/ "./chrome-extension-src/js/util_common.js":
/*!************************************************!*\
  !*** ./chrome-extension-src/js/util_common.js ***!
  \************************************************/
/*! exports provided: getLocalStorage, setLocalStorage, removeLocalStorage, serializeStorageInstance, getAllRecordsStorageItem, getAllRecords, sendMessage, onMessage, getUrlBookPath, getUrlMode, getId, coverEventHandler, getSyncStorage, setSyncStorage, removeSyncStorage, getRecordById, getRecordByUrl, saveRecord, createRecord, setRecordMode, getActiveTabUrl, getCurrentUrl, getModeByUrl, getConfigByUrl, setConfigByUrl, getFileSystem, dataUrlToFile, readFileAsDataURL, getFaviconUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLocalStorage", function() { return getLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setLocalStorage", function() { return setLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeLocalStorage", function() { return removeLocalStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serializeStorageInstance", function() { return serializeStorageInstance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllRecordsStorageItem", function() { return getAllRecordsStorageItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllRecords", function() { return getAllRecords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendMessage", function() { return sendMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onMessage", function() { return onMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUrlBookPath", function() { return getUrlBookPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUrlMode", function() { return getUrlMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getId", function() { return getId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "coverEventHandler", function() { return coverEventHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSyncStorage", function() { return getSyncStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setSyncStorage", function() { return setSyncStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeSyncStorage", function() { return removeSyncStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRecordById", function() { return getRecordById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRecordByUrl", function() { return getRecordByUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveRecord", function() { return saveRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRecord", function() { return createRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setRecordMode", function() { return setRecordMode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getActiveTabUrl", function() { return getActiveTabUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentUrl", function() { return getCurrentUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getModeByUrl", function() { return getModeByUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConfigByUrl", function() { return getConfigByUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setConfigByUrl", function() { return setConfigByUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFileSystem", function() { return getFileSystem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataUrlToFile", function() { return dataUrlToFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readFileAsDataURL", function() { return readFileAsDataURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFaviconUrl", function() { return getFaviconUrl; });
/* harmony import */ var serialize_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serialize-storage */ "./node_modules/serialize-storage/dist/index.js");
/* harmony import */ var serialize_storage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(serialize_storage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _variable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./variable.js */ "./chrome-extension-src/js/variable.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util_js */ "./chrome-extension-src/js/util_js.js");




/**
 * 获取本地存储的数据
 * @param {string|string[]} key
 */
function getLocalStorage(key) {
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
function setLocalStorage(items) {
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
function removeLocalStorage(key) {
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
const serializeStorageInstance = new serialize_storage__WEBPACK_IMPORTED_MODULE_0___default.a(mockStorage)
window.serializeStorageInstance = serializeStorageInstance
/**
 * 获取所有记录
 */
async function getAllRecordsStorageItem() {
  return serializeStorageInstance.getItemAsync(_variable_js__WEBPACK_IMPORTED_MODULE_1__["RECORDS_KEY"])
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
async function getAllRecords(params = {}) {
  params = {
    ...paramConfig,
    ...params
  }
  let item = await serializeStorageInstance.getItemAsync(_variable_js__WEBPACK_IMPORTED_MODULE_1__["RECORDS_KEY"])
  let records = item && item.value
  if (records) {
    /**
     * @type {ReadRecord[]}
     */
    let recordsArr = Object(_util_js__WEBPACK_IMPORTED_MODULE_2__["objToArr"])(records)
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
function sendMessage(message) {
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
function onMessage(fn) {
  chrome.runtime.onMessage.addListener(fn)
}
/**
 * 获取电子书路径
 */
function getUrlBookPath(url) {
  url = url.split('?')[0]
  return url.replace(/\/[^/]*$/, '/')
}
/**
 * 获取URL模式
 * @param {string} url
 * @return {MODES}
 */
async function getUrlMode(url) {
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
async function getId(url, mode) {
  url = url.split('?')[0]
  if (mode === _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG) {
    return url
  }
  if (mode === _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].BOOK) {
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
function coverEventHandler(event, handler) {
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
function getSyncStorage(key) {
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
function setSyncStorage(items) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, () => {
      resolve()
    })
  })
}
function removeSyncStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve()
    })
  })
}

/**
 * @return {Promise<ReadRecord>}
 */
async function getRecordById(recordId) {
  let records = await getAllRecords()
  return (records || {})[recordId]
}
async function getRecordByUrl(url, mode) {
  let id = await getId(url, mode)
  return getRecordById(id)
}
/**
 * 存储记录
 * @param {ReadRecord} record
 */
async function saveRecord(record) {
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
async function createRecord(url, mode) {
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
async function setRecordMode(url, mode, originMode) {
  let record = await getRecordByUrl(url,  mode === _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG ? mode : (originMode || mode))
  // 如果是改变已有模式
  if (record) {
    // 当前为长网页且不再记住，所属电子书也不再可用
    if (originMode === _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG) {
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
function getActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({
      active: true
    }, result => resolve(result[0].url))
  })
}
/**
 * 获取当前的url
 */
function getCurrentUrl() {
  if (/http/.test(document.URL)) {
    return document.URL
  }
  return getActiveTabUrl()
  
}
async function getModeByUrl(url) {
  let record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG) || {}
  if (record.mode) {
    return record.mode
  }
  record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].BOOK) || {}
  return record.mode || ''
}
async function getConfigByUrl(url) {
  let record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG) || {}
  if (record.mode && record.config) {
    return record.config
  }
  record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].BOOK) || {}
  return record.config || {}
}
async function setConfigByUrl(url, config) {
  let record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].LONG)
  if (!record || !record.mode) {
    record = await getRecordByUrl(url, _variable_js__WEBPACK_IMPORTED_MODULE_1__["MODE"].BOOK) || {}
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
function getFileSystem() {
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
function dataUrlToFile(dataurl, filename) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  let file =new File([u8arr], filename, {type:mime})
  return file
}

function readFileAsDataURL(file) {
  return new Promise((resolve) => {
    var a = new FileReader()
    a.onload = function(e) {resolve(e.target.result);};
    a.readAsDataURL(file);
  })
}
/**
 * 获取网站icon地址
 */
function getFaviconUrl() {
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


/***/ }),

/***/ "./chrome-extension-src/js/util_js.js":
/*!********************************************!*\
  !*** ./chrome-extension-src/js/util_js.js ***!
  \********************************************/
/*! exports provided: objToArr, objFilter, debounce, getPercent, dateFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objToArr", function() { return objToArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "objFilter", function() { return objFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPercent", function() { return getPercent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateFormat", function() { return dateFormat; });
/**
 * 将对象按键值华为数组
 * @param {*} obj 
 */
function objToArr(obj) {
  return Object.keys(obj).map(key => obj[key])
}
/**
 * 像过滤数组那样过滤对象
 * @param {*} obj 
 * @param {*} filter 
 */
function objFilter(obj, filter) {
  for (let key in obj) {
    if (filter(obj[key])) {
      return obj[key]
    }
  }
}
/**
 * 去抖函数
 * @param {Function} fn 待执行函数
 * @param {Number} [delay] 延迟时间
 * @return {Function} 不断延迟的函数
 */
function debounce (fn, delay = 200) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn(...args)
    }, delay)
  }
}
/**
 * 获取百分比
 */
function getPercent(num1, num2) {
  let num = ((num1 / num2) * 100).toFixed(2)
  // 手动不超过100
  return `${num > 100 ? 100 : num}%`
}
/**
 * 日期格式化
 * @param {Date|String|Number} date 日期
 * @param {String} fmt 格式化字符串
 * @return {String} 格式化后的日期
 */
function dateFormat (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/***/ }),

/***/ "./chrome-extension-src/js/variable.js":
/*!*********************************************!*\
  !*** ./chrome-extension-src/js/variable.js ***!
  \*********************************************/
/*! exports provided: MODE, RECORDS_KEY, JUMPT_STATUS_KEY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MODE", function() { return MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RECORDS_KEY", function() { return RECORDS_KEY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JUMPT_STATUS_KEY", function() { return JUMPT_STATUS_KEY; });
/**
 * 模式
 */
const MODE = {
  /**
   * 长文本
   */
  LONG: 'LONG',
  /**
   * 电子书
   */
  BOOK: 'BOOK',
  /**
   * 二者皆有
   */
  ALL: 'ALL'
}
/**
 * 存储里记录的key值
 */
const RECORDS_KEY = 'RECORDS_KEY'
/**
 * 跳转状态
 */
const JUMPT_STATUS_KEY = 'JUMPT_STATUS_KEY'

/***/ }),

/***/ "./node_modules/serialize-storage/dist/index.js":
/*!******************************************************!*\
  !*** ./node_modules/serialize-storage/dist/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t():undefined}(this,function(){"use strict";function createCommonjsModule(e,t){return e(t={exports:{}},t.exports),t.exports}var runtime=createCommonjsModule(function(j){!function(e){var c,t=Object.prototype,u=t.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",n=r.asyncIterator||"@@asyncIterator",a=r.toStringTag||"@@toStringTag",i=e.regeneratorRuntime;if(i)j.exports=i;else{(i=e.regeneratorRuntime=j.exports).wrap=d;var y="suspendedStart",f="suspendedYield",h="executing",p="completed",v={},s={};s[o]=function(){return this};var l=Object.getPrototypeOf,m=l&&l(l(I([])));m&&m!==t&&u.call(m,o)&&(s=m);var g=S.prototype=_.prototype=Object.create(s);E.prototype=g.constructor=S,S.constructor=E,S[a]=E.displayName="GeneratorFunction",i.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===E||"GeneratorFunction"===(t.displayName||t.name))},i.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,S):(e.__proto__=S,a in e||(e[a]="GeneratorFunction")),e.prototype=Object.create(g),e},i.awrap=function(e){return{__await:e}},x(A.prototype),A.prototype[n]=function(){return this},i.AsyncIterator=A,i.async=function(e,t,r,n){var o=new A(d(e,t,r,n));return i.isGeneratorFunction(t)?o:o.next().then(function(e){return e.done?e.value:o.next()})},x(g),g[a]="Generator",g[o]=function(){return this},g.toString=function(){return"[object Generator]"},i.keys=function(r){var n=[];for(var e in r)n.push(e);return n.reverse(),function e(){for(;n.length;){var t=n.pop();if(t in r)return e.value=t,e.done=!1,e}return e.done=!0,e}},i.values=I,w.prototype={constructor:w,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=c,this.done=!1,this.delegate=null,this.method="next",this.arg=c,this.tryEntries.forEach(b),!e)for(var t in this)"t"===t.charAt(0)&&u.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=c)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var n=this;function e(e,t){return a.type="throw",a.arg=r,n.next=e,t&&(n.method="next",n.arg=c),!!t}for(var t=this.tryEntries.length-1;0<=t;--t){var o=this.tryEntries[t],a=o.completion;if("root"===o.tryLoc)return e("end");if(o.tryLoc<=this.prev){var i=u.call(o,"catchLoc"),s=u.call(o,"finallyLoc");if(i&&s){if(this.prev<o.catchLoc)return e(o.catchLoc,!0);if(this.prev<o.finallyLoc)return e(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return e(o.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return e(o.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;0<=r;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&u.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=e,a.arg=t,o?(this.method="next",this.next=o.finallyLoc,v):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),v},finish:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),b(r),v}},catch:function(e){for(var t=this.tryEntries.length-1;0<=t;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;b(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:I(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=c),v}}}function d(e,t,r,n){var a,i,s,c,o=t&&t.prototype instanceof _?t:_,u=Object.create(o.prototype),l=new w(n||[]);return u._invoke=(a=e,i=r,s=l,c=y,function(e,t){if(c===h)throw new Error("Generator is already running");if(c===p){if("throw"===e)throw t;return O()}for(s.method=e,s.arg=t;;){var r=s.delegate;if(r){var n=R(r,s);if(n){if(n===v)continue;return n}}if("next"===s.method)s.sent=s._sent=s.arg;else if("throw"===s.method){if(c===y)throw c=p,s.arg;s.dispatchException(s.arg)}else"return"===s.method&&s.abrupt("return",s.arg);c=h;var o=k(a,i,s);if("normal"===o.type){if(c=s.done?p:f,o.arg===v)continue;return{value:o.arg,done:s.done}}"throw"===o.type&&(c=p,s.method="throw",s.arg=o.arg)}}),u}function k(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}function _(){}function E(){}function S(){}function x(e){["next","throw","return"].forEach(function(t){e[t]=function(e){return this._invoke(t,e)}})}function A(c){var t;this._invoke=function(r,n){function e(){return new Promise(function(e,t){!function t(e,r,n,o){var a=k(c[e],c,r);if("throw"!==a.type){var i=a.arg,s=i.value;return s&&"object"==typeof s&&u.call(s,"__await")?Promise.resolve(s.__await).then(function(e){t("next",e,n,o)},function(e){t("throw",e,n,o)}):Promise.resolve(s).then(function(e){i.value=e,n(i)},function(e){return t("throw",e,n,o)})}o(a.arg)}(r,n,e,t)})}return t=t?t.then(e,e):e()}}function R(e,t){var r=e.iterator[t.method];if(r===c){if(t.delegate=null,"throw"===t.method){if(e.iterator.return&&(t.method="return",t.arg=c,R(e,t),"throw"===t.method))return v;t.method="throw",t.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var n=k(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,v;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=c),t.delegate=null,v):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,v)}function K(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function b(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function w(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(K,this),this.reset(!0)}function I(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(u.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=c,e.done=!0,e};return n.next=n}}return{next:O}}function O(){return{value:c,done:!0}}}(function(){return this||"object"==typeof self&&self}()||Function("return this")())}),g=function(){return this||"object"==typeof self&&self}()||Function("return this")(),hadRuntime=g.regeneratorRuntime&&0<=Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime"),oldRuntime=hadRuntime&&g.regeneratorRuntime;g.regeneratorRuntime=void 0;var runtimeModule=runtime;if(hadRuntime)g.regeneratorRuntime=oldRuntime;else try{delete g.regeneratorRuntime}catch(e){g.regeneratorRuntime=void 0}var regenerator=runtimeModule;function asyncGeneratorStep(e,t,r,n,o,a,i){try{var s=e[a](i),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function _asyncToGenerator(s){return function(){var e=this,i=arguments;return new Promise(function(t,r){var n=s.apply(e,i);function o(e){asyncGeneratorStep(n,t,r,o,a,"next",e)}function a(e){asyncGeneratorStep(n,t,r,o,a,"throw",e)}o(void 0)})}}var asyncToGenerator=_asyncToGenerator,_typeof_1=createCommonjsModule(function(t){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function n(e){return"function"==typeof Symbol&&"symbol"===r(Symbol.iterator)?t.exports=n=function(e){return r(e)}:t.exports=n=function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":r(e)},n(e)}t.exports=n});function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var classCallCheck=_classCallCheck;function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){return t&&_defineProperties(e.prototype,t),r&&_defineProperties(e,r),e}var createClass=_createClass;function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var defineProperty=_defineProperty;function jsonParse(t){try{var e=JSON.parse(t);return"object"===_typeof_1(e)?e:JSON.parse(e)}catch(e){return t}}function jsonStringify(t){try{return JSON.stringify(t)}catch(e){return t}}var StorageItem=function(){function o(e,t,r,n){classCallCheck(this,o),defineProperty(this,"value",""),defineProperty(this,"key",""),defineProperty(this,"storage",null),n?(this._value=t,Object.defineProperty(this,"value",{get:function(){return this._value},set:function(e){this._value=e,this.save()}})):this.value=t,this.key=r,this.storage=e}return createClass(o,[{key:"valueOf",value:function(){return this.value}},{key:"save",value:function(){return this.storage.setItem(this.key,this.value)}},{key:"remove",value:function(){return this.storage.removeItem(this.key)}},{key:"equal",value:function(e){return e===this.value}}]),o}();function createStorageData(e,t){return{value:e,config:t}}function getKyesInEval(e){return e.slice(1).map(function(e){return"['".concat(e,"']")}).join("")}function _testKey(e){return e&&"string"==typeof e&&/^([^.])+(\.([^.])+)*$/.test(e)}var ERROR_MESSAGES={INVALID_KEY:function(e){return"invalid key ".concat(e)},READ_ERROR:function(e){return'the key "'.concat(e,'" may has been deleted')}};function createError(e,t){throw new Error(t(e))}function errorWhenNotObject(e,t){"object"!==_typeof_1(t)&&createError(e,ERROR_MESSAGES.READ_ERROR)}var SerializeStorage=function(){function SerializeStorage(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};classCallCheck(this,SerializeStorage),defineProperty(this,"storage",null),defineProperty(this,"config",{autoSave:!1,keyPrefix:"serialize-storage-"}),this.storage=e,Object.assign(this.config,t)}return createClass(SerializeStorage,[{key:"testKey",value:function(e){_testKey(e)||createError(e,ERROR_MESSAGES.INVALID_KEY)}},{key:"generateCompleteKey",value:function(e){return"".concat(this.config.keyPrefix).concat(e)}},{key:"getItem",value:function getItem(key,autoSave){this.testKey(key);var completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],root=this.storage.getItem(rootKey);if(root){var result=jsonParse(root).value;if(1<keysArr.length){errorWhenNotObject(key,result);try{result=eval("result".concat(getKyesInEval(keysArr)))}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}}if(null!=result)return new StorageItem(this,result,key,autoSave||this.config.autoSave)}}},{key:"setItem",value:function setItem(key,val){this.testKey(key);var completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],root=this.storage.getItem(rootKey),result=val;if(1<keysArr.length){result=jsonParse(root).value,errorWhenNotObject(key,result);try{eval("result".concat(getKyesInEval(keysArr),"=val"))}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}}return this.storage.setItem(rootKey,jsonStringify(createStorageData(result)))}},{key:"removeItem",value:function removeItem(key){this.testKey(key);var completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],root=this.storage.getItem(rootKey),result=jsonParse(root).value;if(1<keysArr.length){var parent;errorWhenNotObject(key,result);try{parent=2<keysArr.length?eval("result".concat(getKyesInEval(keysArr.slice(0,-1)))):result}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}var lastKey=keysArr[keysArr.length-1];return Array.isArray(parent)?parent.splice(lastKey,1):delete parent[lastKey],this.setItem(rootKey.replace(this.config.keyPrefix,""),result)}return this.storage.removeItem(rootKey)}},{key:"getItemAsync",value:function(){var _getItemAsync=asyncToGenerator(regenerator.mark(function _callee(key,autoSave){var completeKey,keysArr,rootKey,root,result;return regenerator.wrap(function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:return this.testKey(key),completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],_context.next=6,this.storage.getItem(rootKey);case 6:if(root=_context.sent,root){_context.next=9;break}return _context.abrupt("return",void 0);case 9:if(result=jsonParse(root).value,1<keysArr.length){errorWhenNotObject(key,result);try{result=eval("result".concat(getKyesInEval(keysArr)))}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}}if(null==result)return _context.abrupt("return",void 0);_context.next=13;break;case 13:return _context.abrupt("return",new StorageItem(this,result,key,autoSave||this.config.autoSave));case 14:case"end":return _context.stop()}},_callee,this)}));function getItemAsync(e,t){return _getItemAsync.apply(this,arguments)}return getItemAsync}()},{key:"setItemAsync",value:function(){var _setItemAsync=asyncToGenerator(regenerator.mark(function _callee2(key,val){var completeKey,keysArr,rootKey,root,result;return regenerator.wrap(function _callee2$(_context2){for(;;)switch(_context2.prev=_context2.next){case 0:return this.testKey(key),completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],_context2.next=6,this.storage.getItem(rootKey);case 6:if(root=_context2.sent,result=val,1<keysArr.length){result=jsonParse(root).value,errorWhenNotObject(key,result);try{eval("result".concat(getKyesInEval(keysArr),"=val"))}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}}return _context2.abrupt("return",this.storage.setItem(rootKey,jsonStringify(createStorageData(result))));case 10:case"end":return _context2.stop()}},_callee2,this)}));function setItemAsync(e,t){return _setItemAsync.apply(this,arguments)}return setItemAsync}()},{key:"removeItemAsync",value:function(){var _removeItemAsync=asyncToGenerator(regenerator.mark(function _callee3(key){var completeKey,keysArr,rootKey,root,result,parent,lastKey;return regenerator.wrap(function _callee3$(_context3){for(;;)switch(_context3.prev=_context3.next){case 0:return this.testKey(key),completeKey=this.generateCompleteKey(key),keysArr=completeKey.split("."),rootKey=keysArr[0],_context3.next=6,this.storage.getItem(rootKey);case 6:if(root=_context3.sent,result=jsonParse(root).value,!(1<keysArr.length)){_context3.next=16;break}errorWhenNotObject(key,result);try{parent=2<keysArr.length?eval("result".concat(getKyesInEval(keysArr.slice(0,-1)))):result}catch(e){createError(key,ERROR_MESSAGES.READ_ERROR)}return lastKey=keysArr[keysArr.length-1],Array.isArray(parent)?parent.splice(lastKey,1):delete parent[lastKey],_context3.abrupt("return",this.setItem(rootKey.replace(this.config.keyPrefix,""),result));case 16:return _context3.abrupt("return",this.storage.removeItem(rootKey));case 17:case"end":return _context3.stop()}},_callee3,this)}));function removeItemAsync(e){return _removeItemAsync.apply(this,arguments)}return removeItemAsync}()}]),SerializeStorage}();return SerializeStorage});


/***/ })

/******/ });
//# sourceMappingURL=background.js.map