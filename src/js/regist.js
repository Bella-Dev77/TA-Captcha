$(document).ready(function () {
  var puzzleSolved = false; // Variabel untuk menyimpan status puzzle
  var startTime; // Waktu mulai menyelesaikan CAPTCHA
  var captchaCompleted = false; // Variabel untuk melacak apakah CAPTCHA telah diselesaikan
  var removedPieces = []; // Array untuk menyimpan info bagian yang dihilangkan

  // Fungsi untuk memuat ulang halaman
  function reloadPage() {
    location.reload();
  }

  // Fungsi untuk secara acak memilih 2 bagian untuk dihilangkan
  function removeRandomPieces() {
    var drops = ["drop1", "drop2", "drop3", "drop4", "drop5", "drop6"];
    while (removedPieces.length < 2) {
      var randomIndex = Math.floor(Math.random() * drops.length);
      var dropId = drops[randomIndex];
      var drop = $("#" + dropId);
      if (drop.children().length > 0) {
        var imgSrc = drop.children("img").attr("src");
        removedPieces.push({
          id: dropId,
          src: imgSrc,
        });
        drop.empty(); // Hapus bagian dari drop zone
      }
      drops.splice(randomIndex, 1); // Hapus drop yang sudah dipilih dari daftar
    }
    // Perbarui src dari drag1 dan drag2 sesuai dengan bagian yang dihilangkan
    $("#drag1").html(
      '<img src="' + removedPieces[0].src + '" alt="Puzzle Piece" style="height: 98px; width: 130px">'
    );
    $("#drag2").html(
      '<img src="' + removedPieces[1].src + '" alt="Puzzle Piece" style="height: 98px; width: 130px">'
    );
  }

  // Fungsi untuk memeriksa apakah puzzle sudah selesai
  function checkPuzzle() {
    var drop1 = $("#drop1");
    var drop2 = $("#drop2");
    var drop3 = $("#drop3");
    var drop4 = $("#drop4");
    var drop5 = $("#drop5");
    var drop6 = $("#drop6");

    // Memeriksa apakah semua kotak drop memiliki bagian puzzle di dalamnya
    if (
      drop1.children().length > 0 &&
      drop2.children().length > 0 &&
      drop3.children().length > 0 &&
      drop4.children().length > 0 &&
      drop5.children().length > 0 &&
      drop6.children().length > 0
    ) {
      // Puzzle selesai
      puzzleSolved = true; // Set status puzzle selesai menjadi true
      $(".box").each(function () {
        if ($(this).children().length === 0) {
          $(this).hide(); // Menyembunyikan kotak drop yang tidak memiliki bagian puzzle di dalamnya
        }
      });

      // Menghitung waktu yang dibutuhkan untuk menyelesaikan CAPTCHA
      var endTime = new Date().getTime();
      var elapsedTime = endTime - startTime;

      // Menampilkan pesan kesalahan jika waktu yang dibutuhkan terlalu singkat (misalnya, kurang dari 3 detik)
      if (elapsedTime < 2000) {
        // Menampilkan pesan kesalahan dan memuat ulang captcha setelah menutup pesan
        Swal.fire({
          icon: "error",
          title: "Terlalu cepat!",
          text: "Tolong selesaikan CAPTCHA dengan lebih lambat.",
        }).then(reloadPage); // Muat ulang halaman setelah menutup pesan
      } else {
        // Menampilkan pesan sukses jika CAPTCHA selesai dengan benar
        Swal.fire({
          icon: "success",
          title: "Puzzle solved!",
          text: "Silahkan Submit!",
        });

        captchaCompleted = true; // Set variabel captchaCompleted menjadi true
      }
    }
  }

  // Inisialisasi Interact.js untuk draggable
  interact('.box').draggable({
    inertia: true,
    autoScroll: true,
    onstart: function (event) {
      startTime = new Date().getTime();
    },
    onmove: function (event) {
      var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },
    onend: function (event) {
      if (puzzleSolved) {
        event.target.draggable = false;
      }
    }
  });

  // Inisialisasi Interact.js untuk droppable
  interact('.box').dropzone({
    accept: '.box',
    overlap: 0.75,
    ondrop: function (event) {
      var dropZone = $(event.target);
      var droppedItem = $(event.relatedTarget);

      if (dropZone.children().length > 0 || !isCorrectDrop(dropZone, droppedItem)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Drop Location',
          text: 'Please drop the item in an empty drop zone or in the correct drop zone.'
        });
        droppedItem.css('transform', 'translate(0, 0)');
        droppedItem.attr('data-x', 0);
        droppedItem.attr('data-y', 0);
      } else {
        var puzzlePiece = droppedItem.find('img').attr('src');
        dropZone.html('<img src="' + puzzlePiece + '" alt="Puzzle Piece" style="height: 98px; width: 130px">');
        checkPuzzle();
      }
    }
  });

  // Fungsi untuk memeriksa apakah elemen yang di-drop cocok dengan kotak drop yang sesuai
  function isCorrectDrop(dropZone, droppedItem) {
    var dropId = dropZone.attr('id');
    var droppedSrc = droppedItem.find('img').attr('src');

    for (var i = 0; i < removedPieces.length; i++) {
      if (dropId === removedPieces[i].id && droppedSrc === removedPieces[i].src) {
        return true;
      }
    }
    return false;
  }

  removeRandomPieces();

  $("#registration-form").on("submit", function (event) {
    if (!captchaCompleted) {
      event.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'CAPTCHA not completed',
        text: 'Please solve the CAPTCHA puzzle before submitting the form.'
      });
    }
  });
});
