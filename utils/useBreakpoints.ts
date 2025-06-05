export const useBreakpoints = () => {
  const windowWidth = ref<number>(0);
  const onWidthChange = () => (windowWidth.value = window.innerWidth);

  onMounted(() => {
    windowWidth.value = document.body.clientWidth;
    window.addEventListener("resize", onWidthChange);
    window.addEventListener("load", onWidthChange);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", onWidthChange);
    window.removeEventListener("load", onWidthChange);
  });

  const type = computed<string | null>(() => {
    if (windowWidth.value < 576) return "sm";
    if (windowWidth.value >= 576 && windowWidth.value < 768) return "md";
    if (windowWidth.value >= 768 && windowWidth.value < 992) return "lg";
    if (windowWidth.value >= 992 && windowWidth.value < 1200) return "xl";
    if (windowWidth.value >= 1200) return "xxl";

    return null;
  });

  return { width: windowWidth.value, type };
};
