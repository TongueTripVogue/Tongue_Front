<script setup>
import { ref, computed } from "vue"
import axios from "axios"
import { useRouter } from "vue-router";
import Message from 'primevue/message';
import GoHomeIcon from '@/components/common/GoHomeIcon.vue';

const router = useRouter();

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env
const userId = ref("");
const userPassword = ref("");

// axios 인스턴스 생성
const instance = axios.create({
    baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
    timeout: 1000, // 타임아웃 설정
});

// 기본 헤더 설정
// instance.defaults.headers.common["Authorization"] = "";
instance.defaults.headers.post["Content-Type"] = "multipart/form-data; boundary=";
// instance.defaults.headers.put["Content-Type"] = "application/json";


const checkUser = ref(false)

const test = () => {
    instance.get("/user/hi")
        .then((res) => {
            console.log(res)
            if (res.status === 200) {
                // 로그인 성공
                console.log("로그인 성공")
                console.log(res)

            }
        })
        .catch((err) => {
            console.log(err)
        })
}

const loginSubmit = () => {
    if (userId.value == null || userPassword.value == null) {
        return;
    }

    // test()

    const frm = new FormData();
    frm.append("username", userId.value)
    frm.append("password", userPassword.value)

    try {
        instance.post("/login", frm)
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    // 로그인 성공
                    console.log("로그인 성공")
                    console.log(res)
                    alert("로그인 성공!!")
                    // console.log(res.headers.getAuthorization())
                    sessionStorage.setItem("userToken", res.headers.getAuthorization())
                    router.push({ name: 'main' })
                }
            })
            .catch((err) => {
                console.log("로그인 실패")
                alert("로그인 실패!!")
                checkUser.value = true
                console.log(err)
            })
            ;
    } catch (error) {
        console.log(error)
    }
}

const moveToMain = () => {
    router.push({ name: 'main' })
}

</script>

<template>
    <div>
        <div class="mt-20 ml-40">
            <GoHomeIcon @click="moveToMain" />
            <Message v-if="checkUser" class="w-64 absolute" severity="warn">Warning Message</Message>
        </div>
        <div class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
            aria-hidden="true">
            <div class="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div>
        <div class="flex min-h-full flex-1 flex-col justify-center mt-12 px-6 py-12 lg:px-8">

            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-10 w-auto" src="/src/assets/img/Tongue-logo.png"
                    alt="Your Company" />
                <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
                    account</h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="#" method="POST">
                    <div>
                        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email
                            address</label>
                        <div class="mt-2">
                            <input id="email" name="email" type="email" autocomplete="email" required v-model="userId"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                            <label for="password"
                                class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div class="text-sm">
                                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot
                                    password?</a>
                            </div>
                        </div>
                        <div class="mt-2">
                            <input id="password" name="password" type="password" autocomplete="current-password"
                                required v-model="userPassword"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <button type="button"
                            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            @click="loginSubmit">Sign in</button>
                    </div>
                </form>

                <p class="mt-10 text-center text-sm text-gray-500">
                    Not a member?
                    <RouterLink class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                        :to="{ name: 'regist' }"> 회원가입</RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>