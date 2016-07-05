function overlayImage(imageUrl) {
  console.log(imageUrl);
}

function set_body_height() {
  var ww = $(window).width();
  var wh = $(window).height();

  $('#overlay-image').attr('style', 'height:' + wh + 'px;');
}

$(document).ready(function() {
  console.log(window.location.pathname);

  if (window.location.pathname !== "/uploads") {
    return;
  }

  $("button[name=uploadLink]").each(function() {
    this.click(function() {
      overlayImage($(this).parent().children("input").first().attr("ng-reflect-model"));
    });
  });

  $('#overlay-tint').hide();
  set_body_height();

  $(window).bind('resize', function() { set_body_height(); });

  $('#overlay-tint').click(function() {
    $('#overlay-image').hide();
    $('#overlay-tint').hide();
  });

  $('.display-image-button').click(function() {
    $.ajax({
      url: "/api/get-file/" + $(this).attr('filename'),
      async: true,
      success: function(responseText) {
        $('#overlay-tint').attr("src", responseText);
        $('#overlay-tint').zIndex = 254;
        $('#overlay-tint').show();
        $('#overlay-image').attr("src", responseText);
        $('#overlay-image').zIndex = 255;
        $('#overlay-image').show();
      }
    });
  });
});

