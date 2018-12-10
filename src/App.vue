<template>
  <div id="app">
    <Content />
  </div>
</template>

<script>
import Content from './components/Content'

export default {
  name: 'app',
  components: {
    Content
  }
}
</script>

<style>
html {
  /* 做对比 */
  background-color: #2c3e50;
}
body,
p {
  margin: 0; 
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  float: right;
  padding: 20px;
  width: 250px;
  height: 400px;
  background-color: #fff;
}
</style>
