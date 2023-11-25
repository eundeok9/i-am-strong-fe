<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
let token = sessionStorage.getItem("accessToken");

const dealAmount = ref();
const area = ref();
// 선택한 아파트의 매매가 평균과 평수 평균
const dealDeposit = ref(0);
const dealArea = ref(0);
const URL = "/server";
let sidos = ref([]);
let guguns = ref([]);
let dongs = ref([]);
let apts = ref([]);

let sidoName = ref("");
let gugunName = ref("");
let dongName = ref("");
let aptName = ref("");

let sidoCode = ref("");
let gugunCode = ref("");
let dongCode = ref("");
let aptCode = ref("");

onMounted(() => {
  axios({
    method: "get",
    url: URL + "/dong/sido_list",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      sidos.value = response.data.data_body;
    })
    .catch((error) => {
      console.error(error);
    });
});

const sidoFunc = function () {
  sidoName.value = document.querySelector("#sido>option:checked").value;
  sidoCode.value = document.querySelector("#sido>option:checked").id;
  let gugunList = document.getElementById("gugun");
  let dongList = document.getElementById("dong");
  gugunList.length = 1;
  dongList.length = 1;
  getGugunList(sidoCode.value);
};

const gugunFunc = function () {
  gugunName.value = document.querySelector("#gugun>option:checked").value;
  gugunCode.value = document.querySelector("#gugun>option:checked").id;
  let dongList = document.getElementById("dong");
  let aptList = document.getElementById("apt");
  dongList.length = 1;
  aptList.length = 1;
  getDongList(gugunCode.value);
};

const dongFunc = function () {
  dongName.value = document.querySelector("#dong>option:checked").value;
  dongCode.value = document.querySelector("#dong>option:checked").id;
  let aptList = document.getElementById("apt");
  aptList.length = 1;
  getAptList(dongCode.value);
};

const aptFunc = function () {
  aptName.value = document.querySelector("#apt>option:checked").value;
  aptCode.value = document.querySelector("#apt>option:checked").id;
  dealDeposit.value = document.querySelector("#apt>option:checked").dealDeposit;
  dealArea.value = document.querySelector("#apt>option:checked").dealArea;
  console.log(dealDeposit.value);
};

const getGugunList = function (sidoCode) {
  axios({
    method: "get",
    url: URL + "/dong/gugun_list/" + sidoCode,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      guguns.value = response.data.data_body;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getDongList = (gugunCode) => {
  axios({
    method: "get",
    url: URL + "/dong/dong_list/" + gugunCode,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    },
  })
    .then((response) => {
      dongs.value = response.data.data_body;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getAptList = (dongCode) => {
  console.log(dongCode);
  axios({
    method: "get",
    url: URL + `/report/apartList/${dongCode}`,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
      console.log(response);
      apts.value = response.data.data_body;
    })
    .catch((error) => {
      console.log(error);
    });
};

const moveResult = () => {
  router.push({
    name: "report-result", // Make sure to set the name of the route in your router configuration
    query: {
      sidoName: sidoName.value,
      aptCode: aptCode.value,
      aptName: aptName.value,
      dealAmount: dealAmount.value,
      area: area.value,
      dealDeposit: dealDeposit.value,
      dealArea: dealArea.value,
    },
  });
};
</script>

<template>
  <div class="form-container">
    <div class="form-title">전세 매물 정보 입력</div>
    <form action="">
      <div class="drop-down">
        <select class="" id="sido" @change="sidoFunc">
          <option value="">시/도 선택</option>
          <option v-for="sido in sidos" :key="sido.sido_code" :id="sido.sido_code">
            {{ sido.sido_name }}
          </option>
        </select>
        <select class="" id="gugun" @change="gugunFunc">
          <option value="">구/군 선택</option>
          <option v-for="gugun in guguns" :key="gugun.gugun_code" :id="gugun.gugun_code">
            {{ gugun.gugun_name }}
          </option>
        </select>
        <select class="" id="dong" @change="dongFunc">
          <option value="">동 선택</option>
          <option v-for="dong in dongs" :key="dong.dong_code" :id="dong.dong_code">
            {{ dong.dong_name }}
          </option>
        </select>
        <select class="" id="apt" @change="aptFunc">
          <option value="">아파트 선택</option>
          <option
            v-for="apt in apts"
            :key="apt.apt_code"
            :id="apt.apt_code"
            :dealDeposit="apt.dealDeposit"
            :dealArea="apt.dealArea"
          >
            {{ apt.apartment_name }}
          </option>
        </select>
      </div>
      <div class="input-container">
        <input type="text" placeholder="전세가 (단위: 만원)" v-model="dealAmount" />
        <input type="text" placeholder="평 (단위: ㎡)" v-model="area" />
      </div>
      <button type="button" @click="moveResult">입력 완료</button>
    </form>
  </div>
</template>

<style scoped>
@import "../../assets/css/reportForm.css";
</style>
