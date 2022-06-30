<template>
  <div class="chat-container">
    <div class="chat-box">
      <div class="chat-box-header">
        <div class="d-flex justify-content-between align-items-center">
          <div class="ml-2 align-items-center" style="line-height: 16px">
            <span class="ml-2" style="font-size:18px">{{firstname}} {{lastname}}</span>
              <p
                style="font-size: 16px;color: green"
                class="loading-ellipsis"
                v-if="checkTyping()"
              >
                typing
              </p>
          </div>
          <div class="align-items-center d-flex">
            <div v-if="onlineIds.includes(partnerId)" class="d-flex ml-2 align-items-center"><div style="background-color: green;border-radius: 10px;width: 15px;height: 15px;margin-right:10px;"></div><span style="font-size:16px">Online</span></div>
            <div v-else class="d-flex ml-2 align-items-center"><div style="background-color: red;border-radius: 10px;width: 15px;height: 15px;margin-right:10px;"></div><span style="font-size:16px">Offline</span></div>
            <span class="chat-box-toggle ml-2" v-on:click="$emit('onCloseChat')"></span>
          </div>
        </div>
      </div>
      <div class="chat-box-body">
        <div class="chat-box-overlay"></div>
        <transition-group
          name="bounce"
          tag="div"
          id="chat-log"
          class="chat-logs"
        >
          <span v-for="(message, index) in messages" :key="message.time">
            <div
              :title="moment(message.time).fromNow()"
              class="chat-msg self"
              :key="index"
              @contextmenu.prevent="$refs.menu.open($event, message)"
              v-if="message.from === selfId && message.file !== true"
            >
              <div class="cm-msg-text">{{ message.payload }}</div>
            </div>
            <div v-else-if="message.file === true" class="chat-msg self">
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
              <div class="cm-msg-text">{{ message.payload }}</div>
            </div>
            <div
              v-if="message.from === partnerId && message.file === true"
              class="chat-msg self"
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
                      {{ firstname }} SHARED A FILE
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
            <div class="blocked-chat">
              You are blocked from this User.
            </div>
          </template>
           <template v-else-if="ispartnerRequested">
            <div class="chat-request-container">
              <span>Need to Accept chat request</span>
              <button class="chat-request-button" @click="acceptPartnerReq()">Accept</button>
            </div>
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
            <!-- <button @click="sendmsg" class="chat-submit" id="chat-submit">
              SEND
            </button> -->
             <input
              type="text"
              id="chat-input"
              placeholder="Write a message..."
              v-model="userinput"
              autocomplete="off"
              @keyup.enter="sendmsg"
            />
          </template>
          <template v-else-if="isAccepted == 2">
            <div class="chat-request-container">
              Waiting accept request.
            </div>
          </template>
          <template v-else-if="isAccepted == -1">
            <div class="chat-request-container">
              <span>Rejected chat request</span>
              <button class="chat-request-button" @click="chatRequestSend('rerequest')">Rerequest</button>
            </div>
          </template>
          <template v-else>
            <div class="chat-request-container">
              <span>Need to request chat</span>
              <button class="chat-request-button" @click="chatRequestSend('request')">Request</button>
            </div>
          </template>
        </div>
      </div>
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
import { isAccepted, sendRequest, getpartnerReq, acceptPartnerChatReq } from "./../../services/ChatService";

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
      lastname: "",
      userinput: "",
      messages: [],
      hover: false,
      resUrl: "",
      isBlocked: false,
      isAccepted: false,
      ispartnerRequested: false,
      loading: false,
      onlineIds: [],
      typingIds: [],
    };
  },
  watch: {
    userinput: function (val) {
      this.userinput = val;
    },
  },
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
      isBlocked({ id: selfId, user_id: this.partnerId }).then((response) => {
        this.isBlocked = response.data.blocked;
      });
    },
    checkAccepted() {
      const selfId = localStorage.getItem("id");
      isAccepted({ id: this.partnerId, user_id: selfId }).then((response) => {
        this.isAccepted = response.data.status;
      });
    },
    chatRequestSend(type) {
      const selfId = localStorage.getItem("id");
      sendRequest({ id: this.partnerId, user_id: selfId }).then((response) => {
        this.isAccepted = response.data.status;
        if(type == 'request') {
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
    getPartnerChatReq() {
      const selfId = localStorage.getItem("id");
      getpartnerReq({ user_id: this.partnerId, chatrequest_id: selfId }).then((response) => {
        if(response.data && response.data.length)
         this.ispartnerRequested = true;
      });
    },
    acceptPartnerReq() {
      const selfId = localStorage.getItem("id");
      acceptPartnerChatReq({ user_id: this.partnerId, chatrequest_id: selfId }).then((response) => {
          this.$toast.success("Succesfully Accepted chat request!", {
            timeout: 2000,
          });
        this.ispartnerRequested = false
        this.isAccepted = 1
        // this.checkAccepted();
      });
    },
    async getMessages() {
    this.checkBlocked();
    this.getPartnerChatReq();
    this.checkAccepted();
    Vue.prototype.moment = moment;

    this.selfId = localStorage.getItem("id");
    this.chatHash = [this.selfId, this.partnerId].sort().join();
    userDetail(this.partnerId).then((res) => {
      this.partnerData = res.data;
      this.firstname = res.data.firstname;
      this.lastname = res.data.lastname;

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
  
    }
  },
  created() {
    this.getMessages();
    this.$socket.emit("online", this.selfId);
  },
  mounted: async function () {
  },
  watch: {
    userinput: function (val, oldVal) {
      if (val.length > 0 && oldVal.length === 0) {
        this.$socket.emit("start_typing", { self: this.selfId, partner: this.partnerId });
      }
      if (val.length === 0 && oldVal.length > 0) {
        this.$socket.emit("stop_typing", { self: this.selfId, partner: this.partnerId });
      }
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
};
</script>