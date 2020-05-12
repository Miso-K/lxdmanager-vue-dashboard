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
          <div v-if="getButtonState">
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
  import _ from 'lodash';
  import { Terminal } from 'xterm';
  import * as fit from 'xterm/lib/addons/fit/fit';
  import 'xterm/dist/xterm.css';

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
        return this.instance.status !== 'RUNNING';
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
          this.wsocked.close();
          this.xTerm.destroy();
          this.openedTerminal = false;
        } else {
          this.$store.dispatch('openInstanceTerminal', this.id);
          // console.log(this.$store.state);
          // console.log(process.env.API_BASE_WS_URL);
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
        // const operationId = term.operationId;
        // const secret = term.secret;
        const operationId = term.metadata.id;
        const secret = term.metadata.metadata.fds[0];
        // console.log(secret);
        const wsUrl = process.env.API_BASE_WS_URL;

        // var width = 100
        const height = Math.max(Math.round(window.innerHeight / 39.0), 15);

        Terminal.applyAddon(fit);
        const xterm = new Terminal({
          useStyle: false,
          screenKeys: false,
          cursorBlink: true
        });

        if ('WebSocket' in window) {
          // alert('WebSocket is supported by your Browser!');
          console.log('WebSocket is supported by your Browser!');
          // Let us open a web socket
          // const wssurl2 = 'wss://127.0.0.1:8443/1.0/operations/7bd31bce-c7b5-4a34-a90c-328b2b67841e/websocket?secret=231c068d3a5278529a7e497c21d96389a4911c42e51152c520b3ff1d591008a0';
          // console.log(`${wsUrl}/1.0/operations/${operationId}/websocket?secret=${secret}`);
          // const wssurl = 'ws://127.0.0.1:8444';
          const wssurl = `${wsUrl}/1.0/operations/${operationId}/websocket?secret=${secret}`;
          // const wssurl = `${wsUrl}${termWs}`;
          // console.log(wssurl);
          const ws = new WebSocket(wssurl);
          this.wsocked = ws;
          this.xTerm = xterm;
          console.log(wssurl);

          ws.binaryType = 'Blob';
          ws.onopen = () => {
            // Web Socket is connected, send data using send()
            // ws.send('Message to send');
            console.log('Open xterm ...');
            xterm.open(document.getElementById('terminal'));

            xterm.resize(0, height);
            xterm.fit();
            xterm.focus();
            //
            window.addEventListener('resize', _.debounce(() => {
              const heightx = Math.max(Math.round(window.innerHeight / 39.0), 15);
              xterm.resize(0, heightx);
              xterm.fit();
            }, 300));
            //

            // comment this lines to protect sending data on demo.lxdmanager.com
            xterm.on('data', (data) => {
              // console.log('Send data');
              // console.log(data);
              ws.send(new Blob([data]));
            });
            //
            ws.onmessage = (msg) => {
              if (msg.data instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener('loadend', () => {
                  xterm.write(reader.result);
                });
                // console.log(msg.data);
                reader.readAsBinaryString(msg.data);
              } else {
                xterm.write(msg.data);
                // console.log('no');
              }
            };
            //
            ws.onclose = () => {
              xterm.destroy();
              this.openedTerminal = false;
              // window.close()
            };
          };

          ws.onerror = () => {
            xterm.writeln('An error occured, press enter to close window.');
            // window.close()
            xterm.destroy();
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
