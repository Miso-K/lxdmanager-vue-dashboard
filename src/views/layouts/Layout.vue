<template>
    <v-app>
      <v-navigation-drawer stateless app :mini-variant="mini" v-model="drawer">
        <v-list dense>
          <v-list-item>
            <v-list-tile-avatar>
                <v-img :src="avatar" contain height="30" />
              </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ me.name }} <v-chip v-if="me.admin" label small>Admin</v-chip></v-list-tile-title>
            </v-list-tile-content>
          </v-list-item>
        </v-list>
        <v-list dense>
          <v-divider></v-divider>
          <v-list-item color="primary" v-for="item in items" v-if="item.user || me.admin" :key="item.title" link :to="item.to">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item link to="/logout">
            <v-list-item-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-tile-title>{{ $t('menu.sign_out') }}</v-list-tile-title>
            </v-list-item-content>
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

      <v-app-bar app color="deep-purple darken-4" dark extended extension-height="8" height="57px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-img src="static/img/logo.png" contain height="30" ></v-img>
        <loader slot="extension"></loader>
      </v-app-bar>

      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>

      <notifications></notifications>
      <relogin></relogin>
      <v-footer class="pa-3" fixed inset>
        <v-spacer></v-spacer>
        <div>&copy; lxdmanager.com {{ new Date().getFullYear() }}</div>
      </v-footer>
    </v-app>
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
          { title: 'menu.dashboard', icon: 'dashboard', to: { name: 'dashboard' }, user: true },
          { title: 'menu.instances', icon: 'storage', to: { name: 'instances' }, user: true },
          { title: 'menu.images', icon: 'mdi-format-list-bulleted-square', to: { name: 'images' }, user: false },
          { title: 'menu.networks', icon: 'mdi-server-network', to: { name: 'networks' }, user: false },
          { title: 'menu.profiles', icon: 'mdi-format-list-bulleted', to: { name: 'profiles' }, user: false },
          { title: 'menu.projects', icon: 'mdi-format-list-bulleted-triangle', to: { name: 'projects' }, user: false },
          { title: 'menu.users', icon: 'mdi-account-multiple', to: { name: 'users' }, user: false },
          { title: 'menu.groups', icon: 'mdi-account-group', to: { name: 'groups' }, user: false },
          { title: 'menu.requests', icon: 'mdi-format-list-text', to: { name: 'requests' }, user: true },
          { title: 'menu.settings', icon: 'mdi-account-cog', to: { name: 'settings' }, user: true },
          { title: 'menu.help', icon: 'help', to: { name: 'help' }, user: true },
          { title: 'menu.app_config', icon: 'settings', to: { name: 'appconfig' }, user: false }
        ],
        mini: false,
        showSnack: true,
        type: 'success'
      };
    },
    computed: {
      me() {
        // this.$store.dispatch(fetchMe');
        // console.log(this.$store.getters['auth/me']);
        return this.$store.getters['auth/me'];
      },
      avatar() {
        return `https://www.gravatar.com/avatar/${md5(this.me.email || '')}?s=84&d=retro`;
      },
      loading() {
        const st = this.$store.state;
        // eslint-disable-next-line max-len
        return st.stats.loading || st.containers.loading || st.images.loading || st.users.loading || st.requests.loading;
      }
    },
    mounted() {
      setTimeout(() => {
        this.$store.dispatch('fetchMe').then(() => {
          this.me = this.$store.getters['auth/me'];
          // console.log(this.me);
        });
      }, 500);
    }
  };
</script>

