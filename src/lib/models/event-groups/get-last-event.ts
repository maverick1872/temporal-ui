import type { WorkflowEvent } from '$lib/types/events';

import type { EventGroup } from './event-groups';

export const getLastEvent = ({ events }: EventGroup): WorkflowEvent => {
  let latestEventKey = 0;
  let result: WorkflowEvent | undefined;

  for (const event of events.values()) {
    const key = Number(event.id);
    if (key >= latestEventKey) {
      latestEventKey = key;
      result = event;
    }
  }

  return result!;
};
