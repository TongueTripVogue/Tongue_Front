i
<script setup>
import { RouterLink } from "vue-router";
import HeaderLogo from "@/components/common/HeaderLogo.vue";
import { ref, onMounted, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  PopoverGroup,
} from "@headlessui/vue";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from "@heroicons/vue/20/solid";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000, // 타임아웃 설정
});

// 기본 헤더 설정
// instance.defaults.headers.post["Content-Type"] = "multipart/form-data; boundary=";
// instance.defaults.headers.put["Content-Type"] = "application/json";

const isLogined = ref(false);
const userId = ref("");

const checkUserToken = () => {
  if (sessionStorage.getItem("userToken")) {
    isLogined.value = true;
    instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");

    instance
      .get("/user/userInfo")
      .then((res) => {
        userId.value = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

checkUserToken();

const logoutMethod = () => {
  sessionStorage.removeItem("userToken");
  isLogined.value = false;
  router.push({ name: "main" });
};

const goMypage = () => {
  router.push({ name: "mypage" });
}

const mobileMenuOpen = ref(false);
</script>

<template>
  <header class="relative z-50">
    <nav class="bg-[#CEDCFF] fixed top-0 left-0 right-0 flex items-center justify-between p-4 lg:px-64"
      aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
          <HeaderLogo />
          <!-- <span class="sr-only">Tongue</span> -->
          <!-- <img class="h-12 w-auto" src="@/assets/img/logo_black.png" alt="" /> -->
        </a>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12 noto-sans-kr-bold">
        <RouterLink class="flex justify-center text-lg leading-6 text-[#293c6c]"
          :to="{ name: 'search' }">
          <!-- <i class="pi pi-search pr-2" style="font-size: 1.8rem"></i> -->
          관광지검색하기
        </RouterLink>
        <RouterLink class="flex justify-center text-lg leading-6 text-[#293c6c]"
          :to="{ name: 'region' }">
          <!-- <i class="pi pi-ethereum pr-2" style="font-size: 1.8rem"></i> -->
          지역별여행지
        </RouterLink>
        <RouterLink class="flex justify-center text-lg leading-6 text-[#293c6c]"
          :to="{ name: 'gemini' }">
          <!-- <i class="pi pi-list-check pr-2" style="font-size: 1.8rem"></i> -->
          여행일정짜기
        </RouterLink>
        <RouterLink class="flex justify-center text-lg leading-6 text-[#293c6c]"
          :to="{ name: 'magazineMain' }">
          <!-- <i class="pi pi-book pr-2" style="font-size: 1.8rem"></i> -->
          여행매거진
        </RouterLink>
      </PopoverGroup>
      <div v-if="isLogined" class="hidden lg:flex lg:flex-1 lg:justify-end flex items-center  noto-sans-kr-bold text-[#293c6c]">
        <div class="pr-2 text-lg flex justify-start items-center ">
          <span class="text-black pr-2">{{ userId }}</span>님
          <span class="border rounded-full p-1 m-1" @click="goMypage">
            <i class="pi pi-user-edit" style="font-size: 1.5rem"></i>
          </span>
        </div>
        <div @click="logoutMethod" class="text-lg">로그아웃</div>
      </div>
      <div v-else class="hidden lg:flex lg:flex-1 lg:justify-end noto-sans-kr-bold">
        <RouterLink class="text-lg leading-6 text-[#293c6c]" :to="{ name: 'login' }">로그인 
          <!-- <span aria-hidden="true">&rarr;</span> -->
        </RouterLink>
      </div>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-50">
        <DialogPanel
          class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div class="flex items-center justify-between">
            <a href="#" class="-m-1.5 p-1.5">
              <span class="sr-only">Your Company</span>
              <img src="/src/assets/img/Tongue-logo.png" alt="" class="h-10">
              <!-- <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              /> -->
            </a>
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700"
              @click="mobileMenuOpen = false"
            >
              <span class="sr-only">Close menu</span>
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10 noto-sans-kr-bold">
              <div class="space-y-2 py-6">
                <RouterLink
                  class="flex -mx-3 block rounded-lg px-3 py-2 text-lg leading-7 text-[#293c6c] hover:bg-gray-50"
                  :to="{ name: 'search' }"
                >
                  <!-- <i class="pi pi-search pr-2" style="font-size: 1.5rem"></i> -->
                  관광지검색하기
                </RouterLink>
                <RouterLink
                  class="flex -mx-3 block rounded-lg px-3 py-2 text-lg leading-7 text-[#293c6c] hover:bg-gray-50"
                  :to="{ name: 'region' }"
                >
                  <!-- <i class="pi pi-ethereum pr-2" style="font-size: 1.5rem"></i> -->
                  지역별여행지
                </RouterLink>
                <RouterLink
                  class="flex -mx-3 block rounded-lg px-3 py-2 text-lg leading-7 text-[#293c6c] hover:bg-gray-50"
                  :to="{ name: 'gemini' }"
                >
                  <!-- <i class="pi pi-list-check pr-2" style="font-size: 1.5rem"></i> -->
                  여행일정짜기
                </RouterLink>
                <RouterLink
                  class="flex -mx-3 block rounded-lg px-3 py-2 text-lg leading-7 text-[#293c6c] hover:bg-gray-50"
                  :to="{ name: 'magazineMain' }"
                >
                  <!-- <i class="pi pi-book pr-2" style="font-size: 1.5rem"></i> -->
                  여행매거진
                </RouterLink>
              </div>
              <div class="py-6  noto-sans-kr-bold text-[#293c6c]" v-if="isLogined">
                <div class="pr-2 text-lg mb-4 flex justify-start items-center ">
                  <span class="text-black pr-2">{{ userId }} </span>님
                  <span class="border rounded-full p-1 m-1" @click="goMypage">
                    <i class="pi pi-user-edit" style="font-size: 1.5rem"></i>
                  </span>
                </div>
                <div @click="logoutMethod" class="text-lg">로그아웃</div>
              </div>
              <div class="py-6" v-else>
                <RouterLink
                  class="-mx-3 block rounded-lg px-3 py-2.5 text-lg leading-7 text-[#293c6c] hover:bg-gray-50"
                  :to="{ name: 'login' }"
                  >로그인</RouterLink
                >
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </header>
</template>

<style scoped></style>
