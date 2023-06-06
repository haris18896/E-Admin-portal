/* eslint-disable no-unused-vars */
import classNames from 'classnames'
import React, { memo } from 'react'
import { FormFeedback, Input, Label } from 'reactstrap'
import PropTypes from 'prop-types'
function FormGroupElement({
  labelClassName,
  label,
  required,
  autoFocus,
  inputType,
  inputName,
  placeholder,
  formikTouched,
  formikError,
  defaultValue,
  formGroupClassName,
  inputClassName,
  style,
  formikTouchedClass,
  formikErrorClass,
  children,
  onChange,
  accept,
  icon,
  helpIcon,
  iconStyle,
  labelExtraClasses,
  backendError,
  prefix,
  prefixClassName,
  ...props
}) {
  return (
    <div className={`mb-1 ${formGroupClassName}`}>
      {label && (
        <div className="d-flex align-items-center form-label">
          {required && <div className="required-dot" />}
          <Label
            className={classNames({
              [labelClassName]: labelClassName,
              [labelExtraClasses]: labelExtraClasses,
              'mb-0 fs-small': true
            })}
            htmlFor={inputName}
          >
            {label}
            {helpIcon}
          </Label>
        </div>
      )}

      {icon && (
        <div
          className={classNames({
            [iconStyle]: iconStyle
          })}
        >
          {icon}
        </div>
      )}

      {prefix && (
        <span
          className={classNames({
            [prefixClassName]: prefixClassName
          })}
        >
          {prefix}
        </span>
      )}

      <Input
      
        autoFocus={autoFocus}
        type={inputType}
        name={inputName || ''}
        style={style}
        // checked={checked}
        id={inputName || ''}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
        accept={accept}
        rows={props.rows}
        className={classNames({
          [inputClassName]: inputClassName,
          'is-invalid':
            (`${formikTouched || formikTouchedClass || ''}` &&
              `${formikError || formikErrorClass || ''}`) ||
            backendError
        })}
        {...props}
      >
        {children}
      </Input>
      {`${formikTouched || ''}` && `${formikError || ''}` ? (
        <FormFeedback className={labelClassName}>{formikError}</FormFeedback>
      ) : null}

      {backendError && (
        <FormFeedback className={labelClassName}>{backendError}</FormFeedback>
      )}
    </div>
  )
}

FormGroupElement.propTypes = {
  labelClassName: PropTypes.string,
  prefix: PropTypes.element,
  prefixClassName: PropTypes.string,
  label: PropTypes.string,
  labelExtraClasses: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  inputType: PropTypes.string,
  inputName: PropTypes.string,
  placeholder: PropTypes.string,
  formikTouched: PropTypes.bool,
  formikError: PropTypes.string,
  backendError: PropTypes.string,
  defaultValue: PropTypes.string,
  style: PropTypes.object,
  formGroupClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  formikTouchedClass: PropTypes.string,
  formikErrorClass: PropTypes.string,
  children: PropTypes.any,
  onChange: PropTypes.func,
  accept: PropTypes.string,
  extraClass: PropTypes.string,
  icon: PropTypes.element,
  helpIcon: PropTypes.element,
  iconStyle: PropTypes.string
}

export default memo(FormGroupElement)
