$(document).ready(function () {
  const map = L.map("map").setView(
    [-6.596806975960837, 106.75890007364201],
    10
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.marker([-6.596806975960837, 106.75890007364201])
    .addTo(map)
    .bindPopup("Our Office Location")
    .openPopup();

  // Feature Select Location
  const provinceSelect = $("#province");
  const citySelect = $("#city");

  $.ajax({
    url: `https://dev.farizdotid.com/api/daerahindonesia/provinsi`,
    method: "GET",
    beforeSend: () => {
      provinceSelect.attr("disabled", true);
      console.log("Get Province");
    },
  })
    .done((response) => {
      let provinceOption = "<option disabled selected>Pilih Provinsi</option>";
      response.provinsi.forEach((province) => {
        provinceOption += `
                    <option value="${province.nama}" data-id="${province.id}">${province.nama}</option>
                `;
      });
      provinceSelect.html(provinceOption);
      provinceSelect.removeAttr("disabled");
    })
    .fail((err) => {
      console.log(`Error : ${err}`);
    })
    .always(() => {
      console.log("Province Success");
    });

  provinceSelect.on("change", function () {
    const id_province = $(this).find(":selected").data("id");
    $.ajax({
      url: `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${id_province}`,
      method: "GET",
      beforeSend: () => {
        citySelect.attr("disabled", true);
        citySelect.html("<option disabled selected>Pilih Kota</option>");
        console.log("Get City");
      },
    })
      .done((response) => {
        let cityOption = "<option disabled selected>Pilih Kota</option>";
        response.kota_kabupaten.forEach((city) => {
          cityOption += `
                      <option value="${city.nama}" data-id="${city.id}">${city.nama}</option>
                  `;
        });
        citySelect.html(cityOption);
        citySelect.removeAttr("disabled");
      })
      .fail((err) => {
        console.log(`Error : ${err}`);
      })
      .always(() => {
        console.log("City Success");
      });
  });

  $("form").on("submit", function (e) {
    e.preventDefault();

    const name = $("#name").val();
    const province = $("#province").val();
    const city = $("#city").val();
    const message = $("#message").val();

    const whatsappMessage = `Halo! saya ${name} dari ${city}, ${province}. ${message}`;
    const whatsappURL = `https://wa.me/6285156134923?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappURL, "_blank");
  });
});
