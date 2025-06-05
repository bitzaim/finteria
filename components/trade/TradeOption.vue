<template>
  <li class="intro__option">
    <p class="intro__options-title">
      <slot name="title"></slot>
    </p>
    <p class="intro__options-text"><slot name="text"></slot></p>
    <span class="intro__options-subtitle"><slot name="subTitle"></slot></span>
  </li>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.intro__option {
  display: flex;
  flex-direction: column;
  padding-left: 32px;
  border-left: 3px solid $color-orange-dark;
}

.intro__options-title {
  margin: 0;
  font-size: 44px;
  font-weight: 700;
}

.intro__options-text {
  font-size: 24px;
}

.intro__options-subtitle {
  font-size: 14px;
  font-weight: 800;
  color: $color-primary-light;
  text-transform: uppercase;
}
</style>
