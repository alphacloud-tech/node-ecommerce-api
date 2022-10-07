
from turtle import isvisible


ops = ['5', '2', 'C', 'D', '+']

def calPoints(ops) -> int:
    result = None
    return result



print(calPoints(ops))

# print('()')

def isValid(s: str) -> bool:
    if len(s) % 2 != 0:
        return False
    dict = {'(' : ')', '[' : ']', '{' : '}'}
    stack = []
    for i in s:
        if i in dict.keys():
            stack.append(i)
        else:
            if stack == []:
                return False
            a = stack.pop()
            if i!= dict[a]:
                return False
    return stack == []

print(isValid("()"))
print(isValid("[]"))
print(isValid("{}"))
print(isValid("(]"))