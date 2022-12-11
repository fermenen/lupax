
interface id {
    id: string
}


export interface Preferences{
    team_alerts: boolean
}

export interface User extends id {
    name: string
    last_name: string
    email: string
    profile_picture: string
    preferences: Preferences
}

export interface TeamsType extends id {
    name: string
    admin_user_id: string
    users: User[]
}

export interface StudieBasic extends id {
    private_studie_title: string
    public_studie_title: string
    studie_description: string
    participants: number
    is_published: boolean
    audience_max: number
    user_id: string
    team_id: string
}

export interface Participation extends id {
    participant_user: string
    task_id: string
    time_created: string
    time_total: number
    target_success: boolean
    video_url: string
    clicks: number
}

export interface Task extends id {
    type: string
    typeform_id: string
    welcome_message: string
    farewell_message: string
    instructions: string
    delete_cookie: boolean
    url: string
    target_url: string
    participants: number
    time_total_array: number[]
    clicks_array: number[]
    success_rate: number
    participations: Participation[]
    index: number
    move: boolean
    edit: boolean
    delete: boolean
    record_screen: boolean
}

export interface Notification extends id {
    text: string
    time_created: string
}