#!/usr/bin/python

import hashlib
import sys
import random


# Congradulations on finding this.
# This is the script used to generate the merkle puzzles
# you can't use this to cheat, but you can use it to check that your doing it right


numbers = ['m','e','r','k','l']

#print out: number, salt, hash
merkle = "merkle"
ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

for a in range(1000):
	puzzleList=[]
	for i in range(10):
	    puzzleList.append(random.choice(merkle))

	puzzle = "".join(puzzleList)

	saltList=[]
	for i in range(20):
	    saltList.append(random.choice(ALPHABET))

	salt = "".join(saltList)

	psw = 'flynn{' + puzzle + ':' + salt + '}'
	m = hashlib.sha1(psw).hexdigest()
	print "{0}. salt:{1}   hash:{2}  puzzle{3}".format(a, salt, m, puzzle)