/**
 * Три URL фотографий на каждый шаблон из `NAME_TEMPLATES` (тот же порядок, что в mockProducts.ts).
 * Источник: в основном Wikimedia Commons (CC BY-SA, CC0, GFDL и др.) — реальные автозапчасти и узлы.
 * Указание авторства: см. страницы файлов на commons.wikimedia.org.
 */
const BRAKE_PAD =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Brake_pad.jpg/800px-Brake_pad.jpg'
const DISC_BRAKE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Disc_brake.jpg/800px-Disc_brake.jpg'
const OIL_FILTER =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Oil_filter.JPG/800px-Oil_filter.JPG'
const SPARK_PLUGS =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Spark_plugs.jpg/800px-Spark_plugs.jpg'
const TIMING_BELT = 'https://upload.wikimedia.org/wikipedia/commons/4/42/Timing_belt.jpg'
const RADIATOR = 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Automobile_radiator.jpg'
const ALTERNATOR =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Alternator.jpg/800px-Alternator.jpg'
const CAR_BATTERY =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Car_battery.jpg/800px-Car_battery.jpg'
const COIL_SPRING = 'https://upload.wikimedia.org/wikipedia/commons/7/70/Coil_spring.JPG'
const ENGINE_OIL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Engine_oil.jpg/960px-Engine_oil.jpg'
const CATALYTIC = 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Catalytic_converter.jpg'
const HEADLAMP =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Headlamp.jpg/800px-Headlamp.jpg'
const REAR_MIRROR =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rear-view_mirror.jpg/800px-Rear-view_mirror.jpg'
const IGNITION_COIL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ignition_coil.jpg/960px-Ignition_coil.jpg'
const ANTIFREEZE = 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Antifreeze.jpg'
const PISTON = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Piston.jpg/960px-Piston.jpg'
const O_RING = 'https://upload.wikimedia.org/wikipedia/commons/7/7e/O-Ring.png'

/** Порядок = порядок объектов в `NAME_TEMPLATES` в mockProducts.ts */
export const PART_PRODUCT_IMAGE_TRIPLETS: readonly [string, string, string][] = [
  [BRAKE_PAD, DISC_BRAKE, BRAKE_PAD],
  [OIL_FILTER, RADIATOR, ENGINE_OIL],
  [OIL_FILTER, ENGINE_OIL, OIL_FILTER],
  [SPARK_PLUGS, IGNITION_COIL, SPARK_PLUGS],
  [COIL_SPRING, DISC_BRAKE, RADIATOR],
  [TIMING_BELT, ALTERNATOR, SPARK_PLUGS],
  [DISC_BRAKE, BRAKE_PAD, DISC_BRAKE],
  [OIL_FILTER, RADIATOR, OIL_FILTER],
  [DISC_BRAKE, COIL_SPRING, PISTON],
  [RADIATOR, ENGINE_OIL, ALTERNATOR],
  [ALTERNATOR, CAR_BATTERY, SPARK_PLUGS],
  [ALTERNATOR, CAR_BATTERY, IGNITION_COIL],
  [DISC_BRAKE, TIMING_BELT, PISTON],
  [RADIATOR, TIMING_BELT, OIL_FILTER],
  [TIMING_BELT, O_RING, PISTON],
  [PISTON, COIL_SPRING, DISC_BRAKE],
  [DISC_BRAKE, BRAKE_PAD, COIL_SPRING],
  [O_RING, COIL_SPRING, PISTON],
  [COIL_SPRING, DISC_BRAKE, TIMING_BELT],
  [PISTON, OIL_FILTER, TIMING_BELT],
  [IGNITION_COIL, SPARK_PLUGS, IGNITION_COIL],
  [DISC_BRAKE, BRAKE_PAD, ALTERNATOR],
  [CATALYTIC, SPARK_PLUGS, IGNITION_COIL],
  [TIMING_BELT, ALTERNATOR, OIL_FILTER],
  [RADIATOR, PISTON, O_RING],
  [RADIATOR, ENGINE_OIL, OIL_FILTER],
  [O_RING, COIL_SPRING, DISC_BRAKE],
  [OIL_FILTER, RADIATOR, TIMING_BELT],
  [BRAKE_PAD, DISC_BRAKE, BRAKE_PAD],
  [DISC_BRAKE, TIMING_BELT, PISTON],
  [BRAKE_PAD, BRAKE_PAD, DISC_BRAKE],
  [RADIATOR, ALTERNATOR, ENGINE_OIL],
  [ALTERNATOR, CAR_BATTERY, RADIATOR],
  [TIMING_BELT, ALTERNATOR, SPARK_PLUGS],
  [TIMING_BELT, OIL_FILTER, RADIATOR],
  [COIL_SPRING, HEADLAMP, REAR_MIRROR],
  [HEADLAMP, REAR_MIRROR, CAR_BATTERY],
  [REAR_MIRROR, HEADLAMP, ENGINE_OIL],
  [ENGINE_OIL, ANTIFREEZE, OIL_FILTER],
  [ENGINE_OIL, OIL_FILTER, ANTIFREEZE],
  [ANTIFREEZE, ENGINE_OIL, RADIATOR],
  [HEADLAMP, REAR_MIRROR, HEADLAMP],
  [CAR_BATTERY, ALTERNATOR, SPARK_PLUGS],
  [CAR_BATTERY, ALTERNATOR, IGNITION_COIL],
  [CATALYTIC, CATALYTIC, RADIATOR],
  [RADIATOR, OIL_FILTER, PISTON],
  [SPARK_PLUGS, IGNITION_COIL, TIMING_BELT],
  [O_RING, PISTON, OIL_FILTER],
  [O_RING, TIMING_BELT, PISTON],
  [PISTON, O_RING, OIL_FILTER],
  [RADIATOR, CATALYTIC, ENGINE_OIL],
  [RADIATOR, ALTERNATOR, CAR_BATTERY],
  [IGNITION_COIL, ALTERNATOR, SPARK_PLUGS],
  [CATALYTIC, RADIATOR, DISC_BRAKE],
  [IGNITION_COIL, RADIATOR, ALTERNATOR],
]
