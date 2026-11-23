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

function toLessonSession(data: SessionResponse): LessonSession {
    return {
        id: data.id,
        schoolId: data.school_id,
        classroomId: data.classroom_id,
        teacherName: data.teacher_name,
        objective: data.objective,
        status: data.status,
        startedAt: data.started_at,
        endedAt: data.ended_at,
        allocatedDeviceIds: data.allocated_device_ids,
        closingJustification: data.closing_justification,
        actionLog: data.action_log,
    };
}

export const sessionService = {
    async getSessions(): Promise<LessonSession[]> {
        const response = await apiRequest<SessionResponse[]>('/sessions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('proteca_token') || ''}`,
            },
        });
        return response.map(toLessonSession);
    },

    async getSession(id: string): Promise<LessonSession | null> {
        const response = await apiRequest<SessionResponse>(`/sessions/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('proteca_token') || ''}`,
            },
        });
        return response ? toLessonSession(response) : null;
    },

    async createSession(dto: CreateSessionDTO): Promise<LessonSession> {
        const response = await apiRequest<SessionResponse>('/sessions', {
            method: 'POST',
                body: {
                    classroom_id: dto.classroomId,
                    teacher_name: dto.teacherName,
                    objective: dto.objective,
                    device_ids: dto.deviceIds,
                },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('proteca_token') || ''}`,
            },
        });
        return toLessonSession(response);
    },

    async endSession(id: string, justification: string): Promise<LessonSession> {
        const response = await apiRequest<SessionResponse>(`/sessions/${id}/close`, {
            method: 'PATCH',
            body: { justification },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('proteca_token') || ''}`,
            },
        });
        return toLessonSession(response);
    }
}

