<script setup>
import {ref, watch, onMounted} from "vue";
import {useMemberStore} from "@/stores/member";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

// const user = ref({
//   userId: "goodwest",
//   userPass: "secret",
//   userName: "좋은서쪽",
//   email: "goodwest@gmail.com",
//   addr: "장덕동",
// });

const router = useRouter();

const memberStore = useMemberStore();
const {getUserInfo, userTryUpdate, userTryDelete} = memberStore;
const {userInfo, isUpdate, isDelete, userName} = storeToRefs(memberStore);
const isDataLoaded = ref(false);
const name = ref("");
const pass = ref("");
const rePass = ref("");

onMounted(() => {
  try {
    getUserInfo();
    name.value = userInfo.value.name;
    pass.value = userInfo.value.password;

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});

const updateInfo = async () => {
  let token = sessionStorage.getItem("accessToken");
  await userTryUpdate({name: name.value, password: pass.value}, token);
  if (isUpdate) {
    userName.value = name.value;
    alert("회원 정보 수정 완료!");
  } else {
    alert("회원 정보 수정 실패!");
  }
};

// 사용자가 탈퇴 버튼을 눌렀을 때 실행 (SQL ERROR!)
const delInfo = async () => {
  await userTryDelete();
  if (isDelete) {
    // 성공이라면 메인으로 이동
    alert("회원 정보 탈퇴 완료!");
    router.replace("/");
  } else {
    alert("회원 정보 탈퇴 실패!");
  }
};
</script>

<template>
  <div class="mypage-wrapper">
    <div class="mypage-container">
      <div class="mypage-title">회원 정보 조회</div>
      <div class="myinfo-container">
        <div class="myinfo-title">
          <div>이메일</div>
          <input disabled type="text" class="form-control myinfo-content my-email" v-model="userInfo.email" id="email" name="email" />
          <!-- <div class="myinfo-content my-email">{{ user.email }}</div> -->
        </div>
        <div class="myinfo-title">
          <div>이름</div>
          <input type="text" class="form-control myinfo-content my-name" v-model="name" id="userName" name="userName" />
          <!-- <div class="myinfo-content my-name">{{ user.userName }}</div> -->
        </div>

        <div class="myinfo-title">
          <div>비밀번호</div>
          <input type="password" class="form-control myinfo-content my-pw" v-model="pass" id="userPass" name="userPass" />
          <!-- <div class="myinfo-content my-pw">{{ user.userPass }}</div> -->
        </div>
      </div>
      <div class="btn-list">
        <button type="button" class="btn btn-outline-primary write-btn" @click="updateInfo">수정</button>
        <button class="del-btn" @click="delInfo">탈퇴</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/css/mypage.css";
</style>
