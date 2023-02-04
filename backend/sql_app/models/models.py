import uuid
import enum
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, backref
from ..config.database import Base
from ..utils.gravatar import Gravatar
from ..utils.storage import StorageCloud

association_users_teams = Table('associationUserTeam', Base.metadata,
                                Column('user_id', ForeignKey(
                                    'users.id'), primary_key=True),
                                Column('team_id', ForeignKey(
                                    'teams.id'), primary_key=True)
                                )


class Users(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    id_supertokens = Column(String, nullable=False, unique=True, index=True)
    name = Column(String, nullable=False)
    last_name = Column(String)
    email = Column(String, nullable=False, unique=True, index=True)
    time_joined = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    role = Column(String, default='user')
    picture = Column(String)
    studies = relationship("Studies")
    teams_admin = relationship("Teams")
    preferences_id = Column(String, ForeignKey('preferences.id'))
    preferences = relationship("Preferences", back_populates="user")
    teams = relationship(
        "Teams", secondary=association_users_teams, back_populates="users")

    @property
    def profile_picture(self):
        if(self.picture):
            return self.picture
        else:
            return Gravatar(self.email).get_image(default="retro")

    def __repr__(self):
        return "<User(name='%s', last_name='%s', email='%s')>" % (self.name, self.last_name, self.email)


class Preferences(Base):
    __tablename__ = "preferences"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    team_alerts = Column(Boolean, default=True, nullable=False)
    tips_alerts = Column(Boolean, default=True, nullable=False)
    user = relationship("Users", back_populates="preferences")


class Teams(Base):
    __tablename__ = "teams"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    admin_user_id = Column(String, ForeignKey('users.id'))

    users = relationship(
        "Users", secondary=association_users_teams, back_populates="teams")
    studies = relationship("Studies")


class Studies(Base):
    __tablename__ = "studies"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True)
    public_studie_title = Column(String, nullable=False)
    studie_description = Column(String, nullable=False)
    audience_max = Column(Integer, index=True)
    is_published = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, default=True)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    tasks = relationship('Task')

    user_id = Column(String, ForeignKey('users.id'))
    team_id = Column(String, ForeignKey('teams.id'))

    @property
    def available(self):
        return self.is_published and (self.participants < self.audience_max)

    @property
    def participants(self):
        if not self.tasks:
            return 0
        return max(task.participants for task in self.tasks)

    @property
    def number_tasks(self):
        return len(self.tasks)


class EnumTaskType(enum.Enum):
    studie = 'studie'
    typeform = 'typeform'
    welcome = 'welcome_message'
    farewell = 'farewell_message'
    extension = 'notice_extension'


class Task(Base):
    __tablename__ = "task"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(Enum(EnumTaskType), index=True)
    # studie
    url = Column(String)
    instructions = Column(String)
    target_url = Column(String)
    delete_cookie = Column(Boolean)
    record_screen = Column(Boolean)
    # typeform
    typeform_id = Column(String)
    # welcome_message
    welcome_message = Column(String)
    # farewell_message
    farewell_message = Column(String)

    index = Column(Integer)
    move = Column(Boolean, default=True)
    edit = Column(Boolean, default=True)
    delete = Column(Boolean, default=True)

    is_active = Column(Boolean, default=True, index=True)
    time_created = Column(DateTime(timezone=True),
                          nullable=False, server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    participations = relationship(
        "Participation", back_populates="task", cascade="all, delete", passive_deletes=True)
    studie_id = Column(String, ForeignKey("studies.id"), index=True)

    @property
    def participants(self):
        return len(self.participations)

    @property
    def target(self):
        return bool(self.target_url)

    @property
    def time_total_array(self):
        time = (p.time_total for p in self.participations)
        list_time = list(filter(None, time))
        return list_time if bool(list_time) else None

    @property
    def clicks_array(self):
        clicks = (p.clicks for p in self.participations)
        list_clicks = list(filter(None, clicks))
        return list_clicks if bool(list_clicks) else None

    @property
    def success_rate(self):
        if self.target and self.participations:
            return (sum(int(p.target_success) for p in self.participations)/len(self.participations))*100


class Participation(Base):
    __tablename__ = "participation"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey(
        'task.id', ondelete="CASCADE"), index=True)
    task = relationship("Task", back_populates="participations")
    participant_user = Column(String, nullable=True, index=True)
    time_total = Column(Integer, default=0)
    clicks = Column(Integer)
    target_success = Column(Boolean)
    video_storage_id = Column(String, ForeignKey('storage.id'))
    video_storage = relationship(
        "Storage", backref=backref("participation", uselist=False))
    is_active = Column(Boolean, default=True, index=True)
    time_created = Column(DateTime(timezone=True),
                          nullable=False, server_default=func.now())

    @property
    def video_url(self):
        return self.video_storage.get_url_public


class Storage(Base):
    __tablename__ = "storage"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String, ForeignKey('users.id'))

    @property
    def get_url_public(self):
        return StorageCloud().get_temporary_url(file=self.id+self.type)


class Notifications(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(String, nullable=False)
    type = Column(String,  nullable=False)
    seen = Column(Boolean, default=False, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    time_created = Column(DateTime(timezone=True), server_default=func.now())
