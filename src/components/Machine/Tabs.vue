<template>
    <v-container grid-list-md>
  <v-tabs icons-and-text fixed-tabs>
    <v-tab href="#tab-1">
      Info
      <v-icon>info</v-icon>
    </v-tab>
    <v-tab href="#tab-2">
      Console
      <v-icon>code</v-icon>
    </v-tab>
    <v-tab href="#tab-3">
      Settings
      <v-icon>settings</v-icon>
    </v-tab>
    <!--<v-tab href="#tab-4">
      Snapshots
      <v-icon>photo_camera</v-icon>
    </v-tab>-->
    <v-tab-item
      v-for="i in 3"
      :key="i"
      :value="'tab-' + i"
    >
      <v-card v-if="i === 1" flat>
         <tab-info></tab-info>
      </v-card>
      <v-card v-if="i === 2" flat>
        <tab-console></tab-console>
      </v-card>
      <v-card v-if="i === 3" flat>
        <tab-settings></tab-settings>
      </v-card>
      <v-card v-if="i === 4" flat>
        <tab-snapshots></tab-snapshots>
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
    mounted() {
      // this.$store.dispatch('fetchContainers');
      // console.log(this.$store.getters.containersTableData);
    }
  };
</script>
