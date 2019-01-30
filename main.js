var app = new Vue({
  el: '#app',
  template: '#main-page',
  data: {
    wordList: [],
    wordNumber: 1,
    selectedPeriod: '',
    period: {
      from: '',
      to: ''
    },
    periodList: [
      {id:'period-1', value:'', text:'指定しない'},
      {id:'period-2', value:'today', text:'本日のツイート'},
      {id:'period-3', value:'three_day', text:'過去3日間のツイート'},
      {id:'period-4', value:'week', text:'過去1週間のツイート'},
      {id:'period-5', value:'month', text:'過去1か月のツイート'},
      {id:'period-6', value:'three_year', text:'過去3年のツイート'},
      {id:'period-7', value:'customize', text:'自分で指定'}
    ],
    account: [
      {id:'account-1', value:'', text:'指定しない'},
      {id:'account-2', value:'all', text:'特定のアカウントに関するツイートのみ'},
      {id:'account-3', value:'tweet', text:'特定のユーザーがしたツイートのみ'},
      {id:'account-4', value:'reply_and_mention', text:'特定のユーザー宛てのツイートのみ'},
      {id:'account-5', value:'official', text:'認証アカウントのみ'}
    ],
    selectedAccount: '',
    accountText: '',
    media: [
      {id:'media-1', value:'image', text:'画像を含む'},
      {id:'media-2', value:'video', text:'動画を含む'},
      {id:'media-3', value:'link', text:'リンクを含む'}
    ],
    checkedMedia: [],
    language:[
      {id:'language-1', value:'', text:'指定しない'},
      {id:'language-2', value:'ja', text:'日本語'},
      {id:'language-3', value:'en', text:'英語'}
    ],
    checkedLanguage: '',
    retweet: 0,
    favorite: 0,
    reply: 0,
    number:[
      {id:'number-1', value:0, text:'指定しない'},
      {id:'number-2', value:10, text:'10件以上'},
      {id:'number-3', value:50, text:'50件以上'},
      {id:'number-4', value:100, text:'100件以上'},
      {id:'number-5', value:300, text:'300件以上'},
      {id:'number-6', value:500, text:'500件以上'},
      {id:'number-7', value:1000, text:'1000件以上'},
      {id:'number-8', value:3000, text:'3000件以上'},
      {id:'number-9', value:5000, text:'5000件以上'},
      {id:'number-10', value:10000, text:'10000件以上'},
      {id:'number-11', value:20000, text:'20000件以上'},
      {id:'number-12', value:30000, text:'30000件以上'},
      {id:'number-13', value:50000, text:'50000件以上'},
      {id:'number-14', value:70000, text:'70000件以上'},
      {id:'number-15', value:100000, text:'100000件以上'},
    ]
  },
  created: function() {
    this.period.from = this.formatDate(this.daysAgo(1), 'YYYY-MM-DD')
    this.period.to = this.formatDate(this.daysAgo(0), 'YYYY-MM-DD')
  },
  computed: {
    needsAccountName: function() {
      return this.selectedAccount === 'all' || this.selectedAccount === 'tweet' || this.selectedAccount === 'reply_and_mention'
    },
    periodIsCustomize: function() {
      return this.selectedPeriod === 'customize'
    }
  },
  methods: {
    daysAgo: function(day) {
      let date = new Date()
      date.setDate(date.getDate() - day);
      return date
    },
    formatDate: function(date, format) {
      let formatDate = format.replace(/YYYY/, date.getFullYear())
      formatDate = formatDate.replace(/MM/, ("0" + (date.getMonth() + 1)).slice(-2))
      return formatDate.replace(/DD/, ("0" + date.getDate()).slice(-2))
    },
    buildWord: function() {
      if (this.wordList.length === 0) return ''
      let word = ''
      for (n in this.wordList) {
        word += this.wordList[n] + ' '
      }
      return '&q=' + encodeURIComponent(word)
    },
    buildPeriod: function() {
      if (!this.selectedPeriod) return ['', '']

      if (this.selectedPeriod === 'today') {
        return [encodeURIComponent(' since:' + this.formatDate(this.daysAgo(0), 'YYYY-MM-DD')), '']
      }
      
      if (this.selectedPeriod === 'three_day') {
        return [encodeURIComponent(' since:' + this.formatDate(this.daysAgo(3), 'YYYY-MM-DD')), '']
      }
      
      if (this.selectedPeriod === 'week') {
        return [encodeURIComponent(' since:' + this.formatDate(this.daysAgo(7), 'YYYY-MM-DD')), '']
      }
      
      if (this.selectedPeriod === 'month') {
        return [encodeURIComponent(' since:' + this.formatDate(this.daysAgo(30), 'YYYY-MM-DD')), '']
      }
      
      if (this.selectedPeriod === 'three_year') {
        return [encodeURIComponent(' since:' + this.formatDate(this.daysAgo(1095), 'YYYY-MM-DD')), '']
      }
      
      let from, to = ''
      if (this.selectedPeriod === 'customize') {
        if (this.period.from) from = encodeURIComponent(' since:' + this.period.from)
        if (this.period.to) to = encodeURIComponent(' until:' + this.period.to)
        return [from, to]
      }

      return [from, to]
    },
    buildAccount: function() {
      if (!this.selectedAccount || !this.accountText) return ''

      if(this.selectedAccount === 'all') {
        return encodeURIComponent(' @' + this.accountText)
      }
      
      if(this.selectedAccount === 'tweet') {
        return encodeURIComponent(' from:' + this.accountText)
      }
      
      if(this.selectedAccount === 'reply_and_mention') {
        return encodeURIComponent(' to:' + this.accountText)
      }

      if (this.selectedAccount === 'official') {
        return encodeURIComponent(' filter:verified')
      }
      return ''
    },
    buildImage: function() {
      if (!this.image) return ''
      return encodeURIComponent(' filter:images')
    },
    buildVideo: function() {
      if (!this.video) return ''
      return encodeURIComponent(' filter:videos')
    },
    buildLink: function() {
      if (!this.link) return ''
      return encodeURIComponent(' filter:links')
    },
    buildLanguage: function() {
      if (!this.checkedLanguage) return ''
      return encodeURIComponent(' lang:' + this.checkedLanguage)
    },
    buildRetweet: function() {
      if (!this.retweet) return ''
      return encodeURIComponent(' min_retweets:' + this.retweet)
    },
    buildFavorite: function() {
      if (!this.favorite) return ''
      return encodeURIComponent(' min_faves:' + this.favorite)
    },
    buildReply: function() {
      if (!this.reply) return ''
      return encodeURIComponent(' min_replies:' + this.reply)
    },
    buildUrl: function () {
      let word = this.buildWord()

      let [from, to] = this.buildPeriod()

      let account = this.buildAccount()

      let image = this.buildImage()
      let video = this.buildVideo()
      let link = this.buildLink()

      let language = this.buildLanguage()

      let retweet = this.buildRetweet()
      let favorite = this.buildFavorite()
      let reply = this.buildReply()

      let url = 'https://twitter.com/search?f=tweets'
      if (word) url += word
      if (from) url += from
      if (to) url += to
      if (account) url += account
      if (image) url += image
      if (video) url += video
      if (link) url += link
      if (language) url += language
      if (retweet) url += retweet
      if (favorite) url += favorite
      if (reply) url += reply
      return url
    },
    addWord: function(event) {
      this.wordNumber++
    },
    search: function(event) {
      window.open(this.buildUrl(), 'tweetsearch', '')
    },
    resetData: function(event) {
      this.wordList = ['']
      this.wordNumber = 1

      this.selectedPeriod = ''
      this.period.from = ''
      this.period.to = ''

      this.selectedAccount = ''
      this.accountText = ''

      this.checkedMedia = []

      this.checkedLanguage = ''

      this.retweet = 0

      this.favorite = 0

      this.reply = 0
    }
  }
})
