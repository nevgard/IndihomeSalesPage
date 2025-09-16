// src/App.jsx
import React, { useMemo, useState, useEffect } from "react";

const MOCK_LOCATIONS = [
  { id: "jakarta", label: "Jakarta" },
  { id: "bandung", label: "Bandung" },
  { id: "surabaya", label: "Surabaya" },
  { id: "medan", label: "Medan" },
  { id: "yogyakarta", label: "Yogyakarta" },
];

const MOCK_PACKAGES = [
  {
    id: 1,
    name: "Basic Internet",
    type: "internet",
    speed: 10,
    price: 200000,
    popular: false,
    desc: "Paket internet dasar untuk kebutuhan browsing ringan",
    locations: ["jakarta", "bandung", "surabaya"],
  },
  {
    id: 2,
    name: "Premium Internet",
    type: "internet",
    speed: 50,
    price: 400000,
    popular: true,
    desc: "Paket internet premium untuk streaming dan gaming",
    locations: ["jakarta", "bandung", "surabaya", "medan"],
  },
  {
    id: 3,
    name: "Internet + Phone Basic",
    type: "internet+phone",
    speed: 25,
    price: 350000,
    popular: false,
    desc: "Internet dengan telepon rumah unlimited",
    locations: ["jakarta", "bandung"],
  },
  {
    id: 4,
    name: "Internet + TV Entertainment",
    type: "internet+tv",
    speed: 30,
    price: 500000,
    popular: true,
    desc: "Internet dengan 100+ channel TV premium",
    locations: ["jakarta", "surabaya", "medan"],
  },
  {
    id: 5,
    name: "Complete Package",
    type: "lengkap",
    speed: 100,
    price: 750000,
    popular: false,
    desc: "Paket lengkap internet, TV, dan telepon",
    locations: ["jakarta", "bandung", "surabaya"],
  },
  {
    id: 6,
    name: "Ultra Internet",
    type: "internet",
    speed: 100,
    price: 600000,
    popular: false,
    desc: "Kecepatan maksimal untuk professional",
    locations: ["jakarta", "surabaya"],
  },
];

const PACKAGE_TYPES = [
  {
    id: "all",
    label: "Populer",
    icon: "🔋",
    imgsrc:
      "https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-buy-package.png",
  },
  {
    id: "internet",
    label: "Internet",
    icon: "🌐",
    imgsrc:
      "https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-buy-package.png",
  },
  {
    id: "internet+phone",
    label: "Internet + Phone",
    icon: "📞",
    imgsrc:
      "https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-call-sms.png",
  },
  {
    id: "internet+tv",
    label: "Internet + TV",
    icon: "📺",
    imgsrc:
      "https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-film.png",
  },
  {
    id: "lengkap",
    label: "Lengkap",
    icon: "⭐",
    imgsrc:
      "https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-buy-package.png",
  },
];

const currency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// SEO Component
const SEOHead = ({ location }) => {
  useEffect(() => {
    const locLabel = MOCK_LOCATIONS.find((l) => l.id === location)?.label || "";

    // Update document title
    document.title = `Paket IndiHome ${locLabel} - Internet Cepat & Stabil | Promo Terbaru 2024`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      `Paket IndiHome terbaik di ${locLabel}. Internet fiber optik hingga 100 Mbps, TV premium, telepon unlimited. Promo pemasangan gratis! Hubungi sekarang.`
    );

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      "content",
      `indihome ${locLabel.toLowerCase()}, paket internet ${locLabel.toLowerCase()}, indihome murah, internet cepat, fiber optik, promo indihome`
    );

    // Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute(
      "content",
      `Paket IndiHome ${locLabel} - Internet Cepat & Stabil`
    );

    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (!ogDescription) {
      ogDescription = document.createElement("meta");
      ogDescription.setAttribute("property", "og:description");
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute(
      "content",
      `Dapatkan paket IndiHome terbaik di ${locLabel}. Internet fiber optik hingga 100 Mbps dengan harga terjangkau.`
    );

    // Structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `IndiHome ${locLabel}`,
      description: `Penyedia layanan internet IndiHome di ${locLabel}`,
      url: window.location.href,
      telephone: "+62-851-5841-8944",
      address: {
        "@type": "PostalAddress",
        addressLocality: locLabel,
        addressCountry: "ID",
      },
      offers: MOCK_PACKAGES.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: pkg.desc,
        price: pkg.price,
        priceCurrency: "IDR",
      })),
    };

    let scriptTag = document.querySelector("#structured-data");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "structured-data";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);
  }, [location]);

  return null;
};

// Intersection Observer Hook for animations
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, options]);

  return [setRef, isIntersecting];
};

// Animated Section Component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [location, setLocation] = useState("jakarta");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRanges, setPriceRanges] = useState([]);
  const [speedRanges, setSpeedRanges] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Price ranges
  const PRICE_RANGES = [
    { id: "0-300000", label: "Rp 0 - Rp 300.000", min: 0, max: 300000 },
    {
      id: "300000-500000",
      label: "Rp 300.000 - Rp 500.000",
      min: 300000,
      max: 500000,
    },
    {
      id: "500000-700000",
      label: "Rp 500.000 - Rp 700.000",
      min: 500000,
      max: 700000,
    },
    { id: "700000+", label: "Rp 700.000+", min: 700000, max: Infinity },
  ];

  // Speed ranges
  const SPEED_RANGES = [
    { id: "0-25", label: "0 - 25 Mbps", min: 0, max: 25 },
    { id: "25-50", label: "25 - 50 Mbps", min: 25, max: 50 },
    { id: "50-100", label: "50 - 100 Mbps", min: 50, max: 100 },
    { id: "100+", label: "100+ Mbps", min: 100, max: Infinity },
  ];

  const handlePriceRangeChange = (rangeId) => {
    setPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleSpeedRangeChange = (rangeId) => {
    setSpeedRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((id) => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const filtered = useMemo(() => {
    let result = MOCK_PACKAGES.filter((pkg) =>
      pkg.locations.includes(location)
    );

    // Filter by type
    if (selectedType !== "all") {
      result = result.filter((pkg) => pkg.type === selectedType);
    }

    // Filter by price ranges
    if (priceRanges.length > 0) {
      result = result.filter((pkg) => {
        return priceRanges.some((rangeId) => {
          const range = PRICE_RANGES.find((r) => r.id === rangeId);
          return pkg.price >= range.min && pkg.price <= range.max;
        });
      });
    }

    // Filter by speed ranges
    if (speedRanges.length > 0) {
      result = result.filter((pkg) => {
        return speedRanges.some((rangeId) => {
          const range = SPEED_RANGES.find((r) => r.id === rangeId);
          return pkg.speed >= range.min && pkg.speed <= range.max;
        });
      });
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "speed_desc") {
      result.sort((a, b) => b.speed - a.speed);
    }

    return result;
  }, [location, selectedType, priceRanges, speedRanges, sortBy]);

  const openWA = (pkg) => {
    const message = `Halo, saya tertarik dengan paket ${pkg.name} (${
      pkg.speed
    } Mbps) seharga ${currency(pkg.price)} untuk lokasi ${
      MOCK_LOCATIONS.find((l) => l.id === location)?.label
    }`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/+6285158418944?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <>
      <SEOHead location={location} />
      <div className="font-sans h-screen snap-y snap-mandatory overflow-y-scroll bg-white">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2">
              <img
                src="https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-buy-package.png"
                alt="IndiHome Logo"
                className="w-8 sm:w-10 transition-transform hover:scale-110"
                loading="lazy"
              />
              <h1 className="text-lg sm:text-xl font-bold text-red-700">
                IndiHome
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a
                href="#hero"
                className="hover:text-red-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Beranda
              </a>
              <a
                href="#promo"
                className="hover:text-red-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Promo
              </a>
              <a
                href="#pricelist"
                className="hover:text-red-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Harga
              </a>
              <a
                href="#info"
                className="hover:text-red-600 transition-colors duration-300 hover:scale-105 transform"
              >
                Informasi
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div
                className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></div>
              <div
                className={`w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav
            className={`md:hidden bg-white border-t border-gray-100 px-4 pb-4 transition-all duration-300 ${
              isMenuOpen
                ? "max-h-48 opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="space-y-2 pt-2">
              <a
                href="#hero"
                className="block py-2 text-sm font-medium hover:text-red-600 transition-colors"
              >
                Beranda
              </a>
              <a
                href="#promo"
                className="block py-2 text-sm font-medium hover:text-red-600 transition-colors"
              >
                Promo
              </a>
              <a
                href="#pricelist"
                className="block py-2 text-sm font-medium hover:text-red-600 transition-colors"
              >
                Harga
              </a>
              <a
                href="#info"
                className="block py-2 text-sm font-medium hover:text-red-600 transition-colors"
              >
                Informasi
              </a>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section
          id="hero"
          className="h-screen scroll-mt-20 relative bg-gradient-to-br from-red-50 via-white to-red-100 py-12 sm:py-20 snap-center overflow-hidden"
        >
          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/30 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-10 relative z-10">
            <AnimatedSection className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-red-700 leading-tight mb-4">
                Internet Cepat & Stabil
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2">
                  Untuk Keluarga Anda
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl">
                Nikmati pengalaman online tanpa batas dengan paket internet
                IndiHome. Pilih sesuai kebutuhan Anda dan dapatkan promo
                menarik.
              </p>
              <a
                href="#pricelist"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Lihat Paket Sekarang
              </a>
            </AnimatedSection>

            <AnimatedSection className="flex-1" delay={200}>
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc"
                alt="Keluarga bahagia menggunakan internet IndiHome"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:max-w-full object-cover transform hover:scale-105 transition-transform duration-500"
                style={{ height: "300px", minHeight: "300px" }}
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="info"
          className="h-screen place-content-center text-white bg-gradient-to-br from-red-600 to-red-700 py-16 scroll-mt-20 snap-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full animate-spin-slow delay-500"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <AnimatedSection>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Mengapa Pilih IndiHome?
              </h3>
              <p className="text-base sm:text-lg max-w-3xl mx-auto mb-10">
                IndiHome menawarkan jaringan luas, stabil, dan layanan customer
                service 24/7. Paket lengkap untuk keluarga Anda, dengan pilihan
                Internet, TV, dan Telepon.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  img: "https://wec.telkomsel.com/public/2025-04/icon-internet-cepat.png",
                  title: "Internet Cepat hingga 100Mbps",
                  desc: "IndiHome menyediakan berbagai pilihan kecepatan internet, mulai dari 30 Mbps hingga 100 Mbps.",
                  delay: 0,
                },
                {
                  img: "https://wec.telkomsel.com/public/inline-images/video.png?VersionId=OEzJwHAvKIMccKo5C35s5hjE99_xruDV",
                  title: "Layanan TV dengan Ratusan Channel",
                  desc: "Semakin seru dengan layanan Internet + TV IndiHome untuk menonton ratusan saluran TV lokal dan internasional, serta on-demand film dan series.",
                  delay: 200,
                },
                {
                  img: "https://wec.telkomsel.com/public/inline-images/reward_quota.png?VersionId=xFRoHbcJPfierjZJm81o0SlgpdHQTQrd",
                  title: "Paket Bundling",
                  desc: "Kamu bisa memilih satu paket yang menggabungkan internet, telepon, hingga TV.",
                  delay: 400,
                },
              ].map((benefit, i) => (
                <AnimatedSection key={i} delay={benefit.delay}>
                  <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/95 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <img
                      src={benefit.img}
                      alt={benefit.title}
                      className="w-16 h-16 mb-4 transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                    />
                    <h4 className="font-semibold text-lg text-black mb-3">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Promo */}
        <section
          id="promo"
          className="h-screen place-content-center max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 snap-center"
        >
          <AnimatedSection>
            <h3 className="text-2xl sm:text-3xl font-bold text-red-700 text-center mb-10">
              Promo Spesial Bulan Ini
            </h3>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group p-6 rounded-2xl shadow-lg bg-gradient-to-br from-red-100 to-red-200 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="overflow-hidden rounded-xl mb-4">
                    <img
                      src={`https://source.unsplash.com/400x250/?promo,discount,${i}`}
                      alt={`Promo ${i} - Penawaran spesial IndiHome`}
                      className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-semibold text-lg mb-3">
                    Promo Spesial {i}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Nikmati potongan harga dan bonus menarik untuk pemasangan
                    baru.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm font-medium">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Pricelist */}
        <section
          id="pricelist"
          className="min-h-screen w-full scroll-mt-20 snap-start bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Sidebar */}
              <AnimatedSection delay={200}>
                <aside className="w-full xl:w-80 space-y-6">
                  {/* Price Filter */}
                  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    {/* Location Filter */}
                    <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-2 items-start sm:items-center gap-4 rounded-3xl border-1 border-transparent hover:border-red-700 hover:shadow-md hover:cursor-pointer transition-all duration-300">
                      <img
                        src="https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-ic-location.png"
                        alt="Lokasi"
                        className="w-8 h-8"
                        loading="lazy"
                      />
                      <div className="flex-1 w-full">
                        <h3 className=" text-sm font-semibold text-gray-800 mb-2">
                          Pilih Paket Sesuai Lokasi
                        </h3>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full sm:w-40 text-xs p-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 bg-white"
                        >
                          {MOCK_LOCATIONS.map((l) => (
                            <option key={l.id} value={l.id} className="text-sm">
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <h4 className="font-semibold text-base text-gray-800 mb-2 flex items-center gap-2">
                      Range Harga
                    </h4>
                    <div className="space-y-1">
                      {PRICE_RANGES.map((range) => (
                        <label
                          key={range.id}
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={priceRanges.includes(range.id)}
                            onChange={() => handlePriceRangeChange(range.id)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-xs text-gray-700">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Speed Filter */}
                    <h3 className="pt-6 font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      Kecepatan
                    </h3>
                    <div className="space-y-1">
                      {SPEED_RANGES.map((range) => (
                        <label
                          key={range.id}
                          className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={speedRanges.includes(range.id)}
                            onChange={() => handleSpeedRangeChange(range.id)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-xs text-gray-700">
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </aside>
              </AnimatedSection>

              {/* Main Content */}
              <main className="flex-1 space-y-6">
                <AnimatedSection delay={100}>
                  <AnimatedSection>
                    <div className="text-center mb-8">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                        Pilihan Paket Sesuai Kebutuhan
                      </h1>
                    </div>
                  </AnimatedSection>
                  {/* Package Type Filter */}
                  <div className="mt-3  ">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {PACKAGE_TYPES.map((type, index) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`relative p-3 sm:p-4 rounded-2xl text-left border transition-all duration-300 overflow-hidden hover:cursor-pointer transform hover:scale-105 group ${
                            selectedType === type.id
                              ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg"
                              : "hover:border-red-500 text-gray-700 bg-white border-gray-200 hover:shadow-md shadow-sm"
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="text-xs sm:text-sm font-bold mb-3 px-1 relative z-10">
                            {type.label}
                          </div>
                          <img
                            src={type.imgsrc}
                            alt={type.label}
                            className="absolute w-12 h-12 sm:w-14 sm:h-14 object-cover top-4 -right-2 sm:-right-3 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Filter */}
                  <div className="mt-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Paket Tersedia ({filtered.length})
                      </h3>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full text-sm sm:w-auto p-3 rounded-2xl border-2 bg-white border-gray-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300"
                      >
                        <option value="relevance">Paling Sesuai</option>
                        <option value="price_asc">Paling Murah</option>
                        <option value="speed_desc">Kecepatan Tertinggi</option>
                      </select>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Package List */}
                <div className="space-y-4">
                  {filtered.length === 0 && (
                    <AnimatedSection>
                      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="text-gray-400 text-6xl mb-4 animate-bounce">
                          📦
                        </div>
                        <div className="text-gray-600 text-lg font-medium">
                          Tidak ada paket yang cocok dengan filter Anda
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          Coba ubah filter lokasi atau kategori paket
                        </p>
                      </div>
                    </AnimatedSection>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {filtered.map((pkg, index) => (
                      <AnimatedSection key={pkg.id} delay={index * 50}>
                        <article className="bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 group">
                          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            {/* Bagian Kiri: Nama, Speed, Status Popular */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col gap-2">
                                {/* Nama Paket (Reguler) */}
                                <h4 className="text-sm font-normal text-gray-600">
                                  {pkg.name}
                                </h4>

                                {/* Speed (Bold) */}
                                <div className="text-base font-bold text-gray-800">
                                  {pkg.speed} Mbps
                                </div>

                                {/* Status Popular */}
                                {pkg.popular && (
                                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-xs font-bold rounded-full animate-pulse w-fit">
                                    ⭐ TERPOPULER
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Bagian Kanan: Harga dan Tombol WA */}
                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                              {/* Harga */}
                              <div className="text-right">
                                <div className="text-base font-bold text-red-600">
                                  {currency(pkg.price)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  per bulan
                                </div>
                              </div>

                              {/* Tombol WA */}
                              <button
                                onClick={() => openWA(pkg)}
                                className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs whitespace-nowrap w-full md:w-auto text-center"
                              >
                                💬 Hubungi via WA
                              </button>
                            </div>
                          </div>
                        </article>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* Coverage Map Section */}
        <section className="bg-gradient-to-br from-red-600 to-red-800 snap-center place-content-center min-h-screen scroll-mt-20 relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          </div>

          <div className="flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative z-10">
            <AnimatedSection>
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4">
                IndiHome tersedia hingga pelosok negeri
              </h1>
              <p className="text-white/90 text-center text-sm sm:text-base max-w-2xl mb-8">
                Periksa ketersediaan jaringan internet broadband di tempat
                tinggal Anda dengan mudah. Jangkauan luas di seluruh Indonesia.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="relative group">
                <img
                  src="https://pasangindihome.info/wp-content/uploads/2025/01/indihome-maps-banner.png"
                  alt="Peta jangkauan IndiHome di Indonesia"
                  className="mt-4 max-w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl group-hover:scale-105 group-hover:from-black/10 transition-all duration-500"></div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Testimonial Section */}
        <section
          id="testimonials"
          className="snap-start place-content-center min-h-screen py-16"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <AnimatedSection>
              <h3 className="text-2xl sm:text-3xl font-bold text-red-700 mb-4">
                Apa Kata Pelanggan?
              </h3>
              <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
                Ribuan keluarga telah merasakan kualitas layanan IndiHome
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  name: "Budi Santoso",
                  text: "Internetnya cepat dan stabil, cocok untuk kerja WFH. Zoom meeting lancar jaya!",
                  img: "https://randomuser.me/api/portraits/men/32.jpg",
                  rating: 5,
                  location: "Jakarta",
                },
                {
                  name: "Siti Nurhaliza",
                  text: "Pemasangan cepat, CS ramah banget. Recommended untuk yang butuh internet keluarga!",
                  img: "https://randomuser.me/api/portraits/women/44.jpg",
                  rating: 5,
                  location: "Bandung",
                },
                {
                  name: "Andi Wijaya",
                  text: "Harga sesuai kantong, kualitas mantap. Nonton Netflix 4K lancar tanpa buffering.",
                  img: "https://randomuser.me/api/portraits/men/53.jpg",
                  rating: 4,
                  location: "Surabaya",
                },
              ].map((testimonial, i) => (
                <AnimatedSection key={i} delay={i * 200}>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg flex flex-col items-center text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl group">
                    <div className="relative mb-4">
                      <img
                        src={testimonial.img}
                        alt={`Foto ${testimonial.name}`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-white/90 italic mb-4 text-center leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-white/70">
                      {testimonial.location}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="w-full bg-gray-50 snap-start min-h-screen place-content-center"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <AnimatedSection>
              <h3 className="text-2xl sm:text-3xl font-bold text-red-700 text-center mb-4">
                Pertanyaan Umum
              </h3>
              <p className="text-gray-600 text-center mb-10">
                Temukan jawaban untuk pertanyaan yang sering ditanyakan
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {[
                {
                  question: "Berapa biaya instalasi IndiHome?",
                  answer:
                    "Biaya instalasi biasanya Rp 150.000, namun sering ada promo gratis biaya pemasangan untuk pelanggan baru. Hubungi kami untuk info promo terkini!",
                },
                {
                  question: "Kapan pemasangan IndiHome dilakukan?",
                  answer:
                    "Biasanya 2-3 hari kerja setelah pendaftaran dan konfirmasi lokasi. Tim teknisi akan menghubungi Anda untuk menentukan jadwal yang sesuai.",
                },
                {
                  question: "Apakah ada biaya tambahan selain harga paket?",
                  answer:
                    "Tidak ada biaya tersembunyi! Harga paket sudah termasuk modem WiFi, kabel, dan instalasi. Yang perlu dibayar hanya biaya langganan bulanan dan deposit (jika ada).",
                },
                {
                  question: "Bagaimana jika internet bermasalah?",
                  answer:
                    "Kami menyediakan layanan customer service 24/7 dan teknisi siap datang jika diperlukan. Garansi layanan 99,9% uptime untuk kestabilan koneksi.",
                },
                {
                  question: "Apakah bisa upgrade/downgrade paket?",
                  answer:
                    "Tentu saja! Anda bisa mengubah paket sesuai kebutuhan kapan saja. Perubahan akan berlaku pada periode billing berikutnya.",
                },
              ].map((faq, i) => (
                <AnimatedSection key={i} delay={i * 100}>
                  <details className="p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                    <summary className="font-semibold cursor-pointer flex items-center justify-between text-sm sm:text-base text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                      <span>{faq.question}</span>
                      <span className="ml-4 transform group-open:rotate-180 transition-transform duration-300 text-red-600">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed pl-4 border-l-2 border-red-100">
                      {faq.answer}
                    </p>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Closing Section */}
        <section
          id="closing-cta"
          className="bg-gradient-to-br from-gray-50 to-white py-20 text-center text-red-700 snap-start min-h-screen place-content-center relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-600 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-600 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-600 rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
                Siap Pasang IndiHome di Rumah Anda?
              </h3>
              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Dapatkan promo dan penawaran terbaik sekarang juga. Tim customer
                service kami siap membantu 24/7!
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a
                  href="https://wa.me/6285158418944?text=Halo%20saya%20ingin%20pasang%20IndiHome"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-xl">📱</span>
                  Hubungi via WhatsApp
                </a>
                <a
                  href="tel:+6285158418944"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-xl">📞</span>
                  Telepon Sekarang
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✅</span>
                  Gratis Konsultasi
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✅</span>
                  Promo Menarik
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✅</span>
                  Layanan 24/7
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-red-700 to-red-800 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedSection>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src="https://www.telkomsel.com/landingpage/api/web/get-img?imgid=new-buy-package.png"
                      alt="IndiHome"
                      className="w-8 h-8"
                      loading="lazy"
                    />
                    <h4 className="font-bold text-xl">IndiHome</h4>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    IndiHome menyediakan berbagai pilihan kecepatan internet
                    fiber optik terbaik, mulai dari 30 Mbps hingga 100 Mbps
                    untuk kebutuhan keluarga Indonesia.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <div>
                  <h4 className="font-bold text-lg mb-4">Navigasi</h4>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a
                        href="#hero"
                        className="hover:text-red-200 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span>🏠</span> Beranda
                      </a>
                    </li>
                    <li>
                      <a
                        href="#promo"
                        className="hover:text-red-200 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span>🎉</span> Promo
                      </a>
                    </li>
                    <li>
                      <a
                        href="#pricelist"
                        className="hover:text-red-200 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span>💰</span> Harga
                      </a>
                    </li>
                    <li>
                      <a
                        href="#info"
                        className="hover:text-red-200 transition-colors duration-300 flex items-center gap-2"
                      >
                        <span>ℹ️</span> Informasi
                      </a>
                    </li>
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <div>
                  <h4 className="font-bold text-lg mb-4">Layanan</h4>
                  <ul className="space-y-3 text-sm text-white/90">
                    <li>• Internet Fiber Optik</li>
                    <li>• Paket Internet + TV</li>
                    <li>• Paket Internet + Phone</li>
                    <li>• Paket Lengkap (Triple Play)</li>
                    <li>• Customer Service 24/7</li>
                  </ul>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div>
                  <h4 className="font-bold text-lg mb-4">Kontak</h4>
                  <div className="space-y-3 text-sm">
                    <p className="text-white/90">
                      Hubungi kami untuk konsultasi gratis dan dapatkan
                      penawaran terbaik!
                    </p>
                    <a
                      href="https://wa.me/6285158418944"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span>📱</span> WhatsApp
                    </a>
                    <div className="text-xs text-white/70 mt-2">
                      Respon cepat dalam 5 menit
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="border-t border-white/20 mt-8 pt-8 text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/80">
                <p>
                  © {new Date().getFullYear()} IndiHome. Semua hak dilindungi.
                </p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Kebijakan Privasi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50">
          <a
            className="group w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-bounce hover:animate-none"
            href={`https://wa.me/6285158418944?text=Halo%20saya%20ingin%20konsultasi%20paket%20IndiHome`}
            target="_blank"
            rel="noreferrer"
            aria-label="Hubungi via WhatsApp"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">
              💬
            </span>
          </a>
          <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat dengan kami!
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }

          .group:hover .group-hover\\:animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          details[open] summary {
            margin-bottom: 1rem;
          }

          html {
            scroll-behavior: smooth;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          ::-webkit-scrollbar-thumb {
            background: #dc2626;
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #b91c1c;
          }
        `}</style>
      </div>
    </>
  );
}
