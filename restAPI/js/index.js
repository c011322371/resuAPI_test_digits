var CLASSIFICATION = {
  init: function () {
    this.setParameters();
    this.setting();
    this.bindEvent();
  },
  setParameters: function () {
    this.$form = $('.jscForm');
    this.$file = $('.jscFile');
    this.$submit = $('.jscSubmit');
    this.$label = $('.jscInputFileWrap');
  },
  setting: function () {
    this.$submit.prop('disabled', true);
  },
  bindEvent: function () {
    var self = this;

    this.$file.on('change', $.proxy(function (e) {
      var files = $(e.target)[0].files[0];
      FILE_OBJECT_MANAGER.init(files);
      this.$submit.prop('disabled', false);
    }, this));

    this.$form.on('drop', $.proxy(function (e) {
      e.preventDefault();
      var files = e.originalEvent.dataTransfer.files[0];
      this.$file.get(0).files = e.originalEvent.dataTransfer.files;
      FILE_OBJECT_MANAGER.init(files);
      this.$submit.prop('disabled', false);
      this.$label.removeClass('isDragover');
    }, this));

    this.$form.on('dragover', $.proxy(function (e) {
      e.preventDefault();
      this.$label.addClass('isDragover');
    }, this));

    this.$form.on('dragleave', $.proxy(function () {
      this.$label.removeClass('isDragover');
    }, this));

    this.$form.on('submit', $.proxy(this.getResult, this));
  },
  getResult: function (e) {
    e.preventDefault();
    $('.jscResultText').text("please wait・・・");
    var $submitedForm = $(e.target);
    var formData = new FormData($submitedForm[0]);
    var url = 'http://0.0.0.0:5000/models/images/classification/classify_one';

    $.ajax({
      type: "POST",
      url: 'digits_post.php',
      processData: false,
      contentType: false,
      data: formData,
      dataType: 'json',
      success: function (json) {
        $('.jscResultText').text(json.predictions[0][0] + " : " + json.predictions[0][1] + "%");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log(xhr, textStatus, errorThrown);
        var res = {}
        try {
          res = $.parseJSON(xhr.responseText);
        } catch (e) {
        }
        console.log(res.code || 'パース失敗');
        console.log(res.message || 'パース失敗');
      }
    });
  }
};

var FILE_OBJECT_MANAGER = {
  init: function (files) {
    this.setParameters();
    this.bindEvent(files);
  },
  setParameters: function () {
  },
  bindEvent: function (files) {
    var reader = new FileReader();

    reader.onloadend = function () {
      var result = reader.result;
      $('.jscInputFileWrap').css({ background: 'url(' + result + ') no-repeat center / contain' });
      $('.jscDesc').hide();
    };
    reader.readAsDataURL(files);
    $('.jscFileName').text(files.name);
  }
};

(function () {
  CLASSIFICATION.init();
})();
