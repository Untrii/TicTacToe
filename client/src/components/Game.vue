<template>
  <div class="game">
    <div class="game__caption">You're playing as {{ store.gameSide }}.</div>
    <div class="game__field">
      <div
        class="game__cell"
        v-for="(cell, index) in store.gameState"
        @click="onFieldClick(index)"
        :key="index"
      >
        <img :src="circleImage" v-if="cell == 'O'" />
        <img :src="crossImage" v-if="cell == 'X'" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import store from '../store'
import * as actions from '../actions'
import circleImage from '../assets/circle.png'
import crossImage from '../assets/cross.png'
export default {
  name: 'Game',
  setup() {
    const field = ref(['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'])

    function onFieldClick(index) {
      console.log('turn made:' + index)
      actions.makeTurn(index)
    }

    return { store, onFieldClick, circleImage, crossImage }
  },
}
</script>

<style lang="scss">
.game {
  width: 80vw;
  max-width: 80vh;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;

  &__caption {
    text-align: center;
    font-size: 32px;
    width: 100%;
  }

  &__field {
    background: #212529;
    outline: 5px solid #212529;
    width: 80vw;
    max-width: 80vh;
    height: 80vw;
    max-height: 80vh;
    display: inline-grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
  }

  &__cell {
    border: 5px solid #212529;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-around;
    img {
      width: 80%;
      height: 80%;
    }
  }
}
</style>
