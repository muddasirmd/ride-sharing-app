<template>
    <div class="pt-16">
        <h1 class="text-3xl font-semibold mb-4">Here's your trip</h1>
        <div>
            <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
                <div class="px-4 py-5 sm:p-6 bg-white">
                    <div>
                        <GMapMap ref="gMap" :zoom="11" :center="location.destination.geometry" 
                            style="width: 100%; height: 256px;">
                            <!-- <GMapMarker :position="location.destination.geometry" /> -->
                        </GMapMap>
                    </div>
                    <div class="mt-2">
                        <p class="text-xl">Going to <strong>{{ location.destination.name }}</strong></p>
                    </div>
                </div>
                <div class="px-4 py-3 text-right sm:px-6 bg-gray-50">
                    <button class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Let's Go
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useLocationStore } from '@/stores/location';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const location = useLocationStore();
const router = useRoute();

const gMap = ref(null)

onMounted(async () => {
    // does the user have a destination set?
    if(location.destination.name == ''){
        router.push({name: 'location'})
    }

    // lets get the user current location
    await location.updateCurrentLocation()

    // Draw a path on the map
    gMap.value.$mapPromise.then((mapObject) => {

        let currentPoint = new google.maps.LatLng(location.current.geometry),
            destinationPoint = new google.maps.LatLng(location.destination.geometry),
            directionService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: mapObject
            })

            directionService.route({
                origin: currentPoint,
                destination: destinationPoint,
                avoidTolls: false,
                avoidHighways: false,
                travelMode: google.maps.TravelMode.DRIVING
            }, (res, status) => {
                if(status == google.maps.DirectionsStatus.OK){
                    directionsDisplay.setDirections(res)
                }else{
                    console.error(status)
                }
            })
    })
})
</script>