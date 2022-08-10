<template>
  <section>
    <InfoPanel header="Account information" class="mb-5">
      <VForm @submit.prevent>
        <VContainer pa-0 ma-0 grid-list-xl>
          <VLayout row wrap>
            <VFlex xs12 sm6>
              <VTextField label="Company*" v-model="company" />
            </VFlex>
            <VFlex xs12 sm6>
              <VTextField label="Country*" v-model="country" />
            </VFlex>
            <VFlex xs12 sm6>
              <PlacesAutocomplete
                label="Primary Place of Business Address*"
                @address="street = $event"
                @place="onUpdatePlace"
              />
            </VFlex>
            <VFlex xs12 sm6>
              <VTextField
                label="Apartment, unit, suite, or floor #"
                v-model="apartment"
              />
            </VFlex>
            <VFlex xs12 sm6>
              <VTextField label="City*" v-model="city" />
            </VFlex>
            <VFlex xs12 sm6>
              <VTextField label="State / Province / Region*" v-model="state" />
            </VFlex>
            <VFlex xs6>
              <VTextField label="Zip or Postal code*" v-model="postal" />
            </VFlex>
            <VFlex xs12>
              <VBtn type="submit" @click="updateGeocoder">Submit</VBtn>
              <VBtn @click="clearForm">Clear</VBtn>
            </VFlex>
          </VLayout>
        </VContainer>
      </VForm>
    </InfoPanel>
    <InfoPanel header="Google Maps API info">
      <VContainer pa-0 ma-0 grid-list-xl>
        <VLayout row wrap>
          <!-- TODO: Get Map working with Vue -->
          <!-- <VFlex xs12 sm6>
            <div ref="mapContainer"></div>
          </VFlex> -->
          <VFlex xs12 sm6>
            <p>
              <strong>Place info</strong>
            </p>
            <code v-if="place">
              {{ place }}
            </code>
            <code v-else-if="place === null">No matches found</code>
          </VFlex>
          <VFlex xs12 sm6>
            <p>
              <strong>Geocoder info</strong>
            </p>
            <code v-if="geocoder">
              {{ geocoder }}
            </code>
            <code v-if="geocoder === null">No matches found</code>
          </VFlex>
        </VLayout>
      </VContainer>
    </InfoPanel>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import InfoPanel from '@/components/InfoPanel.vue'
import PlacesAutocomplete from '@/components/PlacesAutocomplete.vue'

export default defineComponent({
  name: 'PlacesDemo',
  components: {
    InfoPanel,
    PlacesAutocomplete,
  },
  setup(props, context) {
    const company = ref('')
    const country = ref('')
    const street = ref('')
    const apartment = ref('')
    const city = ref('')
    const state = ref('')
    const postal = ref('')

    const place = ref<google.maps.places.PlaceResult | null | undefined>(
      undefined
    )
    const geocoder = ref<google.maps.GeocoderResult[] | null | undefined>(
      undefined
    )

    const mapContainer = ref<HTMLElement | null>()

    const onUpdatePlace = (newPlace: google.maps.places.PlaceResult) => {
      place.value = newPlace
      clearFields()

      let postcode = ''
      let localityOrPostalTown = ''
      let sublocality = ''

      for (const component of newPlace?.address_components ?? []) {
        const componentType = component.types[0]

        switch (componentType) {
          case 'subpremise':
            apartment.value = component.long_name
            break
          case 'postal_code':
            postcode = `${component.long_name}${postcode}`
            break
          case 'postal_code_suffix':
            postcode = `${postcode}-${component.long_name}`
            break
          case 'locality':
            localityOrPostalTown = component.long_name
            break
          case 'sublocality_level_1':
            sublocality = component.long_name
            break
          case 'postal_town':
            localityOrPostalTown = component.long_name
            break
          case 'administrative_area_level_1':
            state.value = component.long_name
            break
          case 'country':
            country.value = component.long_name
            break
        }
      }

      postal.value = postcode
      city.value = localityOrPostalTown || sublocality
    }

    const updateGeocoder = () => {
      const newGeocoder = new google.maps.Geocoder()

      const readableAddress = `${street.value} ${apartment.value} ${city.value} ${state.value} ${country.value} ${postal.value}`

      newGeocoder.geocode(
        {
          address: readableAddress,
        },
        (results, status) => (geocoder.value = results)
      )
    }

    const clearFields = () => {
      company.value = ''
      country.value = ''
      street.value = ''
      apartment.value = ''
      city.value = ''
      state.value = ''
      postal.value = ''
    }

    const clearForm = () => {
      clearFields()
      place.value = undefined
      geocoder.value = undefined
    }

    return {
      company,
      country,
      street,
      apartment,
      city,
      state,
      postal,
      place,
      geocoder,
      mapContainer,
      onUpdatePlace,
      updateGeocoder,
      clearFields,
      clearForm,
    }
  },
})
</script>
