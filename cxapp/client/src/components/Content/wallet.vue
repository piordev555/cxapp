<template>
    <div class="main-content">
        
        <div v-if="!loading" class="whitetext" style="height: 100vh">
            <div v-if="connectionStatus === 'disconnected'">
                <button @click="connect" class="mt-5">
                    <img src="@/assets/xummSignIn.svg" alt="">
                </button>
                
            </div>
            <div v-else-if="connectionStatus === 'connecting'">
                <img v-if="qrCode" :src="qrCode" alt="">
                <br />
                <p class="mt-3">Connecting...</p>
            </div>
            <div v-else>
                Your account is connected to wallet id: {{ address }}
                <br />
                <b-button class="mt-2" @click="disconnect" variant="danger">Disconnect</b-button>
            </div>
        </div>
        

    </div>
</template>

<script>
    import Menu from "./../../components/Menu/menu.vue";
    import ChatNotification from "./../../components/ChatNotification/chatNotification.vue"; 
    import http from "@/http-common";
    import socketio from 'socket.io-client';

    export default {
        name: "Wallet",
        components: {
            Menu,
            ChatNotification,
        },
        methods: {
            async getUpdate(sock, uuid){
                sock.emit("xumm", {uuid})
                if(sock.connected){
                    setTimeout(this.getUpdate, 2000, sock, uuid)
                }
            },
            async connect(){
                this.connectionStatus = 'connecting'
                let response = await http.post(`/xumm/connect/${this.id}`)
                this.qrCode = response.data.refs.qr_png
                // const socket = socketio(response.data.refs.websocket_status,)
                //     // handle the event sent with socket.send()
                //     socket.on("message", data => {
                //     console.log(data);
                // });
                
                let sock = socketio(process.env.VUE_APP_ROOT_API);
                sock.on('connect', (socket) => {
                    this.getUpdate(sock, response.data.uuid)
                });
                sock.on('xumm', (msg) => {
                    if(msg.message === 'connected'){
                        this.connectionStatus = 'connected'
                        this.address = msg.wallet_id
                        sock.disconnect()
                        this.$toast.success("Wallet Connect!", {timeout: 4000,});
                    }
                    else if(msg.message === 'disconnected'){
                        this.connectionStatus = 'disconnected'
                        sock.disconnect()
                        this.$toast.error("Request Rejected", {timeout: 4000,});
                    }
                });
            },
            async disconnect(){
                this.connectionStatus = 'disconnected'
                this.qrCode = ''
                await http.post(`/xumm/delete/${this.id}`)
            }
        },
        data(){
            return{
                id: localStorage.getItem("id"),
                connectionStatus: 'disconnected',
                loading: true,
                qrCode: '',
                address: ''
            }
        },
        async mounted() {
            let response = await http.get(`/xumm/account/${this.id}`)
            if(response.data._id){
                this.connectionStatus = 'connected'
                this.address = response.data.wallet_id
            }
            this.loading = false
        },
    }
</script>
