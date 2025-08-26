const { createApp } = Vue;

createApp({
  data() {
    return {
      scrollEntry: '',
      flock: []
    };
  },
  methods: {
    onInput(e) {
      // Only add bird when a space is typed
    if (e.data && /\W/.test(e.data)) { // Checks for non-alphanumeric character
      const words = this.scrollEntry.split(' ');
      const lastWord = words[words.length - 2];
      if (lastWord) {
        this.flock.push({
        value: lastWord,
        entryDateTime: new Date().toISOString(),
        id: this.flock.length + 1
        });
        var flocklist = document.getElementById("flockList");
        flocklist.scrollTop = flocklist.scrollHeight + 25;
      }
    }
      window.electronAPI.sendFlock(JSON.parse(JSON.stringify(this.flock)));
    },
    getFlockFromMain() {
      window.electronAPI.getFlock((flock) => {
        if (Array.isArray(flock)) {
          this.flock = flock;
        }
        setTimeout(() => {
            var flocklist = document.getElementById("flockList");
            flocklist.scrollTop = flocklist.scrollHeight + 25;
        }, 500)
        
        console.log(flocklist.scrollHeight)
        console.log('Flock data received from main:', flock);
      });
    }
  },
  mounted() {
    this.getFlockFromMain();
    setTimeout(() => {
        var flocklist = document.getElementById("flockList");
        flocklist.scrollTop = flocklist.scrollHeight + 25;
    }, 500)
  }
}).mount('#app');