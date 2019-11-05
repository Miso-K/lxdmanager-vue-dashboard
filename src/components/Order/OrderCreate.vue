<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Create new VPS</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="VPS name" v-model="name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items=templates
                  v-model="os"
                  label="OS"
                ></v-select>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(1)">
                    VPS1
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(2)">
                    VPS2
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(3)">
                    VPS3
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(4)">
                    VPS4
                  </v-btn>
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
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="active = false">Close</v-btn>
          <v-btn color="green darken-1" flat @click="sendRequest">{{ $t('actions.create') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>


  export default {
    components: {
    },
    data() {
      return {
        hasCreated: false,
        name: '',
        os: 'ubuntu-16.04',
        cpu: '1',
        memory: '512',
        disk: '10',
        templates: [
          { text: 'Ubuntu 16.04', value: 'ubuntu/16.04' },
          { text: 'Debian 9', value: 'debian/9' },
          { text: 'CentOS 7', value: 'centos/7' },
          { text: 'Fedora 29', value: 'fedora/29' },
          { text: 'Alpine 3.9', value: 'alpine/3.9' }
        ]
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.create;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      me() {
        return this.$store.getters['auth/me'];
      }
    },
    methods: {
      setVPS(id) {
        switch (id) {
          case 1:
            this.cpu = 1;
            this.memory = 512;
            this.disk = 10;
            break;
          case 2:
            this.cpu = 1;
            this.memory = 1024;
            this.disk = 30;
            break;
          case 3:
            this.cpu = 2;
            this.memory = 2048;
            this.disk = 50;
            break;
          case 4:
            this.cpu = 4;
            this.memory = 8172;
            this.disk = 160;
            break;
          default:
            this.cpu = 1;
            this.memory = 512;
            this.disk = 10;
        }
      },
      closeDialog() {
        this.step = 0;
        this.$store.dispatch('closeContainerCreateDialog');
      },
      sendRequest() {
        console.log(this.me.name);
        console.log(this.name);
        console.log(this.cpu);
        console.log(this.memory);
        console.log(this.disk);

        if (this.name !== '') {
          const data = {
            name: this.name,
            os: this.os,
            cpu: this.cpu,
            memory: `${this.memory}MB`,
            disk: `${this.disk}GB`
          };
          console.log(data);
          this.$store.dispatch('createRequests', { action: 'create', message: 'Create new container', status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: 'Your request was created', color: '' });
          this.active = false;
        }
      }
    }
  };
</script>
