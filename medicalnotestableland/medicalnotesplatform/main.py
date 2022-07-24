__author__ = 'sdpatro'

from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url
import tornado
import tornado.httpclient
import tornado.escape
import os
import torndb
import rhinestonedb


class HelloHandler(RequestHandler):
    def get(self):
        self.write("Hello Rhinestone")


class TestHandler(RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        http = tornado.httpclient.AsyncHTTPClient()
        http.fetch("http://www.google.com", callback=self.on_response)
        print "Request sent"

    def on_response(self, response):
        if response.error: raise tornado.web.HTTPError(500)
        output_str = str.replace(response.body, "<", "&lt;")
        output_str = str.replace(output_str, ">", "&gt;")
        self.write(output_str)
        self.finish()


class DatabaseHandler(RequestHandler):
    address = "localhost"
    dbname = "RhinestoneDB"
    user = "root"
    password = "stack"

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def checkSchemaState(self, db):
        try:
            db.query("SELECT * FROM `" + self.dbname + "`.`users`;")
        except torndb.MySQLdb.ProgrammingError:
            print("Creating missing table `users`...")
            db.execute(
                "CREATE TABLE `users` (`id` varchar(45) NOT NULL,`email` varchar(45) NOT NULL,`loggedIn` binary(1) NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`),UNIQUE KEY `email_UNIQUE` (`email`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")
        try:
            db.query("SELECT * FROM `" + self.dbname + "`.`chats`;")
        except torndb.MySQLdb.ProgrammingError:
            print("Creating missing table `chats`...")
            db.execute(
                "CREATE TABLE `chats` (`id` int(11) NOT NULL,`content` varchar(200) NOT NULL,`sessionId` int(11) NOT NULL,`stamp` datetime NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")
        try:
            db.query("SELECT * FROM `" + self.dbname + "`.`sessions`;")
        except torndb.MySQLdb.ProgrammingError:
            print("Creating missing table `sessions`...")
            db.execute(
                "CREATE TABLE `sessions` (`id` int(11) NOT NULL,`member` varchar(45) NOT NULL,`lastUpdate` datetime NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `member_UNIQUE` (`member`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")

        try:
            db.query("SELECT * FROM `" + self.dbname + "`.`apps`;")
        except torndb.MySQLdb.ProgrammingError:
            print("Creating missing table `apps`...")
            db.execute(
                "CREATE TABLE `apps` (`id` varchar(45) NOT NULL,`apiKey` varchar(45) NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`),UNIQUE KEY `apiKey_UNIQUE` (`apiKey`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;")

    def get(self):
        db = rhinestonedb.getConnection(self.address, self.dbname, self.user, self.password)
        if db == None:
            print "Can't connect to database."
            return
        self.checkSchemaState(db)

    def post(self):
        action = self.get_argument("action", None)
        if action is not None:
            if action == "update-session":
                # {'action':"update-session", 'sessionName':SESSION_NAME}
                user = self.get_secure_cookie("user")
                sessionName = self.get_argument("sessionName")
                print user + " " + sessionName
                rhinestonedb.updateSession(sessionName, user)
            if action == "fetch-sessions":
                # {'action':"fetch-sessions"}
                user = self.get_secure_cookie("user")
                sessions = rhinestonedb.fetchSessions(user)
                self.finish(dict(sessionsList=sessions, size=len(sessions)))
            if action == "switch-session":
                newSession = self.get_argument("newSession")
                self.set_secure_cookie("session", newSession)
                content = rhinestonedb.retreiveSession(newSession)
                sessionContent = []
                if content is not None:
                    for i in range(0, len(content), 1):
                        sessionContent.append({'content': content[i].content, 'stamp': str(content[i].stamp),
                                               'sessionId': content[i].sessionId, 'id': content[i].id,
                                               'user': content[i].user})
                self.finish(dict(sessionContent=sessionContent, user=self.get_secure_cookie("user")))
            if action == "send-message":
                # {'action':"send-message", 'content':MESSAGE_INPUT}
                session = self.get_secure_cookie("session")
                messageContent = self.get_argument("content")
                user = self.get_secure_cookie("user")

                if rhinestonedb.sendMessage(user, messageContent, session):
                    self.finish(dict(result="success"))
                else:
                    self.finish(dict(result="failure"))
            if action == "poll-session":
                getSession = self.get_argument("session")
                chatCached = self.get_argument("chat-count")
                sessionInfo = rhinestonedb.getSessionInfo(getSession)
                chatCount = sessionInfo["chatCount"]
                sessionContent = []
                chatCached = str(chatCached)
                chatCount = str(chatCount)
                if chatCached<chatCount or chatCached>chatCount:
                    action = 'update'
                    content = rhinestonedb.retreiveSession(getSession)
                    if content is not None:
                        for i in range(0, len(content), 1):
                            sessionContent.append({'content': content[i].content, 'stamp': str(content[i].stamp),
                                                   'sessionId': content[i].sessionId, 'id': content[i].id,
                                                   'user': content[i].user})
                else:
                    action = 'none'
                self.finish(dict(action=action, sessionContent=sessionContent, user=self.get_secure_cookie("user")))
            if action == "get-app-handler":
                appHandler = rhinestonedb.getAppHandler(self.get_argument("app"))
                self.finish(dict(result="success", appHandler=appHandler))
            if action == "get-user-email":
                appHandler = rhinestonedb.getUserEmail(self.get_argument("userId"))
                self.finish(dict(result="success", userEmail=appHandler))
            if action == "add-file-to-session":
                session = self.get_argument("session")
                fileData = self.get_argument("fileData")
                fileName = self.get_argument("fileName")
                author = self.get_argument("author")
                prevId = self.get_argument("prevId", None)
                previewData = self.get_argument("preview", None)
                previewType = self.get_argument("preview-type", None)
                fileId = rhinestonedb.addFileToSession(session, fileData, fileName, author, prevId)
                if (previewData != None):
                    rhinestonedb.addPreview(fileId, previewData, previewType)

                self.finish(dict(result="success"))
            if action == "update-board":
                session = self.get_argument("session")
                board = rhinestonedb.getSessionBoard(session)
                boardContent = []
                for i in range(0, len(board), 1):
                    newObj = {}
                    newObj["name"] = board[i].name
                    newObj["session"] = board[i].session
                    newObj["stamp"] = str(board[i].stamp)
                    newObj["author"] = board[i].author
                    newObj["id"] = board[i].id
                    newObj["prevId"] = board[i].prevId
                    boardContent.append(newObj)
                self.finish(dict(result="success", boardContent=boardContent))
            if action == "get-file":
                fileId = self.get_argument("fileId")
                file = rhinestonedb.getFile(fileId)
                self.finish(dict(result="success", fileData=file.fileData))
            if action == "get-preview":
                fileId = self.get_argument("fileId")
                file = rhinestonedb.getPreview(fileId)
                self.finish(dict(result="success", previewData=file.previewData))
            if action == "get-session-info":
                session = self.get_argument("session")
                sessionInfo = rhinestonedb.getSessionInfo(session)
                self.finish(dict(result="success", sessionInfo=sessionInfo))
            else:
                return
        else:
            return


class MainHandler(RequestHandler):
    def get(self):
        if self.get_secure_cookie("user", None) != None:
            arguments = {}
            arguments["user"] = self.get_secure_cookie("user")
            arguments["appId"] = self.get_secure_cookie("app")
            arguments["fileSharePath"] = None
            self.render("templates/control.html", arguments=arguments)
        else:
            arguments = {}
            arguments["user"] = "None"
            arguments["app-id"] = "None"
            self.render("templates/landing.html", arguments=arguments)
        print "Landing page"


class AuthHandler(RequestHandler):
    address = "localhost"
    dbname = "RhinestoneDB"
    user = "root"
    password = "stack"

    def post(self):
        appId = self.get_argument("appId", None)
        appKey = self.get_argument("appKey", None)
        userEmail = self.get_argument("userEmail", None)

        if appId == None or appKey == None or userEmail is None:
            self.finish(dict(result="failure", message="Parameter missing"))

        if rhinestonedb.authenticateApp(appId, appKey):
            userId = rhinestonedb.getUserId(userEmail)
            if (userId == None):
                self.finish(dict(result="failure", message="userEmail error"))
            else:
                self.finish(dict(result="success", userId=userId, appId=appId))
        else:
            self.finish(dict(result="failure", message="appID or apiKey error"))

        return;

    def get(self):
        self.finish(dict(result="rhinestone/auth", message="forbidden"))


class AppSwitchHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")

    def post(self):
        appId = self.get_argument("appId", None)
        appKey = self.get_argument("appKey", None)
        userEmail = self.get_argument("userEmail", None)

        if appId is None or appKey is None or userEmail is None:
            self.finish(dict(result="failure", message="Parameter missing"))

        userId = None

        if rhinestonedb.authenticateApp(appId, appKey):
            userId = rhinestonedb.getUserId(userEmail)
            if (userId == None):
                self.finish(dict(result="failure", message="userEmail error"))
        else:
            self.finish(dict(result="failure", message="appID or apiKey error"))

        self.finish(dict(result="success", userId=userId, redirectURL="http://localhost:8888/app-switch", appId=appId))

    def get(self):
        userId = self.get_argument("userId")
        appId = self.get_argument("appId")
        filePath = self.get_argument("filePath")

        if appId is None or userId is None or filePath is None:
            self.finish(dict(result="failure", message="Parameter missing"))

        self.set_secure_cookie("user", userId)
        self.set_secure_cookie("app", appId)

        arguments = {"user": userId, "fileSharePath": filePath, "appId": appId}

        self.render("templates/control.html", arguments=arguments)


def make_app():
    settings = {
        "static_path": os.path.join(os.path.dirname(__file__), "static"),
        "cookie_secret": "823719983274",
        "login_url": "/login",
        "xsrf_cookies": False,
    }
    return Application([url(r"/hello", HelloHandler),
                        url(r"/test", TestHandler),
                        url(r"/home", MainHandler),
                        url(r"/db", DatabaseHandler),
                        url(r"/auth", AuthHandler),
                        url(r"/app-switch", AppSwitchHandler),
                        url(r"/(bootstrap.min.js)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
                        url(r"/(bootstrap.css)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
                        url(r"/(styles.css)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
                        url(r"/(fonts/bootstrap/glyphicons-halflings-regular.ttff)", tornado.web.StaticFileHandler,
                            dict(path=settings['static_path'])),
                        url(r"/(fonts/bootstrap/glyphicons-halflings-regular.woff)", tornado.web.StaticFileHandler,
                            dict(path=settings['static_path'])),
                        url(r"/(jquery-2.1.4.min.js)", tornado.web.StaticFileHandler,
                            dict(path=settings['static_path'])),
                        url(r"/(rhinestone-main-script.js)", tornado.web.StaticFileHandler,
                            dict(path=settings['static_path']))],
                       **settings)


def main():
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()
