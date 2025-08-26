import json
print("hello world")
forest = []
directions = ["north", "south", "east", "west", "up", "down", "northeast", "northwest", "southeast", "southwest"]

def createTree():
    types = ["oak", "pine", "birch", "maple", "willow", "redwood", "cedar", "spruce", "cherry", "apple"]
    sizes = ["sapling", "medium", "large", "giant", "towering"]
    qualities = ["gnarled", "twin-trunked", "twisting", "sparse", "late-budding"]
    
    tree = {
        "name": 

    }

    return tree

def main():
    print("this is the forest creator. this is where the structure is grown")
    forest += [{
        "name": "the center stone",
        "description": "the starting point",
        "directions" : ["north", "south", "east", "west"],
        "north": [],
        "south": [],
        "east": [],
        "west": [],
    }]
    for direction in forest[0]["directions"]:
        forest[0][direction]


if __name__ == "__main__":
    main()
    