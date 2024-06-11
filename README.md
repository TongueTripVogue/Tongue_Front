# 🚝Tongue - Front-end
```git
⚡ 2024.03 ~ 2024.06
```
&nbsp;&nbsp; <strong>Tongue: </strong> 
LLM을 활용한 여행 계획부터 기록, 공유까지 전반을 아우르는 통합 여행 플랫폼
<br />

## ⭐ Using Stacks <br/>
```git
📌 Vue, Vite, HTML, CSS, Tailwind, Javascript, axios
```

### &nbsp;&nbsp; Vue 사용 이유<br />
> ▪️ SPA(Single Page Applicatione)로 구조가 가벼운 반응형 시스템 제공 <br/>
> ▪️ 사용자 경험을 향상시키고 애플리케이션의 성능 개선의 장점이 존재

<br />

## ⭐ Gemini API를 사용하여 매거진 글 작성 <br/>

<div align="center">
      <img src="https://github.com/TongueTripVogue/Tongue_Front/assets/80882259/4b8a4bbf-29de-44e6-86e4-ff3e812db1db"  width="800" >
</div> <br/>

### 🔎 사용목적 <br />
> 여행을 기록하고 싶지만 글 작성을 어려워하거나 매거진에 맞게 꾸며진 글을 작성하고 싶은 사용자들에게 도움을 주기 위함 <br />

### 💻 구현방법 : <br/>
> ▪️ DB에 저장된 관광지 정보(이름, 주소, 짧은 설명) + 사용자 작성 경험을 사용하여 매거진에 맞는 문체로 100자 내외의 글 작성을 위한 prompt 전송<br />
> ▪️ response 값 text 형식으로 변환하여 input 영역에 들어가는 content에 값 할당<br />
<br/>
<div align="center">
      <img width="800" alt="image" src="https://github.com/TongueTripVogue/Tongue_Front/assets/80882259/7cd2ed0a-ff5d-43d3-b0ff-c2ab3ab5ca28">
      <img width="800" alt="image" src="https://github.com/TongueTripVogue/Tongue_Front/assets/80882259/6caec61b-968e-4d4b-b8eb-f331a4cad6b1">
</div>
<br />
