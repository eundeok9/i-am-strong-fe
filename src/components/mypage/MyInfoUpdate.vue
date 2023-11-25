<script setup></script>

<template>
  <div
    class="modal fade"
    id="writeModal"
    tabindex="-1"
    aria-labelledby="writeModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="writeModalLabel">정보 수정</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <!-- 글 작성 폼을 여기에 추가 -->
          <form id="modifyForm">
            <input type="hidden" value="modify" name="action" />
            <div class="mb-3">
              <label for="title" class="form-label">아이디</label>
              <input
                type="text"
                class="form-control new-id"
                id="userid"
                name="userid"
                value="${sessionScope.userinfo.userId}"
                readonly
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">비밀번호</label>
              <input
                type="text"
                class="form-control new-pw"
                id="password"
                name="password"
                value="${sessionScope.userinfo.userPass}"
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">이름</label>
              <input
                type="text"
                class="form-control new-name"
                id="username"
                name="username"
                value="${sessionScope.userinfo.userName}"
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">이메일</label>
              <input
                type="text"
                class="form-control new-email"
                id="email"
                name="email"
                value="${sessionScope.userinfo.email}"
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label">주소</label>
              <input
                type="text"
                class="form-control new-address"
                id="address"
                name="address"
                value="${sessionScope.userinfo.address}"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
          <button type="button" class="btn btn-primary" onclick="editInfo()">수정 하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/css/mypage.css";
</style>
