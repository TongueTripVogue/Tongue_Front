<script setup>
import { ref, onMounted } from "vue";
import TravelSearchItem from "@/components/search/TravelSearchItem.vue";
import axios from "axios";
import AreaCardItem from "@/components/region/AreaCardItem.vue";
import { RegionService } from "@/service/RegionService";
import Galleria from "primevue/galleria";
import HeaderNav from "@/components/common/HeaderNav.vue";

const { VITE_PUBLIC_DATA_BASEURL } = import.meta.env;
var map, marker, markers = [];
const infoWindows = ref(new Map());

onMounted(async () => {
  let lat = 37.39843974939604; // 위도
  let lon = 127.10972941510465; // 경도

  try {
    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      lat = position.coords.latitude; // 위도
      lon = position.coords.longitude; // 경도
    }
    console.log(lat, lon);

    map = new Tmapv2.Map("map_div", {
      center: new Tmapv2.LatLng(lat, lon),
      width: "100%",
      height: "895px",
      zoom: 14,
      zoomControl: true,
      scrollwheel: true,
    });

    marker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lat, lon), // Marker의 중심좌표 설정.
      icon: "/src/assets/img/marker_icon/current.png", // Marker의 아이콘.
      iconSize: new Tmapv2.Size(40, 40),
      map: map, // Marker가 표시될 Map 설정.
    });

    markers.push(marker);
  } catch (error) {
    console.error("위치 정보를 가져올 수 없습니다.", error);
  }
});

// 모든 마커를 제거하는 함수입니다.
const removeMarkers = () => {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
};

let params = RegionService.getParams().then((data) => (params = data));
const tourtype = RegionService.getTourTypes().then((data) => {
  tourtype.value = data;
});

// 검색 조건
const searchTravel = (...val) => {
  let url = VITE_PUBLIC_DATA_BASEURL;
  console.log(val[0]);
  console.log(val[1]);
  console.log(val[2]);
  if (val[0] && val[0].length) {
    params.keyword = val[0];
    url = url + `searchKeyword1`;
  } else {
    url = url + `areaBasedList1`;
  }
  if (val[1] != undefined) params.contentTypeId = val[1].code;
  if (val[2] != undefined) params.areaCode = val[2].code;
  params.numOfRows = 30;
  params.pageNo = 1;

  axios
    .get(url, { params: params })
    .then((res) => {
      console.log(res);
      console.log(res.data.response.body.items.item);
      travelList.value = res.data.response.body.items.item;
      removeMarkers();

      for (let travel in travelList.value) {
        let imageSrc = "/src/assets/img/marker_icon/";
        let pin = tourtype.value.filter((item) => {
          return item.code == travelList.value[travel].contenttypeid - "0";
        });
        imageSrc += pin[0].image;

        // Marker 객체 생성.
        marker = new Tmapv2.Marker({
          position: new Tmapv2.LatLng(
            travelList.value[travel].mapy,
            travelList.value[travel].mapx
          ), // Marker의 중심좌표 설정.
          icon: imageSrc, // Marker의 아이콘.
          iconSize: new Tmapv2.Size(40, 40),
          map: map, // Marker가 표시될 Map 설정.
        });
        marker.setMap(map); // Marker가 표시될 Map 설정.
        markers.push(marker);
      }

      try {
        map.setCenter(
          new Tmapv2.LatLng(
            travelList.value[0].mapy,
            travelList.value[0].mapx
          )
        );
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      console.log("결과 없음");
      console.log(err);
    });
};

const travelList = ref([]);

const moveCenter = (val) => {
  console.log(val);
  const uniqueId = `infoWindow_${val.mapy}_${val.mapx}`;
  var content =
    `<div style='position: static; display: flex; flex-direction: column; font-size: 14px; box-shadow: 5px 5px 5px #00000040; border-radius: 10px; top: 410px; left : 800px; width : 250px; background: #FFFFFF 0% 0% no-repeat padding-box; border-radius: 15px;'>` +
    `<div class='info-box' style='padding: 10px;'>` +
    `<p style='margin-bottom: 7px; overflow: hidden;'>` +
    `<span class='tit' style=' font-size: 16px; font-weight: bold;'>${val.title}</span>` +
    `</p>` +
    `<div class='li-addr' style='margin-bottom: 5px; background: url(resources/images/sample/ico-map.svg) no-repeat top 3px left;'>` +
    `<span style='color: #3D6DCC; font-size: 13px;' > 주소 : </span>${val.addr1}` +
    `</div>` +
    `</div>` +
    `<a href='javascript:void(0)' class='btn-close' data-id='${uniqueId}' style='position: absolute; top: 10px; right: 10px; display: block; width: 15px; height: 15px; font-size: 15px; font-weight: 700;'>x</a>` +
    `</div>`;

  const infoWindowInstance = new Tmapv2.InfoWindow({
    position: new Tmapv2.LatLng(val.mapy, val.mapx),
    content: content,
    border: "0px solid #FF0000",
    type: 2,
    map: map,
  });

  infoWindows.value.set(uniqueId, infoWindowInstance);
  map.setCenter(new Tmapv2.LatLng(val.mapy, val.mapx));

  // DOM이 렌더링된 후에 닫기 버튼에 이벤트 리스너를 추가합니다.
  setTimeout(() => {
    const closeButton = document.querySelector(`.btn-close[data-id='${uniqueId}']`);
    if (closeButton) {
      closeButton.addEventListener("click", () => onClose(uniqueId));
    }
  }, 100);
};
// 닫기 아이콘 클릭시 호출되는 함수.
const onClose = (uniqueId) => {
  const infoWindowInstance = infoWindows.value.get(uniqueId);
  if (infoWindowInstance) {
    infoWindowInstance.setVisible(false);
    infoWindows.value.delete(uniqueId);
  }
};
const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);
</script>

<template>
  <div class="noto-sans-kr-regular">
    <div class="wrapper">
      <nav>
        <HeaderNav />
      </nav>
    </div>
    <div class="">
      <div ref="tmap" class="z-0" id="map_div">
      </div>
      <div id="search_box" class="absolute z-10 top-16 flex flex-col items-center justify-center w-full p-6">
        <TravelSearchItem @region-search="searchTravel" />
        <!-- <div class="absolute flex gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 card_t">
              <AreaCardItem v-for="area in travelList" :area="area" :key="area.contenttypeid" class="group w-64"
                @move-to-position="moveCenter" />
            </div> -->
        <!-- 관광지 검색 end -->
        <div class="card absolute flex gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 card_t">
          <Galleria :value="travelList" :responsiveOptions="responsiveOptions" :numVisible="5"
            containerStyle="max-width: 1540px">
            <template #thumbnail="slotProps">
              <!-- <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" /> -->
              <AreaCardItem v-for="area in slotProps" :area="area" :key="area.contenttypeid" class="group w-64"
                @move-to-position="moveCenter" />
            </template>
          </Galleria>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card_t {
  top: 33rem;
}
</style>