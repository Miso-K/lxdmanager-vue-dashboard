webpackJsonp([0],{378:function(t,n,e){var r=e(137)(e(457),e(533),null,null,null);t.exports=r.exports},379:function(t,n,e){var r=e(137)(e(458),e(523),null,null,null);t.exports=r.exports},402:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={name:"loader",computed:{loading:function(){var t=this.$store.state;return t.instances.loading||t.images.loading||t.users.loading||t.requests.loading}}}},404:function(t,n,e){var r=e(137)(e(402),e(406),null,null,null);t.exports=r.exports},406:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return t.loading?e("v-progress-linear",{attrs:{indeterminate:!0}}):t._e()},staticRenderFns:[]}},412:function(t,n){var e={utf8:{stringToBytes:function(t){return e.bin.stringToBytes(unescape(encodeURIComponent(t)))},bytesToString:function(t){return decodeURIComponent(escape(e.bin.bytesToString(t)))}},bin:{stringToBytes:function(t){for(var n=[],e=0;e<t.length;e++)n.push(255&t.charCodeAt(e));return n},bytesToString:function(t){for(var n=[],e=0;e<t.length;e++)n.push(String.fromCharCode(t[e]));return n.join("")}}};t.exports=e},444:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={name:"lwp-notifications",data:function(){return{tmp:!0}},computed:{color:function(){return this.$store.state.notifications.messages.length>0?this.$store.state.notifications.messages[0].color:""},message:function(){return this.$store.state.notifications.messages.length>0?this.$store.state.notifications.messages[0].message:""},showSnack:{get:function(){return this.$store.state.notifications.active&&this.$store.state.notifications.messages.length>0},set:function(t){t||this.$store.dispatch("closeNotif")}}}}},447:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={name:"Relogin",data:function(){return{dialog_relogin:!1,interval:0,value:0,countdown:60}},methods:{startCountDown:function(){var t=this;this.interval=setInterval(function(){1800===t.value&&(t.dialog_relogin=!0,t.actionCountDown(),t.value=0),t.value+=1},1e3)},actionCountDown:function(){var t=this;this.interval2=setInterval(function(){0===t.countdown&&(t.$router.push("logout"),t.countdown=30),t.value=0,t.countdown-=1,console.log("countdown")},1e3)},refreshToken:function(){clearInterval(this.interval2),this.value=0,this.$store.dispatch("auth/refreshToken")}},created:function(){this.startCountDown()},beforeDestroy:function(){clearInterval(this.interval),clearInterval(this.interval2),this.value=0,this.countdown=60}}},457:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default={name:"not-found",title:"Not Found — LXDmanager"}},458:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e(476),o=e.n(r),i=e(138),s=e(498),a=e.n(s),u=e(404),c=e.n(u),l=e(501),v=e.n(l);n.default={name:"layout",title:"LXDmanager",components:{notifications:a.a,loader:c.a,relogin:v.a},beforeRouteEnter:function(t,n,r){e.i(i.a)(t.meta.auth||!1).then(function(){return r()}).catch(function(){return console.log("⛔️  Unauthorized"),r({name:"login"})})},data:function(){return{drawer:!0,items:[{title:this.$t("menu.dashboard"),icon:"dashboard",to:{name:"dashboard"},user:!0},{title:this.$t("menu.instances"),icon:"storage",to:{name:"instances"},user:!0},{title:this.$t("menu.images"),icon:"storage",to:{name:"images"},user:!1},{title:this.$t("menu.users"),icon:"group",to:{name:"users"},user:!1},{title:this.$t("menu.groups"),icon:"people_outline",to:{name:"groups"},user:!1},{title:this.$t("menu.requests"),icon:"list",to:{name:"requests"},user:!0},{title:this.$t("menu.settings"),icon:"settings",to:{name:"settings"},user:!0},{title:this.$t("menu.help"),icon:"help",to:{name:"help"},user:!0},{title:this.$t("menu.app_config"),icon:"settings",to:{name:"appconfig"},user:!1}],mini:!1,showSnack:!0,type:"success"}},computed:{me:function(){return this.$store.getters["auth/me"]},avatar:function(){return"https://www.gravatar.com/avatar/"+o()(this.me.email||"")+"?s=84&d=retro"},loading:function(){var t=this.$store.state;return t.stats.loading||t.containers.loading||t.images.loading||t.users.loading||t.requests.loading}},mounted:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchMe").then(function(){t.me=t.$store.getters["auth/me"]})},500)}}},471:function(t,n){!function(){var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",e={rotl:function(t,n){return t<<n|t>>>32-n},rotr:function(t,n){return t<<32-n|t>>>n},endian:function(t){if(t.constructor==Number)return 16711935&e.rotl(t,8)|4278255360&e.rotl(t,24);for(var n=0;n<t.length;n++)t[n]=e.endian(t[n]);return t},randomBytes:function(t){for(var n=[];t>0;t--)n.push(Math.floor(256*Math.random()));return n},bytesToWords:function(t){for(var n=[],e=0,r=0;e<t.length;e++,r+=8)n[r>>>5]|=t[e]<<24-r%32;return n},wordsToBytes:function(t){for(var n=[],e=0;e<32*t.length;e+=8)n.push(t[e>>>5]>>>24-e%32&255);return n},bytesToHex:function(t){for(var n=[],e=0;e<t.length;e++)n.push((t[e]>>>4).toString(16)),n.push((15&t[e]).toString(16));return n.join("")},hexToBytes:function(t){for(var n=[],e=0;e<t.length;e+=2)n.push(parseInt(t.substr(e,2),16));return n},bytesToBase64:function(t){for(var e=[],r=0;r<t.length;r+=3)for(var o=t[r]<<16|t[r+1]<<8|t[r+2],i=0;i<4;i++)8*r+6*i<=8*t.length?e.push(n.charAt(o>>>6*(3-i)&63)):e.push("=");return e.join("")},base64ToBytes:function(t){t=t.replace(/[^A-Z0-9+\/]/gi,"");for(var e=[],r=0,o=0;r<t.length;o=++r%4)0!=o&&e.push((n.indexOf(t.charAt(r-1))&Math.pow(2,-2*o+8)-1)<<2*o|n.indexOf(t.charAt(r))>>>6-2*o);return e}};t.exports=e}()},474:function(t,n){function e(t){return!!t.constructor&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)}function r(t){return"function"==typeof t.readFloatLE&&"function"==typeof t.slice&&e(t.slice(0,0))}/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
t.exports=function(t){return null!=t&&(e(t)||r(t)||!!t._isBuffer)}},476:function(t,n,e){!function(){var n=e(471),r=e(412).utf8,o=e(474),i=e(412).bin,s=function(t,e){t.constructor==String?t=e&&"binary"===e.encoding?i.stringToBytes(t):r.stringToBytes(t):o(t)?t=Array.prototype.slice.call(t,0):Array.isArray(t)||(t=t.toString());for(var a=n.bytesToWords(t),u=8*t.length,c=1732584193,l=-271733879,v=-1732584194,f=271733878,d=0;d<a.length;d++)a[d]=16711935&(a[d]<<8|a[d]>>>24)|4278255360&(a[d]<<24|a[d]>>>8);a[u>>>5]|=128<<u%32,a[14+(u+64>>>9<<4)]=u;for(var g=s._ff,h=s._gg,m=s._hh,p=s._ii,d=0;d<a.length;d+=16){var A=c,y=l,w=v,b=f;c=g(c,l,v,f,a[d+0],7,-680876936),f=g(f,c,l,v,a[d+1],12,-389564586),v=g(v,f,c,l,a[d+2],17,606105819),l=g(l,v,f,c,a[d+3],22,-1044525330),c=g(c,l,v,f,a[d+4],7,-176418897),f=g(f,c,l,v,a[d+5],12,1200080426),v=g(v,f,c,l,a[d+6],17,-1473231341),l=g(l,v,f,c,a[d+7],22,-45705983),c=g(c,l,v,f,a[d+8],7,1770035416),f=g(f,c,l,v,a[d+9],12,-1958414417),v=g(v,f,c,l,a[d+10],17,-42063),l=g(l,v,f,c,a[d+11],22,-1990404162),c=g(c,l,v,f,a[d+12],7,1804603682),f=g(f,c,l,v,a[d+13],12,-40341101),v=g(v,f,c,l,a[d+14],17,-1502002290),l=g(l,v,f,c,a[d+15],22,1236535329),c=h(c,l,v,f,a[d+1],5,-165796510),f=h(f,c,l,v,a[d+6],9,-1069501632),v=h(v,f,c,l,a[d+11],14,643717713),l=h(l,v,f,c,a[d+0],20,-373897302),c=h(c,l,v,f,a[d+5],5,-701558691),f=h(f,c,l,v,a[d+10],9,38016083),v=h(v,f,c,l,a[d+15],14,-660478335),l=h(l,v,f,c,a[d+4],20,-405537848),c=h(c,l,v,f,a[d+9],5,568446438),f=h(f,c,l,v,a[d+14],9,-1019803690),v=h(v,f,c,l,a[d+3],14,-187363961),l=h(l,v,f,c,a[d+8],20,1163531501),c=h(c,l,v,f,a[d+13],5,-1444681467),f=h(f,c,l,v,a[d+2],9,-51403784),v=h(v,f,c,l,a[d+7],14,1735328473),l=h(l,v,f,c,a[d+12],20,-1926607734),c=m(c,l,v,f,a[d+5],4,-378558),f=m(f,c,l,v,a[d+8],11,-2022574463),v=m(v,f,c,l,a[d+11],16,1839030562),l=m(l,v,f,c,a[d+14],23,-35309556),c=m(c,l,v,f,a[d+1],4,-1530992060),f=m(f,c,l,v,a[d+4],11,1272893353),v=m(v,f,c,l,a[d+7],16,-155497632),l=m(l,v,f,c,a[d+10],23,-1094730640),c=m(c,l,v,f,a[d+13],4,681279174),f=m(f,c,l,v,a[d+0],11,-358537222),v=m(v,f,c,l,a[d+3],16,-722521979),l=m(l,v,f,c,a[d+6],23,76029189),c=m(c,l,v,f,a[d+9],4,-640364487),f=m(f,c,l,v,a[d+12],11,-421815835),v=m(v,f,c,l,a[d+15],16,530742520),l=m(l,v,f,c,a[d+2],23,-995338651),c=p(c,l,v,f,a[d+0],6,-198630844),f=p(f,c,l,v,a[d+7],10,1126891415),v=p(v,f,c,l,a[d+14],15,-1416354905),l=p(l,v,f,c,a[d+5],21,-57434055),c=p(c,l,v,f,a[d+12],6,1700485571),f=p(f,c,l,v,a[d+3],10,-1894986606),v=p(v,f,c,l,a[d+10],15,-1051523),l=p(l,v,f,c,a[d+1],21,-2054922799),c=p(c,l,v,f,a[d+8],6,1873313359),f=p(f,c,l,v,a[d+15],10,-30611744),v=p(v,f,c,l,a[d+6],15,-1560198380),l=p(l,v,f,c,a[d+13],21,1309151649),c=p(c,l,v,f,a[d+4],6,-145523070),f=p(f,c,l,v,a[d+11],10,-1120210379),v=p(v,f,c,l,a[d+2],15,718787259),l=p(l,v,f,c,a[d+9],21,-343485551),c=c+A>>>0,l=l+y>>>0,v=v+w>>>0,f=f+b>>>0}return n.endian([c,l,v,f])};s._ff=function(t,n,e,r,o,i,s){var a=t+(n&e|~n&r)+(o>>>0)+s;return(a<<i|a>>>32-i)+n},s._gg=function(t,n,e,r,o,i,s){var a=t+(n&r|e&~r)+(o>>>0)+s;return(a<<i|a>>>32-i)+n},s._hh=function(t,n,e,r,o,i,s){var a=t+(n^e^r)+(o>>>0)+s;return(a<<i|a>>>32-i)+n},s._ii=function(t,n,e,r,o,i,s){var a=t+(e^(n|~r))+(o>>>0)+s;return(a<<i|a>>>32-i)+n},s._blocksize=16,s._digestsize=16,t.exports=function(t,e){if(void 0===t||null===t)throw new Error("Illegal argument "+t);var r=n.wordsToBytes(s(t,e));return e&&e.asBytes?r:e&&e.asString?i.bytesToString(r):n.bytesToHex(r)}}()},478:function(t,n){t.exports="data:image/png;base64,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"},498:function(t,n,e){var r=e(137)(e(444),e(512),null,null,null);t.exports=r.exports},501:function(t,n,e){var r=e(137)(e(447),e(524),null,null,null);t.exports=r.exports},512:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement;return(t._self._c||n)("v-snackbar",{attrs:{bottom:"",color:t.color},model:{value:t.showSnack,callback:function(n){t.showSnack=n},expression:"showSnack"}},[t._v("\n  "+t._s(t.message)+"\n")])},staticRenderFns:[]}},523:function(t,n,e){t.exports={render:function(){var t=this,n=t.$createElement,r=t._self._c||n;return r("v-app",[r("v-navigation-drawer",{attrs:{stateless:"",app:"","mini-variant":t.mini},model:{value:t.drawer,callback:function(n){t.drawer=n},expression:"drawer"}},[r("v-list",{attrs:{dense:""}},[r("v-list-item",[r("v-list-tile-avatar",[r("v-img",{attrs:{src:t.avatar,contain:"",height:"30"}})],1),t._v(" "),r("v-list-tile-content",[r("v-list-tile-title",[t._v(t._s(t.me.name)+" "),t.me.admin?r("v-chip",{attrs:{label:"",small:""}},[t._v("Admin")]):t._e()],1)],1)],1)],1),t._v(" "),r("v-list",{attrs:{dense:""}},[r("v-divider"),t._v(" "),t._l(t.items,function(n){return n.user||t.me.admin?r("v-list-item",{key:n.title,attrs:{color:"primary",link:"",to:n.to}},[r("v-list-item-action",[r("v-icon",[t._v(t._s(n.icon))])],1),t._v(" "),r("v-list-item-content",[r("v-list-tile-title",[t._v(t._s(n.title))])],1)],1):t._e()}),t._v(" "),r("v-divider"),t._v(" "),r("v-list-item",{attrs:{link:"",to:"/logout"}},[r("v-list-item-action",[r("v-icon",[t._v("exit_to_app")])],1),t._v(" "),r("v-list-item-content",[r("v-list-tile-title",[t._v(t._s(t.$t("menu.sign_out")))])],1)],1)],2),t._v(" "),t.mini?t._e():r("v-btn",{staticStyle:{bottom:"18px"},attrs:{icon:"",absolute:"",right:""},nativeOn:{click:function(n){n.stopPropagation(),t.mini=!t.mini}}},[r("v-icon",[t._v("chevron_left")])],1),t._v(" "),t.mini?r("v-btn",{staticStyle:{bottom:"18px"},attrs:{icon:"",absolute:"",right:""},nativeOn:{click:function(n){n.stopPropagation(),t.mini=!t.mini}}},[r("v-icon",[t._v("chevron_right")])],1):t._e()],1),t._v(" "),r("v-app-bar",{attrs:{app:"",color:"deep-purple darken-4",dark:"",extended:"","extension-height":"8",height:"57px"}},[r("v-app-bar-nav-icon",{on:{click:function(n){n.stopPropagation(),t.drawer=!t.drawer}}}),t._v(" "),r("v-img",{attrs:{src:e(478),contain:"",height:"30"}}),t._v(" "),r("loader",{attrs:{slot:"extension"},slot:"extension"})],1),t._v(" "),r("v-content",[r("v-container",{attrs:{fluid:""}},[r("router-view")],1)],1),t._v(" "),r("notifications"),t._v(" "),r("relogin"),t._v(" "),r("v-footer",{staticClass:"pa-3",attrs:{fixed:"",inset:""}},[r("v-spacer"),t._v(" "),r("div",[t._v("© lxdmanager.com "+t._s((new Date).getFullYear()))])],1)],1)},staticRenderFns:[]}},524:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-layout",{attrs:{row:"","justify-center":""}},[e("v-dialog",{attrs:{persistent:"","max-width":"500"},model:{value:t.dialog_relogin,callback:function(n){t.dialog_relogin=n},expression:"dialog_relogin"}},[e("v-card",[e("v-card-title",{staticClass:"headline"},[t._v("Stay online or logout?")]),t._v(" "),e("v-card-text",[t._v("\n        If you want to stay online please click on STAY ONLINE button, otherwise LOGOUT.\n        You will be logging out automaticly in "+t._s(t.countdown)+" seconds.\n      ")]),t._v(" "),e("v-card-actions",[e("v-spacer"),t._v(" "),e("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:t.refreshToken},nativeOn:{click:function(n){t.dialog_relogin=!1}}},[t._v("\n          Stay online\n        ")]),t._v(" "),e("v-btn",{attrs:{color:"red darken-1",text:""},on:{click:function(n){return t.$router.push("logout")}},nativeOn:{click:function(n){t.dialog_relogin=!1}}},[t._v("\n          Logout\n        ")])],1)],1)],1)],1)},staticRenderFns:[]}},533:function(t,n){t.exports={render:function(){var t=this,n=t.$createElement;t._self._c;return t._m(0)},staticRenderFns:[function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("section",{staticClass:"error"},[e("h1",[t._v("404")]),t._v(" "),e("h2",[t._v("Not Found")])])])}]}}});
//# sourceMappingURL=0.2b04e1e950436727ce14.js.map