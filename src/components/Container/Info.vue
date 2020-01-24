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
          <v-subheader>{{ $t('containers.config.general') }}</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.name') }}</v-list-item-title>
              <v-list-item-subtitle>{{ container.name }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.created') }}</v-list-item-title>
              <v-list-item-subtitle>{{ formatDate(container.created_at) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.status') }}</v-list-item-title>
              <v-list-item-subtitle >{{ container.status}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('containers.config.system') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.os') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_os">{{ config.image_os }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.os_release') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_release">{{ config.image_release }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.os_version') }}</v-list-item-title>
              <v-list-item-subtitle v-if="config.image_version">{{ config.image_version }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('containers.config.limits') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.cpu') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_cpu">{{ config.limits_cpu }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.memory') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_memory">{{ config.limits_memory }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="showDisk">
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.disk') }}</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_disk !== '0'">{{ config.limits_disk }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>{{ $t('containers.config.network') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>IPv4</v-list-item-title>
                <v-list-item-subtitle v-if="ips[0]">{{ ips[0].address }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>IPv6</v-list-item-title>
              <v-list-item-subtitle v-if="ips[1]">{{ ips[1].address }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>-</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="showPrice">
            <v-list-item-content>
              <v-list-item-title>{{ $t('containers.config.price') }}</v-list-item-title>
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
    data() {
      return {
        buttons: [
          {
            name: this.$t('containers.actions.start'),
            icon: 'play_arrow',
            action: this.startContainer,
            showWhen: [STOPPED],
            color: 'green',
            disable: true
          },
          {
            name: this.$t('containers.actions.unfreeze'),
            icon: 'play_circle_outline',
            action: this.unfreezeContainer,
            showWhen: [FROZEN],
            color: 'blue',
            disable: true
          },
          {
            name: this.$t('containers.actions.freeze'),
            icon: 'pause_circle_outline',
            action: this.freezeContainer,
            showWhen: [RUNNING],
            color: 'blue-grey',
            disable: true
          },
          {
            name: this.$t('containers.actions.stop'),
            icon: 'stop',
            action: this.stopContainer,
            showWhen: [RUNNING, FROZEN],
            color: 'red',
            disable: true
          },
          {
            name: this.$t('containers.actions.stopforce'),
            icon: 'power_settings_new',
            action: this.stopforceContainer,
            showWhen: [RUNNING, FROZEN],
            color: 'red',
            disable: true
          },
          {
            name: this.$t('containers.actions.restart'),
            icon: 'replay',
            action: this.restartContainer,
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
          return this.$store.state.containers.dialogs.info !== null;
          // return this.value;
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeContainerInfoDialog');
          }
          // this.$emit('input', value);
        }
      },
      availableButtons() {
        this.buttons.filter(button => this.disableButton(button));
        return this.buttons;
      },
      id() {
        return Number(this.$route.params.id);
      },
      container() {
        // console.log(this.$store.getters.containerDataId(this.id));
        return this.$store.getters.containerDataId(this.id);
      },
      config() {
        // console.log(this.container.config);
        return this.container.config ? this.container.config : '';
      },
      ips() {
        // console.log(this.container);
        return this.container.ips ? this.container.ips : '';
      },
      status() {
        return this.container.status;
      },
      loading() {
        return this.$store.getters.containerIsLoading(this.id);
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
        'startContainer',
        'stopContainer',
        'freezeContainer',
        'stopforceContainer',
        'restartContainer',
        'unfreezeContainer',
        'fetchContainer'
      ]),
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
        // this.$store.dispatch('fetchContainers');
        // this.fetchContainers();
        // console.log(this.id);
        this.$store.dispatch('fetchContainer', this.id);
        // console.log(this.$store.getters.containersTableData);
      },
      formatDate(date) {
        const d = new Date(date);
        return d.toDateString();
      }
    }
  };
</script>
