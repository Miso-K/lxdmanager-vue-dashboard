<template>
    <v-container grid-list-md>
  <v-tabs icons-and-text fixed-tabs>
    <v-tab href="#tab-1">
      {{ $t('instances.tabs.info') }}
      <v-icon>mdi-information-outline</v-icon>
    </v-tab>
    <v-tab href="#tab-2">
      {{ $t('instances.tabs.stats') }}
      <v-icon>mdi-chart-donut</v-icon>
    </v-tab>
    <v-tab href="#tab-3">
      {{ $t('instances.tabs.console') }}
      <v-icon>mdi-console</v-icon>
    </v-tab>
    <v-tab href="#tab-4">
      {{ $t('instances.tabs.settings') }}
      <v-icon>mdi-cog</v-icon>
    </v-tab>
    <v-tab v-if="showSnapshots" href="#tab-5">
      {{ $t('instances.tabs.snapshots') }}
      <v-icon>mdi-camera</v-icon>
    </v-tab>
    <v-tab-item
      v-for="i in tabsLength"
      :key="i"
      :value="'tab-' + i"
    >
      <v-card v-if="i === 1" flat>
         <tab-info v-bind="$props"></tab-info>
      </v-card>
      <v-card v-if="i === 2" flat>
         <tab-stats v-bind="$props"></tab-stats>
      </v-card>
      <v-card v-if="i === 3" flat>
        <tab-console v-bind="$props"></tab-console>
      </v-card>
      <v-card v-if="i === 4" flat>
        <tab-settings v-bind="$props"></tab-settings>
      </v-card>
      <v-card v-if="i === 5" flat>
        <tab-snapshots v-bind="$props"></tab-snapshots>
      </v-card>
    </v-tab-item>
  </v-tabs>
    </v-container>
</template>

<script>
  import TabInfo from './Info';
  import TabStats from './Stats';
  import TabConsole from './Console';
  import TabSnapshots from './Snapshots';
  import TabSettings from './Settings';

  export default {
    name: 'tabs',
    props: ['id'],
    data() {
      return {
      };
    },
    components: {
      'tab-info': TabInfo,
      'tab-stats': TabStats,
      'tab-console': TabConsole,
      'tab-snapshots': TabSnapshots,
      'tab-settings': TabSettings
    },
    computed: {
      tabsLength() {
        return this.showSnapshots ? 5 : 4;
      },
      showSnapshots() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      }
    },
    mounted() {
      // this.$store.dispatch('fetchInstances');
      // console.log(this.$store.getters.instancesTableData);
    }
  };
</script>
