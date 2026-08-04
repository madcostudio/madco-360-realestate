export type TourEventType =
  | 'tour_open'
  | 'scene_change'
  | 'tour_heartbeat'
  | 'tour_enquiry_from_tour';

export interface TourEventData {
  type: TourEventType;
  propertyId?: string;
  userId?: string;
  sessionId?: string;
  meta?: Record<string, any>;
}

const memoryEventsLog: Array<TourEventData & { timestamp: string }> = [];

export async function trackEvent(
  type: TourEventType,
  propertyId?: string,
  meta?: Record<string, any>
) {
  const eventPayload = {
    type,
    propertyId,
    meta: meta || {},
    timestamp: new Date().toISOString(),
  };

  memoryEventsLog.push(eventPayload);
  console.log(`[EVENT_TRACKED] ${type}:`, eventPayload);

  return { success: true, event: eventPayload };
}

export function getLoggedEvents() {
  return memoryEventsLog;
}
