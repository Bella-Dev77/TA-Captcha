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
      '<img src="' +
        removedPieces[0].src +
        '" alt="Puzzle Piece" style="height: 98px; width: 130px">'
    );
    $("#drag2").html(
      '<img src="' +
        removedPieces[1].src +
        '" alt="Puzzle Piece" style="height: 98px; width: 130px">'
    );
  }

  // Fungsi untuk menangani pergerakan kotak drag
  $(".box").draggable({
    revert: "invalid", // Mengembalikan kotak drag ke posisi awal jika tidak diletakkan di kotak drop yang valid
    start: function (event, ui) {
      // Memulai menghitung waktu saat pengguna mulai menyelesaikan CAPTCHA
      startTime = new Date().getTime();
    },
    stop: function (event, ui) {
      // Memeriksa apakah puzzle sudah selesai, jika ya, maka hentikan fungsi draggable pada semua elemen dengan class "box"
      if (puzzleSolved) {
        $(this).draggable("option", "disabled", true);
      }
    },
  });

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
          showConfirmButton: false, // Menghilangkan tombol "OK"
          onClose: function () {
            reloadPage(); // Memuat ulang halaman setelah menutup pesan
          },
        });
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

  // Memanggil fungsi removeRandomPieces saat dokumen siap
  removeRandomPieces();

  // Fungsi untuk menangani drop kotak drag ke kotak drop
  $(".box").droppable({
    accept: ".box", // Hanya menerima kotak drag
    drop: function (event, ui) {
      var dropZone = $(this);
      var droppedItem = ui.draggable;

      // Memeriksa apakah elemen drag diletakkan di kotak drop yang valid
      if (
        dropZone.children().length > 0 ||
        !isCorrectDrop(dropZone, droppedItem)
      ) {
        // Menampilkan pesan error jika lokasi drop tidak valid
        Swal.fire({
          icon: "error",
          title: "Invalid Drop Location",
          text: "Please drop the item in an empty drop zone or in the correct drop zone.",
        });

        // Mengembalikan elemen drag ke lokasi semula
        droppedItem.draggable("option", "revert", true);
      } else {
        // Jika lokasi drop valid, lanjutkan dengan proses puzzle
        var puzzlePiece = droppedItem.find("img").attr("src");
        dropZone.html(
          '<img src="' +
            puzzlePiece +
            '" alt="Puzzle Piece" style="height: 98px; width: 130px">'
        );
        checkPuzzle(); // Memeriksa puzzle setelah drop
      }
    },
  });

  /// Fungsi untuk memeriksa apakah elemen yang di-drop cocok dengan kotak drop yang sesuai
  function isCorrectDrop(dropZone, droppedItem) {
    // Ambil ID kotak drop
    var dropId = dropZone.attr("id");
  
    // Ambil src dari elemen yang di-drop
    var droppedSrc = droppedItem.find("img").attr("src");
  
    // Loop melalui array removedPieces
    for (var i = 0; i < removedPieces.length; i++) {
      // Jika ID kotak drop dan src dari elemen yang di-drop cocok dengan data yang dihapus sebelumnya
      if (dropId === removedPieces[i].id && droppedSrc === removedPieces[i].src) {
        // Lokasi drop adalah yang benar
        return true;
      }
    }
  
    // Lokasi drop adalah yang salah
    return false;
  }
  


  // Menangani submit formulir
  $("#registration-form").submit(function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir

    if (!captchaCompleted) {
      // Menampilkan pesan error jika CAPTCHA belum diselesaikan
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please complete the CAPTCHA puzzle before submitting the form!",
      });
      return;
    }

    // Mengambil nilai username, email, dan password dari formulir
    var username = $("#username").val();
    var email = $("#email").val();
    var password = $("#password").val();

    // Simpan data registrasi ke local storage (contoh)
    var registrationData = {
      username: username,
      email: email,
      password: password,
    };
    localStorage.setItem("registrationData", JSON.stringify(registrationData));

    // Menampilkan pesan sukses
    Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "You will now be redirected to login page.",
      showConfirmButton: false,
      timer: 2000, // Menutup otomatis setelah 2 detik
      onClose: function () {
        // Mengalihkan ke halaman login setelah pesan ditutup
        window.location.href = "login.html";
      },
    });
  });
});
