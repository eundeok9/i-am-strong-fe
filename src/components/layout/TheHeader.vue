<script setup>
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useMemberStore} from "@/stores/member";
import {useRouter} from "vue-router";

// 세션이든 토큰이든 로그인 여부 가져와서 저장
const memberStore = useMemberStore();
const {isLogin, isValidToken, isAdmin, userName, userEmail} = storeToRefs(memberStore);
// const isLogin = ref(true);
const router = useRouter();

const moveMain = () => {
  router.push("/");
};

const moveBoard = () => {
  if (!isLogin.value) {
    alert("로그인을 해주세요!");
    router.push("/login");
  } else {
    router.push("/notice");
  }
};

const moveQNA = () => {
  if (!isLogin.value) {
    alert("로그인을 해주세요!");
    router.push("/login");
  } else {
    router.push("/question");
  }
};

const moveDeal = () => {
  if (!isLogin.value) {
    alert("로그인을 해주세요!");
    router.push("/login");
  } else {
    router.push("/deal");
  }
};

const moveReport = () => {
  if (!isLogin.value) {
    alert("로그인을 해주세요!");
    router.push("/login");
  } else {
    router.push("/report");
  }
};

const moveLogin = () => {
  router.push("/login");
};

const moveMyPage = () => {
  router.push("/mypage");
};

const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  isLogin.value = false;
  isValidToken.value = false;
  userName.value = "";
  isAdmin.value = false;
  userEmail.value = "";
  router.replace("/");
};
</script>

<template>
  <header class="header">
    <div class="header-logo">
      <div>
        <a class="logo" @click="moveMain">I AM<br />STRONG</a>
      </div>
    </div>

    <nav>
      <li v-if="isLogin">
        <a id="user-info">{{ userName }}님 안녕하세요 😊 </a>
      </li>
      <li><a class="find-apt" @click="moveDeal">거래정보</a></li>
      <li><a class="find-apt" @click="moveReport">전세 분석</a></li>
      <li><a class="logo-notice" @click="moveBoard">공지사항</a></li>
      <li><a class="logo-notice" @click="moveQNA">Q&A</a></li>
      <li v-if="!isLogin"><a @click="moveLogin" id="login">로그인</a></li>
      <li v-if="isLogin"><a @click="moveMyPage" id="mypage">마이페이지</a></li>
      <li v-if="isLogin"><a @click.prevent="logout">로그아웃</a></li>
    </nav>
  </header>
</template>

<style scoped>
@import "../../assets/css/header.css";
</style>
