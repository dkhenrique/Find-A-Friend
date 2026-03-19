export class AdoptionsListDto {
  constructor(
    readonly adopterId: string,
    readonly petId: string,
    readonly adopterName: string,
    readonly petName: string,
    readonly adotado: boolean,
  ) {}
}
