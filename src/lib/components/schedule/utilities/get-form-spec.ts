import type { z } from 'zod/v3';

import type { DescribeFullSchedule } from '$lib/types/schedule';

import { durationString } from '../schema/common';
import { formSpecSchema, type FormSpecSchema } from '../schema/form';

import type { RangeSpec, ScheduleSpec } from '$types';

// Frozen specs carry only the representation the server consolidated them into
// (a calendar or an interval), so they omit the sibling field. zod fills the
// rest with defaults on validation; these values match the schema's input
// shape, and the cast bridges to its populated output type.
type FormSpecInput = z.input<typeof formSpecSchema>;
type FormRange = { start: number; end?: number; step?: number };

function normalizeRanges(
  ranges: RangeSpec[] | null | undefined,
  defaultStart: number,
): FormRange[] {
  return (ranges ?? []).map((range) => ({
    start: range.start ?? defaultStart,
    ...(range.end != null ? { end: range.end } : {}),
    ...(range.step != null ? { step: range.step } : {}),
  }));
}

export function getFormSpecFromSpec(
  spec: ScheduleSpec | null | undefined,
): FormSpecSchema[] {
  const specs: FormSpecInput[] = [];

  for (const calendar of spec?.structuredCalendar ?? []) {
    specs.push({
      kind: 'frozen',
      calendar: {
        dayOfMonth: calendar.dayOfMonth
          ? normalizeRanges(calendar.dayOfMonth, 1)
          : [{ start: 1, end: 31, step: 1 }],
        dayOfWeek: normalizeRanges(
          calendar.dayOfWeek ?? [{ start: 0, end: 6, step: 1 }],
          0,
        ),
        hour: normalizeRanges(calendar.hour, 0),
        minute: normalizeRanges(calendar.minute, 0),
        second: normalizeRanges(calendar.second, 0),
        month: calendar.month
          ? normalizeRanges(calendar.month, 1)
          : [{ start: 1, end: 12, step: 1 }],
        year: calendar.year ? normalizeRanges(calendar.year, 0) : undefined,
        comment: calendar.comment ?? '',
      },
    });
  }

  for (const interval of spec?.interval ?? []) {
    specs.push({
      kind: 'frozen',
      interval: {
        interval: durationString().safeParse(interval.interval)?.data ?? '0s',
        phase: durationString().safeParse(interval.phase)?.data ?? '0s',
      },
    });
  }

  return specs as unknown as FormSpecSchema[];
}

export function getFormSpecsFromDescribeFullSchedule(
  describeFullSchedule: DescribeFullSchedule,
): FormSpecSchema[] {
  return getFormSpecFromSpec(describeFullSchedule?.schedule?.spec);
}
