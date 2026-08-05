import logo from './logo.svg'
import hero_img from './hero.svg'
import circuit_bg from './circuit_bg.svg'
import about_img from './about.svg'
import contact_img from './contact.svg'
import support_img from './support.svg'
import quality_icon from './quality.svg'
import exchange_icon from './exchange.svg'

import device_ups from './device_ups.svg'
import device_battery from './device_battery.svg'
import device_charger from './device_charger.svg'
import device_universal from './device_universal.svg'
import device_adapter from './device_adapter.svg'
import device_accessory from './device_accessory.svg'

import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import profile_icon from './profile_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import menu_icon from './menu_icon.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'

export const assets = {
    logo,
    hero_img,
    circuit_bg,
    about_img,
    contact_img,
    support_img,
    quality_icon,
    exchange_icon,
    device_ups,
    device_battery,
    device_charger,
    device_universal,
    device_adapter,
    device_accessory,
    cart_icon,
    dropdown_icon,
    profile_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    menu_icon,
    razorpay_logo,
    stripe_logo,
    cross_icon
}

export const products = [
    {
        _id: "aaaaa",
        name: "Simtek Automatic Battery Charger 6A",
        description: "Brand: Simtek. Voltage: 12V. Ampere: 6A, 8A, 10A. Compatible Battery Capacity: Up to 120Ah. Warranty: 1 Year. Stock: In Stock. Fully automatic battery charger with overcharge, reverse polarity, and short-circuit protection. Ideal for everyday home and garage charging.",
        price: 6500,
        image: [device_charger],
        category: "Battery Chargers",
        subCategory: "Simtek",
        sizes: ["6A", "8A", "10A"],
        date: 1716634345448,
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Osaka Smart Charger 12V/24V 10A",
        description: "Brand: Osaka. Voltage: 12V/24V. Ampere: 10A, 15A, 20A. Compatible Battery Capacity: Up to 240Ah. Warranty: 1 Year. Stock: In Stock. Microprocessor-controlled smart charger for all lead-acid, AGM, and gel batteries.",
        price: 12500,
        image: [device_charger],
        category: "Battery Chargers",
        subCategory: "Osaka",
        sizes: ["10A", "15A", "20A"],
        date: 1716621345448,
        bestseller: true
    },
    {
        _id: "aaaac",
        name: "AGS Heavy Duty Battery Charger 20A",
        description: "Brand: AGS. Voltage: 12V. Ampere: 12A, 20A, 30A. Compatible Battery Capacity: Up to 300Ah. Warranty: 6 Months. Stock: In Stock. Heavy-duty charger built for professional use and large-capacity batteries with continuous charge mode.",
        price: 18500,
        image: [device_ups],
        category: "Battery Chargers",
        subCategory: "AGS",
        sizes: ["12A", "20A", "30A"],
        date: 1716234545448,
        bestseller: true
    },
    {
        _id: "aaaad",
        name: "Phoenix Trickle Charger 8A",
        description: "Brand: Phoenix. Voltage: 12V. Ampere: 4A, 6A, 8A. Compatible Battery Capacity: Up to 90Ah. Warranty: 1 Year. Stock: In Stock. Compact automatic charger that keeps batteries topped up during long storage periods.",
        price: 8200,
        image: [device_universal],
        category: "Battery Chargers",
        subCategory: "Phoenix",
        sizes: ["4A", "6A", "8A"],
        date: 1716621345448,
        bestseller: true
    },
    {
        _id: "aaaae",
        name: "Voltique Hub Universal Battery Charger",
        description: "Brand: Voltique Hub. Voltage: 12V. Ampere: 6A, 10A, 12A. Compatible Battery Capacity: Up to 150Ah. Warranty: 6 Months. Stock: In Stock. Versatile automatic charger with LED charge indicators.",
        price: 7200,
        image: [device_ups],
        category: "Battery Chargers",
        subCategory: "Voltique Hub",
        sizes: ["6A", "10A", "12A"],
        date: 1716622345448,
        bestseller: true
    },
    {
        _id: "aaaaf",
        name: "Simtek Professional Charger 12V/24V 15A",
        description: "Brand: Simtek. Voltage: 12V/24V. Ampere: 15A, 25A, 40A. Compatible Battery Capacity: Up to 400Ah. Warranty: 1 Year. Stock: In Stock. Professional-grade charger for heavy-duty applications.",
        price: 24000,
        image: [device_charger],
        category: "Battery Chargers",
        subCategory: "Simtek",
        sizes: ["15A", "25A", "40A"],
        date: 1716623423448,
        bestseller: false
    },
    {
        _id: "aaaag",
        name: "Battery Charger Cable Set",
        description: "Brand: Voltique Hub. Voltage: 12V/24V. Ampere: 10A. Warranty: 3 Months. Stock: In Stock. Durable copper charger cables with molded clamps for reliable connections on all battery chargers.",
        price: 950,
        image: [device_accessory],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["1M", "2M", "3M"],
        date: 1716621542448,
        bestseller: false
    },
    {
        _id: "aaaah",
        name: "Heavy Duty Crocodile Clip Set",
        description: "Brand: Voltique Hub. Voltage: 12V/24V. Ampere: 30A. Warranty: 3 Months. Stock: In Stock. Insulated copper crocodile clips with strong spring jaws for secure battery connections.",
        price: 650,
        image: [device_accessory],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["Pair", "Set of 4", "Set of 8"],
        date: 1716622345448,
        bestseller: false
    },
    {
        _id: "aaaai",
        name: "Battery Clamp Set (Red/Black)",
        description: "Brand: Voltique Hub. Voltage: 12V/24V. Ampere: 50A. Warranty: 3 Months. Stock: In Stock. High-current battery clamps with color-coded insulation for safe, foolproof hookup.",
        price: 1200,
        image: [device_adapter],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["Clamp Pair", "With Cable", "Deluxe Set"],
        date: 1716621235448,
        bestseller: false
    },
    {
        _id: "aaaaj",
        name: "Charger Extension Cable 3M",
        description: "Brand: Voltique Hub. Voltage: 230V. Ampere: 16A. Warranty: 6 Months. Stock: In Stock. Heavy-duty extension cable for reaching your battery easily in any workshop or garage.",
        price: 1400,
        image: [device_adapter],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["3M", "5M", "10M"],
        date: 1716622235448,
        bestseller: false
    },
    {
        _id: "aaaak",
        name: "Charging Connector Kit",
        description: "Brand: Voltique Hub. Voltage: 12V/24V. Ampere: 20A. Warranty: 3 Months. Stock: In Stock. Assorted ring and spade connectors for replacing worn charger terminals and fittings.",
        price: 750,
        image: [device_accessory],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["20 Pcs", "50 Pcs", "100 Pcs"],
        date: 1716623345448,
        bestseller: false
    },
    {
        _id: "aaaal",
        name: "AGS Charger Spare Parts Kit",
        description: "Brand: AGS. Voltage: 12V. Ampere: 10A. Warranty: 3 Months. Stock: In Stock. Genuine spare parts for AGS chargers including fuses, clamps, and internal leads.",
        price: 1800,
        image: [device_accessory],
        category: "Accessories",
        subCategory: "AGS",
        sizes: ["Basic Kit", "Pro Kit"],
        date: 1716624445448,
        bestseller: false
    },
    {
        _id: "aaaam",
        name: "Phoenix 12V 6A Battery Charger",
        description: "Brand: Phoenix. Voltage: 12V. Ampere: 6A. Compatible Battery Capacity: Up to 80Ah. Warranty: 1 Year. Stock: In Stock. Reliable entry-level charger for everyday battery charging needs.",
        price: 5800,
        image: [device_ups],
        category: "Battery Chargers",
        subCategory: "Phoenix",
        sizes: ["6A"],
        date: 1716625545448,
        bestseller: false
    },
    {
        _id: "aaaan",
        name: "Osaka 12V 6A Automatic Charger",
        description: "Brand: Osaka. Voltage: 12V. Ampere: 6A. Compatible Battery Capacity: Up to 100Ah. Warranty: 1 Year. Stock: In Stock. Compact automatic charger with float mode and thermal protection.",
        price: 6900,
        image: [device_universal],
        category: "Battery Chargers",
        subCategory: "Osaka",
        sizes: ["6A"],
        date: 1716626645448,
        bestseller: false
    },
    {
        _id: "aaaao",
        name: "Heavy Duty Ring Terminal Cable Kit",
        description: "Brand: Voltique Hub. Voltage: 12V. Ampere: 25A. Warranty: 3 Months. Stock: In Stock. Pre-assembled ring terminal cables for hardwiring chargers to batteries.",
        price: 1100,
        image: [device_adapter],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["30cm", "60cm", "1M"],
        date: 1716627745448,
        bestseller: false
    },
    {
        _id: "aaaap",
        name: "Simtek 12V 10A Workshop Charger",
        description: "Brand: Simtek. Voltage: 12V. Ampere: 10A. Compatible Battery Capacity: Up to 160Ah. Warranty: 1 Year. Stock: In Stock. Reliable workshop charger with analog amp meter and heavy-duty case.",
        price: 9800,
        image: [device_ups],
        category: "Battery Chargers",
        subCategory: "Simtek",
        sizes: ["10A"],
        date: 1716628845448,
        bestseller: false
    },
    {
        _id: "aaaaq",
        name: "Battery Terminal Protector Set",
        description: "Brand: Voltique Hub. Voltage: 12V. Ampere: 20A. Warranty: 3 Months. Stock: In Stock. Corrosion-resistant terminal protectors and washers for clean, lasting battery connections.",
        price: 550,
        image: [device_battery],
        category: "Accessories",
        subCategory: "Voltique Hub",
        sizes: ["Pair", "Set of 4"],
        date: 1716629945448,
        bestseller: false
    },
    {
        _id: "aaaar",
        name: "AGS 12V/24V Dual Voltage Charger 15A",
        description: "Brand: AGS. Voltage: 12V/24V. Ampere: 15A. Compatible Battery Capacity: Up to 200Ah. Warranty: 1 Year. Stock: In Stock. Dual voltage selector for charging 12V and 24V systems.",
        price: 16500,
        image: [device_charger],
        category: "Battery Chargers",
        subCategory: "AGS",
        sizes: ["15A"],
        date: 1716631045448,
        bestseller: false
    }
]
