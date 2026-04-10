import { PetStatus } from 'src/enums/pet-status.enum';

export class AdoptionsListDto {
  constructor(
    readonly adoptionId: string,
    readonly petId: string,
    readonly adopterName: string,
    readonly petName: string,
    readonly status: PetStatus,
  ) {}
}
