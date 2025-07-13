import { EnumUserRole } from "../models/user";

export interface LoggedInUserTokenData {
  id: string;
  email: string;
  role: EnumUserRole;
  //   doctorId?: string;
  //   patientId?: string;
}
