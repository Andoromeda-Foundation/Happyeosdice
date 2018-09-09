<template>
    <div id="game">
        <div id="game-container">
            <!-- 第一行 -->
            <el-row style="padding: 20px;" :gutter="20">
                <el-col :span="14">
                    <div class="tip-text">{{$t('BET AMOUNT')}}</div>
                    <div class="bet-amount-container">
                        <el-row class="bet-amount">
                            <el-col :span="12" class="amount">
                                <img class="navbar-coin" src="../assets/eos-logo.png">
                                <span class="display-text" style="margin-left: 30px;">
                                  <el-input v-model.number="betAmount" class="bet-amount-input" @change="changeBetAmount"></el-input>
                                </span>
                            </el-col>
                            <el-col :span="4" class="amount-button tip-text">
                                <span @click="amountTimes(0.5)">1/2</span>
                            </el-col>
                            <el-col :span="4" class="amount-button tip-text">
                                <span @click="amountTimes(2)">2X</span>
                            </el-col>
                            <el-col :span="4" class="amount-button tip-text">
                                <span @click="amountMax()">MAX</span>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="10">
                    <div class="tip-text">{{$t('PAYOUT ON WIN')}}</div>
                    <div class="payout-on-win-container">
                        <img class="navbar-coin" src="../assets/eos-logo.png">
                        <span class="display-text">{{payOnWin}}</span>
                    </div>
                </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row class="choose-info" :gutter="20">
                <el-col :span="6" :offset="6" >
                  <el-badge is-dot style="width: 100%" :hidden="choose != 'small'">
                    <div :class="['choose-info-section', choose === 'small' ? 'choose-text' : 'big-display-text']" @click="choose = 'small'">{{$t('Small')}}</div>
                  </el-badge>
                </el-col>
                <el-col :span="6">
                  <el-badge is-dot style="width: 100%" :hidden="choose != 'big'">
                    <div :class="['choose-info-section', choose === 'big' ? 'choose-text' : 'big-display-text']" @click="choose = 'big'">{{$t('Big')}}</div>
                  </el-badge>
                </el-col>
            </el-row>

            <!-- 第三行 -->
            <el-row class="roll-info">
                <el-col :span="8" class="roll-info-section">
                    <div class="tip-text" v-if="choose === 'small'">{{$t('ROLL UNDER TO WIN')}}</div>
                    <div class="tip-text" v-else>{{$t('ROLL OVER TO WIN')}}</div>
                    <div class="big-display-text">{{range}}{{choose === 'small' ? '↓' : '↑'}}</div>
                </el-col>
                <el-col :span="8" class="roll-info-section">
                    <div class="tip-text">{{$t('PAYOUT')}}</div>
                    <div class="big-display-text">{{payout}} x</div>
                </el-col>
                <el-col :span="8" class="roll-info-section">
                    <div class="tip-text">{{$t('WIN CHANCE')}}</div>
                    <div class="big-display-text">{{choose === 'small' ? range : 99 - range}} %</div>
                </el-col>
            </el-row>

            <!-- 第四行 -->
            <el-row class="account-info">
                <el-col :span="8" class="account-info-section">
                    <div class="account-container">
                        <img class="navbar-coin" src="../assets/eos-logo.png">
                        <span class="display-text">{{balance}}</span>
                    </div>
                </el-col>
                <el-col :span="8" class="account-info-section">
                  <el-button type="primary" id="login-button" @click="initScatter()" v-if="!account">{{$t('LOGIN')}}</el-button>
                  <el-button type="primary" id="login-button" @click="roll()" v-else v-loading="loading">{{$t('ROLL DICE')}}</el-button>
                </el-col>
                <el-col :span="8" class="account-info-section">
                    <div class="account-container">
                        <img class="navbar-coin" src="../assets/HPY_Token.png">
                        <span class="display-text">{{hpyBalance}}</span>
                        <i class="el-icon-question" @click="showBetInfo = !showBetInfo" style="cursor: pointer;"></i>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div id="slider-wrapper">
            <span>0</span>
            <el-slider v-model="range" id="range" :min="0" :max="99"></el-slider>
            <span>99</span>
        </div>

        <!-- 弹出 -->
        <el-dialog
          :title="$t('HPY Token Giveaway!')"
          :visible.sync="showBetInfo"
          width="30%"
          center>
          <img src="../assets/HPY_Token.png" style="width: 40%; display: block; margin: auto;">
          <p>{{$t('bet-1')}}</p>
          <p>{{$t('bet-2')}} <a href="https://happyeosslot.com/" target="_blank">https://happyeosslot.com/</a></p>
          <p>{{$t('bet-3')}}</p>
        </el-dialog>
    </div>
</template>

<script>
import Eos from 'eosjs';

export default {
    data() {
      return {
        range: 50,
        betAmount: 1,
        balance: 0,
        hpyBalance: 0,
        showBetInfo: false,
        account: null,
        eos: null,
        loading: false,
        network: localStorage.getItem('network'),
        choose: 'small',
      };
    },
    computed: {
      payOnWin: function() {
        return Math.floor(98 / this.range * this.betAmount * 10000) / 10000;
      },
      payout: function() {
        if (this.choose === 'small') {
          return Math.floor(98 / this.range * 10000) / 10000;
        } else {
          return Math.floor(98 / (99 - this.range) * 10000) / 10000;
        }
      }
    },
    watch: {
      range(newRange, oldRange) {
        if(newRange < 6) {
          this.range = 6;
        } else if(newRange > 93) {
          this.range = 93;
        }
      }
    },
    methods: {
      amountTimes(data) {
        this.betAmount = this.betAmount * data;
        if(this.betAmount > this.balance) {
          this.betAmount = this.balance;
        }
      },
      amountMax() {
        this.betAmount = this.balance;
      },
      changeBetAmount(data) {
        this.betAmount = Math.floor(this.betAmount * 10000) / 10000;
        // 不再检查输入数值是否小于余额
        // if(data > this.balance) {
        //   this.betAmount = this.balance;
        // }
      },
      isPc() {
          //移动端PC端判断
          return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? false : true;
      },
      initScatter: function () {
          if (this.isPc()) {
              if (!('scatter' in window)) {
                  alert("没有找到Scatter.");
              } else {
                scatter.getIdentity({
                      accounts: [{
                          chainId: window.data.config.networks[this.network].chainId,
                          blockchain: window.data.config.networks[this.network].blockchain,
                      }],
                    })
                    .then(identity => {
                      this.setIdentity(identity);
                    })
                    .catch(err => {
                      console.error(err);
                      alert("Scatter 初始化失败.");
                    });
              }
          }
      },
      setIdentity: function (identity) {
        this.account = identity.accounts.find(acc => acc.blockchain === 'eos');
        this.$emit('update-ref', this.account.name);
        this.eos = scatter.eos(window.data.config.networks[this.network], Eos, {});
        this.get_user_balance();
        this.get_bet_balance();
      },
      get_bet_balance: function () {
        this.eos.getCurrencyBalance('happyeosslot', this.account.name).then((result) => {
          if(!result[0]) {
            this.hpyBalance = 0;
          } else {
            this.hpyBalance = parseFloat(result[0].split(' ', 1)[0]).toFixed(4);
          }
        });
        },
      get_user_balance: function () {
        this.eos.getCurrencyBalance('eosio.token', this.account.name).then((result) => {
          if(!result[0]) {
            this.balance = 0;
          } else {
            this.balance = parseFloat(result[0].split(' ', 1)[0]).toFixed(4);
          }
        });
        },
      getQueryString: function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]);
        return null;
      },
      roll: function() {
        const seed = localStorage.getItem('seed');
        this.loading = true;
        const ref = this.getQueryString('ref');
        let memo = `bet ${this.choose === 'small' ? this.range + 100 : this.range} ${seed}`;
        if (ref) {
          memo += ` ${ref}`;
        }
        this.eos.transfer(this.account.name, "happyeosdice", `${this.betAmount.toFixed(4)} EOS`, memo)
          .then(() => {
            // 轮询查找结果
            const r = setInterval(() => {
              this.eos.getTableRows(true, "happyeosdice", this.account.name, "result", "0").then((data) => {
                const ans = data.rows[0].roll_number;
                // roll点值为0-99
                if (ans < 100) {
                  clearInterval(r);
                  this.loading = false;
                  if ((this.choose === 'small' && ans < this.range) || (this.choose === 'big' && ans > this.range)) {
                    this.roll_success(ans);
                  } else {
                    this.roll_fail(ans);
                  }
                }
              });
            }, 1000);
          }).catch((err) => {
            console.error(err);
            alert('项目出错了，快联系开发者！');
          });
      },
      roll_success: function(ans) {
        this.$notify({
          title: this.$t('Congratulations!'),
          message: this.$t('success_message', [ans, this.payout * this.betAmount]),
          type: 'success',
        });
        this.get_bet_balance();
        this.get_user_balance();
      },
      roll_fail: function(ans) {
        this.$notify.error({
          title: this.$t('You fail'),
          message: this.$t('fail_message', [ans, this.payout * this.betAmount]),
        });
        this.get_bet_balance();
        this.get_user_balance();
      }
    }
}
</script>

<style>
#game {
  background: url("../assets/background_2.png");
  background-size: 100%;
  background-repeat: repeat repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-weight: 600;
  letter-spacing: 0.5px;
}
#game-container {
  width: 655px;
  height: 386px;
  margin: 60px auto 20px auto;
  font-size: 18px;
  border-radius: 5px;
  background-color: #4b4848;
  align-items: center;
}
#slider-wrapper {
  padding: 10px;
  background-color: #4b484888;
  border-radius: 30px;
  align-items: center;
  width: 655px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  color: white;
  justify-content: space-between;
}
#range {
  width: 90%;
}
.display-text {
  color: white;
}
.big-display-text {
  color: white;
  font-size: 1.2em;
}
.tip-text {
  font-weight: 600;
  font-size: 0.6em;
  margin-bottom: 0.75em;
  text-transform: uppercase;
  color: #9b9fae;
}
.bet-amount-container {
  background-color: #3f3e3e;
  height: 43px;
  border-radius: 0.3em;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bet-amount {
  width: 100%;
  height: 100%;
  display: flex;
}
.bet-amount .amount {
  background-color: #4b4848;
  display: flex;
  align-items: center;
  border-radius: 0.3em;
}
.bet-amount .amount-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
}
.navbar-coin {
  height: 22px;
  margin-left: 10px;
  vertical-align: middle;
}
.payout-on-win-container {
  background-color: #3f3e3e;
  height: 43px;
  border-radius: 0.3em;
  padding: 4px;
  display: flex;
  align-items: center;
}
.payout-on-win-container span {
  display: block;
  width: 100%;
  text-align: center;
}
.roll-info {
  background-color: #3f3e3e;
  border-radius: 0.3em;
  height: 87px;
  margin: 0 20px;
}
.roll-info-section {
  text-align: center;
  padding: 10px;
}
.choose-info {
  margin-bottom: 20px;
}
.choose-info-section {
  background-color: #3f3e3e;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3em;
  padding: 4px;
}
.account-info {
  height: 87px;
  margin: 0 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
}
.account-container {
  display: flex;
  align-items: center;
}
.account-container span {
  display: block;
  width: 100%;
  text-align: center;
}
#login-button {
  width: 80%;
  display: block;
  margin: auto;
}
.middle-hr {
  background: #0000003f;
  border: none;
  width: 2px;
  height: 55px;
}
.bet-amount-input input {
  background-color: #4b4848;
  border: 0;
  color: white;
  font-size: 1.2em;
}
.choose-text {
  color: #02f292;
  font-size: 1.2em;
}
</style>
