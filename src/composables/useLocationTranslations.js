export function useLocationTranslations() {
  const { locale } = useI18n();

  const getTranslatedLocation = (location) => {
    if (!location) return "";

    if (locale.value === "ar") {
      const translations = {
        // Countries
        KSA: "المملكة العربية السعودية",
        Egypt: "مصر",

        // Egyptian Cities
        Cairo: "القاهرة",
        Giza: "الجيزة",
        Qalyubia: "القليوبية",
        Alexandria: "الإسكندرية",
        "Al-Buhaira": "البحيرة",
        Matrouh: "مطروح",
        Damietta: "دمياط",
        Dakahlia: "الدقهلية",
        "Kafr El Sheikh": "كفر الشيخ",
        Gharbia: "الغربية",
        Menoufia: "المنوفية",
        Sharkia: "الشرقية",
        Ismailia: "الإسماعيلية",
        "North Sinai": "شمال سيناء",
        "South Sinai": "جنوب سيناء",
        "Beni Suef": "بنى سويف",
        Fayoum: "الفيوم",
        Minya: "المنيا",
        Assiut: "أسيوط",
        "New Valley": "الوادى الجديد",
        Sohag: "سوهاج",
        Qena: "قنا",
        Luxor: "الأقصر",
        Aswan: "أسوان",

        // Saudi Cities
        Riyadh: "الرياض",
        Mecca: "مكة المكرمة",
        "AL Madinah AL Munawwarah": "المدينة المنورة",
        Dammam: "الدمام",
        "Al-Khobar": "الخبر",
        Dhahran: "الظهران",
        Jeddah: "جدة",
        Buraidah: "بريدة",
        Abha: "أبها",
        Jazan: "جازان",
        Tabuk: "تبوك",
        Najran: "نجران",
        Sakaka: "سكاكا",
        "Al Baha": "الباحة",
        Arar: "عرعر",
        Taif: "الطائف",
        "Hafar Al-Batin": "حفر الباطن",
        "Al-Ahsa": "الأحساء",
        Diriyah: "الدرعية",
        "Al-Ula": "العلا",
        "Al-Kharj": "الخرج",
        Yanbu: "ينبع",
        Qatif: "القطيف",
        Unaizah: "عنيزة",
        "Khamis Mushait": "خميس مشيط",
        "Al Majmaah": "المجمعة",
        Zulfi: "الزلفي",
        "Wadi Ad-Dawasir": "وادي الدواسر",
        Dawadmi: "الدوادمي",
        Shaqra: "شقراء",
        Afif: "عفيف",
        "Al-Quway'iyah": "القويعية",
        Rabigh: "رابغ",
        Jubail: "الجبيل",
        "Al-Khafji": "الخفجي",
        Buqayq: "بقيق",
        "Al-Rass": "الرس",
        "Al-Bukayriyah": "البكيرية",
        "Al-Muznib": "المذنب",
        Bisha: "بيشة",
        "South Dhahran": "ظهران الجنوب",
        Namas: "النماص",
        "Muhayil Asir": "محايل عسير",
        Baljurashi: "بلجرشي",
        Tayma: "تيماء",
        Sabya: "صبياء",
        Fifa: "فيفا",
        "Al-Qurayyat": "القريات",
      };
      return translations[location] || location;
    }
    return location;
  };

  return {
    getTranslatedLocation,
  };
}
