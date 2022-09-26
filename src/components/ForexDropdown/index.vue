<template>
  <select
    name="currencySelect"
    @change="onChange($event)"
    class="forexDropdown"
    v-model="selected"
  >
    <option
      v-for="(item, index) in currencies"
      :key="index"
      :value="getObjKey(currencies, item)"
    >
      {{ item }}
    </option>
  </select>
</template>

<script>
import store from "../../store";
import globalMixin from "@/mixins/globalMixin";

export default {
  name: "ForexDropdown",
  mixins: [globalMixin],
  props: { defaultVal: String },
  data: function () {
    return {
      selected: this.defaultVal,
    };
  },
  computed: {
    currencies() {
      return store.getters.getCurrencies;
    },
  },
  methods: {
    onChange(event) {
      this.$emit("currency-onchange", event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.forexDropdown {
  padding: 8px 32px 8px 8px;
  border: 2px solid #dfdfdf;
  border-radius: 4px;
  background-image: linear-gradient(45deg, transparent 50%, gray 50%),
    linear-gradient(135deg, gray 50%, transparent 50%);
  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
  background-size: 5px 5px, 5px 5px, 1px 1.5em;
  background-repeat: no-repeat;

  &:focus {
    background-image: linear-gradient(45deg, green 50%, transparent 50%),
      linear-gradient(135deg, transparent 50%, green 50%);
    background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em,
      calc(100% - 2.5em) 0.5em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;
    border-color: green;
    outline: 0;
  }
}
</style>
