# -*- coding: utf-8 -*-
"""
Created on Sun Jun  6 20:37:12 2021

@author: EserRose
"""
import os
import json

def read_files():
    files = []
    for file in os.listdir("../../data"):
        if file.endswith(".csv"):
            with open(os.path.join("../../data", file), 'r') as f:
                next(f) #skip header
                files.append(f.readlines())
    return files

def CSV_to_JSON(files):
    
    json_file = open('../static/planes.json', 'w')
    json_file.write('[\n')

    earliest_time = 99999999999;
    latest_time = 0
    file_counter = 0
    for file in files:
        file_counter += 1
        line_counter = 0
        for line in file:
            line_counter += 1
            words = line.split(',')
            i = 0
            json_file.write( '\n\t{\n\t\t"Timestamp":"' + words[i] + '",')
            if(int(words[i]) < int(earliest_time)):
                earliest_time = words[i]
            if(int(words[i]) > int(latest_time)):
                latest_time = words[i]
            i+=1
            json_file.write( '\n\t\t"UTC":"' + words[i] + '",')
            i+=1
            json_file.write( '\n\t\t"Callsign":"' + words[i] + '",')
            i+=1
            json_file.write( '\n\t\t"Lat":' + words[i].replace('"', '') + ',')
            i+=1
            json_file.write( '\n\t\t"Lon":' + words[i].replace('"', '') + ',')
            i+=1
            json_file.write( '\n\t\t"Altitude":' + str(float(words[i])) + ',')
            i+=1
            json_file.write( '\n\t\t"Speed":' + str(float(words[i])) + ',')
            i+=1
            json_file.write( '\n\t\t"Direction":' + str(float(words[i])))
            json_file.write('\n\t}')
            if(file_counter < len(files) or line_counter < len(file)):
                json_file.write(',')

    
    json_file.write('\n]')
    json_file.close()
    print(earliest_time)
    print(latest_time)
        
CSV_to_JSON(read_files())