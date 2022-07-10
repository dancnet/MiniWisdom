import { writable } from 'svelte/store';
export const mode = writable(0);
// 0: searching by location
// 1: searching by approximate location or approximate content or random
// 2: showing questions / answers
// 3: showing learn