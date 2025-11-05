import {User} from './user.model';

export interface LoginRequest extends Pick<User, 'email'>{
  password: string;
}

