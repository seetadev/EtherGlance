__author__ = 'sdpatro'

import torndb
import datetime
import random

address = "localhost"
dbname = "RhinestoneDB"
user = "root"
password = "stack"

def getNextRand(db):
    nextRand = random.randint(0,100000000)
    while True:
        results = db.query("SELECT id FROM `" + dbname + "`.`chats` WHERE `id`="+str(nextRand)+";")
        if len(results)==1:
            nextRand =  random.randint(0,100000000)
        else:
            break

    return nextRand

def getConnection(address, dbname, user, password):
    SQLdb = torndb.Connection(address, dbname, user=user, password=password)
    if not SQLdb:
        return None
    return SQLdb

def authenticateApp(app,key):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `" + dbname + "`.`apps` WHERE `id`='"+app+"' AND `apiKey`='"+key+"';")
        if len(results)==1:
            return True
        else:
            return False
    except torndb.MySQLdb.ProgrammingError as e:
        print("authenticateApp exception: "+e)

def getUserId(userEmail):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT id FROM `" + dbname + "`.`users` WHERE `email`='"+userEmail+"';")
        if len(results)==1:
            db.execute("UPDATE `" + dbname + "`.`users` SET loggedIn=1 WHERE `email`='"+userEmail+"';")
            return results[0].id;
        else:
            return None
    except torndb.MySQLdb.ProgrammingError as e:
        print("getUserId exception: "+e)
    except TypeError as e:
        print("getUserId exception: "+e)

def getUserEmail(userId):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT email FROM `" + dbname + "`.`users` WHERE `id`='"+userId+"';")
        if len(results)==1:
            return results[0].email;
        else:
            return None
    except torndb.MySQLdb.ProgrammingError as e:
        print("getUserEmail exception: "+e)
    except TypeError as e:
        print("getUserEmail exception: "+e)

def authenticateUser(userId):
    db = getConnection(address, dbname, user, password)
    try:
        results = db.query("SELECT * FROM `" + dbname + "`.`users` WHERE `id`='"+userId+"' AND `loggedIn`=1;")
        if len(results)==1:
            return True
        else:
            return False
    except torndb.MySQLdb.ProgrammingError as e:
        print("authenticateUser error: "+e)
        return False
    except TypeError as e:
        print("authenticateUser error: "+e)
        return False

def updateSession(sessionName,userId):
    db = getConnection(address, dbname, user, password)
    try:
        updateTime = datetime.datetime.now()
        updateTime = updateTime.strftime('%Y-%m-%d %H:%M:%S')
        results = db.query("SELECT * FROM `"+dbname+"`.`sessions` WHERE `member`='"+userId+"' AND `id`='"+sessionName+"';")
        if len(results)==1:
            db.execute("UPDATE `"+dbname+"`.`sessions` SET `lastUpdate`='"+updateTime+"' WHERE `member`='"+userId+"' AND `id`='"+sessionName+"';")
        else:
            db.execute("INSERT INTO `"+dbname+"`.`sessions`(`id`,`member`,`lastUpdate`)VALUES('"+sessionName+"','"+userId+"','"+updateTime+"');")
    except torndb.MySQLdb.ProgrammingError as e:
        print("createSession error: "+str(e))
        return False
    except TypeError as e:
        print("createSession error: "+str(e))
        return False

def fetchSessions(userId):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT id FROM `"+dbname+"`.`sessions` WHERE `member`='"+userId+"';")
        if len(results)>0:
            return results
        else:
            return None
    except torndb.MySQLdb.ProgrammingError as e:
        print("fetchSessions error: "+str(e))
        return False
    except TypeError as e:
        print("fetchSessions error: "+str(e))
        return False

def retreiveSession(sessionId):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `"+dbname+"`.`chats` WHERE `sessionId`='"+sessionId+"' ORDER BY `stamp` ASC;")
        if len(results)>0:
            return results
        else:
            return None
    except torndb.MySQLdb.ProgrammingError as e:
        print("retrieveSession error: "+str(e))
        return False
    except TypeError as e:
        print("retrieveSession error: "+str(e))
        return False

def sendMessage(userId,content,sessionId):
    db = getConnection(address,dbname,user,password)
    try:
        randId = getNextRand(db)
        postTime = datetime.datetime.now()
        postTime = postTime.strftime('%Y-%m-%d %H:%M:%S')
        content = content.replace("'","''")
        db.execute("INSERT INTO `"+dbname+"`.`chats` VALUES("+str(randId)+",\'"+content+"\','"+sessionId+"','"+postTime+"','"+userId+"');")
        return True;
    except torndb.MySQLdb.ProgrammingError as e:
        print("sendMessage error: "+str(e))
        return False
    except TypeError as e:
        print("sendMessage error: "+str(e))
        return False

def getAppHandler(appId):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `" + dbname + "`.`apps` WHERE `id`='"+appId+"';")
        return results[0].apiHandler
    except torndb.MySQLdb.ProgrammingError as e:
        print("sendMessage error: "+str(e))
        return False
    except TypeError as e:
        print("sendMessage error: "+str(e))
        return False

def getNextRandFiles(db):
    nextRand = random.randint(0,100000000)
    while True:
        results = db.query("SELECT id FROM `" + dbname + "`.`files` WHERE `id`="+str(nextRand)+";")
        if len(results)==1:
            nextRand =  random.randint(0,100000000)
        else:
            break
    return nextRand

def addFileToSession(session,fileData,fileName,author,prevId=None):
    db = getConnection(address,dbname,user,password)
    try:
        addTime = datetime.datetime.now()
        addTime = addTime.strftime('%Y-%m-%d %H:%M:%S')
        randId = getNextRandFiles(db)
        if prevId==None:
            prevId = "0"
        print session
        print fileName
        db.execute(
            "INSERT INTO `" + dbname + "`.`files` VALUES(%s,%s,%s,%s,%s,%s,%s);",
            fileName,session,addTime,
            fileData,author,randId,prevId)
        return randId
    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False

def getSessionBoard(session):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `"+dbname+"`.`files` WHERE `session`='"+session+"' ORDER BY `stamp` ASC;")
        return results
    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False

def getFile(id):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `"+dbname+"`.`files` WHERE `id`='"+id+"';")
        return results[0]
    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False

def addPreview(fileId,previewData,previewType):
    db = getConnection(address,dbname,user,password)
    try:
        print previewData
        db.execute(
            "INSERT INTO `" + dbname + "`.`preview` VALUES(%s,%s,%s);",
            fileId,previewData,previewType)
        return True
    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False

def getPreview(id):
    db = getConnection(address,dbname,user,password)
    try:
        results = db.query("SELECT * FROM `"+dbname+"`.`preview` WHERE `fileId`='"+id+"';")
        return results[0]
    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False

def getSessionInfo(session):
    db = getConnection(address,dbname,user,password)
    try:
        chats = db.query("SELECT * FROM `"+dbname+"`.`chats` WHERE `sessionId`='"+session+"';")
        chatCount = len(chats)
        users = db.query("SELECT * FROM `"+dbname+"`.`sessions` WHERE `id`='"+session+"';")
        userCount = len(users)

        sessionInfo = {'chatCount':chatCount,'userCount':userCount}
        return sessionInfo

    except torndb.MySQLdb.ProgrammingError as e:
        print "An exception occured " + str(e)
        return False
    except TypeError as e:
        print "An exception occured " + str(e)
        return False