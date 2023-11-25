<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";

const router = useRouter();
const memberStore = useMemberStore();
const { isLogin } = storeToRefs(memberStore);
const { userLogin, getUserInfo } = memberStore;

// 사용자 Login 정보 입력값 받기
const loginUser = ref({
  email: "",
  password: "",
});

// 사용자 email, password 정보를 입력하지 않은 경우 처리
const emailErrMsg = ref("");
const passwordErrMsg = ref("");
watch(
  () => loginUser.value.email,
  (value) => {
    let len = value.length;
    if (len == 0) {
      emailErrMsg.value = "아이디를 입력해주세요.";
    } else {
      emailErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => loginUser.value.password,
  (value) => {
    let len = value.length;
    if (len == 0) {
      passwordErrMsg.value = "비밀번호를 입력해주세요.";
    } else {
      passwordErrMsg.value = "";
    }
  },
  { immediate: true }
);

// 사용자가 submit 버튼 클릭 시 실행
function onSubmit() {
  // 입력값이 다 들어왔는지 확인하기
  if (emailErrMsg.value) {
    alert(emailErrMsg.value);
  } else if (passwordErrMsg.value) {
    alert(passwordErrMsg.value);
  } else {
    login(); // API호출 데이터 처리 후 router 이동
  }
}

// login api 호출
const login = async () => {
  await userLogin(loginUser.value);
  let token = sessionStorage.getItem("accessToken");
  console.log(token);
  if (isLogin && token) {
    // 토큰 처리 (미완성)
    getUserInfo(11);
    router.push("/");
  } else {
    alert("로그인 실패!");
  }
};

const moveRegist = () => {
  router.push("/regist");
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="logo">로그인</div>
      <form id="loginForm" class="login-form" @submit.prevent="onSubmit">
        <input type="hidden" name="action" value="login" />
        <input
          type="email"
          id="userid"
          name="userid"
          placeholder="이메일"
          v-model="loginUser.email"
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          autocomplete="off"
          v-model="loginUser.password"
          placeholder="비밀번호"
        />
        <!-- <div class="text-danger mb-2">${msg}</div> -->
        <button type="submit" class="login-btn">로그인</button>
      </form>
      <div class="register" @click="moveRegist">회원가입</div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/login.css";
</style>
