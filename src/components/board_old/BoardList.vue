<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
// import PageNavigation from '../common/PageNavigation.vue';
import VSelect from "../common/VSelect.vue";

// 서버에서 게시글 가져오기
const api_url = import.meta.env.VITE_VUE_API_URL;

const articles = ref([]);

onMounted(() => {
  axios
    .get(`${api_url}/board/`)
    .then((res) => {
      // console.log(res.data)
      articles.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});

const getArticleList = () => {
  console.log("서버에서 글목록 얻어오자!!!", param.value);
  // API 호출
  alert("검색기능개발중..");
};

// 검색
const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "글번호", value: "article_no" },
  { text: "제목", value: "subject" },
  { text: "작성자아이디", value: "user_id" },
]);

// 페이지네이션
const currentPage = ref(1);
const totalPage = ref(10);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
});

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getArticleList();
};

// 검색 기능
const changeKey = (val) => {
  param.value.key = val;
};

// 페이지 이동
const router = useRouter();

const moveWrite = () => {
  router.push("write");
};
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8 col-md-10 col-sm-12">
      <h2 class="my-3 py-3 shadow-sm bg-light text-center">
        <div class="sky">자유게시판</div>
      </h2>
    </div>
    <div class="col-lg-8 col-md-10 col-sm-12">
      <div class="row align-self-center mb-2">
        <div class="col-md-2 text-start">
          <button
            type="button"
            id="btn-mv-register"
            class="btn btn-outline-primary btn-sm"
            @click="moveWrite"
          >
            글쓰기
          </button>
        </div>
        <div class="col-md-7 offset-3">
          <form class="d-flex" id="form-search" action="">
            <!-- <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
            <div class="input-group input-group-sm">
              <input type="text" class="form-control" v-model="param.word" placeholder="검색어..." />
              <button class="btn btn-dark" type="button" @click="getArticleList">검색</button>
            </div> -->
            <div class="search-group">
              <input
                type="text"
                class="form-control"
                placeholder="검색할 내용 입력"
                v-model="param.searchText"
              />
              <button class="search-btn" @click="getNoticeList">검색</button>
            </div>
          </form>
        </div>
      </div>
      <table class="table table-hover">
        <thead>
          <tr class="text-center">
            <th scope="col">No</th>
            <th scope="col">제목</th>
            <th scope="col">등록일</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr class="text-center boardTitle" v-for="article in articles" :key="article.board_no">
            <th scope="row">{{ article.board_no }}</th>
            <td>
              <router-link :to="{ name: 'board-detail', params: { boardNo: article.board_no } }">{{
                article.board_title
              }}</router-link>
            </td>
            <td>{{ article.user_id }}</td>
            <td>{{ article.board_hit }}</td>
          </tr> -->
          <NoticeListItem
            v-for="(notice, index) in notices"
            :key="notice.notice_id"
            :notice="notice"
            :index="totalCount - index"
            :current-page="currentPage"
          ></NoticeListItem>
        </tbody>
      </table>
    </div>
    <!-- <PageNavigation
      :current-page="currentPage"
      :total-page="totalPage"
      @pageChange="onPageChange"
    ></PageNavigation> -->
    <VPageNavigation
      v-if="totalPage > 0"
      :currentPage="currentPage"
      :totalPage="totalPage"
      @pageChange="onPageChange"
    ></VPageNavigation>
  </div>
</template>

<style scoped>
* {
  text-decoration: none;
  color: black;
}
.boardTitle {
  cursor: pointer;
}
</style>
