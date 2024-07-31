import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Translation files
const resources = {
  en: {
    translation: {
      profile: "Profile",
      preferences: "Preferences",
      language: "Language",
      darkMode: "Dark Mode",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      reportBug: "Report Bug",
      contactUs: "Contact Us",
      rateInAppStore: "Rate in App Store",
      selectLanguage: "Select Language",
      searchPlaceholder: "Search agrovet products",
      search: "Search",
      allShops: "All shops",
      joinFray: "Join the fray",
      communitySpaces: "community spaces",
      tapToSelect: "Tap to select media",
      description: "Description",
      createPost: "Create post",
      location: "Location",
      help: "Help",
      noProducts: "No products available"
    },
  },
  es: {
    translation: {
      profile: "Perfil",
      preferences: "Preferencias",
      language: "Idioma",
      darkMode: "Modo Oscuro",
      emailNotifications: "Notificaciones por Correo",
      pushNotifications: "Notificaciones Push",
      reportBug: "Informar de un Error",
      contactUs: "Contáctenos",
      rateInAppStore: "Calificar en la Tienda",
      selectLanguage: "Seleccionar Idioma",
      searchPlaceholder: "buscar productos agropecuarios",
      search: "buscar",
      allShops: "Todas las tiendas",
      joinFray: "Únete a la refriega",
      communitySpaces: "Espacios comunitarios",
      tapToSelect: "Toca para seleccionar medios",
      description: "descripción",
      createPost: "Crear publicación",
      location: "ubicación",
      help: "ayuda",
      noProducts: "No hay productos disponibles"
    },
  },
  fr: {
    translation: {
      profile: "Profil",
      preferences: "Préférences",
      language: "Langue",
      darkMode: "Mode sombre",
      emailNotifications: "Notifications par e-mail",
      pushNotifications: "Notifications push",
      reportBug: "Signaler un bug",
      contactUs: "Contactez-nous",
      rateInAppStore: "Évaluez sur l'App Store",
      selectLanguage: "Sélectionner la langue",
      searchPlaceholder: "rechercher des produits agroalimentaires",
      search: "rechercher",
      allShops: "Tous les magasins",
      joinFray: "Rejoignez la mêlée",
      communitySpaces: "Espaces communautaires",
      tapToSelect: "Appuyez pour sélectionner un média",
      description: "description",
      createPost: "Créer une publication",
      location: "emplacement",
      help: "aide",
      noProducts: "Aucun produit disponible"

    }
  },
  de: {
    translation: {
      profile: "Profil",
      preferences: "Einstellungen",
      language: "Sprache",
      darkMode: "Dunkler Modus",
      emailNotifications: "E-Mail-Benachrichtigungen",
      pushNotifications: "Push-Benachrichtigungen",
      reportBug: "Fehler melden",
      contactUs: "Kontakt",
      rateInAppStore: "Im App Store bewerten",
      selectLanguage: "Sprache auswählen",
      searchPlaceholder: "Agrovet-Produkte suchen",
      search: "suchen",
      allShops: "Alle Geschäfte",
      joinFray: "Schließe dich dem Kampf an",
      communitySpaces: "Gemeinschaftsräume",
      tapToSelect: "Tippe zum Auswählen von Medien",
      description: "Beschreibung",
      createPost: "Beitrag erstellen",
      location: "Standort",
      help: "Hilfe",
      noProducts: "Keine Produkte verfügbar"

    }
  },
  it: {
    translation: {
      profile: "Profilo",
      preferences: "Preferenze",
      language: "Lingua",
      darkMode: "Modalità oscura",
      emailNotifications: "Notifiche email",
      pushNotifications: "Notifiche push",
      reportBug: "Segnala un bug",
      contactUs: "Contattaci",
      rateInAppStore: "Valuta sull'App Store",
      selectLanguage: "Seleziona lingua",
      searchPlaceholder: "cercare prodotti agroalimentari",
      search: "cercare",
      allShops: "Tutti i negozi",
      joinFray: "Unisciti alla mischia",
      communitySpaces: "Spazi comunitari",
      tapToSelect: "Tocca per selezionare un supporto",
      description: "descrizione",
      createPost: "Crea un post",
      location: "posizione",
      help: "aiuto",
      noProducts: "Nessun prodotto disponibile"

    }
  },
  pt: {
    translation: {
      profile: "Perfil",
      preferences: "Preferências",
      language: "Idioma",
      darkMode: "Modo escuro",
      emailNotifications: "Notificações por e-mail",
      pushNotifications: "Notificações push",
      reportBug: "Reportar bug",
      contactUs: "Contato",
      rateInAppStore: "Avalie na App Store",
      selectLanguage: "Selecionar idioma",
      searchPlaceholder: "pesquisar produtos agropecuários",
      search: "pesquisar",
      allShops: "Todas as lojas",
      joinFray: "Junte-se à briga",
      communitySpaces: "Espaços comunitários",
      tapToSelect: "Toque para selecionar mídia",
      description: "descrição",
      createPost: "Criar publicação",
      location: "localização",
      help: "ajuda",
      noProducts: "Nenhum produto disponível"

    }
  },
  hi: {
    translation: {
      profile: "प्रोफ़ाइल",
      preferences: "वरीयताएँ",
      language: "भाषा",
      darkMode: "डार्क मोड",
      emailNotifications: "ईमेल सूचनाएँ",
      pushNotifications: "पुश सूचनाएँ",
      reportBug: "बग रिपोर्ट करें",
      contactUs: "हमसे संपर्क करें",
      rateInAppStore: "ऐप स्टोर पर रेट करें",
      selectLanguage: "भाषा चुनें",
      searchPlaceholder: "कृषि उत्पाद खोजें",
      search: "खोजें",
      allShops: "सभी दुकानें",
      joinFray: "लड़ाई में शामिल हों",
      communitySpaces: "सामुदायिक स्थान",
      tapToSelect: "मीडिया चुनने के लिए टैप करें",
      description: "विवरण",
      createPost: "पोस्ट बनाएं",
      location: "स्थान",
      help: "सहायता",
      noProducts: "कोई उत्पाद उपलब्ध नहीं है"

    }
  },
  sw: {
    translation: {
      profile: "Profaili",
      preferences: "Mapendeleo",
      language: "Lugha",
      darkMode: "Njia ya Giza",
      emailNotifications: "Arifa za Barua pepe",
      pushNotifications: "Arifa za Kupaka",
      reportBug: "Ripoti Hitilafu",
      contactUs: "Wasiliana Nasi",
      rateInAppStore: "Kadiria kwenye Duka la Programu",
      selectLanguage: "Chagua Lugha",
      searchPlaceholder: "Tafuta bidhaa za kilimo",
      search: "Tafuta",
      allShops: "Maduka Yote",
      joinFray: "Jiunge na Mapambano",
      communitySpaces: "Maeneo ya jamii",
      tapToSelect: "Gonga kuchagua vyombo vya habari",
      description: "Maelezo",
      createPost: "Unda chapisho",
      location: "Mahali",
      help: "Msaada",
      noProducts: "Hakuna bidhaa zilizopo"

    }
  },
  zh: {
    translation: {
      profile: "个人资料",
      preferences: "偏好设置",
      language: "语言",
      darkMode: "暗黑模式",
      emailNotifications: "电子邮件通知",
      pushNotifications: "推送通知",
      reportBug: "报告错误",
      contactUs: "联系我们",
      rateInAppStore: "应用商店评分",
      selectLanguage: "选择语言",
      searchPlaceholder: "搜索农兽用品",
      search: "搜索",
      allShops: "所有商店",
      joinFray: "加入战斗",
      communitySpaces: "社区空间",
      tapToSelect: "点击选择媒体",
      description: "描述",
      createPost: "创建帖子",
      location: "位置",
      help: "帮助",
      noProducts: "沒有可用產品"

    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0], // Use the language part of the locale (e.g., "en" from "en-US")
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
