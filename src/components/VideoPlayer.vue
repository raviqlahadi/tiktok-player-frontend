<template>
    <div class="video-player">
      <video 
        :src="'http://localhost:8080/proxy-video?url=' + encodeURIComponent(video.playable_video_url)" 
        controls 
        autoplay
      />
      <div class="video-info">
        <p><strong>Username:</strong> {{ username }}</p>
        <p><strong>Date Created:</strong> {{ date }}</p>
        <p><strong>Description:</strong> {{ description }}</p>
        <p><strong>Tags:</strong> {{ tags ? tags.join(', ') : 'None' }}</p>
      </div>
      <div class="navigation">
        <button @click="prevVideo">Previous</button>
        <button @click="nextVideo">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['video', 'username', 'date', 'description', 'tags'],
    methods: {
      nextVideo() {
        this.$emit('next');
      },
      prevVideo() {
        this.$emit('prev');
      }
    }
  };
  </script>
  
  <style scoped>
  .video-player {
    text-align: center;
    padding: 20px;
  }
  
  video {
    max-width: 100%;
    height: auto;
  }
  
  .video-info {
    margin-top: 10px;
  }
  
  .navigation {
    margin-top: 20px;
  }
  
  button {
    padding: 10px;
    margin: 5px;
    font-size: 1em;
    cursor: pointer;
  }
  </style>
  