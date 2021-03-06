import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import Survey from './Survey';
import User from './User';

@Entity('survey_users')
class SurveyUser {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  user_id: string; // eslint-disable-line camelcase

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  survey_id: string; // eslint-disable-line camelcase

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id' })
  survey: Survey;

  @Column()
  value: number;

  @CreateDateColumn()
  created_at: Date; // eslint-disable-line camelcase

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export default SurveyUser;
