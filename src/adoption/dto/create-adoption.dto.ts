import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAdoptionDto {
  @IsUUID()
  petId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
