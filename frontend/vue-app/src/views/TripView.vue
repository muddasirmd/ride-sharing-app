<!-- Passenger View -->
<template>
    <div class="pt-16">
        <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>
        <div>
            <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
                <div class="px-4 py-5 sm:p-6 bg-white">
                    <div>
                        <GMapMap :zoom="14" :center="location.current.geometry"
                            ref="gMap" style="width:100%; height: 256px;">
                            <GMapMarker :position="location.current.geometry" :icon="currentIcon" />
                            <GMapMarker :position="trip.driver_location" :icon="driverIcon" />
                        </GMapMap>
                    </div>
                </div>
                <div class="px-4 py-3 text-right sm:px-6 bg-gray-50">
                    <span>{{ message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useLocationStore } from '@/stores/location';
import { useTripStore } from '@/stores/trip';
import { onMounted, ref } from 'vue';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { name } from '@vue/eslint-config-prettier/skip-formatting';

const location = useLocationStore()
const trip = useTripStore()

const gMap = ref(null)
const gMapObject = ref(null)

const currentIcon = {
    url: 'https://openmoji.org/data/color/svg/1F698.svg',
    scaledSize: {
        width: 32,
        height: 32
    }
}

const driverIcon = {
    url: 'https://openmoji.org/data/color/svg/1F920.svg',
    scaledSize: {
        width: 24,
        height: 24
    }
}

const title = ref('Waiting on a driver...')
const message = ref('When a driver accepts the trip, their info will appear here.')

const updateMapBounds = () => {

    let originPoint = new google.maps.LatLng(location.current.geometry)
    let driverPoint = new google.maps.LatLng(trip.driver_location)
    let latLngBounds = new google.maps.LatLngBounds()

    latLngBounds.extend(originPoint)
    latLngBounds.extend(driverPoint)

    gMapObject.value.fitBounds(latLngBounds)
}

onMounted(() => {
    
    gMap.value.$mapPromise.then((mapObject) => {
        gMapObject.value = mapObject
    })

    let echo = new Echo({
        broadcaster: 'pusher',
        key: 'mykey',
        cluster: 'mt1',
        wsHost: window.location.hostname,
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
    });

    echo.channel(`passenger.${trip.user_id}`)
        .listen('TripAccepted', (e) => {
            
            trip.$patch(e.trip)

            title.value = 'Driver is on the way!'
            message.value = `${e.trip.driver.user.name} is coming in a ${e.trip.driver.year} ${e.trip.driver.color} ${e.trip.driver.make} ${e.trip.driver.model} with a license plate #${e.trip.driver.license_plate}`
        })
        .listen('TripLocationUpdated', (e) => {
            
            trip.$patch(e.trip)

            setTimeout(updateMapBounds, 1000)
        })
        .listen('TripStarted', (e) => {
            
            trip.$patch(e.trip)

            // Change location obj from passenger's current location to passenger's destination location
            location.$patch({
                current: {
                    geometry: e.trip.destination
                }
            })

            title.value = "You're on your way!"
            message.value = `You are headed to ${e.trip.destination_name}`
        })
        .listen('TripEnded', (e) => {
            
            trip.$patch(e.trip)

            title.value = "You've arrived at your destination!";
            message.value = `Hope you enjoyed your ride with ${e.trip.driver.user.name}. Thank you for riding with us!`;

            setTimeout(() => {

                trip.reset()
                location.reset()

                router.push({
                    name: 'landing'
                })

            }, 10000)
        })
})

</script>