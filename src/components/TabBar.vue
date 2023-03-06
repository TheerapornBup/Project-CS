<template>
  <!--menu tabs -->
  <v-card class="mx-5 mt-10 rounded-t-xl">
    <v-tabs v-model="selectedTab" bg-color="whiteCream">
      <v-tab
        :class="index === 0 ? 'rounded-ts-xl' : ''"
        class="h4-th"
        selected-class="bg-lightGreen"
        v-for="(tab, index) in tabs"
        :key="index"
        :value="tab"
        >{{ tab }}</v-tab
      >
    </v-tabs>
    <!-- content tab -->
    <v-card-text class="bg-lightGreen">
      <v-window v-model="selectedTab">
        <v-window-item v-for="(tab, index) in tabs" :key="index" :value="tab">
          <slot name="content-tab"></slot>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TabBar",
  props: {
    tabs: {
      type: Array,
      require,
    },
    selected: {
      type: String,
      require,
    },
  },
  data() {
    return {
      selectedTab: this.tabs[0],
    };
  },
  watch: {
    selectedTab(tab) {
      this.$emit("onChangeTab", tab);
    },
    selected(tab) {
      this.selectedTab = tab;
    },
  },
};
</script>

<style scoped>
.v-tab {
  border: 3px solid #a6d2cd;
}
</style>
