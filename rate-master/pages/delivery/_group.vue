<template>
    <div class="md:container md:mx-auto">
        <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7 pb-20">

            <div class=" flex gap-8 items-center justify-between ">
                <div>
                    <Breadcrumbs :items="crumbs" :back="back"/>
                </div>
                <div>
                    <div  class="h-full flex gap-8 items-center">
                        <div>
                            <Button class="rounded-lg p-2.5 but-1">Выгрузить отчет</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-12">
                <div class="content-title">Товары выкупленные {{tDate}}</div>
                
            </div>

            <div class="mt-12">
                <v-data-table
                    :headers="tHeaders"
                    :items="tItems"
                    class="postable"
                  >
                    <template v-slot:item.image="{ item }">
                        <img :src="item.image" alt="" class="img-table">
                    </template>
                    <template v-slot:item.status="{ item }">
                        <template v-if="item.status">
                            <span :class="'status-' + item.status.split('|')[1]">{{item.status.split('|')[0]}}</span>
                        </template>
                    </template>
                  </v-data-table>
            </div>

        </div>


    </div>
</template>


<script>
import _ from 'lodash';
    
export default {
  components: { },
  data() {
    return {
        tItems:[],
        tHeaders:[],
        tDate: '',
        tLoading: false,
        crumbs: [
            {"name": 'Доставки', "link" : "/delivery", "type" : "link"},
            {"name": 'Дата', "link" : "", "type" : "text"},
        ],
    }
  },
  watch: {
  },
  computed: {

  },
  methods: {
    back: function() {
        this.$router.push('/delivery')
    },
    getByGroup: function() {
        this.tLoading = true
        this.$store.dispatch('request/delivery_group', {group: this.$route.params.group}).then((x) => {
            if ( !x.data.error ) {
                this.tItems  = x.data.items
                this.tHeaders = x.data.headers
                this.tDate = x.data.date
            } else {
                this.$toast.error(x.data.msg);
            }
            this.tLoading = false
        })
    }

  },
  mounted() {
    this.getByGroup()
  }
}
</script>


<style scoped>

</style>