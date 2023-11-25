<script setup>
import { ref, watch } from "vue";
import { useMemberStore } from "@/stores/member";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();

const memberStore = useMemberStore();
const { userJoin } = memberStore;
const { isCreate } = storeToRefs(memberStore);

// 사용자 회원가입 입력값 받기
const joinUser = ref({
  password: "",
  email: "",
  name: "",
  admin_password: "",
});
// 사용자 메세지
const msg_pass = ref("최소 6글자 이상 입력해주세요.");
const msg_admin = ref("관리자 비밀번호는 빈칸으로 제출하셔도 됩니다.");

// joinUser.value.password의 입력값이 6글자 이상 된다면 msg값 변경
const getPassword = () => joinUser.value.password;
watch(getPassword, async (newPass) => {
  if (newPass.length >= 6) {
    msg_pass.value = "6글자 이상 확인 완료!";
  }
});

// 사용자 비밀번호 재확인 하기
const re_password = ref("");
// 사용자 비밀번호 재확인이 변경되면 입력한 비밀번호와 같은지 확인하고 메세지 보내기
watch(re_password, async (newPass) => {
  if (newPass.length >= 6 && newPass !== joinUser.value.password) {
    msg_rePass.value = "입력하신 비밀번호가 다릅니다.";
    rePasswordErrMsg.value = "비밀번호를 다시 확인해주세요.";
  } else if (newPass == joinUser.value.password) {
    msg_rePass.value = "확인 완료!";
    rePasswordErrMsg.value = "";
  } else {
    msg_rePass.value = "최소 6글자 이상 입력해주세요.";
  }
});

// 사용자가 입력값을 다 입력했는지 확인
// 사용자 email, password 정보를 입력하지 않은 경우 처리
const emailErrMsg = ref("");
const passwordErrMsg = ref("");
const rePasswordErrMsg = ref("");
const nameErrMsg = ref("");
watch(
  () => joinUser.value.email,
  (value) => {
    let len = value.length;
    if (len == 0) {
      emailErrMsg.value = "이메일을 입력해주세요.";
    } else {
      emailErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => joinUser.value.password,
  (value) => {
    let len = value.length;
    if (len == 0 || len < 6) {
      passwordErrMsg.value = "비밀번호를 다시 입력해주세요.";
    } else {
      passwordErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => nameErrMsg,
  (value) => {
    let len = value.length;
    if (len == 0) {
      nameErrMsg.value = "이름을 입력해주세요.";
    } else nameErrMsg.value = "";
  }
);
// 사용자가 submit 버튼을 눌렀을 때 실행
function onSubmit() {
  console.log(joinUser.value);
  // 입력값이 다 들어 왔는지 확인하기
  if (emailErrMsg.value) {
    alert(emailErrMsg.value);
  } else if (passwordErrMsg.value) {
    alert(passwordErrMsg.value);
  } else if (rePasswordErrMsg.value) {
    alert(rePasswordErrMsg.value);
  } else if (nameErrMsg.value) {
    alert(nameErrMsg.value);
  } else {
    // API 호출 데이터 처리 후 router.replace로 이동 시키기 (회원가입, 뒤로가기 없음)
    join();
  }
}
const join = async () => {
  await userJoin(joinUser.value);
  if (isCreate) {
    // 성공이라면 메인으로 이동
    alert("회원가입 완료! 로그인 해주세요.");
    router.replace("/");
  } else {
    alert("회원가입 실패!");
  }
};
</script>

<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="logo">회원가입</div>
      <form id="registerForm" class="register-form">
        <input
          type="text"
          id="username"
          placeholder="이름"
          name="username"
          v-model="joinUser.name"
          required
        />
        <input
          type="email"
          id="email"
          placeholder="이메일"
          v-model="joinUser.email"
          name="email"
          required
        />
        <input
          type="password"
          id="password"
          placeholder="비밀번호"
          v-model="joinUser.password"
          autocomplete="off"
          name="password"
          required
        />
        <div class="msg">{{ msg_pass }}</div>
        <input
          type="password"
          id="adminpassword"
          autocomplete="off"
          v-model="joinUser.admin"
          placeholder="관리자 비밀번호"
        />
        <div class="msg">{{ msg_admin }}</div>
        <button type="button" class="register-btn" @click.prevent="onSubmit">
          회원 가입
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/css/login.css";
.msg {
  /* margin-left: 10px; */
  text-align: left;
  font-size: 12px;
  color: #aeaeae;
}
</style>
