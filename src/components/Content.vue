<template>
  <div class="content">
    <mu-icon
      v-show="showHelpContent"
      value="close"
      size="16"
      class="close-button"
      @click="showHelpContent = false">
    </mu-icon>
    <section
      v-show="showHelpContent"
      class="help">
      <h3>什么是阅读模式？</h3>
      <p><strong>长网页</strong>是将本网页视为独立的内容，单独保存阅读记录。</p>
      <p><strong>电子书</strong>是将本网页和本网页所在目录下的所有网页当做一本电子书，只会保存一项阅读记录。</p>
      <p>此外两者不可共存，将阅读模式从电子书更改为长网页后会单独保存，此前的电子书目录依然存在。</p>
    </section>
    <mu-slide-top-transition name="ss">
      
    </mu-slide-top-transition>
    <section
      v-show="!showHelpContent"
      class="action">
      <div
        class="switch flex"
        @click.stop>
        <label for="">记住此网页</label>
        <mu-switch
          v-model="remember"
          color="#13ce66">
        </mu-switch>
      </div>
      <!-- <mu-slide-top-transition>
        <div v-show="remember" class="sub-action">
          <div  class="sub-action-content">
            这是选择的内容
          </div>
        </div>
      </mu-slide-top-transition> -->
      <mu-expand-transition>
        <div v-show="remember" class="sub-action">
          <mu-checkbox
            class="auto-check"
            slot="actions"
            label="不再自动提示"
            color="#13ce66"
            v-model="config.notAuto">
          </mu-checkbox>
          <h4 class="sub-action-title">
            <span>阅读模式</span>
            <mu-icon
              class="sub-action-help"
              title="不明白？点击查看帮助"
              value="help_outline"
              size="14"
              @click="handleClickHelp">
            </mu-icon>
          </h4>
          <div  class="sub-action-content">
            <div
              class="option-container"
              @click="handleSelectMode(MODE.LONG)"
              :class="{
                selected: mode === MODE.LONG
              }">
              <mu-ripple
                class="option-title flex flex-between-center">
                <p>长网页</p>
                <mu-icon value="done" color="#89e7b3"></mu-icon>
              </mu-ripple>
            </div>
            <div
              class="option-container"
              @click="handleSelectMode(MODE.BOOK)"
              :class="{
                selected: mode === MODE.BOOK
              }">
              <mu-ripple
                class="option-title flex flex-between-center">
                <p>电子书</p>
                <mu-icon value="done" color="#89e7b3"></mu-icon>
              </mu-ripple>
            </div>
          </div>
        </div>
      </mu-expand-transition>
    </section>
    <section v-show="!showHelpContent">
      <h4 class="sub-action-title">阅读历史</h4>
      <ReadRecord
        v-for="(record, index) in records"
        :record="record"
        :key="record.id + index"
        :index="index"/>
    </section>
  </div>
</template>

<script>
import {
  setRecordMode,
  getCurrentUrl,
  getModeByUrl,
  getAllRecords,
  getConfigByUrl,
  setConfigByUrl
} from 'chrome_js/util_common'
import { dateFormat } from 'chrome_js/util_js.js'
import ReadRecord from './ReadRecord'

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
function formatRecords(records) {
  return records.map(record => record.lastHistory).map(history => {
    history.percent = parseFloat(history.percent)
    history.date = dateFormat(history.date, 'DD/MM HH:mm')
    return history
  })
}
export default {
  name: 'HelloWorld',
  components: {
    ReadRecord
  },
  props: {
    msg: String
  },
  data () {
    return {
      MODE,
      remember: false,
      showHelpContent: false,
      mode: '',
      modes: {
        [MODE.LONG]: false,
        [MODE.BOOK]: false
      },
      canHanldeModesChange: true,
      /**
       * @type {ReadRecordHistoryItem[]}
       */
      records: [
      ],
      config: {
        notAuto: false
      }
    }
  },
  methods: {
    handleClickHelp () {
      this.showHelpContent = !this.showHelpContent
    },
    async handleSelectMode (mode) {
      mode = this.mode === mode ? '' : mode
      await setRecordMode(await getCurrentUrl(), mode, this.mode)
      this.mode = mode
      this.getConfig()
      this.getAllRecords()
    },
    async getMode() {
      let mode = await getModeByUrl(await getCurrentUrl())
      if (mode) {
        this.remember = true
      }
      this.mode = mode
    },
    async getAllRecords() {
      let records = await getAllRecords({
        toArray: true,
        filter: record => record.mode
      })
      this.records = formatRecords(records)
    },
    async getConfig() {
      let config = await getConfigByUrl(await getCurrentUrl())
      this.config = {
        ...this.config,
        ...config
      }
    }
  },
  watch: {
    async remember(newVal) {
      if (!newVal) {
        await this.handleSelectMode('')
        this.mode = ''
      }
    },
    config: {
      deep: true,
      async handler() {
        setConfigByUrl(await getCurrentUrl(), this.config)
      }
    }
  },
  async created() {
    this.getMode()
    this.getAllRecords()
    this.getConfig()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.content {
  position: relative;
  text-align: left;
  overflow: auto;
  max-height: 100%;
  &::-webkit-scrollbar {
    width: 0;
  }
  ::-webkit-scrollbar-thumb {
    width: 0;
  }
  .sub-action {
    .sub-action-help {
      cursor: pointer;
    }
    .option-container {
      i {
        display: none;
      }
      &.selected {
        box-shadow: 1px 1px #eee;
        i {
          display: inline-block;
        }
      }
      
      .option-title {
        padding: 5px 0;
        position: relative;
        cursor: pointer;
      }
    }
  }
  .help {
    // position: absolute;
  }
  .close-button {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
}
.no-padding-header-panel {
  /deep/ .mu-expansion-panel-header{
    padding: 0;
    min-height: 0;
  }
}
</style>
