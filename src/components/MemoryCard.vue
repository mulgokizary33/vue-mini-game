<template>
  <div class="container">
    <el-row class="control-panel" type="flex" justify="space-around">
      <el-button type="primary">
        Turns: {{ turns }}
      </el-button>
      <el-button type="primary">
        Total Time: {{min}} : {{sec}}
      </el-button>
      <el-button type="success" v-if="!start" @click="clickStart" :loading="loading">开始</el-button>
      <el-button type="danger" v-else @click="clickReset">重置</el-button>
    </el-row>
    <el-row class="game-wrapper" :class="{ 'disabled': !start }">
      <el-col class="flip-container" :span="4" v-for="card in memoryCards" :key="card.id">
        <div class="memorycard" :class="{ 'flipped': card.isFlipped, 'matched': card.isMatched }" @click="flipCard(card)">
          <div class="front card">
            <img width="105" src="../assets/images/memorycard/pattern.png" />
          </div>
          <div class="back card">
            <img width="105" :src="require('../assets/images/memorycard/'+card.img)" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MemoryCard',
  data () {
    return {
      loading: false,
      memoryCards: [],
      flippedCards: [],
      finished: false,
      start: false,
      turns: 0,
      totalTime: {
        minutes: 0,
        seconds: 0
      },
      cards: [
        {
          id: 'joker_red',
          name: 'joker_red',
          img: 'joker_red.jpg'
        },
        {
          id: 'joker_black',
          name: 'joker_black',
          img: 'joker_black.jpg'
        },
        {
          id: '3_black',
          name: '3_black',
          img: '3_black.jpg'
        },
        {
          id: '4_black',
          name: '4_black',
          img: '4_black.jpg'
        },
        {
          id: '5_black',
          name: '5_black',
          img: '5_black.jpg'
        },
        {
          id: '6_black',
          name: '6_black',
          img: '6_black.jpg'
        }
      ]
    }
  },
  methods: {
    initMemoryCards () {
      this.cards.forEach((card) => {
        this.$set(card, 'isFlipped', false)
        this.$set(card, 'isMatched', false)
      })
      this.memoryCards = []
      const cardCopy = this.cards.map(item => ({
        id: item.id + '_copy',
        name: item.name,
        img: item.img,
        isFlipped: item.isFlipped,
        isMatched: item.isMatched
      }))
      this.memoryCards = this._.shuffle(this.memoryCards.concat(this._.cloneDeep(this.cards), this._.cloneDeep(cardCopy)))
    },
    flipCard (card) {
      if (card.isMatched || card.isFlipped || this.flippedCards.length === 2) {
        return
      }
      if (!this.start) {
        this.startGame()
      }
      card.isFlipped = true
      if (this.flippedCards.length < 2) {
        this.flippedCards.push(card)
      }
      if (this.flippedCards.length === 2) {
        this.cardMatch(card)
      }
    },
    cardMatch (card) {
      this.turns++
      if (this.flippedCards[0].name === this.flippedCards[1].name) {
        setTimeout(() => {
          this.flippedCards.forEach(card => { card.isMatched = true })
          this.flippedCards = []

          if (this.memoryCards.every(card => card.isMatched === true)) {
            this.finished = true
            this.start = false
            clearInterval(this.interval)
            this.$message({
              message: '恭喜过关',
              type: 'success'
            })
          }
        }, 400)
      } else {
        setTimeout(() => {
          this.flippedCards.forEach(card => { card.isFlipped = false })
          this.flippedCards = []
        }, 800)
      }
    },
    clickStart () {
      this.loading = true
      this.memoryCards.forEach((card) => {
        this.$set(card, 'isFlipped', true)
      })
      setTimeout(() => {
        this.$message({
          showClose: true,
          message: '5秒后开始',
          duration: 5000
        })
      }, 0)
      setTimeout(() => {
        this.memoryCards.forEach((card) => {
          this.$set(card, 'isFlipped', false)
        })
        this.startGame()
      }, 5000)
    },
    clickReset () {
      clearInterval(this.interval)
      this.initMemoryCards()
      setTimeout(() => {
        this.totalTime.minutes = 0
        this.totalTime.seconds = 0
        this.start = false
        this.finished = false
        this.turns = 0
        this.flippedCards = []
        this.loading = false
      }, 600)
    },
    startGame () {
      this.tick()
      this.interval = setInterval(this.tick, 1000)
      this.loading = false
      this.start = true
    },
    tick () {
      if (this.totalTime.seconds !== 59) {
        this.totalTime.seconds++
        return
      }

      this.totalTime.minutes++
      this.totalTime.seconds = 0
    }
  },
  computed: {
    sec () {
      if (this.totalTime.seconds < 10) {
        return '0' + this.totalTime.seconds
      }
      return this.totalTime.seconds
    },
    min () {
      if (this.totalTime.minutes < 10) {
        return '0' + this.totalTime.minutes
      }
      return this.totalTime.minutes
    }
  },
  created () {
    this.cards.forEach((card) => {
      this.$set(card, 'isFlipped', false)
      this.$set(card, 'isMatched', false)
    })
    const cardCopy = this.cards.map(item => ({
      id: item.id + '_copy',
      name: item.name,
      img: item.img,
      isFlipped: item.isFlipped,
      isMatched: item.isMatched
    }))
    this.memoryCards = this._.shuffle(this.memoryCards.concat(this._.cloneDeep(this.cards), this._.cloneDeep(cardCopy)))
  }
}
</script>

<style scoped lang="scss">
.container{
  width: 960px;
  margin: 0 auto;
  .control-panel{
    padding: 20px 0;
  }
  .disabled{
    pointer-events: none;
  }
  .game-wrapper{
    margin-top: 40px;
    padding: 20px;
    padding-top: 0;
    border: 1px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    border-radius: 20px;
    .flip-container {
      min-height: 120px;
      position: relative;
      margin-top: 20px;
      .memorycard{
        width: 105px;
        margin: 0 auto;
        cursor: pointer;
        perspective:1000;
        transform-style:preserve-3d;
        backface-visibility:hidden;
        .front, .back {
          width: 100%;
          transition: 0.6s;
          transform-style: preserve-3d;
          backface-visibility:hidden;
          top: 0;
          left: 0;
        }
        .back{
          transform: rotateY(-180deg);
          position: absolute;
        }
      }
      .flipped{
        .back{
          transform: rotateY(0deg);
        }
        .front{
          transform: rotateY(-180deg);
        }
      }
      .matched{
        opacity: 0.3;
        position: relative;
      }
    }
  }
}

</style>
