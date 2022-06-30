<template>
  <div>
    <b-dropdown
      size="md"
      variant="link"
      toggle-class="text-decoration-none"
      class="chat-notification-dropdown"
      no-caret
    >
      <template #button-content>
        <div class="whitetext button-container">
          <i class="fas fa-comment"></i>
          <div class="request-count">
            {{ requestsCount > 0 ? requestsCount : "" }}
          </div>
        </div>
      </template>
      <b-dropdown-item v-for="request in requests" :key="request.id">
        <div class="request-list-item">
          <span class="blacktext">
            {{ request.chatrequest_id.firstname }}
            {{ request.chatrequest_id.lastname }}
          </span>
          <div class="actions">
            <button
              class="request-button accept"
              @click="acceptChatRequest(request.id)"
            >
              Accept
            </button>
            <button
              class="request-button reject"
              @click="rejectChatRequest(request.id)"
            >
              Reject
            </button>
          </div>
        </div>
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import {
  getRequests,
  acceptChat,
  rejectChat,
} from "./../../services/ChatService";
export default {
  name: "Menu",
  data() {
    return {
      requests: [],
      requestsCount: 0,
    };
  },
  methods: {
    getAcceptRequests() {
      let selfId = localStorage.getItem("id");
      getRequests({ id: selfId }).then(({ data }) => {
        if (data.length) {
          this.requests = data;
          this.requestsCount = data.length;
        }
      });
    },
    acceptChatRequest(id) {
      acceptChat({ id }).then(({ data }) => {
        let tempDatas = [];
        this.requests.forEach((e) => {
          if (e.id != data.id) {
            tempDatas.push(e);
          }
        });
        this.requests = tempDatas;
        this.requestsCount = tempDatas.length;
        this.$toast.success("Succesfully accepted chat request!", {
          timeout: 2000,
        });
      });
    },
    rejectChatRequest(id) {
      rejectChat({ id }).then(({ data }) => {
        let tempDatas = [];
        this.requests.forEach((e) => {
          if (e.id != data.id) {
            tempDatas.push(e);
          }
        });
        this.requests = tempDatas;
        this.requestsCount = tempDatas.length;
        this.$toast.success("Succesfully rejected chat request!", {
          timeout: 2000,
        });
      });
    },
  },
  mounted: function () {
    this.getAcceptRequests();
  },
};
</script>

<style scoped>
</style>
