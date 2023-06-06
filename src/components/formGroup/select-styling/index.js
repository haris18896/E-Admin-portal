/* eslint-disable no-unused-vars */
import { components } from 'react-select'
import { Icon } from '@iconify/react'
// hooks
import { useSkin } from '@hooks/useSkin'
import useMediaQuery from '@hooks/useMediaQuery'

export const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon icon="bxs:chevron-down" />
    </components.DropdownIndicator>
  )
}

export const customStyles = (
  header,
  wd,
  menuHeight,
  controlMinWidth,
  controlMaxWidth,
  containerZIndex,
  defaultWidth,
  formikError
) => {
  const { skin } = useSkin()
  const small = useMediaQuery('(max-width: 1000px)')
  const minScreen = useMediaQuery('(max-width: 500px)')

  return {
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'

      return { ...provided, opacity, transition }
    },
    container: (provider) => ({
      ...provider,
      position: minScreen ? 'static' : 'relative',
      zIndex: `${containerZIndex}`,
      width: wd && `${wd}`,
      marginLeft: header && '5px',
      marginRight: header && '5px',
      marginBottom: !header && '1rem'
    }),
    input: (provider) => ({
      ...provider,
      margin: header && 0,
      padding: header && 0
    }),
    valueContainer: (provider) => ({
      ...provider,
      padding: !header && '0.587rem 1rem',
      paddingTop: header && 0,
      paddingBottom: header && 0
    }),
    placeholder: (provider) => ({
      ...provider,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    control: (provided, state) => ({
      ...provided,

      minWidth: `${controlMinWidth}`,
      maxWidth: `${controlMaxWidth}`,
      minHeight: header && '30px',
      marginBottom: header && small && '1rem',
      borderWidth: '1px',
      borderColor: formikError
        ? '#ea5455 !important'
        : skin === 'light'
        ? '#d8d6de'
        : '#fefefe',
      fontSize: 13,
      backgroundColor: skin === 'light' ? 'white' : '#323a50',
      outline: 'none',
      borderRadius: '20px',
      padding: '0 0.5rem ',
      boxShadow: state.isFocused ? 0 : 0,
      '&:hover': {
        cursor: 'pointer',
        boxShadow: state.isFocused ? 0 : 0
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: skin === 'light' ? '#6e6b7b' : '#fff'
    }),
    menu: (provided) => ({
      ...provided,
      width: 'fit-content'
    }),
    menuList: (provided) => ({
      ...provided,
      zIndex: '9999 !important',
      margin: '0px 15px',
      maxHeight:menuHeight
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: '25px',
      marginBottom: '5px',
      marginTop: '5px',
      padding: '3px 15px',
      minWidth: !defaultWidth && '170px !important',
      backgroundColor: 'yellow',
      backgroundColor:
        skin === 'light' && state.isSelected
          ? '#fefbf4'
          : state.isSelected && '#0c102a',
      border:
        skin === 'light' && state.isSelected
          ? '1px solid #783e34'
          : state.isSelected && '1px solid #fff',
      color: skin === 'light' ? '#363b40' : 'white',

      // backgroundColor: state.isSelected ? (skin === 'light' ? '#fefbf4' : '#343d55') : 'transparent',
      // border: state.isSelected ? (skin === 'light' ? '1px solid #783e34' : '') : '',
      // color: state.isSelected ? (skin === 'light' ? '#363b40' : 'white') : 'black',

      '&:hover': {
        cursor: 'pointer',
        backgroundColor: skin === 'light' ? '#fefbf4' : '#0c102a'
      }
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: skin === 'light' ? '#783e34' : 'white'
    })
  }
}
