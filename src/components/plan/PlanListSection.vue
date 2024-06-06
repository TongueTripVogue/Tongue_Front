<script setup>
import { ref, onMounted } from "vue";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import axios from "axios";
import ScrollPanel from "primevue/scrollpanel";
import Stepper from "primevue/stepper";
import StepperPanel from "primevue/stepperpanel";
import Splitter from "primevue/splitter";
import SplitterPanel from "primevue/splitterpanel";

const { VITE_GEMINI_SERVICEKEY, VITE_TMAP_SERVICE_API, VITE_RESTAPI_SERVICE_URL } = import.meta.env;

const props = defineProps({
  planList: Object,
});
const emit = defineEmits(["update:selectedItems", "draw-polyline"]);

// 아이템 목록
const items = ref([]);

// 선택된 아이템 목록
const selectedItems = ref([]);
selectedItems.value = props.planList;

// 드래그 시작 시 실행될 함수 (List 1)
const dragStart = (index) => {
  event.dataTransfer.setData("text/plain", index);
};

// 드래그 시작 시 실행될 함수 (List 2)
const dragStartSelected = (index) => {
  event.dataTransfer.setData("text/plain", index + "selected");
};

// 드롭 이벤트 처리 함수
const drop = (dropIndex) => {
  const dragIndex = event.dataTransfer.getData("text/plain");
  const draggedItem = items.value[dragIndex];
  items.value.splice(dragIndex, 1);
  items.value.splice(dropIndex, 0, draggedItem);
};

// 드롭 이벤트 처리 함수 (List 2)
const dropSelected = (dropIndex) => {
  const dragIndex = event.dataTransfer.getData("text/plain").replace("selected", "");
  const draggedItem = selectedItems.value[dragIndex];
  selectedItems.value.splice(dragIndex, 1);
  selectedItems.value.splice(dropIndex, 0, draggedItem);
};

// 드래그 오버 이벤트 처리 함수
const dragOver = (event) => {
  event.preventDefault();
};

// List 1에서 List 2로 아이템 이동
const moveToSelectedList = (index) => {
  const selectedItem = items.value.splice(index, 1)[0];
  selectedItems.value.push(selectedItem);
  // console.log("선택된 것 : ", selectedItems.value)
  emit("draw-polyline", selectedItems.value);
};

// POI 검색에서 List 2로 아이템 이동
const moveToSelectedList2 = (index) => {
  const selectedItem = POISearchResult.value.splice(index, 1)[0];
  selectedItems.value.push(
    new Plan(
      0,
      selectedItem.loc,
      "",
      "",
      0,
      selectedItem.lat,
      selectedItem.lon,
      selectedItem.address,
      selectedItems.value.length
    )
  );
  // console.log("선택된 것 : ", selectedItems.value)
  emit("draw-polyline", selectedItems.value);
};

// List 2에서 List 1로 아이템 이동
const moveToList1 = (index) => {
  const deselectedItem = selectedItems.value.splice(index, 1)[0];
  items.value.push(deselectedItem);
};

// 경로 확인하기 버튼 클릭 시 실행될 함수
const drawPolyLine = () => {
  emit("draw-polyline", selectedItems.value);
};

const POISearchResult = ref([]);
const searchKeyword = ref();
const POISearchBtn = async () => {
  var headers = {};
  headers["appKey"] = VITE_TMAP_SERVICE_API;
  // console.log(searchKeyword);

  try {
    // const response = await axios.get("https://apis.openapi.sk.com/tmap/pois/search/around", {
    //   method: "GET", // 요청 방식
    //   headers: headers,
    //   params: {
    //     version: "1",
    //     format: "json",
    //     categories: searchKeyword.value, // 카테고리 정보
    //     resCoordType: "EPSG3857",
    //     reqCoordType: "WGS84GEO",
    //     searchType: "name",
    //     searchtypCd: "A",
    //     radius: 1,
    //     centerLon: selectedItems.value[0].lon,
    //     centerLat: selectedItems.value[0].lat,
    //     count: 10,
    //   },0
    // });

    const response = await axios.get("https://apis.openapi.sk.com/tmap/pois", {
        headers: headers,
        params: {
          version: "1",
          format: "json",
          callback: "result",
          searchKeyword: searchKeyword.value,
          resCoordType: "EPSG3857",
          reqCoordType: "WGS84GEO",
          centerLon: selectedItems.value[0].lon,
          centerLat: selectedItems.value[0].lat,
          searchType: "all",
          searchtypCd: "A",
          radius: 3,
          count: 10,
        },
      });
    console.log(response.data.searchPoiInfo.pois.poi);
    var resultpoisData = response.data.searchPoiInfo.pois.poi;

    POISearchResult.value = [];

    // 3. POI 마커 표시
    for (var k in resultpoisData) {
      // POI 마커 정보 저장
      var noorLat = Number(resultpoisData[k].noorLat);
      var noorLon = Number(resultpoisData[k].noorLon);
      var name = resultpoisData[k].name;

      var pointCng = new Tmapv2.Point(noorLon, noorLat);
      var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);

      var lat = projectionCng._lat;
      var lon = projectionCng._lng;
      // POI 정보의 ID
      var id = resultpoisData[k].id;
      POISearchResult.value.push({
        loc: name,
        lat: lat,
        address:
          resultpoisData[k].middleAddrName +
          " " +
          resultpoisData[k].lowerAddrName +
          " " +
          resultpoisData[k].detailAddrName,
        lon: lon,
      });
    }
  } catch (error) {
    console.error(error);
  }
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

  constructor(day, loc, transport, des, cost, lat, lon, address, id) {
    this.day = day;
    this.loc = loc;
    this.transport = transport;
    this.des = des;
    this.cost = cost;
    this.lat = lat;
    this.lon = lon;
    this.address = address;
    this.id = id;
  }
}
</script>

<template>
  <div class="absolute top-10 mt-3 bg-white flex flex-row py-6 pt-6 noto-sans-kr-regular">
    <!-- List 1: 아이템 목록 -->
    <div class="list-container w-1/2">
      <Splitter style="height: 100%" class="relative z-50" layout="vertical">
        <SplitterPanel class="flex flex-col align-items-center justify-content-center h-1/2">
          <div class="flex my-3 ml-3">
            <InputText type="text" class="w-4/5 h-9 mr-2" v-model="searchKeyword" />
            <Button
              icon="pi pi-search"
              severity="secondary"
              rounded
              outlined
              @click="POISearchBtn"
              aria-label="Search"
            />
          </div>
          <div class="h-4/5">
            <ScrollPanel style="width: 100%; height: 90%">
              <div
                class="itemDesign"
                v-for="(item, index) in POISearchResult"
                :key="index"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragover="dragOver"
                @drop="drop(index)"
                @click="moveToSelectedList2(index)"
              >
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <div class="flex flex-row">
                      <div class="text-base font-bold">{{ item.loc }}</div>
                      <div class="flex align-items-center ml-3"></div>
                    </div>
                    <div class="text-sm text-gray-500">{{ item.address }}</div>
                  </div>
                </div>
              </div>
            </ScrollPanel>
          </div>
        </SplitterPanel>
        <SplitterPanel class="flex flex-col align-items-center justify-content-center h-1/2">
          <div class="text-2xl bg-gray-200 mt-2 p-3 rounded-lg flex items-center poetsen-one-regular">
            <i class="pi pi-sparkles text-sm mr-2"></i>
            Gemini Travel
          </div>
          <div class="items-list h-4/5">
            <ScrollPanel style="width: 100%; height: 100%">
              <div
                class="itemDesign"
                v-for="(item, index) in items"
                :key="index"
                draggable="true"
                @dragstart="dragStart(index)"
                @dragover="dragOver"
                @drop="drop(index)"
                @click="moveToSelectedList(index)"
              >
                <div class="flex flex-row justify-between">
                  <div class="flex flex-col">
                    <div class="flex flex-row">
                      <div class="text-base font-bold">{{ item.loc }}</div>
                      <div class="flex align-items-center ml-3"></div>
                    </div>
                    <div class="text-sm text-gray-500">{{ item.address }}</div>
                  </div>
                  <div class="flex justify-center items-center">{{ item.cost }} 원</div>
                </div>
              </div>
            </ScrollPanel>
          </div>
        </SplitterPanel>
      </Splitter>
    </div>

    <!-- List 2: 선택된 아이템 목록 -->
    <div class="list-container w-1/2">
      <div>
        <div class="text-2xl bg-blue-100 p-3 rounded-lg flex items-center poetsen-one-regular text-[#293c6c]">
          <i class="pi pi-tag text-sm mr-2 "></i>
          Tour Course
        </div>
      </div>
      <div class="flex-auto h-4/5">
        <ScrollPanel style="width: 100%; height: 100%">
          <div
            class="itemDesign"
            v-for="(item, index) in selectedItems"
            :key="index"
            draggable="true"
            @dragstart="dragStartSelected(index)"
            @dragover="dragOver"
            @drop="dropSelected(index)"
            @click="moveToList1(index)"
          >
            <div class="flex flex-row justify-between">
              <div class="flex flex-col">
                <div class="flex flex-row">
                  <div class="text-base font-bold">{{ item.loc }}</div>
                  <div class="flex align-items-center ml-3">
                    <!-- <i class="pi pi-tag text-sm"></i> -->
                    <!-- <span>{{ item.day }} 일차</span> -->
                  </div>
                </div>
                <div class="text-sm text-gray-500">{{ item.address }}</div>
              </div>
              <div class="flex justify-center items-center text-sm">{{ item.cost }} 원</div>
            </div>
          </div>
        </ScrollPanel>
      </div>
      <!-- <div class="selected-items-list overflow-y-auto h-4/5 p-4">
        <div class="itemDesign" v-for="(item, index) in selectedItems" :key="index" draggable="true"
          @dragstart="dragStartSelected(index)" @dragover="dragOver" @drop="dropSelected(index)"
          @click="moveToList1(index)">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col">
              <div class="flex flex-row">
                <div class="text-base font-bold">{{ item.loc }}</div>
                <div class="flex align-items-center ml-3">
                  <i class="pi pi-tag text-sm"></i>
                </div>
              </div>
              <div class="text-sm">{{ item.address }}</div>
            </div>
            <div class="flex justify-center items-center text-sm">
              {{ item.cost }} 원
            </div>
          </div>
        </div>
      </div> -->
      <div class="float-right">
        <button class="rounded-3xl border p-2 hover:bg-blue-100" @click="drawPolyLine">경로 확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-container {
  margin-bottom: 20px;
  padding: 10px;
}

.itemDesign {
  /* border: 1px solid #e4e4e4; */
  border-radius: 10px;
  padding: 7px 12px;
  margin: 10px;
  box-shadow: 5px 5px 10px;
  background: #fff;
  margin-bottom: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.15);
}

.itemDesign:hover {
  cursor: pointer;
  background-color: #eaeaea;
}
</style>
