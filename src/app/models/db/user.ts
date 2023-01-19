
export interface User {
  email?: string;
  name?: string;
  mobile?: number;
  status?: string;
  timeStamp?: string;
  __v?: number;
  _id?: string;
}

export interface UserProfile {
  status: string;
  user: User;
}
