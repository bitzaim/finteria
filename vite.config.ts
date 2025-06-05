import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vue", "vue-router"],
      dirs: ["./composition"],
      vueTemplate: true,
    }),
    Components({
      dirs: ["./components/"],
      dts: true,
      directoryAsNamespace: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/style/include.scss" as *;
          @import "@/assets/style/vars.scss";
          @import "@/assets/style/mixins.d/breakpoints.scss";
        `,
      },
    },
  },
});
