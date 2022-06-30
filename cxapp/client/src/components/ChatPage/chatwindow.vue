<template>
  <div class="container-fluid p-0 h-100">
    <div class="chat-box-full">
      <div class="chat-box-body-full">
        <div class="chat-box-overlay"></div>
        <transition-group
          name="bounce"
          tag="div"
          id="chat-log"
          class="chat-logs-full"
        >
          <span v-for="(message, index) in messages" :key="message.time">
            <div
              :title="moment(message.time).fromNow()"
              class="chat-msg self"
              :key="index"
              @contextmenu.prevent="$refs.menu.open($event, message)"
              v-if="message.from === selfId && message.file !== true"
            >
              <div class="cm-msg-text-full">{{ message.payload }}</div>
            </div>
            <div v-else-if="message.file === true && message.from !== partnerId" class="chat-msg self">
              <a
                v-bind:href="'' + message.payload + ''"
                target="_blank"
                :title="moment(message.time).fromNow()"
                @contextmenu.prevent="$refs.menu.open($event, message)"
                class="file-anchor"
              >
                <div class="file-link">
                  <span
                    >📁
                    <p style="color: #5a5eb9">YOU SHARED A FILE</p>
                  </span>

                  <p class="file-title">
                    {{
                      decodeURIComponent(
                        message.payload.match(/(?&lt;=%2F)(.*)(?=\?)/)[0]
                      )
                    }}
                  </p>
                </div>
              </a>
            </div>
            <div
              v-else-if="message.file !== true"
              :key="index"
              class="chat-msg user"
              :title="moment(message.time).fromNow()"
            >
              <div class="cm-msg-text-full">{{ message.payload }}</div>
            </div>
            <div
              v-if="message.from === partnerId && message.file === true"
              class="chat-msg self"
              @contextmenu.prevent="$refs.fileMenu.open($event, message)"
            >
              <a
                v-bind:href="'' + message.payload + ''"
                target="_blank"
                :title="moment(message.time).fromNow()"
              >
                <div class="file-link">
                  <span
                    >📁
                    <p style="color: #5a5eb9">
                      {{ selectedUser.firstname }} SHARED A FILE
                    </p>
                  </span>
                  <p class="file-title">
                    {{
                      decodeURIComponent(
                        message.payload.match(/(?&lt;=%2F)(.*)(?=\?)/)[0]
                      )
                    }}
                  </p>
                </div>
              </a>
              <div class="d-flex" style="color:#fff">
               <p
                  @click.prevent="deletemessage(message)"
                  class="del-context-menu-full mr-5"
                >
                  Reject File
                </p>
              <p>
                Accept File
              </p>
              </div>
            </div>
          </span>
        </transition-group>

        <div class="chat-input">
          <template v-if="isBlocked">
            <div class="blocked-chat">You are blocked from this User.</div>
          </template>
           <template v-else-if="isSelfBlocked">
            <div class="blocked-chat">You have blocked this User.</div>
          </template>
          <!-- <template v-else-if="isAccepted == 1 && currentuser.friends = true"> -->
          <template v-else-if="isAccepted == 1">
            <Emojis @onEmojiInserted="insertEmoji" />
            <form
              enctype="multipart/form-data"
              novalidate
              class="file-container"
            >
             <!-- v-bind:class="[
                  loading === true ? 'file-loading' : 'share-file',
                ]" -->
              <label
                for="file-upload"
                class="custom-file-upload"
                :title="[loading === true ? 'Share file' : 'Loading...']"
              >
                <i
                  for="file-upload"
                  class="fa fa-paperclip custom-file-upload"
                  :title="[loading === true ? 'Share file' : 'Loading...']"
                  aria-hidden="true"></i>
              </label>
             
              <input
                style="display: none"
                type="file"
                v-bind:class="[loading === true && 'file-loading']"
                :disabled="loading === true"
                id="file-upload"
                @change="sendFile($event.target.name, $event.target.files[0])"
                accept="*"
                class="input-file"
              />
            </form>
             <input
              type="text"
              id="chat-input-full"
              placeholder="Write a Message..."
              v-model="userinput"
              autocomplete="off"
              @keyup.enter="sendmsg"
              @blur="this.$socket.emit('stop_typing', { self: this.selfId, partner: this.partnerId })"
            />

            <!-- <button @click="sendmsg" class="chat-submit" id="chat-submit">
              SEND
            </button> -->
          </template>
          <template v-else-if="isAccepted == 2">
            <div class="chat-request-container">Waiting accept request.</div>
          </template>
          <template v-else-if="isAccepted == -1">
            <div class="chat-request-container">
              <span>Rejected chat request</span>
              <button
                class="chat-request-button"
                @click="chatRequestSend('rerequest')"
              >
                Rerequest
              </button>
            </div>
          </template>
          <template v-else>
            <div class="chat-request-container">
              <span>Need to request chat</span>
              <button
                class="chat-request-button"
                @click="chatRequestSend('request')"
              >
                Request
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="chat-box-header-full">
      <div class="container">
        <div class="row">
          <div class="col" style="line-height: 18px">
            <div class="friend-name">
              {{ selectedUser.firstname }} {{ selectedUser.lastname }}
            </div>
            <h5
              style="font-size: 18px;color: green"
              class="loading-ellipsis p-2"
              v-if="checkTyping()"
            >
              typing
            </h5>
            <!-- <span class="friend-status">Last Seen 10 minute ago</span> -->
          </div>
        </div>

        <div class="col">
          <img
            v-if="selectedUser.profile && selectedUser.profile != ''"
            v-bind:src="selectedUser.profile"
            class="profile-pic-header"
          />
        </div>
      </div>
      <div v-if="onlineIds.includes(partnerId)" class="d-flex offline-button"><div style="background-color: green;border-radius: 10px;width: 20px;height: 20px;margin-right:10px;margin-top:4px"></div><span>Online</span></div>
      <div v-else class="d-flex offline-button"><div style="background-color: red;border-radius: 10px;width: 20px;height: 20px;margin-right:10px;margin-top:4px"></div><span>Offline</span></div>

      <!-- <span
        class="partner-status"
        v-bind:class="[
          onlineIds.includes(partnerId) ? 'logged-in' : 'logged-out',
        ]"
        :title="[
          onlineIds.includes(partnerId) ? 'User is Online' : 'User Offline',
        ]"
      > -->
      <!-- </span> -->
      <!-- <span class="chat-box-toggle" v-on:click="$emit('onCloseChat')"></span> -->
    </div>
    <vue-context ref="menu" v-slot="{ data }">
      <li>
        <p
          @click.prevent="onClick($event, deletemessage(data))"
          class="del-context-menu"
        >
          Delete Message
        </p>
      </li>
    </vue-context>
      <!-- <vue-context ref="fileMenu" v-slot="{ data }">
        <p
          @click.prevent="onClick($event, deletemessage(data))"
          class="del-context-menu"
        >
          Reject File
        </p>
      <p
        class="accept-context-menu-full"
      >
        Accept File
      </p>
    </vue-context> -->
  </div>
</template>
<style scoped>
@import "./chatWindowStyles.css";
@import "~vue-context/dist/css/vue-context.css";
</style>
<script>
import "firebase/firestore";
import { doFileTransfer } from "./fileHandle";
import { userDetail } from "../../services/UserService";
import {
  onSnapshot,
  getDoc,
  doc,
  setDoc,
  arrayRemove,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firestore/db";
import Vue from "vue";
import "vuetify/dist/vuetify.css";
import moment from "moment";
import Emojis from "./twemojiPicker.vue";
import VueContext from "vue-context";
import { isBlocked } from "./../../services/BlockService";
import { isAccepted, sendRequest } from "./../../services/ChatService";

export default {
  name: "chatwindow",
  props: ["partnerId", "selectedUser"],
  components: { Emojis, VueContext },
  data() {
    return {
      partnerData: {},
      partcilesLoaded: {},
      selfId: "",
      chatHash: "",
      firstname: "",
      userinput: "",
      messages: [],
      hover: false,
      resUrl: "",
      isSelfBlocked: false,
      isBlocked: false,
      isAccepted: false,
      loading: false,
      onlineIds: [],
      typingIds: [],
    };
  },
  // watch: {
  //   userinput: function (val) {
  //     this.userinput = val;
  //   },
  // },
  methods: {
    checkTyping (){
        const record = this.typingIds.find((t) => t.partner == this.selfId && t.self === this.partnerId)
        if(record) return true 
        else return false
    },
    async sendFile(e, file) {
      this.loading = true;
      this.resUrl = await doFileTransfer(this.chatHash, file);
      console.log("file stored under url: ", this.resUrl);
      const msgData = {
        from: this.selfId,
        to: this.partnerId,
        payload: this.resUrl,
        time: Date.now(),
        file: true,
      };
      const logRef = doc(db, "logs", this.chatHash);
      this.loading = false;
      await updateDoc(logRef, { messages: arrayUnion(msgData) });
    },

    insertEmoji(emoji) {
      this.userinput += emoji;
    },
    deletemessage: async function (msgData) {
      if (confirm("Delete the message?")) {
        const logRef = doc(db, "logs", this.chatHash);
        await updateDoc(logRef, { messages: arrayRemove(msgData) });
      }
    },
    sendmsg: async function (e) {
      if(this.userinput.trim().length === 0) {
        return;
      }
      e.preventDefault();
      const msgData = {
        from: this.selfId,
        to: this.partnerId,
        payload: this.userinput,
        time: Date.now(),
      };
      const logRef = doc(db, "logs", this.chatHash);
      await updateDoc(logRef, { messages: arrayUnion(msgData) });

      this.userinput = "";
      this.userinput = "";
    },
    checkBlocked() {
      const selfId = localStorage.getItem("id");
      isBlocked({ id: this.partnerId, block_id: selfId }).then((response) => {
        this.isBlocked = response.data.blocked;
      });
    },
    checkSelfBlocked() {
      const selfId = localStorage.getItem("id");
      isBlocked({ id: selfId, block_id: this.partnerId }).then((response) => {
        this.isSelfBlocked = response.data.blocked;
      });
    },
    checkAccepted() {
      const selfId = localStorage.getItem("id");
      isAccepted({ id: selfId, user_id: this.partnerId }).then((response) => {
        this.isAccepted = response.data.status;
      });
    },
    chatRequestSend(type) {
      const selfId = localStorage.getItem("id");
      sendRequest({ id: selfId, user_id: this.partnerId }).then((response) => {
        this.isAccepted = response.data.status;
        if (type == "request") {
          this.$toast.success("Succesfully sent chat request!", {
            timeout: 2000,
          });
        } else {
          this.$toast.success("Succesfully resent chat request!", {
            timeout: 2000,
          });
        }
      });
    },
    async getMessages() {
      this.checkBlocked();
      this.checkSelfBlocked();
      this.checkAccepted();
      let a = this.isAccepted;
      Vue.prototype.moment = moment;

      this.selfId = localStorage.getItem("id");
      this.chatHash = [this.selfId, this.partnerId].sort().join();
      userDetail(this.partnerId).then((res) => {
        this.partnerData = res.data;
        console.log('///////////////', res.data)
        this.firstname = res.data.firstname;
      });

      const docRef = doc(db, "logs", this.chatHash);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let dbData = docSnap.data();
        this.messages = dbData.messages;
        setTimeout(() => {
          var container = this.$el.querySelector("#chat-log");
          container.scrollTop = container.scrollHeight;
        }, 200);
      } else {
        const newLogRef = doc(db, "logs", this.chatHash);
        await setDoc(newLogRef, { messages: [] });
        console.log("Creating new log");
      }

      onSnapshot(doc(db, "logs", this.chatHash), (doc) => {
        let dbData = doc.data();
        if (!dbData?.messages?.length) {
          this.messages = [];
        } else {
          this.messages = dbData.messages;
          console.log("message batch: ", this.messages);
          setTimeout(() => {
            var container = this.$el.querySelector("#chat-log");

            container.scrollTop = container.scrollHeight;
          }, 400);
        }
      });
    },
     clickButton: function(val){
          this.$socket.emit('client_event1', val);      
        }
  },
  mounted: async function () {
    this.getMessages();
  },
  created(){
    this.getMessages();
    this.$socket.emit("online", this.selfId);
  },
  watch: {
    userinput: function (val, oldVal) {
      // this.userinput = val;
      if (val.length > 0 && oldVal.length === 0) {
        this.$socket.emit("start_typing", { self: this.selfId, partner: this.partnerId });

      }
      if (val.length === 0 && oldVal.length > 0) {
        this.$socket.emit("stop_typing", { self: this.selfId, partner: this.partnerId });
      }
    },
    selectedUser() {
      this.getMessages();
    },
  },
   sockets:{
     get_online_ids: function (data){
       this.onlineIds = data;
     },
     get_typing_ids: function (data){
       this.typingIds = data;
     }
    },
//   sockets: {
//     connect: function () {
//       console.log("her");
//       this.$socket.emit("online123", this.selfId);
//     },
//     disconnect: function () {
//       this.$socket.emit("offline", this.selfId);
//       console.log("her");
//     },
//     updateIds: function (ids) {
//       this.onlineIds = ids;
//       console.log("her", ids);
//     },
//     updateIds1: function (ids) {
//       this.onlineIds = ids;
//       console.log("her", ids);
//     },
//     updateTypings: function (ids) {
//       this.typingIds = ids;
//       console.log("her", ids);
//     },
//   },
};
</script>
