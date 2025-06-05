import ToastComponent from "./Component.vue";
import { createComponent } from "./helpers";
import emitter from "@/library/eventBus";

export const useToast = (globalProps = {}) => {
  return {
    open(options) {
      let message = null;
      if (typeof options === "string") message = options;

      const defaultProps = {
        message,
      };

      const propsData = Object.assign({}, defaultProps, globalProps, options);

      const instance = createComponent(ToastComponent, propsData, document.body);

      return {
        dismiss: instance.ctx.dismiss,
      };
    },
    clear() {
      emitter.emit("toast-clear");
    },
    success(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "success",
          },
          options
        )
      );
    },
    error(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "error",
          },
          options
        )
      );
    },
    info(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "info",
          },
          options
        )
      );
    },
    warning(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "warning",
          },
          options
        )
      );
    },
    default(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "default",
          },
          options
        )
      );
    },
    gift(message, options = {}) {
      return this.open(
        Object.assign(
          {},
          {
            message,
            type: "gift",
          },
          {
            ...options,
            duration: 8000
          }
        )
      );
    },
  };
};
