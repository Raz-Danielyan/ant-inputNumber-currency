/* eslint-disable no-nested-ternary */
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const convertPriceFormat = (text = '0.00', isPositive) => {
  const value = String(text);
  const isMinus = !isPositive ? value.includes('-') : false;

  const digit = `${value
    .replace(value[value.length - 4] === '.' && /.$/, '')
    .replace(/([a-zA-Z]|\+|\.|-|,)/g, '')
    .replace(/(^0+(?!$))/g, '')}${
    value.includes('.') ? (value[value.length - 2] === '.' ? '0' : '') : '00'
  }`;

  return `${isMinus ? '-' : ''}${digit.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0}.${
    digit.slice(-2)?.[0] || 0
  }${digit.slice(-1) || 0}`;
};

const InputPrice = ({ isPositive = true, price, form, name, changeField, abc, ...props }) => (
  <FormItem
    name={name}
    getValueFromEvent={e => {
      if (!(e.nativeEvent.inputType === 'deleteContentBackward')) {
        return Number(convertPriceFormat(e.target.value).replace(/,/g, ''));
      }
      return e.target.value;
    }}
  >
    <Input
      prefix={price && '$'}
      text_align={price && 'end'}
      {...props}
      min={0}
      maxLength={18}
      type='search'
      onKeyDown={e => {
        if (!['ArrowLeft', 'ArrowRight', 'Backspace'].includes(e.code)) {
          const element = e.target;
          const caret = element.selectionStart;

          window.requestAnimationFrame(() => {
            const formattedValue = convertPriceFormat(element.value, isPositive);

            element.value = formattedValue;
            element.selectionStart =
              caret === 0 ? 0 : formattedValue[1] === ',' ? caret + 2 : caret + 1;
            element.selectionEnd =
              caret === 0 ? 0 : formattedValue[1] === ',' ? caret + 2 : caret + 1;
          });
        }
      }}
      onBlur={e => {
        const element = e.target;
        window.requestAnimationFrame(() => {
          const formattedValue = convertPriceFormat(element.value, isPositive);
          element.value = formattedValue;
        });
      }}
      onFocus={e => {
        const element = e.target;
        window.requestAnimationFrame(() => {
          const formattedValue = convertPriceFormat(element.value, isPositive);
          const caret = element.selectionStart;
          element.value = formattedValue;
          element.selectionStart = caret + (formattedValue.match(/,/g) || []).length;
          element.selectionEnd = caret + (formattedValue.match(/,/g) || []).length;
        });
      }}
    />
  </FormItem>
);

export default InputPrice;
