<script setup>
import HeaderNav from "@/components/common/HeaderNav.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import { comment } from "postcss";
import InputGroup from "primevue/inputgroup";

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;

const route = useRoute();
const router = useRouter();

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 100000, // 타임아웃 설정
});

const magazine = ref({
  magazineTitle: "",
  magazineDetailDtoList: [],
});

const userInfo = ref();

const getMagazineContent = async () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  await instance.get("/magazine/" + route.params.magazineId).then((res) => {
    magazine.value = res.data;
    console.log(magazine.value);

    magazine.value.magazineDetailDtoList.sort(function (a, b) {
      if (a.travelInfoDto.order > b.travelInfoDto.order) {
        return 1;
      }
      if (a.travelInfoDto.order < b.travelInfoDto.order) {
        return -1;
      }
    });

    processImages();
  });
  await instance.get("/user/userInfo").then((res) => {
    console.log(res.data);
    userInfo.value = res.data;
    checkOwner();
  });
};

// onMounted(() => {
//   getMagazineContent();
// });
getMagazineContent();

const sizeCheck = async (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width > img.height);
    };
    img.src = src;
  });
};

const processImages = async () => {
  for (const detail of magazine.value.magazineDetailDtoList) {
    detail.isWide = await sizeCheck(detail.img);
  }
};

const comments = ref([]);

const currComment = ref("");

const getComment = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance.get("/magazine/comment/" + route.params.magazineId).then((commentList) => {
    console.log(commentList.data);
    comments.value = commentList.data;
    console.log("댓글 불러오기 성공!!!");
  });
};

getComment();

const pushComment = async () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  await instance
    .post("/magazine/comment/" + route.params.magazineId, null, {
      params: { comment: currComment.value },
    })
    .then(() => {
      console.log(currComment.value);
      console.log("댓글 추가 성공!");
      currComment.value = "";
      getComment();
    });
};

const modifyMagazine = () => {
  router.push({ name: "memo", params: { magazineId: route.params.magazineId } });
};
const deleteMagazine = () => {
  if (confirm("매거진을 삭제하시겠습니까?")) {
    try {
      instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
      instance.get("/magazine/delete/" + route.params.magazineId).then();
      alert("매거진 삭제 성공!");
      router.push({ name: "mypage" });
    } catch (e) {
      console.log(e);
      alert("매거진 삭제 실패!");
    }
  }
};

const duplicateMagazine = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance.get("/travel/check/" + magazine.value.travelId).then((res) => {
    console.log("여기?!?!??!?!?");
    if (res.data.length > 0) {
      alert("이미 가져온 일정입니다!");
    } else {
      instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
      instance
        .get("/travel/duplicate/" + magazine.value.travelId, { params: { magazineId: route.params.magazineId } })
        .then(() => {
          alert("일정 가져오기 성공!");
          router.push({ name: "mypage" });
        });
    }
  });
};

const owner = ref(false);
const checkOwner = () => {
  console.log(userInfo.value);
  console.log(magazine.value.userId);

  if (userInfo.value === magazine.value.userId) {
    owner.value = true;
  }
};
</script>

<template>
  <!-- <div class="wrapper mx-52 mt-32"> -->
  <div class="wrapper" style="padding: 5% 20%">
    <nav>
      <HeaderNav />
    </nav>
    <div class="magazine-main col mt-32 gowun-batang-regular">
      <p class="text-5xl font-bold pl-5">{{ magazine.magazineTitle }}</p>
      <p class="text-lg text-right">
        <span class="text-sm text-gray-600">공유 횟수 :</span>
        {{ magazine.magazineHit }}
      </p>
      <p class="text-lg text-right pb-2">
        <span class="text-sm text-gray-600">작성자 :</span>
        {{ magazine.userId }}
      </p>
      <hr />
      <div
        class="flex flex-col bg-[#F7F7FB] px-10"
        v-for="(data, index) in magazine.magazineDetailDtoList"
        :key="index"
      >
        <div class="text-xl font-bold text-gray-600 pt-5">
          #{{ index + 1 }} {{ data.placeDto.loc }}
          <hr />
        </div>
        <div class="flex my-10" v-if="index % 2 == 0">
          <template v-if="data.img">
            <div v-if="data.isWide" class="relative flex w-11/12 overflow-hidden">
              <img class="relative z-10" src="/src/assets/img/polaroidFrame1.png" alt="" />
              <img class="absolute z-0 object-cover w-full h-full" :src="`${data.img}`" alt="" />
              <p class="absolute z-20 text-xl bottom-2 left-8">{{ data.placeDto.address }}</p>
            </div>
            <div v-else class="relative flex w-1/2 overflow-hidden">
              <img class="relative z-10" src="/src/assets/img/polaroidFrame2.png" alt="" />
              <img class="absolute z-0 object-cover w-full h-full" :src="`${data.img}`" alt="" />
              <p class="absolute z-20 text-xl bottom-4 left-6">{{ data.placeDto.address }}</p>
            </div>
          </template>
          <div v-if="data.content != null" class="relative flex w-full ml-10 items-center justify-center">
            <img class="z-10 w-full" :src="`/src/assets/img/torn_paper/torn_paper_${(index % 6) + 1}.png`" alt="" />
            <p class="absolute z-20 text-wrap text-xl text-gray-700 w-96">
              {{ data.content }}
            </p>
          </div>
        </div>
        <div class="flex my-10" v-else>
          <div v-if="data.content != null" class="relative flex w-full mr-10 items-center justify-center">
            <img class="z-10 w-full" :src="`/src/assets/img/torn_paper/torn_paper_${(index % 6) + 1}.png`" alt="" />
            <p class="absolute z-20 text-wrap text-xl text-gray-700 w-96">
              {{ data.content }}
            </p>
          </div>
          <template v-if="data.img">
            <div v-if="data.isWide" class="relative flex w-11/12 overflow-hidden">
              <img class="relative z-10" src="/src/assets/img/polaroidFrame1.png" alt="" />
              <img class="absolute z-0 object-cover w-full h-full" :src="`${data.img}`" alt="" />
              <p class="absolute z-20 text-xl bottom-2 left-8">{{ data.placeDto.address }}</p>
            </div>
            <div v-else class="relative flex w-1/2 overflow-hidden">
              <img class="relative z-10" src="/src/assets/img/polaroidFrame2.png" alt="" />
              <img class="absolute z-0 object-cover w-full h-full" :src="`${data.img}`" alt="" />
              <p class="absolute z-20 text-xl bottom-4 left-6">{{ data.placeDto.address }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="my-10 flex justify-between">
      <button
        class="border rounded-xl border-gray-300 p-1 px-2 hover:bg-gray-100"
        @click="router.push({ name: 'magazineMain' })"
      >
        목록으로
      </button>
      <div class="flex space-x-3 justify-end">
        <button
          v-if="owner"
          class="border rounded-xl border-gray-300 p-1 px-2 hover:bg-gray-100"
          @click="modifyMagazine"
        >
          수정하기
        </button>
        <button
          v-if="owner"
          class="border rounded-xl border-gray-300 p-1 px-2 hover:bg-red-100"
          @click="deleteMagazine"
        >
          삭제하기
        </button>
        <button v-else class="border rounded-xl border-gray-300 p-1 px-2 hover:bg-blue-100" @click="duplicateMagazine">
          가져오기
        </button>
      </div>
    </div>
    <div>
      <p class="text-3xl mt-10 font-bold border-b-4">Comments</p>
      <div class="mt-7 flex items-center">
        <InputText class="w-full h-9" type="text" v-model="currComment" />
        <button class="w-1/12 items-center bg-gray-100 mx-2 h-9 rounded-md" @click="pushComment">확인</button>
      </div>
      <div class="border p-3 m-5 bg-gray-100 rounded-md" v-for="comment in comments" :key="comment.comment_id">
        <p class="pb-2 text-xl">{{ comment.userId }}</p>
        <hr />
        <p>{{ comment.comment }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
