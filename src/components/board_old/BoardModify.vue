<script setup>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute();
const boardNo = route.params.boardNo;

const article = ref({})

const api_url = import.meta.env.VITE_VUE_API_URL

// 기존 게시글 내용 불러오기
onMounted(() => {
    axios.get(`${api_url}/board/${boardNo}`).then(
        (res) => {
            article.value = res.data
            console.log(article.value)
        }
    ).catch((err) =>{
        console.log(err)
    })
})

// 페이지 이동
const router = useRouter();

const modifyArticle = () => {
    axios.put(`${api_url}/board/${boardNo}`, {
        board_title: article.value.board_title,
        board_content: article.value.board_content,
    }).then((res)=> {
        console.log(res.data)
        router.push(`/board/${boardNo}`)
    })
    .catch((err) => {console.log(err)})
}

const moveList = () => {
    router.push(`/board/${boardNo}`)
}

</script>

<template>
    <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">글수정</mark>
        </h2>
      </div>
      <div class="col-lg-10 text-start">
        <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="userid" class="form-label">작성자 ID : </label>
      <input
        type="text"
        class="form-control"
        disabled
        v-model="article.user_id"
        placeholder="작성자ID..."
      />
    </div>
    <div class="mb-3">
      <label for="subject" class="form-label">제목 : </label>
      <input type="text" class="form-control" v-model="article.board_title" placeholder="제목..." />
    </div>
    <div class="mb-3">
      <label for="content" class="form-label">내용 : </label>
      <textarea class="form-control" v-model="article.board_content" rows="10"></textarea>
    </div>
    <div class="col-auto text-center">
      <button type="submit" class="btn btn-outline-success mb-3" @click="modifyArticle">글수정</button>
      <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="moveList">
        목록으로이동...
      </button>
    </div>
  </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>