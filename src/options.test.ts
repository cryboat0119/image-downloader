import { mockChrome } from './utils';

declare var global: any;

beforeEach(() => {
  localStorage.clear();
  global.$ = require('../lib/jquery-3.5.1.min');
  ($.fn as any).fadeIn = function (duration, fn) {
    setTimeout(duration, fn);
    return this;
  };
  ($.fn as any).fadeOut = function (duration, fn) {
    setTimeout(duration, fn);
    return this;
  };
  document.body.innerHTML = '<main></main>';
});

const checkboxOptions = {
  prop: 'checked',
  values: [true, false],
  trigger($el: JQuery<HTMLElement>, value: any) {
    if (value) {
      $el.trigger('click');
    }
  },
};

const inputOptions = {
  prop: 'value',
  trigger($el: JQuery<HTMLElement>, value: any) {
    $el.val(value);
  },
};

const options = [
  {
    input: '#show_download_confirmation_checkbox',
    key: 'show_download_confirmation',
    ...checkboxOptions,
  },
  {
    input: '#show_download_notification_checkbox',
    key: 'show_download_notification',
    ...checkboxOptions,
  },
  {
    input: '#show_file_renaming_checkbox',
    key: 'show_file_renaming',
    ...checkboxOptions,
  },
  {
    input: '#show_url_filter_checkbox',
    key: 'show_url_filter',
    ...checkboxOptions,
  },
  {
    input: '#show_image_width_filter_checkbox',
    key: 'show_image_width_filter',
    ...checkboxOptions,
  },
  {
    input: '#show_image_height_filter_checkbox',
    key: 'show_image_height_filter',
    ...checkboxOptions,
  },
  {
    input: '#show_only_images_from_links_checkbox',
    key: 'show_only_images_from_links',
    ...checkboxOptions,
  },
  {
    input: '#show_image_url_checkbox',
    key: 'show_image_url',
    ...checkboxOptions,
  },
  {
    input: '#show_open_image_button_checkbox',
    key: 'show_open_image_button',
    ...checkboxOptions,
  },
  {
    input: '#show_download_image_button_checkbox',
    key: 'show_download_image_button',
    ...checkboxOptions,
  },
  {
    input: '#columns_numberbox',
    key: 'columns',
    values: ['1', '2', '3'],
    ...inputOptions,
  },
  {
    input: '#image_min_width_numberbox',
    key: 'image_min_width',
    values: ['100', '200', '300'],
    ...inputOptions,
  },
  {
    input: '#image_max_width_numberbox',
    key: 'image_max_width',
    values: ['200', '400', '600'],
    ...inputOptions,
  },
  {
    input: '#image_border_width_numberbox',
    key: 'image_border_width',
    values: ['1', '2', '3'],
    ...inputOptions,
  },
  {
    input: '#image_border_color_picker',
    key: 'image_border_color',
    values: ['#ff0000', '#00ff00', '#0000ff'],
    ...inputOptions,
  },
];

describe(`initialize control values`, () => {
  options.forEach((option) => {
    option.values.forEach((value) => {
      describe(option.key, () => {
        it(value.toString(), () => {
          localStorage[option.key] = value.toString();
          require('./options');
          expect($(option.input).prop(option.prop)).toBe(value);
        });
      });
    });
  });
});

describe(`save`, () => {
  options.forEach((option) => {
    describe(option.key, () => {
      option.values.forEach((value) => {
        it(value.toString(), () => {
          require('./options');

          option.trigger($(option.input), value);
          $('#save_button').trigger('click');

          expect(localStorage[option.key]).toBe(value.toString());
        });
      });
    });
  });
});

describe(`reset`, () => {
  beforeEach(() => {
    global.chrome = mockChrome();
  });

  options.forEach((option) => {
    describe(option.key, () => {
      option.values.forEach((value) => {
        it(value.toString(), () => {
          require('./defaults');
          require('./options');

          option.trigger($(option.input), value);
          $('#reset_button').trigger('click');
          $('#save_button').trigger('click');

          expect(localStorage[option.key]).toBe(
            localStorage[`${option.key}_default`]
          );
        });
      });
    });
  });
});

describe(`clear data`, () => {
  beforeEach(() => {
    global.chrome = mockChrome();
    global.confirm = () => true;
    delete global.window.location;
    global.window.location = { reload() {} };
  });

  options.forEach((option) => {
    describe(option.key, () => {
      option.values.forEach((value) => {
        it(value.toString(), () => {
          require('./defaults');
          require('./options');

          option.trigger($(option.input), value);
          $('#save_button').trigger('click');
          $('#clear_data_button').trigger('click');

          expect(localStorage[option.key]).toBe(
            localStorage[`${option.key}_default`]
          );
        });
      });
    });
  });
});
