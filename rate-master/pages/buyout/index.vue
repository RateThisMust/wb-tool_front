<template>
  <div class="md:container md:mx-auto">
      <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7">
          <div class="flex gap-2.5 items-center flex-col md:flex-row justify-between">
              <div class="">
                  <div class="content-title">Новая заявка на выкупы WILDBERRIES</div>
                  <div class="content-desc mt-3.5">Создайте новую группу выкупов. Введите артикулы товаров и заполните необходимые данные.</div>
              </div>
              <div class="mt-2.5 md:mt-0 w-full md:w-44">
                  <NuxtLink to="/buyout/plan" class="rounded-lg p-2.5 but-1 w-full block">Добавить</NuxtLink>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7">
          <div class="md:flex md:items-center md:justify-between">
              <div class="content-title">Автоматический рассчет выхода в топ WILDBERRIES</div>
              <div class="w-full md:w-44">
                <Button class="rounded-lg p-2.5 but-0 w-full">Скоро</Button>
              </div>
          </div>
      </div>

      <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7">
          <div class="md:flex md:items-center md:justify-between">
              <div class="content-title">Выкупы WILDBERRIES</div>
              <div class="md:mt-0 mt-2.5">
                <Select :items="modelOptions" label="Модель работы: " v-model="model"/>
              </div>
          </div>
          <div class="mt-2.5 md:w-3/5">
            <v-data-table
                :headers="tHeaders"
                :items="tItems"
                class="postable"
                :item-class= "rowClasses"
              >
                 <template v-slot:item.status="{ item }">
                    <span :class="'status-' + item.status.split('|')[1]">{{item.status.split('|')[0]}}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <a :href="'/buyout/plan/' + item.group" @click.prevent="showGroup( item.group )"><i class="icon icon_arrow_r"></i></a>
                </template>
              </v-data-table>

          </div>
      </div>

  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      modelOptions: [
        {"value":"m1", "name":"Под ключ"},
        {"value":"m2", "name":"Самостоятельно"}
      ],
      model: "m1",
      tItems:[],
      tHeaders:[],
    }
  },
  computed: {

  },

  watch: {
    model: function(val) {
      this.list()          
    },
  },
  methods: {
    rowClasses(item) {
        if (item.class) {
          return item.class;
        } 
    },
    showGroup: function( group ) {
      this.$router.push('/buyout/plan/' + group)
    },

    list: function( type ) {

        this.tItems = []

        this.$store.dispatch('request/buyout_list', {model: this.model }).then((x) => {
            if ( !x.data.error ) {
              if (this.tHeaders.length == 0 && x.data.headers.length > 0) {
                  this.tHeaders = x.data.headers
              }

              if (x.data.items.length > 0) {
                  for (var i = x.data.items.length - 1; i >= 0; i--) {
                      this.tItems.push(x.data.items[i])
                  }
              }

              window.console.log(this.tHeaders)

              if ( x.data.error ) {
                  this.$toast.warning(x.data.msg);
              }

            } else {
                this.$toast.error(x.data.error)
            }
        })
    },

    
  },
  mounted() {
    this.list()
  }
}
</script>