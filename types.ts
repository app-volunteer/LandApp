
export interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

export interface Template {
  id: string;
  name: string;
  html: string;
}

export interface Project {
  id?: string;
  userId?: string;
  templateId: string;
  templateName: string;
  formData: Record<string, string>;
  filledHtml: string;
  createdAt: any;
  userName?: string | null;
}
