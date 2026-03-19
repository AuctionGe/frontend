export type Locale = "en" | "ka" | "ru";

export const translations = {
  // Navigation
  "nav.lots": { en: "Lots", ka: "ლოტები", ru: "Лоты" },
  "nav.map": { en: "Map", ka: "რუკა", ru: "Карта" },
  "nav.live": { en: "Live", ka: "პირდაპირ", ru: "Live" },
  "nav.settings": { en: "Settings", ka: "პარამეტრები", ru: "Настройки" },
  "nav.profile": { en: "Profile", ka: "პროფილი", ru: "Профиль" },

  // Home
  "home.title": { en: "AuctionGe", ka: "AuctionGe", ru: "AuctionGe" },
  "home.subtitle": { en: "Real estate auctions in Georgia", ka: "უძრავი ქონების აუქციონები საქართველოში", ru: "Аукционы недвижимости в Грузии" },
  "home.total_lots": { en: "Total lots", ka: "სულ ლოტი", ru: "Всего лотов" },
  "home.active_now": { en: "Active now", ka: "აქტიური", ru: "Активных" },
  "home.sources_live": { en: "Sources live", ka: "წყაროები", ru: "Источников" },
  "home.ending_soon": { en: "Ending Soon", ka: "მალე სრულდება", ru: "Скоро закончатся" },
  "home.no_bids": { en: "No Bids Yet", ka: "ბიდების გარეშე", ru: "Без ставок" },
  "home.opportunity": { en: "Opportunity", ka: "შესაძლებლობა", ru: "Возможность" },
  "home.all_auctions": { en: "All Auctions", ka: "ყველა აუქციონი", ru: "Все аукционы" },
  "home.see_all": { en: "See all →", ka: "ყველა →", ru: "Все →" },
  "home.loading_more": { en: "Loading more...", ka: "იტვირთება...", ru: "Загрузка..." },
  "home.no_lots": { en: "No lots found", ka: "ლოტები ვერ მოიძებნა", ru: "Лоты не найдены" },

  // Search
  "search.placeholder": { en: "Search by name, address, cadastral...", ka: "ძიება სახელით, მისამართით...", ru: "Поиск по названию, адресу, кадастру..." },
  "search.see_all_results": { en: "See all results for", ka: "ყველა შედეგი", ru: "Все результаты по" },

  // Property types
  "type.all": { en: "All", ka: "ყველა", ru: "Все" },
  "type.apartment": { en: "Apartments", ka: "ბინები", ru: "Квартиры" },
  "type.land": { en: "Land", ka: "მიწა", ru: "Земля" },
  "type.commercial": { en: "Commercial", ka: "კომერციული", ru: "Коммерция" },
  "type.house": { en: "Houses", ka: "სახლები", ru: "Дома" },
  "type.hotel": { en: "Hotels", ka: "სასტუმროები", ru: "Гостиницы" },
  "type.garage": { en: "Garage", ka: "ავტოფარეხი", ru: "Гараж" },
  "type.factory": { en: "Factory", ka: "ქარხანა", ru: "Фабрика" },
  "type.restaurant": { en: "Restaurant", ka: "რესტორანი", ru: "Ресторан" },
  "type.other": { en: "Other", ka: "სხვა", ru: "Другое" },

  // Lot detail
  "lot.current_price": { en: "Current Price", ka: "მიმდინარე ფასი", ru: "Текущая цена" },
  "lot.bids": { en: "Bids", ka: "ბიდები", ru: "Ставки" },
  "lot.starting": { en: "Starting", ka: "საწყისი", ru: "Начальная" },
  "lot.bid_step": { en: "Bid Step", ka: "ბიჯი", ru: "Шаг ставки" },
  "lot.buy_now": { en: "Buy Now", ka: "ახლავე ყიდვა", ru: "Купить сейчас" },
  "lot.go_to_auction": { en: "Go to auction →", ka: "აუქციონზე გადასვლა →", ru: "Перейти к аукциону →" },
  "lot.photos": { en: "Photos", ka: "ფოტოები", ru: "Фотографии" },
  "lot.details": { en: "Details", ka: "დეტალები", ru: "Детали" },
  "lot.location": { en: "Location", ka: "მდებარეობა", ru: "Расположение" },
  "lot.open_maps": { en: "Open in Maps", ka: "რუკაზე ნახვა", ru: "Открыть на карте" },
  "lot.copy_address": { en: "Copy Address", ka: "მისამართის კოპირება", ru: "Копировать адрес" },
  "lot.type": { en: "Type", ka: "ტიპი", ru: "Тип" },
  "lot.building_area": { en: "Building Area", ka: "შენობის ფართი", ru: "Площадь здания" },
  "lot.land_area": { en: "Land Area", ka: "მიწის ფართი", ru: "Площадь земли" },
  "lot.rooms": { en: "Rooms", ka: "ოთახები", ru: "Комнаты" },
  "lot.floor": { en: "Floor", ka: "სართული", ru: "Этаж" },
  "lot.cadastral": { en: "Cadastral Code", ka: "საკადასტრო კოდი", ru: "Кадастровый код" },
  "lot.auction_start": { en: "Auction Start", ka: "აუქციონის დაწყება", ru: "Начало аукциона" },
  "lot.auction_end": { en: "Auction End", ka: "აუქციონის დასრულება", ru: "Конец аукциона" },
  "lot.price_on_auction": { en: "Price on auction", ka: "ფასი აუქციონზე", ru: "Цена на аукционе" },

  // Statuses
  "status.active": { en: "Active", ka: "აქტიური", ru: "Активный" },
  "status.finished": { en: "Finished", ka: "დასრულებული", ru: "Завершён" },
  "status.failed": { en: "Failed", ka: "ჩაშლილი", ru: "Не состоялся" },
  "status.sold": { en: "Sold", ka: "გაყიდული", ru: "Продан" },
  "status.no_bids": { en: "No bids", ka: "ბიდი არ არის", ru: "Без ставок" },

  // Live
  "live.title": { en: "Live", ka: "პირდაპირ", ru: "Live" },
  "live.subtitle": { en: "Real-time auction activity", ka: "აუქციონის აქტივობა რეალურ დროში", ru: "Активность аукционов в реальном времени" },
  "live.connected": { en: "Live — real-time updates", ka: "პირდაპირ — რეალურ დროში", ru: "Live — обновления в реальном времени" },
  "live.connecting": { en: "Connecting...", ka: "დაკავშირება...", ru: "Подключение..." },
  "live.events": { en: "events", ka: "მოვლენა", ru: "событий" },

  // Map
  "map.title": { en: "Map", ka: "რუკა", ru: "Карта" },
  "map.lots_with_location": { en: "lots with location", ka: "ლოტი მდებარეობით", ru: "лотов с локацией" },

  // Profile
  "profile.title": { en: "Profile", ka: "პროფილი", ru: "Профиль" },
  "profile.subtitle": { en: "Settings & data sources", ka: "პარამეტრები და მონაცემთა წყაროები", ru: "Настройки и источники данных" },
  "profile.language": { en: "Language", ka: "ენა", ru: "Язык" },
  "profile.data_sources": { en: "Data Sources", ka: "მონაცემთა წყაროები", ru: "Источники данных" },
  "profile.lots": { en: "lots", ka: "ლოტი", ru: "лотов" },
  "profile.synced": { en: "synced", ka: "სინქრონიზებული", ru: "синхр." },

  // Filters & Sort
  "filter.filters": { en: "Filters", ka: "ფილტრები", ru: "Фильтры" },
  "filter.price_range": { en: "Price range", ka: "ფასის დიაპაზონი", ru: "Диапазон цен" },
  "filter.min_price": { en: "Min price", ka: "მინ. ფასი", ru: "Мин. цена" },
  "filter.max_price": { en: "Max price", ka: "მაქს. ფასი", ru: "Макс. цена" },
  "filter.sort_by": { en: "Sort by", ka: "დალაგება", ru: "Сортировка" },
  "filter.source": { en: "Source", ka: "წყარო", ru: "Источник" },
  "filter.apply": { en: "Apply filters", ka: "გამოყენება", ru: "Применить" },
  "filter.reset": { en: "Reset", ka: "გასუფთავება", ru: "Сбросить" },
  "sort.newest": { en: "Newest first", ka: "ახალი პირველი", ru: "Сначала новые" },
  "sort.price_asc": { en: "Price: low to high", ka: "ფასი: დაბლიდან", ru: "Цена: по возрастанию" },
  "sort.price_desc": { en: "Price: high to low", ka: "ფასი: მაღლიდან", ru: "Цена: по убыванию" },
  "sort.bids": { en: "Most bids", ka: "ბიდების მიხედვით", ru: "Больше ставок" },

  // Share
  "share.title": { en: "Share", ka: "გაზიარება", ru: "Поделиться" },
  "share.copied": { en: "Link copied!", ka: "ბმული დაკოპირდა!", ru: "Ссылка скопирована!" },
} as const;

export type TranslationKey = keyof typeof translations;
