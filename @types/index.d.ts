/**
 * 模式
 */
declare enum MODE {
  /**
   * 长网页模式
   */
  LONG = 'LONG',
  /**
   * 电子书模式
   */
  BOOK = 'BOOK'
}
/**
 * 模式
 */
declare interface MODES {
  [MODE.BOOK]: Boolean
  [MODE.LONG]: Boolean
}
/**
 * 记录的历史项
 */
declare interface ReadRecordHistoryItem {
  /**
   * 记录所在的url
   */
  url: string
  /**
   * 历史id
   */
  id: string|numnber
  /**
   * 滚动距离
   */
  scrollTop: number
  /**
   * 截屏路径
   */
  screenShootPath: string
  /**
   * 网页标题
   */
  title: string,
  /**
   * 阅读进度，百分比
   */
  percent: '',
  /**
   * 滚动元素标识
   */
  scrollEl: string,
  /**
   * 网站图标地址
   */
  faviconUrl: string,
  /**
   * 阅读日期
   * 为了兼容，形如2018/11/11 11:11:11
   */
  date: string
}
/**
 * 相关设置
 */
declare interface ReadRecordConfig {
  /**
   * 不进行自动跳转
   */
  notAuto: boolean
}
/**
 * 阅读记录
 * ID和mode组成唯一标识
 */
declare interface ReadRecord {
  /**
   * 记录id
   */
  id: string
  /**
   * 模式，为空时不可用
   */
  mode: MODE
  /**
   * 记录模式
   */
  modes: MODES,
  /**
   * 所属电子书的id，modes都为true时此属性才生效
   */
  bookId?: string
  /**
   * 所有历史记录，保留十条
   */
  history: ReadRecordHistoryItem[]
  /**
   * 上次历史记录
   */
  lastHistory: ReadRecordHistoryItem
  /**
   * 滚动元素标识
   */
  scrollEl: string,
  /**
   * 本条记录设置
   */
  config: ReadRecordConfig
}