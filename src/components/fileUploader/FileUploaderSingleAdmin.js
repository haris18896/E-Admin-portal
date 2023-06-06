/* eslint-disable no-unused-vars */
import React from 'react'

// ** hooks
import useMediaQuery from '@hooks/useMediaQuery'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { FileText, X } from 'react-feather'
import { Card, CardBody, Label } from 'reactstrap'
import classNames from 'classnames'

function FileUploaderSingleAdmin({
  required,
  file,
  onChange,
  error,
  label,
  children,
  url,
  labelClassName
}) {
  const mobile = useMediaQuery('(max-width: 600px)')
  const tablet = useMediaQuery('(max-width: 800px)')
  const largeScreen = useMediaQuery('(min-width: 1500px)')

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    // onDrop: (acceptedFile) => onChange(acceptedFile[0]),
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (accepted, rejected) => {
      if (rejected.length) {
        toast.error('You can only upload image Files!.')
      }
      if (accepted.length) {
        onChange(accepted[0])
      }
    }
  })

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  const uploadFileRenderer = () => {
    return (
      <>
        <div className="d-flex align-items-center">
          {required && <div className="required-dot" />}
          <Label
            className={classNames({
              'pl-10px': true,
              [labelClassName]: labelClassName
            })}
          >
            {label}
          </Label>
        </div>

        <div className="UrlImageHolder text-align-center me-0">
          {url && !file ? (
            <div className="d-flex align-items-center justify-content-start">
              <div className="file-preview">
                <label
                  {...getRootProps()}
                  className="file-preview--image_label"
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    className="contained"
                    alt="Avatar"
                    src={url}
                    height={mobile ? 130 : tablet ? 150 : 208}
                    width={
                      mobile ? 250 : tablet ? 300 : largeScreen ? 400 : 350
                    }
                  />
                </label>
              </div>
            </div>
          ) : (
            <CardBody className="imageUploader white-border">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} disabled accept="image/*" />
                <div className="d-flex align-items-center justify-content-center flex-column">
                  {children}
                  {error && <Label className="mt-1 text-danger">{error}</Label>}
                </div>
              </div>
            </CardBody>
          )}
        </div>
      </>
    )
  }

  const renderFilePreviewer = (file) => {
    if (file && ['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type)) {
      return (
        <label {...getRootProps()} className="file-preview--image_label">
          <img
            className="contained"
            alt={file.name}
            src={URL.createObjectURL(file)}
            height={mobile ? 130 : tablet ? 150 : 208}
            width={mobile ? 250 : tablet ? 300 : 400}
          />
        </label>
      )
    } else {
      return (
        <div className="d-flex align-items-center">
          <FileText size={28} />
          <span className="pl-10px pe-1">{file.name}</span>
          <X className="pointer" onClick={() => onChange(null)} size={25} />
        </div>
      )
    }
    //  else if (['application/pdf'].includes(file?.type)) {
    //   return (
    //     <>
    //       <div className="file-preview--pdfViewer">
    //         <p>{file.name}</p>
    //       </div>
    //     </>
    //   )
    // } else <FileText size={28} />
  }

  return (
    <Card>
      {!file && uploadFileRenderer()}

      {file &&
        (error ||
          !['image/jpeg', 'image/jpg', 'image/png'].includes(file?.type)) &&
        uploadFileRenderer()}

      {file && !error && (
        <>
          <div className="mt-1 d-flex align-items-center justify-content-start">
            <div className="file-preview marginLeftAuto marginRightAuto">
              {renderFilePreviewer(file)}
              {/* for image only */}
              {['image/jpeg', 'image/jpg', 'image/png'].includes(
                file?.type
              ) && (
                <div className="overlay">
                  <div className="text">
                    <div className="file-preview--imageDiv__text--name">
                      <p className="file-name sub-heading-1 mb-0">
                        {file.name}
                      </p>
                      <p className="file-size sub-heading-1 mb-0">
                        {renderFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="icon f-bold">
                    <X size={20} onClick={() => onChange(null)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

export default FileUploaderSingleAdmin
