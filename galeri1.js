// =====================================================
// GALERI NUSANTARA (jQuery 4.0.0)
// Dibagi menjadi 5 bagian:
//   1. Data
//   2. Statistik (angka otomatis dari data)
//   3. Slider foto unggulan
//   4. Galeri (filter, urutkan, tampilkan lebih banyak)
//   5. Lightbox (perbesar foto)
// Seluruh kode dibungkus $(function () { ... }) agar baru
// berjalan setelah halaman selesai dimuat.
// =====================================================

$(function () {
  // ---------------------------------------------------
  // 1. DATA
  // Untuk menambah foto, cukup tambah satu baris di sini.
  // ---------------------------------------------------

  const slides = [
    {
      img: "raja-ampat.jpg",
      place: "RAJA AMPAT, PAPUA BARAT DAYA",
      title: "Di antara seribu pulau",
      credit: "Lensa Aditya Pratama, Kepulauan Wayag",
    },
    {
      img: "bromo-slide.jpg",
      place: "PROBOLINGGO, JAWA TIMUR",
      title: "Fajar di atas lautan awan",
      credit: "Lensa Rizky Ramadhan, Gunung Bromo",
    },
    {
      img: "sumba-slide.jpg",
      place: "SUMBA TIMUR, NUSA TENGGARA TIMUR",
      title: "Bukit yang bernapas pelan",
      credit: "Lensa Fajar Saputra, Wairinding",
    },
    {
      img: "banda-slide.jpg",
      place: "KEPULAUAN BANDA, MALUKU",
      title: "Sunyi di kedalaman biru",
      credit: "Lensa Nadia Putri, Laut Banda",
    },
  ];

  // "ratio" = tinggi dibanding lebar (supaya kartu punya tinggi berbeda-beda)
  const photos = [
    {
      img: "bromo.jpg",
      cat: "Gunung & hutan",
      title: "Pagi yang pelan di Bromo",
      place: "Jawa Timur",
      by: "Rizky Ramadhan",
      ratio: 0.75,
    },
    {
      img: "bali.jpg",
      cat: "Gunung & hutan",
      title: "Hijau yang tak pernah usai",
      place: "Tegalalang, Bali",
      by: "Made Wirawan",
      ratio: 1.12,
    },
    {
      img: "sumba.jpg",
      cat: "Alam terbuka",
      title: "Menanti senja di tanah Sumba",
      place: "Bukit Wairinding, Sumba",
      by: "Fajar Saputra",
      ratio: 0.72,
    },
    {
      img: "borobudur.jpg",
      cat: "Budaya & warisan",
      title: "Bisik batu, jejak waktu",
      place: "Magelang, Jawa Tengah",
      by: "Dewi Anggraini",
      ratio: 1.0,
    },
    {
      img: "banda.jpg",
      cat: "Laut & pulau",
      title: "Dunia lain di bawah biru",
      place: "Kepulauan Banda, Maluku",
      by: "Nadia Putri",
      ratio: 0.72,
    },
    {
      img: "waerebo.jpg",
      cat: "Budaya & warisan",
      title: "Rumah di atas awan",
      place: "Wae Rebo, Nusa Tenggara Timur",
      by: "Andi Prasetyo",
      ratio: 1.0,
    },
    {
      img: "foto-7.jpg",
      cat: "Laut & pulau",
      title: "Perahu menjemput pagi",
      place: "Labuan Bajo, NTT",
      by: "Sari Dewanti",
      ratio: 0.8,
    },
    {
      img: "foto-8.jpg",
      cat: "Keseharian",
      title: "Pasar sebelum matahari naik",
      place: "Ubud, Bali",
      by: "Made Wirawan",
      ratio: 1.0,
    },
    {
      img: "foto-9.jpg",
      cat: "Gunung & hutan",
      title: "Kawah yang menyimpan fajar",
      place: "Ijen, Jawa Timur",
      by: "Rizky Ramadhan",
      ratio: 0.9,
    },
    {
      img: "foto-10.jpg",
      cat: "Alam terbuka",
      title: "Savana di ujung musim",
      place: "Baluran, Jawa Timur",
      by: "Dewi Anggraini",
      ratio: 0.7,
    },
    {
      img: "foto-11.jpg",
      cat: "Keseharian",
      title: "Nelayan dan jaring pagi",
      place: "Wakatobi, Sulawesi Tenggara",
      by: "Nadia Putri",
      ratio: 1.1,
    },
    {
      img: "foto-12.jpg",
      cat: "Budaya & warisan",
      title: "Tarian di halaman pura",
      place: "Gianyar, Bali",
      by: "Andi Prasetyo",
      ratio: 0.85,
    },
  ];

  const PAGE_SIZE = 6;

  // ---------------------------------------------------
  // Fungsi bantu kecil
  // ---------------------------------------------------

  // Ubah angka 1 menjadi "01"
  function pad2(number) {
    return String(number).padStart(2, "0");
  }

  // Daftar lokasi unik, diurutkan A-Z
  function getUniquePlaces() {
    const places = photos.map((photo) => photo.place);
    return Array.from(new Set(places)).sort();
  }

  // ---------------------------------------------------
  // 2. STATISTIK
  // Angka di hero dan chip dihitung dari data, jadi selalu cocok.
  // ---------------------------------------------------

  function showStats() {
    $("#statPhotos").text(photos.length);
    $("#statPlaces").text(getUniquePlaces().length);
    $("#chipAllCount").text(photos.length);
  }

  // ---------------------------------------------------
  // 3. SLIDER FOTO UNGGULAN
  // ---------------------------------------------------

  const $featuredImg = $("#featuredImg");
  let currentSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    // Rumus ini membuat slide berputar: setelah terakhir kembali ke pertama
    currentSlide = (index + slides.length) % slides.length;
    const slide = slides[currentSlide];

    // Foto dipudarkan dulu, lalu diganti
    $featuredImg.addClass("fade");
    setTimeout(function () {
      $featuredImg
        .css("background-image", 'url("' + slide.img + '")')
        .removeClass("fade");
    }, 250);

    // Teks langsung diganti
    $("#featuredPlace").text(slide.place);
    $("#featuredTitle").text(slide.title);
    $("#featuredCredit").text(slide.credit);
    $("#slideNow").text(pad2(currentSlide + 1));
    $("#slideTotal").text(pad2(slides.length));
  }

  // Slide pindah sendiri tiap 7 detik (kecuali pengguna memilih tanpa animasi)
  function startSlideTimer() {
    clearInterval(slideTimer);

    const noMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (noMotion) return;

    slideTimer = setInterval(function () {
      showSlide(currentSlide + 1);
    }, 7000);
  }

  $("#prevBtn").on("click", function () {
    showSlide(currentSlide - 1);
    startSlideTimer();
  });

  $("#nextBtn").on("click", function () {
    showSlide(currentSlide + 1);
    startSlideTimer();
  });

  // Tombol "Perbesar foto" membuka slide yang sedang tampil di lightbox
  $("#featuredOpen").on("click", function () {
    const slide = slides[currentSlide];
    openLightbox({
      img: slide.img,
      alt: slide.title,
      caption: slide.title + ". " + slide.place + ". " + slide.credit + ".",
      trigger: this,
    });
  });

  // ---------------------------------------------------
  // 4. GALERI
  // ---------------------------------------------------

  const $masonry = $("#masonry");

  // "state" menyimpan pilihan pengguna saat ini
  const state = {
    category: "all",
    place: "all",
    sort: "redaksi",
    shown: PAGE_SIZE,
  };

  // Foto yang sedang tampil di layar (dipakai saat kartu diklik)
  let visiblePhotos = [];

  // Isi pilihan destinasi dari data
  function fillPlaceOptions() {
    $.each(getUniquePlaces(), function (_, place) {
      $("#destSelect").append($("<option>").val(place).text(place));
    });
  }

  // Saring dan urutkan foto sesuai pilihan pengguna
  function getFilteredPhotos() {
    let list = photos.filter(function (photo) {
      const categoryOk =
        state.category === "all" || photo.cat === state.category;
      const placeOk = state.place === "all" || photo.place === state.place;
      return categoryOk && placeOk;
    });

    if (state.sort === "judul") {
      list = list.slice().sort((a, b) => a.title.localeCompare(b.title, "id"));
    }
    if (state.sort === "fotografer") {
      list = list.slice().sort((a, b) => a.by.localeCompare(b.by, "id"));
    }

    return list;
  }

  // HTML untuk satu kartu foto
  function buildCard(photo, index) {
    return `
      <button type="button" class="card" data-index="${index}" aria-label="Perbesar foto: ${photo.title}">
        <div class="card-img" style="aspect-ratio: 1 / ${photo.ratio}">
          <img src="${photo.img}" alt="${photo.title}, ${photo.place}" loading="lazy"
               onerror="this.style.display='none'">
          <span class="expand" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
            </svg>
          </span>
        </div>
        <span class="card-cat">${photo.cat}</span>
        <h3>${photo.title}</h3>
        <div class="card-meta"><span>${photo.place}</span><span>${photo.by}</span></div>
      </button>
    `;
  }

  // Jumlah kolom dibaca dari CSS (variabel --cols)
  function getColumnCount() {
    return parseInt($masonry.css("--cols"), 10) || 3;
  }

  // Gambar ulang seluruh galeri
  function renderGallery() {
    const allMatches = getFilteredPhotos();
    visiblePhotos = allMatches.slice(0, state.shown);

    // Bagi foto ke dalam kolom secara bergiliran: kolom 1, 2, 3, 1, 2, 3, ...
    const columnCount = getColumnCount();
    const columns = Array.from({ length: columnCount }, () => []);

    $.each(visiblePhotos, function (index, photo) {
      columns[index % columnCount].push(buildCard(photo, index));
    });

    $masonry.html(
      columns
        .map((cards) => '<div class="masonry-col">' + cards.join("") + "</div>")
        .join(""),
    );

    // Pesan kosong, info jumlah, dan tombol "lebih banyak"
    const hasResults = allMatches.length > 0;
    const hasMore = visiblePhotos.length < allMatches.length;

    $("#empty").prop("hidden", hasResults);
    $("#moreWrap").prop("hidden", !hasResults);
    $("#moreBtn").prop("disabled", !hasMore);
    $("#moreInfo").text(
      hasResults
        ? "Menampilkan " +
            visiblePhotos.length +
            " dari " +
            allMatches.length +
            " foto"
        : "",
    );
  }

  // Chip kategori
  $("#chips").on("click", ".chip", function () {
    $(".chip").removeClass("active").attr("aria-pressed", "false");
    $(this).addClass("active").attr("aria-pressed", "true");

    state.category = $(this).data("cat");
    state.shown = PAGE_SIZE;
    renderGallery();
  });

  // Pilihan destinasi
  $("#destSelect").on("change", function () {
    state.place = $(this).val();
    state.shown = PAGE_SIZE;
    renderGallery();
  });

  // Pilihan urutan
  $("#sortSelect").on("change", function () {
    state.sort = $(this).val();
    renderGallery();
  });

  // Tombol "Jelajahi lebih banyak foto"
  $("#moreBtn").on("click", function () {
    state.shown += PAGE_SIZE;
    renderGallery();
  });

  // Tombol ubah tampilan grid (3 kolom <-> 4 kolom)
  $("#viewBtn").on("click", function () {
    $masonry.toggleClass("compact");
    renderGallery();
  });

  // Saat ukuran layar berubah dan jumlah kolom ikut berubah, susun ulang
  let lastColumnCount = getColumnCount();

  $(window).on("resize", function () {
    const nowCount = getColumnCount();
    if (nowCount !== lastColumnCount) {
      lastColumnCount = nowCount;
      renderGallery();
    }
  });

  // ---------------------------------------------------
  // 5. LIGHTBOX
  // ---------------------------------------------------

  const $lightbox = $("#lightbox");
  let lastFocusedElement = null; // elemen yang diklik sebelum lightbox terbuka

  function openLightbox(options) {
    lastFocusedElement = options.trigger;

    $("#lightboxImg").attr({ src: options.img, alt: options.alt });
    $("#lightboxCap").text(options.caption);

    $lightbox.prop("hidden", false);
    $("#lightboxClose").trigger("focus");
  }

  function closeLightbox() {
    $lightbox.prop("hidden", true);

    // Kembalikan fokus ke tombol/kartu yang tadi diklik
    if (lastFocusedElement) $(lastFocusedElement).trigger("focus");
  }

  // Klik kartu foto di galeri
  $masonry.on("click", ".card", function () {
    const photo = visiblePhotos[$(this).data("index")];
    openLightbox({
      img: photo.img,
      alt: photo.title + ", " + photo.place,
      caption:
        photo.title + ". " + photo.place + ". Foto oleh " + photo.by + ".",
      trigger: this,
    });
  });

  $("#lightboxClose").on("click", closeLightbox);

  // Klik area gelap di luar foto untuk menutup
  $lightbox.on("click", function (event) {
    if (event.target === this) closeLightbox();
  });

  // Tombol Esc untuk menutup
  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && !$lightbox.prop("hidden")) closeLightbox();
  });

  // ---------------------------------------------------
  // MULAI
  // ---------------------------------------------------

  showStats();
  fillPlaceOptions();
  showSlide(0);
  startSlideTimer();
  renderGallery();
});
