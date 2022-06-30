<template>
  <twemoji-picker
    :emojiData="emojiDataAll"
    :emojiGroups="emojiGroups"
    :skinsSelection="false"
    :searchEmojisFeat="true"
    searchEmojiPlaceholder="Search here."
    searchEmojiNotFound="Emojis not found."
    isLoadingLabel="Loading..."
    @emojiUnicodeAdded="emojiUnicodeAdded"
  ></twemoji-picker>
</template>
<style scoped>
#btn-emoji-default {
  width: 1vw;
  height: 100%;
}
</style>
<script>
import { TwemojiPicker } from "@kevinfaguiar/vue-twemoji-picker";
import EmojiAllData from "@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json";
import EmojiGroups from "@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json";
export default {
  name: "App",
  components: {
    "twemoji-picker": TwemojiPicker,
  },
  computed: {
    emojiDataAll() {
      return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    },
  },
  methods: {
    emojiUnicodeAdded(data) {
      this.$emit("onEmojiInserted", data);
    },
  },
};
</script>