<script setup>
import { ref } from "vue";
import userInfoCard from "@/components/member/userInfoCard.vue";
import planInfo from "@/components/mypage/planCard.vue";
import blankPlanCard from "@/components/mypage/blankPlanCard.vue";
import HeaderNav from "@/components/common/HeaderNav.vue";
import MagazineCover from "@/components/magazine/MagazineCover.vue";
import axios from "axios";
const { VITE_RESTAPI_SERVICE_URL } = import.meta.env;

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 1000000, // 타임아웃 설정
});

const totalPlan = ref([]);

const plans = ref([]);
const magazines = ref([]);
const reusePlans = ref([]);
const userInfo = ref();

const getInfo = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  instance
    .get("/mypage/user")
    .then((res) => {
      console.log(res.data.magazineDtoList);
      totalPlan.value = res.data.travelDtoList;
      plans.value = totalPlan.value.filter((val) => val.travelOwner == true);
      console.log(plans.value);
      reusePlans.value = totalPlan.value.filter((val) => val.travelOwner == false);
      console.log(reusePlans.value);
      // magazines.value = res.data.magazineDtoList;
    })
    .catch((err) => {
      console.log(err);
    });
  instance
    .get("/mypage/magazine")
    .then((res) => {
      console.log(res.data);
      magazines.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  instance.get("/user/userInfo").then((res) => {
    console.log(res.data);
    userInfo.value = res.data;
  });
};

getInfo();
</script>

<template>
  <div class="noto-sans-kr-regular">
    <div class="wrapper">
      <nav>
        <HeaderNav />
      </nav>
    </div>
    <div class="my-page mx-72 mt-32">
      <userInfoCard :userInfo="userInfo" />
      <div class="bg-[#F7F7FB] p-12 rounded-xl">
        <div>
          <div class="text-2xl font-bold text-[#293c6c]">나의 일정</div>
          <hr />
          <div v-if="plans.length > 0" class="plans flex-wrap">
            <planInfo v-for="(plan, index) in plans" :key="plan.travelId" :plan="plan" :index="index" />
          </div>
          <div v-else>
            <blankPlanCard :message="'일정'" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-[#293c6c]">가져온 일정</div>
          <hr />
          <div v-if="reusePlans.length > 0" class="plans flex-wrap">
            <planInfo v-for="(reusePlan, index) in reusePlans" :key="reusePlan.id" :plan="reusePlan" :index="index" />
          </div>
          <div v-else>
            <blankPlanCard :message="'일정'" />
          </div>
        </div>
        <div>
          <div class="text-2xl font-bold text-[#293c6c]">나의 매거진</div>
          <hr />
          <div v-if="magazines.length > 0" class="plans flex-wrap">
            <MagazineCover v-for="magazine in magazines" :key="magazine.magazine_id" :magazine="magazine" />
          </div>
          <div v-else>
            <blankPlanCard :message="'매거진'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-page {
  display: flex;
  flex-direction: column;
}

.plans {
  display: flex;
  flex-direction: row;
}

.my-page > div > p {
  font-size: 18pt;
  font-weight: bold;
  color: rgb(74, 74, 74);
}
</style>
