$(function () {
  // ---------- Data & helper ----------
  const WISH_KEY = "jelajah_nusantara_wishlist";
  const REVIEW_KEY = "jelajah_nusantara_reviews";
  const NO_STORAGE = "Penyimpanan browser diblokir, perubahan tidak akan tersimpan.";
  const DEST = { id: "labuan-bajo", name: "Labuan Bajo", region: "Flores, Nusa Tenggara Timur" };

  // Teks panjang untuk modal kartu "Daya tarik" (judul, eyebrow & gambar diambil dari kartunya)
  const STORIES = {
    padar: {
      desc: "Susuri anak tangga menuju puncak Pulau Padar sebelum matahari terbit. Dari titik pandang utama, tiga teluk berpasir putih, hitam, dan merah muda berpadu dengan perbukitan savana yang berlapis.",
      meta: "Pulau Padar • Trekking 30–60 menit • Bawa air minum & sepatu trekking",
    },
    komodo: {
      desc: "Amati komodo di habitat alaminya bersama ranger berpengalaman di Pulau Komodo atau Pulau Rinca. Mengikuti jalur resmi menjaga keselamatan pengunjung sekaligus kelestarian satwa purba ini.",
      meta: "Pulau Komodo • Wajib didampingi ranger • Jaga jarak aman minimal 5 meter",
    },
    pink: {
      desc: "Pasir bersemu merah muda yang berasal dari serpihan koral merah berpadu dengan air sebening kaca. Tempat ideal untuk berenang santai dan snorkeling di terumbu karang dangkal.",
      meta: "Pantai Pink • Berenang & snorkeling • Gunakan tabir surya ramah terumbu",
    },
  };

  // Buka/tutup modal: fokus pindah ke tombol tutup, lalu kembali ke tombol pemicunya
  let trigger = null;
  function openModal(id) {
    if (!$(".modal-backdrop.is-open").length) trigger = document.activeElement;
    $(id).addClass("is-open").find(".modal-close").trigger("focus");
  }
  function closeModals() {
    if (!$(".modal-backdrop.is-open").length) return;
    $(".modal-backdrop").removeClass("is-open");
    if (trigger) trigger.focus();
  }

  // Notifikasi melayang, hilang otomatis setelah 2,6 detik
  function toast(msg) {
    const $t = $("#toastMsg").text(msg).addClass("is-visible");
    clearTimeout($t.data("timer"));
    $t.data("timer", setTimeout(() => $t.removeClass("is-visible"), 2600));
  }

  // localStorage: baca selalu aman, tulis mengembalikan false jika diblokir browser
  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- Daftar impian ----------
  const isSaved = (list) => list.some((item) => item.id === DEST.id);

  function saveWishlist(list) {
    const ok = write(WISH_KEY, list);
    syncWishlistUI();
    return ok;
  }

  // Samakan badge angka, warna tombol, dan label simpan di seluruh halaman
  function syncWishlistUI() {
    const list = read(WISH_KEY);
    const saved = isSaved(list);
    $("#wishlistCount").text(list.length).toggleClass("is-empty", !list.length);
    $("#heroSaveBtn, #ctaSaveBtn").toggleClass("is-saved", saved);
    $("#heroSaveBtn .save-label").text(saved ? "Tersimpan" : "Simpan destinasi");
    $("#ctaSaveBtn .save-label").text(saved ? "Tersimpan di daftar impian" : "Simpan ke daftar impian");
  }

  $("#heroSaveBtn, #ctaSaveBtn").on("click", () => {
    const list = read(WISH_KEY);
    const saved = isSaved(list);
    const ok = saveWishlist(saved ? list.filter((item) => item.id !== DEST.id) : [...list, DEST]);
    toast(ok ? `${DEST.name} ${saved ? "dihapus dari" : "disimpan ke"} daftar impian.` : NO_STORAGE);
  });

  function renderWishlist() {
    const list = read(WISH_KEY);
    $("#wishlistModalBody").html(
      list.length
        ? list.map((item) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:var(--bg-sand);border-radius:10px;margin-bottom:10px;">
              <div><strong>${item.name}</strong><div style="font-size:12px;color:var(--text-muted);">${item.region}</div></div>
              <button type="button" class="lightbox-btn js-remove-wishlist" data-id="${item.id}">Hapus</button>
            </div>`).join("")
        : '<p class="modal-body-text">Daftar impianmu masih kosong. Klik tombol <strong>Simpan destinasi</strong> di halaman ini untuk menyimpannya.</p>'
    );
    openModal("#wishlistModal");
  }

  $("#navWishlistBtn").on("click", renderWishlist);
  $(document).on("click", ".js-remove-wishlist", function () {
    if (!saveWishlist(read(WISH_KEY).filter((item) => item.id !== $(this).data("id")))) toast(NO_STORAGE);
    renderWishlist();
  });

  // ---------- Tab subnav aktif saat scroll (daftar section diambil dari tab itu sendiri) ----------
  const $tabs = $(".subnav-link");
  $(window).on("scroll", () => {
    const y = $(window).scrollTop() + 120;
    const $active = $tabs.filter((_, a) => $(a.hash).offset()?.top <= y).last();
    $tabs.removeClass("is-active");
    ($active.length ? $active : $tabs.first()).addClass("is-active");
  });

  // ---------- Modal detail cerita ----------
  $(".story-card").on("click", function () {
    const $card = $(this);
    const story = STORIES[$card.data("story")];
    if (!story) return;
    const title = $card.find(".card-title").text();
    $("#storyModalEyebrow").text($card.find(".card-eyebrow").text());
    $("#storyModalTitle").text(title);
    $("#storyModalImg").attr({ src: $card.find("img").attr("src"), alt: title });
    $("#storyModalDesc").text(story.desc);
    $("#storyModalMeta").text(story.meta);
    openModal("#storyModal");
  });

  // ---------- Perencana perjalanan ----------
  $(".js-open-planner, .day-list li").on("click", (e) => {
    e.preventDefault();
    openModal("#plannerModal");
  });

  $("#plannerForm").on("submit", (e) => {
    e.preventDefault();
    const date = $("#planDate").val() || "Musim kemarau (April–Oktober)";
    $("#plannerResult")
      .addClass("is-visible")
      .html(
        `<strong>Rangkuman Rencana (${$("#planDays").val()})</strong><br>` +
          `Tanggal berangkat: <strong>${date}</strong><br>` +
          `Fokus utama: <strong>${$("#planFocus").val()}</strong><br><br>` +
          "Rekomendasi alur: Hari 1 tiba di LBJ & senja di pelabuhan, Hari 2–3 berlayar ke Padar, Pulau Komodo & Pantai Pink, Hari terakhir santai menikmati kopi Flores sebelum kembali."
      );
  });

  // ---------- Modal info (footer) ----------
  $(".js-open-info").on("click", function () {
    $("#infoModalTitle").text($(this).data("title"));
    $("#infoModalText").text($(this).data("text"));
    openModal("#infoModal");
  });

  // ---------- Tutup modal: tombol X, area gelap, atau Escape ----------
  $(".modal-backdrop").on("click", (e) => {
    if ($(e.target).is(".modal-backdrop, .modal-close")) closeModals();
  });
  $(document).on("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });

  // ---------- Ulasan: 3 ulasan awal ada di HTML, ulasan baru disimpan di localStorage ----------
  const baseRatings = [5, 5, 4];
  const reviews = read(REVIEW_KEY).filter((r) => r && r.name && r.text && r.rating >= 1 && r.rating <= 5);

  function addReview(r) {
    // .text() dipakai agar input pengguna aman dari injeksi HTML (XSS)
    const $card = $(`<article class="review-card">
      <div class="review-card-top"><span class="review-stars"></span><span class="card-meta review-date"></span></div>
      <p class="review-quote"></p>
      <div class="review-author"><strong></strong><span class="card-meta"></span></div>
    </article>`);
    $card.find(".review-stars").text("★".repeat(r.rating) + "☆".repeat(5 - r.rating));
    $card.find(".review-date").text(r.date);
    $card.find(".review-quote").text(`"${r.text}"`);
    $card.find("strong").text(r.name);
    $card.find(".review-author span").text(r.origin);
    $("#reviewGrid").prepend($card);
  }

  function updateSummary() {
    const all = [...baseRatings, ...reviews.map((r) => r.rating)];
    const avg = (all.reduce((a, b) => a + b) / all.length).toFixed(1);
    $("#avgRating").text(avg);
    $(".review-score-box .review-stars").attr("aria-label", `${avg} dari 5 bintang`);
    $("#reviewCountText").text(`Berdasarkan ${all.length} ulasan`);
  }

  $("#openReviewModalBtn").on("click", () => openModal("#reviewModal"));

  $("#reviewForm").on("submit", function (e) {
    e.preventDefault();
    const review = {
      name: $("#revName").val().trim(),
      origin: $("#revOrigin").val().trim(),
      text: $("#revText").val().trim(),
      rating: parseInt($("#revRating").val(), 10) || 5,
      date: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    };
    if (!review.name || !review.origin || !review.text) return;

    reviews.push(review);
    addReview(review);
    updateSummary();
    const ok = write(REVIEW_KEY, reviews);
    this.reset();
    closeModals();
    toast(ok ? "Terima kasih, ulasanmu berhasil ditambahkan!" : NO_STORAGE);
  });

  // ---------- Tampilan awal ----------
  reviews.forEach(addReview);
  updateSummary();
  syncWishlistUI();
});
