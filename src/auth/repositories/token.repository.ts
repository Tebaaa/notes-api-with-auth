import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Token } from '../entities';

export class TokenRepository extends Repository<Token> {
  constructor(
    @InjectRepository(Token)
    private repository: Repository<Token>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getByRefreshToken(refreshToken: string): Promise<Token> {
    return this.repository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });
  }
}
