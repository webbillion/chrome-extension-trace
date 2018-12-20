<template>
  <div v-if="showConfirm" class="my-app">
    <mu-dialog
      title="这里是亮闪闪的提示"
      class="confirm-dialog"
      :open.sync="showConfirm"
      :overlay-close="false"
      :esc-press-close="false">
      <div class="history-container">
        <p class="history-title">上次阅读到 <strong><em>{{ history.title }}</em></strong></p>
        <p class="history-percent">阅读进度 <strong><em>{{ history.percent }}</em></strong></p>
        <img
          alt="暂无预览图或加载失败"
          class="preview"
          :class="{
            big: showBigImg
          }"
          v-lazy="history.screenShootSrc"
          :title="`点击可${showBigImg ? '缩小' : '放大'}`"
          @click="showBigImg = !showBigImg">
          <img
            alt="暂无预览图或加载失败">
      </div>
      <mu-checkbox
        class="auto-check"
        slot="actions"
        label="不再自动提示"
        v-model="notAuto">
      </mu-checkbox>
      <mu-button
        slot="actions"
        @click="closeAlertDialog">知道了
      </mu-button>
      <mu-button
        slot="actions"
        color="primary"
        @click="handleConfirm">我要跳转
      </mu-button>
    </mu-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      showConfirm: false,
      showBigImg: false,
      confirmResolve: () => {},
      confirmReject: () => {},
      notAuto: false,
      history: {
        screenShootSrc: '',
        title: '',
        percent: '0%'
      }
    }
  },
  methods: {
    confirm(history) {
      this.history = history
      return new Promise((resolve, reject) => {
        this.showConfirm = true
        this.confirmResolve = resolve
        this.confirmReject = reject
      })
    },
    handleConfirm() {
      this.showConfirm = false
      // 暂时就这一个设置
      this.confirmResolve(this.notAuto)
    },
    closeAlertDialog() {
      this.showConfirm = false
      this.confirmReject(this.notAuto)
    }
  },
  mounted () {
    let styles = document.querySelectorAll('style')
    for (let i in styles) {
      let styleElInner = styles[i].innerHTML
      if (styleElInner && styleElInner.indexOf('/*! normalize.css v4.1.1 | MIT License | github.com/necolas/normalize.css */') > -1) {
        styles[i].remove()
      }
    }
  }
}
</script>
<style lang="less">
* {
    box-sizing: border-box;
  }
</style>

<style scoped lang="less">
p {
  margin: 0;
}
.history-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .history-title,
  .history-percent {
    width: 100%;
  }
  img.preview {
    height: 300px;
    cursor: pointer;
    +img {
      display: none;
    }
    &[lazy=error] {
      // 暂定加载失败直接不显示
      display: none;
      // 暂时取消
      // +img {
      //   display: inline-block;
      // }
    }
    &.big {
      position: fixed;
      width: 80%;
      height: auto;
      z-index: 1;
    }
  }
}
.auto-check {
  position: absolute;
  // 和内边距已有
  left: 8px;
}
.confirm-dialog {
  /deep/ .mu-dialog {
    min-width: 400px;
  }
  /deep/ .mu-dialog-actions {
    position: relative;
  }
}
</style>