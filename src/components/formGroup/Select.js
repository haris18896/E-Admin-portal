import React, { memo } from 'react'

import Select from 'react-select'
import PropTypes from 'prop-types'
import { Label } from 'reactstrap'
import classNames from "classnames"
import { DropdownIndicator, customStyles } from '@ReactSelectStyles'

function SelectField({
  wd,
  data,
  label,
  header,
  search,
  disabled,
  required,
  helpIcon,
  menuHeight,
  placeholder,
  formikError,
  defaultWidth,
  labelClassName,
  controlMinWidth,
  controlMaxWidth,
  containerZIndex,
  labelExtraClasses,
  ...rest
}) {
  return (
    <>
      {/*{label && <Label className="pl-10px">{label}</Label>}*/}
      {label && (
          <div className="d-flex align-items-center form-label">
            {required && <div className="required-dot" />}
            <Label
                className={classNames({
                  [labelClassName]: labelClassName,
                  [labelExtraClasses]: labelExtraClasses,
                  'mb-0 fs-small pl-10px': true
                })}
            >
              {label}
              {helpIcon}
            </Label>
          </div>
      )}

      <Select
        options={data}
        placeholder={placeholder}
        components={{
          IndicatorSeparator: false,
          DropdownIndicator
        }}
        isSearchable={search}
        isDisabled={disabled}
        getOptionLabel={(e) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {e.icon}
            <span style={{ marginLeft: 5 }}>{e.text || e.label}</span>
          </div>
        )}
        styles={customStyles(
          header,
          wd,
          menuHeight,
          controlMinWidth,
          controlMaxWidth,
          containerZIndex,
          defaultWidth,
          formikError
        )}
        {...rest}
      />
    </>
  )
}

SelectField.propTypes = {
  wd: PropTypes.any,
  menuHeight: PropTypes.string,
  data: PropTypes.array,
  change: PropTypes.func,
  header: PropTypes.bool,
  search: PropTypes.bool,
  value: PropTypes.object,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelExtraClasses: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helpIcon: PropTypes.element,
  controlMinWidth: PropTypes.string,
  controlMaxWidth: PropTypes.string
}

export default memo(SelectField)
