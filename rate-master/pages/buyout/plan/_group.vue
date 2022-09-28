<template>
    <div class="md:container md:mx-auto">
        <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7 pb-20">

            <div class=" flex gap-8 items-center justify-between ">
                <div>
                    <Breadcrumbs :items="crumbs" :back="back"/>
                </div>
                <div>
                    <template v-if="!showActions">
                        <div  class="h-full flex gap-8 items-center">
                            <div class="w-52">
                                <v-select :items="sort_opt" label="" v-model="sort" dense outlined hide-details="auto" class="rounded-lg bg-white"/></v-select>
                            </div>
                            <div>
                                <Button class="rounded-lg p-2.5 but-1">Выгрузить отчет</Button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="mt-12">
                <div class="content-title">Заявка от {{tDate}}</div>
                
            </div>

            <template v-if="step == 1">
                <div class="mt-14" v-if="showActions">
                    <div class="flex gap-4 items-center flex-col md:flex-row">
                        <div class="w-full md:w-auto">
                            <div class="input-block">
                                <input type="text" v-model="art" class="input-block__input input-block__input_w p-2.5" placeholder="Введите артикул" autocomplete="off">
                                <Button class="rounded-lg py-2.5 px-4 but-1 input-block__but" @click="findByArt" v-if="art">✚</Button>
                            </div>
                        </div>

                        <div class="w-full md:w-auto">
                            <Button class="rounded-lg p-2.5 but-0" @click="modalByApiShow=true">По API</Button>
                        </div>
                        <div class="w-full md:w-auto">
                            <Button class="rounded-lg p-2.5 but-0" @click="bulkAdd=true">Массовое добавление</Button>
                        </div>
                        <div class="w-full md:w-auto">
                            <template v-if="tItems.length > 0">
                                <Button class="rounded-lg p-2.5 but-1" @click="checkQueries">Далее</Button>
                            </template>
                        </div>
                        <div class="w-full md:w-auto">
                            <Button class="rounded-lg p-2.5 text-red-500 border border-solid border-red-500" @click="deleteDraft">Удалить черновик</Button>
                        </div>
                    </div>
                </div>

                <div class="mt-12">
                    <template v-if="tItems.length == 0">
                        <div class="result-empty">ЗДЕСЬ ПОКА НИЧЕГО</div> 
                    </template>
                    <template v-else>

                      <v-data-table
                        :headers="tHeaders"
                        :items="tItems"
                        class="postable"
                        :item-class= "rowClasses"
                        :loading="tLoading"
                        loading-text="Loading... Please wait"
                      >
                        <template v-slot:item.image="{ item }">
                            <img :src="item.image" alt="" class="img-table">
                        </template>
                        <template v-slot:item.status="{ item }">
                            <template v-if="item.status">
                                <span :class="'status-' + item.status.split('|')[1]">{{item.status.split('|')[0]}}</span>
                            </template>
                        </template>
                        <template v-slot:item.price="{ item }">
                            {{item.price}} ₽
                        </template>
                        <template v-slot:item.size="{ item }">
                            <template v-if="item.can_be_edited">
                                <v-select :items="item.sizes" label="" v-model="item.size" dense outlined hide-details="auto" class="rounded-lg bg-white"/></v-select>
                            </template>
                            <template v-else>{{item.size}}</template>
                        </template>
                        <template v-slot:item.gender="{ item }">
                            <template v-if="item.can_be_edited">
                                <v-select :items="genderOptions" v-model="item.gender" dense outlined hide-details="auto" class="rounded-lg bg-white"></v-select>
                            </template>
                            <template v-else>{{item.gender}}</template>
                        </template>
                        <template v-slot:item.count="{ item }">
                            <template v-if="item.can_be_edited">
                                <Switcher v-model="item.count"/>
                            </template>
                            <template v-else>{{item.count}}</template>
                        </template>
                        <template v-slot:item.rcount="{ item }">
                            <template v-if="item.can_be_edited">
                                <Switcher v-model="item.rcount"/>
                            </template>
                            <template v-else>{{item.rcount}}</template>
                        </template>
                        <template v-slot:item.query="{ item }">
                            <template v-if="item.can_be_edited">
                               <div class="input-block" style="width: 150px;">
                                  <input type="text" class="input-block__input input-block__input_w_1 py-2 px-4" v-model="item.query">
                               </div>
                            </template>
                            <template v-else>{{item.query}}</template>
                        </template>
                        <template v-slot:item.barcode="{ item }">
                            <template v-if="item.can_be_edited">
                               <div class="input-block" style="width: 150px;">
                                  <input type="text" class="input-block__input input-block__input_w_1 py-2 px-4" v-model="item.barcode">
                               </div>
                            </template>
                            <template v-else>{{item.barcode}}</template>  
                        </template>
                        <template v-slot:item.copy="{ item, index }">
                            <template v-if="item.can_be_edited">
                                <a href="#" @click.prevent="copy(index)"><i class="icon icon_copy"></i></a>
                            </template>
                        </template>
                        <template v-slot:item.del="{ item, index }">
                            <template v-if="item.can_be_edited">
                                <a href="#" @click.prevent="del(index)"><i class="icon icon_close_g"></i></a>
                            </template>
                        </template>
                        <template v-slot:item.position="{ item }">
                            <template v-if="item.position >= 0">
                                <template v-if="item.position == 0">
                                    <span class="status-dunger">{{item.position}}</span>
                                </template>
                                <template v-else>{{item.position}}</template>
                            </template>
                            <template v-else><span></span></template>
                        </template>
                        <template v-slot:item.action="{ item, index }">
                             <a href="#" @click.prevent="showGroupModal(item)"><i class="icon icon_arrow_r"></i></a>
                        </template>
                      </v-data-table>
                    </template>
                </div>

                <div class="mt-12">
                    <div>Общее количество:  <strong>артикулы - {{artCount}} шт, выкупов - {{posCount}} шт, отзывов - {{posRCount}} шт</strong> </div>
                    <div>Сумма выкупа: <strong>{{buyOutSum}}₽</strong></div>
                    <div>Услуги: <strong>{{servicesSum}}₽</strong></div>
                </div>

            </template>
            <template v-if="step == 2">
                <div class="mt-12">
                    <div class="content-title">Период реализации</div>
                </div>

                <div class="mt-12">
                    <div class="flex gap-4 items-center">
                          <DateRangePicker
                            :locale-data="localeData"
                            v-model="selectedDate"
                            opens="top"
                            singleDatePicker="range"
                            :ranges="false"
                            control-container-class="form-control reportrange-text rounded-lg datepicker-input"
                          />
                        <div>
                            <Button class="rounded-lg p-2.5 but-1" @click="splitByDate">Далее</Button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="step == 3">
                <div class="mt-12">
                    <div class="content-title">Согласование заявки</div>
                </div>

                <div class="mt-12">
                    <div class="mt-8 md:w-3/5">
                        <div>Проверьте корректность заявки и отправить ее в работу, либо вы можете сохранить ее в черновики. Если заявка сохраняется в черновики, планируемая дата выкупа сохранена не будет.</div>
                    </div>
                </div>

                <div class="mt-14">
                    <div class="flex gap-4 items-center flex-col md:flex-row">
                        <div class="w-full md:w-auto">
                            <Button class="rounded-lg p-2.5 but-0" @click="step = 1">Добавить товары</Button>
                        </div>
                        <div class="w-full md:w-auto">
                            <template v-if="tItems.length > 0">
                                <Button class="rounded-lg p-2.5 but-1" @click="orderSave('bid')">Заказать</Button>
                            </template>
                        </div>
                        <div class="w-full md:w-auto">
                            <Button class="rounded-lg p-2.5 but-0" @click="orderSave('draft')">В черновики</Button>
                        </div>
                    </div>
                </div>

                <div class="mt-12">

                    <v-data-table
                        :headers="orderHeaders"
                        :items="orderItems"
                        class="postable"
                        :item-class= "rowClasses"
                      >
                        <template v-slot:item.image="{ item }">
                            <img :src="item.image" alt="" class="img-table">
                        </template>
                        <template v-slot:item.status="{ item }">
                            <template v-if="item.status">
                                <span :class="'status-' + item.status.split('|')[1]">{{item.status.split('|')[0]}}</span>
                            </template>
                        </template>
                        <template v-slot:item.price="{ item }">
                            {{item.price}} ₽
                        </template>
                        <template v-slot:item.size="{ item }">
                            <v-select :items="item.size_opt" label="" v-model="item.size" dense outlined hide-details="auto" class="rounded-lg bg-white"/></v-select>
                        </template>
                        <template v-slot:item.gender="{ item }">
                            <v-select :items="item.gender_opt" v-model="item.gender" dense outlined hide-details="auto" class="rounded-lg bg-white"></v-select>
                        </template>
                        <template v-slot:item.count="{ item }">
                            <Switcher v-model="item.count"/>
                        </template>
                        <template v-slot:item.rcount="{ item }">
                            <Switcher v-model="item.rcount"/>
                        </template>
                        <template v-slot:item.barcode="{ item }">
                           <div class="input-block" style="width: 150px;">
                              <input type="text" class="input-block__input input-block__input_w_1 py-2 px-4" v-model="item.barcode">
                           </div>
                        </template>
                        <template v-slot:item.del="{ item, index }">
                            <a href="#" @click.prevent="del(index)"><i class="icon icon_close_g"></i></a>
                        </template>

                        <template v-slot:item.position="{ item }">
                            <template v-if="item.position >= 0">
                                <template v-if="item.position == 0">
                                    <span class="status-dunger">{{item.position}}</span>
                                </template>
                                <template v-else>{{item.position}}</template>
                            </template>
                            <template v-else><span></span></template>
                        </template>
                        <template v-slot:item.date="{ item, index }">
                            <Datepicker
                                v-model="item.date"
                                lang="ru"
                                input-class="datepicker-input"
                                position="left"
                              />
                        </template>
                      </v-data-table>

                </div>

                <div class="mt-12">
                    <div>Общее количество:  <strong>артикулы - {{artCount}} шт, выкупов - {{posCount}} шт, отзывов - {{posRCount}} шт</strong> </div>
                    <div>Сумма выкупа: <strong>{{buyOutSum}}₽</strong></div>
                    <div>Услуги: <strong>{{servicesSum}}₽</strong></div>
                </div>

            </template>

        </div>
        <Modal v-show="modalByApiShow" @close-modal="modalByApiShow = false">
            <div class="bg-white rounded-3xl mt-2.5 mx-2.5 p-2.5 md:p-7 h-full">
                <div class="h-full flex flex-col gap-1">
                    <div class="content-title">Выберите товары</div>
                    <div class="flex gap-4">
                        <div class="input-block">
                            <input type="text" class="input-block__input input-block__input_w p-2.5" placeholder="Поиск по баркоду, артикулу поставщика, бренду" autocomplete="off" v-model="findWbParams.search">
                        </div>
                        <Button class="rounded-lg p-2.5 but-1" @click="addToTItems">Добавить</Button>
                    </div>
                    <div class="grow">
                        <template v-if="apiItems.length == 0">
                            <div class="result-empty">ЗДЕСЬ ПОКА НИЧЕГО</div> 
                        </template>
                        <template v-else>
                            <CommonTable :headers="apiHeaders" :items="apiItems" :loading="apiItemsLoading" class="h-96">
                                <template v-slot:item.image="{ item }">
                                    <img :src="item.image" alt="" class="img-table">
                                </template>
                                <template v-slot:item.check="{ item }">
                                    <Checkbox v-model="item.check"/>
                                </template>
                                
                            </CommonTable>
                        </template>
                    </div>
                </div>
            </div>
        </Modal>


        <v-dialog
            v-model="bulkAdd"
            transition="dialog-bottom-transition"
            max-width="450"
        >
          <v-card>
            <div class="bg-white rounded-3xl p-2.5 md:p-7">
                <div class="content-title">Массовое добавление</div>
                <div class="flex gap-4 mt-8">
                    <Button class="rounded-lg p-2.5 w-1/2" :class="{'but-1': bulk.type == 1}" @click="bulk.type = 1">Буфер обмена</Button>
                    <Button class="rounded-lg p-2.5 w-1/2" :class="{'but-1': bulk.type == 2}" @click="bulk.type = 2">Импорт из Excel</Button>
                </div>
                <div class="mt-5">
                    <template v-if="bulk.type == 1">
                        <v-textarea
                          label="Артикул через пробел, запятую или перенос строки"
                          autofocus
                          clearable
                          clear-icon="mdi-close-circle"
                          auto-grow
                          outlined
                          rows="5"
                          v-model="bulk.arts"
                        ></v-textarea>

                        <div class="mt-5">
                            <Button class="rounded-lg p-2.5 but-1 w-full" @click="bulkSend">Добавить</Button>
                        </div>
                    </template>
                    <template v-if="bulk.type == 2">
                        <div class="flex flex-col gap-4">
                            <a href="/Массовое добавление(под ключ).xlsx" download="" class="rounded-lg p-2.5 but-0">
                                <v-icon dense>mdi-tray-arrow-down</v-icon>
                                Скачать шаблон XLS
                            </a>

                            <Button class="rounded-lg p-2.5 but-1 overflow-hidden relative">
                                <v-icon dense>mdi-tray-arrow-up</v-icon>
                                <template v-if="!bulk.files">Загрузить XLS</template>
                                <template v-else>
                                    <template v-if="bulk.files[0]['name']">
                                        {{bulk.files[0]['name']}}
                                    </template>
                                </template>
                                
                                <input type="file" @change="bulkFile" class="file-up" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            </Button>
                        </div>
                    </template>
                </div>
            </div>
          </v-card>
        </v-dialog>

        <v-dialog
            v-model="groupDialog"
            transition="dialog-bottom-transition"
            max-width="1200"
        >
          <v-card>
              <div class="bg-white rounded-3xl p-2.5 md:p-7">
                <v-data-table
                    :headers="bufferTHeaders"
                    :items="groupItems"
                    class="postable"
                    :item-class= "rowClasses"
                    :loading="tLoading"
                    loading-text="Loading... Please wait"
                  >
                    <template v-slot:item.image="{ item }">
                        <img :src="item.image" alt="" class="img-table">
                    </template>
                    <template v-slot:item.status="{ item }">
                        <template v-if="item.status">
                            <span :class="'status-' + item.status.split('|')[1]">{{item.status.split('|')[0]}}</span>
                        </template>
                    </template>
                    <template v-slot:item.price="{ item }">
                        {{item.price}} ₽
                    </template>
                    <template v-slot:item.size="{ item }">
                        <template v-if="item.can_be_edited">
                            <v-select :items="item.sizes" label="" v-model="item.size" dense outlined hide-details="auto" class="rounded-lg bg-white"/></v-select>
                        </template>
                        <template v-else>{{item.size}}</template>
                    </template>
                    <template v-slot:item.gender="{ item }">
                        <template v-if="item.can_be_edited">
                            <v-select :items="genderOptions" v-model="item.gender" dense outlined hide-details="auto" class="rounded-lg bg-white"></v-select>
                        </template>
                        <template v-else>{{item.gender}}</template>
                    </template>
                    <template v-slot:item.count="{ item }">
                        <template v-if="item.can_be_edited">
                            <Switcher v-model="item.count"/>
                        </template>
                        <template v-else>{{item.count}}</template>
                    </template>
                    <template v-slot:item.rcount="{ item }">
                        <template v-if="item.can_be_edited">
                            <Switcher v-model="item.rcount"/>
                        </template>
                        <template v-else>{{item.rcount}}</template>
                    </template>
                    <template v-slot:item.query="{ item }">
                        <template v-if="item.can_be_edited">
                           <div class="input-block" style="width: 150px;">
                              <input type="text" class="input-block__input input-block__input_w_1 py-2 px-4" v-model="item.query">
                           </div>
                        </template>
                        <template v-else>{{item.query}}</template>
                    </template>
                    <template v-slot:item.barcode="{ item }">
                        <template v-if="item.can_be_edited">
                           <div class="input-block" style="width: 150px;">
                              <input type="text" class="input-block__input input-block__input_w_1 py-2 px-4" v-model="item.barcode">
                           </div>
                        </template>
                        <template v-else>{{item.barcode}}</template>  
                    </template>
                    <template v-slot:item.copy="{ item, index }">
                        <template v-if="item.can_be_edited">
                            <a href="#" @click.prevent="copy(index)"><i class="icon icon_copy"></i></a>
                        </template>
                    </template>
                    <template v-slot:item.del="{ item, index }">
                        <template v-if="item.can_be_edited">
                            <a href="#" @click.prevent="del(index)"><i class="icon icon_close_g"></i></a>
                        </template>
                    </template>
                    <template v-slot:item.position="{ item }">
                        <template v-if="item.position >= 0">
                            <template v-if="item.position == 0">
                                <span class="status-dunger">{{item.position}}</span>
                            </template>
                            <template v-else>{{item.position}}</template>
                        </template>
                        <template v-else><span></span></template>
                    </template>
                  </v-data-table>
                  </div>
          </v-card>
        </v-dialog>

    </div>
</template>


<script>
import _ from 'lodash';
    
export default {
  components: { },
  data() {
    return {
        bulk: {
            type: 1,
            arts: '',
            files: null
        },
        bulkAdd: false,
        groupDialog: false,

        localeData: {
            firstDay: 1, format: 'dd-mm-yyyy',
            applyLabel: 'Принять',
            cancelLabel: 'Закрыть',
            daysOfWeek: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
            monthNames: ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
        },

        sort_opt: [
            {'value': 1, 'text': 'По артикулам'},
            {'value': 2, 'text': 'По датам'},
            {'value': 3, 'text': 'Все (базовая)'},
        ],
        sort: 3,
        sizeOptions: [
          {"value":"", "name":"Нет"},
          {"value":"s", "name":"S"},
          {"value":"xs", "name":"XS"},
          {"value":"l", "name":"L"},
          {"value":"m", "name":"M"},
        ],
        genderOptions: [
          {"value":"", "name":"Нет", "text":"Нет"},
          {"value":"m", "name":"М", "text":"М"},
          {"value":"w", "name":"Ж", "text":"Ж"},
        ],
        countPageOptions: [
          {"value":10, "name":"10"},
          {"value":20, "name":"20"},
          {"value":50, "name":"50"},
          {"value":100, "name":"100"},
        ],
        crumbs: [
            {"name": 'Выкупы', "link" : "/buyout", "type" : "link"},
            {"name": 'Планирование', "link" : "", "type" : "text"},
        ],

      modelOptions: [
        {"value":"m1", "name":"Под ключ"},
        {"value":"m2", "name":"Самостоятельно"}
      ],
      model: "m1",
      step: 1,
      modalByApiShow: false,
      // selectedDate: [
      //       new Date(),
      //       new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000)
      //   ],

      selectedDate: {
            startDate: new Date(),
            endDate: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000)
        },

        art:'',
        tItems:[],
        tHeaders:[],

        bufferTItems:[],
        bufferTHeaders:[],

        groupHeaders:[],
        groupItems:[],

        tLoading: true,
        orderItems:[],
        orderHeaders:[],

        apiItems:[],
        apiHeaders:[],

        findWbParams: {
            'search': '',
            'skip': 0,
            'take': 10,
        },
        timeoutfindWb: null,
        apiItemsLoading: false,
        tDate: '',
        showActions: false
    }
  },
  watch: {

    
    sort: function(val) {
        this.getByGroup()
    },


    bulkAdd: function(val) {
        if ( val ) {
            this.bulk = { type: 1, arts: '', files: null}
        }
    },
    findWbParams: {
        deep: true,
        handler(val) {
            clearTimeout( this.timeoutFindWb )
            this.timeoutFindWb = setTimeout(() => {
                this.findWb()
            }, 200);
        },
    },
    modalByApiShow: function(val) {
        if ( val ) {
            this.findWb()
        }
    }
  },
  computed: {

    artCount : function() {
        let arts = []
        if ( this.tItems.length > 0 ) {
            for (var i = 0; i < this.tItems.length; i++) {
                let art = this.tItems[i]['art']
                if ( art ) {
                    arts.push( art ) 
                }
            }
        }
        arts = _.uniq(arts)
        return arts.length
    },
    posCount : function() {
        let counts = []
        for (var i = 0; i < this.tItems.length; i++) {
            let count = parseInt(this.tItems[i]['count'], 10)
            if ( count ) {
                counts.push( count ) 
            }
        }
        return _.sum(counts)
    },
    posRCount : function() {
        let counts = []
        for (var i = 0; i < this.tItems.length; i++) {
            let rcount = parseInt(this.tItems[i]['rcount'], 10)
            if ( rcount ) {
                counts.push( rcount ) 
            }
        }
        return _.sum(counts)
    },
    buyOutSum : function() {
        let sums = []
        for (var i = 0; i < this.tItems.length; i++) {
            let count = parseInt(this.tItems[i]['count'], 10)
            let rcount = parseInt(this.tItems[i]['rcount'], 10)
            let price = parseInt(this.tItems[i]['price'], 10)
            if ( count && price ) {
                sums.push( (count - rcount) * price ) 
            }
        }
        return _.sum(sums)
    },
    servicesSum : function() {
        let sums = []
        for (var i = 0; i < this.tItems.length; i++) {
            let rcount = parseInt(this.tItems[i]['rcount'], 10)
            let price = parseInt(this.tItems[i]['price'], 10)
            if ( rcount && price ) {
                sums.push( rcount * price ) 
            }
        }
        return _.sum(sums)
    },
  },
  methods: {

    showGroupModal( item ) {
        this.groupItems = this.bufferTItems.filter( x => (_.indexOf(item.ids, x.id) > -1)  )
        this.groupDialog = true        
    },

    deleteDraft() {

    },

    rowClasses(item) {
        if (item.class) {
          return item.class;
        } 
    },

    bulkFile: function( e ) {
        let files = e.target.files || e.dataTransfer.files;
        this.bulk.files = files
        this.bulkSend()
    },

    addToTItems: function() {
        let items = this.apiItems.filter(item => (item.check) )
        if ( items.length > 0 ) {
            for (var i = 0; i < items.length; i++) {

                let clone = _.cloneDeep(items[i])
                clone['can_be_edited'] = true

                this.tItems.push( clone )
            }

            this.modalByApiShow = false
            this.apiItems = []
        }
        
    },

    copy: function(index) {
        this.tItems.splice(index, 0, _.cloneDeep(this.tItems[index]) )
    },
    del(index) {
        if ( this.step == 4 ) {
            this.orderItems.splice(index, 1);
            if ( this.orderItems.length == 0 ) {
                this.step = 2
            }
        } else {
            this.tItems.splice(index, 1);
            if ( this.tItems.length == 0 ) {
                this.step = 2
            }
        }

    },
    back: function() {
        if ( this.step == 1 ) this.$router.push('/buyout')
        else this.step = this.step - 1
    },
    handleInput: function({name, value}) {
       this.model = value
    },
    findByArt: function() {
        this.$store.dispatch('request/get_findbyart', {art: this.art}).then((x) => {

            if (this.tHeaders.length == 0 && x.data.headers.length > 0) {
                this.tHeaders = x.data.headers
            }

            if (x.data.items.length > 0) {
                for (var i = x.data.items.length - 1; i >= 0; i--) {
                    x.data.items[i]['can_be_edited'] = true
                    this.tItems.push(x.data.items[i])
                }
            }

            if ( x.data.error ) {
                this.$toast.warning(x.data.msg);
            }

        })
        this.art = ''
    },
    bulkSend: function() {

        if ( this.bulk.type == 1 && !this.bulk.arts ) {
            this.$toast.warning('Не введён артикул');
            return
        }

        if ( this.bulk.type == 2 && !this.bulk.files ) {
            this.$toast.warning('Не выбран файл');
            return
        } 

        if ( this.bulk.type == 1) {
            this.$store.dispatch('request/bulk_buffer', this.bulk).then((x) => {
                if (this.tHeaders.length == 0 && x.data.headers.length > 0) {
                    this.tHeaders = x.data.headers
                }

                if (x.data.items.length > 0) {
                    for (var i = x.data.items.length - 1; i >= 0; i--) {
                        x.data.items[i]['can_be_edited'] = true
                        this.tItems.push(x.data.items[i])
                    }
                } else {
                    this.$toast.warning('Ничего не добавлено');
                }

                if ( x.data.msgs.length > 0 ) {
                    for (var i = x.data.msgs.length - 1; i >= 0; i--) {
                        this.$toast.warning(x.data.msgs[i]);
                    }
                }

                this.bulkAdd = false
            })
        }
        if ( this.bulk.type == 2) {

            let formData = new FormData()
            this.bulk.files.forEach((item, i) => {
                formData.append(i, item)
            })
            formData.append('type', this.bulk.type)   

            this.$store.dispatch('request/bulk_files', formData).then((x) => {
                if (this.tHeaders.length == 0 && x.data.headers.length > 0) {
                    this.tHeaders = x.data.headers
                }

                if (x.data.items.length > 0) {
                    for (var i = x.data.items.length - 1; i >= 0; i--) {
                        x.data.items[i]['can_be_edited'] = true
                        this.tItems.push(x.data.items[i])
                    }
                } else {
                    this.$toast.warning('Ничего не добавлено');
                }

                if ( x.data.msgs.length > 0 ) {
                    for (var i = x.data.msgs.length - 1; i >= 0; i--) {
                        this.$toast.warning(x.data.msgs[i]);
                    }
                }

                this.bulkAdd = false
            }).catch((error) => {
                this.$toast.error('Что то пошло не так')
            })
        }
    },


    checkQueries: function() {
        this.$store.dispatch('request/checkallquery', {items: this.tItems}).then((x) => {
            for (var i = x.data.data.length - 1; i >= 0; i--) {
                this.tItems[ x.data.data[i].index ]['position'] = x.data.data[i].position
                this.tItems[ x.data.data[i].index ]['class'] = x.data.data[i].class
            }

            if ( !x.data.error ) {
                ++this.step
            } else {
                for (var i = x.data.msgs.length - 1; i >= 0; i--) {
                    this.$toast.error(x.data.msgs[i]);
                }
                
            }
        })
    },
    splitByDate: function() {
        this.$store.dispatch('request/splitbydate', {items: this.tItems, date: this.selectedDate}).then((x) => {
            this.orderItems = x.data.items
            this.orderHeaders = x.data.headers
            this.step = 3
        })
    },
    orderSave: function( type ) {
        this.$store.dispatch('request/order_save', {items: this.orderItems, type: type, 'model' : this.model }).then((x) => {
            if ( !x.data.error ) {
                this.$toast.success(x.data.msg);
                this.orderItems = []
                this.tItems = []
                this.items = []
                this.step = 1
            } else {
                this.$toast.error(x.data.msg);
            }
        })
    },
    findWb: function() {
        this.apiItemsLoading = true
        this.$store.dispatch('request/find_wb', this.findWbParams).then((x) => {
            this.apiItemsLoading = false
            if ( !x.data.error ) {
                this.apiItems  = x.data.items
                this.apiHeaders = x.data.headers
            } else {
                this.$toast.error(x.data.msg);
            }
        })
    },

    getByGroup: function() {
        this.tLoading = true
        this.$store.dispatch('request/buyout_group', {group: this.$route.params.group, sort: this.sort}).then((x) => {
            if ( !x.data.error ) {
                this.tItems  = x.data.items
                this.tHeaders = x.data.headers

                if ( this.sort == 3 ) {
                    if ( this.bufferTHeaders.length == 0 ) {
                        this.bufferTHeaders = x.data.headers
                    }
                    if ( this.bufferTItems.length == 0 ) {
                        this.bufferTItems = x.data.items
                    }
                }

                this.tDate = x.data.date
                this.showActions = x.data.show_actions
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
.progress {
  display: flex;
  align-items: center;
}
.progress__item {
    display: flex;
    align-items: center;
    gap: 8px;
    filter: grayscale(1);
}

.progress__item.progress__item_check {
 filter: grayscale(0); 
}

.progress__num {
  width: 34px;
  height: 34px;
  background: #92E6D6;
  border-radius: 30px;
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  line-height: 21px;
  color: #000000;
  line-height: 34px;
  text-align: center;
  position: relative;
  z-index: 100; 
}
.progress__wrap {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px; 
}
.progress__wrap:before {
  content: '';
  height: 2px;
  background: #92E6D6;
  z-index: 1;
  width: 130px;
}

.progress__item:first-child {
  width: auto;
  filter: grayscale(0);
}
.progress__item:first-child .progress__wrap {
  width: 34px;
}
.progress__item:first-child .progress__wrap:before {
  display: none;
}


.progress__name {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: #92E6D6;
  position: relative;
  z-index: 10;
  height: 100%;
  background: #fff;
  display: inline-block;
  padding-right: 8px;
}
</style>