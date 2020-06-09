<template>
  <v-container fluid grid-list-xl>
    <!-- this block is for demo.lxdmanager.com -->
    <!--
    <v-layout justify-center row>
      <blockquote class="blockquote">Console interaction not working in demo because of security reasons</blockquote>
    </v-layout>
    -->
    <v-layout justify-center row>
        <v-btn
            :disabled="isRunning"
            fab
            class="grey lighten-2 black--text"
            style="bottom: 1px;"
            :loading="loading"
            @click.native="OpenTerminal()"
          >
          <div v-if="consoleDisabled">
            This console access is disabled
          </div>
          <div v-else-if="getButtonState">
            Close console
          </div>
          <div v-else>
            Open console
          </div>
        </v-btn>
    </v-layout>
    <v-layout justify-center row>
       <v-flex xl10 lg10 md10 sm10 xs12 offset-(xl1|lg1|md1)>
        <div id="terminal"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { Terminal } from 'xterm';
  // import { AttachAddon } from 'xterm-addon-attach';
  // import { FitAddon } from 'xterm-addon-fit';
  import 'xterm/css/xterm.css';
  import storage from '../../libraries/utils/storage';

  export default {
    components: {},
    data() {
      return {
        loading: false,
        disableButton: true,
        openedTerminal: false,
        wsocked: null,
        xTerm: null
      };
    },
    computed: {
      id() {
        return Number(this.$route.params.id);
      },
      instance() {
        return this.$store.getters.instanceDataId(this.id);
      },
      status() {
        return this.instance.status;
      },
      isRunning() {
        console.log(this.instance.config);
        return this.instance.status !== 'RUNNING' || this.consoleDisabled;
      },
      consoleDisabled() {
        console.log(this.instance);
        return this.instance.config.user_terminal;
      },
      getButtonState() {
        if (!this.disableButton && !this.openedTerminal) {
          return false;
        }
        return true;
      }
    },
    beforeUpdate() {
      if (this.status === 'RUNNING') {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
    },
    mounted() {
      if (this.status === 'RUNNING') {
        this.disableButton = false;
      }
    },
    methods: {
      /**
       *
       */

      OpenTerminal() {
        if (this.openedTerminal) {
          const data = 'exit\r\n';
          this.wsocked.send(new Blob([data]));

          setTimeout(() => {
            this.wsocked.close();
            this.xTerm.dispose();
            this.openedTerminal = false;
          }, 1000);
        } else {
          this.$store.dispatch('openInstanceTerminal', this.id);
          this.openedTerminal = true;
          this.loading = true;
          setTimeout(() => {
            const term = this.$store.state.instances.terminal;
            this.WebSocketTest(term);
            this.loading = false;
          }, 2000);
        }
      },

      WebSocketTest(term) {
        const operationId = term.metadata.id;
        const secret = term.metadata.metadata.fds[0];
        const wsUrl = storage.get('API_BASE_WS_URL');
        const xterm = new Terminal({
          useStyle: false,
          screenKeys: false,
          cursorBlink: true
        });

        if ('WebSocket' in window) {
          console.log('WebSocket is supported by your Browser!');
          // Let us open a web socket
          const wssurl = `${wsUrl}/1.0/operations/${operationId}/websocket?secret=${secret}`;
          const ws = new WebSocket(wssurl);
          this.wsocked = ws;
          this.xTerm = xterm;
          console.log(wssurl);

          ws.binaryType = 'Blob';
          ws.onopen = () => {
            // Web Socket is connected, send data using send()
            console.log('Open xterm ...');
            xterm.open(document.getElementById('terminal'));
            xterm.onData((data) => {
              console.log('Send data');
              console.log(data);
              ws.send(new Blob([data]));
            });
            //
            ws.onmessage = (msg) => {
              if (msg.data instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener('loadend', () => {
                  xterm.write(reader.result);
                });
                reader.readAsBinaryString(msg.data);
              } else {
                xterm.write(msg.data);
              }
            };
            ws.onclose = () => {
              xterm.dispose();
              this.openedTerminal = false;
            };
          };

          ws.onerror = () => {
            xterm.writeln('An error occured, press enter to close window.');
            xterm.dispose();
            this.openedTerminal = false;
          };
        } else {
          // The browser doesn't support WebSocket
          console.log('WebSocket NOT supported by your Browser!');
        }
      }
    }
  };
</script>
