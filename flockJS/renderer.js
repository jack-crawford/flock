const { createApp } = Vue;
function index(obj,is, value) {
    //credit here to stack https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference
    if (typeof is == 'string')
        return index(obj,is.split('.'), value);
    else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length==0)
        return obj;
    else
        return index(obj[is[0]],is.slice(1), value);
}
createApp({
  data() {
    return {
      scrollEntry: '',
      flock: [],
      forest: [],
      path: "",
      prettyPath: "",
      activeNode: {},
    };
  },
  methods: {
    navigate(direction) {
        console.log("heading: " + direction.srcElement.value)
        direction = direction.srcElement.value.toLowerCase().trim();
        if(this.path == "") {
            this.path = direction;
            this.prettyPath += "/ " + this.activeNode.name
            this.activeNode = index(JSON.parse(JSON.stringify(this.forest)), this.path);
        } else {
            if(this.activeNode.sourceDirection == direction) {
                console.log("going back");
                console.log(this.path);
                if(this.path.includes(".")){
                    console.log("has .")
                    this.path = this.path.substring(0, this.path.lastIndexOf("."));
                    this.prettyPath = this.prettyPath.substring(0, this.prettyPath.lastIndexOf("/ ")-1);
                } else {
                    console.log("resetting to the center")
                    this.path = "";
                    this.prettyPath = "the center stone ";
                    this.activeNode = JSON.parse(JSON.stringify(this.forest));
                }
            } else {
                //advance
                this.prettyPath += "/ " + this.activeNode.name
                console.log(this.prettyPath)
                this.path = this.path + "." + direction;
                this.activeNode = index(JSON.parse(JSON.stringify(this.forest)), this.path);
            }
            console.log(this.path);
        }

    },
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
    },
    getForestFromMain() {
      window.electronAPI.getForest((forest) => {
        console.log('Forest data received from main:', forest);
        this.forest = forest[0];
        this.activeNode = this.forest;
        console.log(this.forest)
        this.prettyPath = "the center stone ";
        //this.navigate("north");

      });
    }
  },
  mounted() {
    this.getFlockFromMain();
    this.getForestFromMain();
    setTimeout(() => {
        var flocklist = document.getElementById("flockList");
        flocklist.scrollTop = flocklist.scrollHeight + 25;
    }, 500)
    
  }
}).mount('#app');