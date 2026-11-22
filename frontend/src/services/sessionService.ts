import {SessionStatus, SessionActionEntry, LessonSession} from '../types';
import {apiRequest} from './api';

interface SessionResponse {
    id: string;
    school_id: string;
    classroom_id: string;
    teacher_name: string;
    objective: string;
    status: SessionStatus;
    started_at: string;
    ended_at?: string;
    allocated_device_ids: string[];
    closing_justification?: string;
    action_log: SessionActionEntry[];
}

export interface CreateSessionDTO {
    classroomId: string;
    teacherName: string;
    objective: string;
    deviceIds: string[];
}





