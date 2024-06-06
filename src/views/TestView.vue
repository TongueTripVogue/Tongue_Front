<template>
  <div>
    <input type="file" @change="onFileChange" />
    <div v-if="base64Image">
      <p>Base64 Encoded Image:</p>
      <textarea :value="base64Image" readonly></textarea>
      <img  :src="base64Image" alt="Uploaded Image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// base64 문자열을 저장할 반응형 변수 선언
const base64Image = ref('');

// 파일 입력 변경 시 호출되는 함수
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    encodeImageToBase64(file);
  }
};

// 이미지를 base64로 인코딩하는 함수
const encodeImageToBase64 = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    base64Image.value = reader.result;
    console.log('Base64 Encoded Image:', base64Image.value); // 변환된 결과를 출력
  };
  reader.onerror = (error) => {
    console.error('Error reading file:', error);
  };
  reader.readAsDataURL(file); // 파일을 base64 데이터 URL로 변환
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 200px;
}
img {
  height: 100px;
  /* max-width: 100%;
  height: auto; */
}
</style>
