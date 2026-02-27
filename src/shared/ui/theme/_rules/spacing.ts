import type { Rule } from 'unocss';

import { gapSpacing, marginSpacing, paddingSpacing } from '../utils/utilities';

export const margin: Rule[] = [[/^u-m([xylrtb]?)-(.+)$/, marginSpacing]];

export const padding: Rule[] = [[/^u-p([xylrtb]?)-(.+)$/, paddingSpacing]];

export const gap: Rule[] = [[/^u-gap-(?:([xy])-)?(.+)$/, gapSpacing]];

