import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Blacklist } from '../entities';

export class BlacklistRepository extends Repository<Blacklist> {
  constructor(
    @InjectRepository(Blacklist)
    private repository: Repository<Blacklist>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findOneByAccessToken(accessToken: string): Promise<Blacklist> {
    return this.repository.findOne({ where: { accessToken } });
  }

  async findOneByRefreshToken(refreshToken: string): Promise<Blacklist> {
    return this.repository.findOne({ where: { refreshToken } });
  }
}
