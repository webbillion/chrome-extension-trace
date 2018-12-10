import Vue from 'vue'
import 'muse-ui/lib/styles/base.less'
import {
  Button,
  Switch,
  ExpansionPanel,
  Icon,
  Progress,
  Checkbox
} from 'muse-ui'
import Helpers from 'muse-ui/lib/Helpers'
import 'muse-ui/lib/styles/theme.less'

import App from './App.vue'
import './styles/index.less'

const components = [
  Button,
  Switch,
  ExpansionPanel,
  Helpers,
  Icon,
  Progress,
  Checkbox
]

components.forEach(component => Vue.use(component))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
