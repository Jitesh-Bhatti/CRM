import { FileRepository } from '../repositories/file.repository';
import { CreateFileDTO, File, FileEntityType } from '../types';
import { ApiError } from '../../../errors/ApiError';

export class FileService {
  private repository: FileRepository;

  constructor() {
    this.repository = new FileRepository();
  }

  async saveFileMetadata(organizationId: string, userId: string, fileData: Express.Multer.File, body: any): Promise<File> {
    // Generate the URL for local access (assuming your API serves the /uploads folder)
    const fileUrl = `/uploads/${fileData.filename}`;

    const dto: CreateFileDTO = {
      file_name: fileData.originalname,
      file_url: fileUrl,
      file_type: fileData.mimetype,
      file_size: fileData.size,
      entity_type: body.entity_type as FileEntityType,
      entity_id: body.entity_id,
      storage_provider: 'local'
    };

    return await this.repository.create(organizationId, userId, dto);
  }

  async getFiles(organizationId: string, entityType?: string, entityId?: string): Promise<File[]> {
    return await this.repository.findAllByOrg(organizationId, entityType, entityId);
  }

  async getFileById(id: string, organizationId: string): Promise<File> {
    const file = await this.repository.findByIdAndOrg(id, organizationId);
    if (!file) {
      throw new ApiError(404, 'File not found');
    }
    return file;
  }

  async deleteFile(id: string, organizationId: string): Promise<void> {
    await this.getFileById(id, organizationId); // Verifies it exists and belongs to org
    await this.repository.softDelete(id, organizationId);
    
    // Note: To be ultra-clean, you would also use `fs.unlinkSync` here to physically 
    // delete the file from your local `uploads/` folder to save hard drive space.
  }
}