<script setup>
</script>

<template>
  <div class="gemini-section">
    <div class="gemini-text">
				<div class="gemini-explain"> Get Recommendations <br>For Your Travel Plan
				<a onclick="location.href='${root}/map/gemini_prompt.jsp'" class="btn-gemini">Go!</a>
				</div>
			</div>
			<div class="gemini-img">
				<img alt="" src="/src/assets/img/Google-Gemini-AI-Logo.png" style="height:150px;">
			</div>
  </div>
</template>

<style scoped>
.gemini-section {
	display: flex;
	padding: 5% 15%;
	background: linear-gradient(217deg, rgb(7 16 21), rgba(255, 0, 0, 0)
		70.71%), linear-gradient(127deg, #f8f9fa, rgba(0, 255, 0, 0) 70.71%),
		linear-gradient(336deg, rgba(0, 0, 255, .8), rgba(0, 0, 255, 0) 70.71%);
	align-items: center;
	justify-content: center;
}

.gemini-img {
	width: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.gemini-text {
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.gemini-explain{
	font-size: 1.8rem;
	font-family:"Georama", sans-serif;
	font-weight: 500;
	color: #4b4b4b;
}

.btn-gemini {
	font-family:"Georama", sans-serif;
	color: #ffff;
	font-size: 1.6rem;
	font-weight: 600;
	position: relative;
	text-decoration: wavy underline #0759ff;
}

.btn-gemini:hover {
	color: #0759ff;
}
</style>