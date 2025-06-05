<template>
  <transition :enter-active-class="transition.enter" :leave-active-class="transition.leave">
    <div
      v-show="isActive"
      ref="root"
      role="alert"
      class="v-toast__item"
      :class="[`v-toast__item--${type}`, `v-toast__item--${position}`]"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="whenClicked"
    >
      <div class="v-toast__icon"></div>
      <div class="v-toast__title">{{ type }}</div>
      <p class="v-toast__text" v-html="message"></p>
    </div>
  </transition>
</template>

<script>
import { defineComponent, render } from "vue";
import { removeElement } from "./helpers.js";
import Timer from "./timer.js";
import Positions from "./positions.js";
import emitter from "@/library/eventBus";

export default defineComponent({
  name: "Toast",
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success",
    },
    position: {
      type: String,
      default: Positions.BOTTOM_RIGHT,
      validator(value) {
        return Object.values(Positions).includes(value);
      },
    },
    duration: {
      type: Number,
      default: 5000,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    onDismiss: {
      type: Function,
      default: () => {},
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    queue: Boolean,
    pauseOnHover: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: false,
      parentTop: null,
      parentBottom: null,
      isHovered: false,
    };
  },
  computed: {
    correctParent() {
      if (
        this.position === Positions.TOP ||
        this.position === Positions.TOP_RIGHT ||
        this.position === Positions.TOP_LEFT
      ) {
        return this.parentTop;
      }
      return this.parentBottom;
    },
    transition() {
      if (
        this.position === Positions.TOP ||
        this.position === Positions.TOP_RIGHT ||
        this.position === Positions.TOP_LEFT
      ) {
        return {
          enter: "v-toast--fade-in-down",
          leave: "v-toast--fade-out",
        };
      }
      return {
        enter: "v-toast--fade-in-up",
        leave: "v-toast--fade-out",
      };
    },
  },
  beforeMount() {
    this.setupContainer();
  },
  mounted() {
    this.showNotice();
    emitter.on("toast-clear", this.dismiss);
  },
  beforeUnmount() {
    emitter.off("toast-clear", this.dismiss);
  },
  methods: {
    setupContainer() {
      this.parentTop = document.querySelector(".v-toast.v-toast--top");
      this.parentBottom = document.querySelector(".v-toast.v-toast--bottom");
      // No need to create them, they already exists
      if (this.parentTop && this.parentBottom) return;

      if (!this.parentTop) {
        this.parentTop = document.createElement("div");
        this.parentTop.className = "v-toast v-toast--top";
      }

      if (!this.parentBottom) {
        this.parentBottom = document.createElement("div");
        this.parentBottom.className = "v-toast v-toast--bottom";
      }

      const container = document.body;
      container.appendChild(this.parentTop);
      container.appendChild(this.parentBottom);
    },

    shouldQueue() {
      if (!this.queue) return false;

      return this.parentTop.childElementCount > 0 || this.parentBottom.childElementCount > 0;
    },

    dismiss() {
      if (this.timer) this.timer.stop();
      clearTimeout(this.queueTimer);
      this.isActive = false;

      // Timeout for the animation complete before destroying
      setTimeout(() => {
        this.onDismiss.apply(null, arguments);

        const wrapper = this.$refs.root;
        // unmount the component
        render(null, wrapper);
        removeElement(wrapper);
      }, 150);
    },

    showNotice() {
      if (this.shouldQueue()) {
        // Call recursively if it should queue
        this.queueTimer = setTimeout(this.showNotice, 250);
        return;
      }
      const wrapper = this.$refs.root.parentElement;
      this.correctParent.insertAdjacentElement("afterbegin", this.$refs.root);
      removeElement(wrapper);

      this.isActive = true;

      if (this.duration) {
        this.timer = new Timer(this.dismiss, this.duration);
      }
    },

    whenClicked() {
      if (!this.dismissible) return;
      this.onClick.apply(null, arguments);
      this.dismiss();
    },

    toggleTimer(newVal) {
      if (!this.pauseOnHover || !this.timer) return;
      newVal ? this.timer.pause() : this.timer.resume();
    },
  },
});
</script>
