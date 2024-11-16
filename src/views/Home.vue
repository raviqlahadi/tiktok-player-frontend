<template>
  <div>
    <h1>Trending Videos</h1>
    <div v-for="(video, index) in videos" :key="index" class="video-container">
    <video :src="'http://localhost:8080/proxy-video?url=' + encodeURIComponent(video.playable_video_url)" controls>

        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      videos: [],
    };
  },
  computed: {
    ...mapGetters(['allVideos']),
  },
  methods: {
    ...mapActions(['fetchTrendingVideos']),
    async loadTrendingVideos() {
      await this.fetchTrendingVideos();
      this.videos = this.allVideos;
    },
  },
  mounted() {
    this.loadTrendingVideos();
  },
};
</script>

<style scoped>
.video-container {
  margin: 10px;
}
</style>
