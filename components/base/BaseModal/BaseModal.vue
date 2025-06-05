<template>
  <dialog
    class="dialog"
    :class="{
      dialog_persistable: persistable || preventClickOutside,
    }"
    v-bind="$attrs"
    ref="dialog"
  >
    <button
      v-if="!persistable"
      class="dialog__close"
      type="button"
      :title="$t('header.btns.close')"
      @click="onDialogClose"
    >
      <IconClose />
    </button>

    <div class="dialog__content" ref="dialogContent" @click="onContentClick">
      <slot />
    </div>
  </dialog>
  <div class="backdrop"></div>
</template>

<script setup lang="ts">
import type { Props, Emits } from "./BaseModal.type";
import { useScrollLock, onClickOutside, onKeyDown } from "@vueuse/core";
import IconClose from "@/components/icons/IconClose.vue";

const props = withDefaults(defineProps<Props>(), {
  persistable: false,
  preventClickOutside: false,
});

const emit = defineEmits<Emits>();

const dialog = ref<HTMLDialogElement>();
const dialogContent = ref<HTMLDialogElement>();
const body = document.body;
const isLocked = useScrollLock(body);

const onDialogClose = () => {
  if (!props.persistable) {
    if (dialog.value) {
      isLocked.value = false;
      dialog.value.close();
    }
    emit("update:modelValue", false);
  }
};

onClickOutside(dialog, () => {
  if (!props.preventClickOutside) {
    onDialogClose();
  }
});

onKeyDown("Escape", onDialogClose);

const onContentClick = (evt: Event) => {
  evt.stopPropagation();
};

onMounted(() => {
  const isBrowserNotSupportDialog = window.HTMLDialogElement === undefined;
  if (isBrowserNotSupportDialog) {
    const dialogs = document.querySelectorAll(".dialog");

    dialogs.forEach(async (dialog) => {
      const { default: polyfill } = await import("dialog-polyfill");
      polyfill.registerDialog(dialog as HTMLDialogElement);
    });
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        isLocked.value = true;
        dialog.value?.show();
      } else {
        isLocked.value = false;
        dialog.value?.close();
      }
    },
    {
      immediate: true,
    }
  );
});
</script>

<style scoped lang="scss">
.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 100%;
  max-width: 620px;
  max-height: 100%;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  background: $color-white;
  border: none;
  box-shadow: inset 0px 3px 0px $color-primary;
  transform: translateX(-50%) translateY(-50%);
}

.dialog__content {
  padding: 16px;

  @include media-breakpoint-up("sm") {
    padding: 30px;
  }
}

.dialog[open] + .backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color-black, 50%);
}

.dialog:not(.dialog_persistable) + .backdrop {
  cursor: pointer;
}

.dialog__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
  color: $color-btn-disable;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: color $transition-time;
}

.dialog__close > svg {
  vertical-align: top;
}

.dialog__btn:hover,
.dialog__btn:focus {
  color: $color-black;
}
</style>
