<script setup>
import { ref } from "vue";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import HeaderNav from "@/components/common/HeaderNav.vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { GoogleGenerativeAI } from "@google/generative-ai";
const { VITE_GEMINI_SERVICEKEY, VITE_TMAP_SERVICE_API, VITE_RESTAPI_SERVICE_URL } = import.meta.env;

// magazine_original은 매거진 데이터를 담고 있는 반응형 변수입니다.
const magazine_original = ref({});

const route = useRoute();
const router = useRouter();

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000000, // 타임아웃 설정
});

// 매거진 정보를 가져오는 함수입니다.
const getMagazineMemoInfo = () => {
  console.log(route.params.magazineId);
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance.get("/magazine/" + route.params.magazineId).then((res) => {
    console.log(res.data);
    magazine_original.value = res.data;

    // 정렬 로직
    magazine_original.value.magazineDetailDtoList.sort(function (a, b) {
      if (a.travelInfoDto.order > b.travelInfoDto.order) {
        return 1;
      }
      if (a.travelInfoDto.order < b.travelInfoDto.order) {
        return -1;
      }
    });

    // 각 매거진 디테일 항목에 base64Image 속성을 추가합니다.
    magazine_original.value.magazineDetailDtoList.forEach((detail) => {
      detail.base64Image = "";
    });
  });
};

getMagazineMemoInfo();

// 파일 입력 변경 시 호출되는 함수입니다.
const onFileChange = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    encodeImageToBase64(file, index);
  }
};

// 이미지를 base64로 인코딩하는 함수입니다.
const encodeImageToBase64 = (file, index) => {
  const reader = new FileReader();
  reader.onload = () => {
    magazine_original.value.magazineDetailDtoList[index].img = reader.result;
    console.log("Base64 Encoded Image:", magazine_original.value.magazineDetailDtoList[index].img);
  };
  reader.onerror = (error) => {
    console.error("Error reading file:", error);
  };
  reader.readAsDataURL(file); // 파일을 base64 데이터 URL로 변환합니다.
};

// 매거진을 저장하는 함수입니다.
const saveMagazine = () => {
  magazine_original.value.coverImg = magazine_original.value.magazineDetailDtoList[0].img;
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  console.log(magazine_original.value);
  instance
    .post("/magazine/save/" + magazine_original.value.magazineId, magazine_original.value)
    .then(() => {
      console.log("저장하기");
      console.log(magazine_original.value);
      // window.location.reload();
    })
    .then();
  alert("저장 완료");
};

// 매거진을 만드는 함수입니다.
const makeMagazine = async () => {
  magazine_original.value.coverImg = magazine_original.value.magazineDetailDtoList[0].img;
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  try {
    await instance.post("/magazine/save/" + magazine_original.value.magazineId, magazine_original.value).then();
    alert("매거진 생성에 성공!!");
    router.push({
      name: "magazineView",
      params: { magazineId: magazine_original.value.magazineId },
    });
  } catch (e) {
    console.log(e);
    alert("매거진 생성에 실패하였습니다.");
    return;
  }
};

// 매거진 디테일 항목을 삭제하는 함수입니다.
const deleteColumn = (index) => {
  magazine_original.value.magazineDetailDtoList.splice(index, 1);
};

// 등록한 이미지 수정하기
const deleteImage = (index) => {
  magazine_original.value.magazineDetailDtoList[index].img = "";
};

// gemini로 글 작성 추천 받기
const genAI = new GoogleGenerativeAI(VITE_GEMINI_SERVICEKEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// gemini 검색 정보
const generateText = (index) => {
  const promptInfo = ref({
    place: magazine_original.value.magazineDetailDtoList[index].placeDto.loc,
    address: magazine_original.value.magazineDetailDtoList[index].placeDto.address,
    des: magazine_original.value.magazineDetailDtoList[index].placeDto.des,
    text: magazine_original.value.magazineDetailDtoList[index].content,
  });

  console.log(promptInfo.value);
  run();
  async function run() {
    let prompt = "";
    prompt += `여행을 가서 주소가 "${promptInfo.value.address}"인 ${promptInfo.value.place}에 놀러 갔는데, `;
    prompt += `해당 장소에 대한 설명은 '${promptInfo.value.des}'이고`;
    prompt += `이를 바탕으로 내가 쓴 내용인 '${promptInfo.value.text}'를 매거진에 리뷰 작성하듯이 100자 내외로 작성해줘`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    magazine_original.value.magazineDetailDtoList[index].content = text;
  }
};
</script>

<template>
  <div class="noto-sans-kr-regular">
    <link rel="stylesheet" href="https://unpkg.com/@material-tailwind/html@latest/styles/material-tailwind.css" />
    <div>
      <div class="wrapper">
        <nav>
          <HeaderNav />
        </nav>
      </div>
      <div class="magazine-memo mx-72 mt-32 flex flex-col justify-center items-center">
        <div class="text-3xl mb-5">
          매거진 기록하기
          <hr />
        </div>
        <div class="relative h-16 w-1/2 min-w-[200px]">
          <input
            class="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-2xl font-bold text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            placeholder=""
            v-model="magazine_original.magazineTitle"
          />
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-xl peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
          >
            Magazine Title
          </label>
        </div>
        <!-- <p class="text-3xl font-medium">{{ magazine_original.magazineTitle }}</p> -->

        <div
          v-for="(magazine_detail, index) in magazine_original.magazineDetailDtoList"
          :key="magazine_detail.travelInfoDto.day"
          class="magazine-memo-day"
        >
          <!-- <p class="my-6 text-2xl" v-if="magazine_detail.travelInfoDto.order === 1">
          {{ magazine_detail.travelInfoDto.day }}일차
        </p> -->
          <div class="m-5 flex items-center">
            <!-- <img class="w-52 mr-6" v-if="magazine_detail.img === ''" src="/src/assets/img/no_img.png" alt="" /> -->
            <div class="w-52 mr-6 flex justify-center items-center" v-if="!magazine_detail.base64Image">
              <div v-if="magazine_detail.img" class="">
                <button class="delete-button pi pi-times mt-2" @click="deleteImage(index)"></button>
                <img class="w-52 mr-6 rounded-xl" :src="magazine_detail.img" alt="Uploaded Image" />
              </div>
              <div v-else class="w-full max-w-md p-3 bg-white rounded-lg shadow-lg">
                <div
                  class="bg-gray-100 p-8 text-center rounded-lg border-dashed border-2 border-gray-300 hover:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                  id="dropzone"
                >
                  <label for="fileInput" class="cursor-pointer flex flex-col items-center space-y-2">
                    <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span class="text-gray-600">Insert Image</span>
                  </label>
                  <input class="hidden" type="file" id="fileInput" @change="onFileChange($event, index)" />
                </div>
              </div>
            </div>
            <div class="flex flex-col items-start space-y-1">
              <div class="text-lg font-semibold">{{ magazine_detail.placeDto.loc }}</div>
              <div class="text-gray-600">위치 : {{ magazine_detail.placeDto.address }}</div>
              <div class="flex flex-col items-end">
                <button class="text-blue-600 text-sm pr-8 pb-1" @click="generateText(index)">Gemini로 글을 생성하겠습니까?</button>
                <div class="flex items-start">
                  <Textarea v-model="magazine_detail.content" rows="5" cols="70" />
                  <div class="flex flex-col items-baseline">
                    <button class="delete-button pi pi-times ml-3 mt-2" @click="deleteColumn(index)"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end mb-10">
          <Button class="m-2 h-5" label="저장하기" severity="secondary" text @click="saveMagazine" />
          <Button class="m-2 h-5" label="매거진 만들기" severity="info" text @click="makeMagazine" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.delete-button {
  color: lightgray;
}

.delete-button:hover {
  color: red;
}
</style>
