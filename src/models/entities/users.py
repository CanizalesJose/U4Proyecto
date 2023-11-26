from flask_login import UserMixin
class User(UserMixin):

    def __init__(self, id, username, fullname, password, usertype) -> None:
        self.id = id
        self.username = username
        self.fullname = fullname
        self.password = password
        self.usertype= usertype