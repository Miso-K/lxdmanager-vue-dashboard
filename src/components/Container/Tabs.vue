<template>
    <v-container grid-list-md>
  <v-tabs icons-and-text fixed-tabs>
    <v-tab href="#tab-1">
      {{ $t('containers.tabs.info') }}
      <v-icon>info</v-icon>
    </v-tab>
    <v-tab href="#tab-2">
      {{ $t('containers.tabs.console') }}
      <v-icon>code</v-icon>
    </v-tab>
    <v-tab href="#tab-3">
      {{ $t('containers.tabs.settings') }}
      <v-icon>settings</v-icon>
    </v-tab>
    <v-tab v-if="showSnapshots" href="#tab-4">
      {{ $t('containers.tabs.snapshots') }}
      <v-icon>photo_camera</v-icon>
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
        <tab-console v-bind="$props"></tab-console>
      </v-card>
      <v-card v-if="i === 3" flat>
        <tab-settings v-bind="$props"></tab-settings>
      </v-card>
      <v-card v-if="i === 4" flat>
        <tab-snapshots v-bind="$props"></tab-snapshots>
      </v-card>
    </v-tab-item>
  </v-tabs>
    </v-container>
</template>

<script>
  import TabInfo from './Info';
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
      'tab-console': TabConsole,
      'tab-snapshots': TabSnapshots,
      'tab-settings': TabSettings
    },
    computed: {
      tabsLength() {
        return this.showSnapshots ? 4 : 3;
      },
      showSnapshots() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      }
    },
    mounted() {
      // this.$store.dispatch('fetchContainers');
      // console.log(this.$store.getters.containersTableData);
    }
  };
</script>
