<template>
  <transition name="fade">
    <v-app>
      <v-navigation-drawer app :mini-variant="mini" v-model="drawer">
        <v-list class="pa-0">
          <v-list-item>
            <v-list-tile avatar tag="div">
              <v-list-tile-avatar>
                <img :src="avatar" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ me.name }}<v-chip v-if="me.admin" label small>Admin</v-chip></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
        <v-list class="pt-0" dense>
          <v-divider></v-divider>
          <v-list-item v-for="item in items" :key="item">
            <v-list-tile v-if="item.user || me.admin" :to="item.to">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-tile to="/logout">
              <v-list-tile-action>
                <v-icon>exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Sign Out</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-item>
        </v-list>
        <v-btn v-if="!mini" icon absolute right style="bottom: 18px" @click.native.stop="mini = !mini">
         <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-btn v-if="mini" icon absolute right style="bottom: 18px" @click.native.stop="mini = !mini">
         <v-icon>chevron_right</v-icon>
        </v-btn>
      </v-navigation-drawer>
      <!--<v-toolbar fixed class="lwp-toolbar" app dark height="55px">-->
        <v-toolbar fixed class="lwp-toolbar" app dark extended extension-height="7" height="50px">
          <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>
          <router-link to="/" tabindex="-1">
            <img class="logo" src="../../assets/logo_lxd-manager.png" />
          </router-link>
        </v-toolbar-title>
        <v-progress-linear v-if="loading" slot="extension" :indeterminate="true" class="ma-0"></v-progress-linear>
      </v-toolbar>
      <main>
        <v-content>
          <v-container fluid>
            <router-view></router-view>
          </v-container>
        </v-content>
      </main>
      <notifications></notifications>
      <relogin></relogin>
      <v-footer class="pa-3" fixed inset>
        <v-spacer></v-spacer>
        <div>&copy; lxdmanager.com {{ new Date().getFullYear() }}</div>
      </v-footer>
    </v-app>
  </transition>
</template>

<script>
  import md5 from 'md5';
  import { loadAndCheckAuth } from '../../libraries/plugins/auth';
  import Notifications from '../../components/Notifications';
  import Loader from '../../components/Loader';
  import Relogin from '../../components/Relogin';

  export default {
    name: 'layout',
    title: 'LXDmanager',
    components: {
      notifications: Notifications,
      loader: Loader,
      relogin: Relogin
    },
    beforeRouteEnter(to, from, next) {
      loadAndCheckAuth(to.meta.auth || false)
        .then(() => next())
        .catch(() => {
          console.log('⛔️  Unauthorized');
          return next({ name: 'login' });
        });
    },
    data() {
      return {
        drawer: true,
        items: [
          { title: 'Dashboard', icon: 'dashboard', to: { name: 'dashboard' }, user: true },
          { title: 'Servers', icon: 'storage', to: { name: 'servers' }, user: true },
          { title: 'Users', icon: 'group', to: { name: 'users' }, user: false },
          { title: 'Groups', icon: 'people_outline', to: { name: 'groups' }, user: false },
          { title: 'Settings', icon: 'settings', to: { name: 'settings' }, user: true },
          { title: 'Help', icon: 'help', to: { name: 'help' }, user: true },
          { title: 'AppConfig', icon: 'settings', to: { name: 'appconfig' }, user: false }
        ],
        mini: false,
        showSnack: true,
        type: 'success'
      };
    },
    computed: {
      me() {
        // this.$store.dispatch('fetchMe');
        console.log(this.$store.getters['auth/me']);
        return this.$store.getters['auth/me'];
      },
      avatar() {
        return `https://www.gravatar.com/avatar/${md5(this.me.email || '')}?s=84&d=retro`;
      },
      loading() {
        return this.$store.state.containers.loading;
      }
    },
    mounted() {
      setTimeout(() => {
        this.$store.dispatch('fetchMe').then(() => {
          this.me = this.$store.getters['auth/me'];
          console.log(this.me);
        });
      }, 500);
    }
  };
</script>

<style lang="scss">
  .logo {
    display: block;
    width: 140px;
  }

  .lwp-toolbar,
  .lwp-footer {
    background-color: #004159 !important;
  }


</style>
