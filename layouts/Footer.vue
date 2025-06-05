<template>
  <footer class="footer">
    <div class="footer__top-wrap">
      <div class="container footer__row footer__row_top">
        <p>{{ $t("footer.prefooterTitle") }}</p>
      </div>
    </div>
    <div class="footer__body container">
      <div class="footer__col" v-for="(col, index) in footerLinks" :key="`footerCol${index}`">
        <p class="footer__title">{{ $t(col.title) }}</p>
        <template v-for="(link, index) in col.links" :key="`footerLink${index}`">
          <template v-if="link.name === 'platform'">
            <button
              v-if="useRuntimeConfig().public.SHOW_PROFILE && isAuth"
              class="footer__link"
              @click.stop="redirectToDefaultProfilePlatform({ platform_type: 'options' }, false)"
            >
              {{ $t(link.text) }}
            </button>
            <a
              v-else
              class="footer__link"
              :href="link.link"
              target="_blank"
            >
              {{ $t(link.text) }}
            </a>
          </template>

          <template v-else>
            <a v-if="link.target" class="footer__link" :href="link.link" :target="link.target">{{ $t(link.text) }}</a>
            <NuxtLink v-else class="footer__link" :to="localePath(link.link)" no-prefetch>{{ $t(link.text) }}</NuxtLink>
          </template>
        </template>
      </div>
      <div class="footer__col">
        <p class="footer__info">
          E-mail:
          <a :href="supportEmail" class="footer__link footer__email"> support@finteria.{{ globals.tld }} </a>
        </p>

        <div class="footer__social">
          <img src="/img/payment/visa.png" width="42" height="14" alt="visa" />
          <img src="/img/payment/mastercard.png" width="39" height="25" alt="mastercard" />
          <img src="/img/payment/maestro.png" width="40" height="25" alt="maestro" />
        </div>
      </div>
    </div>
    <div class="footer__bottom container">
      <p class="footer__row footer__row_gap">
        Finteria Limited. Address: Trust Company Complex, Ajeltake Road, Ajeltake Island, Majuro, Marshall Islands,
        MH96960
      </p>
      <p class="footer__row footer__row_gap">
        {{ $t("footer.postfooter") }}
      </p>
      <p class="footer__row footer__row_gap">
        {{ $t("footer.disclaimer") }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useFooterConstants } from "@/constants/footer";
import { useGlobals } from "~~/stores/globals";
import { useUserStore } from "~~/stores/userStore";
import { redirectToDefaultProfilePlatform } from "~~/services/helpers";

import type { FooterLinkExtend } from "@/constants/footer";

const globals = useGlobals();
const localePath = useLocalePath();

const footerCrypto = [
  { name: "btc" },
  { name: "eth" },
  { name: "ltc" },
  { name: "tusd" },
  { name: "usdc" },
  { name: "paxo" },
  { name: "usdt" },
  { name: "dai" },
  { name: "rub" },
];
const footerLinks = ref<FooterLinkExtend[]>([]);

const supportEmail = ref(`mailto:support@finteria.${globals.tld}`);
footerLinks.value = useFooterConstants();

const userStore = useUserStore();
const isAuth = computed(() => userStore.isAuth)

onBeforeMount(() => {
  footerLinks.value = [];
  supportEmail.value = "";
  setTimeout(() => {
    supportEmail.value = `mailto:support@finteria.${globals.tld}`;
    footerLinks.value = useFooterConstants();
  }, 0);
});
</script>

<style scoped lang="scss">
@import "../assets/style/include.scss";

.footer {
  @include media-breakpoint-down("sm") {
    padding-bottom: 40px;
  }
}

.footer__top-wrap {
  background: $color-primary;
  @include media-breakpoint-down("xl") {
    font-size: 14px;
  }
}

.footer__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer__bottom {
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: 1px solid $color-disable-light;

  @include media-breakpoint-down("sm") {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    text-align: center;
  }
}

.footer__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
}

.footer__row_top {
  padding-top: 16px;
  padding-bottom: 16px;
  color: $color-white;
  @include media-breakpoint-down("sm") {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
}

.footer__row_gap {
  gap: 6px;
  font-size: 12px;
}

.footer__link {
  font-size: 14px;
  color: $color-primary;
  text-align: left;
  &:hover {
    color: $color-primary-hover;
  }
}

.footer__email {
  font-weight: 400;
}

.footer__social {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}
.footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;
  padding: 5px;
  background: $color-primary-light;
  border-radius: 50%;
  transition: color $transition-time;
  &:hover {
    color: $color-orange;
  }
}

.footer__body {
  display: flex;
  justify-content: space-between;
  padding-top: 60px;
  padding-bottom: 60px;
  @include media-breakpoint-down("lg") {
    flex-wrap: wrap;
    gap: 50px;
  }
  @include media-breakpoint-down("sm") {
    gap: 20px;
  }
}

.footer__crypto {
  display: flex;
  gap: 10px;
  margin-bottom: auto;
  @include media-breakpoint-down("sm") {
    flex-wrap: wrap;
    justify-content: center;
  }
}

.footer__crypto-icon {
  width: 30px;
  height: 30px;
}

.footer__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.footer__body .footer__col:not(:last-child) {
  width: 160px;

  @include media-breakpoint-up("sm") {
    width: auto;
  }
}

.footer__info {
  display: flex;
  gap: 6px;
  margin: 0;
}
</style>
