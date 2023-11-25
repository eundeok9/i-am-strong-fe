<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, detailArticle, modifyArticle } from "@/api/notice";
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";
import axios from "axios";

let token = sessionStorage.getItem("accessToken");
const memberStore = useMemberStore();
const { userName, userInfo } = storeToRefs(memberStore);
const router = useRouter();
const route = useRoute();

const props = defineProps({
  type: String,
  noticeId: String,
});
const userId = userInfo.value.id; // 실제 로그인 아이디로 변경해야함
const isUseId = ref(false);
const URL = "/server";
const article = ref({
  id: 0,
  title: "",
  content: "",
  writer_id: "",
  writer_email: "",
  writer_name: "",
  view_count: 0,
  creat_time: "",
});

onMounted(async () => {
  if (props.type === "modify") {
    const noticeId = route.params.noticeId;
    console.log(noticeId + "번글 얻어와서 수정할거야");
    console.log(userInfo.value);
    try {
      const response = await axios({
        method: "get",
        url: URL + "/notice/find/" + noticeId,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
          Authorization: "Bearer " + token,
        },
      });
      article.value = response.data.data_body;
      console.log(article.value);
    } catch (error) {
      console.error(error);
    }
  }
});

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
watch(
  () => article.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!";
    } else {
      subjectErrMsg.value = "";
    }
  },
  { immediate: true }
);
watch(
  () => article.value.content,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!";
    } else {
      contentErrMsg.value = "";
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  // event.preventDefault();

  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    props.type === "regist" ? writeArticle() : updateArticle();
  }
};

const writeArticle = async () => {
  console.log("글등록하자!!", article.value);
  try {
    const response = await axios({
      method: "post",
      url: URL + "/notice/add",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        title: article.value.title,
        content: article.value.content,
      },
    });
    // console.log(registParam.value);
    console.log("Response: ", response.data);
    moveList();
  } catch (error) {
    console.error("Error:", error);
  }
};

const updateArticle = async () => {
  console.log(article.value.id + "번글 수정하자!!", article.value);
  try {
    const response = await axios({
      method: "put",
      url: URL + "/notice/edit",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": true,
        Authorization: "Bearer " + token,
      },
      data: {
        notice_id: route.params.noticeId,
        title: article.value.title,
        content: article.value.content,
      },
    });
    console.log("Response: ", response.data);
    moveList();
  } catch (error) {
    console.error("Error:", error);
  }
};

function moveList() {
  router.push({ name: "noticeList" });
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <!-- 글 헤드라인 -->
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10 col-sm-12">
          <h2 class="my-3 py-3 shadow-sm bg-light text-center">
            <div class="sky">게시글 등록</div>
          </h2>
        </div>
        <div class="col-lg-8 col-md-10 col-sm-12">
          <input type="hidden" name="action" value="write" />
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              v-model="article.title"
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
          <br />
          <div class="button-container">
            <button class="btn btn-primary" id="regist" v-if="props.type === 'regist'">
              글작성
            </button>
            <button class="btn btn-primary" id="modify" v-else>글수정</button>
            <button class="btn btn-secondary" @click="moveList">목록보기</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
@import "../../../assets/css/board.css";
</style>
