import Vue from 'vue';
import selectModal from './selectModal.vue';
import option from './option.vue';
import optionGroup from './optionGroup.vue';

const Select = {
    install: function( Vue ) {
        Vue.component('v-select', selectModal)
        Vue.component('v-option', option)
        Vue.component('v-option-group', optionGroup)
    }
}

/*  const Option = {
    install: function (Vue) {
        Vue.component('v-option', option)
    }
}

const OptionGroup = {
    install: function (Vue) {
        Vue.component('v-option-group', optionGroup)
    }
}  */

//export { Select, Option, OptionGroup};
export default Select;