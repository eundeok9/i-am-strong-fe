<script setup>
import {ref, onMounted, onUnmounted, watch, defineEmits} from "vue";
import axios from "axios";

import heartOn from "@/assets/img/Button_하트 on.png";
import heartOff from "@/assets/img/Button_하트 off.png";

const emit = defineEmits(["closeEmits"]);

const closeDetail = () => {
  // HouseContents.vue에 이벤트를 발생시킴
  emit("show-list");
};

const props = defineProps({
  selectedAptId: String,
  sidoName: String,
  gugunName: String,
});

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

const aptDetail = ref([]);
const aptName = ref("");

const getAptDetail = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/apart/find/" + aptId,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptDetail.value = response.data.data_body;
    aptName.value = aptDetail.value.apt_name;
    console.log(aptDetail.value);
    // console.log('aptName.value : ', aptName.value);
    // console.log('aptDetail.value : ', aptDetail.value);
  } catch (error) {
    console.error(error);
  }
};

const aptHistory = ref([]);

const getAptHistory = async (aptId) => {
  // console.log("getAptHistory 함수인데... getAPtDetail을 조회..! : ", getAptDetail.value)
  try {
    const response = await axios({
      method: "get",
      url: URL + "/apart/history/?apartCode=" + aptId + "&startIndex=0&count=" + historyCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptHistory.value = response.data.data_body;
    console.log(aptHistory.value);
  } catch (error) {
    console.log(error);
  }
};

const historyCount = ref(5); // 초기값을 5로 설정
const reviewsCount = ref(5);
const newsCount = ref(3);

const loadMoreHistory = () => {
  historyCount.value += 5; // count를 5씩 증가
  getAptHistory(props.selectedAptId);
};

const loadMoreReview = () => {
  reviewsCount.value += 5;
  getReviews(props.selectedAptId);
};

const reviewContent = ref(""); // 사용자가 입력한 리뷰 내용을 저장할 ref

// Axios POST 요청을 보내는 함수
const postReview = async () => {
  if (!reviewContent.value.trim()) {
    alert("리뷰 내용을 입력해주세요.");
    return;
  }

  const postData = {
    content: reviewContent.value,
    apt_code: props.selectedAptId,
  };

  try {
    const response = await axios.post(URL + "/review/add/", postData, {
      headers: {
        // 기존 헤더가 있다면 여기에 추가
        Authorization: "Bearer " + token,
      },
    });
    console.log("Response: ", response.data);
    // 성공적으로 리뷰가 등록된 후에는 reviewContent를 초기화
    reviewContent.value = "";
    getReviews(props.selectedAptId);
  } catch (error) {
    console.error("Error:", error);
  }
};

const aptReviews = ref([]);

const getReviews = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/review/findlist?aptCode=" + aptId + "&startIndex=0&count=" + reviewsCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptReviews.value = response.data.data_body;
    console.log("아파트리뷰", aptReviews.value);
  } catch (error) {
    console.log(error);
  }
};

const aptNewsList = ref([]);
const getNews = async (aptId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/news?aptCode=" + aptId + "&startIndex=0&count=" + newsCount.value,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
    });
    aptNewsList.value = response.data.data_body;
    console.log(aptNewsList.value);
  } catch (error) {
    console.log(error);
  }
};

// 설명을 잘라주는 함수
const truncateDescription = (description) => {
  const maxLength = 30;
  return description.length > maxLength ? description.substring(0, maxLength) + " ..." : description;
};

// 제목 눌렀을 때, 외부 링크를 통해 기사본문 연결해주는 함수
const clickNewsTitle = (param) => {
  console.log("afasdfas fasd : ", param);
  // window.open 으로 새 탭에서 열기
  window.open(param, "_blank");
  // window.location.href = aptNewsList.value.link
};

onMounted(() => {
  getAptDetail(props.selectedAptId);
  getAptHistory(props.selectedAptId);
  getReviews(props.selectedAptId);
  getNews(props.selectedAptId);
});

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
        console.log(URL + "/like/add/" + apt.apt_id + "/1");
        console.log(err);
      });
  }
}
</script>

<template>
  <!-- 1. 디테일 페이지 타이틀 -->
  <div class="detail-title-container">
    <div @click="closeDetail" class="back-icon"><span class="material-symbols-rounded"> arrow_back_ios_new </span></div>
    <div class="detail-title">{{ aptDetail.dong }}</div>
    <div class="empty-space"></div>
  </div>
  <!-- 2. 디테일 페이지 아파트 정보 -->
  <div class="detail-info-container">
    <div class="detail-info">
      <h4 class="detail-aptname" style="font-weight: bold">{{ aptDetail.apt_name }}</h4>
      <div class="detail-address">{{ props.sidoName }} {{ props.gugunName }} {{ aptDetail.dong }} {{ aptDetail.bonbun }}</div>
    </div>
    <div class="detail-icon">
      <a href="#" @click="toggleImage(aptDetail)">
        <img id="heartButton" :src="aptDetail.like_status ? heartOn : heartOff" alt="heart Button" style="width: 45px; height: 45px" />
      </a>
    </div>
  </div>
  <!-- 3. 디테일 페이지 거래 내역 리스트 -->
  <div class="deal-list-container">
    <h4 class="deal-list-title">거래내역</h4>
    <table>
      <thead>
        <tr>
          <th style="width: 30%">거래일</th>
          <th>유형</th>
          <th>면적</th>
          <th>층</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="history in aptHistory" :key="history.apt_id" :id="history.apt_id">
          <td>{{ history.deal_date }}</td>
          <td>{{ history.type }}</td>
          <td>{{ history.area }}</td>
          <td>{{ history.floor }}</td>
          <td>{{ history.deal_amount }}</td>
        </tr>
      </tbody>
    </table>
    <div class="btn-container"><button class="load-more-btn" @click="loadMoreHistory">더보기</button></div>
  </div>
  <!-- 4. 아파트 리뷰 -->
  <div class="deal-review-container">
    <h4 class="deal-review-title">아파트 리뷰</h4>
    <div class="review-input-container"><input class="review-input" type="text" placeholder="리뷰 입력..." v-model="reviewContent" /><button class="review-btn" @click="postReview">입력</button></div>
    <div style="margin-top: 20px; padding: 5px" v-if="aptReviews.length == 0">작성된 댓글이 없습니다.</div>
    <div style="margin-top: 20px; padding: 5px" v-else v-for="review in aptReviews" :key="review.review_id" :id="review.review_id">
      <div class="review-write-info">
        <div style="font-weight: bold; font-size: 18px">{{ review.writer_name }}</div>
        <div style="color: lightgray">{{ review.create_time }}</div>
      </div>
      <div class="review-content">{{ review.content }}</div>
    </div>
    <div class="btn-container"><button v-if="aptReviews.length != 0" class="load-more-btn" @click="loadMoreReview">더보기</button></div>
  </div>
  <!-- 5. 뉴스 기사 -->
  <div class="news-container">
    <h4 class="news-title" style="font-weight: bold; margin-bottom: 20px">관련 뉴스</h4>
    <div class="news-item" v-for="aptNews in aptNewsList" :key="aptNews.link" @click="clickNewsTitle(aptNews.link)">
      <div class="news-img"><img :src="aptNews.thumbnail_link" alt="" /></div>
      <div class="news-info">
        <div class="news-info-title">{{ aptNews.title }}</div>
        <div class="news-content">{{ truncateDescription(aptNews.description) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../../assets/css/hdetail.css";
</style>
