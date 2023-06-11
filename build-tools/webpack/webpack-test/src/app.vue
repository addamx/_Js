<template>
  <div class="app-class">
    {{appTitle}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      appTitle: 'Hello World'
    }
  }
}
</script>

<style>
.app-class {
  color: red;
}
</style>
