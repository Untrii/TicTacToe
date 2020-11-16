<template>
  <div class="game-result">
    <div class="game-result__caption">{{ caption }}</div>
    <div class="game-result__button" @click="onButtonClick">
      go back to lobby
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '../store'
export default {
  name: 'GameResult',
  setup() {
    const caption = computed(() => {
      switch (store.gameResult) {
        case 'X':
          return 'Cross wins'
        case 'O':
          return 'Circle wins'
        case 'T':
          return 'Tie'
      }
    })

    function onButtonClick() {
      store.isGameEndScreenShown = false
    }

    return { caption, onButtonClick }
  },
}
</script>

<style lang="scss">
@import '../css/variables.scss';
.game-result {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100vh;
  text-align: center;
  width: 400px;

  &__caption {
    font-size: 80px;
  }
  &__button {
    border-radius: $control-border-radius;
    border: 2px solid $blue;
    line-height: $control-height;
    font-size: 20px;
    background: $blue;
    cursor: pointer;
    color: white;
  }
}
</style>
