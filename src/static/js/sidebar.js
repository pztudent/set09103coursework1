$(document).ready(function() {
  var newObject = {};
  $(document).on('click', '.header', function() {
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

  $(document).on('animationend', '.sublist',  function(e) {
    if (e.originalEvent.animationName == 'slideUp')
      $(this).css('display', 'none');
  });

  $(document).on('animationend', '.arrow', function(e) {
    arrow = $(this);
    
    if (e.originalEvent.animationName == 'turnDown') {
      arrow.removeClass('fa-chevron-circle-right');
      arrow.addClass('fa-chevron-circle-down');
    } else { 
      arrow.removeClass('fa-chevron-circle-down');
      arrow.addClass('fa-chevron-circle-right');
    }
  });

  $(document).on('click', '#send-genre-form', function(e) {
    e.preventDefault();
    self = $(this);
    self.html('<div class="spinner"></div>');

    var genre = {
      name : $('#genre-name').val()
    }

    $.ajax({
      type: 'POST',
      url: '/admin/genre/',
      data: JSON.stringify(genre),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        self.html('Create');

        if (result.error) {
          showMessage('danger', result.error);
        } else if (result.success) {
          $('#genres-sublist').append(result.success);
          $('#book-genre').append(result.listentry);
          $('#genres-sublist').find('li').last().slideDown();
          $('#new-genre').modal('toggle');
          showMessage('success', 'Genre created successfully');
          $('#genre-name').val('');

        }
      },
      error: function() {
        showMessage('danger', 'Genre cannot be created!');
        self.html('Create');
        $('#new-genre').modal('toggle'); 
      }
    });
  });

  $(document).on('click', '#send-author-form', function(e) {
    e.preventDefault();
    self = $(this);
    self.html('<div class="spinner"></div>');
    
    newObject.first_name = $('#first-name').val();
    newObject.last_name = $('#last-name').val();
    newObject.dob = $('#date-of-birth').val();
    newObject.dod = $('#date-of-dead').val();
    
    $.ajax({
      type: 'POST',
      url: '/admin/author/',
      data: JSON.stringify(newObject),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        self.html('Create');
        newObject = {}
        
        if (result.error) {
          showMessage('danger', result.error);
        } else if (result.success) {
          $('#authors-sublist').append(result.success);
          $('#book-authors').append(result.listentry);
          $('#authors-sublist').find('li').last().slideDown();
          $('#new-author').modal('toggle');
          showMessage('success', 'Author created successfully');
          $('#first-name').val('');
          $('#last-name').val('');
          $('#date-of-birth').val('');
          $('#date-of-dead').val('');
        }
      },
      error: function() {
        showMessage('danger', 'Author cannot be created');
        self.html('Create');
        $('#new-author').modal('toggle'); 
        newObject = {};
      }

    });
  });

  $(document).on('click', '#send-book-form', function(e) {
    e.preventDefault();
    self = $(this);
    self.html('<div class="spinner"></div>');

    newObject.title = $('#book-title').val();
    newObject.publisher = $('#publisher').val();
    newObject.year = $('#book-year').val();
    newObject.genre_id = $('#book-genre').val();
    newObject.pages =  $('#book-pages').val();
    newObject.description = $('#book-description').val();
    newObject.authors = $('#book-authors').val();

    $.ajax({
      type: 'POST',
      url: '/admin/book/',
      data: JSON.stringify(newObject),
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        self.html('Create');
        newObject = {};

        if (result.error) {
          showMessage('danger', result.error);
        } else if (result.success) {
          console.log(window.location.pathname);
          $('#main').html(result.success);
          $('#new-book').modal('toggle');
          showMessage('success', 'Book created successfully.');
          $('#book-title').val('');
          $('#publisher').val('');
          $('#book-year').select2('val', 'All');
          $('#book-genre').select2('val', 'All');
          $('#book-pages').val('');
          $('#book-description').val('');
          $('#book-authors').select2('val', 'All');
        }
      },
      error: function() {
        showMessage('danger', 'Book cannot be created!');
        self.html('Create');
        $('#new-book').modal('toggle'); 
        newObject = {};
      }
        
    });
  });
  
  if (document.location.pathname.indexOf('/genres/') == 0 || document.location.pathname.indexOf('/genres/') == 6) {
    $('#genres').trigger('click');
  } else if (document.location.pathname.indexOf('/authors/') == 0 || document.location.pathname.indexOf('/authors/') == 6) {
    $('#authors').trigger('click');
  }

  $(document).on('click', '#load-file', function(e) {
    e.preventDefault();
    self = $(this);
    self.html('<div class="spinner"></div>');
    
    input = document.getElementById('author-photo'); 

    file = input.files[0];
    
    if (file === undefined) {
      input = document.getElementById('book-cover');
      file = input.files[0]
    }

    fr = new FileReader();
    fr.onload = function() {
      newObject.photo = fr.result
      self.html('Load');
      showMessage('success', 'File loaded successfully');
      input.value = '';
    };
    
    if (file === undefined) {
      self.html('Load');
      showMessage('danger', 'Please select file!');
    } else {
      fr.readAsDataURL(file);
    }
  });

  $('#book-authors').select2({
    placeholder: "Select authors"
  });

  $('#book-genre').select2({
    placeholder: "Select genre",
    allowClear: true,
    minimumResultsForSearch: Infinity
  });

  $('#book-year').select2({
    placeholder: 'Select year',
    allowClear: true,
    minimumResultsForSearch: Infinity
  });

  var showMessage = function(type, message) {
    $('body').append('<div class="alert alert-' + type + ' error active">' + message + '</div>');
    setTimeout(function() {
      $('.error').removeClass('active');
    }, 3000);
  }
});
