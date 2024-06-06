<script setup>
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { useRouter } from "vue-router";
import axios from "axios";
const { VITE_RESTAPI_SERVICE_URL } = import.meta.env
import GoHomeIcon from '@/components/common/GoHomeIcon.vue';

const route = useRouter()

const agreed = ref(false)
const userName = ref('')
const userId = ref('')
const password = ref('')
const address = ref('')
const birth = ref('')

const register = () => {

    axios.post(VITE_RESTAPI_SERVICE_URL + "/user/join", {
        userName: userName.value,
        userId: userId.value,
        userPassword: password.value,
        userAddress: address.value,
        userBirth: birth.value,
    })
        .then(res => {
            console.log(res.data)
            console.log("회원가입 성공!!")
            alert("회원가입 성공")
            route.push({ name: 'login' })
        })
        .catch(err => {
            console.log(err)
            alert("회원가입 실패")
        })
}


</script>

<template>
    <div class="isolate bg-white px-6 py-5 sm:py-10 lg:px-8">
        <div class="mt-20 ml-40">
            <GoHomeIcon />
        </div>
        <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true">
            <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Join</h2>
        </div>
        <form class="mx-auto mt-4 max-w-xl sm:mt-10">
            <div class="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                <div class="sm:col-span-2">
                    <label for="company" class="block text-sm font-semibold leading-6 text-gray-900">UserName</label>
                    <div class="mt-2.5">
                        <input type="text" name="company" id="company" autocomplete="organization" v-model="userName"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div class="sm:col-span-2">
                    <label for="email" class="block text-sm font-semibold leading-6 text-gray-900">UserID</label>
                    <div class="mt-2.5">
                        <input type="email" name="email" id="email" autocomplete="email" v-model="userId"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div class="sm:col-span-2">
                    <label for="password" class="block text-sm font-semibold leading-6 text-gray-900">Password</label>
                    <div class="mt-2.5">
                        <input type="password" name="password" id="password" autocomplete="organization"
                            v-model="password"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div class="sm:col-span-2">
                    <label for="address" class="block text-sm font-semibold leading-6 text-gray-900">Address</label>
                    <div class="mt-2.5">
                        <input type="text" name="address" id="address" autocomplete="organization" v-model="address"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div class="sm:col-span-2">
                    <label for="birth" class="block text-sm font-semibold leading-6 text-gray-900">Birth</label>
                    <div class="mt-2.5">
                        <input type="text" name="birth" id="birth" autocomplete="organization" v-model="birth"
                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <SwitchGroup as="div" class="flex gap-x-4 sm:col-span-2">
                    <div class="flex h-6 items-center">
                        <Switch v-model="agreed"
                            :class="[agreed ? 'bg-indigo-600' : 'bg-gray-200', 'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']">
                            <span class="sr-only">Agree to policies</span>
                            <span aria-hidden="true"
                                :class="[agreed ? 'translate-x-3.5' : 'translate-x-0', 'h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out']" />
                        </Switch>
                    </div>
                    <SwitchLabel class="text-sm leading-6 text-gray-600">
                        By selecting this, you agree to our
                        {{ ' ' }}
                        <a href="#" class="font-semibold text-indigo-600">privacy&nbsp;policy</a>.
                    </SwitchLabel>
                </SwitchGroup>
            </div>
            <div class="mt-10">
                <button type="button" @click="register"
                    class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Let's Join
                </button>
            </div>
        </form>
    </div>
</template>