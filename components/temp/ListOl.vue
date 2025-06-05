<template>
  <ol>
    <li v-for="(item, key) in props.items" :key="key" class="d-flex">
      <div class="counter">
        <h4>{{ +key + 1 }}</h4>
      </div>
      <div class="">
        <h4>{{ item.title }}</h4>
        <p>{{ item.text }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup>
const props = defineProps({
  items: Array,
});
</script>

<style lang="scss" scoped>
ol {
  padding-top: 3rem;
  padding-left: 0;
  margin-bottom: 30px;
  @include media-breakpoint-down("md") {
    padding-top: 0;
    padding-left: 0;
  }
}

.counter {
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 20px;
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
  color: $color-white;
  background-color: $color-primary;
  @include media-breakpoint-down("md") {
    margin-right: 10px;
  }
}

h4 {
  margin-top: 4px;
  margin-bottom: 5px;
  font-weight: 700;
}
h3 {
  margin-top: 4px;
  margin-bottom: 21px;
}

li {
  margin-bottom: 43px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>
