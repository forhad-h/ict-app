/* jshint esversion: 6 */
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as allSolidIcons from '@fortawesome/free-solid-svg-icons';
import * as allRegIcons from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add([
  allRegIcons.faComments,
  allRegIcons.faEdit,
  allSolidIcons.faAngleRight,
  allSolidIcons.faAngleLeft,
  allSolidIcons.faSquare,
  allSolidIcons.faPlus,
  allSolidIcons.faMinus,
  allSolidIcons.faIgloo,
  allSolidIcons.faUsersCog,
  allSolidIcons.faTrash,
  allSolidIcons.faEye,
  allSolidIcons.faWater,
  allSolidIcons.faBlog,
  allSolidIcons.faSearch,
  allSolidIcons.faTimes,
]);

Vue.component('font-awesome-icon', FontAwesomeIcon);