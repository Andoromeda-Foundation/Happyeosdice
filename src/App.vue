<template>
  <div id="app">
    <bet-menu :refCode="refCode"></bet-menu>
    <bet-game v-on:update-ref="updateRef"></bet-game>
    <!-- <bet-log></bet-log> -->
  </div>
</template>

<script>
import menu from './components/menu.vue';
import game from './components/game.vue';
import log from './components/log.vue';

export default {
  components: {
    'bet-menu': menu,
    'bet-game': game,
    'bet-log': log,
  },
  data() {
      return {
        refCode: '',
      };
    },
  methods: {
    updateRef(refCode) {
      this.refCode = refCode;
    }
  }
}
</script>

<style>
#app {
  font-family: Poppins, sans-serif;
}
</style>
