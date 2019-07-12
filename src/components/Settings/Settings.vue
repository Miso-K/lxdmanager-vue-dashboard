<template>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex d-flex xs12 md8>
          <settings-profile></settings-profile>
        </v-flex>
        <v-flex d-flex xs12 md4>
          <v-layout wrap>
            <v-flex d-flex md12>
              <settings-settings></settings-settings>
            </v-flex>
            <v-flex d-flex md12>
              <settings-change-password></settings-change-password>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
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
