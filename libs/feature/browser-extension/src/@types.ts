import { A11y } from '@scribit/shared/types';

export type UserPreferences = { [key in A11y.Feature]: boolean };
