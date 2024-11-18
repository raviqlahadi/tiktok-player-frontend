<template>
  <div>
    <v-container>
      <h3>Custom TikTok Video Player Prototype</h3>

      <!-- Search Bar -->
      <div class="search-bar">
        <el-input
          v-model="searchTerm"
          placeholder="Search for hashtag or topic"
          clearable
          @keyup.enter="searchVideos"
        />
        <el-button @click="searchVideos">Search</el-button>
      </div>

      <!-- Video Player -->
      <v-row v-if="video" class="video-player">
        <v-col cols="12" md="8">
          <div class="video-container">
            <video
              ref="video"
              v-if="videoUrl"
              :src="videoUrl"
              controls
              autoplay
              class="video"
              @timeupdate="trackWatchTime"
              @ended="onVideoEnd"
            ></video>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <h3>{{ video.author }}</h3>
          <p>{{ video.date_created }} - {{ video.description }}</p>
          <p v-if="video.tags">Tags: {{ video.tags }}</p>

          <!-- Display User Session and Vectorized Data -->
          <div class="user-session">
            <h4>Session Info</h4>
            <p>Session ID: {{ sessionId }}</p>
            <p>Search Vector: {{ JSON.stringify(sessionVectors, null, 2) }}</p>
          </div>

          <!-- Loading Spinner -->
          <div v-if="loading" class="loading-spinner">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              width="5"
            ></v-progress-circular>
          </div>

          <!-- Navigation Buttons -->
          <div class="navigation-buttons">
            <el-button @click="loadPreviousVideo" :disabled="currentIndex === 0">
              Previous
            </el-button>
            <el-button @click="loadNextVideo">Next</el-button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default {
  data() {
    return {
      searchTerm: "",
      video: null,
      videoUrl: null,
      videos: [],
      currentIndex: 0,
      loading: false,
      sessionId: this.getSessionId(),
      sessionVectors: {}, // Stores vectors for hashtags/search terms
      watchTime: 0, // Tracks watch time for the current video
    };
  },
  methods: {
    getSessionId() {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    },
    addOrUpdateVector(term, watchTime) {
      if (!term) return;

      // Initialize vector if term doesn't exist
      if (!this.sessionVectors[term]) {
        this.sessionVectors[term] = { count: 0, totalWatchTime: 0 };
      }

      // Update vector with new watch time
      this.sessionVectors[term].count += 1;
      this.sessionVectors[term].totalWatchTime += watchTime;

      // Persist updated sessionVectors to localStorage
      localStorage.setItem("sessionVectors", JSON.stringify(this.sessionVectors));
    },
    async searchVideos() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/category?hashtag=${encodeURIComponent(
            this.searchTerm
          )}`
        );
        this.videos = response.data;

        if (this.videos.length > 0) {
          this.loadVideo(0);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        this.loading = false;
      }
    },
    async loadVideo(index) {
      // Update vector for the current video before switching
      if (this.video && this.watchTime > 0) {
        const term = this.video.tags?.length
          ? this.video.tags.join(", ")
          : this.searchTerm;
        this.addOrUpdateVector(term, this.watchTime);
      }

      // Reset watch time and load the next video
      this.resetWatchTime();
      const videoData = this.videos[index];
      this.video = videoData;

      try {
        const proxyResponse = await axios.get(
          `${process.env.VUE_APP_API_URL}/proxy-video?url=${encodeURIComponent(
            videoData.playable_video_url
          )}`
        );
        this.videoUrl = proxyResponse.request.responseURL; // The final proxied video URL
      } catch (error) {
        console.error("Error fetching video through proxy:", error);
      }
    },
    resetWatchTime() {
      this.watchTime = 0;
    },
    trackWatchTime(event) {
      this.watchTime = event.target.currentTime;
    },
    onVideoEnd() {
      const term = this.video.tags?.length
        ? this.video.tags.join(", ")
        : this.searchTerm;
      this.addOrUpdateVector(term, this.watchTime);
    },
    loadNextVideo() {
      if (this.currentIndex < this.videos.length - 1) {
        this.currentIndex++;
        this.loadVideo(this.currentIndex);
      }
    },
    loadPreviousVideo() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.loadVideo(this.currentIndex);
      }
    },
  },
  mounted() {
    const savedVectors = localStorage.getItem("sessionVectors");
    if (savedVectors) {
      this.sessionVectors = JSON.parse(savedVectors);
    }
  },
};


</script>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  max-height: 80vh;
  background-color: black;
  overflow: hidden;
}

.video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  margin-bottom: 25px;
}

.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.user-session {
  margin-top: 20px;
  padding: 10px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-session h4 {
  margin-bottom: 10px;
}

</style>