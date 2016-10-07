$('.list-item').on('click', function() {
  header = $(this);
  sublist = header.next('ul');
  arrow = header.find('.arrow');

  if (sublist.hasClass('active') == false) {
    sublist.css('display', 'block');
    $('.arrow').removeClass('active');
    $('ul').removeClass('active');
    sublist.toggleClass('active');
    arrow.addClass('active');
  } else {
    sublist.removeClass('active');
    arrow.removeClass('active');
  }
});

$('.sublist').on('animationend', function(e) {
  if (e.originalEvent.animationName == 'slideUp')
    $(this).css('display', 'none');
});

$('.arrow').on('animationend', function(e) {
  arrow = $(this);

  if (e.originalEvent.animationName == 'turnDown') {
    arrow.removeClass('fa-chevron-circle-right');
    arrow.addClass('fa-chevron-circle-down');
  } else { 
    arrow.removeClass('fa-chevron-circle-down');
    arrow.addClass('fa-chevron-circle-right');
  }
});