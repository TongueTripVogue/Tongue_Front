<script setup>
import { ref } from "vue";
defineProps({
  userInfo: Object,
});

// const userInfo = ref({
//   name: "김싸피",
//   magazineCnt: 5,
//   followerNo: 10,
//   hit: 100,
//   point: 2000,
//   img: "",
// });
</script>

<template>
  <div class="user-profile-card flex flex-col justify-center items-center">
    <div class="">
      <!-- <img v-if="userInfo.img != ''" src="" alt="" /> -->
      <!-- <img v-else src="/src/assets/img/아이유.jpg" class="w-auto h-72 rounded-full p-2 border" alt="" /> -->
      <img src="/src/assets/img/아이유.jpg" class="w-auto h-72 rounded-full p-2 border" alt="" />
    </div>
    <div>
      <div class="px-10 pt-10 text-gray-500 text-lg">
        <span class="text-2xl text-[#293c6c] font-bold pr-2">{{ userInfo }}</span
        >님 반갑습니다
        <hr />
      </div>
      <!-- <div class="user-profile-info">
        <div>
          <p>매거진 수</p>
          <p>{{ userInfo.magazineCnt }}</p>
        </div>
        <div>
          <p>팔로워 수</p>
          <p>{{ userInfo.followerNo }}</p>
        </div>
        <div>
          <p>추천 수</p>
          <p>{{ userInfo.hit }}</p>
        </div>
        <div>
          <p>포인트</p>
          <p>{{ userInfo.point }}</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.user-profile-card {
  display: flex;
  margin-bottom: 80px;
}

.user-profile-img {
  border-radius: 8pt;
  width: 190px;
  margin-right: 30px;
}

.user-profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin-left: 20px; */
}

.user-profile-info > div {
  width: 150px;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.user-name {
  font-size: 18pt;
  font-weight: bold;
}
</style>
