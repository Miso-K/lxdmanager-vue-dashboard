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
      Upgrade VPS
    </v-btn>

    <v-btn
      :loading="loading3"
      @click.stop="dialog_clone = true"
      :disabled="loading3"
      color="blue-grey"
      class="white--text"
    >
      Clone VPS
      <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
    <v-btn
      :loading="loading3"
      @click.stop="dialog_destroy = true"
      :disabled="loading3"
      color="red"
      class="white--text"
    >
      Destroy VPS
      <v-icon right dark>delete</v-icon>
    </v-btn>
  </v-flex>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_destroy" max-width="500">
      <v-card>
        <v-card-title class="headline">Destroy server?</v-card-title>

        <v-card-text>
          Send request for destroying your vps server.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog_destroy = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click.native="dialog_destroy = false"
            @click="sendRequestDestroy"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_clone" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Clone machine</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Name" disabled :value=containerName></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Clone name" v-model="containerClone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items="['week', 'month', 'unlimited']"
                  v-model="period"
                  label="Time period"
                  required
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog_clone = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog_clone = false" @click="sendRequestClone">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_upgrade" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Upgrade machine</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Server name" disabled :value=containerName></v-text-field>
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
                <v-slider min="10" max="160" step="10" v-model="disk" label="Disk"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="disk" type="Disk" suffix="GB"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="getContainerConfig">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog_upgrade = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog_upgrade = false" @click="sendRequestUpgrade">Create</v-btn>
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
        cpu: '',
        memory: '',
        disk: '',
        containerClone: '',
        period: ''
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      container() {
        return this.$store.getters.containerData(this.id);
      },
      containerName() {
        return this.container.name;
      },
      containerNameClone() {
        const name = this.container.name;
        return name.concat('-clone');
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      canDelete() {
        return this.me.abilities.includes('ct_delete');
      }
    },
    methods: {
      getContainerConfig() {
        const config = this.container.config;
        // console.log(config);
        this.cpu = config.limits_cpu > 1 ? config.limits_cpu : 1;
        this.memory = config.limits_memory_mb > 512 ? config.limits_memory_mb : 512;
        this.disk = config.limits_disk_mb > 10 ? config.limits_disk_mb : 10;
      },
      sendRequestUpgrade() {
        const data = {
          subject: 'Upgrade lxd container',
          message: `New request of upgrade container: ${this.containerName}
          with ${this.cpu} CPU, ${this.memory}MB RAM and ${this.disk}GB Disk`,
          copy: false
        };
        this.$store.dispatch('sendRequest', data);
        this.$store.dispatch('notify', { id: 0, message: 'Your request was created', color: '' });
      },
      sendRequestClone() {
        const data = {
          subject: 'Clone lxd container',
          message: `New request of clone container: ${this.containerName}
          to new server ${this.containerClone} for time ${this.period}`,
          copy: false
        };
        this.$store.dispatch('sendRequest', data);
        this.$store.dispatch('notify', { id: 0, message: 'Your request was created', color: '' });
      },
      sendRequestDestroy() {
        if (this.canDelete) {
          this.$store.dispatch('deleteContainer', this.id);
          this.$store.dispatch('notify', { id: 0, message: 'Your container was deleted', color: '' });
        } else {
          const data = {
            subject: 'Delete lxd container',
            message: `New request of destroying lxd container: ${this.containerName}`,
            copy: false
          };
          this.$store.dispatch('sendRequest', data);
          this.$store.dispatch('notify', { id: 0, message: 'Your request was created', color: '' });
        }
      }
    },
    mounted() {
      this.getContainerConfig();
      this.containerClone = this.containerNameClone;
    }
  };
</script>
