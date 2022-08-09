<template>
  <VTextField
    ref="addressField"
    :id="id"
    :required="required"
    :browser-autocomplete="Math.random().toString()"
    :label="label"
    v-model="address"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { Loader } from '@googlemaps/js-api-loader'
import Vue from 'vue'

export default defineComponent({
  name: 'PlacesAutocomplete',
  emits: ['address', 'place'],
  props: {
    id: {
      type: String,
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
  },
  setup(props, context) {
    const { emit } = context

    const addressField = ref<Vue>()
    const address = ref('')

    let autocomplete: google.maps.places.Autocomplete | undefined

    const loader = new Loader({
      apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
      language: 'en',
      region: 'US',
    })

    const init = async () => {
      await loader.load()

      if (!addressField.value) {
        throw new Error(
          'Error initializing the Google Maps library: could not find ref element.'
        )
      }

      const inputElemSelector = `input[type="text"]`

      const inputElem = (
        addressField.value.$el.matches(inputElemSelector)
          ? addressField.value.$el
          : addressField.value.$el.querySelector(inputElemSelector)
      ) as HTMLInputElement

      if (!inputElem) {
        throw new Error(
          'Error initializing the Google Maps library: could not find input element.'
        )
      }

      autocomplete = new google.maps.places.Autocomplete(inputElem, {
        // componentRestrictions: { country: ['us', 'ca'] },
        fields: ['address_components', 'geometry', 'formatted_address'], // formatted_address is optional
        types: ['address'],
      })

      autocomplete.addListener('place_changed', updateAddress)

      // Clear the default placeholder value "Enter a location" added to the input by the Google Maps library
      inputElem.placeholder = ''

      inputElem.focus()
    }

    const updateAddress = () => {
      if (!autocomplete) throw new Error('Error updating the address field')

      const place = autocomplete.getPlace()

      let usAddress = ''
      let jpAddress = ''
      let country = ''

      for (const component of place.address_components ?? []) {
        const componentType = component.types[0]

        switch (componentType) {
          case 'street_number':
            usAddress = `${component.long_name} ${usAddress}`
            break
          case 'route':
            usAddress += component.short_name
            break
          case 'premise':
            jpAddress += ' ' + component.long_name
            break
          case 'sublocality_level_2':
            jpAddress += ' ' + component.long_name
            break
          case 'sublocality_level_1':
            jpAddress += ' ' + component.long_name
            break
          case 'country':
            country = component.short_name
            break
        }
      }

      switch (country) {
        case 'US':
          address.value = usAddress
          break
        case 'JP':
          address.value = jpAddress
          break
        default:
          address.value = usAddress
      }

      emit('address', usAddress)
      emit('place', place)
    }

    onMounted(init)

    return {
      addressField,
      address,
    }
  },
})
</script>
