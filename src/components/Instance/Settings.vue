<template>
  <v-container fluid>
  <v-layout row>
    <v-flex class="text-md-center mt-3 mb-3">
    <v-btn
      color="secondary"
      :loading="loading"
      @click.stop="dialog_upgrade = true"
      :disabled="loading"
    >
      {{ $t('instances.actions.upgrade') }}
    </v-btn>

    <v-btn
      :loading="loading3"
      @click.stop="dialog_clone = true"
      :disabled="loading3"
      color="blue-grey"
      class="white--text"
    >
      {{ $t('instances.actions.clone') }}
      <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
    <v-btn
      :loading="loading3"
      @click.stop="dialog_destroy = true"
      :disabled="loading3"
      color="red"
      class="white--text"
    >
      {{ $t('instances.actions.destroy') }}
      <v-icon right dark>delete</v-icon>
    </v-btn>
  </v-flex>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_destroy" max-width="500">
      <v-card>
        <v-card-title class="headline">{{$t('instances.actions.destroy')}}</v-card-title>

        <v-card-text>
          {{$t('instances.order.destroy_instance.label')}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog_destroy = false"
          >
            {{$t('actions.disagree')}}
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click.native="dialog_destroy = false"
            @click="sendRequestDestroy"
          >
            {{$t('actions.agree')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_clone" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('instances.actions.clone')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_name.label')" disabled :value=instanceName></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_clone_name.label')" v-model="instanceClone"></v-text-field>
              </v-flex>
              <!---<v-flex xs12 sm6>
                <v-select
                  :items="['week', 'month', 'unlimited']"
                  v-model="cperiod"
                  label="Time period"
                  required
                ></v-select>
              </v-flex>-->
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="dialog_clone = false">{{$t('actions.close')}}</v-btn>
          <v-btn color="blue darken-1" text @click.native="dialog_clone = false" @click="sendRequestClone">{{$t('actions.create')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_upgrade" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('instances.actions.upgrade')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_name.label')" disabled :value=instanceName></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="1" max="4" step="1" v-model="cpu" label="CPUs"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="cpu" type="CPUs" suffix="CPUs"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="512" max="8172" step="512" v-model="memory" label="RAM"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="memory" type="MB" suffix="MB"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider v-if="diskEnabled" min="10" max="160" step="10" v-model="disk" label="Disk"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="diskEnabled" v-model="disk" type="Disk" suffix="GB"></v-text-field>
              </v-flex>
              <template v-if="showPrice">
                <v-flex xs3>
                  <v-subheader>{{ $t('instances.order.payment_period.label') }}</v-subheader>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items=periodes
                    v-model="period"
                    label="Period"
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>{{ $t('instances.order.calculated_price.label') }}</v-subheader>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    label="Price"
                    :value="price"
                    suffix="€"
                  ></v-text-field>
                </v-flex>
              </template>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="getInstanceConfig">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="dialog_upgrade = false">{{$t('actions.close')}}</v-btn>
          <v-btn color="blue darken-1" text @click.native="dialog_upgrade = false" @click="sendRequestUpgrade">{{$t('actions.create')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-container>
</template>

<script>

  export default {
    name: 'tab-info',
    data() {
      return {
        dialog_clone: false,
        dialog_destroy: false,
        dialog_upgrade: false,
        period: 1,
        name: '',
        cpu: '',
        memory: '',
        disk: '',
        instanceClone: '',
        cperiod: '',
        periodes: [
          { text: '1 Month', value: 1 },
          { text: '3 Months', value: 1 },
          { text: '6 Months', value: 0.95 },
          { text: '12 Months', value: 0.90 },
          { text: '24 Months', value: 0.80 }
        ]
      };
    },
    computed: {
      id() {
        return Number(this.$route.params.id);
      },
      instance() {
        return this.$store.getters.instanceDataId(this.id);
      },
      instanceName() {
        return this.instance.name;
      },
      instanceNameClone() {
        const name = this.instance.name;
        return name.concat('-clone');
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      getPrice() {
        return this.$store.getters.appconfig.price;
      },
      getStorage() {
        return this.$store.getters.appconfig.storage;
      },
      diskEnabled() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      },
      canDelete() {
        return this.me.abilities.includes('instances_delete');
      },
      canClone() {
        return this.me.abilities.includes('instances_create');
      },
      canUpdate() {
        return this.me.abilities.includes('instances_update');
      },
      price() {
        const cpu = this.getPrice.cpu * this.cpu; // 1
        const memory = this.getPrice.memory * this.memory; // 0.048
        const disk = this.getPrice.disk * this.disk; // 0.150
        const period = this.period;
        const cmemory = (cpu + memory + disk) * period;
        return cmemory.toFixed(2);
      }
    },
    methods: {
      getInstanceConfig() {
        const config = this.instance.config;
        this.name = this.instanceName;
        // console.log(config);
        this.cpu = config.limits_cpu > 1 ? config.limits_cpu : 1;
        this.memory = config.limits_memory_mb > 512 ? config.limits_memory_mb : 512;
        this.disk = config.limits_disk_gb > 10 ? config.limits_disk_gb : 10;
      },
      sendRequestUpgrade() {
        if (this.canUpdate) {
          this.$store.dispatch('upgradeInstance', { id: this.id, name: this.instanceName, cpu: this.cpu, memory: `${this.memory}MB`, disk: `${this.disk}MB` });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.instance_upgraded')}`, color: '' });
        } else {
          const data = {
            id: this.id,
            os: this.os,
            cpu: this.cpu,
            memory: `${this.memory}MB`,
            disk: `${this.disk}GB`,
            period: this.period,
            price: this.price
          };
          this.$store.dispatch('createRequests', { action: 'upgrade', message: `Upgrade instance ${this.name}`, status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.instance_created')}`, color: '' });
          this.active = false;
        }
      },
      sendRequestClone() {
        const data = {
          instanceName: this.instanceName,
          instanceClone: this.instanceClone,
          cpu: this.instance.config.limits_cpu,
          memory: this.instance.config.limits_memory,
          disk: this.instance.config.limits_disk ? `${this.instance.config.limits_disk}GB` : '0GB'
        };
        if (this.canClone) {
          this.$store.dispatch('cloneInstance', data);
          this.$store.dispatch('notify', { id: 0, message: 'Your instance was cloned', color: '' });
        } else {
          this.$store.dispatch('createRequests', { action: 'clone', message: `Clone instance ${this.name}`, status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      },
      sendRequestDestroy() {
        if (this.canDelete) {
          if (this.instance.status === 'STOPPED') {
            this.$store.dispatch('deleteInstance', this.id);
            this.$store.dispatch('notify', {
              id: 0,
              message: `${this.$i18n.t('notifications.instance_deleted')}`,
              color: ''
            });
          } else {
            this.$store.dispatch('notify', {
              id: 0,
              message: `${this.$i18n.t('notifications.instance_is_running')}`,
              color: 'red'
            });
          }
        } else {
          const data = {
            id: this.id,
            name: this.instanceName
          };
          this.$store.dispatch('createRequests', { action: 'delete', message: `Delete instance ${this.name}`, status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      }
    },
    mounted() {
      this.getInstanceConfig();
      this.instanceClone = this.instanceNameClone;
    }
  };
</script>
