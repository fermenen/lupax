import enum
from datetime import datetime
from typing import List, Optional
from xmlrpc.client import boolean
from pydantic import BaseModel, Field


#######################
#    Participation    #
#######################

class ParticipationBase(BaseModel):
    task_id: str
    participant_user: Optional[str]
    time_total: Optional[int]
    clicks: Optional[int]

    class Config:
        orm_mode = True


class Participation(ParticipationBase):
    id: str
    time_created: datetime
    target_success: Optional[bool]
    video_url: Optional[str]


class ParticipationCreate(ParticipationBase):
    target_success: Optional[bool]


##########

class TaskBase(BaseModel):
    instructions: Optional[str]
    target_url: Optional[str]
    delete_cookie: Optional[bool]

    class Config:
        orm_mode = True


class Task(TaskBase):
    id: str
    type: enum.Enum
    typeform_id: Optional[str]
    welcome_message: Optional[str]
    farewell_message: Optional[str]
    url: Optional[str]
    record_screen: Optional[bool]


class TaskPrivate(Task):
    participants: int
    time_total_array: Optional[List[int]]
    clicks_array:  Optional[List[int]]
    success_rate: Optional[float]
    participations: List[Participation] = []
    index: int
    move: bool
    edit: bool
    delete: bool


class TaskEdit(BaseModel):
    id: str
    index: int


class TaskEditDescription(BaseModel):
    welcome_message: Optional[str]
    farewell_message: Optional[str]


class TaskPublic(Task):
    index: int


class TaskCreate(TaskBase):
    studie_id: str
    type: str
    typeform_id: Optional[str]
    url: Optional[str]
    record_screen: Optional[bool]


##########


class StudiesBase(BaseModel):
    public_studie_title: str


class Studies(StudiesBase):
    id: str
    name: str = Field(alias='private_studie_title')
    audience_max: int
    studie_description: str
    participants: int
    is_published: bool
    user_id: Optional[str]
    team_id: Optional[str]

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


class StudiePublic(StudiesBase):
    id: str
    public_studie_title: str
    available: bool
    tasks: List[TaskPublic] = []

    class Config:
        allow_population_by_field_name = True
        orm_mode = True


class StudiesDetail(Studies):
    time_created: datetime
    participants: int
    tasks: List[TaskPrivate] = []
    number_tasks: int

    class Config:
        orm_mode = True


class StudiesCan(BaseModel):
    public_studie_title: str
    available: boolean

    class Config:
        orm_mode = True


class StudiesCreate(StudiesBase):
    name: str = Field(alias='private_studie_title')
    studie_description: str
    audience_max: int
    team_id: str


class StudiesEdit(BaseModel):
    pass

    class Config:
        orm_mode = True


class StudiesPublishEdit(StudiesEdit):
    is_published: bool


class StudiesTasksEdit(StudiesEdit):
    tasks: List[TaskEdit]

################
#  Preferences #
################


class PreferencesBase(BaseModel):
    team_alerts: bool
    tips_alerts: bool

    class Config:
        orm_mode = True


class Preferences(PreferencesBase):
    pass


class PreferencesEdit(BaseModel):
    team_alerts: Optional[bool]
    tips_alerts: Optional[bool]

##########
# USERS  #
##########


class UserBase(BaseModel):
    name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]


class User(UserBase):
    id: Optional[str]
    role: str
    profile_picture: Optional[str]
    preferences: Optional[Preferences]

    class Config:
        orm_mode = True


class UserWithoutRole(UserBase):
    id: Optional[str]
    profile_picture: Optional[str]

    class Config:
        orm_mode = True


class PasswordChange(BaseModel):
    old_password: str
    new_password: str

##########
# TEAMS  #
##########


class TeamBase(BaseModel):
    name: str


class Team(TeamBase):
    id: str
    admin_user_id: str
    users: List[UserWithoutRole] = []

    class Config:
        orm_mode = True


class TeamCreate(TeamBase):
    pass


#############################
#    AssociationUserTeam    #
#############################

class AssociationUserTeamBase(BaseModel):
    team_id: str


class AssociationUserTeam(AssociationUserTeamBase):
    pass

    class Config:
        orm_mode = True


class AssociationUserTeamCreate(AssociationUserTeam):
    user_email: str

    class Config:
        orm_mode = True


#######################
#       ADMIN       #
#######################

class DeleteUser(BaseModel):
    user_id: str


class CreateNotification(BaseModel):
    text: str
    type: str

#######################
#       Storage       #
#######################


class StorageBase(BaseModel):
    pass

    class Config:
        orm_mode = True


class Storage(StorageBase):
    id: str


class StorageCreate(BaseModel):
    file: str
    participation_id: str

    class Config:
        orm_mode = True


#######################
#    Notifications    #
#######################


class NotificationsBase(BaseModel):
    text: str


class Notifications(NotificationsBase):
    id: str
    time_created: datetime
    type: str

    class Config:
        orm_mode = True
