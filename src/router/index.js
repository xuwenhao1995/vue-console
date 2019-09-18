import Vue from 'vue'
import Router from 'vue-router'
// import { Message } from 'element-ui'
import Login from '../views/login/index.vue'
import Home from '../views/home/index.vue'

//设备信息
import Project from '../views/base/project.vue'
import RRCCheck from '../views/base/rrcCheck.vue'
import RestartFapCfgTime from '../views/base/restartFapCfgTime.vue'

//基本设置
import SystemTime from '../views/baseCfg/systemTime.vue'
import LimitMcc from '../views/baseCfg/limitMcc.vue'
import PlmnMana from '../views/baseCfg/plmnMana.vue'

//系统控制
import Users from '../views/users/users.vue'
import Logs from '../views/logs/logs.vue'
import ChangePwd from '../views/users/changePwd.vue'
import AlarmLog from '../views/logs/alarmLog.vue'
import RouterPing from '../views/base/router.vue'

//基站管理
import Coremanagement from '../views/device/coremanagement.vue'
import Power from '../views/device/power/power.vue'
import SignalChannel from '../views/device/signalChannel.vue'


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
            //设备信息
            { name: 'project', path: '/project', component: Project },
            { name: 'rrcCheck', path: '/rrcCheck', component: RRCCheck },
            { name: 'restartFapCfgTime', path: '/restartFapCfgTime', component: RestartFapCfgTime },
            //基本设置
            { name: 'systemTime', path: '/systemTime', component: SystemTime },
            { name: 'limitMcc', path: '/limitMcc', component: LimitMcc },
            { name: 'plmnMana', path: '/plmnMana', component: PlmnMana },
            //系统控制
            { name: 'users', path: '/users', component: Users },
            { name: 'changePwd', path: '/changePwd', component: ChangePwd },
            { name: 'alarmLog', path: '/alarmLog', component: AlarmLog },
            { name: 'logs', path: '/logs', component: Logs },
            { name: 'router', path: '/router', component: RouterPing },
            //基站管理
            { name: 'coremanagement', path: '/coremanagement', component: Coremanagement },
            { name: 'power', path: '/power', component: Power },
            { name: 'signalChannel', path: '/signalChannel', component: SignalChannel },
        ]
    }
    ]
})

// //路由导航守卫
// router.beforeEach((to, from, next) => {
//     if (to.path === '/login') {
//         next()
//     } else {
//         const token = localStorage.getItem('token')
//         if (!token) {
//             Message.warning('你未登陆！');
//             router.push({ name: 'login' })
//             return
//         }
//         next()
//     }
// })

export default router