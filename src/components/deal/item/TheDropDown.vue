<script setup>
import { ref, onMounted, defineEmits } from "vue";
import axios from "axios";

const URL = "/server";
let sidos = ref([]);
let guguns = ref([]);
let dongs = ref([]);

let sidoName = ref("");
let gugunName = ref("");
let dongName = ref("");

let sidoCode = ref("");
let gugunCode = ref("");
let dongCode = ref("");

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
      console.log(URL + "/dong/sido_list");
      console.log(error);
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
  dongList.length = 1;
  getDongList(gugunCode.value);
};

const dongFunc = function () {
  dongName.value = document.querySelector("#dong>option:checked").value;
  dongCode.value = document.querySelector("#dong>option:checked").id;
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
      // console.log("불러와진 구/군 리스트 : ", gugunOptions.value);
    })
    .catch((error) => {
      console.log(error);
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
      // console.log("불러와진 동 리스트 : ", dongOptions.value);
    })
    .catch((error) => {
      console.log(error);
    });
};

const emit = defineEmits(["search"]);

const search = () => {
  if (!sidoCode.value || !gugunCode.value || !dongCode.value) {
    alert("조건을 정확히 입력하세요!");
    return;
  }
  emit("search", sidoName.value, gugunName.value, dongCode.value);
};
</script>

<template>
  <div class="drop-down">
    <select class="" id="sido" @change="sidoFunc">
      <option value="">시/도 선택</option>
      <option v-for="sido in sidos" :key="sido.sido_code" :id="sido.sido_code">
        {{ sido.sido_name }}
      </option>
    </select>
    <select class="" id="gugun" @change="gugunFunc">
      <option value="">구/군 선택</option>
      <option
        v-for="gugun in guguns"
        :key="gugun.gugun_code"
        :id="gugun.gugun_code"
      >
        {{ gugun.gugun_name }}
      </option>
    </select>
    <select class="" id="dong" @change="dongFunc">
      <option value="">동 선택</option>
      <option v-for="dong in dongs" :key="dong.dong_code" :id="dong.dong_code">
        {{ dong.dong_name }}
      </option>
    </select>
    <button class="btn" @click="search">검색</button>
  </div>
</template>

<style scoped>
#sido,
#gugun,
#dong {
  width: 25%;
  height: 50%;
  border-radius: 10px;
  padding: 10px;
  margin: 0 10px;
}
.drop-down {
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100px;
  border-bottom: 1px solid #d3d3d3;
}

.btn {
  width: 80px;
  height: 50px;
  background-color: #ff71a5;
  border-radius: 10px;
  text-align: center;
  line-height: 100%;
  margin-left: 18px;
  /* font-weight: bold; */
  font-size: 18px;
  color: whitesmoke;
}

.btn:hover,
.btn:active {
  background-color: #ff71a5 !important;
  color: whitesmoke !important;
}
</style>
