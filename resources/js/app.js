
require('./bootstrap');

window.Vue = require('vue');
import VueProgressBar from 'vue-progressbar'
const VueProgressBaroptions = {
    color: '#50d38a',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
}
Vue.use(VueProgressBar, VueProgressBaroptions);

import Snotify, { SnotifyPosition } from 'vue-snotify'

const Snotifyoptions = {
  toast: {
    position: SnotifyPosition.rightTop
  }
}

Vue.use(Snotify, Snotifyoptions);
import { Form, HasError, AlertError } from 'vform'
window.Form=Form




Vue.component('customer-component', require('./components/CustomerComponent.vue').default);
Vue.component('pagination', require('./components/partial/PaginationComponent.vue').default);
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

const app = new Vue({
    el: '#app',
});
