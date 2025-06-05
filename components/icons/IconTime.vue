<template>
  <svg v-bind="attrs">
    <path
      d="M30.896 10.7368L32.0161 9.59815L33.2963 10.8995L35.5366 8.62216L30.736 3.74219L28.4957 6.01953L29.7759 7.32081L28.3357 8.7848C20.6548 4.06747 10.7336 6.50745 6.25307 14.3154C1.77255 22.1234 4.17277 31.8833 11.6937 36.6006C19.2146 41.318 29.1358 38.878 33.6164 31.07C37.6168 24.4007 36.4967 15.9421 30.896 10.7368ZM20.0147 33.998C13.7739 33.998 8.81335 28.9554 8.81335 22.6114C8.81335 16.2675 13.7739 11.2248 20.0147 11.2248C26.2554 11.2248 31.2159 16.2674 31.216 22.6114C31.2161 28.9553 26.2554 33.998 20.0147 33.998Z"
      fill="#306BCF"
    />
    <rect x="19" y="11" width="2" height="3" fill="#306BCF" />
    <rect x="27.4248" y="13.6621" width="2" height="3" transform="rotate(45 27.4248 13.6621)" fill="#306BCF" />
    <rect x="12.5752" y="31.1973" width="2" height="3" transform="rotate(-135 12.5752 31.1973)" fill="#306BCF" />
    <rect x="8.5" y="23.5" width="2" height="3" transform="rotate(-90 8.5 23.5)" fill="#306BCF" />
    <rect x="11.1611" y="15.0762" width="2" height="3" transform="rotate(-45 11.1611 15.0762)" fill="#306BCF" />
    <rect x="28.8389" y="29.7832" width="2" height="3" transform="rotate(135 28.8389 29.7832)" fill="#306BCF" />
    <rect x="19" y="31" width="2" height="3" fill="#306BCF" />
    <rect x="28.5" y="23.5" width="2" height="3" transform="rotate(-90 28.5 23.5)" fill="#306BCF" />
    <path d="M18.6497 17L17 18.125V20.9491L18.6497 19.7963V28H22V17H18.6497Z" fill="#FB7C20" />
    <path
      d="M15.2139 0V3.25334H18.4143V4.87997C19.5344 4.71733 20.4945 4.71733 21.6147 4.87997V3.25334H24.8151V0H15.2139Z"
      fill="#4785EF"
    />
  </svg>
</template>

<script lang="ts" setup>
import { iconAttributes } from "@/utils/icons";

const attrs = iconAttributes({ width: 40, height: 40 });
</script>
