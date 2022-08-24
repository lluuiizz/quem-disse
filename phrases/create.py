import subprocess
import os
CATEGORYS = ['Writers', 'Peoples', 'Series', 'Movies', 'Games', 'Animations']

def countFiles(path):
    return len([entry for entry in os.listdir(path) if os.path.isfile(os.path.join(path, entry))])


while True:
    phrase = input("Phrase: ")
    author = input("Author: ")
    counter = 0

    for category in CATEGORYS:
        dir_path = f'./{category}'
        num_of_files = countFiles(dir_path)
        print(f"[{counter}] {category}: {num_of_files}")
        counter += 1
    choose = int(input('--> '))

    initIndexOfChoosed = countFiles(f'./{CATEGORYS[choose]}') + 1
    command = subprocess.Popen(f"./auto '{phrase}' './{CATEGORYS[choose]}/{initIndexOfChoosed}' '{author}'" , stdout=subprocess.PIPE, shell=True)
    command.communicate()

