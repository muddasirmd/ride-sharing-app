<template>
    <div class="pt-16">
        <h1 class="text-3xl font-semibold mb-4">Ride Share</h1>
        <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
            <div class="px-4 py-5 sm:p-6 bg-white">
                <div class="flex justify-between">
                    <button class="rouned-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Start Driving
                    </button>
                    <button @click="handleFindRide" class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Find a Ride
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

import { useRouter } from "vue-router"
const router = useRouter()

const handleFindRide = () => {
    router.push({ name: 'location' })
}

</script>