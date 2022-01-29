import os.path
from os import listdir
from os.path import isfile, join

path = os.path.dirname(os.path.realpath(__file__))

print([file for file in listdir(path) if isfile(join(path, file))])