import {
  Shirt,
  Footprints,
  Hand,
  Headphones,
  Gem,
  Eye,
  UtensilsCrossed,
  Bike,
  Gamepad2,
  Battery,
  Package,
  Circle,
} from 'lucide-react'
const ICON_MAP = {
  sock: Shirt,
  shoe: Footprints,
  glove: Hand,
  earbud: Headphones,
  earring: Gem,
  contact_lens: Eye,
  chopstick: UtensilsCrossed,
  cufflink: Gem,
  pedal: Bike,
  wheel: Circle,
  controller: Gamepad2,
  slipper: Footprints,
  arm_warmer: Shirt,
  headphone: Headphones,
  battery: Battery,
  other: Package,
}

export default function CategoryIcon({ category, size = 24, className, ...props }) {
  const value = category && typeof category === 'string' ? category.toLowerCase() : 'other'
  const Icon = ICON_MAP[value] || Package
  return (
    <Icon
      size={size}
      className={className}
      aria-hidden
      {...props}
    />
  )
}
