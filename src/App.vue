<template>
  <div id="app">
    <transition name="fade">
      <router-view class="wrapper"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
};
</script>
