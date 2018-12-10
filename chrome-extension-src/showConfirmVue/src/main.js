import Vue from 'vue'
import Lazy from 'vue-lazyload'
import 'muse-ui/lib/styles/base.less'
import {
  Dialog,
  Button,
  Checkbox
} from 'muse-ui'
import 'muse-ui/lib/styles/theme.less'

import Confirm from './Confirm.vue'
import loadError from './load-error.png'

const components = [
  Dialog,
  Button,
  Checkbox
]

components.forEach(component => Vue.use(component))
Vue.use(Lazy, {
  error: loadError
})
function getElement() {
  let el = document.querySelector('#read-app')
  if (el) {
    return el
  }
  el = document.createElement('div')
  el.id = 'read-app'
  document.body.append(el)
  return el
}
Vue.config.productionTip = false
let instance = new Vue({
  el: getElement(),
  render: h => h(Confirm)
}).$children[0]

/**
 * 
 * @param {ReadRecordHistoryItem} history
 */
export default function showConfirm(history) {
  return instance.confirm(history)
}
window.showConfirm = showConfirm
