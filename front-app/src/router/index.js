import { createRouter, createWebHashHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/HostE",
      name: "HostView",
      component: () => import('../views/HostVIew.vue')
    },
    {
        path: "/listen",
        name: "ListenerView",
        component: () => import('../views/ListenerView.vue')
    },
    {
        path: "/",
        name: "RegisterAndLoginFormsView",
        component: () => import('../views/RegisterLogin.vue')
    },
    {
        path: "/home",
        name: "HomeView",
        component: () => import('../views/HomeView.vue')
    },
    {
      path: "/browse",
      name: "BrowserView",
      component: () => import('../views/BrowseView.vue')
    },
    {
        path: "/profile",
        name: "ProfileView",
        component: () => import('../views/ProfileView.vue')
    },
    {
        path: "/startlive",
        name: "StartLiveView",
        component: () => import('../views/StartLiveView.vue')
    },

    {
      path: '/live/:idOfOwner/:owner',
      name: 'AudioLiveView',
      component: () => import('../views/AudioLiveView.vue'),
      props: true
    },
    {
      path: '/watching/:owner',
      name: 'WatchingView',
      component: () => import('../views/WatchingView.vue'),
      props: true
  
    },
    {
      path: '/listen/:owner',
      redirect: to => ({
        name: 'WatchingView',
        params: { owner: to.params.owner }
      })
    },
    {
      path: '/channel/:idOfOwner/:owner',
      name: 'ProfileChannel',
      component: () => import('../views/ProfileChannel.vue'),
      props: true
    },

    {
      path: '/explore',
      name: 'ExploreView',
      component: () => import('../views/ExploreView.vue'),
    }

  ],
})



export default router;


