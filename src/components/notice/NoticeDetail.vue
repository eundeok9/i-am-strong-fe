<script setup>
import {ref, onMounted, defineProps} from "vue";
import router from "@/router";
import {useRoute, useRouter} from "vue-router";
import {detailArticle, deleteArticle} from "@/api/notice";
import {useMemberStore} from "@/stores/member";
import {storeToRefs} from "pinia";
import axios from "axios";

const memberStore = useMemberStore();
const {isAdmin, userName} = storeToRefs(memberStore);
const route = useRoute();
const URL = "/server";

const props = defineProps({
  noticeIndex: Number,
});

const article = ref({}); // 하단의 NoticeListItem의 v-for 인자로 사용
console.log("너 누구야", route.params.noticeId);
console.log("sj skdhk", props.noticeIndex);
const noticeId = route.params.noticeId;
const index = route.params.idx;
onMounted(() => {
  getArticle(noticeId);
  console.log("게시글번호 :" + noticeId);
});

const getArticle = async (noticeId) => {
  try {
    const response = await axios({
      method: "get",
      url: URL + "/notice/find/" + noticeId,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
      },
    });
    article.value = response.data.data_body;
    console.log(article.value);
  } catch (error) {
    console.error(error);
  }
};

const modify = () => {
  console.log("글 수정하기로 이동");
  router.push({
    name: "noticeModify",
  });
};

const list = () => {
  console.log("글 목록으로 이동");
  router.push({name: "noticeList"});
};

const Delete = () => {
  console.log("글 삭제버튼 클릭 !!");
  deleteArticle(
    noticeId,
    (response) => {
      console.log(response);
      if (response.status == 200) moveList();
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({name: "noticeList"});
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">글보기</h2>
      </div>
      <div class="col-lg-10 text-start">
        <div class="row my-2">
          <h2 class="text-secondary px-5">{{ index }} {{ article.title }}</h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <img class="avatar me-2 float-md-start bg-light p-2" src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg" />
              <p>
                <span class="fw-bold">{{ article.writer_name }}</span> <br />
                <span class="text-secondary fw-light"> {{ article.creat_time }} 조회 : {{ article.view_count }} </span>
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
            <button type="button" class="btn btn-outline-success mb-3 ms-1" v-if="userName === article.writer_name" @click="modify">글수정</button>
            <button type="button" class="btn btn-outline-danger mb-3 ms-1" v-if="isAdmin || userName === article.writer_name" @click="Delete">글삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
