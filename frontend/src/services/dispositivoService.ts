// frontend/src/services/dispositivoService.ts

import { Device, DeviceStatus, DeviceType } from '@/types';
import { apiRequest } from './api';

interface DeviceResponse {
  id: string;
  school_id: string;
  patrimonio: string;
  type: DeviceType;
  model: string;
  status: DeviceStatus;
}

export interface CreateDeviceDTO {
  patrimonio: string;
  type: DeviceType;
  model: string;
}

function toDevice(data: DeviceResponse): Device {
  return {
    id: data.id,
    schoolId: data.school_id,
    patrimonio: data.patrimonio,
    type: data.type,
    model: data.model,
    status: data.status,
  };
}

export const deviceService = {
  async getDevices(): Promise<Device[]> {
    const response = await apiRequest<DeviceResponse[]>('/devices');
    return response.map(toDevice);
  },

  async getDeviceById(id: string): Promise<Device> {
    const response = await apiRequest<DeviceResponse>(`/devices/${id}`);
    return toDevice(response);
  },

  async createDevice(dto: CreateDeviceDTO): Promise<Device> {
    const response = await apiRequest<DeviceResponse>('/devices', {
      method: 'POST',
      body: dto,
    });

    return toDevice(response);
  },

  async updateDeviceStatus(
    id: string,
    status: DeviceStatus
  ): Promise<Device> {
    const response = await apiRequest<DeviceResponse>(
      `/devices/${id}/status`,
      {
        method: 'PATCH',
        body: { status },
      }
    );

    return toDevice(response);
  },
};