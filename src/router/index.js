import { createRouter, createWebHistory } from "vue-router";
import GeminiPromptView from "@/views/GeminiPromptView.vue";
import MagazineView from "@/views/MagazineView.vue";
import MainView from "@/views/MainView.vue";
import MypageView from "@/views/MypageView.vue";
import TravelRegionView from "@/views/TravelRegionView.vue";
import TravelSearchView from "@/views/TravelSearchView.vue";
import PlanView from "@/views/PlanView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistView from "@/views/RegistView.vue";
import MemoView from "@/views/MagazineMemoView.vue";
import MagazineMainView from "@/views/MagazineMainView.vue";
import testView from "@/views/TestView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
    },
    {
      path: "/gemini",
      name: "gemini",
      component: GeminiPromptView,
    },
    {
      path: "/magazine/:magazineId",
      name: "magazineView",
      component: MagazineView,
      // 매거진
    },
    {
      path: "/magazine/list",
      name: "magazineMain",
      component: MagazineMainView,
      // 매거진
    },
    {
      path: "/plan",
      name: "plan",
      component: PlanView,
      props: true,
      // 여행 일정 짜기
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      // 로그인
    },
    {
      path: "/regist",
      name: "regist",
      component: RegistView,
      //회원가입
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MypageView,
    },
    {
      path: "/memo/:magazineId",
      name: "memo",
      component: MemoView,
    },
    {
      path: "/region",
      name: "region",
      component: TravelRegionView,
      // 지역별 관광지 추천
    },
    {
      path: "/search",
      name: "search",
      component: TravelSearchView,
      // 관광지 검색
    },
    {
      path: "/test",
      name: "test",
      component: testView,
    },
    {
      path: "/update/:travelId",
      name: "update",
      component: PlanView,
      props: true,
      // 여행 일정 수정
    },
  ],
});

export default router;
