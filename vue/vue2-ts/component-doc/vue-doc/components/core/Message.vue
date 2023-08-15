<template>
  <h1></h1>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  name: "Message",
  props: {
    message: {
      type: String,
      default: "Hello World!",
    },
    type: {
      type: String as PropType<"info" | "warn">,
      default: "info",
    },
    list: {
      type: Array as PropType<{ value: string; lable; string }[]>,
      default: () => [],
    },
  },
});
</script>
