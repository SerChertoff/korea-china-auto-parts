import type { Product, VehicleCompatibility } from '../types'
import { VEHICLE_BRANDS } from './brands'
import { PART_CATEGORIES } from './categories'
import { PART_PRODUCT_IMAGE_TRIPLETS } from './partProductImages'

/** Базовые шаблоны наименований для разнообразия каталога */
const NAME_TEMPLATES: { name: string; oem: string; mfr: string; chars: Record<string, string> }[] =
  [
    {
      name: 'Тормозные колодки передние',
      oem: '58101-2TA00',
      mfr: 'Hyundai Mobis',
      chars: { Толщина: '17.5 мм', Материал: 'Керамика', Ось: 'Передняя' },
    },
    {
      name: 'Воздушный фильтр двигателя',
      oem: '28113-2P100',
      mfr: 'Mann-Filter',
      chars: { 'Тип фильтра': 'Панельный', Площадь: '0.42 м²' },
    },
    {
      name: 'Масляный фильтр',
      oem: '26300-35505',
      mfr: 'Bosch',
      chars: { Резьба: 'M20×1.5', 'Реком. замена': '15 000 км' },
    },
    {
      name: 'Свечи зажигания (комплект 4 шт.)',
      oem: '18846-11070',
      mfr: 'NGK',
      chars: { Зазор: '0.9 мм', 'Тип резьбы': 'M14×1.25' },
    },
    {
      name: 'Амортизатор передний газомасляный',
      oem: '54651-C5000',
      mfr: 'Kayaba',
      chars: { Тип: 'Газомасляный', Сторона: 'Левый/Правый' },
    },
    {
      name: 'Ремень ГРМ',
      oem: '24312-2E000',
      mfr: 'Gates',
      chars: { Зубья: '141', Ширина: '27 мм' },
    },
    {
      name: 'Тормозные диски передние (пара)',
      oem: '51712-1R000',
      mfr: 'Brembo',
      chars: { Диаметр: '305 мм', Толщина: '28 мм' },
    },
    {
      name: 'Салонный фильтр угольный',
      oem: '97133-C5000',
      mfr: 'Mahle',
      chars: { Тип: 'Угольный', Слои: '3' },
    },
    {
      name: 'Ступичный подшипник передний',
      oem: '51720-2H000',
      mfr: 'SKF',
      chars: { ABS: 'Да', Сторона: 'Универсальный' },
    },
    {
      name: 'Радиатор охлаждения двигателя',
      oem: '25310-1R000',
      mfr: 'Nissens',
      chars: { Рядов: '1', Материал: 'Алюминий-пластик' },
    },
    {
      name: 'Стартер',
      oem: '36100-2B050',
      mfr: 'Valeo',
      chars: { Мощность: '1.4 кВт', Напряжение: '12 В' },
    },
    {
      name: 'Генератор',
      oem: '37300-2B400',
      mfr: 'Denso',
      chars: { Мощность: '120 А', Напряжение: '14 В' },
    },
    {
      name: 'Комплект сцепления',
      oem: '41300-02710',
      mfr: 'LUK',
      chars: { Диск: '240 мм', Выжимной: 'Гидравлический' },
    },
    {
      name: 'Водяной насос (помпа)',
      oem: '25100-2E000',
      mfr: 'GMB',
      chars: { Крыльчатка: 'Пластик', Прокладка: 'В комплекте' },
    },
    {
      name: 'Термостат',
      oem: '25500-2E000',
      mfr: 'Wahler',
      chars: { 'Темп. открытия': '88 °C' },
    },
    {
      name: 'Рулевой наконечник',
      oem: '56820-C5000',
      mfr: 'Lemförder',
      chars: { Резьба: 'M14×1.5', Сторона: 'Левый' },
    },
    {
      name: 'Шаровая опора передняя',
      oem: '54530-C5000',
      mfr: 'Moog',
      chars: { Сторона: 'Нижняя', Крепление: 'Заклёпки' },
    },
    {
      name: 'Сайлентблок переднего рычага',
      oem: '54584-2T000',
      mfr: 'Febi',
      chars: { Позиция: 'Задний', Жёсткость: 'Стандарт' },
    },
    {
      name: 'Пружина подвески задняя',
      oem: '55330-1R000',
      mfr: 'Lesjöfors',
      chars: { Длина: '385 мм', Жёсткость: 'Стандарт' },
    },
    {
      name: 'Вкладыши шатунные (комплект)',
      oem: '23060-2E000',
      mfr: 'Kolbenschmidt',
      chars: { Размер: 'STD', Цилиндров: '4' },
    },
    {
      name: 'Катушка зажигания',
      oem: '27301-2E000',
      mfr: 'Delphi',
      chars: { Сопротивление: '1.2 Ом', Цилиндр: '1' },
    },
    {
      name: 'Датчик ABS передний',
      oem: '95670-1R000',
      mfr: 'Continental',
      chars: { Сторона: 'Передний левый', 'Тип крепления': 'Болт' },
    },
    {
      name: 'Лямбда-зонд универсальный',
      oem: '39210-2E100',
      mfr: 'NTK',
      chars: { Резьба: 'M18×1.5', Провод: '4 pin' },
    },
    {
      name: 'Комплект ГРМ (ремень + ролики)',
      oem: '24312-2E100',
      mfr: 'INA',
      chars: { Роликов: '3', Ремень: 'В комплекте' },
    },
    {
      name: 'Подушка двигателя передняя',
      oem: '21810-1R000',
      mfr: 'Corteco',
      chars: { Материал: 'Резина+металл', 'Демпфирование': 'Гидро' },
    },
    {
      name: 'Втулка стабилизатора переднего',
      oem: '54813-2T000',
      mfr: 'RBI',
      chars: { Диаметр: '22 мм', Цвет: 'Чёрный' },
    },
    {
      name: 'Топливный фильтр',
      oem: '31911-2E000',
      mfr: 'Mann-Filter',
      chars: { Тип: 'В баке', 'Давление': '3.5 бар' },
    },
    {
      name: 'Комплект тормозных колодок задних',
      oem: '58302-2TA00',
      mfr: 'Textar',
      chars: { 'С датчиком': 'Да', Ось: 'Задняя' },
    },
    {
      name: 'Диск сцепления',
      oem: '41100-02700',
      mfr: 'Sachs',
      chars: { Диаметр: '240 мм', 'Пружины': 'Демпферные' },
    },
    {
      name: 'Колодки ручного тормоза',
      oem: '58305-2S000',
      mfr: 'Akebono',
      chars: { Материал: 'Органика', Ось: 'Задняя' },
    },
    {
      name: 'Радиатор кондиционера',
      oem: '97606-1R000',
      mfr: 'NRF',
      chars: { Объём: '0.45 л', Рядов: '1' },
    },
    {
      name: 'Компрессор кондиционера',
      oem: '97701-2E000',
      mfr: 'Sanden',
      chars: { Тип: 'Поршневой', Объём: '120 см³' },
    },
    {
      name: 'Ремень приводной поликлиновый',
      oem: '25212-2E000',
      mfr: 'Dayco',
      chars: { Ручьёв: '6', Длина: '1875 мм' },
    },
    {
      name: 'Натяжитель ремня ГРМ',
      oem: '24410-2E000',
      mfr: 'INA',
      chars: { Тип: 'Гидравлический', Ролик: 'В комплекте' },
    },
    {
      name: 'Крышка багажника (амортизаторы пара)',
      oem: '81770-1R000',
      mfr: 'Stabilus',
      chars: { Усилие: '580 N', Длина: '520 мм' },
    },
    {
      name: 'Фара передняя левая (в сборе)',
      oem: '92101-C5000',
      mfr: 'DEPO',
      chars: { 'Тип лампы': 'LED', Покрытие: 'Хром' },
    },
    {
      name: 'Зеркало боковое левое с обогревом',
      oem: '87610-1R000',
      mfr: 'TYC',
      chars: { Складывание: 'Электро', Обогрев: 'Да' },
    },
    {
      name: 'Моторное масло 5W-30 синтетика 4 л',
      oem: '05100-0041M',
      mfr: 'Shell',
      chars: { ACEA: 'C3', API: 'SN Plus', Объём: '4 л' },
    },
    {
      name: 'Трансмиссионное масло ATF SP-IV 1 л',
      oem: '04500-00115',
      mfr: 'Hyundai Mobis',
      chars: { Тип: 'ATF', Допуск: 'SP-IV' },
    },
    {
      name: 'Антифриз концентрат G12++ 1 л',
      oem: '0000000000',
      mfr: 'FeBi',
      chars: { Цвет: 'Фиолетовый', Разбавление: '1:1' },
    },
    {
      name: 'Щётки стеклоочистителя комплект',
      oem: '98350-2S000',
      mfr: 'Bosch',
      chars: { Длины: '600/400 мм', Крепление: 'Bayonet' },
    },
    {
      name: 'Аккумулятор 70 А·ч обратная полярность',
      oem: '37110-1R000',
      mfr: 'Varta',
      chars: { Ёмкость: '70 А·ч', 'Пусковой ток': '640 А' },
    },
    {
      name: 'Клемма АКБ плюсовая в сборе',
      oem: '91860-1R000',
      mfr: 'Hyundai Mobis',
      chars: { Материал: 'Латунь', Покрытие: 'Никель' },
    },
    {
      name: 'Глушитель задняя часть',
      oem: '28700-2E000',
      mfr: 'Walker',
      chars: { Диаметр: '50 мм', 'Крепление': 'Фланец' },
    },
    {
      name: 'Датчик температуры ОЖ',
      oem: '39220-2E000',
      mfr: 'Facet',
      chars: { Диапазон: '-40…+150 °C', Резьба: 'M12×1.5' },
    },
    {
      name: 'Высоковольтные провода (комплект)',
      oem: '27501-26E00',
      mfr: 'NGK',
      chars: { Цилиндров: '4', Сопротивление: '16 кОм/м' },
    },
    {
      name: 'Крышка маслозаливной горловины',
      oem: '26510-2B000',
      mfr: 'Febi',
      chars: { Давление: '0.15 бар', Уплотнение: 'Резина' },
    },
    {
      name: 'Прокладка клапанной крышки',
      oem: '22441-2E000',
      mfr: 'Elring',
      chars: { Материал: 'Резина', Позиция: 'Верх' },
    },
    {
      name: 'Трос КПП выбора передач',
      oem: '43794-2E000',
      mfr: 'ATP',
      chars: { Длина: '2150 мм', Тип: 'Push-Pull' },
    },
    {
      name: 'Подшипник КПП первичного вала',
      oem: '43215-2E000',
      mfr: 'NSK',
      chars: { Тип: 'Роликовый', 'Внутренний Ø': '25 мм' },
    },
    {
      name: 'Сальник коленвала передний',
      oem: '21421-2E000',
      mfr: 'Corteco',
      chars: { 'Внешний Ø': '48 мм', 'Внутренний Ø': '35 мм' },
    },
    {
      name: 'Радиатор печки',
      oem: '97138-1R000',
      mfr: 'Nissens',
      chars: { Рядов: '1', Подключение: '16 мм' },
    },
    {
      name: 'Вентилятор охлаждения в сборе',
      oem: '25380-1R000',
      mfr: 'Valeo',
      chars: { Диаметр: '400 мм', Лопастей: '7' },
    },
    {
      name: 'Датчик положения дроссельной заслонки',
      oem: '35100-2E000',
      mfr: 'Bosch',
      chars: { Тип: 'Hall', Напряжение: '5 В' },
    },
    {
      name: 'Катализатор универсальный (евро-5)',
      oem: '28900-2E000',
      mfr: 'Walker',
      chars: { Диаметр: '120 мм', Длина: '400 мм' },
    },
  ]

if (PART_PRODUCT_IMAGE_TRIPLETS.length !== NAME_TEMPLATES.length) {
  throw new Error(
    `Число наборов фото (${PART_PRODUCT_IMAGE_TRIPLETS.length}) не совпадает с NAME_TEMPLATES (${NAME_TEMPLATES.length})`,
  )
}

function randomCompat(brandName: string): VehicleCompatibility[] {
  const modelMap: Record<string, string[]> = {
    Hyundai: ['Solaris', 'Creta', 'Tucson', 'Santa Fe'],
    Kia: ['Rio', 'Sportage', 'Seltos', 'Cerato'],
    Genesis: ['G70', 'G80', 'GV80'],
    SsangYong: ['Actyon', 'Kyron', 'Rexton'],
    Daewoo: ['Nexia', 'Matiz', 'Lanos'],
    Chery: ['Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 8'],
    Geely: ['Coolray', 'Atlas', 'Monjaro'],
    Haval: ['F7', 'Jolion', 'Dargo'],
    'Great Wall': ['Poer', 'Wingle 7'],
    BYD: ['Song Plus', 'Tang', 'Han'],
    Changan: ['CS35 Plus', 'CS55 Plus', 'UNI-K'],
    Exeed: ['TXL', 'VX', 'LX'],
  }
  const models = modelMap[brandName] ?? ['Седан', 'Кроссовер', 'Универсал']
  const pick = models[Math.floor(Math.random() * models.length)] ?? models[0]!
  const yf = 2016 + (Math.floor(Math.random() * 5) % 5)
  return [
    { brand: brandName, model: pick, yearFrom: yf, yearTo: yf + 6 },
    { brand: brandName, model: pick, yearFrom: yf - 2, yearTo: yf + 2 },
  ]
}

/** Генерация стабильного рейтинга по id */
function ratingFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997
  return Math.round((35 + (h % 15)) / 10) / 10
}

/** 52 товара с реалистичными полями для демо-каталога */
function buildProducts(): Product[] {
  const out: Product[] = []
  for (let i = 0; i < 52; i++) {
    const tpl = NAME_TEMPLATES[i % NAME_TEMPLATES.length]!
    const imgSet = PART_PRODUCT_IMAGE_TRIPLETS[i % NAME_TEMPLATES.length]!
    const brand = VEHICLE_BRANDS[i % VEHICLE_BRANDS.length]!
    const cat = PART_CATEGORIES[i % PART_CATEGORIES.length]!
    const id = `pr-${String(i + 1).padStart(3, '0')}`
    const basePrice = 1200 + (i * 137) % 42000
    const oldPrice = i % 5 === 0 ? Math.round(basePrice * 1.12) : undefined
    const inStock = i % 11 !== 0
    const stockCount = inStock ? 2 + (i % 40) : 0
    const isOriginal = i % 3 === 0

    out.push({
      id,
      name: `${tpl.name} — ${brand.name}`,
      article: `KR-${10000 + i}`,
      oem: [tpl.oem, `${tpl.oem}-ALT`],
      brand: brand.name,
      manufacturer: isOriginal ? `${brand.name} Mobis` : tpl.mfr,
      category: cat.id,
      price: basePrice,
      oldPrice,
      images: [...imgSet],
      inStock,
      stockCount,
      rating: ratingFromId(id),
      reviewsCount: 3 + (i * 7) % 240,
      isOriginal,
      compatibility: randomCompat(brand.name),
      characteristics: { ...tpl.chars, 'Страна производства': isOriginal ? 'KR/CN' : 'EU/CN' },
      description:
        `${tpl.name} для автомобилей ${brand.name}. ` +
        `Качественная деталь ${isOriginal ? 'оригинального уровня' : 'проверенного аналога'} ` +
        `с гарантией подбора по VIN. Подходит для популярных моделей ${brand.name} ` +
        `согласно таблице совместимости.`,
    })
  }
  return out
}

export const MOCK_PRODUCTS: Product[] = buildProducts()

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id)
}
