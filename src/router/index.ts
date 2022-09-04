import { createRouter, createWebHistory } from "vue-router";
import GlobeChart from "../components/globe/GlobeChart.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "globe",
      component: GlobeChart,
    },
    // {
    //   path: '/timeline',
    //   name: 'timeline',
    //   component: () => import('../components/timeline/Timeline.vue')
    // }
  ],
});

export default router;
