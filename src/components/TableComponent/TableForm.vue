<template>
  <div class="v-data-table">
    <div class="v-data-table__wrapper">
      <table>
        <tbody>
        <tr>
          <td class="pt-4 pb-4 actions" :colspan="colspan">
            <slot name="actions"></slot>
            <v-btn
                v-if="$route.query.id && $route.query.type === 'todo'"
                class="ml-4"
                color="primary"
                dark
                @click="goProcessView($route.query.id)"
            >
              处理
            </v-btn>
            <v-btn class="ml-4" color="primary" dark @click="onBack">
              返回
            </v-btn>
          </td>
        </tr>
        <tr>
          <td :colspan="colspan">
            <h1 class="title pt-4 pb-4">{{ json.title }}</h1>
          </td>
        </tr>
        <tr v-for="(row, rdx) in finalTable" :key="rdx">
          <td
              v-for="(col, cdx) in row"
              :key="cdx"
              :colspan="col.colspan || 1"
              :class="col.type | classFilter"
              :style="labelWidthCompute(col.type)"
          >
              <span v-if="col.type === 'label'" class="label">{{
                  col.value
                }}</span>

            <v-subheader v-if="col.type === 'subtitle'">{{
                col.value
              }}
            </v-subheader>

            <span v-if="col.type === 'text'" class="text">{{
                col.value
              }}</span>

            <v-text-field
                v-else-if="col.type === 'field'"
                v-bind="publicProps"
                v-model="modelValue[col.value]"
                clearable
                :placeholder="col.placeholder"
            />

            <v-textarea
                v-else-if="col.type === 'textarea'"
                auto-grow
                rows="2"
                clearable
                v-bind="publicProps"
                v-model="modelValue[col.value]"
                :placeholder="col.placeholder"
            />

            <v-select
                v-bind="publicProps"
                v-else-if="col.type === 'select'"
                v-model="modelValue[col.value]"
                :items="col.items"
            ></v-select>

            <DatePickerField
                v-else-if="col.type === 'date'"
                v-bind="publicProps"
                v-model="modelValue[col.value]"
            />

            <TimePickerField
                v-else-if="col.type === 'time'"
                v-bind="publicProps"
                v-model="modelValue[col.value]"
            />
          </td>
        </tr>

        <slot name="files"></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {splitArray} from "@/utils/common";
import businessMixin from "@/mixins/businessMixin";

export default {
  mixins: [businessMixin],
  data() {
    return {
      colspan: 999,
      publicProps: {
        solo: true,
        hideDetails: true,
        flat: true,
      },
    };
  },
  model: {
    prop: "model",
    event: "update",
  },
  props: {
    json: {
      type: Object,
      require: true,
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    labelWidth: {
      type: String,
      default: "110px",
    },
  },
  computed: {
    modelValue: {
      get() {
        return this.model;
      },
      set(newValue) {
        this.$emit("update", newValue);
        return newValue;
      },
    },
    finalTable() {
      return this.$vuetify.breakpoint.mobile
          ? splitArray(this.json.table.flat(), 2)
          : this.json.table;
    },
  },

  filters: {
    classFilter(type) {
      return [type === "label" ? "label-td" : ""];
    },
  },
  methods: {
    labelWidthCompute(type) {
      return type === "label" ? `width:${this.labelWidth};` : "";
    },
    onBack() {
      window.history.back();
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  color: rgba(0, 0, 0, 0.87);
}

td {
  border: thin solid rgba(0, 0, 0, 0.12);
}

.title {
  text-align: center;
}

.label-td {
  background-color: rgba(0, 0, 0, 0.05);
  text-align: center;
}

.actions {
  text-align: right;
}
</style>
