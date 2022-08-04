<template>
  <div class="info-panel__content">
    <div class="info-panel__header">
      <h2>{{ header }}</h2>
    </div>
    <div class="info-panel__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'InfoPanel',
  props: {
    id: {
      type: String,
    },
    header: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.info-panel {
  position: relative;

  &__header {
    margin-bottom: 32px;

    & > h2 {
      display: block;
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.15px;
      margin: 0;
      padding: 12px 0;
    }
  }
}
</style>
