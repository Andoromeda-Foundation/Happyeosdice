<template>
<div id="menu">
    <div id="logo-container">
    <img src="../assets/logo.png" id="logo">
    </div>
    <div id="menu-container">
    <div id="menu-left-container">
        <el-button type="text" class="menu-item" @click="showFairInfo = !showFairInfo">{{$t('FAIRNESS')}}</el-button>
        <el-button type="text" class="menu-item" @click="showCommunityInfo = !showCommunityInfo">{{$t('COMMUNITY')}}</el-button>
    </div>
    <div id="menu-right-container">
        <!-- <el-button type="text" class="menu-item" @click="changeNetwork()">{{network}}</el-button> -->
        <img src="../assets/flag-ch.jpg" class="lang-icon menu-item" @click="changeLang" v-if="lang === 'ch'">
        <img src="../assets/flag-en.jpg" class="lang-icon menu-item" @click="changeLang" v-else>
        <el-button type="text" class="menu-item" @click="showReferralsInfo = !showReferralsInfo">{{$t('REFERRALS')}}</el-button>
        <el-button type="text" class="menu-item" @click="showHowInfo = !showHowInfo">{{$t('HOW TO PLAY')}}</el-button>
    </div>
    </div>
    <!-- 弹出 -->
      <el-dialog
        :title="$t('Provably Fair Betting')"
        :visible.sync="showFairInfo"
        width="30%"
        center>
        <el-input v-model="seed" :placeholder="$t('Enter Your Custom Seed')" style="width: 300px;"></el-input>
        <el-button type="primary" @click="update()">{{$t('Update')}}</el-button>
        <p>{{$t('fair-1')}}</p>
        <p>{{$t('fair-2')}}</p>
        <p>{{$t('fair-3')}}</p>
      </el-dialog>

      <el-dialog
        :title="$t('Join the Happy Community')"
        :visible.sync="showCommunityInfo"
        width="30%"
        center>
        <a href="https://t.me/joinchat/HnyfLA9DC8cNmr6RP0tE7Q" target="_blank">https://t.me/joinchat/HnyfLA9DC8cNmr6RP0tE7Q</a>
      </el-dialog>

      <el-dialog
        :title="$t('Get Rewarded With Referrals')"
        :visible.sync="showReferralsInfo"
        width="30%"
        center>
        <el-input :value="refUrl" style="width: 300px;" :disabled="true"></el-input>
        <el-button type="primary" @click="copy" class="copy-btn" :data-clipboard-text="refUrl">{{$t('Copy')}}</el-button>
        <p>{{$t('referrals-1')}}</p>
      </el-dialog>

      <el-dialog
        :title="$t('How To Play')"
        :visible.sync="showHowInfo"
        width="30%"
        center>
        <p>1. {{$t('how-1')}} <a href="https://www.mytokenpocket.vip/how-to-create-eos-account-by-friend/index.html?from=groupmessage&isappinstalled=0" target="_blank">Click</a></p>
        <p>2. {{$t('how-2')}} <a href="https://get-scatter.com/" target="_blank">Scatter</a></p>
        <p>3. {{$t('how-3')}}</p>
        <p>4. {{$t('how-4')}}</p>
        <p>5. {{$t('how-5')}}</p>
        <p>6. {{$t('how-6')}}</p>
        <p>7. {{$t('how-7')}}</p>
        <p>{{$t('how-8')}}</p>
        <p>{{$t('how-9')}}</p>
      </el-dialog>
</div>
</template>

<script>
import Chance from 'chance';
import Clipboard from 'clipboard';

export default {
  props: ['refCode'],
  data() {
      return {
        network: localStorage.getItem('network'),
        seed: localStorage.getItem('seed'),
        lang: localStorage.getItem('lang') || 'ch',
        showFairInfo: false,
        showCommunityInfo: false,
        showReferralsInfo: false,
        showHowInfo: false,
      };
    },
  computed: {
    refUrl: function() {
      return `${window.location.origin}?ref=${this.refCode}`;
    }
  },
  methods: {
    changeNetwork() {
      const newNetwork = this.network === 'kylin' ? 'mainnet' : 'kylin';
      localStorage.setItem('network', newNetwork);
      location.reload();
    },
    changeLang() {
      this.lang = this.lang === 'ch' ? 'en' : 'ch';
      localStorage.setItem('lang', this.lang);
      this.$i18n.locale = this.lang;
    },
    copy() {
      const clipboard = new Clipboard('.copy-btn');
    },
    update() {
      if (!this.seed) {
        this.$notify.error({
          title: this.$t('Update seed fail'),
        });

      } else {
        localStorage.setItem('seed', this.seed);
        this.$notify({
          title: this.$t('Update seed success'),
          type: 'success',
        });
      }
    }
  }
}
</script>

<style>
#menu {
  height: 60px;
  background-color: #3f3e3e;
  padding: 8px 16px;
  display: flex;
}
#logo-container {
  height: 100%;
  display: inline-flex;
  align-items: center;
  margin-left: 16px;
  margin-right: 16px;
}
#logo {
  height: 50px;
}
.menu-item {
  color: white;
  padding: 6px 12px;
}
#menu-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
#menu-left-container {
  height: 100%;
  display: inline-flex;
  align-items: center;
}
#menu-right-container {
  height: 100%;
  display: inline-flex;
  align-items: center;
}
.lang-icon {
  height: 16px;
}
</style>
