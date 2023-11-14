import random

a = 5
b = 9
a_voitot = 0
b_voitot = 0


def get_random_number(skill_number):
    number = (10 + pow((skill_number / 30), 4)) * random.randint(1, 100)

    return number


pelimaara = 1000000
for i in range(pelimaara):
    a_number = get_random_number(a)
    b_number = get_random_number(b)
    # print(f"a: {a_number} vs b: {b_number}")
    if a_number > b_number:
        a_voitot += 1
    else:
        b_voitot += 1

print(f"a voitti {a_voitot}, voittoprosentti {a_voitot / pelimaara * 100} \nb voitti {b_voitot},"
      f"voittoprosentti {b_voitot / pelimaara * 100} ")
