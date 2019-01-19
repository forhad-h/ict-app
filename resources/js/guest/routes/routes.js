/*jshint esversion: 6 */
import guestHome from '../components/Home.vue';
import viewPost from '../components/post/ViewPost.vue';
import allPosts from '../components/post/allPosts.vue';
import viewWetland from '../components/wetland/ViewWetland.vue';
import AllWetlands from '../components/wetland/AllWetlands.vue';
import SearchedWetlands from '../components/wetland/SearchedWetlands.vue';

export const guestRoutes = [
  {
    path: '/',
    component: guestHome,
  },
  {
    path: '/blog',
    component: allPosts,
    name: 'blog',
  },
  {
    path: '/post/:id/view',
    component: viewPost,
    name: 'viewpost',
  },
  {
    path: '/wetlands',
    component: AllWetlands,
    name: 'wetlands',
  },
  {
    path: '/wetlands/search-result',
    component: SearchedWetlands,
    name: 'searchedwetlands',
  },
  {
    path: '/wetland/:id/view',
    component: viewWetland,
    name: 'guestviewwetland',
  },
]