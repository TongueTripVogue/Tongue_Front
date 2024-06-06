<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import HeaderNav from "@/components/common/HeaderNav.vue";
import axios from "axios";
import PickList from "primevue/picklist";
import InputText from "primevue/inputtext";
import { ProductService } from "@/service/ProductService";
import ProgressSpinner from "primevue/progressspinner";
import PlanListSection from "@/components/plan/PlanListSection.vue";
const { VITE_GEMINI_SERVICEKEY, VITE_TMAP_SERVICE_API, VITE_RESTAPI_SERVICE_URL } = import.meta.env;

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: VITE_RESTAPI_SERVICE_URL, // 서버 주소
  timeout: 6000, // 타임아웃 설정
});

const genAI = new GoogleGenerativeAI(VITE_GEMINI_SERVICEKEY);
const route = useRoute();
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const router = useRouter();
const products = ref(null);
const showSpin = ref(true);

// onMounted(() => {
//     ProductService.getProductsSmall().then((data) => (products.value = [data, []]));
// });

// gemini 검색 정보
let demand = route.query;
let lat = 37.39843974939604; // 위도
let lon = 127.10972941510465; // 경도
var map,
  marker,
  markers = [];
var markerArr = [];
var idx = 0;
const isUpdate = ref(false);

const initMap = () => {
  try {
    map = new Tmapv2.Map("map_div", {
      center: new Tmapv2.LatLng(lat, lon),
      width: "60%",
      height: "925px",
      zoom: 12,
      zoomControl: true,
      scrollwheel: true,
    });

    searchKey();
  } catch (e) {
    console.log(e);
  }
};

async function run() {
  let prompt = "";
  prompt += `${demand.location} ${demand.days - 1}박${demand.days
    }일 여행 코스 알려줘. 일정은 최대 3개씩 하루에 두 번, ${demand.days * 3}총 개만 알려줘.`;
  // prompt += "처음 시작 위치는 서울역으로 해줘";
  prompt += "걷기 다니기 좋은 곳 출발 지점과 도착지점을 함께 추천해줘.";
  prompt += "각 일정에는 날짜(1), 장소, 이동 수단(버스, 도보, 차량) 중 하나, 장소 간단한 설명, 예상 비용(1000).";
  prompt += "json format으로 추천해줘, 컬럼명은 영어, value는 한국어로 제공해줘";
  prompt += `컬럼명는 다음과 같아, 날짜는 "day",장소는 "loc", 이동 수단은 "transport", 도착 장소에 대한 간단한 설명은 "des".`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  const jsonData = text.split("```")[1].split("json")[1];
  console.log(JSON.parse(jsonData));
  return JSON.parse(jsonData);
}

const planList = ref([]);

async function getTravelData() {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");

  try {
    const res = await instance.get(`/travel/view/${route.params.travelId}`);
    return res.data;
  } catch (e) {
    console.log(e);
    console.log("정보 없음");
    return null;
  }
}

showPlan();
async function showPlan() {
  // console.log(route.params)
  if (route.params.travelId != undefined) {
    isUpdate.value = true;
    // ResultTravelName
    try {
      const travelItem = await getTravelData();

      console.log(travelItem.travelDay);
      // planList.value = exampleData.value;
      ResultTravelName.value = travelItem.travelName;
      ResultTravelDay.value = travelItem.travelDay;
      for (let i = 0; i < travelItem.travelInfoDtoList.length; i++) {
        let travelItemDetail = travelItem.travelInfoDtoList[i];
        planList.value.push(
          new Plan(
            travelItemDetail.day,
            travelItemDetail.placeDto.loc,
            travelItemDetail.placeDto.transport,
            travelItemDetail.placeDto.des,
            travelItemDetail.placeDto.cost
          )
        );
      }
      initMap();
      // onMounted(() => {
      //     initMap();
      // })
    } catch (e) {
      console.log(e);
    }
  } else {
    const planData = await run();
    for (let i = 0; i < planData.length; i++) {
      planList.value.push(
        new Plan(planData[i].day, planData[i].loc, planData[i].transport, planData[i].des, planData[i].cost)
      );
    }
    initMap();
  }
  // console.log("가공 데이터 : ", planList.value)
}

const searchKey = async () => {
  var headers = {};
  headers["appKey"] = VITE_TMAP_SERVICE_API;
  for (var pl = 0; pl < planList.value.length; pl++) {
    var searchKeyword = planList.value[pl].loc;
    // console.log(searchKeyword);

    try {
      const response = await axios.get("https://apis.openapi.sk.com/tmap/pois", {
        headers: headers,
        params: {
          version: "1",
          format: "json",
          callback: "result",
          searchKeyword: searchKeyword,
          resCoordType: "EPSG3857",
          reqCoordType: "WGS84GEO",
          count: 10,
        },
      });

      const resultpoisData = response.data.searchPoiInfo.pois.poi;
      // 기존 마커, 팝업 제거
      if (markerArr.length > 0) {
        for (var i in markerArr) {
          markerArr[i].setMap(null);
        }
        markerArr = [];
      }

      for (var k in resultpoisData) {
        // console.log(resultpoisData[k].newAddressList.newAddress[0].fullAddressRoad)
        var noorLat = Number(resultpoisData[k].noorLat);
        var noorLon = Number(resultpoisData[k].noorLon);
        var name = resultpoisData[k].name;

        var pointCng = new Tmapv2.Point(noorLon, noorLat);
        var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

        var lat = projectionCng._lat;
        var lon = projectionCng._lng;

        planList.value[pl].lon = lon;
        planList.value[pl].lat = lat;
        planList.value[pl].address = resultpoisData[k].newAddressList.newAddress[0].fullAddressRoad;
        planList.value[pl].id = ++idx;
        break;
      }
    } catch (e) {
      console.log(e);
    }
  }
  console.log(planList.value);
  products.value = [planList.value, []];
  showMap();
};

var marker_s, marker_e, waypoint;
var resultMarkerArr = [];
//경로그림정보
var drawInfoArr = [];
var resultInfoArr = [];

const resultRoot = ref({
  totalDistance: "",
  totalFare: "",
  totalTime: "",
});

const showMap = () => {
  var innerHtml = ""; // Search Reulsts 결과값 노출 위한 변수
  var positionBounds = new Tmapv2.LatLngBounds(); //맵에 결과물 확인 하기 위한 LatLngBounds객체 생성

  // 기존 마커, 팝업 제거
  if (markerArr.length > 0) {
    for (var i in markerArr) {
      markerArr[i].setMap(null);
    }
    markerArr = [];
  }

  if (resultMarkerArr.length > 0) {
    for (var i2 in resultMarkerArr) {
      resultMarkerArr[i2].setMap(null);
    }
    resultMarkerArr = [];
  }

  drawInfoArr = [];

  // 시작
  marker_s = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(planList.value[0].lat, planList.value[0].lon),
    icon: "./assets/img/marker_icon/culture.png",
    iconSize: new Tmapv2.Size(30, 30),
    map: map,
  });
  resultMarkerArr.push(marker_s);
  // 도착
  marker_e = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(
      planList.value[planList.value.length - 1].lat,
      planList.value[planList.value.length - 1].lon
    ),
    icon: "./assets/img/marker_icon/culture.png",
    iconSize: new Tmapv2.Size(30, 30),
    map: map,
  });
  resultMarkerArr.push(marker_e);

  // 3. 경유지 심볼 찍기
  var temp = [];
  var markerPosition;
  markerPosition = new Tmapv2.LatLng(planList.value[0].lat, planList.value[0].lon);
  positionBounds.extend(markerPosition);
  markerPosition = new Tmapv2.LatLng(
    planList.value[planList.value.length - 1].lat,
    planList.value[planList.value.length - 1].lon
  );
  positionBounds.extend(markerPosition);
  for (var plan = 1; plan < planList.value.length - 1; plan++) {
    marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(planList.value[plan].lat, planList.value[plan].lon),
      icon: "/src/assets/img/marker_icon/culture.png",
      iconSize: new Tmapv2.Size(30, 30),
      map: map,
    });
    resultMarkerArr.push(marker);

    temp.push({
      viaPointId: "test0" + plan,
      viaPointName: "name0" + plan,
      viaX: planList.value[plan].lon + "",
      viaY: planList.value[plan].lat + "",
    });
    markerPosition = new Tmapv2.LatLng(planList.value[plan].lat, planList.value[plan].lon);
    positionBounds.extend(markerPosition);
  }

  // 4. 경로탐색 API 사용요청
  var searchOption = "1";
  var headers = {};
  headers["appKey"] = VITE_TMAP_SERVICE_API;
  headers["Content-Type"] = "application/json";

  var param = JSON.stringify({
    startName: "출발지",
    startX: planList.value[0].lon + "",
    startY: planList.value[0].lat + "",
    startTime: "201708081103",
    endName: "도착지",
    endX: planList.value[planList.value.length - 1].lon + "",
    endY: planList.value[planList.value.length - 1].lat + "",
    viaPoints: temp,
    reqCoordType: "WGS84GEO",
    resCoordType: "EPSG3857",
    searchOption: searchOption,
  });

  console.log(param);
  const resultData = ref([]);
  const resultFeatures = ref([]);
  const makeMap = async () => {
    try {
      const response = await axios
        .post("https://apis.openapi.sk.com/tmap/routes/routeSequential30?version=1&format=json", param, { headers })
        .then((res) => {
          console.log(res.data);
          resultData.value = res.data.properties;
          resultFeatures.value = res.data.features;
        });

      console.log(resultData.value);
      console.log(resultFeatures.value);

      resultRoot.value = {
        totalDistance: resultData.value.totalDistance,
        totalFare: resultData.value.totalFare,
        totalTime: resultData.value.totalTime,
      };

      // 기존 라인 초기화
      if (resultInfoArr.length > 0) {
        for (let i in resultInfoArr) {
          resultInfoArr[i].setMap(null);
        }
        resultInfoArr = [];
      }

      for (let i in resultFeatures.value) {
        const geometry = resultFeatures.value[i].geometry;
        const properties = resultFeatures.value[i].properties;
        let polyline_;

        console.log(geometry);
        console.log(properties);
        if (geometry.type === "LineString") {
          for (let j in geometry.coordinates) {
            const latlng = new Tmapv2.Point(geometry.coordinates[j][0], geometry.coordinates[j][1]);
            const convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
            const convertChange = new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng);

            drawInfoArr.push(convertChange);
          }

          polyline_ = new Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: "#FF0000",
            strokeWeight: 6,
            map: map,
          });
          resultInfoArr.push(polyline_);
        } else {
          let markerImg = "";
          let size = null;
          let markTitle, markLabel;

          if (properties.pointType === "S") {
            // 출발지 마커
            markerImg = "/src/assets/img/marker_icon/food.png";
            size = new Tmapv2.Size(30, 30);
            markTitle = "출발지";
            // markLabel = "출발지";
          } else if (properties.pointType === "E") {
            // 도착지 마커
            markerImg = "/src/assets/img/marker_icon/food.png";
            size = new Tmapv2.Size(30, 30);
            markTitle = "도착지";
            // markLabel = "도착지";
          } else {
            // 각 포인트 마커
            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
            size = new Tmapv2.Size(8, 8);
            markTitle = "경유지";
            // markLabel = "경유지";
          }

          const latlon = new Tmapv2.Point(geometry.coordinates[0], geometry.coordinates[1]);
          const convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlon);

          const marker_p = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng),
            icon: markerImg,
            iconSize: size,
            title: markTitle,
            label: markLabel,
            map: map,
          });

          resultMarkerArr.push(marker_p);
        }
      }

      map.panToBounds(positionBounds); // 확장된 bounds의 중심으로 이동시키기
      map.zoomOut();
      showSpin.value = false;
    } catch (error) {
      console.log(error);
    }
  };
  makeMap(); //poly line
};

const handleSelectedItemsUpdate = (newSelectedItems) => {
  this.updatedSelectedItems = newSelectedItems;
  console.log("업데이트된 선택된 아이템:", this.updatedSelectedItems);
};
const handleDrawPolyLine = (selectedItems) => {
  console.log("경로 확인하기 버튼 클릭됨:", selectedItems);
  planList.value = selectedItems;
  showSpin.value = true;
  showMap();
  // 여기서 경로를 그리는 로직을 추가할 수 있습니다.
};

// 계획 저장
const ResultTravelName = ref("");
const ResultTravelDay = ref("");
const sendPlanList = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  const sendParams = new URLSearchParams();
  sendParams.append("travelName", ResultTravelName.value);
  if (demand.days == undefined) demand.days = 0;
  sendParams.append("travelDay", demand.days);

  instance
    .post("/travel/regist", planList.value, {
      params: sendParams,
    })
    .then((res) => {
      console.log(res);
      console.log("등록 성공");
      router.push({ name: "mypage" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const updatePlanList = () => {
  instance.defaults.headers.common["Authorization"] = sessionStorage.getItem("userToken");
  const sendParams = new URLSearchParams();
  sendParams.append("travelName", ResultTravelName.value);
  sendParams.append("travelDay", ResultTravelDay.value);

  instance
    .post(`/travel/update/${route.params.travelId}`, planList.value, {
      params: sendParams,
    })
    .then((res) => {
      console.log(res);
      console.log("수정 성공");
      router.push({ name: "mypage" });
    })
    .catch((err) => {
      console.log(err);
      console.log("수정 실패");
    });
};

class Plan {
  day;
  loc;
  transport;
  des;
  cost;
  lat;
  lon;
  address;
  id;

  constructor(day, loc, transport, des, cost) {
    this.day = day;
    this.loc = loc;
    this.transport = transport;
    this.des = des;
    if (cost == null) {
      this.cost = 0;
    } else {
      this.cost = cost;
    }
  }
}
</script>

<template>
  <div>
    <div>
      <div class="wrapper">
        <nav>
          <HeaderNav />
        </nav>
      </div>
      <div v-if="showSpin"
        class="card flex flex-col justify-center items-center absolute z-20 w-full h-full justify-content-center bg-black opacity-90">
        <div>
          <div class="rounded-sm p-5">
            <img src="/src/assets/img/제주도.gif" alt="" class="h-96 w-96 rounded-2xl">
          </div>
          <div class="text-white text-center  text-3xl m-10 bagel-fat-one-regular">" 제주도 여행 어떠세요? "</div>
        </div>
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
          animationDuration=".5s" aria-label="Custom ProgressSpinner" />
      </div>
      <div class="z-0 relative">
        <div ref="tmap" class="relative float-right" id="map_div"></div>
        <PlanListSection @update:selectedItems="handleSelectedItemsUpdate" @draw-polyline="handleDrawPolyLine" class=""
          style="width: 40%; height: 870px" :planList="planList" />

        <div class="gap-2 noto-sans-kr-bold flex flex-col p-3 mt-3 
        absolute top-20 right-20 rounded-xl bg-white opacity-90 itemDesign">
          <div class="poetsen-one-regular text-2xl">Information</div>
          <hr>
          <div><span class="text-gray-600">총 거리 : </span> {{ resultRoot.totalDistance }} m</div>
          <div><span class="text-gray-600">총 요금 : </span> {{ resultRoot.totalFare }} 원</div>
          <div><span class="text-gray-600">총 시간 : </span> {{ Math.ceil(resultRoot.totalTime / 60) }} 분</div>

          <div v-if="!isUpdate" class="gap-2 flex flex-col">
            <div>
              <span class="text-gray-600">제목 : </span>
              <InputText type="text" v-model="ResultTravelName" class="w-4/5 h-10" />
            </div>
            <button @click="sendPlanList" class="rounded-3xl border p-2 hover:bg-blue-100">계획 저장</button>
          </div>
          <div v-else class="gap-2 flex flex-col">
            <div>
              <span class="text-gray-600">제목 : </span>
              <InputText type="text" v-model="ResultTravelName" class="w-4/5 h-10" />
            </div>
            <button @click="updatePlanList" class="rounded-3xl border p-2 hover:bg-blue-100">계획 수정</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="z-0 relative">
      <div ref="tmap" class="relative float-right" id="map_div"></div>
      <PlanListSection
        @update:selectedItems="handleSelectedItemsUpdate"
        @draw-polyline="handleDrawPolyLine"
        class=""
        style="width: 40%; height: 870px"
        :planList="planList"
      />

      <div class="flex flex-col p-1 absolute top-20 right-20 bg-indigo-200 noto-sans-kr-regular">
        <div>총 거리 : {{ resultRoot.totalDistance }}</div>
        <div>총 요금: {{ resultRoot.totalFare }}</div>
        <div>총 시간 : {{ resultRoot.totalTime }}</div>

        <div v-if="!isUpdate">
          <div>
            <InputText type="text" v-model="ResultTravelName" class="w-4/5" />
          </div>
          <button @click="sendPlanList" class="bg-blue-500">계획 저장</button>
        </div>
        <div v-else>
          <div>
            <InputText type="text" v-model="ResultTravelName" class="w-4/5" />
          </div>
          <button @click="updatePlanList" class="bg-blue-500">계획 수정</button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.itemDesign {
  /* border: 1px solid #e4e4e4; */
  border-radius: 10px;
  padding: 7px 12px;
  margin: 10px;
  box-shadow: 5px 5px 10px;
  background: #fff;
  width: 15rem;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.15);
}
</style>
