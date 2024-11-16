<template>
    <div class="search-bar">
      <label for="search-input">Search for hashtag or topic:</label>
      <input 
        type="text" 
        id="search-input" 
        v-model="searchQuery" 
        @keyup.enter="onSearch" 
        placeholder="Enter hashtag or topic"
      />
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      onSearch() {
        if (this.searchQuery) {
          this.$emit('search', this.searchQuery);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    margin-bottom: 20px;
  }
  
  input {
    padding: 10px;
    width: 80%;
    font-size: 1.2em;
  }
  </style>
  