function showRandomCaptcha() {
    // Sembunyikan semua captcha
    $('.captcha').hide();

    // Pilih captcha secara random
    var randomIndex = Math.floor(Math.random() * 3) + 1;
    $('#captcha' + randomIndex).show();
}

$(document).ready(function() {
    // Tampilkan captcha saat halaman pertama kali dimuat
    showRandomCaptcha();

    // Ganti captcha ketika tombol refresh diklik
    $('#refreshCaptcha').click(function() {
        showRandomCaptcha();
    });
});