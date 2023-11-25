<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="container mt-5">
    <!-- 제목 Start -->
    <!-- <div class="row">
      <div class="col-lg-12">
        <h2 class="text-center" style="font-weight: bold">공지사항</h2>
      </div>
    </div> -->
    <!-- 제목 End -->
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
