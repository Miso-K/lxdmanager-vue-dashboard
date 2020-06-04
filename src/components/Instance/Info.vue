<template>
   <v-container fluid grid-list-xl>
     <v-btn
              absolute
              dark
              fab
              top
              right
              small
              color="blue"
              @click="refreshData"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
    <v-layout row>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('instances.config.general') }}</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.name') }}</v-list-item-title>
              <v-list-item-subtitle>{{ instance.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.created') }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(instance.created_at) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.status') }}</v-list-item-title>
              <v-list-item-subtitle >{{ instance.status}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('instances.config.system') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.os') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_os">{{ config.image_os }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.os_release') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_release">{{ config.image_release }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.os_version') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_version">{{ config.image_version }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('instances.config.limits') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.cpu') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_cpu">{{ config.limits_cpu }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.memory') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_memory">{{ config.limits_memory }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="showDisk">
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.disk') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_disk !== null">{{ config.limits_disk }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('instances.config.network') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>IPv4</v-list-item-title>
                <v-list-item-subtitle v-if="ips[0]">{{ filterIpv6(ips[0]) }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>IPv6</v-list-item-title>
              <v-list-item-subtitle v-if="ips[1]">{{ filterIpv6(ips[1]) }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="showPrice">
            <v-list-item-content>
              <v-list-item-title>{{ $t('instances.config.price') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.user_price">{{ config.user_price }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
    <v-layout row justify-center align-bottom>
      <template v-for="button in availableButtons">
          <v-btn
          :loading="loading"
          :disabled="button.disable"
          :color="button.color"
          class="white--text"
          @click.prevent="button.action(id)"
        >
          <v-icon dark>{{ button.icon }} </v-icon>
        {{ button.name }}
        </v-btn>
      </template>
    </v-layout>
   </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  import { RUNNING, STOPPED, FROZEN } from '../../libraries/utils/states';
  // import Loader from '../../components/Loader';

  export default {
    name: 'tab-info',
    props: ['id'],
    data() {
      return {
        buttons: [
          {
            name: this.$t('instances.actions.start'),
            icon: 'play_arrow',
            action: this.startInstance,
            showWhen: [STOPPED],
            color: 'green',
            disable: true
          },
          {
            name: this.$t('instances.actions.unfreeze'),
            icon: 'play_circle_outline',
            action: this.unfreezeInstance,
            showWhen: [FROZEN],
            color: 'blue',
            disable: true
          },
          {
            name: this.$t('instances.actions.freeze'),
            icon: 'pause_circle_outline',
            action: this.freezeInstance,
            showWhen: [RUNNING],
            color: 'blue-grey',
            disable: true
          },
          {
            name: this.$t('instances.actions.stop'),
            icon: 'stop',
            action: this.stopInstance,
            showWhen: [RUNNING, FROZEN],
            color: 'red',
            disable: true
          },
          {
            name: this.$t('instances.actions.stopforce'),
            icon: 'power_settings_new',
            action: this.stopforceInstance,
            showWhen: [RUNNING, FROZEN],
            color: 'red',
            disable: true
          },
          {
            name: this.$t('instances.actions.restart'),
            icon: 'replay',
            action: this.restartInstance,
            showWhen: [RUNNING, FROZEN],
            color: 'orange',
            disable: true
          }
        ]
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.instances.dialogs.info !== null;
          // return this.value;
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeInstanceInfoDialog');
          }
          // this.$emit('input', value);
        }
      },
      availableButtons() {
        this.buttons.filter(button => this.disableButton(button));
        return this.buttons;
      },
      id() {
        // return Number(this.$route.params.id);
        // console.log(this.$props);
        return Number(this.$props.id);
      },
      instance() {
        if (this.id) {
          // console.log(this.$store.getters.instanceDataId(this.id));
          // console.log(this.id);
          return this.$store.getters.instanceDataId(this.id);
        }
        return null;
      },
      config() {
        // console.log(this.instance.config);
        return this.instance.config ? this.instance.config : '';
      },
      ips() {
        // console.log(this.instance);
        return this.instance.ips ? this.instance.ips : '';
      },
      status() {
        return this.instance.status;
      },
      loading() {
        return this.$store.getters.instanceIsLoading(this.id);
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      showDisk() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      }
    },
    methods: {
      ...mapActions([
        'startInstance',
        'stopInstance',
        'freezeInstance',
        'stopforceInstance',
        'restartInstance',
        'unfreezeInstance',
        'fetchInstance'
      ]),
      filterIpv6(ip) {
        if (ip.scope === 'link') {
          return '';
        }
        return ip.address;
      },
      disableButton(button) {
        // console.log(this.buttons.indexOf(button));
        const x = this.buttons.indexOf(button);
        if (button.showWhen.includes(this.status)) {
          // console.log(x);
          // console.log(this.buttons[0]);
          // console.log(this.buttons[x]);
          this.buttons[x].disable = false;
        } else {
          this.buttons[x].disable = true;
        }
        return button;
      },
      refreshData() {
        // this.$store.dispatch('fetchInstances');
        // this.fetchInstances();
        // console.log(this.id);
        this.$store.dispatch('fetchInstance', this.id);
        // console.log(this.$store.getters.instancesTableData);
      },
      formatDate(date) {
        const d = new Date(date);
        return d.toDateString();
      }
    }
  };
</script>
