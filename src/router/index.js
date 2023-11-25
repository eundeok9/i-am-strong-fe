import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import TheNoticeView from "@/views/TheNoticeView.vue";
import NoticeList from "@/components/notice/NoticeList.vue";
import NoticeDetail from "@/components/notice/NoticeDetail.vue";
import NoticeRegist from "@/components/notice/NoticeRegist.vue";
import NoticeModify from "@/components/notice/NoticeModify.vue";
import QNAView from "@/views/QNAView.vue";
import QnAList from "@/components/qna/QnAList.vue";
import QnARegist from "@/components/qna/QnARegist.vue";
import MyInfo from "@/components/mypage/MyInfo.vue";
import MyInfoUpdate from "@/components/mypage/MyInfoUpdate.vue";
import DealView from "@/views/DealView.vue";
import LoginView from "@/views/LoginView.vue";

import RegistView from "@/views/RegistView.vue";
import ReportView from "@/views/ReportView.vue";
import ReportForm from "@/components/report/ReportForm.vue";
import ReportResult from "@/components/report/ReportResult.vue";

// MyPage
import MyPageView from "@/views/MyPageView.vue";
// 로그인 인증 사용자만 페이지 이동 가능 (header 인증 넣고 적용할 것)
import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member";

const onlyAuthUser = async (to, from, next) => {
  const memberStore = useMemberStore();
  const { userName, isValidToken } = storeToRefs(memberStore);
  const { getUserInfo } = memberStore;

  let token = sessionStorage.getItem("accessToken");

  if (userName.value != null && token) {
    await getUserInfo();
  }
  if (!isValidToken.value || userName.value === null) {
    next({ name: "login" });
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainView,
    },
    {
      path: "/notice",
      name: "notice",
      component: TheNoticeView,
      redirect: "/notice/list",
      children: [
        {
          path: "list",
          name: "noticeList",
          component: NoticeList,
        },
        {
          path: "detail/:noticeId", // : 항목 id 필요
          name: "noticeDetail",
          component: NoticeDetail,
        },
        {
          path: "modify/:noticeId", // : 항목 id 필요
          name: "noticeModify",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: NoticeModify,
        },
        {
          path: "regist",
          name: "noticeRegist",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: NoticeRegist,
        },
      ],
    },
    {
      path: "/question",
      name: "question",
      component: QNAView,
      redirect: "/question/list",
      children: [
        {
          path: "list",
          name: "questionList",
          component: QnAList,
        },
        {
          path: "regist",
          name: "qnaRegist",
          // beforeEnter: onlyAuthUser, // 로그인된 사용자만 페이지 이동 가능
          component: QnARegist,
        },
      ],
    },
    {
      path: "/deal",
      name: "deal",
      component: DealView,
    },
    {
      path: "/report",
      name: "report",
      component: ReportView,
      redirect: { name: "report-form" },
      children: [
        {
          name: "report-form",
          path: "form",
          component: ReportForm,
        },
        {
          name: "report-result",
          path: "result",
          component: ReportResult,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/regist",
      name: "regist",
      component: RegistView,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPageView,
      redirect: { name: "mypage-info" },
      children: [
        {
          path: "info",
          name: "mypage-info",
          component: MyInfo,
        },
        {
          path: "update",
          name: "mypage-update",
          component: MyInfoUpdate,
        },
      ],
    },
  ],
});

export default router;
