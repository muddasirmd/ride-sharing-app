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

const location = useLocationStore()
const trip = useTripStore()

const currentIcon = {
    url: 'https://openmoji.org/data/color/svg/1F698.svg',
    scaledSize: {
        width: 32,
        height: 32
    }
}

const title = ref('Waiting on a driver...')
const message = ref('When a driver accepts the trip, their info will appear here.')

onMounted(() => {
    

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
            message.value = `${trip.driver.user.name} is coming in a ${trip.driver.year} ${trip.driver.color} ${trip.driver.make} ${trip.driver.model} with a license plate #${trip.driver.license_plate}`
        })
})

</script>