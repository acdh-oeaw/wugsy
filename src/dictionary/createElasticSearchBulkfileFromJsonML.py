#Creates elasticsearch compatible bulkfile from JsonML file
#order and volume fields are added for search queries

import sys
import json

globloop = 0
volume = int (sys.argv[1])
inputpath = sys.argv[2]
outputpath = sys.argv[3]

def ResolveString( txt ):

   global globloop
   r = """{ "text": """ +  json.dumps(txt) + """, "order": """ + str(globloop) + """, "volume": """ + str(volume) + """ }"""
   globloop = globloop + 1;
   return json.loads(r);

def ResolveDict ( dict ):

    global globloop
    dict["order"] = globloop
    dict["volume"] = volume
    globloop = globloop + 1;
    return dict;

def ResolveArray( arr ):

   for l, x in enumerate(arr):
            if isinstance(x, str):
                arr[l] = ResolveString(x)

            if isinstance(x, dict):
                arr[l] = ResolveDict(x)

            if isinstance(x, list):
                arr[l] = ResolveArray(x)

   list_label = "array" #general label for all tags that are not relevant atm
   content = json.dumps(arr)

   if "orth" in content and "form" not in content and "oRef" not in content and "usg" not in content:
        list_label = "arr_orth" #lemma
   if "oRef" in content and "form" not in content and "usg" not in content and "orth" not in content:
        list_label = "arr_oRef" #references
   if "usg" in content and "form" not in content and "oRef" not in content and "orth" not in content:
        list_label = "arr_usg" #phrases

   global globloop
   r = " { \"" + list_label + "\" : " + content  + ", \"order\": " + str(globloop) + ", \"volume\": " + str(volume) + " }"
   globloop = globloop + 1;

   return json.loads(r);

with open(inputpath, encoding="utf8") as data_file:
    data = json.load(data_file)

newdata = ""
offset = 0 #+1 from lastindex. vol1 to 1046, vol2 to 2509, vol3 to 5905, vol4 to 7224, vol5 to 8888, vol5.1 to 9138

if volume == 1:
    offset = 0
if volume == 2:
    offset = 1047
if volume == 3:
    offset = 2510
if volume == 4:
    offset = 5906
if volume == 5:
    offset = 7225
if volume == 5.1:
    offset = 8889


for loop, x in enumerate(data):
    newdata += "{ \"index\": { \"_index\": \"ordered_entries\", \"_id\": "+str(loop + offset)+" } }\n"
    entry = ""

    if isinstance(x, str):
        data[loop]  = ResolveString(x)

    if isinstance(x, dict):
        data[loop]  = ResolveDict(x)

    if isinstance(x, list):
        data[loop] = ResolveArray(x)

    newdata += json.dumps(data[loop]) + "\n"

with open(outputpath, 'w') as textfile:
                textfile.write(newdata)
