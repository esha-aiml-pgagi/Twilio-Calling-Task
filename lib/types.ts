export interface CallRecord {
  id: number;
  receiver_first_name: string;
  receiver_last_name: string;
  number: string;
  company: string;
  description: string;
  personal_notes: string;
  call_sids: string[];
  recording_sids: string[];
  recording_urls: string[];
  recording_durations: string[];
  statuses: string[];
  created_at: string;
}

export type CallState = 
  | 'idle'
  | 'connecting'
  | 'ringing'
  | 'in-progress'
  | 'ended';

export interface CallSession {
  phoneNumber: string;
  state: CallState;
  startTime: number | null;
  duration: number;
  callSid: string | null;
}
