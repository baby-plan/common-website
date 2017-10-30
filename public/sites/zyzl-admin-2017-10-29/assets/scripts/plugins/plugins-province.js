define(['jquery', 'QDP'], function ($, QDP) {
  "use strict";

  // 平台启动时定义行政区划级联
  // EVENT-ON:layout.started
  QDP.on("layout.started", function () {
    console.info("注册->系统运行后自动注册 - plugins-province");
    $(document).on("change", "select", function (e) {
      if (e.target.id == 'province_code' && $('#city_code').length == 1) {
        var value = e.target.value;
        if ($('#city_code').hasClass('select2-hidden-accessible')) {
          $('#city_code').select2('destroy');
          $('#city_code').empty();
        }

        $.each(QDP.config.dict.city, function (index, item) {
          if (item.parent == value) {
            $('#city_code').append(
              $("<option/>")
                .val(index)
                .text(item.text ? item.text : item)
            );
          }
        });
        $('#city_code').select2(QDP.config.options.select2);
        $('#city_code').val(null).trigger("change");
      }
      else if (e.target.id == 'city_code' && $('#county_code').length == 1) {
        var value = e.target.value;
        if ($('#county_code').hasClass('select2-hidden-accessible')) {
          $('#county_code').select2('destroy');
          $('#county_code').empty();
        }

        $.each(QDP.config.dict.county, function (index, item) {
          if (item.parent == value) {
            $('#county_code').append(
              $("<option/>")
                .val(index)
                .text(item.text ? item.text : item)
            );
          }
        });
        $('#county_code').select2(QDP.config.options.select2);
        $('#county_code').val(null).trigger("change");
      }

    });

  });

});