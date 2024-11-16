import { createStore } from "vuex";

export default createStore({
    state: {
        videos: [],
    },
    mutations: {
        setVideos(state, videos){
            state.videos = videos;
        }
    },
    actions: {
        async fetchTrendingVideos({ commit }){
            try {
                const response = await fetch('http://localhost:8080/trending');
                const videos = await response.json();    
                commit('setVideos', videos)
            } catch (error) {
                console.error("Failed to fetch trending videos")
            }
            
            
        }
    },
    getters: {
        allVideos: (state) => state.videos, 
    }
});
