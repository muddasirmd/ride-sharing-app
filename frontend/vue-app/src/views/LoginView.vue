<template>
    <div class="pt-16">
        <h1 class="text-3xl font-semibold mb-4">Enter your {{ !waitingOnVerification ? 'phone number' : 'verification code' }}</h1>

        <form v-if="!waitingOnVerification" action="#" @submit.prevent="handleLogin">
            <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
                <div class="bg-white px-4 py-5 sm:p-6">
                    <div>
                        <input type="text" v-maska data-maska="## ###-#######" v-model="credentials.phone" name="phone" id="phone" placeholder="92 0300-1234567" 
                            class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none" />
                    </div>

                </div>

                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit" @submit.prevent="handleLogin"
                        class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Continue
                    </button>

                </div>

            </div>
        </form>        
        
        <form v-else action="#" @submit.prevent="handleVerification">
            <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
                <div class="bg-white px-4 py-5 sm:p-6">
                    <div>
                        <input type="text" v-maska data-maska="######" v-model="credentials.login_code" name="login_code" id="login_code" placeholder="123456" 
                            class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none" />
                    </div>

                </div>

                <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button type="submit" @submit.prevent="handleVerification"
                        class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
                        Verify
                    </button>

                </div>

            </div>
        </form>
    </div>
</template>

<script setup>
import { vMaska } from "maska/vue"
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from "vue-router"
import http from "@/helpers/http"

const router = useRouter()

const credentials = reactive({
    phone: null,
    login_code: null
})

const waitingOnVerification =ref(false)

onMounted(() => {
    if(localStorage.getItem('token')){
        router.push({ name: 'landing' })
    }
})

const handleLogin = () => {

    http().post('api/login', credentials)
        .then((response) => {
            console.log('Login successful:', response.data)
            waitingOnVerification.value = true
        })
        .catch((error) => {
            console.error('Login failed:', error)
            alert(error.response.data.message || 'Login failed. Please try again.')
        })
    
}

const handleVerification = () => {

    http().post('api/login/verify', credentials)
        .then((response) => {
            console.log(response.data)
            localStorage.setItem('token', response.data)
            router.push({
                name: 'landing'
            })
        })
        .catch((error) => {
            console.log(error)
            alert(error.response.data.message)
        })
}

</script>