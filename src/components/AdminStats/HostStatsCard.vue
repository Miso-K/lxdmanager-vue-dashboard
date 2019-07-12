<template>
  <v-flex md4 sm6 xs12 >
    <v-card class="mb-3 mx-auto">
      <v-sheet
        class="v-sheet--offset mx-auto"
        :color=color
        elevation="3"
        max-width="calc(100% - 32px)"
      >
        <v-icon size="60" class="white--text" left>{{ icon }}</v-icon>
      </v-sheet>

      <v-card-text class="pt-1">
        <div class="title font-weight-light mb-2 mt-2">{{ label }}</div>
        <div class="subheading font-weight-light black--text">{{ value }}{{ unit }}</div>
      <v-divider class="my-2"></v-divider>
        <div class="body-1 font-weight-light mb-2 mt-2">{{ label_sub }}</div>
        <div class="caption font-weight-light black--text">{{ value_sub }}{{ unit_sub }}</div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>

  export default {
    name: 'hosts-card-admin',
    props: ['value', 'label', 'icon', 'extras', 'unit', 'color', 'value_sub', 'label_sub', 'unit_sub'],
    components: {
    },
    computed: {
      extrasClassName() {
        return this.extras.length > 1 ? 'stats-card-extras-two-up' : '';
      }
    }
  };
</script>

