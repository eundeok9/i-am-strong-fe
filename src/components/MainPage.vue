<script setup>
import {useRouter} from "vue-router";

const route = useRouter();

const moveDeal = () => {
  route.push("/report");
};
</script>

<template>
  <div class="main">
    <!-- 매물 찾는 부분 시작 -->
    <div class="main-start-container">
      <div class="main-title-text">I AM STRONG</div>
      <div class="main-content-text">
        'I AM STRONG(전셉니다)'은 과거 실거래가를 기반으로 <br />
        전세 매물의 실거래가 추이, 위험률 분석 등의 서비스를 제공해드립니다.
      </div>
      <div class="main-about-container">
        <div class="main-about-card">
          <img src="../assets/img/icon1.png" alt="" />
          <p>과거 실거래가를 기반으로<br />현재 전세가를 비교 분석합니다.</p>
        </div>
        <div class="main-about-card">
          <img src="../assets/img/icon2.png" alt="" />
          <p>전세 매물의 위험률을 <br />(전세가 / 최근 1년간 매매가 평균)<br />기반으로 분석합니다.</p>
        </div>
        <div class="main-about-card">
          <img src="../assets/img/icon3.png" alt="" />
          <p>
            아파트 ㎡당 전세 평균 가격을<br />
            최신 거래가 기준으로 비교합니다.
          </p>
        </div>
      </div>
      <div class="main-apt-btn-container">
        <button type="button" class="search-btn" @click="moveDeal">분석하러 가기</button>
      </div>
    </div>
    <div class="help-container">
      <h3 class="help-title">🧐 거래 전, 참고하면 좋아요!</h3>
      <div class="help-video-container">
        <div class="help-video">
          <iframe src="https://www.youtube.com/embed/8fPwkK3RohA?si=rKlAha6FpcMWNYla" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="help-video">
          <iframe src="https://www.youtube.com/embed/fVDpAMBRpdo?si=kPRrgE1UBklM9iuq" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <div class="help-video">
          <iframe src="https://www.youtube.com/embed/LDv9eVKZUJI?si=Sv8qmmEYFfPZgIkg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/main.css";
</style>
