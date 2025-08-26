import json
import os
import tkinter as tk
from datetime import datetime
print("hello world")
global flock
flock = []
def flockHeart(input):
    newBird = {
        "value": input,
        "entryTime:": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "id": len(flock) + 1
    }
    flock.append(newBird)
    print(len(flock))
def main():
    window = tk.Tk()
    window.title("flock")
    label = tk.Label(text="welcome to the forest")
    label.pack()
    path = tk.Label(text = "the center stone", background="black", fg="white", width=20, height=10)
    path.grid()
    entry = tk.Entry()
    entry.pack()
    window.geometry("300x200+10+20")
    window.mainloop()
    # global flock
    # print("welcome to the flock")
    # flockExists = os.path.exists('flock.json')
    # if(flockExists):
    #     with open('flock.json') as f:
    #         flock = json.load(f)
    #         print(flock)
    # else:
    #     print("the flock is empty, would you like to begin a new flock?")
    #     new_flock = input("Enter 'yes' to create a new flock or 'no' to exit: ").strip().lower()
    # latestInput = ""
    # while(latestInput != "EXIT"):
    #     latestInput = input(">")
    #     if(latestInput != "EXIT"):
    #         flockHeart(latestInput)
    # print("saving flock...")
    # with open('flock.json', 'w') as f:
    #     json.dump(flock, f, default=str)
    # print(len(flock))
    # for bird in flock:
    #     print(bird)

if __name__ == "__main__":
    main()
    
