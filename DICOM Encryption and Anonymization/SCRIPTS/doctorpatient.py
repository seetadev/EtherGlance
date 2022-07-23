# -*- coding: utf-8 -*-
import os
import glob
import re
import os, sys
import io
from os.path import join, expanduser



for file in glob.glob("*.html"):
    print("Now reading file:",file)
    outFile=open(os.path.join(os.path.basename(file[10:])),"w", encoding='utf-8') 
    with open(file,encoding='utf-8') as content_file:
        for line in content_file:
            original_content = line
            anonymized = original_content
            anonymiz = original_content
            content = re.sub(r'(?i)<[^>]*>', '', original_content)
            no_html = re.sub(r'(?i)<[^>]*>', '', original_content)
            field_list = ["Name:","Doctor :"]
            for field in field_list:
                pattern = re.compile(r'(?:' + field + ')(?:\s*)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)(?:\s)(\S*)', re.S)

                for m in re.finditer(pattern, no_html):
                  print("Replacing " + m.group())
                  print(m.group(10))
                  print(m.group(8))
                  print(m.group(9))
                  try:
                      anonymized = re.sub(r"("+m.group(7)+")", 'ABC', anonymized)
                      anonymized = re.sub(r"("+m.group(8)+")", '', anonymized)
                      anonymized = re.sub(r"("+m.group(9)+")", '', anonymized)
                  except  re.error as re_error:
                      print("Skipping: " +  m.group() + "Text\n\n" + line)
            outFile.write(anonymized)

          
            