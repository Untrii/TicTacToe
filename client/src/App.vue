<template>
  <login
    v-if="store.openedPage == 'login'"
    @nickname-choosen="onNicknameChoosen"
  >
  </login>
  <game-result v-else-if="store.isGameEndScreenShown"></game-result>
  <lobby v-else-if="store.openedPage == 'lobby'"></lobby>
  <game v-else-if="store.openedPage == 'game'"></game>
</template>

<script>
import Login from './components/Login.vue'
import Lobby from './components/Lobby.vue'
import Game from './components/Game.vue'
import GameResult from './components/GameResult.vue'
import { ref } from 'vue'
import * as actions from './actions'
import store from './store'

export default {
  name: 'App',
  components: {
    Login,
    Lobby,
    Game,
    GameResult,
  },
  setup() {
    const pageName = ref('login')

    function onNicknameChoosen(nickname) {
      console.log('setting nickname')
      actions.setNickname(nickname)
    }

    return { onNicknameChoosen, store }
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
body {
  user-select: none;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-family: 'Nunito', sans-serif;
  color: #212529;
}
</style>
