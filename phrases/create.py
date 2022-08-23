import subprocess

index = input("Index: ")

while True:
    phrase = input("Phrase: ")
    author = input("Author: ")

    command = subprocess.Popen(f"./auto '{phrase}' '{index}' '{author}'" , stdout=subprocess.PIPE, shell=True)
    command.communicate()

    index = int(index) + 1;
