<template>
  <div>
    <h1>AppDev</h1>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'AppDev',
  created() {
    console.log('AppDev created');
    console.log('store.count', this.$store.state.count);
  },
}
</script>

