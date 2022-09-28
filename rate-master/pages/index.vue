<template>
  <div>

    <div class="md:container md:mx-auto">
      <div class="mt-2.5">
        <MainFastinfo />
      </div>
    </div>

    <div class="md:container md:mx-auto">
      <div class="flex gap-4 mt-4 flex-col md:flex-row">
        <div class="bg-white rounded-3xl flex-grow p-2.5 md:p-7">
          <MainStat />
        </div>
        <div class="bg-white rounded-3xl p-2.5 md:p-7 md:w-1/3 w-full ">
          <MainNotices />
        </div>
      </div>
    </div>

    <div class="md:container md:mx-auto">
      <div class="flex gap-4 mt-4 flex-col md:flex-row">
        <div class="bg-white rounded-3xl flex-grow p-2.5 md:p-7">
          <div class="content-title">Позиции товара в выдаче</div>
          <div class="mt-12">
            <CommonTable :headers="resultsInSearch.headers" :items="resultsInSearch.items" :loading="loadingResultsInSearch">
              <template v-slot:item.image="{ item }">
                  <img :src="item.image" alt="" class="img-table">
              </template>
            </CommonTable>
          </div>
        </div>
        <div class="bg-white rounded-3xl p-2.5 md:p-7 md:w-1/3 w-full ">
          <MainReports />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      resultsInSearch: {},
      loadingResultsInSearch: true,
    }
  },
  methods: {
    getPositions() {
      this.loadingResultsInSearch = true
      this.$store.dispatch('request/get_positions').then((x) => {
        this.resultsInSearch = x.data
        this.loadingResultsInSearch = false
      })
    }
  },
  mounted() {
   this.getPositions()
  },
}
</script>