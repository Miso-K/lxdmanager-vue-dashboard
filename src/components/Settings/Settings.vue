<template>
    <v-container grid-list-md>
  <v-tabs icons-and-text fixed-tabs>
    <v-tab href="#tab-1">
      {{ $t('settings.profile.title') }}
      <v-icon>mdi-account</v-icon>
    </v-tab>
    <v-tab href="#tab-2">
      {{ $t('settings.settings.title') }}
      <v-icon>settings</v-icon>
    </v-tab>
    <v-tab href="#tab-3">
      {{ $t('settings.password.title') }}
      <v-icon>mdi-account-lock</v-icon>
    </v-tab>
    <v-tab-item
      v-for="i in 3"
      :key="i"
      :value="'tab-' + i"
    >
      <v-card v-if="i === 1" flat>
         <settings-profile></settings-profile>
      </v-card>
      <v-card v-if="i === 2" flat>
        <settings-settings></settings-settings>
      </v-card>
      <v-card v-if="i === 3" flat>
        <settings-change-password></settings-change-password>
      </v-card>
    </v-tab-item>
  </v-tabs>
    </v-container>
</template>


<script>
  // import StatsCard from './StatsCard';
  // import Stats from '../../libraries/store/modules/stats';

  import SettingsProfile from './SettingsProfile';
  import SettingsSettings from './SettingsSettings';
  import SettingsChangePassword from './SettingsChangePassword';

  export default {
    data() {
      return {
      };
    },
    components: {
      'settings-profile': SettingsProfile,
      'settings-settings': SettingsSettings,
      'settings-change-password': SettingsChangePassword
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      },
      me() {
        // console.log(this.$store.getters['auth/me']);
        return this.$store.getters['auth/me'];
      }
    },
    methods: {
    },
    mounted() {
      // console.log(this.$store.getters['auth/me']);
      // console.log(this.$store.getters.stats);
      // this.$store.dispatch('fetchStats');
    },
    created() {
      // this.$store.registerModule('stats', Stats);
    }
  };
</script>
