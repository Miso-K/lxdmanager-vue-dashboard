webpackJsonp([5],{382:function(t,e,a){var i=a(137)(a(463),a(535),null,null,null);t.exports=i.exports},428:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(1),s=a.n(i);e.default={name:"AppConfig",components:{},data:function(){return{isEditing:null,showPrice:!1,showStorage:!1,showEmail:!1,show1:!1,verify:["True","False"],dialog:!1,dialogTest:!1,data:{remote:{endpoint:"",verify:""},app:{production_name:""},smtp:{enabled:!1,sender:"",recipient:"",server:"",port:"",login:"",password:""},storage:{enabled:!1,pool_name:""},price:{enabled:!1,cpu:"",memory:"",disk:"",periodes:{month:"",months:"",halfyear:"",year:"",years:""}}},certs:{cert_crt:"",cert_key:""}}},computed:{checkconfig:function(){return this.$store.getters.checkconfig?this.$store.getters.checkconfig:""}},methods:{checkConfig:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchCheckconfig")},500),this.dialogTest=!0},update_checkboxes:function(){this.$store.commit("update_checkboxes",this.data.storage.enabled)},save:function(){var t=this;this.isEditing=!this.isEditing;var e=this.data;e.price.enabled=this.showPrice,e.storage.enabled=this.showStorage,e.smtp.enabled=this.showEmail,this.$store.dispatch("notify",{id:0,message:"Your settings was saved",color:"info"}),this.$store.dispatch("saveAppConfig",e),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},savecerts:function(){var t=this;this.isEditing=!this.isEditing,this.$store.dispatch("notify",{id:0,message:"Your certificates was saved",color:"info"}),this.$store.dispatch("saveCerts",this.certs),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},sendTestEmail:function(){this.save(),this.$store.dispatch("createRequests",{action:"test",message:"Test email configuration",status:"cancelled",meta_data:""}),this.$store.dispatch("notify",{id:0,message:"Test email was sent",color:"info"})}},mounted:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchAppConfig").then(function(){t.data=s()({},t.data,t.$store.getters.appconfig),t.showPrice="True"===t.data.price.enabled,t.showStorage="True"===t.data.storage.enabled,t.showEmail="True"===t.data.smtp.enabled})},500)}}},429:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(1),s=a.n(i);e.default={name:"AppConfig",components:{},data:function(){return{isEditing:null,showPrice:!1,showStorage:!1,showEmail:!1,show1:!1,verify:["True","False"],dialog:!1,dialogTest:!1,data:{endpoint:"",verify:"",production_name:"",smtp:{enabled:!1,sender:"",recipient:"",server:"",port:"",login:"",password:""},storage:{enabled:!1,pool_name:""},price:{enabled:!1,cpu:"",memory:"",disk:"",periodes:{month:"",months:"",halfyear:"",year:"",years:""}}},certs:{cert_crt:"",cert_key:""}}},computed:{checkconfig:function(){return this.$store.getters.checkconfig[0]?this.$store.getters.checkconfig[0].attributes:""}},methods:{checkConfig:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchCheckconfig")},500),this.dialogTest=!0},update_checkboxes:function(){this.$store.commit("update_checkboxes",this.data.storage.enabled)},save:function(){var t=this;this.isEditing=!this.isEditing;var e=this.data;e.price.enabled=this.showPrice,e.storage.enabled=this.showStorage,e.smtp.enabled=this.showEmail,this.$store.dispatch("notify",{id:0,message:"Your settings was saved",color:"info"}),this.$store.dispatch("saveAppConfig",e),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},savecerts:function(){var t=this;this.isEditing=!this.isEditing,this.$store.dispatch("notify",{id:0,message:"Your certificates was saved",color:"info"}),this.$store.dispatch("saveCerts",this.certs),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},sendTestEmail:function(){this.save(),this.$store.dispatch("createRequests",{action:"test",message:"Test email configuration",status:"cancelled",meta_data:""}),this.$store.dispatch("notify",{id:0,message:"Test email was sent",color:"info"}),console.log("testemail")}},mounted:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchAppConfig").then(function(){t.data=s()({},t.data,t.$store.getters.appconfig),t.showPrice="True"===t.data.price.enabled,t.showStorage="True"===t.data.storage.enabled,t.showEmail="True"===t.data.smtp.enabled})},500)}}},430:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(1),s=a.n(i);e.default={name:"AppConfig",components:{},data:function(){return{isEditing:null,showPrice:!1,showStorage:!1,showEmail:!1,show1:!1,verify:["True","False"],dialog:!1,dialogTest:!1,data:{price:{enabled:!1,cpu:"",memory:"",disk:"",discount_month:"",discount_months:"",discount_halfyear:"",discount_year:"",discount_years:""}}}},computed:{checkconfig:function(){return this.$store.getters.checkconfig[0]?this.$store.getters.checkconfig[0].attributes:""}},methods:{checkConfig:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchCheckconfig")},500),this.dialogTest=!0},update_checkboxes:function(){this.$store.commit("update_checkboxes",this.data.storage.enabled)},save:function(){var t=this;this.isEditing=!this.isEditing;var e=this.data;e.price.enabled=this.showPrice,this.$store.dispatch("notify",{id:0,message:"Your settings was saved",color:"info"}),this.$store.dispatch("saveAppConfig",e),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)}},mounted:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchAppConfig").then(function(){t.data=s()({},t.data,t.$store.getters.appconfig),t.showPrice="True"===t.data.price.enabled,t.showStorage="True"===t.data.storage.enabled,t.showEmail="True"===t.data.smtp.enabled})},500)}}},431:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(1),s=a.n(i);e.default={name:"AppConfig",components:{},data:function(){return{isEditing:null,showPrice:!1,showStorage:!1,showEmail:!1,show1:!1,verify:["True","False"],dialog:!1,dialogTest:!1,data:{endpoint:"",verify:"",production_name:"",smtp:{enabled:!1,sender:"",recipient:"",server:"",port:"",login:"",password:""},storage:{enabled:!1,pool_name:"",total_size:""},price:{enabled:!1,cpu:"",memory:"",disk:"",periodes:{month:"",months:"",halfyear:"",year:"",years:""}}},certs:{cert_crt:"",cert_key:""}}},computed:{checkconfig:function(){return this.$store.getters.checkconfig[0]?this.$store.getters.checkconfig[0].attributes:""}},methods:{checkConfig:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchCheckconfig")},500),this.dialogTest=!0},update_checkboxes:function(){this.$store.commit("update_checkboxes",this.data.storage.enabled)},save:function(){var t=this;this.isEditing=!this.isEditing;var e=this.data;e.price.enabled=this.showPrice,e.storage.enabled=this.showStorage,e.smtp.enabled=this.showEmail,this.$store.dispatch("notify",{id:0,message:"Your settings was saved",color:"info"}),this.$store.dispatch("saveAppConfig",e),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},savecerts:function(){var t=this;this.isEditing=!this.isEditing,this.$store.dispatch("notify",{id:0,message:"Your certificates was saved",color:"info"}),this.$store.dispatch("saveCerts",this.certs),setTimeout(function(){t.$store.dispatch("fetchAppConfig")},500)},sendTestEmail:function(){this.save(),this.$store.dispatch("createRequests",{action:"test",message:"Test email configuration",status:"cancelled",meta_data:""}),this.$store.dispatch("notify",{id:0,message:"Test email was sent",color:"info"}),console.log("testemail")}},mounted:function(){var t=this;setTimeout(function(){t.$store.dispatch("fetchAppConfig").then(function(){t.data=s()({},t.data,t.$store.getters.appconfig),t.showPrice="True"===t.data.price.enabled,t.showStorage="True"===t.data.storage.enabled,t.showEmail="True"===t.data.smtp.enabled})},500)}}},432:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(484),s=a.n(i),r=a(485),o=a.n(r),n=a(486),c=a.n(n),l=a(487),d=a.n(l);e.default={name:"tabs",data:function(){return{}},components:{"app-config":s.a,"email-config":o.a,"price-config":c.a,"storage-config":d.a},mounted:function(){}}},463:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(488),s=a.n(i);e.default={name:"container",components:{appconfig:s.a},data:function(){return{}}}},484:function(t,e,a){var i=a(137)(a(428),a(521),null,null,null);t.exports=i.exports},485:function(t,e,a){var i=a(137)(a(429),a(554),null,null,null);t.exports=i.exports},486:function(t,e,a){var i=a(137)(a(430),a(520),null,null,null);t.exports=i.exports},487:function(t,e,a){var i=a(137)(a(431),a(536),null,null,null);t.exports=i.exports},488:function(t,e,a){var i=a(137)(a(432),a(556),null,null,null);t.exports=i.exports},520:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm12:"",md12:"",lg12:""}},[a("v-card",{staticClass:"hide-overflow",attrs:{flat:"",color:"lighteen-1"}},[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-app-bar",{attrs:{flat:"",height:"50px"}},[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{fab:"",small:""},on:{click:function(e){t.isEditing=!t.isEditing}}},[t.isEditing?a("v-icon",[t._v("close")]):a("v-icon",[t._v("edit")])],1)],1),t._v(" "),a("v-card-text",[a("v-checkbox",{attrs:{disabled:!t.isEditing,label:"Enable price calculation"},model:{value:t.showPrice,callback:function(e){t.showPrice=e},expression:"showPrice"}}),t._v(" "),a("v-text-field",{attrs:{disabled:"",label:"Formula",placeholder:"(cpu + memory + disk) * discount",required:""}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"CPU price (per 1 vCPU)",placeholder:"1",required:""},model:{value:t.data.price.cpu,callback:function(e){t.$set(t.data.price,"cpu",e)},expression:"data.price.cpu"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Memory price (per 1 MB)",placeholder:"0.01",required:""},model:{value:t.data.price.memory,callback:function(e){t.$set(t.data.price,"memory",e)},expression:"data.price.memory"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Disk price (per 1 GB)",placeholder:"0.1",required:""},model:{value:t.data.price.disk,callback:function(e){t.$set(t.data.price,"disk",e)},expression:"data.price.disk"}}),t._v(" "),a("v-divider"),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Month discount",placeholder:"1",required:""},model:{value:t.data.price.discount_month,callback:function(e){t.$set(t.data.price,"discount_month",e)},expression:"data.price.discount_month"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"3 months discount",placeholder:"1",required:""},model:{value:t.data.price.discount_months,callback:function(e){t.$set(t.data.price,"discount_months",e)},expression:"data.price.discount_months"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"6 months discount",placeholder:"1",required:""},model:{value:t.data.price.discount_halfyear,callback:function(e){t.$set(t.data.price,"discount_halfyear",e)},expression:"data.price.discount_halfyear"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Year discount",placeholder:"1",required:""},model:{value:t.data.price.discount_year,callback:function(e){t.$set(t.data.price,"discount_year",e)},expression:"data.price.discount_year"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"2 year discount",placeholder:"1",required:""},model:{value:t.data.price.discount_years,callback:function(e){t.$set(t.data.price,"discount_years",e)},expression:"data.price.discount_years"}})],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"success",disabled:!t.isEditing},on:{click:t.save}},[t._v("Save")])],1)],1)],1)],1)],1)],1)},staticRenderFns:[]}},521:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm12:"",md12:"",lg12:""}},[a("v-card",{staticClass:"hide-overflow",attrs:{flat:"",color:"lighteen-1"}},[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-app-bar",{attrs:{flat:"",height:"50px"}},[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{fab:"",small:""},on:{click:function(e){t.isEditing=!t.isEditing}}},[t.isEditing?a("v-icon",[t._v("close")]):a("v-icon",[t._v("edit")])],1)],1),t._v(" "),a("v-card-text",[a("v-text-field",{attrs:{disabled:!t.isEditing,label:"LXD host address",placeholder:"https://127.0.0.1:8443",required:""},model:{value:t.data.remote.endpoint,callback:function(e){t.$set(t.data.remote,"endpoint",e)},expression:"data.remote.endpoint"}}),t._v(" "),a("v-select",{attrs:{disabled:!t.isEditing,items:t.verify,label:"Verify certificate (require signed certificate)",placeholder:"False"},model:{value:t.data.remote.verify,callback:function(e){t.$set(t.data.remote,"verify",e)},expression:"data.remote.verify"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"APP production name",required:"",placeholder:"LXDmanager.com"},model:{value:t.data.app.production_name,callback:function(e){t.$set(t.data.app,"production_name",e)},expression:"data.app.production_name"}}),t._v(" "),a("v-btn",{attrs:{color:"orange",disabled:!t.isEditing,dark:t.isEditing,small:""},on:{click:function(e){t.dialog=!0}}},[t._v("Add LXD connection certificates")]),t._v(" "),a("v-btn",{attrs:{color:"green",disabled:!t.isEditing,dark:t.isEditing,small:""},on:{click:function(e){return t.checkConfig()}}},[t._v("Test LXD connection")])],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"success",disabled:!t.isEditing},on:{click:t.save}},[t._v("Save")])],1)],1)],1)],1)],1),t._v(" "),a("v-layout",{attrs:{row:"","justify-center":""}},[a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD certificate and key")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:""}},[a("span",[t._v("Add new certificate and key for connection with your LXD server.")])]),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.crt",hint:"Enter cert"},model:{value:t.certs.cert_crt,callback:function(e){t.$set(t.certs,"cert_crt",e)},expression:"certs.cert_crt"}})],1),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.key",hint:"Enter key"},model:{value:t.certs.cert_key,callback:function(e){t.$set(t.certs,"cert_key",e)},expression:"certs.cert_key"}})],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Close")]),t._v(" "),a("v-btn",{attrs:{color:"success",text:""},on:{click:t.savecerts}},[t._v("Save")])],1)],1)],1),t._v(" "),a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialogTest,callback:function(e){t.dialogTest=e},expression:"dialogTest"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD test connection")])]),t._v(" "),a("v-card-text",[a("span",[t._v("Returned LXD server configuration: (Empty list if failed)")]),t._v(" "),a("v-container",{attrs:{"grid-list-md":""}},[a("v-flex",[a("ul",{attrs:{id:"lxddata"}},t._l(t.checkconfig,function(e,i){return a("li",{key:i},[t._v("\n                    "+t._s(i)+":\n                    "),Array.isArray(e)?a("ul",{attrs:{id:"lxddatasub"}},t._l(e,function(e){return a("li",{key:e},[t._v("\n                        "+t._s(e)+"\n                      ")])}),0):"object"==typeof e?a("ul",t._l(e,function(e,i){return a("li",{key:e},[t._v("\n                        "+t._s(i)+": "+t._s(e)+"\n                      ")])}),0):a("span",[t._v(t._s(e))])])}),0)])],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialogTest=!1}}},[t._v("Close")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},535:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("appconfig")],1)},staticRenderFns:[]}},536:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm12:"",md12:"",lg12:""}},[a("v-card",{staticClass:"hide-overflow",attrs:{flat:"",color:"lighteen-1"}},[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-app-bar",{attrs:{flat:"",height:"50px"}},[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{fab:"",small:""},on:{click:function(e){t.isEditing=!t.isEditing}}},[t.isEditing?a("v-icon",[t._v("close")]):a("v-icon",[t._v("edit")])],1)],1),t._v(" "),a("v-card-text",[a("v-checkbox",{attrs:{disabled:!t.isEditing,label:"Enable zfs/brtfs storage"},model:{value:t.showStorage,callback:function(e){t.showStorage=e},expression:"showStorage"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Storage name (for default instance installation)",placeholder:"default",required:""},model:{value:t.data.storage.pool_name,callback:function(e){t.$set(t.data.storage,"pool_name",e)},expression:"data.storage.pool_name"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"Storage total size (for default instance installation)",placeholder:"1000 GB",required:""},model:{value:t.data.storage.total_size,callback:function(e){t.$set(t.data.storage,"total_size",e)},expression:"data.storage.total_size"}})],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"success",disabled:!t.isEditing},on:{click:t.save}},[t._v("Save")])],1)],1)],1)],1)],1),t._v(" "),a("v-layout",{attrs:{row:"","justify-center":""}},[a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD certificate and key")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:""}},[a("span",[t._v("Add new certificate and key for connection with your LXD server.")])]),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.crt",hint:"Enter cert"},model:{value:t.certs.cert_crt,callback:function(e){t.$set(t.certs,"cert_crt",e)},expression:"certs.cert_crt"}})],1),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.key",hint:"Enter key"},model:{value:t.certs.cert_key,callback:function(e){t.$set(t.certs,"cert_key",e)},expression:"certs.cert_key"}})],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Close")]),t._v(" "),a("v-btn",{attrs:{color:"success",text:""},on:{click:t.savecerts}},[t._v("Save")])],1)],1)],1),t._v(" "),a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialogTest,callback:function(e){t.dialogTest=e},expression:"dialogTest"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD test connection")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[t._v("\n            "+t._s(t.checkconfig)+"\n          ")])],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialogTest=!1}}},[t._v("Close")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},554:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs12:"",sm12:"",md12:"",lg12:""}},[a("v-card",{staticClass:"hide-overflow",attrs:{flat:"",color:"lighteen-1"}},[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-app-bar",{attrs:{flat:"",height:"50px"}},[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{fab:"",small:""},on:{click:function(e){t.isEditing=!t.isEditing}}},[t.isEditing?a("v-icon",[t._v("close")]):a("v-icon",[t._v("edit")])],1)],1),t._v(" "),a("v-card-text",[a("v-checkbox",{attrs:{disabled:!t.isEditing,label:"Enable email"},model:{value:t.showEmail,callback:function(e){t.showEmail=e},expression:"showEmail"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"SMTP sender",placeholder:"app@lxdmanager.com",required:""},model:{value:t.data.smtp.sender,callback:function(e){t.$set(t.data.smtp,"sender",e)},expression:"data.smtp.sender"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"SMTP recipient (eg. support mail)",required:"",placeholder:"support@lxdmanager.com"},model:{value:t.data.smtp.recipient,callback:function(e){t.$set(t.data.smtp,"recipient",e)},expression:"data.smtp.recipient"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"SMTP server",required:"",placeholder:"mail.lxdmanager.com"},model:{value:t.data.smtp.server,callback:function(e){t.$set(t.data.smtp,"server",e)},expression:"data.smtp.server"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"SMTP port",required:"",placeholder:"587"},model:{value:t.data.smtp.port,callback:function(e){t.$set(t.data.smtp,"port",e)},expression:"data.smtp.port"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,label:"SMTP login",required:"",placeholder:"app@lxdmanager.com"},model:{value:t.data.smtp.login,callback:function(e){t.$set(t.data.smtp,"login",e)},expression:"data.smtp.login"}}),t._v(" "),a("v-text-field",{attrs:{disabled:!t.isEditing,"append-icon":t.show1?"visibility":"visibility_off",label:"SMTP password",required:"",placeholder:"*********",type:t.show1?"text":"password"},on:{"click:append":function(e){t.show1=!t.show1}},model:{value:t.data.smtp.password,callback:function(e){t.$set(t.data.smtp,"password",e)},expression:"data.smtp.password"}}),t._v(" "),t.showEmail?a("v-btn",{attrs:{disabled:!t.isEditing,dark:t.isEditing,color:"green",small:""},on:{click:function(e){return t.sendTestEmail()}}},[t._v("Send test email")]):t._e()],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"success",disabled:!t.isEditing},on:{click:t.save}},[t._v("Save")])],1)],1)],1)],1)],1),t._v(" "),a("v-layout",{attrs:{row:"","justify-center":""}},[a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD certificate and key")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[a("v-layout",{attrs:{row:""}},[a("span",[t._v("Add new certificate and key for connection with your LXD server.")])]),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.crt",hint:"Enter cert"},model:{value:t.certs.cert_crt,callback:function(e){t.$set(t.certs,"cert_crt",e)},expression:"certs.cert_crt"}})],1),t._v(" "),a("v-layout",{attrs:{row:""}},[a("v-textarea",{attrs:{name:"input-7-1",label:"LXD_cert.key",hint:"Enter key"},model:{value:t.certs.cert_key,callback:function(e){t.$set(t.certs,"cert_key",e)},expression:"certs.cert_key"}})],1)],1)],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Close")]),t._v(" "),a("v-btn",{attrs:{color:"success",text:""},on:{click:t.savecerts}},[t._v("Save")])],1)],1)],1),t._v(" "),a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialogTest,callback:function(e){t.dialogTest=e},expression:"dialogTest"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("LXD test connection")])]),t._v(" "),a("v-card-text",[a("v-container",{attrs:{"grid-list-md":""}},[t._v("\n            "+t._s(t.checkconfig)+"\n          ")])],1),t._v(" "),a("v-card-actions",[a("v-spacer"),t._v(" "),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){t.dialogTest=!1}}},[t._v("Close")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},556:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"grid-list-md":""}},[a("v-tabs",{attrs:{"icons-and-text":"","fixed-tabs":""}},[a("v-tab",{attrs:{href:"#tab-1"}},[t._v("\n    App config\n    "),a("v-icon",[t._v("info")])],1),t._v(" "),a("v-tab",{attrs:{href:"#tab-2"}},[t._v("\n    Email config\n    "),a("v-icon",[t._v("code")])],1),t._v(" "),a("v-tab",{attrs:{href:"#tab-3"}},[t._v("\n    Price config\n    "),a("v-icon",[t._v("settings")])],1),t._v(" "),a("v-tab",{attrs:{href:"#tab-4"}},[t._v("\n    Storage config\n    "),a("v-icon",[t._v("photo_camera")])],1),t._v(" "),t._l(4,function(e){return a("v-tab-item",{key:e,attrs:{value:"tab-"+e}},[1===e?a("v-card",{attrs:{flat:""}},[a("app-config")],1):t._e(),t._v(" "),2===e?a("v-card",{attrs:{flat:""}},[a("email-config")],1):t._e(),t._v(" "),3===e?a("v-card",{attrs:{flat:""}},[a("price-config")],1):t._e(),t._v(" "),4===e?a("v-card",{attrs:{flat:""}},[a("storage-config")],1):t._e()],1)})],2)],1)},staticRenderFns:[]}}});
//# sourceMappingURL=5.be0308e7fad9edca1221.js.map