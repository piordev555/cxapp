<template>
    <div class="main-content">

        <template v-if="isBlocked">
            <div class="user-box" style="color:white; font-size: 20px">
                You have blocked this User.
            </div>
        </template>
        <template v-if="isSelfBlocked">
            <div class="user-box" style="color:white; font-size: 20px">
                You are blocked from this User.
            </div>
        </template>
        <div class="row" v-if="!isSelfBlocked">
            <div class="col-lg-12">
                <div class="card hovercard">
                    <div class="cardheader">
                        <img alt="cover image"
                             :src="currentuser.img ? currentuser.img: 'https://i.ytimg.com/vi/dzdZ3CTRcV4/maxresdefault.jpg'" />
                        <!-- <img
      alt="coverimage"
      v-else
      src="https://i.ytimg.com/vi/dzdZ3CTRcV4/maxresdefault.jpg"
    /> -->
                        <hr class="hr-line" />
                        <div class="name">
                            <span :v-if="currentuser.username">@{{ currentuser.username }}</span>
                        </div>
                        <div class="avatar">
                            <img alt="Profile pic"
                                 v-b-modal="'image-modal'"
                                 :src="currentuser.profile ? currentuser.profile: require('../../assets/users.svg')" />
                        </div>

                        <div class="text-right edit-profile-links" v-if="checkUser(currentuser._id)">
                            <span v-on:click="subscribe(currentuser._id)"
                                  v-if="!Subscribe"
                                  class="userbutton Subscribebutton">Subscribe</span>
                            <span v-on:click="subscribe(currentuser._id)"
                                  v-else
                                  class="userbutton unSubscribebutton">Subscribed</span>
                            <b-dropdown id="dropdown-1" variant="link" class="userButton m-md-2" no-caret toggle-class="text-decoration-none">
                                <template #button-content>
                                    <i class="fa fa-ellipsis-v overflow-icon"></i>
                                </template>
                                <span class="userButton" @click="toggleSelect = !toggleSelect"></span>
                                <b-dropdown-item>
                                    <span v-on:click="block(currentuser._id)" v-if="!isBlocked">Block</span>
                                    <span v-on:click="block(currentuser._id)" v-else>Blocked</span>
                                </b-dropdown-item>
                                <b-dropdown-item>Report User Profile</b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <div class="text-left edit-profile-links" v-if="checkUser(currentuser._id)">
                            <span @click="openChat(currentuser)" class="userbutton Chatbutton mr-2"><i class="fa fa-envelope"></i></span>
                            <span v-if="friends && !isReqSent"
                                  v-on:click="unfriend_(currentuser._id)"
                                  class="userbutton Friendbutton mr-2"><i class="fa fa-user-minus"></i></span>
                            <span v-if="!isReqSent && !friends"
                                  v-on:click="addFriend(currentuser._id)"
                                  class="userbutton Friendbutton mr-2"><i class="fa fa-user-plus"></i></span>
                            <span v-if="isReqSent && !friends" class="mr-2">Requested</span>
                        </div>
                        </div>
                        <div class="info">
                            <div class="title">
                                <strong>{{ currentuser.firstname }} {{ currentuser.lastname }}</strong>
                            </div>
                            <div v-if="role && role.length > 0" class="desc-role">
                                <span v-for="r in role" :key="r" class="item">
                                    <span class="mr-3">{{ r }}</span>
                                </span>
                            </div>
                            <div class="desc-about"
                                 :v-if="
                currentuser &&
                currentuser.about !== undefined &&
                currentuser.about
              ">
                                {{ currentuser.about }}
                            </div>
                            <div class="location">
                                <span></span>
                                <span class="icon-Menu-Map mr-2"></span>
                                <span :v-if="currentuser.country" class="mr-3">
                                    {{
                currentuser.country
                                    }}
                                </span>
                                <span :v-if="currentuser.region" class="mr-3">
                                    {{
                currentuser.region
                                    }}
                                </span>

                                <span v-for="icon in iconList" :key="icon" class="ml-2">
                                    <img :src="require(`../../assets/${icon.img}`)"
                                         height="20px"
                                         width="20px" />
                                </span>
                            </div>
                            <div class="desc-friends">
                                <span><strong>{{ currentuser.friendsCount }}</strong> Friends</span>
                                <span>
                                    <strong>{{ currentuser.subscribeCount }}</strong>
                                    Subscribers
                                </span>
                            </div>
                        </div>
                        <!-- <div class="bottom">
        <a class="btn btn-primary btn-twitter btn-sm" href="https://twitter.com/webmaniac">
            <i class="fa fa-twitter"></i>
        </a>
        <a class="btn btn-danger btn-sm" rel="publisher"
           href="https://plus.google.com/+ahmshahnuralam">
            <i class="fa fa-google-plus"></i>
        </a>
        <a class="btn btn-primary btn-sm" rel="publisher"
           href="https://plus.google.com/shahnuralam">
            <i class="fa fa-facebook"></i>
        </a>
        <a class="btn btn-warning btn-sm" rel="publisher" href="https://plus.google.com/shahnuralam">
            <i class="fa fa-behance"></i>
        </a>
    </div> -->
                        <div class="container center">
                            <div class="row d-flex justify-content-center">
                                <div class="col-4 d-flex justify-content-center"
                                     v-for="(cardinfo, index) in [1, 2, 3, 4, 5, 6]"
                                     :key="index">
                                    <div class="card text-center tile"></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

        <transition name="fade">
            <ChatWindow v-if="partnerId"
                        v-bind:partnerId="partnerId"
                        @onCloseChat="closeChatAction"
                        v-bind:selectedUser="selectedUser" />
        </transition>
        <b-modal hide-footer centered id='image-modal'>
            <div style="text-align:center">
                <img alt="big-pic" class="big-image"
                        :src="currentuser.profile ? currentuser.profile: require('../../assets/users.svg')" />
            </div>
        </b-modal>
    </div>
</template>

<script>
    import Menu from "./../../components/Menu/menu.vue";
    import { userDetailByUsername } from  "./../../services/UserService";
    import { friendrequest, friends, isFriendReqSent, unfriend } from "./../../services/FriendService";
    import { subscriberequest, subrcibes } from "./../../services/SubscribeService";
    import { blockrequest, blocks, isBlocked } from "./../../services/BlockService";
    import ChatWindow from "../Chat/chatwindow.vue";
    import ChatNotification from "./../../components/ChatNotification/chatNotification.vue";
    export default {
        name: "User",
        components: {
            Menu,
            ChatWindow,
            ChatNotification,
        },
        data() {
            return {
                selectedUser: {},
                iconList: [],
                isSelfBlocked: false,
                isBlocked: false,
                currentuser: null,
                friends: false,
                Subscribe: false,
                Blocked: false,
                msg: "SocialGPS",
                role: null,
                isActive: false,
                partnerId: "",
                isReqSent: false,
            };
        },
        methods: {
             async isFriendReqSend() {
                const friend_id = this.$route.params.id;

                const id = localStorage.getItem("id");
                const data = {
                    user_id: id,
                    friendrequest_id: friend_id,
                };
                let output = false;
                let response = await isFriendReqSent(data);
                if (Object.keys(response.data).length > 0) {
                    this.isReqSent = true;
                }
                else this.isReqSent = false;
                console.log('isfrind req==', output)
                // return output;
            },
            checkUser(id){
                return localStorage.getItem('id') !== id
            },
            openChat: function (item) {
                this.partnerId = item._id;
                this.selectedUser = item
                // setTimeout(() => {
                //     this.partnerId = request_id;
                // }, 100);
            },
            closeChatAction() {
                this.partnerId = "";
            },
            addFriend: function (request_id) {
                this.friends = !this.friends;
                const user_id = localStorage.getItem("id");
                const data = {
                    user_id: user_id,
                    friendrequest_id: request_id,
                    status: this.friends,
                    friend_req_status: 'Not Selected'
                };
                friendrequest(data)
                    .then((response) => {
                        if (this.friends == true) {
                            this.$toast.success("Friend request send successfull!", {
                                timeout: 2000,
                            });
                            this.isReqSent = true
                            this.friends = false
                        } else {
                            this.$toast.error("Unfriend successfully!", {
                                timeout: 2000,
                            });
                            this.isReqSent = false
                            this.friends = false

                        }
                    })
                    .catch((err) => {
                        this.$toast.error(err.response.data.message, {
                            timeout: 2000,
                        });
                    });
            },
            unfriend_: function (request_id) {
                this.friends = !this.friends;
                const user_id = localStorage.getItem("id");
                const data = {
                    user_id: user_id,
                    friendrequest_id: request_id
                };
                unfriend(data)
                    .then((response) => {
                            this.$toast.success("Friend Unfriend successfull!", {
                                timeout: 2000,
                            });
                            this.friends = false;
                            this.isReqSent = false;

                    })
                    .catch((err) => {
                        this.$toast.error(err.response.data.message, {
                            timeout: 2000,
                        });
                    });
            },
            subscribe: function (request_id) {
                this.Subscribe = !this.Subscribe;
                const user_id = localStorage.getItem("id");
                const data = {
                    user_id: user_id,
                    subrequest_id: request_id,
                    status: this.Subscribe,
                };
                subscriberequest(data)
                    .then((response) => {
                        if (this.Subscribe == true) {
                            this.$toast.success("Subcribed successfully!", {
                                timeout: 2000,
                            });
                        } else {
                            this.$toast.error("UnSubcribed successfully!", {
                                timeout: 2000,
                            });
                        }
                    })
                    .catch((err) => {
                        this.$toast.error(err.response.data.message, {
                            timeout: 2000,
                        });
                    });
            },
            block: function (request_id) {
                this.Blocked = !this.isBlocked;
                const user_id = localStorage.getItem("id");
                const data = {
                    user_id: user_id,
                    blockrequest_id: request_id,
                    status: this.Blocked,
                };
                blockrequest(data)
                    .then((response) => {
                        if (this.Blocked == true) {
                            this.$toast.success("Blocked successfully!", {
                                timeout: 2000,
                            });
                            this.isBlocked = true;
                        } else {
                            this.$toast.error("UnBlocked successfully!", {
                                timeout: 2000,
                            });
                            this.isBlocked = false;
                        }
                    })
                    .catch((err) => {
                        this.$toast.error(err.response.data.message, {
                            timeout: 2000,
                        });
                    });
            },
            getdata() {
                const id = this.$route.params.id;
                userDetailByUsername(id)
                    .then((response) => {
                        this.currentuser = response.data;
                        this.hobbies = this.currentuser.hobbies;
                        // console.log("....==============", this.currentuser.role);

                        this.role = this.currentuser.role;
                        this.rolesIcon = [
                            { img: "Entertainers/users.svg", name: "Viewer/Listener/User" },
                            { img: "Entertainers/Filmmaker.svg", name: "Actor/Filmmaker" },
                            { img: "Entertainers/Affiliate.svg", name: "Affiliate" },
                            { img: "Entertainers/Athlete.svg", name: "Athlete" },
                            { img: "Entertainers/Blogger.svg", name: "Blogger / Vlogger" },
                            { img: "Entertainers/Actor.svg", name: "Comedian" },
                            { img: "Entertainers/Dancer.svg", name: "Dancer" },
                            { img: "Entertainers/Singer.svg", name: "Emcee" },
                            { img: "Entertainers/Gamer.svg", name: "Gamer" },
                            { img: "Entertainers/Musician.svg", name: "Musician" },
                            { img: "Entertainers/Arts&Crafts.svg", name: "Painter / Crafting" },
                            { img: "Events/Theatre.svg", name: "Theater performer" },
                            { img: "Entertainers/Writer.svg", name: "Writer / Poet" },
                            { img: "Entertainers/Beatmaker.svg", name: "Beatmaker" },
                            { img: "Entertainers/Cameraoperator.svg", name: "Cameraoperator" },
                            { img: "Entertainers/Designer.svg", name: "Designer" },
                            { img: "Entertainers/Dj.svg", name: "DJ" },
                            { img: "Entertainers/Mixengineer.svg", name: "Mixengineer" },
                            { img: "Entertainers/Musiccomposer.svg", name: "Musiccomposer" },
                            { img: "Entertainers/Performanceart.svg", name: "Performanceart" },
                            { img: "Entertainers/Petshow.svg", name: "Petshow" },
                            { img: "Entertainers/Photographer.svg", name: "Photographer" },
                            { img: "Entertainers/Podcaster.svg", name: "Podcaster" },
                            { img: "Entertainers/Singer.svg", name: "Singer" },
                            { img: "Entertainers/Dance.svg", name: "Dance Event" },
                            { img: "Entertainers/DJ.svg", name: "DJ Event" },
                            { img: "Entertainers/Game.svg", name: "Game Event" },
                            { img: "Entertainers/Music.svg", name: "Music Event" },
                            { img: "Entertainers/Petshow.svg", name: "Petshow Event" },
                            { img: "Entertainers/Photography.svg", name: "Photography Event" },
                            { img: "Entertainers/Sports.svg", name: "Sports Event" },
                            { img: "Entertainers/Podcast.svg", name: "Podcast Event" },
                            { img: "Entertainers/Theatre.svg", name: "Theatre Event" },
                            { img: "Entertainers/Theatre.svg", name: "THouse Location" },
                            { img: "Entertainers/Theatre.svg", name: "Theatre Location" },
                            { img: "Entertainers/Theatre.svg", name: "Miscellaneous Location" },
                            { img: "Entertainers/Theatre.svg", name: "Rehearsal Location" },
                            { img: "Entertainers/Theatre.svg", name: "Music Store" },
                            { img: "Entertainers/Theatre.svg", name: "Record Store" },
                            {
                                img: "Entertainers/Theatre.svg",
                                name: "Recording Studio Location Event",
                            },
                        ];
                        this.role.map((r) => {
                            this.iconList.push(this.rolesIcon.find((i) => i.name === r));
                        });
                    })
                    .catch((err) => {
                        this.$toast.error(err.response.data.message, {
                            timeout: 2000,
                        });
                    });
            },
            arefriends() {
                const id = localStorage.getItem("id");
                const friend_id = this.$route.params.id;
                const data = {
                    user_id: id,
                    friendrequest_id: friend_id,
                };
                friends(data)
                    .then((response) => {
                        if (Object.keys(response.data).length) {
                            this.friends = true;
                        } else {
                            this.friends = false;
                        }
                    })
                    .catch((err) => { });
            },
            areblocked() {
                const id = localStorage.getItem("id");
                const block_id = this.$route.params.id;
                const data = {
                    user_id: id,
                    friendblock_id: block_id,
                };
                blocks(data)
                    .then((response) => {
                        if (Object.keys(response.data).length) {
                            this.blocks = true;
                        } else {
                            this.blocks = false;
                        }
                    })
                    .catch((err) => { });
            },
            aresubscribe() {
                const id = localStorage.getItem("id");
                const subscribe_id = this.$route.params.id;
                const data = {
                    user_id: id,
                    subrequest_id: subscribe_id,
                };
                subrcibes(data)
                    .then((response) => {
                        if (Object.keys(response.data).length) {
                            this.Subscribe = true;
                        } else {
                            this.Subscribe = false;
                        }
                    })
                    .catch((err) => { });
            },
            checkUserBlocked() {
                const id = localStorage.getItem("id");
                const block_id = this.$route.params.id;
                isBlocked({ id, block_id }).then((response) => {
                    this.isBlocked = response.data.blocked;
                });
            },
            checkSelfBlocked() {
                const block_id = localStorage.getItem("id");
                const  id = this.$route.params.id;
                isBlocked({ id, block_id }).then((response) => {
                    this.isSelfBlocked = response.data.blocked;
                });
            },
        },
        mounted() {
            this.getdata();
            this.arefriends();
            this.aresubscribe();
            this.areblocked();
            this.checkUserBlocked();
            this.checkSelfBlocked();
            this.isFriendReqSend();
        },
    };
</script>

<style scoped>
    .container {
        padding: 20px;
        width: 80%;
    }

    .tile {
        width: 200px;
        min-height: 200px;
    }

    .item span {
        border: 1px solid #fff;
        padding: 5px 15px 5px 15px;
        border-radius: 5px;
        font-size: 20px;
        color: #9fa3a7;
    }

    @media (max-width: 767px) {
        .tile {
            min-height: 100px;
            width: 100px;
        }

        .card.hovercard .cardheader .name {
            display: none;
        }

        .card.hovercard .cardheader .subscribe-area .circle-btn {
            display: none;
        }
    }

    .card {
        padding-top: 20px;
        background-color: rgba(214,224,226,.2);
        border-top-width: 0;
        border-bottom-width: 2px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

        .card.hovercard {
            position: relative;
            padding-top: 0;
            overflow: hidden;
            text-align: center;
            background-color: #252525;
        }

            .card.hovercard .cardheader {
                background: url("http://lorempixel.com/850/280/nature/4/");
                background-size: cover;
                height: 250px;
            }

                .card.hovercard .cardheader .hr-line {
                    border: none;
                    height: 1px;
                    /* Set the hr color */
                    color: #ffffff; /* old IE */
                    background-color: #ffffff;
                    margin-top: 0px;
                }

                .card.hovercard .cardheader .name {
                    margin-left: -300px;
                    color: #ffffff;
                    font-size: 15px;
                    margin-top: -10px;
                }

                .card.hovercard .cardheader .subscribe-area {
                    color: #ffffff;
                    padding: 20px;
                }

                    .card.hovercard .cardheader .subscribe-area .subscribe {
                        border: 1px solid #ffffff;
                        border-radius: 10px;
                        margin-left: 10px;
                        padding: 10px;
                    }

                    .card.hovercard .cardheader .subscribe-area .circle-btn {
                        border: 1px solid #ffffff;
                        border-radius: 50%;
                        padding: 10px 2px 10px 10px;
                        text-align: center;
                        margin-left: 10px;
                    }

        .card .cardheader img {
            height: 100%;
            width: 100%;
            object-fit: cover;
        }

        .card.hovercard .cardheader .avatar {
            position: relative;
            margin-top: -115px;
            margin-bottom: -50px;
            object-fit: cover;
        }

            .card.hovercard .cardheader .avatar img {
                width: 150px;
                height: 150px;
                max-width: 150px;
                max-height: 150px;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                border: 5px solid #f9f9f9;
            }

        .card.hovercard .info {
            padding: 4px 8px 10px;
            margin-top: 100px;
        }
        .big-image {
            width: 250px;
            height: 250px;
            max-width: 250px;
            max-height: 250px;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            border: 5px solid #f9f9f9;
        }

    .info {
        margin-top: 20px;
    }

    .card.hovercard .info .title {
        margin-bottom: 4px;
        font-size: 50px;
        line-height: 1;
        color: #ffffff;
        vertical-align: middle;
    }

    .card.hovercard .info .desc-about {
        overflow: hidden;
        margin-top: 30px;
        font-size: 20px;
        line-height: 20px;
        color: #ffffff;
        text-overflow: ellipsis;
        width: 30%;
        position: relative;
        left: 35%;
    }

    .card.hovercard .info .location {
        margin-top: 20px;
        color: #f9f9f9;
    }

    .card.hovercard .info .desc-friends {
        margin-top: 20px;
        font-size: 25px;
        line-height: 20px;
        color: #737373;
        text-overflow: ellipsis;
    }

    .card.hovercard .info .desc-role {
        font-size: 20px;
        line-height: 30px;
        margin-top: 40px;
        margin-bottom: 20px;
        color: #f9f9f9;
        text-overflow: ellipsis;
    }

    .card.hovercard .info .desc-friends span {
        margin-right: 20px;
    }

    .edit-icon {
        border: 1px solid #ff9601;
        width: 50px;
        height: 50px;
        background: #ff9601;
        border-radius: 21px;
        color: #fff;
        font-size: 3px;
        padding: 10px;
        float: right;
        margin: 5px;
    }

    .notification-icon {
        background: white;
    }

    .edit-btn {
        border: 1px solid;
        font-weight: bolder;
        border-radius: 20px;
        font-size: 20px;
        padding: 10px;
        color: #fff;
    }

    .usr-profile-image img {
        border-radius: 50%;
        width: auto;
        min-height: 135px;
        max-height: 135px;
        max-width: 100%;
    }

    .usr-profile-image {
        display: inline-block;
        width: 135px;
        position: relative;
        margin-bottom: 30px;
    }

        .usr-profile-image input {
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            opacity: 0;
            z-index: 9;
        }

    .userbutton {
        background-color: transparent;
        border-radius: 50px;
        border: 1px solid #f9f9f9;
        display: inline-block;
        cursor: pointer;
        color: #f9f9f9;
        font-family: Arial;
        font-size: 22px;
        font-weight: normal;
        padding: 2px 8px;
        text-decoration: none;
    }

    .Subscribebutton:hover {
        background-color: transparent;
    }

    .Subscribebutton:active {
        position: relative;
        top: 1px;
    }

    .unSubscribebutton:hover {
        background-color: transparent;
    }

    .unSubscribebutton:active {
        position: relative;
        top: 1px;
    }

    .Friendbutton:hover {
        background-color: transparent;
    }

    .Friendbutton:active {
        position: relative;
        top: 1px;
    }

    .Chatbutton:hover {
        background-color: transparent;
    }

    .Chatbutton:active {
        position: relative;
        top: 1px;
    }

    div.text-right.edit-profile-links {
        position: absolute;
        padding-right: 0px;
        margin-top:20px;
        right: 0;
        /* z-index: 2; */
    }
    div.text-left.edit-profile-links {
        position: absolute;
        padding-left: 15px;
        margin-top: 20px;
        left: 0;
        /* z-index: 2; */
    }

        div.text-right.edit-profile-links a {
            font-size: 25px;
            color: #f9f9f9;
        }
        .overflow-icon {
            color: #fff;
            font-size: 25px;
        }
</style>