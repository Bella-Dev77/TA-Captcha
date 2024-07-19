$(document).ready(function () {
  // Function to generate random numbers for captcha
  function generateCaptcha() {
    var num1 = Math.floor(Math.random() * 10);
    var num2 = Math.floor(Math.random() * 10);
    var sum = num1 + num2;
    $("#captcha-text").text(sum);
    $("#captcha-text").attr("data-sum", sum);

    var answer1 = Math.floor(Math.random() * sum);
    var answer2 = sum - answer1;
    var answer3 = Math.floor(Math.random() * 20);

    var correctButtonIndex = Math.floor(Math.random() * 4);
    $(".captcha-answer").each(function (index) {
      if (index === correctButtonIndex) {
        $(this).html(
          '<img src="./src/img/palm.png" class="palm" alt="Gambar 1"><span>' +
            sum +
            "</span>"
        );
      } else if (index === (correctButtonIndex + 1) % 4) {
        $(this).html(
          '<img src="./src/img/palm.png" class="palm" alt="Gambar 2"><span>' +
            answer1 +
            "</span>"
        );
      } else if (index === (correctButtonIndex + 2) % 4) {
        $(this).html(
          '<img src="./src/img/palm.png" class="palm" alt="Gambar 3"><span>' +
            answer2 +
            "</span>"
        );
      } else {
        var wrongAnswer = Math.floor(Math.random() * 20);
        while (wrongAnswer === answer1 || wrongAnswer === answer2 || wrongAnswer === sum) {
          wrongAnswer = Math.floor(Math.random() * 20);
        }
        $(this).html(
          '<img src="./src/img/palm.png" class="palm" alt="Gambar 4"><span>' +
            wrongAnswer +
            "</span>"
        );
      }
      $(this).removeClass("btn-success btn-danger");
    });
  }

  // Initialize captcha
  generateCaptcha();

  // Event listener for refresh button
  $("#form").on("click", '.captcha-action[value="Refresh"]', function () {
    generateCaptcha();
    $("#num1").val("");
    $("#num2").val("");
  });

  // Event listener for answer buttons
  $("#form").on("click", ".captcha-answer", function () {
    var answer = parseInt($(this).find("span").text());
    if ($("#num1").val() === "") {
      $("#num1").val(answer);
    } else if ($("#num2").val() === "") {
      $("#num2").val(answer);
    }
  });

  // Form submission validation
  $("#form").submit(function (event) {
    event.preventDefault();
    var inputSum = parseInt($("#num1").val()) + parseInt($("#num2").val());
    var captchaSum = parseInt($("#captcha-text").attr("data-sum"));
    if (inputSum !== captchaSum) {
      Swal.fire({
        icon: "error",
        title: "Captcha tidak valid",
        text: "Silakan coba lagi.",
      }).then(function (result) {
        if (result.isConfirmed) {
          generateCaptcha(); // Generate new captcha if invalid
          $("#num1").val(""); // Reset num1
          $("#num2").val(""); // Reset num2
        }
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Login berhasil!",
        text: "Anda telah berhasil login.",
      });
      setTimeout(function () {
        window.location.href = "home.html";
      }, 2000);
    }
  });
});
