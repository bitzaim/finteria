<template>
  <svg v-bind="attrs">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3.176 6A2.825 2.825 0 0 1 6 3.175h12A2.825 2.825 0 0 1 20.826 6v10h-1.65V6c0-.649-.526-1.175-1.175-1.175H6c-.65 0-1.175.526-1.175 1.175v10h-1.65V6Z"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="m13.604 6.145 2.155 5.03a.825.825 0 1 1-1.516.65l-.845-1.97-2.737 4.831-2.381-4.285a.825.825 0 0 1 1.442-.802l.953 1.715 2.929-5.169ZM20 19.35H4A1.35 1.35 0 0 1 2.65 18v-.35h18.7V18A1.35 1.35 0 0 1 20 19.35ZM4 21a3 3 0 0 1-3-3v-2h22v2a3 3 0 0 1-3 3H4Z"
    />
  </svg>
</template>

<script>
export default {
  name: "IconTrading",
};
</script>

<script setup>
import { iconAttributes } from "@/utils/icons";
const attrs = iconAttributes({ width: 24, height: 24 });
</script>
