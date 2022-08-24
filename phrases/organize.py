import subprocess
import os

length = len([name for name in os.listdir('.') if os.path.isfile(name)]) - 3

CATEGORYS = ['Writers', 'Peoples', 'Series', 'Movies', 'Games', 'Animations']

for i in range(length):
    file = open(f'{i}.txt', 'r') 
    lines = file.readlines()

    for line in lines:
        print(line)

    counter = 0
    for category in CATEGORYS:
        print(f'[{counter}] {category}')
        counter += 1
    choosed = int(input('--> '))

    command = subprocess.Popen(f"mv {i}.txt {CATEGORYS[choosed]}", stdout=subprocess.PIPE, shell=True)
    command.communicate()

