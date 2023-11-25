<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
const route = useRoute();

// 서버에서 게시글 가져오기
const api_url = import.meta.env.VITE_VUE_API_URL;

const boardNo = route.params.boardNo;

const article = ref({});

onMounted(() => {
  axios
    .get(`${api_url}/board/${boardNo}`)
    .then((res) => {
      console.log(res.data);
      article.value = res.data;
    })
    .catch();
});

// 페이지 이동하기
const router = useRouter();
const moveList = () => {
  router.push("/board/list");
};

const onDeleteArticle = () => {
  // api 통해 삭제하고 list 페이지로 이동
  axios
    .delete(`${api_url}/board/${boardNo}`)
    .then((res) => {
      console.log(res.data);
      router.replace("/board/list");
    })
    .catch((err) => {
      console.log(err);
    });
};

const moveModify = (boardNo) => {
  console.log(boardNo);
  router.push(`/board/${boardNo}/modify`);
};
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">글보기</mark>
        </h2>
      </div>
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <h2 class="text-secondary px-5">{{ index }}. {{ article.title }}</h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <img
                class="avatar me-2 float-md-start bg-light p-2"
                src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg"
              />
              <p>
                <span class="fw-bold">{{ article.writer_name }}</span> <br />
                <span class="text-secondary fw-light">
                  {{ article.creat_time }}1 조회 : {{ article.view_count }}
                </span>
              </p>
            </div>
          </div>
          <div class="divider mb-3"></div>
          <div class="text-secondary">
            {{ article.content }}
          </div>
          <div class="divider mt-3 mb-3"></div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-outline-primary mb-3" @click="list">글목록</button>
            <button
              type="button"
              class="btn btn-outline-success mb-3 ms-1"
              v-if="userName === article.writer_name"
              @click="modify"
            >
              글수정
            </button>
            <button
              type="button"
              class="btn btn-outline-danger mb-3 ms-1"
              v-if="isAdmin || userName === article.writer_name"
              @click="Delete"
            >
              글삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
