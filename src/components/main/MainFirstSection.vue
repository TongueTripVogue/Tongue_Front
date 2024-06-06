<script setup></script>

<template>
  <div class="main_container pacifico-regular">
    <p class="">Let's Enjoy Your</p>
    <div class="typing">
      <p>Trip In</p>
      <p class="moving">Korea...</p>
    </div>
    <div class="search_container">
      <!-- 관광지 검색 start
				<form class="d-flex my-3" onsubmit="return false;" role="search">
					<button id="btn-search" class="btn btn-md text-content-font"
						type="button" onclick="location.href='${root}/map/triplist.jsp'">
						관광지 검색하러 가기</button>
				</form> -->
    </div>
  </div>
</template>

<style scoped>
/* typing css */
.main_container {
  /* background-color: var(--blue-main-color); */
  width: 100%;
  height: auto;
  position: relative;
  /*  height: 100%; */
  z-index: 0;
  background-image: url("/src/assets/img/dummy_img/kyeong-bok.jpg");
  background-size: cover;
  z-index: 0;
  padding: 15%;
  color: #fff;
  font-size: 50pt;
}

.typing {
  display: flex;
  align-items: baseline;
}

.typing > p {
  color: #fbf9f1;
  font-size: 50pt;
  margin-right: 20px;
}

.typing .moving {
  position: relative;
  color: #fbf9f1;
  letter-spacing: 5px;
  font-size: 4rem;
  overflow: hidden;
  margin-bottom: 0;
  animation: type 5s steps(8) infinite;
  z-index: 2;
}

@keyframes cursorBlink {
  0%,
  75% {
    opacity: 1;
  }

  76%,
  100% {
    opacity: 0;
  }
}

@keyframes type {
  0%,
  100% {
    width: 0px;
  }

  30%,
  60% {
    width: 320px;
  }
}
</style>
