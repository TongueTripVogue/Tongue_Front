<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;
const router = useRouter();

// import Card from "primevue/card";
// const props = defineProps({ plan: Object, reusePlan: Object, magazine: Object });
const props = defineProps({
  plan: Object,
  index: Object,
});

console.log(props.index);

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000, // 타임아웃 설정
});

const MagazineMemo = () => {
  console.log("기록하러 가자아ㅏㅏㅏㅏㅏㅏ" + props.plan.travelId);
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance
    .post("/magazine/memo/" + props.plan.travelId)
    .then((res) => {
      console.log(res.data);
      router.push({ name: "memo", params: { magazineId: res.data } });
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateBtn = () => {
  let travelId = props.plan.travelId;
  router.push({ name: "update", params: { travelId: travelId } });
};

const hasMagazine = ref(false);

const checkMagazine = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance.get("/magazine/check/" + props.plan.travelId).then((res) => {
    console.log(res.data);
    if (res.data.length > 0) {
      hasMagazine.value = true;
    }
  });
};
checkMagazine();

const viewPlan = () => {
  
};

const deletePlan = () => {
  if (confirm("정말 삭제하시겠습니까?")) {
    try {
      instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
      instance.post("/travel/delete/" + props.plan.travelId).then();
      alert("일정 삭제 성공");
      window.location.reload();
    } catch (e) {
      console.log(e);
      alert("일정 삭제 실패");
    }
  }
};
</script>

<template>
  <div class="plan-card mx-3 mt-5">
    <div class="overflow-hidden h-36 rounded-xl">
      <img class="z-0 object-cover" :src="`/src/assets/img/route_img/route${(index % 5) + 1}.jpg`" alt="" />
    </div>
    <div class="plan-card-title justify-center flex relative z-20 text-black font-bold text-2xl">
      <div class="">{{ plan.travelName }}</div>
    </div>
    <div v-if="!hasMagazine" class="plan-card-options flex relative">
      <div @click="MagazineMemo">기록하기</div>
      <div @click="updateBtn">수정하기</div>
    </div>
    <div v-else class="plan-card-options flex relative">
      <div @click="viewPlan">보러가기</div>
      <div @click="deletePlan">삭제하기</div>
    </div>
  </div>
</template>

<style scoped>
.plan-card {
  border-radius: 8pt;
  width: 200px;
}
.plan-card-title {
  top: -120px;
}

.plan-card-thumbnail {
  z-index: 0;
  border-radius: 8pt;
}
.plan-card-options {
  display: flex;
  justify-content: space-between;
  color: black;
  font-weight: 400;
  z-index: 20;
  padding: 0 10px;
  top: -60px;
}
</style>
