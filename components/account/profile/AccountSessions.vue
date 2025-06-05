<template>
  <div class="sessions">
    <TableUi :rows="sessionsData" :columns="columns" :meta="metaData">
      <template v-slot="{ row, prop }">
        <template v-if="prop === 'country'">
          {{ row.country }} <br />
          <span v-if="row.city" class="substring">{{ row.city }}</span>
        </template>
      </template>
    </TableUi>
    <Pagination :meta="metaData" @update="updatePage" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import services from "@/services/profile";
import { detectMob, BrowserDetected, oSDetected } from "@/utils/utilsDetected";

import TableUi from "@/components/account/AccountTable.vue";
import Pagination from "@/components/account/AccountTablePagination.vue";
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const i18nMessages = computed(() => i18n.messages.value[i18n.locale.value].account.settings);

const sessionsReq = ref();

const sessionsData = computed(() =>
  sessionsReq.value.data.map((session) => {
    const sessionRowFreeze = {
      icon: null,
      user_agent: null,
      system: null,
      ip: null,
      country: null,
    };
    sessionRowFreeze.icon = detectMob(session.user_agent);
    sessionRowFreeze.time = session.created_at;
    session.user_agent = `${BrowserDetected(session.user_agent)} ${oSDetected(session.user_agent)}`;
    Object.assign(sessionRowFreeze, session);
    return sessionRowFreeze;
  })
);

const metaData = computed(() => sessionsReq.value.meta);
const isRouterQueryPage = computed(() => (route.query.page ? { page: route.query.page } : null));

const columns = computed(() => i18nMessages.value.sessions.columns);

sessionsReq.value = await services.getSessionsList(isRouterQueryPage.value);

const updatePage = async (page) => {
  sessionsReq.value = await services.getSessionsListWithParams({ page: page });
  router.replace({ query: { ...route.query, page: page } });
};
</script>

<style lang="scss">
.sessions {
  margin-top: 30px;
  &-wrap {
    font-size: 15px;
    font-weight: 400;
    line-height: 145%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .substring {
    font-size: 12px;
    font-weight: 500;
    line-height: 140%;
    color: $color-grey;
    @include media-breakpoint-down("sm") {
      font-size: 9px;
    }
  }
}
</style>
