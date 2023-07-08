<template>
  <div>
    <slot name="test" />
  </div>
</template>

<script>
import passSlots from '../mixins/pass-slots'
export default {
  mixins: [passSlots],
};
</script>

<style>
</style>
