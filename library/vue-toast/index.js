import ToastComponent from "./js/Component.vue";
import { useToast } from "./js/api";
import ToastPositions from "./js/positions";
import "./themes/sugar/index.scss";
import "./themes/_animations.scss";

const ToastPlugin = {
  install: (app, options = {}) => {
    let instance = useToast(options);
    app.config.globalProperties.$toast = instance;
    app.provide("$toast", instance);
  },
};

export default ToastPlugin;
export { useToast, ToastPlugin, ToastComponent, ToastPositions };
