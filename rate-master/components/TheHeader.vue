<template>
    <div class="bg-white">
        <div class="md:container md:mx-auto">
            <div class="md:px-2.5 md:py-7 px-2.5 py-4">
                <div class="md:flex md:items-center md:justify-between">
                    <div class="relative z-10">
                        <div class="header-title"><a href="/">RATE THIS PROMOTION</a></div>

                        <div class="md:pt-7">
                            <input id="burger" type="checkbox" name="burger" v-model="burger"/>
                            <label class="burger" for="burger">
                                <span class="burger__bar"></span>
                            </label>
                            <div class="menu" >
                                <ul class="menu__items" @click="burger=false">
                                    <li class="menu__item">
                                        <NuxtLink to="/" class="menu__link" exact-active-class="menu__link_active">Главная</NuxtLink>
                                    </li>
                                    <li class="menu__item">
                                        <NuxtLink to="/buyout" class="menu__link" exact-active-class="menu__link_active">Выкупы</NuxtLink>
                                    </li>
                                    <li class="menu__item">
                                        <NuxtLink to="/delivery" class="menu__link" exact-active-class="menu__link_active">Доставки</NuxtLink>
                                    </li>
                                    <li class="menu__item">
                                      <NuxtLink to="/reviews" class="menu__link" exact-active-class="menu__link_active">Отзывы</NuxtLink>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#" class="menu__link ">Накрутки</a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#" class="menu__link ">Позиции товара</a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#" class="menu__link ">Отчеты</a>
                                    </li>
                                    <li class="menu__item">
                                        <a href="#" class="menu__link">Услуги</a>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <v-menu offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              text
                              v-bind="attrs"
                              v-on="on"
                              class="w-full md:w-auto "
                            >
                                <v-icon small>mdi-account</v-icon>
                                <span class="truncate w-64" >{{ user.name }}</span>
                                <v-icon large>mdi-chevron-down</v-icon>
                            </v-btn>
                          </template>
                          <v-list>
                            <v-list-item>
                                <NuxtLink to="/user" class="menu-profile__link">Настройки</NuxtLink>
                            </v-list-item>
                            <v-list-item>
                                <a href="#" class="menu-profile__link" @click.prevent="logout">Выйти</a>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                    </div>

                </div>  
            </div>
        </div>

        <v-dialog
            v-model="completionAuth"
            transition="dialog-bottom-transition"
            max-width="600"
            persistent
        >
          <v-card>
            <div class="bg-white rounded-3xl p-7">
                <div class="content-title text-center">ЗАВЕРШЕНИЕ АВТОРИЗАЦИИ  🔥</div>

                <div class="mt-5">
                    Мы рады приветсвовать вас в  RATE-THIS! Для завершения авторизации выберите один из предоставленных вариантов
                </div>
                
                <div class="flex gap-4 mt-5">
                    <div class="w-full">
                      <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="getByInn">У меня есть договор</button>
                    </div>
                    <div class="w-full">
                      <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="getByInn">У меня нет договора</button>
                    </div>
                </div>
            </div>
          </v-card>
        </v-dialog>


        <v-dialog
            v-model="innAdd"
            transition="dialog-bottom-transition"
            max-width="600"
            persistent
        >
          <v-card>
            <div class="bg-white rounded-3xl p-7">
                <template v-if="step==1">
                    <div class="content-title">Добавить ИНН</div>
                    
                    <div class="flex gap-4 mt-4">
                        <div class="w-full">
                          <input type="text" class="bg-white p-4 text-black rounded text-lg w-full text-center md:text-left" placeholder="Введите ИНН" v-model="inn" inputmode="numeric">
                        </div>
                        <div class="w-full">
                          <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="getByInn">Search</button>
                        </div>
                    </div>
                    <div class="mt-5" v-if="companies.length > 0">
                        <template v-for="item in companies">
                            <v-list>Название: {{item.name}}</v-list>
                            <v-list>Юр.адрес: {{item.address}}</v-list>
                            <v-list>ИНН: {{item.inn}}</v-list>
                            <v-list>КПП: {{item.kpp}}</v-list>
                            <v-list>ОГРН: {{item.ogrn}}</v-list>
                            <v-list>ОКПО: {{item.okpo}}</v-list>
                            <v-list>Банк: {{item.bank}}</v-list>
                            <v-list>К/с: {{item.ks}}</v-list>
                        </template>

                        <div class="mt-5">
                            <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="step=2">Дальше</button>
                        </div>
                    </div>
                </template>
                <template v-if="step==2">
                    <div class="w-full">
                      <input type="text" class="bg-white p-4 text-black rounded text-lg w-full text-center md:text-left" placeholder="Введите номер договора" v-model="number" inputmode="numeric">
                    </div>
                    <div class="mt-5">
                        <button class="teal lighten-2 p-4 text-black rounded text-lg font-bold w-full" @click="save">Сохранить</button>
                    </div>
                </template>
            </div>
          </v-card>
        </v-dialog>

    </div>
</template>

<script>

import { mapState } from "vuex";

export default {
  components: {},
  data() {
    return {
      burger: false,
      innAdd: false,
      completionAuth: false,
      inn: '',
      companies: [],
      step: 1,
      number: '',
      suggestions: []
    }
  },
  watch: {
    burger: function(val) {
      window.console.log(val)
    },
  },
  computed: {
    ...mapState('request', [
      'user'
    ]),
  },
  methods: {
    save() {
        if ( !this.number ) {
            this.$toast.warning('Номер договора не валидный')
            return false
        }

        this.$store.dispatch('request/auth_user_save', {
            inn: this.inn,
            suggestions: this.suggestions,
            number: this.number
        }).then((x) => {
          if ( !x.data.error ) {
            this.checkUserInfo()
          } else {
              this.$toast.error(x.data.error)
          }
        })
    },
    logout() {
      this.$auth.setUserToken(null)
      window.location.reload()
    },
    checkUserInfo() {
        // if ( !this.user.role ) {
        //     this.completionAuth = true
        // } else {
        //     this.completionAuth = false
        // }
    },
    getByInn() {
        if (
            this.inn.search(/^\d{10}$/) != -1
            || this.inn.search(/^\d{12}$/) != -1
        ) {
          this.$store.dispatch('request/dadata_search', {inn: this.inn}).then((x) => {
              if ( !x.data.error ) {
                this.companies = x.data.data
                this.suggestions = x.data.suggestions
              } else {
                  this.$toast.error(x.data.error)
              }
          })
        } else {
            this.$toast.warning('ИНН не валидный')
        }
    }
  },
  mounted() {
    this.$store.dispatch('request/auth_user').then((resp) => {
        this.checkUserInfo()
    })
    this.$store.dispatch('request/get_options').then((x) => {})
  }
}
</script>

<style scoped>

</style>