
import re

regex = "[a-zA-Z].+@[a-zA-Z].+\.[a-zA-Z].+"
if re.match(regex, 'mac@mac.mec'):
    print(True)
else:
    print(False)
print(re.match(regex,"mac@mac.mac"))
print(re.match(regex,"macmac.mac"))