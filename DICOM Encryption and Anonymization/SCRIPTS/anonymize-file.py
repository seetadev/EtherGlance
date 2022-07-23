import tkinter 
from tkinter.filedialog import askopenfilename
import pydicom
import glob
import os, sys
from os.path import join, expanduser
dicomPath = sys.argv[0]
filename = askopenfilename() 
print(filename)
while(1):
  print(" A] Patient\n B]Visit \n C] Study\n D]Procedure Step\n E]Series\n F]Image\n G]Results \n H]Interpretation \n I]Equipments \n");
  type=input("Enter the category")
  if type=='A':
    print(" 1)Patient Id\n 2) Patient name\n 3)Patient's Birth Date\n 4)Patient's sex \n 5)Patient Orientation\n 6)Exit");
    x=int(input('Enter your choice:'))
    print(x);
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x10,0x20].value="XXXX"
        print(df[0x10,0x20].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==2:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x10,0x10].value="pat_name"
        print(df[0x10,0x10].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==3:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x10,0x30].value="anonymous_dateofbirth"
        print(df[0x10,0x30].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==4:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x10,0x40].value="anonymous_patientsex"
        print(df[0x10,0x40].value);
        print(df.dir);
        df.save_as(file);
      print("end")
    if x==5:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x20,0x20].value="anonymous_orientation"
        print(df[0x20,0x20].value);
        print(df.dir);
        df.save_as(file);
      print("end") 
    if x==6:
      sys.exit(0);
  if type=='B':
    print(" 1)Referring Physicain name\n 2)Exit");
    x=int(input('Enter your choice:'))
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x08,0x90].value="anonymous_referphysiciansname"
        print(df[0x08,0x90].value);
        print(df.dir);
        df.save_as(file);
      print("end")
    if x==2:
     sys.exit(0); 
  if type=='C':
    print("1) Accession Number \n 2) Study Id \n 3) Exit\n");
    x=int(input('Enter your choice:'))
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x08,0x50].value="anonymous_accnumber"
        print(df[0x08,0x50].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==2:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x20,0x10].value="anonymous_studyID"
        print(df[0x20,0x10].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==3:
      sys.exit(0);
  if type=='E':
    print("1) Series Number\n 2)Exit");
    x=int(input('Enter your choice:'))
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x20,0x11].value="00"
        print(df[0x20,0x11].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==2:
      sys.exit(0);
  if type=='F':
    print("1) Rows\n 2) Columns \n 3) Pixel Spacing\n  4)Bits Allocated\n 5)Photometric Interpretation\n 6)Image Type \n 7)Samples per pixel\n 8)Body part thickness\n 9) Exit");
    x=int(input('Enter your choice:'))
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0x10].value=0000
        print(df[0x28,0x10].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==2:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0x11].value=0000
        print(df[0x28,0x11].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==3:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0x0101].value=000
        print(df[0x28,0x0101].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==4:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0x100].value=00
        print(df[0x28,0x100].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==5:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0X04].value="anonymized_photometricinterpretation"
        print(df[0x28,0x04].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==6:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x08,0X08].value="anonymized_imagetype"
        print(df[0x08,0x08].value);
        print(df.dir);	
        df.save_as(file);
      print("end")  
    if x==7:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x28,0x02].value=00
        print(df[0x28, 0x02].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==8:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x18,0x11a0].value="00"
        print(df[0x18, 0x11a0].value);
        print(df.dir);	
        df.save_as(file);
      print("end")              
    if x==9:
      sys.exit(0);            
  if type=='I':
    print("1) Manufacturer \n 3)Exit");
    x=int(input('Enter your choice:'))
    if x==1:
      for file in glob.glob(filename):
        print("### Now reading file:", file)
        df = pydicom.read_file(file);
        df[0x08,0x70].value="anonymous_manufacturer"
        print(df[0x08,0x70].value);
        print(df.dir);	
        df.save_as(file);
      print("end")
    if x==2:
      sys.exit(0);
   
 
