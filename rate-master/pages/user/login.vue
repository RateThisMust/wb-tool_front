<template>
  
    <div class="md:container md:mx-auto h-full">

      <div class="flex flex-col items-center h-full justify-center gap-6 px-4 md:px-0">
        <div class="title-login text-3xl md:text-4xl">
          Добро пожаловать!<br>
          Вас приветсвует компания RATE-THIS
        </div>

        <template v-if="!mode">
          <div class="w-full max-w-xl">
            <button class="w-full py-4 md:py-10 px-4 md:px-16 teal lighten-2 text-2xl md:text-4xl font-bold text-gray-800 rounded" @click="mode='phone'">Войти по номеру телефона</button>
          </div>

          <template v-if="false">
            <div>
              или
            </div>
            <div class="w-full max-w-xl">
              <button class="w-full py-4 md:py-10 px-4 md:px-16 cyan accent-3 text-2xl md:text-4xl font-bold text-gray-800 rounded" >Войти через Телеграмм</button>
            </div>
          </template>

          <div>
            <a href="#" class="" @click="mode='phone'"><span class="text-xl">Регистрация</span></a>
          </div>

        </template>

        <template v-if="mode == 'phone'">
          <div class="w-full max-w-xl">
            <div class="flex gap-4 items-center justify-center flex-col md:flex-row">
              <template v-if="step == 1">
                <div class="w-full md:w-auto">
                  <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="mode=''">Назад</button>
                </div>
                <div class="w-full">
                  <input type="text" class="bg-white p-4 text-black rounded text-lg w-full text-center md:text-left" placeholder="Введите телефон" v-mask="'+7 (###) ###-##-##'" v-model="phone" inputmode="numeric">
                </div>
                <div class="w-full">
                  <button 
                    class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full"
                    @click="sendCode"
                    :disabled="sendCodeDisabled"
                  >
                    <template v-if="sendCodeDisabled">
                      {{timer}} сек
                    </template>
                    <template v-else>
                      Sign in
                    </template>
                  </button>
                </div>
              </template>
              <template v-if="step == 2">
                <div class="w-full md:w-auto">
                  <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="step=1">Назад</button>
                </div>
                <div class="w-full">
                  <input type="text" class="bg-white p-4 text-black rounded text-lg w-full text-center md:text-left" placeholder="Введите телефон" v-mask="'+7 (###) ###-##-##'" v-model="phone" readonly inputmode="numeric">
                </div>
                <div class="w-full">
                  <input type="text" class="bg-white p-4 text-black rounded text-lg w-full text-center md:text-left" placeholder="Введите код из sms" v-model="code" inputmode="numeric">
                </div>



              </template>
            </div>
            <template v-if="mode == 'phone' && step == 2">
                <div class="flex gap-4 mt-5 justify-center">
                  <div v-if="timer > 0">
                    Не приходит смс. Повторная отправка через {{timer}} сек
                  </div>
                  <div v-if="timer <= 0">
                    <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="sendCode">Отправить</button>
                  </div>
                </div>
            </template>
          </div>
        </template>
      </div>

<!--       <script async src="https://telegram.org/js/telegram-widget.js?19" data-telegram-login="RateDev5Bot" data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></script> -->
    </div>

</template>

<script>

import { mapState } from "vuex";

export default {
  layout: 'login',
  data() {
    return {
      user: {},
      mode: '',
      phone: '',
      step: 1,
      code: '',
      sendCodeDisabled: false,
      timeInterval: false,
      timer: 0
    }
  },
  computed: {
    ...mapState('request', [
      'timeIsOut'
    ]),
  },
  watch: {
    user: function(val) {
      
    },
    code: function(val) {
      if ( val.length == 5 ) {
        this.checkCode(val)
      }
    },
    timeIsOut: function(val){
      window.console.log(val)
      if ( val > 0 ) {
        this.setTimer()
      }
    }
  },
  methods: {
    setTimer() {
      this.timer = this.timeIsOut - Date.now()
      window.console.log(this.timer)
      if ( this.timer > 0 ) {
        clearInterval(this.timeInterval)
        this.timeInterval = setInterval( () => {
          this.timer = this.timer - 1
          if ( this.timer < 0 ) {
            clearInterval(this.timeInterval)
            this.sendCodeDisabled = false
          }
          
        }, 1000)
      }
    },
    onTelegramAuth (user) {
      window.console.log(user)
    },
    sendCode() {
      if( this.phone.search(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/) == -1 ) {
        this.phone = ''
        this.$toast.warning('Телефон не валидный');
        return false
      }

      this.$store.dispatch('request/sms_send', {action: 'send', phone: this.phone}).then((x) => {
          if ( !x.data.error ) {
            this.step = 2

            this.sendCodeDisabled = true

            let timeIsOut = Date.now() + 60
            this.$store.dispatch('request/set_timeisout', timeIsOut)
            window.localStorage.setItem("timeIsOut", timeIsOut)

          } else {
              this.$toast.error(x.data.error)
          }
      })
    },
    checkCode(code) {
      this.$store.dispatch('request/sms_check', {action: 'check', phone: this.phone, code: code}).then((x) => {
          if ( !x.data.error ) {
            this.step = 2

            if (x.data.data.access_token) {
              this.$auth.setUserToken('Bearer ' + x.data.data.access_token)
              this.$store.dispatch('request/auth_user').then((resp) => {
                  this.$router.push('/user')
              })
            }

          } else {
              this.$toast.error(x.data.error)
          }
      })
    },
  },
  mounted() {
    let timeIsOut = window.localStorage.getItem("timeIsOut")
    if (!timeIsOut) timeIsOut = 0
    this.$store.dispatch('request/set_timeisout', timeIsOut)
  }
}
</script>