$(document).ready(function () {
    var captchaValidated = false; // Variabel untuk menentukan apakah CAPTCHA sudah divalidasi
    var currentCaptcha = null; // Variabel untuk menyimpan CAPTCHA saat ini
  
    // Array of possible colors and letters
    var colors = ["Red", "Green", "Blue", "Yellow"];
    var letters = ["A", "B", "C", "D"];
  
    // Generate a random CAPTCHA code
    function generateCaptcha() {
      var captchaColor = colors[Math.floor(Math.random() * colors.length)];
      var captchaLetter = letters[Math.floor(Math.random() * letters.length)];
      return {
        color: captchaColor,
        letter: captchaLetter,
      };
    }
  
    // Display CAPTCHA text
    function displayCaptcha() {
      currentCaptcha = generateCaptcha(); // Simpan CAPTCHA saat ini
      var captchaBox = $("#captchaBox");
      captchaBox.text(currentCaptcha.letter); // Tampilkan huruf CAPTCHA di dalam kotak
      captchaBox.css("background-color", currentCaptcha.color); // Atur warna latar belakang kotak CAPTCHA
    }
  
    // Validate CAPTCHA
    function validateCaptcha(selectedColor, selectedLetter) {
      captchaValidated = selectedColor.toLowerCase() === currentCaptcha.color.toLowerCase() && selectedLetter === currentCaptcha.letter;
      return captchaValidated;
    }
  
    // Event handler for the answer buttons
    $("#captchaButtons").on("click", "button", function () {
      var selectedColor = $(this).data("color");
      var selectedLetter = $(this).data("letter");
    
      // Validate the CAPTCHA when an answer is selected
      if (validateCaptcha(selectedColor, selectedLetter)) {
        Swal.fire({
          icon: "success",
          title: "CAPTCHA validation successful!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "CAPTCHA validation failed",
          text: "Please try again.",
          timer: 2000,
        }).then(function () {
          // Setelah pesan error ditutup, refresh CAPTCHA
          displayCaptcha();
          generateAnswerButtons(); // Perbarui tombol jawaban
        });
      }
    });
    
  
    // On form submission
    $("#form").submit(function (event) {
      event.preventDefault();
  
      // if (!captchaValidated) { // Periksa apakah CAPTCHA sudah divalidasi
      //   Swal.fire({
      //     icon: "error",
      //     title: "CAPTCHA validation failed",
      //     text: "Please solve the CAPTCHA before submitting the form.",
      //   });
      //   return;
      // }
  
      // Jika CAPTCHA sudah divalidasi, lanjutkan dengan pengiriman formulir
      // Anda dapat menambahkan kode AJAX di sini untuk mengirim data formulir
      Swal.fire({
        icon: "success",
        title: "Form submitted successfully!",
        showConfirmButton: false,
        timer: 1500,
      }).then(function () {
        var currentPage = window.location.pathname;
        if (currentPage === "/index.html" || currentPage === "/") {
          window.location.href = "home.html";
        } else {
          window.location.href = "#";
        }
      });
    });
  
    // Event handler for the refresh button
  $("#refreshCaptcha1").click(function () {
    displayCaptcha(); // Perbarui CAPTCHA
    generateAnswerButtons(); // Perbarui tombol jawaban
  });
  
  
    // Tampilkan CAPTCHA saat halaman dimuat
    displayCaptcha();
  
    // Generate answer buttons
    function generateAnswerButtons() {
      var answers = [currentCaptcha.color + "-" + currentCaptcha.letter];
  
      while (answers.length < 4) {
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        var randomLetter = letters[Math.floor(Math.random() * letters.length)];
        var answer = randomColor + "-" + randomLetter;
        if (!answers.includes(answer)) {
          answers.push(answer);
        }
      }
      answers.sort(() => Math.random() - 0.5); // Acak urutan jawaban
  
      // Hapus tombol sebelumnya
      $("#captchaButtons").empty();
  
      // Buat tombol
      answers.forEach(function (answer) {
        var color = answer.split("-")[0];
        var letter = answer.split("-")[1];
        var button = $("<button>")
          .addClass("btn btn-primary mr-2 mt-2")
          .attr("type", "button")
          .data("color", color) // Atur atribut data warna
          .data("letter", letter) // Atur atribut data huruf
          .text(answer);
        $("#captchaButtons").append(button);
      });
    }
  
    // Generate answer buttons saat halaman dimuat
    generateAnswerButtons();
  });
  