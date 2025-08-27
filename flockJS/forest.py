import json
import random
import os
print("hello world")

directionOptions = ["north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest"]
placeTypes = ["landmark", "tree"]

def createTree(sourceDirection, depth):
    types = ["oak", "pine", "birch", "maple", "willow", "redwood", "cedar", "spruce", "cherry", "apple"]
    sizes = ["sapling", "middling", "large", "giant", "towering"]
    qualities = ["gnarled", "bleached", "twin-trunked", "twisting", "sparse", "late-budding"]
    aspects = ["deep roots", "bark wrapping in strange patterns", "wide, low branches as though climbable"]
    tree = {
        "type": "tree",
        "name": "",
        "description": "",
        "directions" : [],
        # on traversal, choosing sourcedirection returns to parent entity
        "sourceDirection": sourceDirection,
        "scrolls": [],
    }
    directionsCt = random.randint(0, len(directionOptions)-1)
    dirIndex = 0; 
    while(dirIndex < directionsCt):
        dirChoice = random.choice(directionOptions)
        if(dirChoice not in tree["directions"] and dirChoice != sourceDirection):
            tree["directions"].append(dirChoice)
            if(depth > 0):
                tree[dirChoice] = createTree(oppositeDirection(dirChoice), depth - 1);
            dirIndex += 1
    tree["name"] = f"a {random.choice(qualities)} {random.choice(sizes)} {random.choice(types)} tree"
    tree["description"] = f"it has {random.choice(aspects)}"
    return tree

def main():
    global forest
    forestExists = os.path.exists('forest.json')
    if(forestExists):
        with open('forest.json') as f:
            forest = json.load(f)
            print(forest)
            inscriptions = forest[0]["inscriptions"]
            print(forest)
            print(f"inscription count: {len(inscriptions)}")
        if(input("do you want to overwrite the existing forest? (y/n) > ") == "y"):
            newForest()
        else:
            return
    else:
        newForest()

def newForest():
    forest = []
    print("this is the forest creator. this is where the structure is grown")
    forest += [{
        "name": "the center stone",
        "description": "the starting point",
        "directions" : ["north", "south", "east", "west"],
        "north": [],
        "south": [],
        "east": [],
        "west": [],
        "inscriptions": [],
        "scrolls": [],
    }]
    depth = 3
    for direction in forest[0]["directions"]:
        forest[0][direction] = createTree(oppositeDirection(direction), depth)
    print(forest)
    with open('forest.json', 'w') as f:
        json.dump(forest, f, default=str, indent=4)

def oppositeDirection(direction):
    if(direction == "north"):
        return "south"
    if(direction == "south"):
        return "north"
    if(direction == "east"):
        return "west"
    if(direction == "west"):
        return "east"
    if(direction == "up"):
        return "down"
    if(direction == "down"):
        return "up"
    if(direction == "northeast"):
        return "southwest"
    if(direction == "northwest"):
        return "southeast"
    if(direction == "southeast"):
        return "northwest"
    if(direction == "southwest"):
        return "northeast"
    return ""

if __name__ == "__main__":
    main()
    