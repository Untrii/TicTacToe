<template>
  <div class="lobby">
    <div
      class="lobby__user"
      v-for="user in store.lobby"
      :key="user.rid"
      :class="{ lobby__user_dark: user.inviteFor == store.rid }"
    >
      <div class="lobby__user-name">
        {{ user.nickname }}
      </div>
      <div
        v-if="!store.isRequestSent || store.requestTarget == user.rid"
        class="lobby__invite-button"
        @click="invite(user.rid)"
        :class="{
          'lobby__invite-button_visible': user.inviteFor == store.rid,
        }"
      >
        {{ getInviteButtonText(user) }}
      </div>
    </div>
    <div class="lobby__user" v-if="store.lobby.length == 0">
      <div class="lobby__user-name" style="color:gray">
        sorry, but there is nobody online...
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'
import * as actions from '../actions'
export default {
  name: 'Lobby',
  setup() {
    function invite(rid) {
      actions.sendRequest(rid)
    }

    function getInviteButtonText(user) {
      if (user.inviteFor == store.rid) return 'accept'
      else if (user.rid == store.requestTarget) return 'cancel invite'
      else return 'invite'
    }

    return { store, invite, getInviteButtonText }
  },
}
</script>

<style lang="scss">
@import '../css/variables.scss';
.lobby {
  align-self: center;
  width: 100%;
  max-width: 960px;
  height: 100vh;
  box-shadow: 0px 0px 20px gray;
  outline: 4px solid $blue;

  &__user {
    width: 100%;
    display: inline-grid;
    height: 80px;
    line-height: 80px;
    font-size: 20px;
    grid-template-columns: 1fr max-content;
    &:hover {
      background: rgba($color: $blue, $alpha: 0.1);
      transition: 0.2s;
    }
    &:not(:hover) {
      background: white;
      transition: 0.2s;
    }

    &_dark {
      background: rgba($color: $blue, $alpha: 0.9) !important;
      color: white !important;
    }
  }

  &__user-name {
    padding: 0 40px;
  }

  &__invite-button_visible {
    opacity: 1;
  }

  &__invite-button {
    opacity: 0;
    padding: 0 40px;
    cursor: pointer;
  }
  &__user:hover &__invite-button {
    opacity: 1;
    transition: 0.2s;
  }
  &__user:not(:hover) &__invite-button {
    opacity: 0;
    transition: 0.2s;
  }
}
</style>
