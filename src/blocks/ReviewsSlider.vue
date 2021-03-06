<template>
  <div class="reviewsContainer" data-aos="fade-up"
       data-aos-delay="50" data-aos-duration="800">
    <a id="reviews-about-zksync"/>
    <transition name="slideFromLeft">
      <div v-if="currentItem>0" class="arrow left _hidden-md-and-down"
           @click="scrollItem('minus')">
        <i class="fal fa-angle-left"/>
      </div>
    </transition>
    <transition name="slideFromRight">
      <div v-if="currentItem<(totalItems-1) && displayRightArrow" class="_hidden-md-and-down arrow right" @click="scrollItem('plus')">
        <i class="fal fa-angle-right"/>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="currentItem<(totalItems-1) && displayRightArrow" class="gradient right"/>
    </transition>
    <transition name="fade">
      <div v-if="currentItem>0" class="gradient left"/>
    </transition>
    <i-container ref="container">
      <div class="itemsContainer" :style="{'transform': `translateX(-${leftPosition-scrollOffset}px)`}">
        <a
          v-for="(singleReview) in reviewsData"
          :id="singleReview.id"
          :key="singleReview.ref"
          :ref="singleReview.ref"
          :href="singleReview.link"
          class="reviewItem"
          target="_blank"
        >
          <div class="reviewHeader">
            <img
              v-if="singleReview.thumbnail"
              :src="getAssetUrl(singleReview.thumbnail)"
              :alt="singleReview.thumbnailAlt"
              :title="singleReview.thumbnailTitle"
            >
            <span v-if="singleReview.title">{{ singleReview.title }}</span>
          </div>
          <div class="reviewText grayText">
            {{ singleReview.text }}
            <i-badge v-if="singleReview.isUpcoming" variant="secondary _upcoming-h3">upcoming</i-badge>
          </div>
          <z-button
            v-if="singleReview.isButton"
            css-class='width-300'
            href='https://zksync.curve.fi'
            outline="outline"
            size='xs'
            target='_blank'
          >Try <strong>Curve + zkSync</strong> testnet
          </z-button>
          <span v-if="!singleReview.isButton" class="arrowLink">
            <i class="fal fa-arrow-up"/>
          </span>
        </a>
      </div>
    </i-container>
  </div>
</template>

<script type="ts">
import Hammer from "hammerjs";
import ZButton from "~/components/ZButton.vue";

export default {
  components: {
    ZButton,
  },
  props: {
    reviewsData: {
      default: () => {
        return [
          {
            id: null,
            ref: 1,
            title: null,
            link: "https://resources.curve.fi/guides/more.../layer-2-meets-curve-with-zksync",
            thumbnail: "curve.svg",
            thumbnailAlt: "Curve Finance - automatic market-making for stablecoins and not only",
            thumbnailTitle: "Curve + zkSync L2: Ethereum’s first user-defined ZK rollup smart contract!",
            text: "ZK rollups are extremely secure even with a single validator, as they rely on pure math",
          },
          {
            id: null,
            ref: 2,
            link: "https://vitalik.ca/general/2021/01/05/rollup.html#conclusions",
            thumbnail: "buter.png",
            thumbnailAlt: "Vitalik Buterin, co-founder of Ethereum about zkSynk",
            thumbnailTitle: "Writer who is best known as one of the co-founders of Ethereum, involved with cryptocurrency early in its inception",
            text: "In the medium to long term ZK rollups will win out in all use cases as ZK-SNARK technology improves.",
            title: "Vitalik Buterin",
          },
          {
            id: "balancer-review",
            ref: 3,
            title: null,
            link: "https://twitter.com/mikeraymcdonald/status/1321095035539148800?s=21",
            thumbnail: "balancer.svg",
            thumbnailAlt: "Mike McDonal, CTO @BalancerLabs",
            thumbnailTitle: "Mike McDonal, Co-founder & CTO @BalancerLabs. Security Engineer about ZK Rollups",
            text: "ZK rollups are the most promising (and the only scaling path Balancer is exploring internally atm).",
          },
        ];
      },
      require: true,
      type: Array,
    },
  },
  data() {
    return {
      totalItems: this.reviewsData.length,
      currentItem: 0,
      displayRightArrow: true,
      scrollOffset: 0,
    };
  },
  computed: {
    leftPosition() {
      if (this.$refs.container) {
        const inViewNow = Math.max(1, this.itemsInView());
        if (inViewNow === 1) {
          return Math.max(0, this.currentItem * 257 - 10);
        }
      }
      return Math.max(0, this.currentItem * 257 - 10);
    },
  },
  watch: {
    currentItem() {
      this.checkArrowDisplay();
      this.scrollOffset = 0;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.checkArrowDisplay();
      });
    }, 0);
    window.addEventListener("resize", this.checkArrowDisplay);
    const galleryBlock = document.querySelector(".reviewsContainer");
    new Hammer(galleryBlock).on("pan", (e) => {
      if (e.direction !== 2 && e.direction !== 4) {
        return;
      }
      if (!e.isFinal) {
        this.scrollOffset = Math.min(Math.abs(e.deltaX), 360) * Math.sign(e.deltaX);
      } else {
        if (Math.abs(this.scrollOffset) > 50) {
          if (Math.sign(this.scrollOffset) < 0) {
            if (this.currentItem < this.totalItems - 1 && this.displayRightArrow) {
              this.scrollItem("plus");
            }
          } else if (this.currentItem > 0) {
            this.scrollItem("minus");
          }
        }
        this.scrollOffset = 0;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkArrowDisplay);
  },
  methods: {
    scrollItem(direction) {
      const inViewNow = Math.max(1, this.itemsInView());
      if (direction === "plus") {
        const scrollTo = this.currentItem + Math.max(1, inViewNow);
        this.currentItem = Math.min(scrollTo, Object.keys(this.$refs).length - 1 - inViewNow);
      } else {
        const scrollTo = this.currentItem - Math.max(1, inViewNow);
        this.currentItem = Math.max(scrollTo, 0);
      }
    },
    itemsInView() {
      let inViewTotal = 0;
      const refsKeys = Object.keys(this.$refs);
      const containerSizes = this.$refs.container.$el.getBoundingClientRect();
      for (const item in refsKeys) {
        if (item === "container" || !this.$refs[item]) {
          continue;
        }
        if (!this.$refs[item] || typeof this.$refs[item] !== "object" || this.$refs[item].getBoundingClientRect !== "function") {
          continue;
        }
        const itemSizes = this.$refs[item].getBoundingClientRect();
        if (itemSizes.left >= containerSizes.left - 20 && itemSizes.right <= containerSizes.right + 20) {
          inViewTotal++;
        }
      }
      return inViewTotal;
    },
    checkArrowDisplay() {
      const inViewNow = Math.max(1, this.itemsInView());
      this.displayRightArrow = !(inViewNow > 1 && this.currentItem + inViewNow >= this.totalItems);
    },

    /**
     * @param img
     * @returns {any}
     */
    getAssetUrl(img) {
      return require("@/assets/images/pages/index/" + img);
    },
  },
};
</script>
