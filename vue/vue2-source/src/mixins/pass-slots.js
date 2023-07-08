let $slots = Object.create(null);
let $scopedSlots = Object.create(null);

export const resetSharedSlots = () => {
  $slots = Object.create(null);
  $scopedSlots = Object.create(null);
};

export default {
  created() {
    $slots = { ...$slots, ...this.$slots };
    this.$slots = $slots;
    $scopedSlots = { ...$scopedSlots, ...this.$scopedSlots };
    this.$scopedSlots = $scopedSlots;
  },
  beforeUpdate() {
    $slots = { ...$slots, ...this.$slots };
    this.$slots = $slots;
    $scopedSlots = { ...$scopedSlots, ...this.$scopedSlots };
    this.$scopedSlots = $scopedSlots;
  },
};
