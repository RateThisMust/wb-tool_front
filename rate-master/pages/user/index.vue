<template>
  
    <div class="md:container md:mx-auto">
        <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7 pb-20">
            <div class="">
                <div class="content-title">Настройки</div>
                <div class="content-desc mt-3.5">Здесь вы можете управлять настройками вашего личного кабинета.</div>
            </div>
            <div class="mt-12">
                <div class="content-title content-title_2">Контакные данные</div>
                <div>Данные требуются для формирования закрывающих документов.</div>
            </div>
            <div class="mt-4">
                <div class="md:grid md:grid-cols-3 gap-10 flex flex-wrap">
                    <div class="input-block">
                        <input type="text" class="input-block__input py-5 px-6" placeholder="Имя" v-model="user_new.u_name" autocomplete="off">
                    </div>
                    <div class="input-block">
                        <input type="text"  class="input-block__input py-5 px-6" placeholder="Фамилия" v-model="user_new.u_surname" autocomplete="off">
                    </div>
                    <div class="input-block">
                        <input type="text"  class="input-block__input py-5 px-6" placeholder="ИНН" readonly v-model="user_new.inn" autocomplete="off">
                    </div>
                    <div class="input-block">
                        <input type="text" class="input-block__input py-5 px-6" placeholder="Банк" v-model="user_new.bank" autocomplete="off">
                    </div>
                    <div class="input-block">
                        <input type="text" class="input-block__input py-5 px-6" placeholder="Расчетный счет" v-model="user_new.ks" autocomplete="off">
                    </div>
                </div>
            </div>


            <div class="mt-12">
                <div class="content-title content-title_2">API ключ</div>
                <div>Ключ нужен для того, чтобы вы могли удобно добовлять товары в работу</div>
            </div>
            <div class="mt-4">
                <div class="md:grid md:grid-cols-2 gap-10 flex flex-wrap">
                    <v-textarea
                      outlined
                      v-model="user_new.wb_api_key"
                    ></v-textarea>
                </div>
            </div>

            <div class="mt-12">
                <div class="content-title content-title_2">Связанный аккаунт TELEGRAM</div>
                <div>В связанный телеграм аккаунт приходят ссылки для оплаты выкупов и уведомления</div>
            </div>
            <div class="mt-4">
                <div class="md:grid md:grid-cols-2 gap-10 flex flex-wrap">
                    <div class="input-block input-block_edit">
                        <input type="text" name="name" class="input-block__input py-5 px-6" placeholder="" v-model="user_new.telegram" autocomplete="off">
                        <i class="icon icon_edit input-block__icon"></i>
                    </div>
                </div>
            </div>
            <div class="mt-4 flex justify-end">
                <button class="w-full md:w-52 p-2.5 teal lighten-2 text-2xl text-gray-800 rounded" @click="save">Сохранить</button>
            </div>

            <div class="mt-12">
                <div class="content-title content-title_2">Договор</div>
                <div>Договор нужен для работы по рассчетному счету и формирования закрывающих документов</div>
            </div>
            <div class="mt-4">
                <button class="w-full md:w-52 p-2.5 bg-white text-2xl text-black rounded border border-black">
                    <v-icon dense>mdi-tray-arrow-down</v-icon>
                    Скачать
                </button>
            </div>

            <template v-if="user.role == 4">
                <div class="mt-12">
                    <div class="flex justify-between flex-col md:flex-row gap-4">
                        <div>
                            <div class="content-title content-title_2">Добавление пользователей</div>
                            <div>В данном разделе вы можете добавить пользователя, ограничить его по правам доступа</div>
                        </div>      
                        
                        <div>
                            <button class="w-full md:w-52 p-2.5 teal lighten-2 text-2xl text-gray-800 rounded" @click="userAdd = true">Добавить</button>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <template v-if="tItems.length == 0">
                        <div class="result-empty">ЗДЕСЬ ПОКА НИЧЕГО</div> 
                    </template>
                    <template v-else>
                      <v-data-table
                        :headers="tHeaders"
                        :items="tItems"
                        class="postable"
                        :hide-default-footer="true"
                      >

                        <template v-slot:header.role="{ header }">
                            {{ header.text }}
                            <v-tooltip
                                top
                                max-width="300"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                  text
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                  <v-icon dense>mdi-help</v-icon>
                                </v-btn>
                              </template>
                              
                              <div>
                                  <span><span class="font-bold">Полный доступ</span> - может оформлять заявки, покупать услуги, добавлять или удалять пользователей, назначать роли, кроме владельца.</span>
                                  <v-divider class="my-2"></v-divider>
                                  <span><span class="font-bold">Только просмотр</span> - может только смотреть, формирование заявок, выгрузка отчетов будет недоступна, оплата услуг тоже</span>
                                  <v-divider class="my-2"></v-divider>
                                  <span><span class="font-bold">Ограниченный дсотуп</span> - может сформировать заявку, но в работу она небудет запущена, так же не может списывать средства с баланса.</span>
                                  <v-divider class="my-2"></v-divider>
                                  <span><span class="font-bold">Владелец кабинета</span> - может назначать роли, удалять и добавлять пользователей, полностью пользоваться личным кабинетом</span>
                              </div>

                            </v-tooltip>
                        </template>

                        <template v-slot:item.role="{ item, index }">
                            <v-select 
                                :items="opt_roles"
                                v-model="item.role"
                                outlined
                                hide-details="auto"
                                label="ПРАВО ДОСТУПА"
                                class="rounded-lg bg-white"
                                v-on:change="user_parent_save(index)"
                            ></v-select>
                        </template>
                        <template v-slot:item.action="{ item, index }">
                            <v-btn icon @click="user_parent_del(index)">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                      </v-data-table>
                    </template>
                </div>


            </template>

        </div>


        <v-dialog
            v-model="userAdd"
            transition="dialog-bottom-transition"
            max-width="400"
        >
          <v-card>

            <div class="bg-white rounded-3xl p-7 relative">

                <div class="absolute top-4 right-1">
                    <v-btn icon @click="userAdd = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>

                <div class="content-title text-center">Добавление пользователя</div>    
                <div class="mt-4">
                  <v-text-field
                    label="ИМЯ"
                    v-model="unew.name"
                    outlined
                    hide-details="auto"
                  ></v-text-field>
                </div>
                <div class="mt-4">
                  <v-text-field
                    label="ФАМИЛИЯ"
                    v-model="unew.surname"
                    outlined
                    hide-details="auto"
                  ></v-text-field>
                </div>
                <div class="mt-4">
                  <v-text-field
                    label="НОМЕР ТЕЛЕФОНА"
                    v-model="unew.phone"
                    outlined
                    hide-details="auto"
                    v-mask="'+7 (###) ###-##-##'"
                  ></v-text-field>
                </div>
                <div class="mt-4">
                    <v-select 
                        :items="opt_roles"
                        v-model="unew.role"
                        outlined
                        hide-details="auto"
                        label="ПРАВО ДОСТУПА"
                        class="rounded-lg bg-white"
                    ></v-select>
                </div>
                <div class="mt-4">
                    <button class="w-full p-2.5 teal lighten-2 text-2xl text-gray-800 rounded" @click="unewAdd">Добавить</button>
                </div>
            </div>
          </v-card>
        </v-dialog>

    </div>

</template>

<script>

import { mapState } from "vuex";

export default {
  data() {
    return {
        userAdd: false,
        unew: {
            role: '',
            phone: '',
            name: '',
            surname: ''
        },
        tHeaders: [],
        tItems: []
    }
  },
  computed: {
    ...mapState('request', [
      'user',
      'opt_roles'
    ]),
    user_new() {
      return Object.assign({}, this.user);
    },
  },
  watch: {

  },
  methods: {
    unewAdd() {
        let error = 0
        if ( !this.unew.name ) {
            this.$toast.warning('Не заполнено имя')
            ++error
        }
        if ( !this.unew.surname ) {
            this.$toast.warning('Не заполнена фамилия')
            ++error
        }
        if ( !this.unew.phone ) {
            this.$toast.warning('Не заполнен телефон')
            ++error
        }
        if ( error > 0 ) {
            return false
        }

        this.$store.dispatch('request/auth_user_parent_save', {item: this.unew}).then((x) => {
          if ( !x.data.error ) {
            this.user_parent_get()
            this.userAdd = false
          } else {
              this.$toast.error(x.data.error)
          }
        })

    },
    save() {
        this.$store.dispatch('request/auth_user_save', this.user_new).then((x) => {
          if ( !x.data.error ) {
            this.$toast.success('Данные сохранены')
          } else {
              this.$toast.error(x.data.error)
          }
        })
    },
    user_parent_get(){
        this.$store.dispatch('request/auth_user_parent_get', {}).then((x) => {
          if ( !x.data.error ) {
            this.tHeaders = x.data.headers
            this.tItems = x.data.items
          } else {
              this.$toast.error(x.data.error)
          }
        })
    },
    user_parent_save(index){
        this.$store.dispatch('request/auth_user_parent_save', {item: this.tItems[index]}).then((x) => {
          if ( !x.data.error ) {
            this.user_parent_get()
          } else {
              this.$toast.error(x.data.error)
          }
        })
    },
    user_parent_del( index ){
        this.$store.dispatch('request/auth_user_parent_del', {item: this.tItems[index]}).then((x) => {
          if ( !x.data.error ) {
            this.user_parent_get()
          } else {
              this.$toast.error(x.data.error)
          }
        })
    }
  },
  mounted() {
    this.user_parent_get()
  }
}
</script>