<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <PlacesDemo />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import PlacesDemo from '@/components/PlacesDemo.vue'

export default defineComponent({
  name: 'App',
  components: {
    PlacesDemo,
  },
})
</script>
