// All "one of a pair" item types — single source of truth
export const CATEGORIES = [
  { value: 'sock', label: 'Sock' },
  { value: 'shoe', label: 'Shoe' },
  { value: 'glove', label: 'Glove' },
  { value: 'earbud', label: 'Earbud' },
  { value: 'earring', label: 'Earring' },
  { value: 'contact_lens', label: 'Contact lens' },
  { value: 'chopstick', label: 'Chopstick' },
  { value: 'cufflink', label: 'Cufflink' },
  { value: 'pedal', label: 'Pedal (bicycle)' },
  { value: 'wheel', label: 'Wheel (skate/rollerblade)' },
  { value: 'controller', label: 'Controller (gaming/VR)' },
  { value: 'slipper', label: 'Slipper / flip-flop' },
  { value: 'arm_warmer', label: 'Arm warmer' },
  { value: 'headphone', label: 'Headphone' },
  { value: 'battery', label: 'Battery (one of a pair)' },
  { value: 'other', label: 'Other' },
]

export const CATEGORY_LIST = CATEGORIES.map((c) => c.label).join(', ')

export function getCategoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value || 'Other'
}

