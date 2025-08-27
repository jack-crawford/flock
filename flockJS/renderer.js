const { createApp } = Vue;
function index(obj, path, value) {
    //credit here to stack https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference
    if (typeof path == 'string')
        return index(obj,path.split('.'), value);
    else if (path.length==1 && value!==undefined){
        console.log("setting value", obj[path[0]], value)
        return obj[path[0]] = value;
    }else if (path.length==0)
        return obj;
    else
        return index(obj[path[0]],path.slice(1), value);
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
      activeScroll: {
        lastUpdated:null,
        path: ""
      },
      activeScrollContent: ""
    };
  },
  watch: {
    activeScrollContent: function(newContent) {
        console.log(newContent)
        this.activeScrollContent = newContent;
        this.activeScroll.lastUpdated = new Date().toISOString();
        this.saveScroll();
    }
  },
  methods: {
    saveScroll(){
        //also save the scroll properties to the forest
        console.log("Trying to save")
        window.electronAPI.sendScroll(this.activeScroll.path, this.activeScrollContent);
    },
    loadScroll(){
        window.electronAPI.getScroll(this.activeScroll.path, (scroll) => {
            this.activeScrollContent = scroll
        })
    },
    move(direction) {
        if(this.path == "") {
            this.path = direction;
            this.activeNode = index(JSON.parse(JSON.stringify(this.forest)), this.path);
            this.prettyPath += "/ " + this.activeNode.name

        } else {
            console.log(this.activeNode)
            if(this.activeNode.sourceDirection == direction || direction == "back") {
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
                console.log(this.prettyPath)
                this.path = this.path + "." + direction;
                this.activeNode = index(JSON.parse(JSON.stringify(this.forest)), this.path);
                this.prettyPath += "/ " + this.activeNode.name
            }
            console.log(this.path);
        }
        if(this.activeNode.scrolls != undefined && this.activeNode.scrolls.length > 0){
            //load scroll at path
            this.activeScroll.path = this.prettyPath.replace(/ /g, "_").toLowerCase() + ".md";
            this.loadScroll();
        } else {
            this.activeScroll = {
                path: "",
                lastUpdated:null,
            }
            this.activeScrollContent = "";
        }
        console.log(this.activeNode.scrolls)
    },
    look(direction){
        if (!this.activeNode.directions.includes(direction)) {
            this.activeNode.directions.push(direction);

            // Update the forest with the modified activeNode at the correct path
            if (this.path) {
                index(this.forest, this.path, this.activeNode);
            } else {
                this.forest = this.activeNode;
            }

            window.electronAPI.sendForest([JSON.parse(JSON.stringify(this.forest))]);
        } else {
            console.log("this direction already exists");
        }
    },
    write(){
        this.activeScroll.path = this.prettyPath.replace(/ /g, "_").toLowerCase() + ".md";
        this.loadScroll();
        this.activeNode.scrolls = [this.activeScroll];
        console.log(this.activeNode)
        //save scroll to the forest
        if (this.path) {
            index(this.forest, this.path, this.activeNode);
        } else {
            this.forest = this.activeNode;
        }        
        window.electronAPI.sendForest([JSON.parse(JSON.stringify(this.forest))]);
    },
    navigate(directionEl) {
        direction = directionEl.srcElement.value.toLowerCase().trim();
        command = direction.split(" ")[0];
        heading = direction.split(" ")[1];
        console.log("command: " + command)
        switch(command){
            case "go":
                console.log("heading: " + heading)
                this.move(heading);
                break;
            case "look":
                this.look(heading);
                break;
            case "write":
                this.write();
                break;
            default:
                console.log("unknown command: " + command)
                break;
        }
        
        document.getElementById("navigator").value = "";

    },
    onInput(e) {
        console.log(e);
        // Only add bird when a space is typed
        if (e.data && /\W/.test(e.data)) { // Checks for non-alphanumeric character
            const words = this.activeScrollContent.split(' ');
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
        this.activeScroll.path = this.prettyPath.replace(/ /g, "_").toLowerCase() + ".md";
        console.log(this.activeScroll.path)
        this.loadScroll();
        console.log(this.activeNode.scrolls)
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