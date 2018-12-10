<template>
  <div>
    <a
      target="_blank"
      class="record-link"
      :href="record.url">
      <div
        class="record-title flex flex-between-center"
        :title="record.title">
        <p class="flex">
          <img
            :src="record.faviconUrl" alt="" class="icon">
          <span class="title">{{ record.title }}</span>
        </p>
        <span class="date">{{ record.date }}</span>
      </div>
    </a>
    <div class="progress-container">
      <mu-linear-progress
        mode="determinate"
        :color="progressColor"
        :value="record.percent"
        :title="`${record.percent}%`">
      </mu-linear-progress>
      <mu-linear-progress
        v-if="showAnimateProgress"
        class="animate-progress"
        :value="record.percent"
        :title="`${record.percent}%`"
        :color="progressColor">
      </mu-linear-progress>
    </div>
   
  </div>
</template>

<script>
export default {
  props: {
    record: Object,
    index: Number
  },
  data() {
    return {
      animateProgress: 1,
      progressColor: '#0f0',
      showAnimateProgress: false
    }
  },
  computed: {
    progressPercent() {
      return this.record.percent
    }
  },
  mounted() {
    // 让各个动画不完全一致
    setTimeout(() => {
      this.showAnimateProgress = true
    }, 200 * this.index)
  }
}
</script>

<style lang="less" scoped>
.record-link {
  color: #000;
}
.record-title {
  margin: 10px 0 0;
  max-width: 100%;
  font-size: 14px;
  white-space: nowrap;
  .icon {
    margin-right: 5px;
    width: 18px;
    height: 18px;
  }
  .title {
    display: inline-block;
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis; 
  }
  .date {
    display: inline-block;
    width: 63px;
    font-size: 12px;
    font-weight: normal;
    color: #333;
  }
}
.progress-container {
  position: relative;
  .animate-progress {
    position: absolute;
    top: 0;
    opacity: .3;
  }
}
</style>
