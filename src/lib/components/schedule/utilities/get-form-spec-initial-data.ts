import type { z } from 'zod/v3';

import {
  type FormSpecKind,
  type FormSpecSchema,
  formSpecSchema,
} from '../schema/form';

// These seed a spec being edited in the form. They are intentionally partial —
// zod fills the remaining fields (`interval`, `calendar`, `cronString`) with
// their schema defaults when the form is validated on submit — so they match
// the schema's input shape rather than its fully-populated output. The cast
// bridges that input/output gap without materializing defaults early (which
// would change what the form and its tests observe).
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
