<template>
  <CardUi in-content class="ui-card--shadowed">
    <BaseButton type="button" @click="navigateTo(localePath(path.account.loans.create))">Get Loan</BaseButton>
  </CardUi>
  <BaseLoader v-if="isLoading" />
  <template v-else>
    <TableUi :rows="userLoans.loans || []" :columns="columns" compact>
      <template v-slot="{ row, prop }">
        <template v-if="prop === 'id'">
          <span>{{ row[prop] }}</span>
          <span
            v-if="type === 'sm'"
            :class="{ green: OPEN_STATUSES.includes(row.status), orange: row.status === 'closed' }"
            style="display: block"
            >{{ STATUS_VIEW[row.status] }}</span
          >
        </template>

        <template v-if="prop === 'status'">
          <span :class="{ green: OPEN_STATUSES.includes(row.status), orange: row.status === 'closed' }">{{
            STATUS_VIEW[row.status]
          }}</span>
        </template>

        <template v-if="prop === 'loan_amount'">
          <span v-if="type !== 'sm'">{{
            trimFloatNumber(
              row.status === "opened" ? row.loan_amount : row.initial_loan_amount,
              row.loan_currency.visual_divisibility
            )
          }}</span>
          <div v-if="type === 'md'">
            <img
              :src="`/icons/${row.loan_currency.display_code}.svg`"
              alt="loan_currency"
              class="currency__img me-1"
              :title="row.loan_currency.display_code.toUpperCase()"
            />
            <span>{{ row.loan_currency.display_code.toUpperCase() }}</span>
          </div>

          <template v-else-if="type === 'sm'">
            <div class="my-1">
              <img
                :src="`/icons/${row.loan_currency.display_code}.svg`"
                alt="loan_currency"
                class="currency__img me-1"
                :title="row.loan_currency.display_code.toUpperCase()"
              />
              <span>{{ row.loan_currency.display_code.toUpperCase() }}</span>
              |
              <span>{{
                trimFloatNumber(
                  row.status === "opened" ? row.loan_amount : row.initial_loan_amount,
                  row.loan_currency.visual_divisibility
                )
              }}</span>
            </div>
            <div>
              <img
                :src="`/icons/${row.collateral_currency.display_code}.svg`"
                alt="collateral_currency"
                class="currency__img me-1"
                :title="row.loan_currency.display_code.toUpperCase()"
              />
              <span>{{ row.collateral_currency.display_code.toUpperCase() }}</span>
              |
              <span>{{
                trimFloatNumber(
                  row.status === "opened" ? row.collateral_amount : row.initial_collateral_amount,
                  row.collateral_currency.visual_divisibility
                )
              }}</span>
            </div>
          </template>
        </template>
        <template v-if="prop === 'loan_currency'">
          <img
            :src="`/icons/${row.loan_currency.display_code}.svg`"
            alt="loan_currency"
            class="currency__img me-1"
            :title="row.loan_currency.display_code.toUpperCase()"
          />
          <span>{{ row.loan_currency.display_code.toUpperCase() }}</span>
        </template>

        <template v-if="prop === 'collateral_amount'">
          <span>{{
            trimFloatNumber(
              row.status === "opened" ? row.collateral_amount : row.initial_collateral_amount,
              row.collateral_currency.visual_divisibility
            )
          }}</span>
          <div v-if="type === 'md' || type === 'sm'">
            <img
              :src="`/icons/${row.collateral_currency.display_code}.svg`"
              alt="collateral_currency"
              class="currency__img mx-1"
              :title="row[prop]?.display_code?.toUpperCase()"
            />
            <div class="d-inline-block">{{ row.collateral_currency?.display_code?.toUpperCase() }}</div>
          </div>
        </template>
        <template v-if="prop === 'collateral_currency'">
          <img
            :src="`/icons/${row[prop].display_code}.svg`"
            alt="collateral_currency"
            class="currency__img mx-1"
            :title="row[prop]?.display_code?.toUpperCase()"
          />
          <div class="d-inline-block">{{ row[prop]?.display_code?.toUpperCase() }}</div>
        </template>

        <template v-if="prop === 'ltv'">
          <span>{{ row[prop] }} %</span>
        </template>

        <template v-if="prop === 'daily_rate'"> {{ row.daily_rate * 100 }}% </template>

        <template v-if="prop === 'btns'">
          <div class="d-flex justify-content-end justify-content-lg-end gap-1 row-buttons__wrapper">
            <BaseButton type="button" color="tertiary" @click="pressBtn(row, 'loan')">Details</BaseButton>
            <BaseButton
              v-if="props.activeTab !== 'archive' && row.status !== 'closed'"
              type="button"
              color="secondary"
              @click="pressBtn(row, 'repay')"
            >
              Repay
            </BaseButton>
          </div>
        </template>
      </template>
    </TableUi>

    <AccountTablePagination v-if="userLoans.loans?.length" :meta="userLoans.metaPage" @update="updatePage" />
  </template>
</template>

<script setup>
import TableUi from "@/components/account/AccountTable.vue";
import AccountTablePagination from "@/components/account/AccountTablePagination.vue";
import BaseButton from "@/components/base/BaseButton/BaseButton.vue";
import CardUi from "@/components/base/BaseCard/BaseCard.vue";
import { path } from "@/constants/routes";
import { useLoansStore } from "@/stores/userLoans";
import { computed, onUnmounted, reactive, watch } from "vue";
import BaseLoader from "@/components/base/BaseLoader/BaseLoader.vue";
import { trimFloatNumber } from "@/utils/processNumbers";
import { useBreakpoints } from "@/utils/useBreakpoints";
const props = defineProps({
  activeTab: {
    required: true,
  },
});
const userLoans = useLoansStore();
const isLoading = ref();
const { type } = useBreakpoints();
const localePath = useLocalePath();
const i18n = useI18n();
const filters = reactive({
  page: 1,
  limit: 10,
  status: null,
});
const OPEN_STATUSES = ["opened", "unsecured"];
// for filter purposes
const STATUS_HASHMAP = {
  all: "",
  active: "opened",
  archive: "closed",
};
// statuses from api differs than in view
const STATUS_VIEW = i18n.tm("account.loans.statuses");

const columns = computed(() => {
  const data = i18n.messages.value[i18n.locale.value].account.loans.columns;
  const output = { ...data };
  if (props.activeTab !== "all") {
    delete output.status;
  }
  if (type.value === "md" || type.value === "sm") {
    delete output.collateral_currency;
    delete output.loan_currency;
    output.loan_amount += ` / ${i18n.t("account.loans.helpers.currency")}`;
    output.collateral_amount += ` / ${i18n.t("account.loans.helpers.currency")}`;
  }

  if (type.value === "sm") {
    delete output.collateral_amount;
    delete output.status;
    output.loan_amount = `${i18n.t("account.loans.columns.loan_amount")} / ${i18n.t(
      "account.loans.helpers.currency"
    )}\n${i18n.t("account.loans.columns.collateral_amount")} / ${i18n.t("account.loans.helpers.currency")}`;
    output.id = `${i18n.t("account.loans.helpers.id")} / ${i18n.t("account.loans.columns.status")}`;
  }

  return output;
});

async function fetchLoans() {
  isLoading.value = true;
  await userLoans.FETCH_LOANS({
    page: filters.page,
    limit: filters.limit,
    status: filters.status,
  });
  isLoading.value = false;
}

function updatePage(val) {
  filters.page = val;
}

async function init() {
  userLoans.SET_ACTIVE_LOAN(null);
}
init();
async function pressBtn(row, type) {
  await userLoans.SET_ACTIVE_LOAN(row);
  navigateTo(localePath(path.account.loans[type] + `?id=${row.id}`));
}

watch(filters, () => {
  fetchLoans();
});

watch(
  () => props.activeTab,
  (newValue) => {
    filters.status = STATUS_HASHMAP[newValue];
  }
);

onMounted(() => {
  filters.status = STATUS_HASHMAP[props.activeTab];
});

onUnmounted(() => {
  userLoans.SET_LOANS(null);
});
</script>

<style lang="scss" scoped>
.currency__img {
  width: 20px;
  height: 20px;
}

.green {
  color: $color-green-light;
}

.orange {
  color: orange;
}

.row-buttons__wrapper {
  @include media-breakpoint-down("md") {
    justify-content: flex-end !important;
    padding: 12px 0;
  }
}
</style>
