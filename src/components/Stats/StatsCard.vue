<template>
  <v-flex :[flex]="true" sm6 xs12>
    <v-card class="mb-3 mx-auto" height="130">
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
  import StatsCardProgress from './StatsCardProgress';

  export default {
    name: 'stats-card',
    props: ['flex', 'value', 'label', 'icon', 'extras', 'unit', 'color'],
    components: {
      'stats-card-progress': StatsCardProgress
    },
    computed: {
      extrasClassName() {
        return this.extras.length > 1 ? 'stats-card-extras-two-up' : '';
      }
    }
  };
</script>
