<template>
  <div class="login" :class="loginClass">
    <h1 class="login__title">Tic tac toe online</h1>
    <input
      type="text"
      class="login__input"
      placeholder="nickname"
      :class="inputClass"
      @input="onInput"
    />
    <div class="login__confirm-button" @click="onConfirmButtonClick">
      let's fuck!
    </div>
    <div class="login__faq" @click="playGachiSound">FAQ</div>
  </div>
</template>

<script>
import fuckYou from '../assets/fuckYou.mp3'
import { ref, computed } from 'vue'

const fuckYouAudio = new Audio(fuckYou)

export default {
  name: 'Login',
  setup(props, context) {
    function playGachiSound() {
      fuckYouAudio.play()
    }

    const nickname = ref('')
    const isNicknameValid = ref(true)
    const isClosing = ref(false)
    const inputClass = computed(() => {
      return 'login__input_' + (isNicknameValid.value ? 'correct' : 'incorrect')
    })
    const loginClass = computed(() => {
      if (isClosing.value) return 'login_invisible'
      else return ''
    })

    function onInput(event) {
      console.log('input')
      let val = event.target.value
      if (val.trim() == '') isNicknameValid.value = false
      else isNicknameValid.value = true
      if (val.length > 20) event.preventDefault()
      else nickname.value = val
    }

    function onConfirmButtonClick() {
      if (isNicknameValid.value) {
        context.emit('nickname-choosen', nickname.value)
        isClosing.value = true
      }
    }

    return {
      playGachiSound,
      nickname,
      isClosing,
      inputClass,
      loginClass,
      isNicknameValid,
      onInput,
      onConfirmButtonClick,
    }
  },
}
</script>

<style lang="scss">
@import '../css/variables.scss';

.login {
  width: 100%;
  max-width: 400px;
  align-self: center;
  text-align: center;

  &_invisible {
    opacity: 0;
    transition: 0.3s;
    transform: scale(0.9);
  }

  &__title {
    font-size: 72px;
    font-weight: 400;
    margin-bottom: 80px;
    margin-top: 0;
    letter-spacing: -2px;
  }

  &__input {
    font-size: 20px;
    height: $control-height;
    background: white;
    outline: none;
    border: 2px solid $blue;
    border-radius: $control-border-radius;
    padding: 0 24px;
    width: calc(100% - 52px);
    margin-bottom: 20px;

    &_incorrect {
      border: 2px solid $red !important;
      transition: 0.3s;
    }
    &_correct {
      border: 2px solid $blue !important;
      transition: 0.3s;
    }
  }

  &__confirm-button {
    border-radius: $control-border-radius;
    border: 2px solid $blue;
    line-height: $control-height;
    font-size: 20px;
    background: $blue;
    cursor: pointer;
    color: white;
    margin-bottom: 40px;
  }

  &__faq {
    color: gray;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
