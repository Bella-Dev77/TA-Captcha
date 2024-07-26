$(document).ready(function() {
    // Fungsi untuk menampilkan captcha secara random
    function showRandomCaptcha() {
        // Sembunyikan semua captcha
        $('#captcha1, #captcha2, #captcha3').hide();

        // Pilih captcha secara random
        var randomIndex = Math.floor(Math.random() * 3) + 1;
        $('#captcha' + randomIndex).show();
    }

    // Tampilkan captcha saat halaman pertama kali dimuat
    showRandomCaptcha();

    // Ganti captcha ketika tombol refresh diklik
    $('#form').on('click', '#refreshCaptcha', function() {
        showRandomCaptcha();
    });
});
