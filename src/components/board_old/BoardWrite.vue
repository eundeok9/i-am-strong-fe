<script setup>
import axios from "axios";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import router from "../../router";

// 글 작성
const article = ref({
  subject: "",
  content: "",
  // userId는 아직 로그인 구현이 안되었으므로 ssaf1로 박아두기
  userId: "ssafy1",
  hit: 0,
  registerTime: "",
});

// 제목, 본문 유효한지 확인
const subjectErrMsg = ref("");
const contentErrMsg = ref("");

watch(
  () => article.value.subject,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 50) {
      subjectErrMsg.value = "제목을 확인해주세요";
    } else subjectErrMsg.value = "";
  },
  { immediate: true }
);
watch(
  () => article.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해주세요";
    } else contentErrMsg.value = "";
  },
  { immediate: true }
);

const api_url = import.meta.env.VITE_VUE_API_URL;

const registArticle = () => {
  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    axios
      .post(`${api_url}/board/`, {
        board_title: article.value.subject,
        board_content: article.value.content,
        user_id: article.value.userId,
      })
      .then((res) => {
        console.log(res.data);
        router.push("/board/list");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// 페이지 이동
const route = useRouter();

const moveList = () => {
  route.push("list");
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-sm-12">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <div class="sky">게시글 등록</div>
        </h2>
      </div>
      <div class="col-lg-8 col-md-10 col-sm-12">
        <form id="writeForm" method="POST">
          <input type="hidden" name="action" value="write" />
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              v-model="article.subject"
              id="title"
              name="title"
              placeholder="제목 입력"
            />
          </div>
          <br />
          <div class="form-group">
            <textarea
              class="form-control"
              id="content"
              v-model="article.content"
              name="content"
              rows="7"
              placeholder="내용 입력"
            ></textarea>
          </div>
        </form>
        <br />
        <div class="button-container">
          <button class="btn btn-primary" id="regist" @click="registArticle">등록</button>
          <button class="btn btn-secondary" @click="moveList">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/css/board.css";
</style>
