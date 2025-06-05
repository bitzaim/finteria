<template>
  <div class="canvas__wrap">
    <div class="d-flex justify-content-between align-items-center w-100">
      <h3>{{ $t("account.settings.verification.drawSignature") }}</h3>
      <button class="button button_small button_outline" @click="clear">{{ $t("common.btns.clear") }}</button>
    </div>
    <canvas
      ref="$canvasBlank"
      class="canvas canvas_blank"
    />
    <canvas
      ref="$canvas"
      class="canvas"
      @mousedown="canvasMouseDown"
      @mouseup="canvasMouseUp"
      @mousemove="drawIfPressed"
      @touchstart="canvasMouseDown"
      @touchend="canvasMouseUp"
      @touchmove="drawIfPressed"
    />

    <BaseButton type="button" @click="saveSign" :disabled="isCanvasBlank">
      {{ $t("common.btns.confirm") }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";

const emits = defineEmits<{ (event: "save", value: Blob): void }>();

const $canvas = ref<HTMLCanvasElement | null>(null);
const $canvasBlank = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const isCanvasBlank = ref<boolean>(true)

const isPainting = ref<boolean>(false);
const lineWidth = ref<number>(4);
const startX = ref<number | null>(null);
const startY = ref<number | null>(null);

const canvasDefaultWidth = 300;
const canvasDeafultHeight = 150;

const dx = computed<number>(() => {
  if ($canvas.value?.offsetWidth) {
    return $canvas.value.offsetWidth / canvasDefaultWidth;
  }

  return 0;
});
const dy = computed<number>(() => {
  if ($canvas.value?.offsetHeight) {
    return $canvas.value.offsetHeight / canvasDeafultHeight;
  }

  return 0;
});

const saveSign = () => {
  $canvas.value?.toBlob((blob: Blob | null) => {
    if (blob && !isCanvasBlank.value) {
      emits("save", blob);
    }
  });
};

const clear = () => {
  if (context.value && $canvas.value) {
    isCanvasBlank.value = true
    context.value.clearRect(0, 0, $canvas.value.width, $canvas.value.height);
  }
};

const canvasMouseDown = (e) => {
  isPainting.value = true;
  if (e.type.includes("touch")) {
    startX.value = e.touches[0].clientX;
    startY.value = e.touches[0].clientY;
    return;
  }

  startX.value = e.clientX;
  startY.value = e.clientY;
};

const canvasMouseUp = (e) => {
  isPainting.value = false;
  isCanvasBlank.value = $canvas.value?.toDataURL() === $canvasBlank.value?.toDataURL;
  if (context.value) {
    context.value.stroke();
    context.value.beginPath();
  }
};

const drawIfPressed = (e) => {
  if (!isPainting.value) {
    return;
  }

  if (context.value) {
    context.value.lineWidth = lineWidth.value;
    context.value.lineCap = "round";

    if (e.type.includes("touch")) {
      if ($canvas.value) {
        context.value.lineTo(
          (e.touches[0].clientX - $canvas.value.getBoundingClientRect().x) / dx.value,
          (e.touches[0].clientY - $canvas.value.getBoundingClientRect().y) / dy.value
        );
      }
      context.value.stroke();
      return;
    }

    if ($canvas.value) {
      context.value.lineTo(
        (e.clientX - $canvas.value.getBoundingClientRect().x) / dx.value,
        (e.clientY - $canvas.value.getBoundingClientRect().y) / dy.value
      );
    }
    context.value.stroke();
  }
};

function preventDefault(e) {
  e.preventDefault();
}

onMounted(() => {
  if ($canvas.value) {
    context.value = $canvas.value.getContext("2d");
  }
});
</script>

<style scoped lang="scss">
.canvas__wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  width: 100%;
  touch-action: none;
}

.canvas {
  width: 100%;
  max-width: 380px;
  height: 150px;
  margin: 0 auto;
  border: 4px dotted $color-btn-disable;
}

.canvas_blank {
  display: none;
}
</style>
