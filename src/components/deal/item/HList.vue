<script setup>
import {ref, defineProps, defineEmits} from "vue";
import axios from "axios";
import heartOn from "@/assets/img/Button_하트 on.png";
import heartOff from "@/assets/img/Button_하트 off.png";
const props = defineProps({
  aptList: Array,
  sidoName: String,
  gugunName: String,
});

const emit = defineEmits(["clickHouseInfo", "onLikeTypeChange"]);

const clickHouseInfo = (aptId) => {
  // HouseContents.vue에 이벤트를 발생시킴
  emit("clickHouseInfo", aptId);
};

function toggleImage(apt) {
  // 원래 관심 목록에 등록 된거면 like_status false로 바꾸고, 서버에 반영, aptList 다시 불러오기
  if (apt.like_status) {
    apt.like_status = !apt.like_status;
    axios({
      method: "delete",
      url: URL + "/like/delete/" + apt.apt_id,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // 원래 관심 목록에 등록되지 않았던거면 like_status true로 바꾸고, 서버에 반영, aptList 다시 불러오기
  else if (!apt.like_status) {
    apt.like_status = !apt.like_status;
    axios({
      method: "post",
      url: URL + "/like/add/" + apt.apt_id,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //   location.reload();
}

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

// 찜한 목록만 보기 위한 로직
const onlyLike = ref(false);

const getAllList = () => {
  onlyLike.value = false;
  emit("onLikeTypeChange", onlyLike.value);
};

const getLikeList = () => {
  onlyLike.value = true;
  emit("onLikeTypeChange", onlyLike.value);
};
</script>

<template>
  <div>
    <div v-if="!props.sidoName" class="list-title">거래 정보 조회</div>
    <div v-else class="list-title">{{ props.sidoName }} {{ props.gugunName }}</div>
    <div class="list-result-cnt">
      <div>{{ props.aptList.length }}개의 검색 결과</div>
    </div>
    <div class="list-btn-container">
      <button @click="getAllList">전체 목록 보기</button>
      <button @click="getLikeList">찜한 목록만 보기</button>
    </div>
    <div class="result-item" v-for="apt in props.aptList" :key="apt">
      <div class="result-item-img"><span class="material-symbols-rounded" style="font-size: 40px"> home </span></div>
      <div class="result-item-info" @click="clickHouseInfo(apt.apt_id)" style="cursor: pointer">
        <div>
          <h4 style="margin-bottom: 10px; font-weight: bold">{{ apt.apt_name }}</h4>
        </div>
        <div>{{ props.sidoName }} {{ props.gugunName }} {{ apt.dong }} {{ apt.apt_road_name }}{{ apt_road_name_bonbun }}</div>
      </div>
      <div class="result-item-icon">
        <a @click="toggleImage(apt)">
          <img id="heartButton" :src="apt.like_status ? heartOn : heartOff" alt="heart Button" style="width: 45px; height: 45px" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../../assets/css/hlist.css";
</style>
