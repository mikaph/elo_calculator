import random

a = 1
b = 5
a_voitot = 0
b_voitot= 0 

def get_random_number(skill_number):
    number = pow(((skill_number/100)*random.uniform(0, 1)),4)

    return number


pelimaara= 10
for i in range(pelimaara):
    if get_random_number(a) > get_random_number(b):
        a_voitot +=1
    else:
        b_voitot +=1

print(f"a voitti {a_voitot}, voittoprosentti {a_voitot/pelimaara*100} \nb voitti {b_voitot}, voittoprosentti {b_voitot/pelimaara*100} ")

