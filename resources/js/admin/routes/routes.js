/*jshint esversion: 6 */
import adminHome from '../components/Home.vue';
import Login from '../components/auth/Login.vue';
// user components
import allUsers from '../components/user/AllUsers.vue';
import UserHolder from '../components/user/UserHolder.vue';
import addUser from '../components/user/AddNew.vue';
import viewUser from '../components/user/ViewUser.vue';
import editUser from '../components/user/EditUser.vue';
import editProfile from '../components/user/EditProfile.vue';
//wetland components
import allWetlands from '../components/wetland/AllWetlands.vue';
import WetlandHolder from '../components/wetland/WetlandHolder.vue';
import addWetland from '../components/wetland/AddNew.vue';
import viewWetland from '../components/wetland/ViewWetland.vue';
import editWetland from '../components/wetland/EditWetland.vue';
//wetland components
import allPosts from '../components/post/AllPosts.vue';
import PostHolder from '../components/post/PostHolder.vue';
import addPost from '../components/post/AddNew.vue';
import editPost from '../components/post/EditPost.vue';
import {getCurrentUser} from '../auth/auth';

export const adminRoutes = [
  {
    path: '/admin',
    component: adminHome,
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/admin/users/all',
    component: allUsers,
    name: 'allusers',
  },
  {
    path: '/admin/user',
    component: UserHolder,
    children: [
      {
        path: 'add',
        component: addUser,
        name: 'adduser',
        beforeEnter: (to, from, next) => {
          let currentUser = getCurrentUser();
          if(currentUser.role == 'superadmin' ||
             currentUser.role == 'admin') {
            next();
          }else {
            next('/admin')
          }
        }
      },
      {
        path: ':id/view',
        component: viewUser,
        name: 'viewuser',
      },
      {
        path: ':id/edit',
        component: editUser,
        name: 'edituser',
        beforeEnter: (to, from, next) => {

          let currentUser = getCurrentUser();
          if(currentUser.role == 'superadmin') {
            next();
          }else if(currentUser.role == 'admin') {
            axios.get('/api/check-superadmin/' + to.params.id)
            .then(res => {
              if(res.data.user.role != 'superadmin' ||
                 res.data.user.role != 'admin') {
                next();
              }else {
                next('/admin')
              }
            })
            .catch(err => {
              console.log(err);
            });
          }else {
            next('/admin')
          }
        }
      },
      {
        path: ':id/profile',
        component: editProfile,
        name: 'editprofile',
      }
    ]
  },
  {
    path: '/admin/wetlands/all',
    component: allWetlands,
    name: 'allwetlands',
  },
  {
    path: '/admin/wetland',
    component: WetlandHolder,
    children: [
      {
        path: 'add',
        component: addWetland,
        name: 'addwetland',
        beforeEnter: (to, from, next) => {
          let currentUser = getCurrentUser();
          if(currentUser.role == 'superadmin' ||
             currentUser.role == 'author' ||
             currentUser.role == 'admin') {
              next();
          }else {
            next('/admin')
          }
        }
      },
      {
        path: ':id/view',
        component: viewWetland,
        name: 'viewwetland',
      },
      {
        path: ':id/edit',
        component: editWetland,
        name: 'editwetland',
        beforeEnter: (to, from, next) => {
          let currentUser = getCurrentUser();
          if(currentUser.role == 'superadmin' ||
             currentUser.role == 'admin') {
            next();
          }else {
            next('/admin')
          }
        }
      }
    ]
  },
  {
    path: '/admin/posts/all',
    component: allPosts,
    name: 'allposts',
  },
  {
    path: '/admin/post',
    component: PostHolder,
    children: [
      {
        path: 'add',
        component: addPost,
        name: 'addpost',
        beforeEnter: (to, from, next) => {
          let currentUser = getCurrentUser();
          if(currentUser.role != 'observer') {
            next();
          }else {
            next('/admin')
          }
        }
      },
      {
        path: ':id/edit',
        component: editPost,
        name: 'editpost',
        beforeEnter: (to, from, next) => {
          let currentUser = getCurrentUser();
          if(currentUser.role != 'observer') {
            next();
          }else {
            next('/admin')
          }
        }
      }
    ]
  },
]