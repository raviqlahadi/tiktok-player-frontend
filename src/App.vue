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
          <video v-if="videoUrl" :src="videoUrl" controls autoplay class="video"></video>
        </v-col>
        <v-col cols="12" md="4">
          <h3>{{ video.author }}</h3>
          <p>{{ video.date_created }} - {{ video.description }}</p>
          <p v-if="video.tags">Tags: {{ video.tags }}</p>

          <!-- Loading Spinner -->
          <div v-if="loading" class="loading-spinner">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              width="5"
            ></v-progress-circular>
          </div>

          <div class="navigation-buttons">
            <el-button @click="loadPreviousVideo" :disabled="currentIndex === 0">Previous</el-button>
            <el-button @click="loadNextVideo">Next</el-button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      searchTerm: "",
      video: null,
      videoUrl: null,
      videos: [],
      currentIndex: 0,
      loading: false
    };
  },
  methods: {
    async searchVideos() {
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:8080/category?hashtag=${encodeURIComponent(this.searchTerm)}`);
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
      const videoData = this.videos[index];
      this.video = videoData;

      try {
        const proxyResponse = await axios.get(`http://localhost:8080/proxy-video?url=${encodeURIComponent(videoData.playable_video_url)}`);
        this.videoUrl = proxyResponse.request.responseURL; // The final proxied video URL
      } catch (error) {
        console.error("Error fetching video through proxy:", error);
      }
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
    }
  }
};
</script>

<style scoped>
.video-container {
  text-align: center;
  margin-top: 20px;
}

.video-player {
  max-width: 100%;
}

.video {
  width: 100%;
  height: auto;
}

.v-card {
  max-width: 800px;
  margin: 0 auto;
}

.v-btn {
  margin-top: 10px;
}


/* Position the loading spinner to cover the full page */
.loading-spinner {
  position: fixed; /* Fixed position to overlay the whole screen */
  top: 0; /* Align it to the top of the screen */
  left: 0; /* Align it to the left of the screen */
  width: 100vw; /* Make it the full viewport width */
  height: 100vh; /* Make it the full viewport height */
  background-color: rgba(0, 0, 0, 0.7); /* Black background with opacity */
  display: flex; /* Flexbox to center the spinner */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  z-index: 1000; /* Ensure it's on top of other content */
}

/* Optional: Adjust spinner size */
.v-progress-circular {
  color: white; /* White spinner color for contrast */
}

.search-bar {
  display: flex;
  align-items: center; /* Vertically align the items in the center */
  gap: 10px; /* Space between the input and button */
  margin-top: 25px;
  margin-bottom: 25px;
}

.el-input {
  flex: 1; /* Allow input to take available space */
}

.el-button {
  flex-shrink: 0; /* Prevent the button from shrinking */
}
</style>