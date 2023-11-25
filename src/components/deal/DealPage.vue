<script setup>
import TheMap from "./item/TheMap.vue";
import TheDropDown from "./item/TheDropDown.vue";
import HList from "./item/HList.vue";
import HDetail from "./item/HDetail.vue";
import {useRouter} from "vue-router";
import {ref, onMounted} from "vue";
import axios from "axios";

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

const router = useRouter();

const activeView = ref("HListVue");
const selectedAptId = ref("");
const isAptSelected = ref(false);
const isLikeStatus = ref(false);

const showDetail = (aptId) => {
  console.log("클릭 이벤트 부모에서 감지");
  selectedAptId.value = aptId;
  isAptSelected.value = true;
  activeView.value = "HDetailVue";
};

const showList = () => {
  getAptList();
  isAptSelected.value = false;
  activeView.value = "HListVue";
};

const aptList = ref([]);
const startIndex = ref(0);
const historyCount = ref(50);
const dong_code = ref("");

const sido_name = ref("");
const gugun_name = ref("");

const getAptList = async () => {
  await axios({
    method: "get",
    url: `${URL}/apart/findlist/?dongCode=${dong_code.value}&startIndex=${startIndex.value}&count=${historyCount.value}&isLike=${isLikeStatus.value}`,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      aptList.value = res.data.data_body;
      activeView.value = "HListVue";
    })
    .catch((err) => {
      console.log(err);
    });
};

const changeIsLikeStatus = (isLike) => {
  isLikeStatus.value = isLike;
  getAptList();
};

onMounted(async () => {
  // 아파트 리스트 가져오기
  // await getAptList();
});

const onSearch = async (sidoName, gugunName, dongCode) => {
  console.log("검색~~~~~~~~~~~~~~~~~~~");
  startIndex.value = 0;
  historyCount.value = 15;
  sido_name.value = sidoName;
  gugun_name.value = gugunName;
  dong_code.value = dongCode;
  await getAptList();
  console.log(aptList.value);
  activeView.value = "HListVue";
  // router.push({
  //   name: "deal",
  // });
};
</script>

<template>
  <div class="deal-container">
    <div class="map-container">
      <TheDropDown @search="onSearch" />
      <TheMap :aptList="aptList" :selectedAptId="selectedAptId" :isAptSelected="isAptSelected" />
    </div>
    <div class="info-container">
      <HList v-if="activeView === 'HListVue'" @clickHouseInfo="showDetail" @onLikeTypeChange="changeIsLikeStatus" :aptList="aptList" :sidoName="sido_name" :gugunName="gugun_name" />
      <HDetail v-else :selectedAptId="selectedAptId" @show-list="showList" :sidoName="sido_name" :gugunName="gugun_name" />
    </div>
  </div>
</template>

<style scoped>
.deal-container {
  display: flex;
  flex-direction: row;
  height: 80vh;
}
.map-container {
  width: 70%;
  height: 100%;
}

.info-container {
  border-left: 1px solid #d3d3d3;
  width: 30%;
  height: 100%;
  overflow: hidden scroll;
}

.info-container::-webkit-scrollbar {
  display: none;
}
</style>
