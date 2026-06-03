export type Lead = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  service_interest: string | null;
  budget: string | null;
  urgency: string | null;
  created_at: string;
};

export type Conversation = {
  id: number;
  lead_id: string | null;
  message: string | null;
  sender: "user" | "agent" | string | null;
  agent_id: string | null;
  timestamp: string;
};

export type Appointment = {
  id: string;
  lead_id: string | null;
  start_time: string | null;
  end_time: string | null;
  status: string;
  type: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  lead_id: string | null;
  rating: number | null;
  feedback: string | null;
  status: string;
  created_at: string;
};

export type AiEvent = {
  id: number;
  event_type: string | null;
  payload: Record<string, unknown> | null;
  agent_id: string | null;
  timestamp: string;
};

type LeadInsert = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: string;
  service_interest?: string | null;
  budget?: string | null;
  urgency?: string | null;
};

type ConversationInsert = {
  lead_id?: string | null;
  message?: string | null;
  sender?: "user" | "agent" | string | null;
  agent_id?: string | null;
};

type AppointmentInsert = {
  lead_id?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: string;
  type?: string | null;
};

type ReviewInsert = {
  lead_id?: string | null;
  rating?: number | null;
  feedback?: string | null;
  status?: string;
};

type AiEventInsert = {
  event_type?: string | null;
  payload?: Record<string, unknown> | null;
  agent_id?: string | null;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadInsert;
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: ConversationInsert;
        Update: ConversationInsert;
        Relationships: [];
      };
      appointments: {
        Row: Appointment;
        Insert: AppointmentInsert;
        Update: AppointmentInsert;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: ReviewInsert;
        Update: ReviewInsert;
        Relationships: [];
      };
      ai_events: {
        Row: AiEvent;
        Insert: AiEventInsert;
        Update: AiEventInsert;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
