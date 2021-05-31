<template>
  <v-app>
    <v-app-bar app color="primary" dark>
        <a href="./">
          <v-img
            alt="gifson"
            class="shrink mr-2"
            contain
            src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
            transition="scale-transition"
            width="40"
          />
        </a>

        <v-text-field 
            placeholder="Search..."
            @input="search"
        ></v-text-field>
      
    </v-app-bar>
    <v-content>

      <v-img v-if="items.length == 1"
        width="100%"
        :src="items[0].images.original.url"
      ></v-img>

       <div v-else class="text-center ma-3">
          <v-card
            v-for="{
              id,
              title, 
              images:{
                preview_gif: {url:gif, height, width},
                '480w_still': {url:jpg},
                original: {url}
              }} in items" 
            :key="id" 
            class="d-inline-block"
            style="margin: 4px 6px"
          >
            <v-img
              height="250"
              width="250"
              :title="title"
              :src="jpg"
              :data-gif="gif"
              @mouseenter="play"
              @mouseleave="pause"
            >
              <v-card-actions>
                <v-btn 
                  title="Share"
                  @click="share({url,title})"
                  icon absolute bottom right large
                >
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-img>
          </v-card>

          <v-pagination v-if="items.pagination"
            v-model="page"
            :length="pages"
            disabled
          ></v-pagination>
      </div>

    </v-content>
  </v-app>
</template>

<script>
import {getTrending, getByQuery, get404} from './fetch'
import {debounce} from './utils'

export default {
  name: 'App',
  
  data: () => ({
    items: [],
    page: 1,
  }),

  computed: {
    pages(){
      const {pagination:{count, total_count}} = this.items
      return parseInt(total_count / count) + 1
    },
    offset(){
      const {pagination: {count}} = this.items
      return (this.page - 1) * parseInt(count)
    },
  },

  methods: {
    search: debounce(async function({target: {value}}){
      //const {pagination: {count, offset}} = this.items
      //const newOffset = parseInt(offset + count)
      const items = await getByQuery( value )
      this.items = items && items.length ? items : [await get404()]
    }, 500),

    async share(data){
      try{
        await navigator.share(data)
      }catch({message}){
        //alert(message)
        await navigator.clipboard.writeText(data.url)
        window.open(data.url)
      }
    },

    play({target}){
      const el = target.querySelector('.v-responsive__sizer')
      if(el) el.style.background = `center / cover url(${target.dataset.gif})`
    },

    pause({target}){
      const el = target.querySelector('.v-responsive__sizer')
      if(el) el.style.background = `none`
      //target.querySelector('.v-image__image--cover').style.backgroundImage = `url(${target.dataset.jpg})`
    },
  },

  async created(){ 
    this.items = await getTrending()
  },

  watch: {
    page(){
      console.log('new offset', this.offset)
    }
  },
}

</script>
