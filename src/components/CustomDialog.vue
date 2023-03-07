<template>
  <v-dialog v-model="show" persistent width="auto">
    <v-card class="h4-th pa-5">
      <v-row :no-gutters="true">
        <v-col cols="12">
          <v-btn
            icon="mdi-close"
            class="float-end d-inline"
            flat
            @click="show = false"
          ></v-btn>
        </v-col>
      </v-row>

      <v-card-title v-if="title.length > 0" class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <div class="text-center d-flex flex-column">
          <v-icon class="mx-auto" size="70" :color="type">
            {{ icon }}
          </v-icon>
          {{ content }}
        </div></v-card-text
      >
      <v-card-actions class="d-flex justify-space-evenly">
        <v-btn
          class="flex-grow-1"
          :class="'bg-' + type"
          rounded="pill "
          @click="show = false"
        >
          Ok
        </v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "success",
    },
  },

  data() {
    return {
      icon: "mdi-check-circle-outline",
      color: "success",
    };
  },
  methods: {
    getIcon() {
      if (this.type === "success") {
        this.icon = "mdi-check-circle-outline";
      } else if (this.type === "warning") {
        this.icon = "mdi-alert-circle-outline";
      } else {
        this.icon = "mdi-close-circle-outline";
      }
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("onChangeDialog", value);
      },
    },
  },
  watch: {
    type() {
      this.getIcon();
    },
  },
  created() {
    this.getIcon();
  },
};
</script>
