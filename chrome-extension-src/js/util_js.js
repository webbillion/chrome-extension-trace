/**
 * 将对象按键值华为数组
 * @param {*} obj 
 */
export function objToArr(obj) {
  return Object.keys(obj).map(key => obj[key])
}
/**
 * 像过滤数组那样过滤对象
 * @param {*} obj 
 * @param {*} filter 
 */
export function objFilter(obj, filter) {
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
export function debounce (fn, delay = 200) {
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
export function getPercent(num1, num2) {
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
export function dateFormat (date, fmt = 'YYYY-MM-DD HH:mm:ss') {
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