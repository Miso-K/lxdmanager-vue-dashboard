<template>
  <v-flex>
    <v-card class="mb-0 ma-0" height="130">
      <v-sheet
        class="v-sheet--offset mx-auto"
        :color=color
        elevation="3"
        max-width="calc(100% - 32px)"
      >
        <v-icon size="60" class="white--text" left>{{ icon }}</v-icon>
      </v-sheet>

      <v-card-text class="pt-0">
        <div class="title font-weight-light mb-2 mt-0">{{ label }}</div>
        <div class="subheading font-weight-light black--text">{{ value }} {{ unit }}</div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>

  export default {
    name: 'stats-card',
    props: ['flex', 'value', 'label', 'icon', 'extras', 'unit', 'color'],
    components: {
    },
    computed: {
      extrasClassName() {
        return this.extras.length > 1 ? 'stats-card-extras-two-up' : '';
      }
    }
  };
</script>
