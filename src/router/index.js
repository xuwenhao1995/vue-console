import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
import Login from '../views/login/index.vue'
import Home from '../views/home/index.vue'
import Users from '../views/users/users.vue'
import Logs from '../views/logs/logs.vue'
import ChangePwd from '../views/users/changePwd.vue'
import Coremanagement from '../views/device/coremanagement.vue'
import Power from '../views/device/power/power.vue'
import AlarmLog from '../views/logs/alarmLog.vue'


//Element也出现该问题是因为Element也使用了vue-router
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
    routes: [{
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'home',
        path: '/',
        component: Home,
        children: [
            //系统控制
            { name: 'users', path: '/users', component: Users },
            { name: 'changePwd', path: '/changePwd', component: ChangePwd },
            { name: 'alarmLog', path: '/alarmLog', component: AlarmLog },
            { name: 'logs', path: '/logs', component: Logs },
            //基站管理
            { name: 'coremanagement', path: '/coremanagement', component: Coremanagement },
            { name: 'power', path: '/power', component: Power },
        ]
    }
    ]
})

//路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const token = localStorage.getItem('token')
        if (!token) {
            Message.warning('你未登陆！');
            router.push({ name: 'login' })
            return
        }
        next()
    }
})

export default router