import icon1 from "../assets/images/dawa.png";
import icon2 from "../assets/images/dawa2.png";
import icon3 from "../assets/images/dawa3.png";

export const data = [
  {
    id: 1,
    image: require("../assets/images/image1.png"),
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 2,
    image: require("../assets/images/image2.png"),
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    image: require("../assets/images/image3.png"),
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];
export const sliderImages = [
  require("../assets/images/farm.jpeg"),
  require("../assets/images/terraces.jpeg"),
];
export const toolCategories = [
  {
    id: 1,
    description: "herbicides,pestcides,fungicides etc.",
    name: "Chemicals",
    icon: require("../assets/images/gallon.png"),
  },
  {
    id: 2,
    description: "Local,hybrid",
    name: "Seeds",
    icon: require("../assets/images/nuts.png"),
  },
  {
    id: 3,
    description: "cultivator,pianter,harvester,sprayers",
    name: "Machines",
    icon: require("../assets/images/tractor.png"),
  },
];
export const chemicalsData = [
  {
    id: 1,
    description:
      " economy",
    icon: icon1,
    price: "12,000/=Tsh",
    name: "product1 name",
  },
  {
    id: 2,
    description: "description2",
    icon: icon2,
    price: "45,000/=Tsh",
    name: "product2 name",
  },
  {
    id: 3,
    description: "description3",
    icon: icon3,
    price: "17,500/=Tsh",
    name: "product3 name",
  },
];
export function convertUSDToTZS(usdAmount) {
  if (typeof usdAmount !== 'string') {
    throw new Error('Input should be a string representing USD amount');
  }

  // Remove dollar sign if present and convert to number
  const amount = parseFloat(usdAmount.replace('$', ''));

  if (isNaN(amount)) {
    throw new Error('Invalid USD amount format');
  }

  // Conversion rate (example rate)
  const conversionRate = 2316.75; // 1 USD = 2316.75 TZS (example rate)

  // Perform the conversion
  const tzsAmount = amount * conversionRate;

  // Format TZS amount as currency without decimals
  const formattedTZS = tzsAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Return the formatted amount in TZS
  return formattedTZS;
}
export function formatTZSCurrency(amount) {
  if (isNaN(amount)) {
    return null;
  }

  // Convert the number to a string with commas as thousand separators
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
export function getHourAndMinute(timestamp) {
  const date = new Date(timestamp);
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}
export const formatTime = (milliseconds) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
};
export function getRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const diffInMilliseconds = now - date;
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return 'A long time ago';
  }
}
export const userLevels = [
  { level: 1, name: "Newbie" },
  { level: 2, name: "Explorer" },
  { level: 3, name: "Intermediate" },
  { level: 4, name: "Advanced" },
  { level: 5, name: "Expert" },
];