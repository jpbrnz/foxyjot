// import app pages
import Home from '@/app/pages/Home'
import NotFound from '@/app/pages/NotFound'
import Login from '@/app/pages/Login'
import Signup from '@/app/pages/Signup'
import Admin from '@/app/pages/admin/Admin'
// import admin page components
import Settings from '@/app/pages/admin/settings/Settings'
import Routing from '@/app/pages/admin/Routing'
import Media from '@/app/pages/admin/Media'
import Database from '@/app/pages/admin/Database'
import ContentType from '@/app/pages/admin/content/content-type/ContentType'
import FieldNew from '@/app/pages/admin/content/fields/FieldNew'
import FieldEdit from '@/app/pages/admin/content/fields/FieldEdit'
import Contents from '@/app/pages/admin/content/contents/Contents'
import ContentsNew from '@/app/pages/admin/content/contents/ContentsNew'
import ContentsEdit from '@/app/pages/admin/content/contents/ContentsEdit'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'settings',
        component: Settings
      },
      {
        path: 'routing',
        name: 'Routing',
        component: Routing
      },
      {
        path: 'media',
        component: Media
      },
      {
        path: 'database',
        component: Database
      },
      {
        path: 'content',
        component: ContentType,
        children: [
          {
            path: 'fieldNew',
            component: FieldNew
          },
          {
            path: 'fieldEdit/:key',
            component: FieldEdit
          }
        ]
      },
      {
        path: 'content/:key',
        component: Contents,
        children: [
          {
            path: 'new',
            name: 'new',
            component: ContentsNew
          },
          {
            path: 'edit/:contentKey',
            name: 'edit',
            component: ContentsEdit
          }
        ]
      }
    ]
  }
]

export default routes
