export type FileEntityType = 'project' | 'task' | 'client';
export type StorageProviderType = 's3' | 'r2' | 'local';

export interface File {
  id: string;
  organization_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string;
  entity_type: FileEntityType | null;
  entity_id: string | null;
  version: number;
  created_at: Date;
  storage_provider: StorageProviderType;
  deleted_at: Date | null;
}

export interface CreateFileDTO {
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  entity_type?: FileEntityType;
  entity_id?: string;
  storage_provider?: StorageProviderType;
}