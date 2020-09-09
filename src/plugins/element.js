import Vue from 'vue'
import { Button, Col, Row, Message, Loading } from 'element-ui'

Vue.use(Button)
Vue.use(Col)
Vue.use(Row)
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading
