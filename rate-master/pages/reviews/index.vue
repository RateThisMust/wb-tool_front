<template>
  <div class="md:container md:mx-auto">
    <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7">
        <div class="md:grid md:grid-cols-2">
          <div class="">
              <div class="content-title">Отзывы ожидающие публикации</div>
          </div>
        </div>
          <div class="mt-12 md:w-3/5">
              <template v-if="tItems.length == 0">
                  <div class="result-empty">ЗДЕСЬ ПОКА НИЧЕГО</div> 
              </template>
              <template v-else>

                <v-data-table
                  :headers="tHeaders"
                  :items="tItems"
                  class="postable"
                >
                  <template v-slot:item.image="{ item }">
                      <img :src="item.image" alt="" class="img-table">
                  </template>

                  <template v-slot:item.action="{ item }">
                      <a :href="'/reviews/' + item.group" @click.prevent="showGroup( item.group )"><i class="icon icon_arrow_r"></i></a>
                  </template>
                </v-data-table>
              </template>
          </div>

        <div class="md:grid md:grid-cols-2 mt-12">
          <div class="">
              <div class="content-title">Выкупы доступные для публикации</div>
          </div>
        </div>
          <div class="mt-12 md:w-3/5">
              <template v-if="tItemsOther.length == 0">
                  <div class="result-empty">ЗДЕСЬ ПОКА НИЧЕГО</div> 
              </template>
              <template v-else>

                <v-data-table
                  :headers="tHeadersOther"
                  :items="tItemsOther"
                  class="postable"
                >
                  <template v-slot:item.image="{ item }">
                      <img :src="item.image" alt="" class="img-table">
                  </template>

                  <template v-slot:item.action="{ item }">
                      <a :href="'/reviews/' + item.group" @click.prevent="showGroup( item.group )" class="flex align-center gap-4 justify-end">
                        Заказать отзывы
                        <i class="icon icon_arrow_r shrink"></i>
                      </a>
                  </template>
                </v-data-table>
              </template>
          </div>
    </div>
  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      filter: {
        status: 1,
        pvz: ''
      },
      tItems:[],
      tHeaders:[],
      tHeadersOther:[],
      tItemsOther:[],
    }
  },
  computed: {

  },

  watch: {



  },
  methods: {

    showGroup: function( group ) {
      this.$router.push('/reviews/' + group)
    },

    list: function( type ) {
        this.tItems = []
        this.$store.dispatch('request/reviews_list', {}).then((x) => {
            if ( !x.data.error ) {
              if (this.tHeaders.length == 0 && x.data.headers.length > 0) {
                  this.tHeaders = x.data.headers
              }

              if (x.data.items.length > 0) {
                  for (var i = x.data.items.length - 1; i >= 0; i--) {
                      this.tItems.push(x.data.items[i])
                  }
              }

              if ( x.data.error ) {
                  this.$toast.warning(x.data.msg);
              }

            } else {
                this.$toast.error(x.data.error)
            }
        })
    },
    listOther: function( type ) {
        this.tItemsOther = []
        this.$store.dispatch('request/reviews_list', {type: 'other'}).then((x) => {
            if ( !x.data.error ) {
              if (this.tHeadersOther.length == 0 && x.data.headers.length > 0) {
                  this.tHeadersOther = x.data.headers
              }

              if (x.data.items.length > 0) {
                  for (var i = x.data.items.length - 1; i >= 0; i--) {
                      this.tItemsOther.push(x.data.items[i])
                  }
              }

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
    this.listOther()
  }
}
</script>