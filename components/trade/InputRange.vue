<template>
  <input class="input" :value="props.value" :max="max" :min="min" :step="step" type="range" @input="changeBackground" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { unref as _unref } from "vue";

const props = defineProps({
  max: {
    type: [Number, String],
    default: 1000,
  },
  min: {
    type: [Number, String],
    default: 1,
  },
  value: {
    type: [Number, String],
  },
  step: {
    type: [Number, String],
    default: 1,
  },
});

const emits = defineEmits<{ (e: "change", value: number): void }>();

const inputValue = ref(props.value);
const ratioBackground = Number(props.max) - Number(props.min);

const changeBackground = (event) => {
  inputValue.value = event.target.value;
  emits("change", Number(event.target.value));
};

const backgroundFill = computed(() => ((Number(inputValue.value) - Number(props.min)) * 100) / ratioBackground + "%");
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";
.input {
  width: 100%;
  cursor: grab;
}

$height: 6px;
$tombSize: 14px;
$tombRadius: 2px;

// normilize

input[type="range"] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  width: 100%; /* Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type="range"]::-webkit-slider-thumb {
  width: $tombSize;
  height: $tombSize;
  margin-top: -4px;
  cursor: pointer;
  background: $color-primary;
  border-radius: $tombRadius;
  -webkit-appearance: none;
}

input[type="range"]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type="range"]::-ms-track {
  width: 100%;
  height: $height;
  color: transparent;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: $height;
  cursor: pointer;
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
  border-radius: 1.3px;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: $height;
  cursor: pointer;
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
  border-radius: 1.3px;
}

input[type="range"]::-ms-fill-lower {
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
  border-radius: 2.6px;
}
input[type="range"]:focus::-ms-fill-lower {
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
}
input[type="range"]::-ms-fill-upper {
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
  border-radius: 2.6px;
}
input[type="range"]:focus::-ms-fill-upper {
  background: linear-gradient(to right, $color-orange v-bind("backgroundFill"), $color-primary-lightest 0%);
}

// tomb

/* All the same stuff for Firefox */
input[type="range"]::-moz-range-thumb {
  width: $tombSize;
  height: $tombSize;
  cursor: pointer;
  background: $color-primary;
  border-radius: $tombRadius;
}

/* All the same stuff for IE */
input[type="range"]::-ms-thumb {
  width: $tombSize;
  height: $tombSize;
  cursor: pointer;
  background: $color-primary;
  border-radius: $tombRadius;
}

input {
  background-color: green;
}
</style>
