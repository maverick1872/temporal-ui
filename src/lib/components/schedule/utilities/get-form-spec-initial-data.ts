import type { z } from 'zod/v3';

import {
  type FormSpecKind,
  type FormSpecSchema,
  formSpecSchema,
} from '../schema/form';

// Partial seeds matching the schema's input shape; zod fills the remaining
// fields with defaults on submit, so the cast bridges input to output type.
type FormSpecInput = z.input<typeof formSpecSchema>;

function seedSpec(
  kind: Exclude<FormSpecKind, 'none' | 'frozen'>,
): FormSpecInput {
  switch (kind) {
    case 'cron': {
      return {
        kind: 'cron',
        cronString: '',
      };
    }

    case 'week': {
      return {
        kind: 'week',
        calendar: {
          dayOfWeek: [{ start: new Date().getDay() }],
          hour: [],
          minute: [],
          second: [],
        },
      };
    }

    case 'month': {
      return {
        kind: 'month',
        calendar: {
          dayOfMonth: [{ start: new Date().getDate() }],
          month: [{ start: new Date().getMonth() + 1 }],
        },
      };
    }

    case 'interval': {
      return {
        kind: 'interval',
        interval: {
          interval: undefined,
          phase: undefined,
        },
      };
    }
  }
}

export function getFormSpecInitialData(
  kind: Exclude<FormSpecKind, 'none' | 'frozen'>,
): FormSpecSchema {
  return seedSpec(kind) as unknown as FormSpecSchema;
}
