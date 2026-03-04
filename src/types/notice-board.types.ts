export type NoticeBoardI = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  postal_code: string;
  city?: string;
  service_type?: string;
  status: "active" | "closed";
  created_at: Date;
  updated_at?: Date;
};

export type NoticeBoardFormI = {
  captcha: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  postal_code: string;
  city?: string;
  service_type?: string;
};
