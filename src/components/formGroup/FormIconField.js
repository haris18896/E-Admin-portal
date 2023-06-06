import { Fragment, forwardRef } from 'react'

import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Icon } from '@iconify/react'

import { InputGroup, Input, InputGroupText, Label } from 'reactstrap'

const FormIconField = forwardRef((props, ref) => {
  const {
    label,
    className,
    htmlFor,
    placeholder,
    iconSize,
    inputClassName,
    iconClassName,
    invalid,
    formikTouched,
    formikError,
    formikTouchedClass,
    formikErrorClass,
    color,
    value,
    // onChange,
    iconsName,
    ...rest
  } = props

  const renderIcon = () => {
    const size = iconSize ? iconSize : 14

    return <Icon icon={iconsName} color={color} width={size} height={size} />
  }

  return (
    <Fragment>
      {label ? (
        <Label className="form-label" for={htmlFor}>
          {label}
        </Label>
      ) : null}
      <InputGroup
        className={classnames({
          [className]: className
        })}
      >
        <Input
          ref={ref}
          invalid={invalid}
          name={rest.name}
          type={'text'}
          value={value}
          // onChange={onChange}
          placeholder={placeholder ? placeholder : 'Search...'}
          className={classnames({
            [inputClassName]: inputClassName,
            'is-invalid':
              invalid ||
              (`${formikTouched || formikTouchedClass || ''}` &&
                `${formikError || formikErrorClass || ''}`)
          })}
          /*eslint-disable */
          {...(label && htmlFor
            ? {
                id: htmlFor
              }
            : {})}
          {...rest}
          /*eslint-enable */
        />
        <InputGroupText
          className={classnames({
            pointer: true,
            [iconClassName]: iconClassName
          })}
        >
          {renderIcon()}
        </InputGroupText>
      </InputGroup>
    </Fragment>
  )
})

export default FormIconField

// ** PropTypes
FormIconField.propTypes = {
  invalid: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  placeholder: PropTypes.string,
  iconSize: PropTypes.number,
  formikTouched: PropTypes.bool,
  formikError: PropTypes.string,
  formikTouchedClass: PropTypes.string,
  formikErrorClass: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  // onChange: PropTypes.func,
  iconsName: PropTypes.string,
  label(props, propName) {
    // ** If label is defined and htmlFor is undefined throw error
    if (props[propName] && props['htmlFor'] === 'undefined') {
      throw new Error('htmlFor prop is required when label prop is present')
    }
  },
  htmlFor(props, propName) {
    // ** If htmlFor is defined and label is undefined throw error
    if (props[propName] && props['label'] === 'undefined') {
      throw new Error('label prop is required when htmlFor prop is present')
    }
  }
}
